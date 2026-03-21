import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 512;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  // Preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
  }

  try {
    const { fotos, prompt } = await req.json() as {
      soort: string;
      fotos: Array<{ mediaType: string; data: string }>;
      prompt: string;
    };

    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY niet geconfigureerd' }),
        { status: 500, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } }
      );
    }

    if (!fotos?.length) {
      return new Response(
        JSON.stringify({ error: 'Geen foto\'s meegestuurd' }),
        { status: 400, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } }
      );
    }

    // Bouw de message op: eerst de foto's, dan de tekst-prompt
    const content: unknown[] = [
      ...fotos.map(f => ({
        type: 'image',
        source: {
          type: 'base64',
          media_type: f.mediaType,
          data: f.data,
        },
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
      return new Response(
        JSON.stringify({ error: `Anthropic API fout: ${err}` }),
        { status: 502, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } }
      );
    }

    const result = await anthropicResponse.json();
    const tekst = result?.content?.[0]?.text ?? '{}';

    return new Response(tekst, {
      status: 200,
      headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } }
    );
  }
});
