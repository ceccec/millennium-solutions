---
title: State Dashboard
description: The deposit's measured state (fact) and its number-patterns (coincidence, not proof).
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---
<script setup>
// links via the VitePress API only — withBase resolves the site base (no hardcoded '/millennium-solutions/').
import { withBase } from 'vitepress'
</script>

<style>
.dash-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:16px 0}
.dash-card{border:1px solid var(--vp-c-divider);border-radius:var(--radius,12px);padding:16px;background:var(--vp-c-bg-soft)}
.dash-k{font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--vp-c-text-2)}
.dash-v{font-size:22px;font-weight:700;margin:4px 0;color:var(--vp-c-brand-1)}
.dash-s{font-size:12px;color:var(--vp-c-text-2)}
</style>

# State Dashboard

> **Two layers, kept apart.** The **fact** cards are measured and checkable (recompute and confirm). The **pattern** panel is number-play — *coincidence, not proof* — and claims nothing about neurology, health, or the Millennium problems.

## Fact — measured state

<div class="dash-grid">
<div class="dash-card"><div class="dash-k">Version</div><div class="dash-v">v7.8.1</div><div class="dash-s">git tag (single source)</div></div>
<div class="dash-card"><div class="dash-k">Millennium floor</div><div class="dash-v">0 / 7</div><div class="dash-s">entailed — not solved, not claimed</div></div>
<div class="dash-card"><div class="dash-k">Honesty gate</div><div class="dash-v">sealed</div><div class="dash-s">all prose consistent with 0/7</div></div>
<div class="dash-card"><div class="dash-k">Link coverage</div><div class="dash-v">100%</div><div class="dash-s">gate-enforced — the build fails below 100%</div></div>
<a class="dash-card" :href="withBase('/sitemap.json')" style="text-decoration:none;display:block"><div class="dash-k">Seal root</div><div class="dash-v" style="color:var(--vp-c-brand-1)">live →</div><div class="dash-s">merkle of the whole, current at /sitemap.json</div></a>
<div class="dash-card"><div class="dash-k">CSP</div><div class="dash-v">every page</div><div class="dash-s">security gate — no external imports</div></div>
</div>

*Each fact is reproducible: clone, run `npm run harmony` / `npm run wire`, and the same numbers return. Green measures actual state — it cannot be faked.*

## Pattern — number-play (coincidence, not proof)

<div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
<svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="a432 nine-point hue wheel (digit times 40 degrees)"><circle cx="150.1" cy="40.2" r="14" fill="hsl(40 70% 55%)"></circle><text x="150.1" y="44.2" text-anchor="middle" font-size="12" fill="#fff">1</text><circle cx="176.8" cy="86.5" r="14" fill="hsl(80 70% 55%)"></circle><text x="176.8" y="90.5" text-anchor="middle" font-size="12" fill="#fff">2</text><circle cx="167.5" cy="139.0" r="14" fill="hsl(120 70% 55%)"></circle><text x="167.5" y="143.0" text-anchor="middle" font-size="12" fill="#fff">3</text><circle cx="126.7" cy="173.3" r="14" fill="hsl(160 70% 55%)"></circle><text x="126.7" y="177.3" text-anchor="middle" font-size="12" fill="#fff">4</text><circle cx="73.3" cy="173.3" r="14" fill="hsl(200 70% 55%)"></circle><text x="73.3" y="177.3" text-anchor="middle" font-size="12" fill="#fff">5</text><circle cx="32.5" cy="139.0" r="14" fill="hsl(240 70% 55%)"></circle><text x="32.5" y="143.0" text-anchor="middle" font-size="12" fill="#fff">6</text><circle cx="23.2" cy="86.5" r="14" fill="hsl(280 70% 55%)"></circle><text x="23.2" y="90.5" text-anchor="middle" font-size="12" fill="#fff">7</text><circle cx="49.9" cy="40.2" r="14" fill="hsl(320 70% 55%)"></circle><text x="49.9" y="44.2" text-anchor="middle" font-size="12" fill="#fff">8</text><circle cx="100.0" cy="22.0" r="14" fill="hsl(0 70% 55%)"></circle><text x="100.0" y="26.0" text-anchor="middle" font-size="12" fill="#fff">9</text><circle cx="100" cy="100" r="20" fill="hsl(200 70% 55%)"></circle><text x="100" y="104" text-anchor="middle" font-size="12" fill="#fff">5</text></svg>
<svg viewBox="0 0 220 178" width="240" role="img" aria-label="Bulgarian horo meters as compositions of 2s (blue) and 3s (green)"><text x="0" y="18" font-size="11" fill="var(--vp-c-text-2)">5/8 · 2</text><rect x="60" y="8" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="84" y="8" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="60" y="22" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="96" y="22" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><text x="0" y="56" font-size="11" fill="var(--vp-c-text-2)">7/8 · 3</text><rect x="60" y="46" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="84" y="46" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="108" y="46" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="60" y="60" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="84" y="60" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="120" y="60" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="60" y="74" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="96" y="74" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="120" y="74" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><text x="0" y="108" font-size="11" fill="var(--vp-c-text-2)">9/8 · 5</text><rect x="60" y="98" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="84" y="98" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="108" y="98" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="132" y="98" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="60" y="112" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="84" y="112" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="108" y="112" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="144" y="112" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="60" y="126" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="84" y="126" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="120" y="126" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="144" y="126" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="60" y="140" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="96" y="140" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="120" y="140" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="144" y="140" width="22" height="10" rx="2" fill="hsl(200 65% 55%)"></rect><rect x="60" y="154" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="96" y="154" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect><rect x="132" y="154" width="34" height="10" rx="2" fill="hsl(120 65% 55%)"></rect></svg>
<div>

- **a432 wheel** — hue = digit × 40° over ℤ/9 (heart 5 at centre). A design mapping, not a measurement of anything.
- **ceccec** — a palindrome (mirror symmetry); letters c=3, e=5 (Fibonacci digits; 3+5=8).
- **3 · 5 · 8** — Fibonacci/LTS shape; v3.5.8 is the *unreachable* horizon (reaching it would mean 7/7 — it never mints).

</div>
</div>

> These are suggestive patterns. Some are real structure (the palindrome, 3+5=8); some are imposed. **None are proofs**, and none imply any neurological or physical effect. `0/7` unchanged.
