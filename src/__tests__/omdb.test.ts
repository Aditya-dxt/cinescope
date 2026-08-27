import { describe, it, expect } from "vitest";
import { hasOmdbKey } from "../services/omdbService";

describe("omdbService", () => {
  it("hasOmdbKey returns boolean", () => {
    expect(typeof hasOmdbKey()).toBe("boolean");
  });
});
