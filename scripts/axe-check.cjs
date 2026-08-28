import { JSDOM } from "jsdom";
import fs from "fs";

const html = fs.readFileSync("dist/index.html", "utf8");
const dom = new JSDOM(html, { url: "https://cinescope-phi-ebon.vercel.app" });
const window = dom.window;
window.eval(fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8"));

window.axe.run(window.document, {
  runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] }
}).then(results => {
  console.log("violations:", results.violations.length);
  for (const v of results.violations) {
    console.log(`- ${v.id} (${v.impact}) ${v.description} nodes:${v.nodes.length}`);
    for (const n of v.nodes.slice(0,2)) console.log("  ", n.html.slice(0,140));
  }
  if (results.violations.length===0) console.log("PASS: zero violations on dist/index.html shell");
}).catch(e=>{ console.error(e); process.exit(1); });
