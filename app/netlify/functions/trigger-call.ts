import type { Handler } from '@netlify/functions';

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

  let body: { webhookUrl: string; contact: Record<string, string>; testOnly?: boolean };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }

  const { webhookUrl, contact, testOnly } = body;

  if (!webhookUrl) {
    return { statusCode: 400, headers: corsHeaders, body: 'webhookUrl is required' };
  }

  // Test-only mode: verify the webhook URL is reachable without triggering a real call
  if (testOnly) {
    try {
      const resp = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      // Dialora returns 4xx for invalid payload, but the URL is reachable
      const reachable = resp.status < 500;
      return {
        statusCode: reachable ? 200 : 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: reachable, status: resp.status }),
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unreachable';
      return { statusCode: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: false, error: message }) };
    }
  }

  if (!contact?.name || !contact?.phone) {
    return { statusCode: 400, headers: corsHeaders, body: 'contact.name and contact.phone are required' };
  }

  try {
    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });

    const text = await resp.text();
    return {
      statusCode: resp.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: text,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { statusCode: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: message }) };
  }
};
