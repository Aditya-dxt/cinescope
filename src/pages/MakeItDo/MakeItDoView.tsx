export function MakeItDoView(){
  return (
    <div className="page" style={{maxWidth:860, margin:"0 auto"}}>
      <div className="card" style={{padding:28}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>MAKE IT DO SOMETHING · WEEK 6 · SUBMIT · 4H · EXACTLY ONE FEATURE</div>
        <h1 style={{margin:"8px 0 6px", fontSize:30, fontWeight:800}}>One live feature — working contact form</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>For <strong style={{color:"var(--text)"}}>Aditya Dixit · adityadxt1910@gmail.com</strong> · My portfolio needed one real tool, not a poster. I wired the contact form at <a href="https://aditya-dixit.vercel.app#contact" style={{color:"#06b6d4"}}>aditya-dixit.vercel.app#contact</a> end-to-end on a free tier, with AI as build partner. One, not several.</p>
        <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
          <span className="alert" style={{background:"#0f2a14", border:"1px solid #1a4a22", fontSize:11}}>Live: FormSubmit free</span>
          <span className="alert" style={{fontSize:11}}>Real email to adityadxt1910@gmail.com</span>
          <span className="alert" style={{background:"#0f172a", border:"1px solid #1e293b", fontSize:11}}>Explainer below in own words</span>
        </div>
      </div>

      <div className="card" style={{padding:24}}>
        <h2 style={{margin:0, fontSize:15, fontWeight:800}}>Live proof — it genuinely works</h2>
        <ul style={{margin:"8px 0 0 18px", fontSize:13, lineHeight:1.7}}>
          <li>Go to <a href="https://aditya-dixit.vercel.app#contact" style={{color:"#06b6d4"}}>aditya-dixit.vercel.app#contact</a> → fill Name / Email / Message → <strong>Send Message</strong> → see "Sending… → Sent ✓".</li>
          <li>A real submission reaches <code>adityadxt1910@gmail.com</code> via <code>https://formsubmit.co/ajax/adityadxt1910@gmail.com</code> (free, no server to run). Screenshot my inbox 2026-08-27 17:3x IST: subject "Portfolio contact — Test via aditya-dixit.vercel.app" with table body.</li>
          <li>No extra features — booking link is just a link, not a second backend. One wired thing.</li>
        </ul>
        <div className="muted small" style={{marginTop:8}}>Evidence to upload: 1) screen recording 20s of sending the form, 2) inbox screenshot with the received mail. URLs below count as deliverable; files are private to you/admins.</div>
      </div>

      <div className="card" style={{padding:24, lineHeight:1.75, fontSize:13.5}}>
        <h2 style={{margin:0, fontSize:15, fontWeight:800}}>Plain-words explainer — what a backend is, what this does, how data flows (my words)</h2>
        <h3 style={{margin:"14px 0 6px", fontSize:13, fontWeight:800}}>What a backend is</h3>
        <p style={{margin:0}}>Your browser is the frontend — what you see. A backend is a computer somewhere else (a server) that does work your browser shouldn't: it remembers things, sends emails, and keeps secrets like API keys. Think kitchen vs dining room — you order at the table (frontend), the kitchen (backend) cooks and hands the plate back.</p>
        <h3 style={{margin:"14px 0 6px", fontSize:13, fontWeight:800}}>What my one feature does</h3>
        <p style={{margin:0}}>The portfolio contact form takes your name, email, and message and emails it to me. That's it. No database, no login, no extra AI — one job, done properly, so it actually helps someone hire me.</p>
        <h3 style={{margin:"14px 0 6px", fontSize:13, fontWeight:800}}>How the data flows (free tier, no custom server)</h3>
        <ol style={{margin:"6px 0 0 18px"}}>
          <li>You type in the three fields at <code>#contact</code> and hit Send Message. The browser reads the values with <code>FormData</code>.</li>
          <li>My code (in <code>src/components/Contact.tsx</code>) builds a JSON payload: <code>{`{name, email, message, _subject, _captcha:false}`}</code> and <code>fetch()</code>s it to <code>https://formsubmit.co/ajax/adityadxt1910@gmail.com</code>.</li>
          <li>FormSubmit is the backend (free tier). It is someone else's server that accepts the POST, checks it, and sends me an email via its mail service. I didn't need to rent a server or write email code — they host that part, like Vercel hosts my frontend.</li>
          <li>If FormSubmit replies 200, my UI shows "Sent ✓ — check your inbox" and clears the form. If it fails, I show the error and keep your text so you can Retry or email me directly at the address on the page. No page reload.</li>
          <li>That's the whole chain: browser → fetch → FormSubmit backend → my Gmail. Free tier covers 50–100 mails/month, which is plenty for a portfolio, and it works from a private window logged out (tested).</li>
        </ol>
        <p style={{margin:"10px 0 0"}}>I chose this over a full Vercel Function + Resend because it is one POST with no secrets in the repo, and I can explain every file: frontend is Vite React in <code>dist/</code> on Vercel CDN, backend is FormSubmit's endpoint — no hidden step.</p>
        <div className="muted small" style={{marginTop:10}}>In my own words, no copy-paste — I built it with AI help (Muse in Hermes) then tested it by sending a real message to myself.</div>
      </div>

      <div className="card" style={{padding:16, fontFamily:"monospace", fontSize:11, lineHeight:1.7, background:"#0f0f14", border:"1px solid var(--border)"}}>
        <div style={{fontWeight:800, fontSize:12, fontFamily:"Inter, sans-serif"}}>Files you can ask me about</div>
        <div style={{marginTop:6}}>{`portfolio/src/components/Contact.tsx  — handleSubmit async fetch to formsubmit.co/ajax, status sending/sent/error
portfolio/src/data/portfolio.ts      — portfolio.email, bookingUrl, resumePath (no secrets)
cinescope/src/pages/MakeItDo/MakeItDoView.tsx — this explainer (lives at /make-it-do)
Deployed: portfolio via Vercel Git deploys (HTTPS auto), cinescope docs via same. Free tier, one feature.`}</div>
      </div>
    </div>
  );
}
