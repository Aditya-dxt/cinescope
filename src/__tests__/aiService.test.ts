import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAiRecommendations } from "../services/aiService";
import type { Movie } from "../types";

const movies: Movie[] = [
  { imdbID: "tt1", Title: "A", Year: "2020", Type: "movie", Poster: "N/A" },
  { imdbID: "tt2", Title: "B", Year: "2021", Type: "movie", Poster: "N/A" },
  { imdbID: "tt3", Title: "C", Year: "2019", Type: "movie", Poster: "N/A" },
  { imdbID: "tt4", Title: "D", Year: "2022", Type: "movie", Poster: "N/A" },
];

describe("aiService", () => {
  beforeEach(() => vi.restoreAllMocks());
  it("fallback without key returns 3 picks from set", async () => {
    const r = await getAiRecommendations(movies, "cozy weekend");
    expect(r.provider).toBe("fallback");
    expect(r.recommendations).toHaveLength(3);
    expect(r.recommendations.every(x => movies.some(m => m.imdbID === x.imdbID))).toBe(true);
    expect(r.insight.length).toBeGreaterThan(10);
  });
  it("throws on empty set", async () => {
    await expect(getAiRecommendations([], "x")).rejects.toThrow();
  });
  it("validates Claude JSON — rejects hallucinated IDs and falls back", async () => {
    // mock fetch to return hallucinated ID
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ content: [{ text: JSON.stringify({ recommendations: [{ imdbID: "tt999", Title: "Fake", Year: "2025", reason: "x", moodFit: "y" }, { imdbID: "tt2", Title: "B", Year: "2021", reason: "x", moodFit: "y" }, { imdbID: "tt3", Title: "C", Year: "2019", reason: "x", moodFit: "y" }], insight: "hi" }) }] }) } as any)));
    // temporarily set key via env hack
    const orig = (import.meta as any).env.VITE_ANTHROPIC_API_KEY;
    (import.meta as any).env.VITE_ANTHROPIC_API_KEY = "sk-test";
    const r = await getAiRecommendations(movies, "test");
    expect(r.recommendations.every(x => movies.some(m => m.imdbID === x.imdbID))).toBe(true);
    (import.meta as any).env.VITE_ANTHROPIC_API_KEY = orig;
  });
});
