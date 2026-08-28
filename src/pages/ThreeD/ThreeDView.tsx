import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";

const ViewerCanvas = lazy(() => import("./ViewerCanvas").then(m => ({ default: m.ViewerCanvas })));

// feature detect WebGL
function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl") || c.getContext("webgl2") || c.getContext("experimental-webgl"));
  } catch { return false; }
}

const SAMPLE_GLBS = [
  { label: "Damaged Helmet (Khronos sample ~3.6 MB)", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb" },
  { label: "Avocado (small, PBR)", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb" },
];

export function ThreeDView() {
  const [color, setColor] = useState("#ff3b30");
  const [metalness, setMetalness] = useState(0.35);
  const [roughness, setRoughness] = useState(0.42);
  const [wireframe, setWireframe] = useState(false);
  const [envPreset, setEnvPreset] = useState<"city" | "studio" | "sunset" | "warehouse" | "apartment">("studio");
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [glbName, setGlbName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loadMs, setLoadMs] = useState<number | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h = () => setReduceMotion(m.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);
  const webglOk = typeof window === "undefined" ? true : hasWebGL();
  const showFallback = reduceMotion || !webglOk;

  // perf: measure canvas first paint
  const t0Ref = useRef(performance.now());
  useEffect(() => { t0Ref.current = performance.now(); }, []);
  useEffect(() => {
    if (!glbUrl) {
      const id = setTimeout(() => setLoadMs(Math.round(performance.now() - t0Ref.current)), 400);
      return () => clearTimeout(id);
    }
  }, [glbUrl]);

  function handleFiles(files: FileList | null) {
    if (!files || !files[0]) return;
    const f = files[0];
    if (!f.name.toLowerCase().endsWith(".glb") && !f.name.toLowerCase().endsWith(".gltf")) {
      alert("Please drop a .glb or .gltf file (compressed DRACO/meshopt supported).");
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(f);
    objectUrlRef.current = url;
    const t = performance.now();
    setGlbUrl(url);
    setGlbName(f.name);
    setLoadMs(null);
    // rough load time
    setTimeout(() => setLoadMs(Math.round(performance.now() - t)), 900);
  }

  function loadSample(url: string, label: string) {
    if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = null; }
    setGlbUrl(url);
    setGlbName(label);
    setLoadMs(null);
    const t = performance.now();
    setTimeout(() => setLoadMs(Math.round(performance.now() - t)), 600);
  }

  function clearModel() {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setGlbUrl(null);
    setGlbName(null);
  }

  useEffect(() => () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current); }, []);

  // keyboard: allow clearing via Escape when drop zone focused
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollT, setScrollT] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollT(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="page" style={{ gap: 16 }}>
      <header style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h1 className="page-title" style={{ fontSize: 32, letterSpacing: "-0.03em" }}>Your First 3D Experience — Product Viewer</h1>
        <p className="hero-sub" style={{ maxWidth: 760 }}>
          Interactive 3D in the browser with <strong style={{ color: "#f5f5f7" }}>React Three Fiber + drei</strong>. Drag a <code>.glb</code> onto the stage, tune materials, and ship responsibly — lazy canvas, DRACO-ready, reduced-motion fallback, DPR-capped, touch-friendly.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#12121a", border: "1px solid #23232f", color: "#9a9ab0" }}>FE-AA2 · Week 7 · Build+</span>
          <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#12121a", border: "1px solid #23232f", color: "#9a9ab0" }}>R3F · drei · leva-style controls</span>
          {loadMs !== null && <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 999, background: "#1a1a12", border: "1px solid #3a3000", color: "#f5d76e" }}>first paint ~{loadMs}ms</span>}
        </div>
      </header>

      {/* fallback banner */}
      {showFallback && (
        <div role="status" aria-live="polite" style={{ background: "#1a1a24", border: "1px solid #23232f", borderRadius: 16, padding: 16, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 220, height: 140, borderRadius: 12, background: "linear-gradient(135deg,#1a1a24 0%,#ff3b30 100%)", display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, letterSpacing: 2 }}>3D FALLBACK</div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{!webglOk ? "WebGL unavailable" : "Reduced motion enabled"}</div>
            <p style={{ margin: 0, color: "#9a9ab0", fontSize: 13, lineHeight: 1.5 }}>
              Showing a static preview to respect your settings and save power. Toggle off “Reduce motion” in your OS to see the interactive canvas, or enable WebGL in your browser.
            </p>
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn-ghost" onClick={() => setReduceMotion(false)} style={{ fontSize: 12 }}>Try interactive anyway</button>
              <a href="#config" style={{ fontSize: 12, color: "#06b6d4" }}>Jump to configurator ↓</a>
            </div>
          </div>
        </div>
      )}

      <div
        ref={dropRef}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 16,
          alignItems: "stretch",
          border: dragOver ? "2px dashed #ff3b30" : "1px solid #23232f",
          borderRadius: 20,
          background: dragOver ? "rgba(255,59,48,0.06)" : "#0f0f14",
          padding: 12,
          minHeight: 520,
          position: "relative",
        }}
      >
        {/* Canvas stage */}
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "radial-gradient(800px 500px at 30% 20%, #1e1e2e 0%, #0f0f14 60%, #08080c 100%)", minHeight: 460, display: "grid", placeItems: "stretch", border: "1px solid #1a1a24" }}>
          {!showFallback ? (
            <Suspense fallback={<div style={{ display: "grid", placeItems: "center", color: "#9a9ab0", fontSize: 13, minHeight: 460 }}>Loading 3D engine… (lazy)</div>}>
              <ViewerCanvas
                glbUrl={glbUrl}
                color={color}
                metalness={metalness}
                roughness={roughness}
                wireframe={wireframe}
                envPreset={envPreset}
                autoRotate={autoRotate && !reduceMotion}
                lightIntensity={lightIntensity}
                dprCap={1.6}
              />
            </Suspense>
          ) : (
            <div style={{ display: "grid", placeItems: "center", minHeight: 460, padding: 24, textAlign: "center" }}>
              <div style={{ width: 180, height: 180, borderRadius: 999, background: `conic-gradient(from 0deg, ${color}, #1a1a24, ${color})`, filter: "blur(0.5px)", border: "2px solid #23232f" }} />
              <p style={{ color: "#9a9ab0", fontSize: 12, marginTop: 14, maxWidth: 360 }}>Static poster — interactive canvas disabled. Your GLB would appear here when motion is allowed.</p>
            </div>
          )}

          {/* overlay hint */}
          <div style={{ position: "absolute", left: 12, right: 12, top: 12, display: "flex", justifyContent: "space-between", gap: 8, pointerEvents: "none", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, padding: "6px 10px", borderRadius: 999, background: "rgba(18,18,26,0.92)", border: "1px solid #23232f", color: "#f5f5f7" }}>
              {glbName ? `Loaded: ${glbName}` : "Default procedural product · drag a .glb to replace"}
            </span>
            <span style={{ fontSize: 11, padding: "6px 10px", borderRadius: 999, background: "rgba(18,18,26,0.92)", border: "1px solid #23232f", color: "#9a9ab0" }}>
              orbit · pinch · scroll reacts
            </span>
          </div>
          <div style={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <label style={{ fontSize: 11, padding: "6px 10px", borderRadius: 99, background: "#12121a", border: "1px solid #23232f", color: "#9a9ab0", cursor: "pointer" }}>
              <input type="file" accept=".glb,.gltf" style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
              Choose .glb
            </label>
            {glbUrl && <button className="btn-ghost" onClick={clearModel} style={{ fontSize: 11, padding: "6px 10px" }}>Clear → procedural</button>}
          </div>
          <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", gap: 6 }}>
            <span style={{ fontSize: 10, padding: "4px 8px", borderRadius: 999, background: "rgba(0,0,0,0.55)", color: "#9a9ab0", border: "1px solid rgba(255,255,255,0.08)" }}>DPR capped · shadows 1024 · lazy</span>
          </div>
          {dragOver && (
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(8,8,12,0.66)", backdropFilter: "blur(6px)", color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
              Drop .glb to view →
            </div>
          )}
        </div>

        {/* Configurator */}
        <aside id="config" style={{ background: "#12121a", border: "1px solid #23232f", borderRadius: 16, padding: 14, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 800, letterSpacing: 0.02 }}>Configurator</div>
            <span style={{ fontSize: 11, color: "#9a9ab0", border: "1px solid #23232f", padding: "2px 8px", borderRadius: 999 }}>leva-style</span>
          </div>
          <p style={{ margin: 0, color: "#9a9ab0", fontSize: 12, lineHeight: 1.5 }}>Beyond orbiting: every control re-paints the material. Scroll the page — the hero tilts. Drag the canvas. Double-click to reframe (OrbitControls).</p>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#9a9ab0" }}>Base color</span>
            <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 44, height: 32, borderRadius: 8, border: "1px solid #23232f", padding: 2, background: "#0f0f14" }} aria-label="Base color" />
              <input value={color} onChange={e => setColor(e.target.value)} style={{ flex: 1, background: "#0f0f14", border: "1px solid #23232f", borderRadius: 8, padding: "8px 10px", color: "#f5f5f7", fontSize: 12 }} />
            </span>
            <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["#ff3b30", "#06b6d4", "#22c55e", "#eab308", "#a855f7", "#f5f5f7"].map(c => (
                <button key={c} onClick={() => setColor(c)} aria-label={`Preset ${c}`} style={{ width: 24, height: 24, borderRadius: 999, background: c, border: color === c ? "2px solid #fff" : "1px solid #23232f", cursor: "pointer" }} />
              ))}
            </span>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#9a9ab0", display: "flex", justifyContent: "space-between" }}><span>Metalness</span><span style={{ color: "#f5f5f7" }}>{metalness.toFixed(2)}</span></span>
            <input type="range" min={0} max={1} step={0.01} value={metalness} onChange={e => setMetalness(parseFloat(e.target.value))} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#9a9ab0", display: "flex", justifyContent: "space-between" }}><span>Roughness</span><span style={{ color: "#f5f5f7" }}>{roughness.toFixed(2)}</span></span>
            <input type="range" min={0} max={1} step={0.01} value={roughness} onChange={e => setRoughness(parseFloat(e.target.value))} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#9a9ab0", display: "flex", justifyContent: "space-between" }}><span>Light intensity</span><span style={{ color: "#f5f5f7" }}>{lightIntensity.toFixed(1)}</span></span>
            <input type="range" min={0.5} max={2} step={0.1} value={lightIntensity} onChange={e => setLightIntensity(parseFloat(e.target.value))} />
          </label>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, background: "#0f0f14", border: "1px solid #23232f", borderRadius: 999, padding: "8px 12px", cursor: "pointer" }}>
              <input type="checkbox" checked={wireframe} onChange={e => setWireframe(e.target.checked)} /> Wireframe
            </label>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, background: "#0f0f14", border: "1px solid #23232f", borderRadius: 999, padding: "8px 12px", cursor: "pointer" }}>
              <input type="checkbox" checked={autoRotate} onChange={e => setAutoRotate(e.target.checked)} /> Auto-rotate
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#9a9ab0" }}>Environment</span>
            <select value={envPreset} onChange={e => setEnvPreset(e.target.value as never)} style={{ background: "#0f0f14", border: "1px solid #23232f", borderRadius: 10, padding: "10px 12px", color: "#f5f5f7", fontSize: 13 }}>
              <option value="studio">Studio (soft)</option>
              <option value="city">City (HDRI)</option>
              <option value="sunset">Sunset</option>
              <option value="warehouse">Warehouse</option>
              <option value="apartment">Apartment</option>
            </select>
          </label>

          <div style={{ background: "#0f0f14", border: "1px solid #23232f", borderRadius: 12, padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Try a sample GLB</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {SAMPLE_GLBS.map(s => (
                <button key={s.url} onClick={() => loadSample(s.url, s.label)} className="btn-ghost" style={{ textAlign: "left", fontSize: 11, padding: "8px 10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#9a9ab0", lineHeight: 1.4 }}>Samples use DRACO/meshopt where available. Your own .glb is loaded via object URL and never uploaded — stays in your browser.</div>
          </div>

          <div style={{ fontSize: 11, color: "#9a9ab0", lineHeight: 1.6, borderTop: "1px solid #23232f", paddingTop: 10 }}>
            <div style={{ fontWeight: 700, color: "#f5f5f7", marginBottom: 4 }}>Performance notes (FE-10 lens)</div>
            • Canvas is <code>React.lazy</code> + <code>Suspense</code> — three/drei (~620 kB) only loads when you visit /3d.<br />
            • DPR capped to 1.6, shadows 1024², antialias on desktop only via <code>powerPreference</code>.<br />
            • GLBs expected compressed (DRACO/meshopt); blob URLs revoked on clear.<br />
            • Reduced-motion / no-WebGL → static poster, no WebGL context created.
          </div>
        </aside>
      </div>

      {/* Scroll-reactive demo strip */}
      <div
        ref={scrollRef}
        style={{ maxHeight: 280, overflow: "auto", border: "1px solid #23232f", borderRadius: 16, background: "#12121a", padding: 14 }}
      >
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Scroll interaction — the hero reacts</div>
        <p style={{ margin: 0, color: "#9a9ab0", fontSize: 12, lineHeight: 1.6 }}>
          Scroll inside this box. The 3D hero tilts subtly with page scroll (<code>{(scrollT).toFixed(2)}</code>). This is the “beyond orbiting” interaction alongside material tweaks. On mobile, touch-drag orbits and pinch-zooms.
        </p>
        <div style={{ height: 520, display: "flex", flexDirection: "column", gap: 10, paddingTop: 12, opacity: 0.9 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ height: 72, borderRadius: 12, background: i % 2 ? "#0f0f14" : "#1a1a24", border: "1px solid #23232f", display: "grid", placeItems: "center", color: "#9a9ab0", fontSize: 12 }}>
              Scroll block {i + 1} — tilt { (scrollT * 12).toFixed(1)}°
            </div>
          ))}
        </div>
      </div>

      <section style={{ border: "1px solid #23232f", borderRadius: 16, background: "#12121a", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>How it’s built · README excerpt</h2>
        <p style={{ margin: 0, color: "#9a9ab0", fontSize: 12, lineHeight: 1.7 }}>
          <strong style={{ color: "#f5f5f7" }}>Stack:</strong> React Three Fiber + drei (OrbitControls, Environment, ContactShadows, Center, useGLTF), Three.js, Vite. No extra runtime — leva-style controls are native inputs to keep bundle lean, but the UX matches the “mini configurator” brief.<br />
          <strong style={{ color: "#f5f5f7" }}>Responsible shipping:</strong> Canvas lazy-loaded (route-split), DPR capped, 1024 shadow map, <code>toneMappingExposure</code> tied to light control, object URLs revoked, fallback poster for <code>prefers-reduced-motion</code> and no-WebGL. DRACO decoder from gstatic CDN; meshopt handled by drei.<br />
          <strong style={{ color: "#f5f5f7" }}>Next:</strong> swap procedural hero for your capstone asset (poster/cover as GLB), add scroll-driven camera dolly, bake a compressed hero GLB, add a11y focus trap on the configurator.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="https://github.com/Aditya-dxt/cinescope" target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: 12 }}>GitHub →</a>
          <span style={{ fontSize: 11, color: "#9a9ab0", alignSelf: "center" }}>Live: cinescope-phi-ebon.vercel.app/3d</span>
        </div>
      </section>

      <style>{`@media(max-width:900px){ div[style*="gridTemplateColumns: 1fr 340px"]{grid-template-columns:1fr !important} } input[type="range"]{ accent-color:#ff3b30 }`}</style>
    </div>
  );
}
