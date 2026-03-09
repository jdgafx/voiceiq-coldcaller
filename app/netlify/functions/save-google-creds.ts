import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

/**
 * Saves Google OAuth client credentials to Netlify Blobs.
 * Called from the frontend Settings page when the user enters their
 * Google Cloud Console credentials.
 */
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

  let body: { clientId?: string; clientSecret?: string };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }

  if (!body.clientId || !body.clientSecret) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'clientId and clientSecret required' }),
    };
  }

  try {
    const store = getStore('google-oauth');
    await store.setJSON('credentials', {
      clientId: body.clientId,
      clientSecret: body.clientSecret,
      savedAt: new Date().toISOString(),
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Storage error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: msg }),
    };
  }
};
