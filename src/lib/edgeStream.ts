// Vercel Edge Functions must begin sending a response within 25 seconds,
// but may keep streaming for up to 300 seconds after that. Anthropic calls
// for larger generations (e.g. a 15-question quiz) can take 30-45+ seconds,
// which a plain buffered `await` + `Response` blows past. This wraps a slow
// async computation in a stream that starts flowing immediately (a single
// whitespace byte, which JSON.parse ignores as leading whitespace) and sends
// periodic whitespace heartbeats while `work` is still running, then writes
// the real JSON payload as the final chunk once it resolves.
//
// Because the HTTP status is committed the moment the stream starts, this
// always responds 200 — callers must check the parsed body for an `error`
// field instead of relying on `res.ok`.
export function streamingJsonResponse(work: () => Promise<unknown>): Response {
  const encoder = new TextEncoder();
  let settled = false;

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(' '));

      const heartbeat = (async () => {
        while (!settled) {
          await new Promise(resolve => setTimeout(resolve, 10_000));
          if (!settled) controller.enqueue(encoder.encode(' '));
        }
      })();

      let result: unknown;
      try {
        result = await work();
      } catch (err) {
        result = { error: { message: err instanceof Error ? err.message : 'Unknown error.' } };
      }

      settled = true;
      await heartbeat;
      controller.enqueue(encoder.encode(JSON.stringify(result)));
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}
