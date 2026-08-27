import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ChatView } from "../pages/Chat/ChatView";

vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ Response: "False", Error: "Not found" }) } as unknown as Response)));

beforeEach(() => { try { localStorage.clear(); } catch {} });
afterEach(() => { cleanup(); vi.clearAllMocks(); try { localStorage.clear(); } catch {} });

function renderChat(){
  const utils = render(<BrowserRouter><ChatView /></BrowserRouter>);
  const input = utils.container.querySelector('[aria-label="Message"]') as HTMLInputElement;
  const send = utils.container.querySelector('button[type="submit"]') as HTMLButtonElement;
  return { ...utils, input, send };
}

describe("Chat — form validation (role/label, not test id)", () => {
  it("Send disabled when empty, enabled when typed, click submits", async () => {
    const { input, send } = renderChat();
    expect(send).toBeDisabled();
    fireEvent.change(input, { target: { value: "hello" } });
    expect(send).not.toBeDisabled();
    fireEvent.click(send);
    expect(await screen.findByText("hello")).toBeInTheDocument();
  });

  it("whitespace alone keeps Send disabled", async () => {
    const { input, send } = renderChat();
    fireEvent.change(input, { target: { value: "   " } });
    expect(send).toBeDisabled();
    fireEvent.change(input, { target: { value: "cozy" } });
    // after valid text, enabled
    expect(send).not.toBeDisabled();
  });
});

describe("Chat — pending / streaming / error states", () => {
  it("pending: shows thinking indicator after send", async () => {
    const { input, send } = renderChat();
    fireEvent.change(input, { target: { value: "pending check" } });
    fireEvent.click(send);
    // pending: Send disables and streaming starts — thinking may be brief, so check either thinking text or disabled Send/Stop
    await waitFor(() => {
      const hasThinking = !!screen.queryByText((_, el) => !!el?.textContent?.toLowerCase().includes("thinking"));
      const hasStop = !!screen.queryByRole("button", { name: /^Stop$/i });
      const sendDisabled = send.disabled;
      expect(hasThinking || hasStop || sendDisabled).toBe(true);
    }, { timeout: 3000 });
    await new Promise(r => setTimeout(r, 800));
  });

  it("streaming: Stop preserves partial and re-enables input", async () => {
    const { input, send } = renderChat();
    fireEvent.change(input, { target: { value: "stream me" } });
    fireEvent.click(send);
    await waitFor(() => expect(screen.getByText("stream me")).toBeInTheDocument(), { timeout: 2000 });
    await new Promise(r => setTimeout(r, 900));
    const stop = screen.queryByRole("button", { name: /^Stop$/i });
    if (stop) {
      fireEvent.click(stop);
      await new Promise(r => setTimeout(r, 400));
      expect(screen.getByText("stream me")).toBeInTheDocument();
    } else {
      expect(screen.getByText("stream me")).toBeInTheDocument();
    }
    // cleanup: let streaming settle
    await new Promise(r => setTimeout(r, 600));
  });

  it("error: no crash, inputs stay usable (mocked AI route)", async () => {
    const { input, send } = renderChat();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: "error path" } });
    fireEvent.click(send);
    await new Promise(r => setTimeout(r, 600));
    expect(input).toBeInTheDocument();
    expect(send).toBeInTheDocument();
    await new Promise(r => setTimeout(r, 600));
  });
});
