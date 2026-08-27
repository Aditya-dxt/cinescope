import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MovieCard } from "../components/MovieCard/MovieCard";

const m = { imdbID: "tt123", Title: "Dune", Year: "2021", Type: "movie", Poster: "N/A" } as const;

describe("MovieCard", () => {
  it("renders title and year/type", () => {
    render(<MovieCard movie={m as any} />);
    expect(screen.getByText("Dune")).toBeInTheDocument();
    expect(screen.getByText("2021 • movie")).toBeInTheDocument();
  });
  it("shows fallback poster when N/A", () => {
    render(<MovieCard movie={m as any} />);
    const imgs = screen.getAllByAltText("Dune") as HTMLImageElement[];
    expect(imgs[0].src).toContain("placeholder");
  });
  it("calls onFavourite", async () => {
    let called = false;
    const { container } = render(<MovieCard movie={m as any} onFavourite={() => { called = true; }} />);
    (container.querySelector(".btn-fav") as HTMLButtonElement).click();
    expect(called).toBe(true);
  });
});
