export const config = { runtime: 'edge' };

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

interface FeedbackRequestBody {
  system:     string;
  messages:   { role: 'user' | 'assistant'; content: string }[];
  max_tokens?: number;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: { message: 'Server is missing ANTHROPIC_API_KEY.' } }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  let body: FeedbackRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: { message: 'Invalid JSON body.' } }), { status: 400 });
  }

  if (!body.system || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(JSON.stringify({ error: { message: 'Missing system or messages.' } }), { status: 400 });
  }

  const anthropicRes = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type':       'application/json',
      'x-api-key':          apiKey,
      'anthropic-version':  '2023-06-01',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: body.max_tokens ?? 1800,
      stream:     true,
      system:     body.system,
      messages:   body.messages,
    }),
  });

  if (!anthropicRes.ok || !anthropicRes.body) {
    const errBody = await anthropicRes.json().catch(() => ({}));
    return new Response(JSON.stringify(errBody), {
      status: anthropicRes.status,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(anthropicRes.body, {
    status: 200,
    headers: {
      'content-type':  'text/event-stream',
      'cache-control': 'no-cache',
    },
  });
}
