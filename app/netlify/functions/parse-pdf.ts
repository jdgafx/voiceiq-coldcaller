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

  try {
    const { data } = JSON.parse(event.body ?? '{}');
    if (!data) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No PDF data provided' }),
      };
    }

    const buffer = Buffer.from(data, 'base64');

    const pdfParse = (await import('pdf-parse')).default;
    const result = await pdfParse(buffer);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: result.text, pages: result.numpages }),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to parse PDF';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: msg }),
    };
  }
};
