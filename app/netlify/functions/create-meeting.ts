import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

interface MeetingRequest {
  prospectName: string;
  prospectEmail?: string;
  companyName?: string;
  meetingDate: string; // ISO 8601
  summary?: string;
  calendarEmail?: string;
  notificationEmail?: string;
}

interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  calendarEmail?: string;
}

async function refreshAccessToken(store: ReturnType<typeof getStore>, tokens: GoogleTokens): Promise<string> {
  // Get client creds
  let clientId = process.env.GOOGLE_CLIENT_ID || '';
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

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

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokens.refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!resp.ok) {
    throw new Error(`Token refresh failed: ${await resp.text()}`);
  }

  const data = await resp.json() as { access_token: string; expires_in: number };

  // Update stored tokens
  await store.setJSON('tokens', {
    ...tokens,
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  });

  return data.access_token;
}

export const handler: Handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  let req: MeetingRequest;
  try {
    req = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }

  if (!req.meetingDate || !req.prospectName) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'meetingDate and prospectName are required' }),
    };
  }

  // Get Google tokens
  const store = getStore('google-oauth');
  let tokens: GoogleTokens | null = null;
  try {
    tokens = await store.get('tokens', { type: 'json' }) as GoogleTokens | null;
  } catch {
    // No tokens stored
  }

  if (!tokens || !tokens.refreshToken) {
    return {
      statusCode: 412,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Google Calendar not connected. Please connect via Settings.' }),
    };
  }

  // Refresh token if expired
  let accessToken = tokens.accessToken;
  if (Date.now() > tokens.expiresAt - 60000) {
    try {
      accessToken = await refreshAccessToken(store, tokens);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Token refresh failed';
      return {
        statusCode: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: msg }),
      };
    }
  }

  // Build calendar event
  const startTime = new Date(req.meetingDate);
  const endTime = new Date(startTime.getTime() + 20 * 60 * 1000); // 20-minute meeting

  const calendarEvent: Record<string, unknown> = {
    summary: `Combined Insurance — ${req.prospectName}${req.companyName ? ` (${req.companyName})` : ''}`,
    description: [
      `Meeting with ${req.prospectName}${req.companyName ? ` from ${req.companyName}` : ''}`,
      '',
      'Scheduled by VoiceIQ AI Cold Calling Agent',
      req.summary ? `\nCall Summary: ${req.summary}` : '',
      '',
      'This is a 20-minute introductory call with a licensed Combined Insurance specialist.',
    ].join('\n'),
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'America/New_York',
    },
    conferenceData: {
      createRequest: {
        requestId: `voiceiq-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 30 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  // Add attendees if we have emails
  const attendees: Array<{ email: string; displayName?: string }> = [];
  if (req.prospectEmail) {
    attendees.push({ email: req.prospectEmail, displayName: req.prospectName });
  }
  if (req.notificationEmail && req.notificationEmail !== (tokens.calendarEmail || req.calendarEmail)) {
    attendees.push({ email: req.notificationEmail });
  }
  if (attendees.length > 0) {
    calendarEvent.attendees = attendees;
  }

  // Create event via Google Calendar API
  try {
    const calResp = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calendarEvent),
      }
    );

    if (!calResp.ok) {
      const errText = await calResp.text();
      return {
        statusCode: calResp.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Calendar API error: ${errText}` }),
      };
    }

    const created = await calResp.json() as {
      id: string;
      htmlLink: string;
      hangoutLink?: string;
      conferenceData?: { entryPoints?: Array<{ uri: string }> };
    };

    const meetLink = created.hangoutLink ||
      created.conferenceData?.entryPoints?.find(ep => ep.uri.includes('meet.google.com'))?.uri ||
      '';

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        eventId: created.id,
        eventLink: created.htmlLink,
        meetLink,
      }),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: msg }),
    };
  }
};
