import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlaygroundDialog, PlaygroundTabs, PlaygroundDisclosure } from "../playground/PlaygroundComponents";

describe("Playground a11y", () => {
  it("Dialog renders with role dialog and closes on Esc", async () => {
    let closed = false;
    const { rerender } = render(<PlaygroundDialog open={true} onClose={() => { closed = true; }} title="Test dialog"><button>inside</button></PlaygroundDialog>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closed).toBe(true);
    rerender(<PlaygroundDialog open={false} onClose={() => {}} title="x">y</PlaygroundDialog>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("Tabs arrow keys move active", async () => {
    render(<PlaygroundTabs items={[{id:"a", label:"A", panel:<span>pA</span>},{id:"b", label:"B", panel:<span>pB</span>}]} />);
    const tabA = screen.getByRole("tab", { name: "A" });
    const tabB = screen.getByRole("tab", { name: "B" });
    expect(tabA.getAttribute("aria-selected")).toBe("true");
    tabA.focus();
    fireEvent.keyDown(tabA, { key: "ArrowRight" });
    expect(tabB.getAttribute("aria-selected")).toBe("true");
  });
  it("Disclosure toggles aria-expanded", async () => {
    render(<PlaygroundDisclosure summary="More"><div>hidden content</div></PlaygroundDisclosure>);
    const btn = screen.getByRole("button", { name: /More/ });
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
  });
});
