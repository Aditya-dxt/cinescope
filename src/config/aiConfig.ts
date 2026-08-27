/**
 * AI model config — single source of truth for capstone chat.
 * Keep system prompt + model here so FE-07 can extend without touching route handler.
 * Key lives server-side only (api/chat.ts reads ANTHROPIC_API_KEY from env, never VITE_).
 */

export const AI_CONFIG = {
  // Model: cheap, fast, good streaming. Change here and both server + docs update.
  model: "claude-3-5-haiku-20241022" as const,
  maxTokens: 800,
  temperature: 0.7,
  // System prompt for CineScope streaming assistant — scoped to movie help, not generic.
  systemPrompt: `You are CineScope Chat — a concise movie discovery assistant inside CineScope (OMDb + favourites app).

Rules:
- Answer in 3-6 sentences max, friendly, no markdown headings.
- When user asks for picks, suggest from current catalogue if provided; don't invent imdbIDs.
- If asked outside movies, gently steer back: "I can help find a film for that mood."
- No disallowed content, no API keys.

Keep streaming natural — write token by token, no preamble like "Here is...".`,
} as const;

export type AiConfig = typeof AI_CONFIG;
