#!/usr/bin/env node
/** ── ENTANGLEMENTS — the author's twelve areas, clustered by what a student actually does ──────────────────
 *
 *  Same method as scripts/coils.ts on a different grid. There, two expressions coil when they have the same
 *  extension over ℤ/9 and the clustering is derived, never listed. Here an item's extension is its capacity
 *  set (src/curriculum/index.ts), two items are ENTANGLED when their sets intersect, and they COIL when the
 *  sets coincide — two names in the curriculum for one cognitive content.
 *
 *  THE AUTHOR'S THREE EXAMPLES ARE THE CONTROL, not an illustration. "Circus could connect mathematics,
 *  physics, body awareness, art history and risk"; the Equator connects geography, mathematics, politics,
 *  ecology, textiles and philosophy; AI belongs at once to computer science, economics, law, ethics, art and
 *  media. Those edges were asserted before this file existed, by someone who was not declaring capacities.
 *  If the derivation does not return them, the capacity declarations are wrong — and a control that only ever
 *  agrees is measuring nothing, so each MISS is printed as loudly as each hit.
 *
 *    node scripts/entanglements.ts           the report
 *    node scripts/entanglements.ts --control just the calibration against the author's examples */
import { AREAS, CAPACITIES, DIMENSION_CAPS, DIMENSIONS, type Cap } from '../src/curriculum/index.ts'

type Item = { area: string; name: string; caps: Set<Cap>; key: string }
const items: Item[] = []
for (const { area, items: rows } of AREAS) {
  for (const [name, caps] of rows) items.push({ area, name, caps: new Set(caps), key: [...caps].sort().join('+') })
}
const cap = (i: Item) => [...i.caps].sort()
const shared = (a: Item, b: Item) => [...a.caps].filter((c) => b.caps.has(c)).sort()
const find = (n: string) => items.find((i) => i.name === n)

// ── 1 · COILS: two curriculum entries with the SAME capacity set ─────────────────────────────────────────
const byKey = new Map<string, Item[]>()
for (const i of items) byKey.set(i.key, [...(byKey.get(i.key) ?? []), i])
const coils = [...byKey.values()].filter((g) => g.length > 1).sort((a, b) => b.length - a.length)
const crossCoils = coils.filter((g) => new Set(g.map((i) => i.area)).size > 1)

// ── 2 · THE ENTANGLEMENT WEIGHT between two items, and the strongest CROSS-AREA pairs ────────────────────
const pairs: { a: Item; b: Item; caps: string[] }[] = []
for (let x = 0; x < items.length; x++) for (let y = x + 1; y < items.length; y++) {
  if (items[x].area === items[y].area) continue
  const s = shared(items[x], items[y])
  if (s.length >= 3) pairs.push({ a: items[x], b: items[y], caps: s })
}
pairs.sort((p, q) => q.caps.length - p.caps.length || p.a.name.localeCompare(q.a.name))

// ── 3 · WHICH CAPACITY IS CARRIED BY HOW MANY AREAS — a capacity in one area is a single point of failure ─
const areasOf = new Map<Cap, Set<string>>()
const countOf = new Map<Cap, number>()
for (const i of items) for (const c of i.caps) {
  areasOf.set(c, (areasOf.get(c) ?? new Set()).add(i.area))
  countOf.set(c, (countOf.get(c) ?? 0) + 1)
}
const capRows = (Object.keys(CAPACITIES) as Cap[])
  .map((c) => ({ c, areas: areasOf.get(c)?.size ?? 0, items: countOf.get(c) ?? 0 }))
  .sort((a, b) => a.areas - b.areas || a.items - b.items)

// ── 4 · THE FOUR DIMENSIONS, PER AREA — a Making score of zero means the area cannot be MADE in ───────────
const dimRows = AREAS.map(({ area, items: rows }) => {
  const caps = new Set<Cap>(rows.flatMap(([, c]) => c))
  const scores = (Object.keys(DIMENSIONS) as (keyof typeof DIMENSIONS)[])
    .map((d) => [d, DIMENSION_CAPS[d].filter((c) => caps.has(c)).length / DIMENSION_CAPS[d].length] as const)
  return { area, scores }
})

