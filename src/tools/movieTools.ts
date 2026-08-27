/**
 * FE-07 Tool definitions — server-side tools with Zod schema + execute.
 * AI SDK shape: { name, description, schema, execute } consumed by streamText({ tools }).
 * Keep schemas small (mentor tip: every field is hallucination surface).
 */
import { z } from "zod";

export const lookupMovieSchema = z.object({
  title: z.string().min(1).describe("Exact movie title to lookup via OMDb"),
});

export const getWatchScoreSchema = z.object({
  title: z.string().min(1).describe("Movie title to score for watchlist"),
  vibe: z.enum(["cozy", "intense", "fun", "mind-bending"]).describe("Viewer vibe to weight scoring"),
});

export type LookupMovieInput = z.infer<typeof lookupMovieSchema>;
export type GetWatchScoreInput = z.infer<typeof getWatchScoreSchema>;

export type LookupMovieOutput = {
  Title: string; Year: string; Rated?: string; Runtime?: string; Genre?: string; Plot?: string; imdbRating?: string; Poster?: string; Source: "omdb" | "mock";
};

export type GetWatchScoreOutput = {
  title: string; vibe: string; score: number; // 0-10
  breakdown: { story: number; rewatch: number; vibeFit: number };
  verdict: string;
};

// execute functions — server-side only, never bundled with VITE_ key
export async function executeLookupMovie(input: LookupMovieInput): Promise<LookupMovieOutput> {
  // server-side: OMDB key from Vercel env; mock if missing so preview still works
  const omdbKey = (typeof process !== "undefined" && (process.env as unknown as Record<string, string>).VITE_OMDB_API_KEY) || "";
  if (!omdbKey) {
    return { Title: input.title, Year: "2024", Rated: "PG-13", Runtime: "124 min", Genre: "Drama", Plot: "Mock plot for " + input.title + " — connect VITE_OMDB_API_KEY for live OMDb.", imdbRating: "7.4", Poster: "N/A", Source: "mock" };
  }
  const r = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(input.title)}&apikey=${omdbKey}`);
  const j = await r.json() as Record<string, string>;
  if (j.Response === "False") throw new Error(j.Error || "Not found");
  return { Title: j.Title, Year: j.Year, Rated: j.Rated, Runtime: j.Runtime, Genre: j.Genre, Plot: j.Plot, imdbRating: j.imdbRating, Poster: j.Poster, Source: "omdb" };
}

export async function executeGetWatchScore(input: GetWatchScoreInput): Promise<GetWatchScoreOutput> {
  // deterministic scoring so tool is evaluatable without LLM
  const seed = input.title.length + input.vibe.length;
  const story = 6 + (seed % 4); // 6-9
  const rewatch = 5 + ((seed * 2) % 4);
  const vibeFit = input.vibe === "intense" ? 9 : input.vibe === "cozy" ? 7 : 8;
  const score = Math.round((story * 0.4 + rewatch * 0.3 + vibeFit * 0.3) * 10) / 10;
  const verdict = score >= 8 ? "Add to watchlist tonight" : score >= 6.5 ? "Weekend watch" : "Skip unless you love this vibe";
  return { title: input.title, vibe: input.vibe, score, breakdown: { story, rewatch, vibeFit }, verdict };
}

// Tool contracts for README
export const TOOL_CONTRACTS = [
  {
    name: "lookupMovie",
    description: "Fetch movie metadata for a title (OMDb). Used when user asks 'what is …' or chat needs structured card.",
    inputSchema: "z.object({ title: z.string().min(1) })",
    outputShape: "{ Title, Year, Rated, Runtime, Genre, Plot, imdbRating, Poster, Source: 'omdb'|'mock' }",
    errorCases: "Not found → throws Error('Not found'), rendered as error state card",
  },
  {
    name: "getWatchScore",
    description: "Score a movie for watchlist with vibe weighting. Returns score + breakdown for chart.",
    inputSchema: "z.object({ title: z.string(), vibe: z.enum(['cozy','intense','fun','mind-bending']) })",
    outputShape: "{ title, vibe, score: 0-10, breakdown: {story,rewatch,vibeFit}, verdict }",
    errorCases: "Invalid vibe → Zod parse error; missing title → validation error — both render as typed error",
  },
] as const;
