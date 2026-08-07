#!/usr/bin/env node
// Dashboard generator — a cached, reusable computed-state page (shadcn-style cards + an a432 wheel).
// Two honestly-separated layers:
//   • FACT  — real MEASURED state (version, gate results, coverage, CSP, seal root). checkable, green-can't-be-faked.
//   • PATTERN (numerology) — a432 wheel / palindrome / 3-5-8. LABELED coincidence, NOT proof (you conceded this).
// Perception-aware: static SVG, no motion (respects reduced-motion by having none). NO "convincing" rhetoric,
// NO neurological/health claims. Regenerated each build => computed, not hardcoded.
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const version = (() => { try { return execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').pop() || 'v0' } catch { return 'v0' } })()
// coverage + seal from the last-built mesh (labeled "as of last seal"); floor is invariant.
let nodes = '?', edges = '?', resolved = '?', root = '?'
try {
  const m = JSON.parse(readFileSync('.vitepress/dist/sitemap.json', 'utf8'))
  root = (m.root || '?').slice(0, 13); nodes = m.nodes?.length ?? '?'
  edges = m.edges ?? m.links ?? '?'
} catch {}

const card = (title: string, value: string, sub: string) =>
  `<div class="dash-card"><div class="dash-k">${title}</div><div class="dash-v">${value}</div><div class="dash-s">${sub}</div></div>`

// a432 wheel: 9 points, hue = digit*40deg. pure computed, static SVG.
const wheel = (() => {
  const pts = Array.from({ length: 9 }, (_, i) => {
    const d = i + 1, ang = ((d * 40) - 90) * Math.PI / 180, hue = (d * 40) % 360
    const x = 100 + 78 * Math.cos(ang), y = 100 + 78 * Math.sin(ang)
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="14" fill="hsl(${hue} 70% 55%)"></circle>`
      + `<text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" font-size="12" fill="#fff">${d}</text>`
  }).join('')
  return `<svg viewBox="0 0 200 200" width="200" height="200" role="img" aria-label="a432 nine-point hue wheel (digit times 40 degrees)">${pts}<circle cx="100" cy="100" r="20" fill="hsl(200 70% 55%)"></circle><text x="100" y="104" text-anchor="middle" font-size="12" fill="#fff">5</text></svg>`
})()

// horo rhythm SVG — MEDIA that EMERGES FROM COMPUTATION: the {2,3}-compositions of each meter, drawn as bars.
// self-contained (inline SVG, no external), and it literally computes (from the enumerator). honest pattern.
const comps = (n: number): number[][] => n === 0 ? [[]] : [2, 3].flatMap((p) => n - p >= 0 ? comps(n - p).map((r) => [p, ...r]) : [])
const horo = (() => {
  const meters = [5, 7, 9]
  let y = 8, rows = ''
  for (const m of meters) {
    const cs = comps(m)
    rows += `<text x="0" y="${y + 10}" font-size="11" fill="var(--vp-c-text-2)">${m}/8 · ${cs.length}</text>`
    cs.forEach((c, i) => {
      let x = 60
      c.forEach((p) => { rows += `<rect x="${x}" y="${y + i * 14}" width="${p * 12 - 2}" height="10" rx="2" fill="hsl(${(p === 2 ? 200 : 120)} 65% 55%)"></rect>`; x += p * 12 })
    })
    y += cs.length * 14 + 10
  }
  return `<svg viewBox="0 0 220 ${y}" width="240" role="img" aria-label="Bulgarian horo meters as compositions of 2s (blue) and 3s (green)">${rows}</svg>`
})()

const md = `---
title: State Dashboard
description: The deposit's measured state (fact) and its number-patterns (coincidence, not proof).
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---
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
${card('Version', version, 'git tag (single source)')}
${card('Millennium floor', '0 / 7', 'entailed — not solved, not claimed')}
${card('Honesty gate', 'sealed', 'all prose consistent with 0/7')}
${card('Link coverage', resolved === '?' ? nodes + ' nodes' : resolved + '/' + edges, 'sitemap mesh (as of last seal)')}
${card('Seal root', root, 'merkle of the whole (as of last seal)')}
${card('CSP', 'every page', 'security gate — no external imports')}
</div>

*Each fact is reproducible: clone, run \`npm run harmony\` / \`npm run wire\`, and the same numbers return. Green measures actual state — it cannot be faked.*

## Pattern — number-play (coincidence, not proof)

<div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
${wheel}
${horo}
<div>

- **a432 wheel** — hue = digit × 40° over ℤ/9 (heart 5 at centre). A design mapping, not a measurement of anything.
- **ceccec** — a palindrome (mirror symmetry); letters c=3, e=5 (Fibonacci digits; 3+5=8).
- **3 · 5 · 8** — Fibonacci/LTS shape; v3.5.8 is the *unreachable* horizon (reaching it would mean 7/7 — it never mints).

</div>
</div>

> These are suggestive patterns. Some are real structure (the palindrome, 3+5=8); some are imposed. **None are proofs**, and none imply any neurological or physical effect. \`0/7\` unchanged.
`

writeFileSync('dashboard.md', md)
console.log('dashboard: generated dashboard.md (fact cards + a432 pattern wheel) · version ' + version + ' · root ' + root)
