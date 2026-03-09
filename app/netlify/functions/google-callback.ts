import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

/**
 * Google OAuth2 callback handler.
 * Receives the auth code from Google, exchanges it for tokens,
 * and stores the refresh token in Netlify Blobs.
 */
export const handler: Handler = async (event) => {
  const code = event.queryStringParameters?.code;
  const calendarEmail = event.queryStringParameters?.state || '';

  if (!code) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body style="background:#0a0a0f;color:#f87171;font-family:system-ui;padding:40px"><h2>Missing authorization code</h2><p>Please try connecting Google again from VoiceIQ Settings.</p></body></html>',
    };
  }

  // Read client credentials from Netlify Blobs (stored by the frontend via save-google-creds)
  const store = getStore('google-oauth');
  let clientId = process.env.GOOGLE_CLIENT_ID || '';
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

  // Try blobs if env vars aren't set
  if (!clientId || !clientSecret) {
    try {
      const creds = await store.get('credentials', { type: 'json' }) as { clientId?: string; clientSecret?: string } | null;
      if (creds) {
        clientId = creds.clientId || clientId;
        clientSecret = creds.clientSecret || clientSecret;
      }
    } catch {
      // Fall through
    }
  }

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: '<html><body style="background:#0a0a0f;color:#f87171;font-family:system-ui;padding:40px"><h2>Google OAuth not configured</h2><p>Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Netlify environment variables, or enter them in VoiceIQ Settings.</p></body></html>',
    };
  }

  // Determine redirect URI — must match what was used in the auth request
  const host = event.headers?.host || 'voiceiq-coldcaller.netlify.app';
  const proto = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${proto}://${host}/api/google-callback`;

  // Exchange code for tokens
  try {
    const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResp.ok) {
      const err = await tokenResp.text();
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'text/html' },
        body: `<html><body style="background:#0a0a0f;color:#f87171;font-family:system-ui;padding:40px"><h2>Token exchange failed</h2><pre>${err}</pre></body></html>`,
      };
    }

    const tokens = await tokenResp.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      token_type: string;
    };

    // Store tokens in Netlify Blobs
    await store.setJSON('tokens', {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || '',
      expiresAt: Date.now() + tokens.expires_in * 1000,
      calendarEmail,
      connectedAt: new Date().toISOString(),
    });

    // Return success page that closes itself and notifies parent
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<!DOCTYPE html>
<html><head><title>Google Connected</title></head>
<body style="background:#0a0a0f;color:#10b981;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">
<div style="text-align:center">
<div style="font-size:48px;margin-bottom:16px">&#10003;</div>
<h2>Google Calendar Connected!</h2>
<p style="color:#64748b">You can close this window and return to VoiceIQ.</p>
<script>
  try { window.opener && window.opener.postMessage({ type: 'google-oauth-success' }, '*'); } catch(e) {}
  setTimeout(() => window.close(), 2000);
</script>
</div>
</body></html>`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html' },
      body: `<html><body style="background:#0a0a0f;color:#f87171;font-family:system-ui;padding:40px"><h2>Error</h2><p>${msg}</p></body></html>`,
    };
  }
};
