import type { Handler } from '@netlify/functions';

const HARMONIC_API_BASE = 'https://api.harmonic.ai';

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

  let body: { query: string; limit?: number; apiKey?: string };
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }

  const { query, limit = 50 } = body;
  const apiKey = body.apiKey || process.env.HARMONIC_API_KEY || '';

  if (!query) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'query is required' }),
    };
  }

  if (!apiKey) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Harmonic API key not configured. Add it in Settings or set HARMONIC_API_KEY env var.' }),
    };
  }

  const cap = Math.min(limit, 50);

  try {
    // Search for people matching the query (HR directors, benefits managers, etc.)
    const peopleResp = await fetch(
      `${HARMONIC_API_BASE}/people?q=${encodeURIComponent(query)}&limit=${cap}`,
      {
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!peopleResp.ok) {
      const errText = await peopleResp.text();
      return {
        statusCode: peopleResp.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Harmonic API error: ${peopleResp.status} — ${errText}` }),
      };
    }

    const data = await peopleResp.json();

    // Normalize results into our contact format
    const results = Array.isArray(data) ? data : (data.results || data.data || data.people || []);
    const contacts = results.slice(0, cap).map((person: Record<string, unknown>) => {
      const name = (person.full_name || person.name || `${person.first_name || ''} ${person.last_name || ''}`.trim() || 'Unknown') as string;
      const company = (person.company_name || person.company || (person.experience as Record<string, unknown>[] | undefined)?.[0]?.company_name || '') as string;
      const title = (person.title || person.job_title || (person.experience as Record<string, unknown>[] | undefined)?.[0]?.title || '') as string;
      const email = (person.email || person.work_email || '') as string;
      const phone = (person.phone || person.phone_number || person.mobile_phone || '') as string;
      const linkedin = (person.linkedin_url || person.linkedin || '') as string;
      const location = (person.location || person.city || '') as string;

      return { name, company, title, email, phone, linkedin, location };
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        count: contacts.length,
        contacts,
        raw: results.length > 0 ? Object.keys(results[0]) : [],
      }),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return {
      statusCode: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: msg }),
    };
  }
};
