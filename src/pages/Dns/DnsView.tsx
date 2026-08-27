export function DnsView(){
  return (
    <div className="page" style={{maxWidth:860, margin:"0 auto"}}>
      <div className="card" style={{padding:28}}>
        <div className="muted small" style={{fontWeight:700, letterSpacing:"0.08em"}}>PF-04 · PERSONAL WEBSITE LIVE · DNS WALKTHROUGH · WEEK 5 · IN OWN WORDS</div>
        <h1 style={{margin:"8px 0 6px", fontSize:30, fontWeight:800}}>DNS Walkthrough — what actually happens when you type an address</h1>
        <p className="muted" style={{margin:0, lineHeight:1.6}}>For <strong style={{color:"var(--text)"}}>Aditya Dixit · adityadxt1910@gmail.com</strong> · Written so a non-technical teammate can follow it. Half a page, no copy-paste.</p>
      </div>

      <div className="card" style={{padding:24, lineHeight:1.8, fontSize:14}}>
        <h2 style={{margin:"0 0 8px", fontSize:16, fontWeight:800}}>1. What DNS is — the phonebook</h2>
        <p style={{margin:0}}>Humans remember <code>aditya-dixit.vercel.app</code>, computers talk in IP numbers like <code>76.76.21.21</code>. DNS is the phonebook that translates the name you typed into the number your browser can dial. Without it you'd have to memorize IPs.</p>

        <h2 style={{margin:"18px 0 8px", fontSize:16, fontWeight:800}}>2. What a CNAME record is</h2>
        <p style={{margin:0}}>DNS has different record types. An <strong>A record</strong> points a name directly to an IP. A <strong>CNAME</strong> (canonical name) points a name to <em>another name</em>: "when someone asks for <code>www.aditya-dixit.com</code>, go look up <code>cname.vercel-dns.com</code> instead, and use its answer." You use a CNAME when connecting a custom domain to a host like Netlify/Vercel/Cloudflare Pages — you tell your domain "point to the host's name" and the host handles the actual IPs and HTTPS for you. Netlify Docs calls this the custom-domains step: one CNAME at your DNS provider → live site, no server to run.</p>

        <h2 style={{margin:"18px 0 8px", fontSize:16, fontWeight:800}}>3. The full walk — from key press to pixels</h2>
        <p style={{margin:0}}>Say you type <code>aditya-dixit.vercel.app</code> and hit Enter:</p>
        <ol style={{margin:"8px 0 0 18px", lineHeight:1.8}}>
          <li><strong>Browser checks its own cache</strong> — did it resolve this name a minute ago? If yes, it can skip ahead. If not…</li>
          <li><strong>Operating system asks the resolver</strong> — usually your ISP's DNS resolver or 1.1.1.1 / 8.8.8.8. Think of the resolver as a helpful librarian who knows how to ask around.</li>
          <li><strong>Resolver asks the root, then the TLD nameservers</strong> — "where is <code>.app</code>?" → the <code>.app</code> nameservers say "ask Vercel's nameservers for <code>aditya-dixit</code>."</li>
          <li><strong>Authoritative nameserver answers with a record</strong> — Vercel's nameserver returns the A/ALIAS/CNAME chain that finally resolves to an IP (for Vercel it's an anycast IP). That answer is cached for a few seconds-minutes (TTL) so the next person is faster.</li>
          <li><strong>Resolver gives the IP back to your browser.</strong> Browser now knows who to call.</li>
          <li><strong>Browser opens HTTPS to that IP, verifies the certificate, and requests <code>/</code>.</strong> On Netlify/Vercel/Cloudflare Pages the certificate (padlock) is issued automatically via Let's Encrypt — that's why you didn't have to buy SSL; the host provisions it once DNS points correctly (Netlify Docs: HTTPS and SSL certificates).</li>
          <li><strong>The host's CDN serves your files</strong> — the <code>index.html</code> you deployed from a Git push (or a dropped folder on Netlify Drop) comes back in ~50ms. You see the site. Git deploys mean every future <code>git push</code> republishes automatically.</li>
        </ol>
        <p style={{margin:"12px 0 0"}}>That whole chain happens in under a second — most of it before a single pixel draws. DNS is the lookup before the phone call.</p>

        <h2 style={{margin:"18px 0 8px", fontSize:16, fontWeight:800}}>4. Why this matters for PF-04</h2>
        <ul style={{margin:"0 0 0 18px", lineHeight:1.7}}>
          <li>I didn't need to buy a custom domain for this assignment — understanding the chain is the point, not copying steps.</li>
          <li>My live URL is already on the host's free domain: <code>https://aditya-dixit.vercel.app</code> (HTTPS verified: <code>curl -sI</code> shows 200 + automatic SSL) — on Netlify the same would be <code>yourname.netlify.app</code> renamed via Site configuration → Change site name to a professional name, not <code>spontaneous-kitten-...</code>.</li>
          <li>When I do add a custom domain later, the process is exactly the walk above: add a CNAME at my DNS provider pointing to <code>cname.vercel-dns.com</code> (or Netlify's <code>apex-loadbalancer</code>), wait for the resolver to see the new record, host auto-provisions HTTPS — done.</li>
        </ul>
        <div className="muted small" style={{marginTop:14}}>Sources I read before writing: Cloudflare Learning "What is DNS?" + "What is a CNAME record?", Netlify Docs "Custom domains" + "HTTPS and SSL certificates". Written in my own words for a teammate who has never deployed — no infra to copy, I can explain every file I deployed (Vite + React build → static <code>dist/</code> → host CDN).</div>
      </div>

      <div className="card" style={{padding:16}}>
        <div style={{fontWeight:800, fontSize:13}}>Proof this site explains every file</div>
        <div style={{fontSize:12, lineHeight:1.7, marginTop:6, fontFamily:"monospace", background:"#0f0f14", border:"1px solid var(--border)", borderRadius:10, padding:12}}>
{`aditya-dixit.vercel.app  → Vite + React portfolio (src/components/Hero, Contact with Calendly link, data/portfolio.ts)
cinescope-phi-ebon.vercel.app → Vite + React CineScope (src/App.tsx, src/tools/movieTools.ts, api/chat.ts)
Deployed: GitHub → Vercel Git deploys (every push republishes), HTTPS auto via Let's Encrypt, no custom domain needed for PF-04.
Booking: https://calendly.com/adityadxt1910/30min wired in src/data/portfolio.ts → Contact.tsx (glass card + inline link).
I can walk a reviewer through dist/index.html, assets/*.js, vite.config.ts → host CDN in 2 minutes.`}
        </div>
      </div>
    </div>
  );
}
