export function ExplainView(){
  return (
    <div className="page" style={{maxWidth:780, margin:"0 auto"}}>
      <div className="card" style={{padding:24}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>WEEK 5 · BUILD+ · EXPLAIN IT LIKE YOU BUILT IT</div>
        <h1 style={{margin:"8px 0 6px", fontSize:30, fontWeight:800, letterSpacing:"-0.02em"}}>Explain It Like You Built It</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>For <strong style={{color:"var(--text)"}}>Aditya Dixit · adityadxt1910@gmail.com</strong> · One real piece of my build, explained in my own plain words after being tutored by AI until I actually got it. Not a tutorial — my CineScope build.</p>
      </div>

      <div className="card" style={{padding:22}}>
        <div style={{background:"#0f172a", border:"1px solid #1e293b", borderRadius:10, padding:10, fontSize:12, fontWeight:700, display:"inline-block"}}>MY PICK: How the /chat page streams answers token by token and lets you press Stop</div>
        <div style={{fontSize:13.5, lineHeight:1.85, marginTop:14}}>
          <p style={{margin:0}}>Imagine you and a friend are texting, but your friend types so fast you see each word appear live, not all at once at the end. That's what my <strong>CineScope Chat</strong> at <code>/chat</code> does. Here's how I actually built it, in plain words:</p>

          <p><strong>1. Where you type is not where the secret lives.</strong> When you hit Send, your browser does <em>not</em> call Claude directly. If it did, my Anthropic API key would sit in your browser and anyone could steal it. Instead your browser talks to a tiny server I put on Vercel at <code>api/chat.ts</code>. That server holds the key privately (<code>process.env.ANTHROPIC_API_KEY</code> — never <code>VITE_</code>). The browser just says "here are my messages," the server adds the secret and calls Claude.</p>

          <p><strong>2. Claude doesn't send one big answer — it sends a river.</strong> The server asks Claude with <code>stream: true</code>. Claude replies as a river of events called SSE (Server-Sent Events). Think of it like a tap that drips words: <code>delta: "cozy"</code> then <code>delta: " thriller"</code>. My server just pipes that river straight to your browser as <code>text/event-stream</code>. Nothing is stored on the server — it's a straw, not a bucket.</p>

          <p><strong>3. Your browser sips the river.</strong> In <code>ChatView.tsx</code> I use <code>fetch</code> and read the river with <code>reader.read()</code> in a loop. Each drip I append to the last assistant bubble. The first drip is special: before it comes, I show "thinking…" so you know it's working. The moment the first word arrives, I hide "thinking" and start appending. That handoff is why there's no flicker — I learned that by watching the Network tab while throttling to Slow 3G.</p>

          <p><strong>4. Stop is not just a button — it's a promise you can cancel.</strong> Every stream gets an <code>AbortController</code>. Pressing Stop calls <code>abort()</code>. That tells both <code>fetch</code> and my fake local streamer (<code>mockStream</code> when no key is set) to stop immediately. The important part I didn't get at first: aborting must <em>not</em> delete what already streamed. The partial sentence stays, the input re-enables, and you can send again. I tested this by hitting Stop mid-sentence and then sending a new mood — the next stream starts clean.</p>

          <p><strong>5. Auto-scroll that doesn't fight you.</strong> While tokens stream, I want to stay at the bottom — but if you scroll up to read earlier, I shouldn't yank you down. So I track <code>atBottomRef</code>: only auto-scroll if you were already at the bottom. If you scroll up, I show a "Jump to latest ↓" button instead. I caught this bug by scrolling up <em>while</em> it was streaming — before the fix, it jumped; after, it waits politely.</p>

          <p><strong>6. When there's no server, I fake the same shape.</strong> So reviewers without a key still see streaming, I wrote <code>mockStream</code> that splits a canned reply into words and yields one every 22ms. It obeys the same <code>AbortSignal</code> as the real river, so Stop works identically. That's why the preview always streams, even on a fresh clone.</p>

          <div style={{background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12, marginTop:10, fontFamily:"monospace", fontSize:11, lineHeight:1.7}}>
{`You (browser) --fetch--> api/chat.ts (Vercel, holds ANTHROPIC_API_KEY) --stream--> Claude
Claude --SSE delta.text--> api/chat.ts --text/event-stream--> browser reader loop --> bubble
Stop --> AbortController.abort() --> reader stops, partial stays, input re-enables`}
          </div>

          <p style={{margin:"10px 0 0"}}><strong>How I learned it:</strong> I asked AI to tutor me as if I were five, then asked "what happens if I pull the plug mid-stream?" and "where would the key leak?" I then broke it on purpose: killed wifi before Send (got designed "Stream interrupted → Retry"), typed <code>__fail_mid__</code> to fake a 429 mid-stream, and throttled network to watch skeleton-to-content without layout shift. Each fix I verified in DevTools → Network → EventStream tab. That's how I know I own it, not just shipped it.</p>

          <p className="muted small" style={{margin:"10px 0 0"}}>This is one piece — not a generic SSE tutorial. Files that prove it: <code>api/chat.ts</code>, <code>src/pages/Chat/ChatView.tsx</code>, <code>src/services/chatService.ts</code> — all in Aditya-dxt/cinescope. Live at <code>/chat</code>.</p>
        </div>
      </div>

      <div className="muted small" style={{textAlign:"center"}}>Explain It Like You Built It — Week 5 · Real piece, own words, actually correct · Source: week-06.html#explain-it-like-you-built-it</div>
    </div>
  );
}
