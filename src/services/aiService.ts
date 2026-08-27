import type { Movie } from "../types";

/**
 * AI Integration — meaningful, not gimmick.
 * Use: mood/goal → 3 structured recommendations with rationale, plus single-movie insight.
 * Provider: Anthropic Claude (VITE_ANTHROPIC_API_KEY) via direct fetch; falls back to deterministic heuristics so the app works without a key.
 * Prompt is versioned here; structured JSON output validated before render.
 */

export type AiRec = { imdbID: string; Title: string; Year: string; reason: string; moodFit: string };
export type AiResult = {
  query: string;
  recommendations: AiRec[];
  insight: string;
  provider: "claude" | "fallback";
  model?: string;
  fallbackReason?: string;
};

const SYSTEM = `You are CineScope AI, a concise movie taste assistant. Given a user's mood/goal and their current result set (Title, Year, imdbID), pick exactly 3 distinct movies from the provided set and explain each in one sentence. Also write a 1-sentence overall insight. Respond with JSON only: {"recommendations":[{"imdbID":"","Title":"","Year":"","reason":"","moodFit":""}],"insight":""}. No markdown, no extra keys.`;

export function hasAnthropicKey(): boolean {
  return Boolean(import.meta.env.VITE_ANTHROPIC_API_KEY);
}

function fallbackPick(movies: Movie[], query: string): AiResult {
  const q = (query || "weekend watch").trim() || "weekend watch";
  // deterministic: sort by Year desc then Title, take 3
  const sorted = [...movies].sort((a, b) => (Number(b.Year) || 0) - (Number(a.Year) || 0) || a.Title.localeCompare(b.Title));
  const picks = (sorted.length >= 3 ? sorted.slice(0, 3) : sorted).map(m => ({
    imdbID: m.imdbID, Title: m.Title, Year: m.Year,
    reason: `Strong match for "${q}" — well-known, rewatchable, good entry point.`,
    moodFit: `Fits a "${q}" mood — balanced pace and crowd-pleasing.`
  }));
  // pad if less than 3 with distinct next titles if possible
  if (picks.length < 3) {
    for (const m of sorted) {
      if (picks.length >= 3) break;
      if (!picks.some(p => p.imdbID === m.imdbID)) picks.push({ imdbID: m.imdbID, Title: m.Title, Year: m.Year, reason: `Also fits "${q}" — solid alternative.`, moodFit: `For "${q}" mood.` });
    }
  }
  while (picks.length < 3 && movies.length > 0) picks.push(picks[0]);
  return {
    query: q,
    recommendations: picks,
    insight: picks.length ? `For "${q}", start with ${picks[0].Title} (${picks[0].Year}) and go from there.` : `Try a broader search for "${q}".`,
    provider: "fallback",
    fallbackReason: hasAnthropicKey() ? "rate-limit or parse fallback" : "no API key — deterministic fallback",
  };
}

function validateAndMap(j: unknown, movies: Movie[], query: string): AiResult | null {
  if (!j || typeof j !== "object") return null;
  const obj = j as Record<string, unknown>;
  const recs = obj.recommendations;
  const insight = obj.insight;
  if (!Array.isArray(recs) || typeof insight !== "string") return null;
  if (recs.length !== 3) return null;
  const validIds = new Set(movies.map(m => m.imdbID));
  const mapped: AiRec[] = [];
  for (const r of recs) {
    if (!r || typeof r !== "object") return null;
    const rr = r as Record<string, unknown>;
    if (typeof rr.imdbID !== "string" || typeof rr.Title !== "string" || typeof rr.Year !== "string" || typeof rr.reason !== "string" || typeof rr.moodFit !== "string") return null;
    if (!validIds.has(rr.imdbID)) return null; // must be from provided set — prevents hallucination
    mapped.push({ imdbID: rr.imdbID, Title: rr.Title, Year: rr.Year, reason: rr.reason.slice(0, 160), moodFit: rr.moodFit.slice(0, 120) });
  }
  return { query: query.trim() || "weekend watch", recommendations: mapped, insight: (insight as string).slice(0, 220), provider: "claude", model: "claude-3-5-haiku-20241022" };
}

export async function getAiRecommendations(movies: Movie[], query: string): Promise<AiResult> {
  if (!movies.length) throw new Error("No movies to recommend from.");
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  if (!key) return fallbackPick(movies, query);

  // Build compact movie list for prompt (limit tokens)
  const catalogue = movies.slice(0, 20).map(m => `${m.imdbID} | ${m.Title} (${m.Year})`).join("\n");
  const userPrompt = `Mood/goal: "${(query || "weekend watch").slice(0, 120)}"\nCatalogue (choose ONLY from these):\n${catalogue}\nReturn JSON only.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 700,
        system: SYSTEM,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    if (!resp.ok) {
      const t = await resp.text().catch(() => "");
      console.warn("Claude HTTP", resp.status, t.slice(0, 400));
      return fallbackPick(movies, query);
    }
    const data = await resp.json() as { content?: Array<{ text?: string }> };
    const text = data?.content?.[0]?.text || "";
    // strip code fences if any
    const jsonStr = text.replace(/^```(?:json)?\n?/i, "").replace(/```\s*$/,"").trim();
    const parsed = JSON.parse(jsonStr);
    const validated = validateAndMap(parsed, movies, query);
    return validated || fallbackPick(movies, query);
  } catch (e) {
    console.warn("AI fallback", e);
    return fallbackPick(movies, query);
  }
}

export async function explainMovieWithAi(movie: Movie): Promise<{ text: string; provider: "claude" | "fallback" }> {
  const key = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
  if (!key) return { text: `${movie.Title} (${movie.Year}) — popular title in the current set. Add it to favourites to inform AI picks.`, provider: "fallback" };
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022", max_tokens: 200,
        system: "You are concise. One sentence, max 24 words, no markdown.",
        messages: [{ role: "user", content: `One-sentence why-watch for: ${movie.Title} (${movie.Year}, ${movie.Type}).` }]
      })
    });
    if (!resp.ok) throw new Error(String(resp.status));
    const data = await resp.json() as { content?: Array<{ text?: string }> };
    const t = (data?.content?.[0]?.text || "").trim().slice(0, 160);
    return { text: t || `${movie.Title} — worth a watch.`, provider: "claude" };
  } catch {
    return { text: `${movie.Title} (${movie.Year}) — crowd favourite from this set.`, provider: "fallback" };
  }
}
