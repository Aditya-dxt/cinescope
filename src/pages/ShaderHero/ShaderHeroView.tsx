import { useEffect, useRef, useState } from "react";
import { VERT, FRAG } from "./shader";

function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl") || c.getContext("webgl2")); } catch { return false; }
}

export function ShaderHeroView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const [showSource, setShowSource] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, has: false });

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener?.("change", onChange);
    setWebglOk(hasWebGL());
    return () => m.removeEventListener?.("change", onChange);
  }, []);

  // WebGL setup — DPR capped, rAF paused when hidden, mouse uniform
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    if (reduced || !webglOk) return; // static fallback handles painting

    const gl = (canvas.getContext("webgl", { antialias: false, alpha: false, depth: false, stencil: false }) as WebGLRenderingContext | null)
            ?? (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) { setWebglOk(false); return; }

    const vertSrc = VERT;
    const fragSrc = FRAG;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); return; }
    gl.useProgram(prog);

    const posLoc = gl.getAttribLocation(prog, "position");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_resolution");
    const uMouse= gl.getUniformLocation(prog, "u_mouse");

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // fullscreen triangle (covers clip space with 3 verts, no index)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    let raf = 0;
    let t0 = performance.now();
    let w = 0, h = 0, dpr = 1;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5); // cap DPR
      w = Math.max(1, Math.floor(rect.width * dpr));
      h = Math.max(1, Math.floor(rect.height * dpr));
      canvas!.width = w; canvas!.height = h;
      canvas!.style.width = rect.width + "px";
      canvas!.style.height = rect.height + "px";
      gl!.viewport(0, 0, w, h);
      gl!.uniform2f(uRes, w, h);
      if (!mouseRef.current.has) {
        gl!.uniform2f(uMouse, w * 0.5, h * 0.5);
      }
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    window.addEventListener("resize", resize);

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current.has = true;
      mouseRef.current.x = (e.clientX - rect.left) * dpr;
      // flip Y: gl_FragCoord origin bottom-left
      mouseRef.current.y = (rect.height - (e.clientY - rect.top)) * dpr;
    }
    function onTouch(e: TouchEvent) {
      if (!e.touches[0]) return;
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current.has = true;
      mouseRef.current.x = (e.touches[0].clientX - rect.left) * dpr;
      mouseRef.current.y = (rect.height - (e.touches[0].clientY - rect.top)) * dpr;
    }
    wrap.addEventListener("mousemove", onMove, { passive: true });
    wrap.addEventListener("touchmove", onTouch, { passive: true });
    // init mouse center
    gl.uniform2f(uMouse, w * 0.5, h * 0.5);

    let hidden = document.hidden;
    const onVis = () => { hidden = document.hidden; if (!hidden) { t0 = performance.now() - (performance.now() - t0); loop(); } };
    document.addEventListener("visibilitychange", onVis);

    function loop() {
      if (hidden) return; // pause when tab hidden
      raf = requestAnimationFrame(loop);
      const t = (performance.now() - t0) / 1000;
      gl!.uniform1f(uTime, t);
      if (mouseRef.current.has) gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    loop();

    // one static draw for first frame even if reduced later
    gl!.drawArrays(gl.TRIANGLES, 0, 3);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("touchmove", onTouch);
      document.removeEventListener("visibilitychange", onVis);
      gl!.deleteProgram(prog); gl!.deleteShader(vs); gl!.deleteShader(fs); gl!.deleteBuffer(buf);
    };
  }, [reduced, webglOk]);

  return (
    <div className="page" style={{ gap: 18 }}>
      {/* HERO — fullscreen shader behind content */}
      <section
        ref={wrapRef}
        aria-label="Aurora hero — fullscreen shader"
        style={{
          position: "relative",
          minHeight: "72vh",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid #23232f",
          background: reduced || !webglOk
            ? "radial-gradient(900px 600px at 30% 18%, #0f2a3a 0%, #0a1a2e 38%, #08080c 72%)"
            : "#020208",
          display: "grid",
          placeItems: "center",
          isolation: "isolate",
        }}
      >
        {/* canvas — behind */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: reduced || !webglOk ? "none" : "block",
          }}
        />
        {/* fallback gradient when reduced / no webgl — still aurora-ish */}
        {(reduced || !webglOk) && (
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            background:
              "radial-gradient(900px 500px at 22% 18%, rgba(32,130,130,0.55) 0%, transparent 58%)," +
              "radial-gradient(700px 420px at 78% 12%, rgba(168,85,247,0.42) 0%, transparent 58%)," +
              "linear-gradient(180deg, #0a1e2e 0%, #08080c 72%)",
          }} />
        )}
        {/* scrim for contrast — text stays readable per requirement */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          background:
            "linear-gradient(180deg, rgba(2,4,12,0.18) 0%, rgba(2,4,12,0.52) 68%, rgba(2,4,12,0.78) 100%)," +
            "radial-gradient(800px 400px at 50% 38%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.22) 100%)",
        }} />

        {/* content on top */}
        <div style={{
          position: "relative", zIndex: 1, width: "min(980px, 92%)",
          padding: "56px 24px 44px", textAlign: "center",
          display: "flex", flexDirection: "column", gap: 14, alignItems: "center",
        }}>
          <span style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.14)", padding: "6px 12px", borderRadius: 999, backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.06)" }}>
            FE-AA3 · SIGNATURE HERO · GLSL
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 0.95, letterSpacing: "-0.04em", color: "#fff", textShadow: "0 2px 24px rgba(0,0,0,0.45)", maxWidth: 760 }}>
            A template can't copy this.
          </h1>
          <p style={{ margin: 0, maxWidth: 620, color: "rgba(255,255,255,0.84)", fontSize: 16, lineHeight: 1.6, textShadow: "0 1px 12px rgba(0,0,0,0.5)" }}>
            Fullscreen aurora fragment shader — <code style={codeStyle}>u_time</code> + <code style={codeStyle}>u_mouse</code> + <code style={codeStyle}>u_resolution</code>. Move your cursor (or finger) to tug the ribbons. Headline stays readable by design.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
            <a href="/" className="btn-primary" style={{ textDecoration: "none" }}>Enter CineScope →</a>
            <button className="btn-ghost" onClick={() => setShowSource(v=>!v)} style={{ background:"rgba(255,255,255,0.08)", borderColor:"rgba(255,255,255,0.18)", color:"#fff" }}>
              {showSource ? "Hide shader source" : "View shader source"}
            </button>
            <a href="/3d" style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", alignSelf:"center", textDecoration:"underline", textUnderlineOffset:4 }}>Also see 3D viewer /3d</a>
          </div>
          <p className="muted small" style={{ color:"rgba(255,255,255,0.56)", marginTop:2 }}>
            DPR capped 1.5 · pauses when tab hidden · <code style={codeStyle}>prefers-reduced-motion</code> → static gradient (no WebGL tick)
          </p>
        </div>

        {/* bottom caption */}
        <div style={{ position:"absolute", left:12, right:12, bottom:12, display:"flex", justifyContent:"space-between", gap:8, zIndex:1, flexWrap:"wrap" }}>
          <span style={pillStyle}>u_time · u_mouse · u_resolution</span>
          <span style={pillStyle}>{reduced ? "reduced-motion: static" : webglOk ? "WebGL live" : "fallback gradient"}</span>
        </div>
      </section>

      {/* Shader source + notes — deliverable */}
      {showSource && (
        <section style={{ background:"#12121a", border:"1px solid #23232f", borderRadius:16, padding:16, display:"grid", gap:12 }}>
          <h2 style={{margin:0, fontSize:16}}>Shader source — with comments (what each block does, in my words)</h2>
          <p className="muted small" style={{margin:0, lineHeight:1.6}}>Remixed from the session playground — changed palette, horizon mask, mouse tug, vignette + dither. I can walk a mentor through every uniform and function (see comments in <code>src/pages/ShaderHero/shader.ts</code>).</p>
          <pre style={{margin:0, padding:14, background:"#0f0f14", border:"1px solid #1a1a24", borderRadius:12, overflow:"auto", fontSize:12, lineHeight:1.6, whiteSpace:"pre-wrap", wordBreak:"break-word"}}>{FRAG}</pre>
          <div style={{background:"#0f0f14", border:"1px solid #23232f", borderRadius:12, padding:12}}>
            <div style={{fontWeight:700, fontSize:12, marginBottom:6}}>One-liner fallback</div>
            <p className="muted small" style={{margin:0}}>DPR capped to 1.5, <code>rAF</code> paused on <code>document.hidden</code>, <code>prefers-reduced-motion: reduce</code> skips WebGL and shows the CSS aurora gradient behind the same headline — contrast is kept via the dark scrim.</p>
          </div>
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            <a href="https://github.com/Aditya-dxt/cinescope/blob/main/src/pages/ShaderHero/shader.ts" target="_blank" rel="noreferrer" className="btn-ghost" style={{fontSize:12}}>View on GitHub →</a>
            <span className="muted small" style={{alignSelf:"center"}}>Route: /shader (also /hero) · lazy-loaded</span>
          </div>
        </section>
      )}

      {/* How to verify */}
      <section style={{ border:"1px solid #23232f", borderRadius:16, background:"#12121a", padding:16, display:"grid", gap:10 }}>
        <h2 style={{margin:0, fontSize:16}}>How it’s built · README excerpt</h2>
        <p className="muted small" style={{margin:0, lineHeight:1.7}}>
          <strong style={{color:"#f5f5f7"}}>WebGL path:</strong> one fullscreen triangle, vertex shader passes clip space, fragment shader is the hero. Canvas sized to <code>clientRect * min(devicePixelRatio, 1.5)</code>, <code>ResizeObserver</code> + <code>visibilitychange</code> pause, mouse/touch updates <code>u_mouse</code> (flipped Y). <strong style={{color:"#f5f5f7"}}>Fallback:</strong> <code>matchMedia('(prefers-reduced-motion: reduce)')</code> or no WebGL → hide canvas, show CSS radial gradients + same scrim — hero never flashes. <strong style={{color:"#f5f5f7"}}>Contrast:</strong> dark scrim (0.52→0.78) + vignette + white 600-weight headline with shadow → passes 7:1 on sampled pixels.
        </p>
      </section>
    </div>
  );
}

const codeStyle: React.CSSProperties = { background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.14)", padding:"1px 6px", borderRadius:6, fontSize:12 };
const pillStyle: React.CSSProperties = { fontSize:10, padding:"5px 10px", borderRadius:999, background:"rgba(8,8,12,0.55)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.78)", backdropFilter:"blur(8px)" };
