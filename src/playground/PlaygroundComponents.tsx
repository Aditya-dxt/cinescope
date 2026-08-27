import { useEffect, useRef, useState } from "react";

type Props = { open: boolean; onClose: () => void; title: string; children: React.ReactNode };

export function PlaygroundDialog({ open, onClose, title, children }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<HTMLElement | null>(null);
  const titleId = "pg-dialog-title";

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement as HTMLElement | null;
    // focus dialog
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        const first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); (last as HTMLElement).focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); (first as HTMLElement).focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prevFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="presentation" onClick={onClose} style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"grid", placeItems:"center", zIndex:50, padding:16}}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        style={{background:"#12121a", border:"1px solid #2a2a3a", borderRadius:12, padding:20, maxWidth:480, width:"100%", color:"white"}}
      >
        <h2 id={titleId} style={{margin:"0 0 8px", fontSize:18, fontWeight:800}}>{title}</h2>
        <div style={{color:"#c9c9d1", fontSize:13, lineHeight:1.6}}>{children}</div>
        <div style={{display:"flex", gap:8, marginTop:16, justifyContent:"flex-end"}}>
          <button className="btn-primary" onClick={onClose} autoFocus>Close (Esc)</button>
        </div>
      </div>
    </div>
  );
}

// Tabs — roving tabindex, arrow keys, Home/End
type TabItem = { id: string; label: string; panel: React.ReactNode };
export function PlaygroundTabs({ items, defaultId }: { items: TabItem[]; defaultId?: string }) {
  const [active, setActive] = useState(defaultId || items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  function onKey(e: React.KeyboardEvent, idx: number) {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    const id = items[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  }
  return (
    <div>
      <div role="tablist" aria-label="Playground tabs" style={{display:"flex", gap:4, borderBottom:"1px solid #2a2a3a", paddingBottom:4}}>
        {items.map((it, i) => (
          <button
            key={it.id}
            ref={el => { tabRefs.current[it.id] = el; }}
            role="tab"
            id={`pg-tab-${it.id}`}
            aria-selected={active === it.id}
            aria-controls={`pg-panel-${it.id}`}
            tabIndex={active === it.id ? 0 : -1}
            onClick={() => setActive(it.id)}
            onKeyDown={e => onKey(e, i)}
            style={{padding:"8px 14px", borderRadius:8, border:"1px solid transparent", background: active===it.id ? "#1e293b" : "transparent", color: active===it.id ? "white" : "#9aa0b3", fontWeight:700, fontSize:13}}
          >{it.label}</button>
        ))}
      </div>
      {items.map(it => (
        <div key={it.id} role="tabpanel" id={`pg-panel-${it.id}`} aria-labelledby={`pg-tab-${it.id}`} hidden={active !== it.id} style={{padding:"14px 0", display: active===it.id ? "block" : "none"}}>
          {it.panel}
        </div>
      ))}
    </div>
  );
}

// Disclosure (single)
export function PlaygroundDisclosure({ summary, children, defaultOpen }: { summary: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const btnId = "pg-disc-btn";
  const panelId = "pg-disc-panel";
  return (
    <div style={{border:"1px solid #2a2a3a", borderRadius:10, overflow:"hidden"}}>
      <button
        id={btnId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(v => !v)}
        style={{width:"100%", textAlign:"left", padding:"12px 14px", background:"#0f172a", color:"white", fontWeight:700, display:"flex", justifyContent:"space-between", alignItems:"center"}}
      >
        <span>{summary}</span><span aria-hidden>{open ? "▾" : "▸"}</span>
      </button>
      <div id={panelId} role="region" aria-labelledby={btnId} hidden={!open} style={{padding: open ? "12px 14px" : 0, display: open ? "block" : "none", background:"#12121a", color:"#c9c9d1", fontSize:13, lineHeight:1.6}}>
        {children}
      </div>
    </div>
  );
}
