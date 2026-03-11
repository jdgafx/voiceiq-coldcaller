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

  // Extract Dialora extracted data fields (from Extract Data JSON config)
  const extractedData = (payload.extracted_data ?? payload.extractedData ?? {}) as Record<string, string>;

  const result = {
    contactId,
    campaignId,
    phone,
    status: (payload.status ?? payload.call_status ?? 'completed') as string,
    duration: (payload.duration ?? payload.call_duration ?? null) as number | null,
    recordingUrl: (payload.recording_url ?? payload.recordingUrl ?? null) as string | null,
    transcript: (payload.transcript ?? payload.transcription ?? null) as string | null,
    leadStatus: (payload.lead_status ?? payload.outcome ?? payload.disposition ?? extractedData.interest_level ?? null) as string | null,
    summary: (payload.summary ?? payload.call_summary ?? extractedData.call_summary ?? null) as string | null,
    receivedAt: new Date().toISOString(),
    // Extended fields from Dialora Extract Data
    prospectName: (extractedData.customer_name ?? payload.name ?? '') as string,
    companyName: (extractedData.company_name ?? payload.company ?? '') as string,
    jobTitle: (extractedData.job_title ?? '') as string,
    employeeCount: (extractedData.employee_count ?? '') as string,
    email: (extractedData.email ?? payload.email ?? '') as string,
    meetingDate: (extractedData.meeting_date ?? '') as string,
    meetingDescription: (extractedData.meeting_day_description ?? '') as string,
    objections: (extractedData.objections_raised ?? '') as string,
    followUpAction: (extractedData.follow_up_action ?? '') as string,
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

    // Forward to Zapier webhook for Google Calendar + Gmail notification
    const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
    if (zapierUrl) {
      try {
        // Calculate meeting_end (+20 min) from meeting_date
        let meetingStart = result.meetingDate;
        let meetingEnd = '';
        if (meetingStart) {
          const startDate = new Date(meetingStart);
          if (!isNaN(startDate.getTime())) {
            meetingEnd = new Date(startDate.getTime() + 20 * 60 * 1000).toISOString().slice(0, 19);
            meetingStart = startDate.toISOString().slice(0, 19);
          }
        }

        await fetch(zapierUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: result.prospectName,
            company_name: result.companyName,
            job_title: result.jobTitle,
            employee_count: result.employeeCount,
            email: result.email,
            interest_level: (result.leadStatus || '').toUpperCase(),
            meeting_start: meetingStart,
            meeting_end: meetingEnd,
            meeting_day_description: result.meetingDescription,
            objections_raised: result.objections,
            call_summary: result.summary,
            follow_up_action: result.followUpAction,
            phone: result.phone,
            recording_url: result.recordingUrl,
          }),
        });
      } catch {
        // Zapier forward failed — not critical, call result is still stored
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