// ── 5 · THE CONTROL: the author's own three examples, reproduced or not ──────────────────────────────────
const CLAIMED: { of: string; reaches: string[] }[] = [
  { of: 'circus', reaches: ['mathematics', 'physics', 'body awareness', 'cultural heritage', 'sculpture'] },
  { of: 'AI and machine learning', reaches: ['computer science', 'economics', 'law', 'ethics', 'visual arts', 'media literacy'] },
  { of: 'textile work', reaches: ['mathematics', 'geography', 'politics and political systems', 'ecology', 'philosophy'] },
]
const control = CLAIMED.map(({ of, reaches }) => {
  const src = find(of)!
  return { of, rows: reaches.map((r) => { const t = find(r); return { to: r, caps: t ? shared(src, t) : null } }) }
})

// ── REPORT ───────────────────────────────────────────────────────────────────────────────────────────────
if (!process.argv.includes('--control')) {
  console.log(`entanglements: ${items.length} curriculum item(s) across ${AREAS.length} area(s), over ${Object.keys(CAPACITIES).length} primitive capacities`)
  console.log(`  the capacity set of each item is a JUDGEMENT and is written down per item; everything below is derived from it\n`)

  console.log(`── COILS — ${coils.length} group(s) of entries sharing an IDENTICAL capacity set, ${crossCoils.length} of them spanning areas`)
  console.log(`   Two names for one cognitive content. A coil inside one area is a duplication; a coil ACROSS areas`)
  console.log(`   is the same learning taught twice under two headings, which is the silo the architecture removes.`)
  for (const g of coils) {
    const across = new Set(g.map((i) => i.area)).size > 1
    console.log(`   ${across ? '✳' : '·'} {${cap(g[0]).join(' ')}}`)
    for (const i of g) console.log(`       ${i.area} — ${i.name}`)
  }

  console.log(`\n── STRONGEST CROSS-AREA ENTANGLEMENTS — ${pairs.length} pair(s) share 3+ capacities across an area boundary`)
  for (const p of pairs.slice(0, 22)) {
    console.log(`   ${p.caps.length}  ${p.a.name}  ↔  ${p.b.name}`)
    console.log(`        ${p.a.area}  ×  ${p.b.area}`)
    console.log(`        via ${p.caps.join(', ')}`)
  }
  if (pairs.length > 22) console.log(`   … and ${pairs.length - 22} more`)

  console.log(`\n── CAPACITY SPREAD — how many of the twelve areas carry each capacity`)
  console.log(`   A capacity carried by ONE area is a single point of failure: drop that area and the capacity`)
  console.log(`   leaves the curriculum entirely. A capacity in all twelve is the spine of the architecture.`)
  for (const r of capRows) console.log(`   ${String(r.areas).padStart(2)}/12 areas · ${String(r.items).padStart(3)} items  ${r.c.padEnd(7)} ${CAPACITIES[r.c]}`)

  console.log(`\n── THE FOUR DIMENSIONS PER AREA — the share of each dimension's capacities the area reaches`)
  for (const r of dimRows) {
    console.log(`   ${r.area}`)
    console.log(`      ${r.scores.map(([d, v]) => `${d} ${(v * 100).toFixed(0)}%`).join(' · ')}`)
  }
}

console.log(`\n── THE CONTROL: the author's three examples, asserted before any capacity was declared`)
let hits = 0, misses = 0
for (const c of control) {
  console.log(`   ${c.of} →`)
  for (const r of c.rows) {
    if (r.caps === null) { console.log(`      ? ${r.to} — not an item in the architecture`); continue }
    if (r.caps.length) { hits++; console.log(`      ✓ ${r.to} — via ${r.caps.join(', ')}`) }
    else { misses++; console.log(`      ✗ ${r.to} — NO shared capacity: the author asserts this edge and the declaration does not produce it`) }
  }
}
console.log(`\n   ${hits} edge(s) reproduced, ${misses} MISSED.`)
if (misses) {
  console.log(`   A miss is a finding about the DECLARATION, not about the architecture: the author named the edge`)
  console.log(`   without reference to any capacity set, so where the derivation cannot reach it, the capacity`)
  console.log(`   assignment is too narrow and the item's entry in src/curriculum/index.ts is what must change.`)
}
