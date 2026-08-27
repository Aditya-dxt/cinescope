/**
 * Route handler: POST /api/chat
 * Calls Claude via AI SDK streamText (or Anthropic SDK directly) and returns a message stream.
 * Key is server-side only: process.env.ANTHROPIC_API_KEY (Vercel env), never VITE_.
 *
 * FE-07: also defines server-side tools with Zod + execute (see src/tools/movieTools.ts).
 * Deploy target: Vercel Serverless Function (api/chat.ts). Client: src/pages/Chat/ChatView.tsx
 * consumes as SSE via useChat-like hook; tool parts render as typed UI (see ToolCard.tsx).
 *
 * AI SDK wiring (when installed):
 *   import { streamText } from "ai"; import { anthropic } from "@ai-sdk/anthropic";
 *   import { lookupMovieSchema, getWatchScoreSchema } from "../src/tools/movieTools";
 *   import { z } from "zod";
 *   return streamText({
 *     model: anthropic(AI_CONFIG.model),
 *     system: AI_CONFIG.systemPrompt,
 *     messages,
 *     tools: {
 *       lookupMovie: { description: "Fetch movie metadata", parameters: lookupMovieSchema, execute: async ({title}) => { ...omdb fetch... } },
 *       getWatchScore: { description: "Score for watchlist", parameters: getWatchScoreSchema, execute: async ({title, vibe}) => ... },
 *     },
 *   }).toDataStreamResponse(); // streams text + typed tool parts (input-streaming → input-available → output-available/error)
 */

import { AI_CONFIG } from "../src/config/aiConfig";
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
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      max_tokens: AI_CONFIG.maxTokens,
      system: AI_CONFIG.systemPrompt,
      messages: messages.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content })),
      stream: true,
      // tools are passed here when using Anthropic API directly — see movieTools.ts for Zod schemas
    }),
  });
  if (!resp.ok || !resp.body) {
    const t = await resp.text().catch(() => "");
    return new Response(JSON.stringify({ error: `Anthropic ${resp.status}: ${t.slice(0, 300)}` }), { status: 502 });
  }
  return new Response(resp.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
export default POST;
