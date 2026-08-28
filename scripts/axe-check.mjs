import { JSDOM } from "jsdom";
import axe from "axe-core";
import fs from "fs";

// Build a minimal DOM from key components' HTML strings to spot-check
const html = fs.readFileSync("dist/index.html", "utf8");
const dom = new JSDOM(html, { url: "https://cinescope-phi-ebon.vercel.app" });
const { window } = dom;

// Inject axe
const scriptEl = window.document.createElement("script");
// axe-core works via window.eval of source
window.eval(fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8"));

async function run() {
  const results = await (window as any).axe.run(window.document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] }
  });
  console.log("violations:", results.violations.length);
  for (const v of results.violations) {
    console.log(`- ${v.id} (${v.impact}) ${v.description} nodes:${v.nodes.length}`);
    for (const n of v.nodes.slice(0,2)) console.log("  ", n.html.slice(0,120));
  }
  if (results.violations.length===0) console.log("PASS: zero violations on dist/index.html shell");
  else console.log("FAIL");
}
run().catch(e=>{ console.error(e); process.exit(1); });
