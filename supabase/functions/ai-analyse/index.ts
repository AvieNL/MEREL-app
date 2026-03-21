import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 512;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function ok(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
  });
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return ok({ error: 'Method Not Allowed' });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      return ok({ error: 'ANTHROPIC_API_KEY niet geconfigureerd in Supabase secrets' });
    }

    const { fotos, prompt } = await req.json() as {
      soort: string;
      fotos: Array<{ mediaType: string; data: string }>;
      prompt: string;
    };

    if (!fotos?.length) {
      return ok({ error: 'Geen foto\'s meegestuurd' });
    }

    const content: unknown[] = [
      ...fotos.map(f => ({
        type: 'image',
        source: { type: 'base64', media_type: f.mediaType, data: f.data },
      })),
      { type: 'text', text: prompt },
    ];

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [{ role: 'user', content }],
      }),
    });

    if (!anthropicResponse.ok) {
      const err = await anthropicResponse.text();
      return ok({ error: `Anthropic API fout (${anthropicResponse.status}): ${err}` });
    }

    const result = await anthropicResponse.json();
    const tekst = result?.content?.[0]?.text ?? '{}';

    // Valideer dat het geldige JSON is
    try {
      const parsed = JSON.parse(tekst);
      return ok(parsed);
    } catch {
      return ok({ error: `Ongeldig JSON van AI: ${tekst}` });
    }

  } catch (err) {
    return ok({ error: `Interne fout: ${String(err)}` });
  }
});
