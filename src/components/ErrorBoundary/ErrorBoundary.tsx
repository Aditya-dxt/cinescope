import React from "react";
export class ErrorBoundary extends React.Component<{ children: React.ReactNode; label?: string }, { hasError: boolean; error: string | null }> {
  constructor(props: { children: React.ReactNode; label?: string }) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(e: Error) { return { hasError: true, error: e.message }; }
  componentDidCatch(e: Error) { console.error("[ErrorBoundary]", e); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{maxWidth:720, margin:"40px auto", padding:24, background:"#1a0f0f", border:"1px solid #7f1d1d", borderRadius:12}} role="alert">
          <div style={{fontWeight:800, color:"#fca5a5"}}>Something went wrong {this.props.label ? `— ${this.props.label}` : ""}</div>
          <div style={{fontFamily:"monospace", fontSize:12, background:"#2a1111", padding:10, borderRadius:8, marginTop:8}}>{this.state.error}</div>
          <div style={{display:"flex", gap:8, marginTop:12}}>
            <button className="btn-primary" style={{fontSize:13}} onClick={()=>{ this.setState({hasError:false, error:null}); window.location.reload(); }}>Retry</button>
            <a className="btn-ghost" style={{fontSize:13, textDecoration:"none", padding:"8px 12px"}} href="/">Go home</a>
          </div>
          <div className="muted small" style={{marginTop:8}}>This is the designed <code>error.tsx</code> boundary — not a crash. Retry remounts the route.</div>
        </div>
      );
    }
    return this.props.children;
  }
}
