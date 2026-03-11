import type { Handler } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

export const handler: Handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  const params = event.queryStringParameters ?? {};
  const ids = params.ids ? params.ids.split(',').filter(Boolean) : [];
  const campaignId = params.campaignId ?? '';

  const listAll = params.all === 'true';

  if (!listAll && !ids.length && !campaignId) {
    return { statusCode: 400, headers: corsHeaders, body: 'ids, campaignId, or all=true required' };
  }

  try {
    const siteID = process.env.BLOB_SITE_ID ?? process.env.SITE_ID ?? '';
    const token = process.env.BLOB_TOKEN ?? '';
    const store = siteID && token
      ? getStore({ name: 'call-results', siteID, token })
      : getStore('call-results');

    if (listAll) {
      const { blobs } = await store.list();
      const entries = blobs.filter(b => !b.key.startsWith('campaign:'));
      const results = await Promise.all(
        entries.slice(0, 200).map(b => store.get(b.key, { type: 'json' }).catch(() => null))
      );
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(results.filter(Boolean)),
      };
    }

    let lookupIds = [...ids];

    if (campaignId && !lookupIds.length) {
      const indexKey = `campaign:${campaignId}`;
      const indexed = await store.get(indexKey, { type: 'json' }).catch(() => []) as string[];
      lookupIds = Array.isArray(indexed) ? indexed : [];
    }

    const results = await Promise.all(
      lookupIds.map(id => store.get(id, { type: 'json' }).catch(() => null))
    );

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(results.filter(Boolean)),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Storage error';
    return { statusCode: 502, headers: corsHeaders, body: JSON.stringify({ error: msg }) };
  }
};
