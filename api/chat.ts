/**
 * Route handler: POST /api/chat
 * Calls Claude via AI SDK streamText (or Anthropic SDK directly) and returns a message stream.
 * Key is server-side only: process.env.ANTHROPIC_API_KEY (Vercel env), never VITE_.
 *
 * FE-07: also defines server-side tools with Zod + execute (see src/tools/movieTools.ts).
 * Deploy target: Vercel Serverless Function (api/chat.ts). Client: src/pages/Chat/ChatView.tsx
 * consumes as SSE via useChat-like hook; tool parts render as typed UI (see ToolCard.tsx).
 *
 * FE-11 hygiene: edge runtime, maxDuration 30s, input caps + rate limit so strangers can't
 * drain API credits. See vercel.json for rewrites.
 */

import { AI_CONFIG } from "../src/config/aiConfig";

export const config = { runtime: "edge" as const };
// Vercel fluid: caps wall time for streaming handlers (FE-11 requirement)
export const maxDuration = 30;
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

// -- tiny in-memory rate limiter (per isolate/region). Resets on cold start — good enough for abuse floor.
// For production scale you'd use Upstash Redis, but this prevents trivial burst draining.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15; // 15 req/min/IP
const BUCKET = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const e = BUCKET.get(ip);
  if (!e || now > e.resetAt) {
    BUCKET.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (e.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((e.resetAt - now) / 1000) };
  }
  e.count += 1;
  return { ok: true };
}

// opportunistic GC: prune expired buckets every 100 hits (avoid unbounded growth)
let _hits = 0;
function gc() {
  if (++_hits % 100 !== 0) return;
  const now = Date.now();
  for (const [k, v] of BUCKET) if (now > v.resetAt) BUCKET.delete(k);
}

function clientIp(req: Request): string {
  // Vercel forwards real IP in x-forwarded-for / x-real-ip
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? h.get("cf-connecting-ip") ?? "unknown";
}

export async function POST(req: Request): Promise<Response> {
  // --- rate limit before any API spend ---
  const ip = clientIp(req);
  gc();
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return new Response(JSON.stringify({ error: `Rate limited — try again in ${rl.retryAfter}s.` }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(rl.retryAfter),
        "Cache-Control": "no-store",
      },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not set on server (set in Vercel → Settings → Environment Variables and redeploy)" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- input caps: strangers can't send 1MB payloads to burn credits ---
  let body: unknown;
  let raw = "";
  try {
    raw = await req.text();
    // body size cap ~ 32k (messages are tiny; larger is abuse)
    if (raw.length > 32_000) {
      return new Response(JSON.stringify({ error: "Payload too large (max 32k)" }), { status: 413 });
    }
    body = raw ? JSON.parse(raw) : null;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  const { messages } = (body as { messages?: ChatMessage[] }) ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required (non-empty array)" }), { status: 400 });
  }
  // FE-11: input caps — max 20 turns, each content capped, total chars capped
  const MAX_TURNS = 20;
  const MAX_CHARS_PER_MSG = 2_000; // matches client ChatView maxLength
  const MAX_TOTAL_CHARS = 12_000;
  if (messages.length > MAX_TURNS) {
    return new Response(JSON.stringify({ error: `Too many messages (max ${MAX_TURNS})` }), { status: 400 });
  }
  let total = 0;
  for (const m of messages) {
    if (!m || typeof m.content !== "string" || !["user", "assistant", "system"].includes(m.role)) {
      return new Response(JSON.stringify({ error: "Each message needs {role:'user'|'assistant'|'system', content:string}" }), { status: 400 });
    }
    if (m.content.length > MAX_CHARS_PER_MSG) {
      return new Response(JSON.stringify({ error: `Message too long (max ${MAX_CHARS_PER_MSG} chars)` }), { status: 400 });
    }
    total += m.content.length;
  }
  if (total > MAX_TOTAL_CHARS) {
    return new Response(JSON.stringify({ error: `Conversation too long (max ${MAX_TOTAL_CHARS} chars total)` }), { status: 400 });
  }
  // trim whitespace-only last message (client already trims, server re-validates)
  const last = messages[messages.length - 1]!;
  if (!last.content.trim()) {
    return new Response(JSON.stringify({ error: "Last message must not be empty" }), { status: 400 });
  }

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      max_tokens: AI_CONFIG.maxTokens,
      system: AI_CONFIG.systemPrompt,
      messages: messages.filter((m) => m.role !== "system").map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  });
  if (!resp.ok || !resp.body) {
    const t = await resp.text().catch(() => "");
    return new Response(JSON.stringify({ error: `Anthropic ${resp.status}: ${t.slice(0, 300)}` }), { status: 502, headers: { "Content-Type": "application/json" } });
  }
  return new Response(resp.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-RateLimit-Limit": String(MAX_PER_WINDOW),
    },
  });
}

export default POST;
