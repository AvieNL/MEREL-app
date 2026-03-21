const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 512;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...CORS_HEADERS, 'content-type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      return json({ error: 'ANTHROPIC_API_KEY niet geconfigureerd in Supabase secrets' });
    }

    const { fotos, prompt } = await req.json();

    if (!fotos?.length) {
      return json({ error: 'Geen fotos meegestuurd' });
    }

    const content = [
      ...fotos.map((f: { mediaType: string; data: string }) => ({
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
      return json({ error: `Anthropic API fout (${anthropicResponse.status}): ${err}` });
    }

    const result = await anthropicResponse.json();
    let tekst: string = result?.content?.[0]?.text ?? '{}';

    // Strip markdown code blocks indien aanwezig: ```json ... ``` of ``` ... ```
    tekst = tekst.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

    try {
      return json(JSON.parse(tekst));
    } catch {
      return json({ error: `Ongeldig JSON van AI: ${tekst}` });
    }

  } catch (err) {
    return json({ error: `Interne fout: ${String(err)}` });
  }
});
