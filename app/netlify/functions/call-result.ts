import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Secret',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }

  const contactId = (payload.contactId ?? payload.contact_id ?? payload.custom_field_1 ?? '') as string;
  const campaignId = (payload.campaignId ?? payload.campaign_id ?? payload.custom_field_2 ?? '') as string;
  const phone = (payload.phone ?? '') as string;

  if (!contactId && !phone) {
    return { statusCode: 400, headers: corsHeaders, body: 'contactId or phone required' };
  }

  const result = {
    contactId,
    campaignId,
    phone,
    status: (payload.status ?? payload.call_status ?? 'completed') as string,
    duration: (payload.duration ?? payload.call_duration ?? null) as number | null,
    recordingUrl: (payload.recording_url ?? payload.recordingUrl ?? null) as string | null,
    transcript: (payload.transcript ?? payload.transcription ?? null) as string | null,
    leadStatus: (payload.lead_status ?? payload.outcome ?? payload.disposition ?? null) as string | null,
    summary: (payload.summary ?? payload.call_summary ?? null) as string | null,
    receivedAt: new Date().toISOString(),
  };

  try {
    const store = getStore('call-results');
    const key = contactId || phone.replace(/\D/g, '');
    await store.setJSON(key, result);

    if (campaignId) {
      const indexKey = `campaign:${campaignId}`;
      const existing = await store.get(indexKey, { type: 'json' }).catch(() => []) as string[];
      const ids = Array.isArray(existing) ? existing : [];
      if (!ids.includes(key)) {
        await store.setJSON(indexKey, [...ids, key]);
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Storage error';
    return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: msg }) };
  }

  return {
    statusCode: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true }),
  };
};
