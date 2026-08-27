/**
 * Mock streaming for preview without server key.
 * Splits text into tokens and yields with delay, obeying AbortSignal for stop button.
 */
export async function* mockStream(text: string, signal?: AbortSignal, delayMs = 24) {
  const tokens = text.split(/(\s+)/); // keep spaces as tokens for natural stream
  for (const tok of tokens) {
    if (signal?.aborted) break;
    // eslint-disable-next-line no-await-in-loop
    await new Promise(r => setTimeout(r, delayMs));
    if (signal?.aborted) break;
    yield tok;
  }
}

export function mockReply(user: string): string {
  const u = user.toLowerCase();
  if (u.includes("thriller") || u.includes("scary")) return "For a late-night thriller, try a tight 100-minute film with one location and rising tension — Inception or a similar mind-bender from your current results keeps you guessing without gore. Want a lighter alternative too?";
  if (u.includes("cozy") || u.includes("family")) return "Cozy weekend pick: go warm and uplifting with a strong cast and satisfying ending — something from your top 20 with a 2010s feel replays well. I can narrow to 3 from your current grid if you say the mood.";
  if (u.includes("comedy") || u.includes("funny")) return "Light and funny: pick a brisk comedy with a clear premise and rewatchable dialogue — your catalogue has a few that fit. Tell me runtime and I will rank 3.";
  return `Great — for "${user.slice(0, 80)}", I would start with one crowd-pleaser from your current 20, then branch by director. Ask me to rank 3 from the grid and I will stream the picks with reasons.`;
}

// Try server stream first, fall back to mock on 500/404
export async function fetchServerStream(messages: { role: string; content: string }[], signal?: AbortSignal): Promise<ReadableStream<string> | null> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    });
    if (!res.ok || !res.body) return null;
    // Parse Anthropic SSE: data: {"type":"content_block_delta","delta":{"text":"..."}}
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    return new ReadableStream<string>({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) { controller.close(); return; }
        const chunk = decoder.decode(value, { stream: true });
        // extract delta.text from SSE lines
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const json = line.slice(5).trim();
          if (json === "[DONE]") continue;
          try {
            const obj = JSON.parse(json);
            const t = obj?.delta?.text || obj?.content?.[0]?.text || "";
            if (t) controller.enqueue(t);
          } catch { /* ignore */ }
        }
      },
      cancel() { reader.cancel(); },
    });
  } catch {
    return null;
  }
}
