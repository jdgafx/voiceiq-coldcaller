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

  // Support both nested (direct from Dialora) and flat (from Zapier forward) field formats
  const extractedData = (payload.extracted_data ?? payload.extractedData ?? {}) as Record<string, string>;
  const flat = (key: string) => (extractedData[key] ?? payload[key] ?? '') as string;

  const contactId = (payload.contactId ?? payload.contact_id ?? payload.custom_field_1 ?? '') as string;
  const campaignId = (payload.campaignId ?? payload.campaign_id ?? payload.custom_field_2 ?? '') as string;
  const phone = (payload.phone ?? '') as string;
  const prospectName = flat('customer_name') || (payload.name as string ?? '');
  const email = flat('email') || '';

  // Accept if we have any identifier: contactId, phone, email, or name
  if (!contactId && !phone && !email && !prospectName) {
    return { statusCode: 400, headers: corsHeaders, body: 'contactId, phone, email, or customer_name required' };
  }

  const result = {
    contactId,
    campaignId,
    phone,
    status: (payload.status ?? payload.call_status ?? 'completed') as string,
    duration: (payload.duration ?? payload.call_duration ?? null) as number | null,
    recordingUrl: (payload.recording_url ?? payload.recordingUrl ?? null) as string | null,
    transcript: (payload.transcript ?? payload.transcription ?? null) as string | null,
    leadStatus: (flat('interest_level') || payload.lead_status || payload.outcome || payload.disposition || null) as string | null,
    summary: (flat('call_summary') || payload.summary || null) as string | null,
    receivedAt: new Date().toISOString(),
    prospectName,
    companyName: flat('company_name') || (payload.company as string ?? ''),
    jobTitle: flat('job_title'),
    employeeCount: flat('employee_count'),
    email,
    meetingStart: flat('meeting_date') || flat('meeting_start'),
    meetingEnd: (() => {
      const start = flat('meeting_date') || flat('meeting_start');
      if (!start) return '';
      const d = new Date(start);
      if (isNaN(d.getTime())) return '';
      d.setMinutes(d.getMinutes() + 20);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    })(),
    meetingDescription: flat('meeting_day_description'),
    objections: flat('objections_raised'),
    followUpAction: flat('follow_up_action'),
  };

  try {
    const siteID = process.env.BLOB_SITE_ID ?? process.env.SITE_ID ?? '';
    const token = process.env.BLOB_TOKEN ?? '';
    const store = siteID && token
      ? getStore({ name: 'call-results', siteID, token })
      : getStore('call-results');
    const key = contactId || (phone ? phone.replace(/\D/g, '') : '') || email || `lead-${Date.now()}`;
    await store.setJSON(key, result);

    if (campaignId) {
      const indexKey = `campaign:${campaignId}`;
      const existing = await store.get(indexKey, { type: 'json' }).catch(() => []) as string[];
      const ids = Array.isArray(existing) ? existing : [];
      if (!ids.includes(key)) {
        await store.setJSON(indexKey, [...ids, key]);
      }
    }

    // Note: Zapier receives data directly from Dialora via the Zapier connector,
    // then forwards a copy here for dashboard storage. Zapier handles
    // Google Calendar (with Meet) and Gmail notifications.
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Storage error';
    return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: msg }) };
  }

  return {
    statusCode: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, ...result }),
  };
};
