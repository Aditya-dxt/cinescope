import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AiPanel } from "../components/AiPanel/AiPanel";
import type { Movie } from "../types";
import { BrowserRouter } from "react-router-dom";

const movies: Movie[] = [
  { imdbID: "tt1", Title: "Inception", Year: "2010", Type: "movie", Poster: "N/A" },
  { imdbID: "tt2", Title: "Interstellar", Year: "2014", Type: "movie", Poster: "N/A" },
];

describe("AiPanel", () => {
  it("renders and asks AI (fallback)", async () => {
    render(<BrowserRouter><AiPanel movies={movies} /></BrowserRouter>);
    expect(screen.getByText("AI Picks for you")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/late-night/)).toBeInTheDocument();
    const btn = screen.getByText("Ask AI") as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
    btn.click();
    // after click, eventually shows insight (fallback is sync-ish)
    await screen.findByText(/start with/i, undefined, { timeout: 2000 });
    expect(screen.getByText(/— Fallback/)).toBeInTheDocument();
  });
});
