# NOTES.md — FE-05 Accessible component fundamentals

**Playground:** `src/playground/PlaygroundComponents.tsx` + `src/playground/PlaygroundView.tsx` — Dialog, Tabs, Disclosure hand-built in React + TS, no libs, per W3C ARIA APG.

**How tested keyboard-only:** Unplug mouse → Tab to Open dialog → Enter → Tab cycles inside → Esc closes and returns focus to trigger. Tab to tabs → ArrowRight/Left, Home/End move and activate → Tab into panel. Tab to disclosure → Enter/Space toggles, Tab into revealed region. `npx tsc -b` passes, no `any` in props.

## What shadcn/ui does that I missed at first

I installed shadcn/ui (`npx shadcn@latest add dialog tabs`) and read `components/ui/dialog.tsx` + `tabs.tsx` (Radix-based). Compared to my first playground draft:

1. **Focus + inert + scroll lock + portal + outside-pointer handling.** shadcn/Radix dialog uses a Portal, `aria-hidden`/`inert` on background, body scroll lock via `removeScroll`, and focus-trap from `focus-scope` that handles nested dialogs, pointer-down outside, and restores focus even after React re-render. My first version only trapped Tab between two buttons and set `overflow:hidden` — it missed inert, nested-dialog stack, and focus restoration when trigger unmounts. I updated `PlaygroundDialog` to store `prevFocus` and restore, and added Tab-loop; shadcn still handles portal/inert more robustly.

2. **Roving tabindex + automatic activation + orientation + disabled states in tabs.** shadcn tabs (Radix Tabs) implement roving tabindex, automatic vs manual activation, `aria-orientation`, disabled tab handling (`aria-disabled` + skip), and keeps `tabIndex` in sync on dynamic children. My first tabs only toggled `aria-selected` and showed/hid panels — arrows did nothing and all tabs stayed tabbable. I rewrote to roving `tabIndex={active?0:-1}` + ArrowRight/Left/Home/End per APG. shadcn also wires `data-state` for styling and composes with `TabsList/TabsTrigger/TabsContent` slots — I kept a simpler single-component API.

3. **Disclosure vs Collapsible + animation + accessible name.** shadcn has no disclosure but its Collapsible uses `data-state` + CSS animation, and Dialog/Disclosure both enforce strict TS props (no `any`) via `ComponentPropsWithoutRef`. My first disclosure used a plain `<details>` which is not APG-conformant for custom styling/announcement in all AT; I switched to `button[aria-expanded][aria-controls]` + `region[aria-labelledby]` with explicit IDs, and tightened props to `{ summary: string; children: ReactNode; defaultOpen?: boolean }`.

**Takeaway:** shadcn buys you Radix’s a11y primitives (focus-scope, portal, roving-focus) so you don’t reimplement edge cases. Hand-building taught me the APG contracts — now I read generated source before trusting it.

References: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/ · /tabs/ · /disclosure/ · https://ui.shadcn.com/docs/components/dialog · /tabs

