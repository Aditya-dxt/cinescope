import { useEffect, useRef, useState } from "react";
import { mockStream, mockReply, fetchServerStream } from "../../services/chatService";
import { AI_CONFIG } from "../../config/aiConfig";

type Msg = { id: string; role: "user" | "assistant"; content: string };

export function ChatView() {
  const [messages, setMessages] = useState<Msg[]>(() => {
    try { const raw = localStorage.getItem("cinescope_chat"); return raw ? JSON.parse(raw) as Msg[] : []; } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [thinking, setThinking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);

  // persist + auto-scroll
  useEffect(() => { try { localStorage.setItem("cinescope_chat", JSON.stringify(messages)); } catch {} }, [messages]);

  function onScroll() {
    const el = listRef.current;
    if (!el) return;
    atBottomRef.current = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
  }

  // auto-scroll while streaming if user hasn't scrolled up
  useEffect(() => {
    if (!streaming || !atBottomRef.current) return;
    try { listRef.current?.scrollTo?.({ top: listRef.current.scrollHeight, behavior: "smooth" }); } catch {}
  }, [messages, streaming, thinking]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    const userMsg: Msg = { id: String(Date.now()), role: "user", content: text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setStreaming(true);
    const assistantId = String(Date.now() + 1);
    setMessages(m => [...m, { id: assistantId, role: "assistant", content: "" }]);

    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    const ac = new AbortController();
    abortRef.current = ac;

    // Try server stream first
    const serverStream = await fetchServerStream(history, ac.signal);
    let firstToken = true;
    const append = (tok: string) => {
      if (firstToken) { setThinking(false); firstToken = false; }
      setMessages(prev => prev.map(p => p.id === assistantId ? { ...p, content: p.content + tok } : p));
    };

    try {
      if (serverStream) {
        const reader = serverStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done || ac.signal.aborted) break;
          append(value as unknown as string);
        }
        setThinking(false);
      } else {
        // fallback mock — visibly streams token by token
        setThinking(true);
        await new Promise(r => setTimeout(r, 350)); // thinking indicator handoff
        if (ac.signal.aborted) throw new DOMException("aborted", "AbortError");
        for await (const tok of mockStream(mockReply(text), ac.signal, 22)) {
          append(tok);
        }
      }
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") append(" …");
    } finally {
      setThinking(false);
      setStreaming(false);
      abortRef.current = null;
      // jump to latest affordance if user was scrolled up
    }
  }

  function stop() {
    abortRef.current?.abort();
    setThinking(false);
    setStreaming(false);
  }

  function clear() {
    if (streaming) stop();
    setMessages([]);
    try { localStorage.removeItem("cinescope_chat"); } catch {}
  }

  return (
    <div className="page" style={{maxWidth:900, margin:"0 auto", display:"flex", flexDirection:"column", minHeight:"70vh"}}>
      <div className="card" style={{padding:16}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>FE-06 · STREAMING AI CHAT</div>
        <h1 style={{margin:"6px 0 4px", fontSize:24, fontWeight:800}}>CineScope Chat</h1>
        <p className="muted small" style={{margin:0, lineHeight:1.5}}>Route handler: <code>api/chat.ts</code> (streamText, key server-side) · Component: <code>src/pages/Chat/ChatView.tsx</code> · Config: <code>src/config/aiConfig.ts</code> ({AI_CONFIG.model}) · <a href="/playground" style={{color:"#06b6d4"}}>Playground</a></p>
        <div style={{display:"flex", gap:8, marginTop:10, flexWrap:"wrap"}}>
          <span className="alert" style={{fontSize:11}}>{streaming ? "Streaming…" : "Idle"} {thinking ? "· thinking" : ""}</span>
          <span className="alert" style={{fontSize:11}}>API key server-side only</span>
          <button className="btn-ghost" style={{fontSize:12}} onClick={clear} disabled={streaming && messages.length===0}>Clear chat</button>
        </div>
      </div>

      <div ref={listRef} onScroll={onScroll} style={{flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, padding:"12px 0", maxHeight:"52vh", scrollBehavior:"smooth"}} aria-live="polite">
        {messages.length===0 && <div className="muted small" style={{textAlign:"center", padding:24}}>Start a conversation — try "cozy weekend thriller under 2 hours"</div>}
        {messages.map(m => (
          <div key={m.id} style={{
            alignSelf: m.role==="user" ? "flex-end" : "flex-start",
            maxWidth: "82%", padding:"10px 12px", borderRadius:12,
            background: m.role==="user" ? "#1e293b" : "#12121a",
            border: "1px solid #2a2a3a", color: "white", fontSize:13, lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-word"
          }}>
            <div style={{fontSize:10, opacity:0.6, marginBottom:4}}>{m.role==="user" ? "You" : "CineScope"}</div>
            {m.content || (thinking && m.role==="assistant" ? <span className="muted">thinking…</span> : null)}
          </div>
        ))}
        {thinking && !streaming && <div className="muted small" style={{padding:"0 4px"}}><span style={{display:"inline-block", animation:"pulse 1s infinite"}}>●</span> thinking…</div>}
      </div>

      {!atBottomRef.current && messages.length>2 && (
        <button className="btn-ghost" onClick={() => { try { listRef.current?.scrollTo?.({ top: listRef.current.scrollHeight, behavior:"smooth" }); } catch {} }} style={{alignSelf:"center", fontSize:12, marginBottom:6}}>Jump to latest ↓</button>
      )}

      <form onSubmit={e => { e.preventDefault(); send(); }} style={{display:"flex", gap:8, padding:"10px 0", position:"sticky", bottom:0, background:"var(--bg, #0a0a0f)"}}>
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <input id="chat-input" className="search-input" style={{flex:1}} value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask for a film for this mood…" disabled={streaming} aria-label="Message" />
        {!streaming ? (
          <button type="submit" className="btn-primary" disabled={!input.trim()} style={{minWidth:80}}>Send</button>
        ) : (
          <button type="button" className="btn-ghost" onClick={stop} style={{minWidth:80, borderColor:"#ef4444", color:"#ef4444"}}>Stop</button>
        )}
      </form>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} } @media (prefers-reduced-motion: reduce) { *{ animation:none !important; scroll-behavior:auto !important; } }`}</style>
      <div className="muted small" style={{textAlign:"center"}}>Streams token by token · Stop preserves partial + next send works · Persists in localStorage · Phone-friendly</div>
    </div>
  );
}
