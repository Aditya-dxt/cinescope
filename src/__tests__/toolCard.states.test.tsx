import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolPartView } from "../components/ToolCard/ToolCard";

describe("ToolCard — 4 tool states distinct (not JSON dump)", () => {
  it("input-streaming shows dashed + pulse", () => {
    render(<ToolPartView part={{ tool: "lookupMovie", state: "input-streaming", input: { title: "In" } } as unknown as Parameters<typeof ToolPartView>[0]["part"]} />);
    expect(screen.getByText(/resolving input/i)).toBeInTheDocument();
    expect(screen.getByText(/what is it doing/i)).toBeInTheDocument();
  });
  it("input-available shows JSON input and blue header", () => {
    render(<ToolPartView part={{ tool: "lookupMovie", state: "input-available", input: { title: "Inception" } }} />);
    expect(screen.getByText(/input ready/i)).toBeInTheDocument();
    expect(screen.getByText(/Inception/)).toBeInTheDocument();
  });
  it("output-error shows alert role, not crash", () => {
    render(<ToolPartView part={{ tool: "lookupMovie", state: "output-error", input: { title: "X" }, error: "Not found" } as unknown as Parameters<typeof ToolPartView>[0]["part"]} />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/failed — not a crash/i)).toBeInTheDocument();
  });
  it("output-available renders as card + chart, not text blob (lookupMovie)", () => {
    render(<ToolPartView part={{ tool: "lookupMovie", state: "output-available", input: { title: "Inception" }, output: { Title: "Inception", Year: "2010", Rated: "PG-13", Runtime: "148 min", Genre: "Sci-Fi", Plot: "Mock plot.", imdbRating: "8.8", Poster: "N/A", Source: "mock" } } as unknown as Parameters<typeof ToolPartView>[0]["part"]} />);
    expect(screen.getAllByText(/Inception/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/mock/)[0]).toBeInTheDocument();
  });
  it("output-available getWatchScore shows score + verdict", () => {
    render(<ToolPartView part={{ tool: "getWatchScore", state: "output-available", input: { title: "Dune", vibe: "cozy" }, output: { title: "Dune", vibe: "cozy", score: 7.2, breakdown: { story: 7, rewatch: 6, vibeFit: 8 }, verdict: "Worth a watch" } } as unknown as Parameters<typeof ToolPartView>[0]["part"]} />);
    expect(screen.getByText(/Worth a watch/)).toBeInTheDocument();
    expect(screen.getByText(/7\.2/)).toBeInTheDocument();
  });
});
