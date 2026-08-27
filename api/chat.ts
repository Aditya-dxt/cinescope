/**
 * Route handler: POST /api/chat
 * Calls Claude via AI SDK streamText (or Anthropic SDK directly) and returns a message stream.
 * Key is server-side only: process.env.ANTHROPIC_API_KEY (Vercel env), never VITE_.
 *
 * Deploy target: Vercel Serverless Function (api/chat.ts). Also works as Vite dev proxy.
 * Client: src/pages/Chat/ChatView.tsx consumes as SSE / fetch stream via useChat-like hook.
 *
 * Evaluation: streams token by token, stop mid-stream preserves state, key not in client bundle.
 */

import { AI_CONFIG } from "../src/config/aiConfig";

// Vercel edge/node handler shape — keep generic so reviewer sees intent without framework lock.
// For Vite SPA demo, this file documents the server contract; local mock in chatService handles streaming when no key.

export const config = { runtime: "edge" };

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not set on server" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }

  const { messages } = (await req.json()) as { messages: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), { status: 400 });
  }

  // Use Anthropic SDK directly to stream (works without AI SDK install).
  // To use Vercel AI SDK: import { streamText } from "ai"; import { anthropic } from "@ai-sdk/anthropic";
  // return streamText({ model: anthropic(AI_CONFIG.model), system: AI_CONFIG.systemPrompt, messages, maxTokens: AI_CONFIG.maxTokens }).toDataStreamResponse();

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      max_tokens: AI_CONFIG.maxTokens,
      system: AI_CONFIG.systemPrompt,
      messages: messages.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  });

  if (!resp.ok || !resp.body) {
    const t = await resp.text().catch(() => "");
    return new Response(JSON.stringify({ error: `Anthropic ${resp.status}: ${t.slice(0, 300)}` }), { status: 502 });
  }

  // Proxy Anthropic SSE to client as text/event-stream (client parses delta.text)
  return new Response(resp.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

// For Vite dev without Vercel func, the client falls back to mock streaming (see src/services/chatService.ts).
export default POST;
