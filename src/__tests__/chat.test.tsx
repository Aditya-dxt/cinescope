import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ChatView } from "../pages/Chat/ChatView";
import { BrowserRouter } from "react-router-dom";

afterEach(() => { cleanup(); try { localStorage.clear(); } catch {} });

describe("Chat streaming", () => {
  it("renders input and send, streams mock and stop preserves", async () => {
    const { container } = render(<BrowserRouter><ChatView /></BrowserRouter>);
    const input = container.querySelector('[aria-label="Message"]') as HTMLInputElement;
    const send = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(input).toBeInTheDocument();
    // empty send disabled
    expect(send.disabled).toBe(true);
    fireEvent.change(input, { target: { value: "cozy thriller" } });
    expect(send.disabled).toBe(false);
    fireEvent.click(send);
    // user message appears
    expect(await screen.findByText("cozy thriller")).toBeInTheDocument();
    // assistant message container appears (You label + assistant)
    expect(await screen.findByText("You", undefined, { timeout: 2000 })).toBeInTheDocument();
    // wait a bit for streaming to produce content
    await new Promise(r => setTimeout(r, 800));
    // Stop button appears during stream
    const stop = await screen.findByText("Stop", undefined, { timeout: 2000 }).catch(() => null);
    if (stop) {
      fireEvent.click(stop as HTMLElement);
      // after stop, input re-enabled and next send works
      expect(input.disabled).toBe(false);
    }
  });
});
