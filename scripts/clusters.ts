#!/usr/bin/env node
// CLUSTERS — one publication per proven cluster of theorems, about how its theorems are bound together.
//
// The author: "for each proven cluster of theorems prepare publication about their entanglement", then "as each
// theorem has lattice coordinates, these coordinates may be used to compute neighbouring clusters".
//
// A CLUSTER is one Lean source file: one namespace, compiled by the kernel as one unit, with its own seal and its
// own prior-art declaration. It is PROVEN when every declaration the seal takes is sealed live in the ledger
// (`rfl` declarations are excluded from sealing by design, so they are counted and not required).
//
// ENTANGLEMENT is used in this deposit's honest sense (src/0/entanglement.ts): correlation by DERIVATION, not
// quantum entanglement, and no message travels through it. A cluster's theorems are bound in four ways, each
// computed here rather than described:
//   1 · shared definitions — theorems whose statements use the same `def` are bound by it; the components of that
//       graph are the cluster's strands;
//   2 · imports — the clusters this one is built on, and the clusters built on it;
//   3 · the joint address — merkleFold of the cluster's sealed receipts: order-invariant, and altering ONE receipt
//       changes it, which is checked on every run rather than asserted;
//   4 · the address lattice — each theorem's coordinates are the seven ray values its page plots from its receipt
//       (Vortex7D: two hex digits per ray), taken mod 9 as the page colours them: a point of (ℤ/9)⁷. Clusters are
//       NEIGHBOURS when their theorems sit among each other's seven nearest points on that torus — the page's
//       "seven surrounding", measured by distance instead of by ledger order. HONEST: a receipt is a hash, so
//       nearness on this lattice is a property of the ADDRESSES, not of the mathematics; the mathematical binding
//       is (1) and (2). The mean distance within a cluster and between clusters is printed beside it, so a reader
//       can see which of the two it is.
//
// Output — deposition drafts, prepared and never uploaded (this script reaches no network):
//   .zenodo/clusters/<file>.json   one Zenodo deposition per proven cluster
//   .zenodo/clusters/_index.json   the clusters, their joint addresses and their lattice neighbours — underscored,
//                                  because index.lean's own draft is index.json and the summary once overwrote it
//
//   node scripts/clusters.ts            report
//   node scripts/clusters.ts --write    write the drafts
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { leanTheorems, type LeanTheorem } from '../src/api/index.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { CONCEPT_DOI, SITE, REPO, FUNDING, humanise, closureOf, creditedIn } from '../src/publication/index.ts'

const OUT = '.zenodo/clusters'
// WHAT A PERMANENT RECORD IS AS OF. Every figure here moves when anything is sealed anywhere, and a link to `main` moves
// with it; so the record names the commit it was computed at and links there.
const git = (...a: string[]) => execFileSync('git', a, { encoding: 'utf8' }).trim()
const HEAD = git('rev-parse', 'HEAD'), HEAD_DATE = git('log', '-1', '--format=%cs')
const AT = (f: string) => `${REPO}/blob/${HEAD}/${f}`
// THE LEDGER IS NOT SIMPLY APPEND-ONLY. revoked.json lists rows removed from it outright; the drafts said "append-only".
const REMOVED = (JSON.parse(readFileSync('src/proof/revoked.json', 'utf8')) as unknown[]).length
const REMOVED_ON = git('log', '--diff-filter=A', '--format=%cs', '--', 'src/proof/revoked.json').split('\n').pop() ?? ''
const pl = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
const sentence = (t: string) => { const x = t.trim(); if (!x) return ''; const y = x.charAt(0).toUpperCase() + x.slice(1); return /[.!?]$/.test(y) ? y : y + '.' }
const src = (f: string) => readFileSync(`src/proof/${f}`, 'utf8')
const front = (f: string, k: string) => {
  const lines = src(f).split('\n'), i = lines.findIndex((l) => new RegExp(`^--\\s*${k}:`).test(l))
  if (i < 0) return ''
  let out = lines[i].replace(new RegExp(`^--\\s*${k}:\\s*`), '').trim()
  for (let j = i + 1; j < lines.length && /^--\s{2,}\S/.test(lines[j]); j++) out += ' ' + lines[j].replace(/^--\s+/, '').trim()
  return out
}
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const zen = JSON.parse(readFileSync('.zenodo.json', 'utf8'))

// ── the ledger: which declarations are sealed live, and their receipts ──────────────────────────────────────────
const ledger = JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) as { key: string; receipt: string; revoked?: boolean }[]
const live = new Map(ledger.filter((e) => !e.revoked).map((e) => [e.key, e.receipt]))
const keyOf = (t: LeanTheorem) => `lean_${t.namespace.toLowerCase()}_${t.name}`

// ── the clusters ─────────────────────────────────────────────────────────────────────────────────────────────────
const all = leanTheorems()
const files = [...new Set(all.map((t) => t.file))].sort()
const importsOf = (f: string) => [...src(f).matchAll(/^import (\w+)/gm)].map((m) => m[1].toLowerCase() + '.lean').filter((x) => files.includes(x))
const dependentsOf = (f: string) => files.filter((g) => importsOf(g).includes(f))
const defsIn = (f: string) => [...src(f).matchAll(/^(?:def|abbrev)\s+([A-Za-z_][A-Za-z_0-9']*)/gm)].map((m) => m[1])

type Cluster = { file: string; title: string; wing: string; theorems: LeanTheorem[]; sealed: LeanTheorem[]; declarations: LeanTheorem[]; proven: boolean }
const clusters: Cluster[] = files.map((file) => {
  const theorems = all.filter((t) => t.file === file)
  const declarations = theorems.filter((t) => t.tactic === 'rfl')
  const sealed = theorems.filter((t) => t.tactic !== 'rfl' && live.has(keyOf(t)))
  return { file, title: front(file, 'title') || file.replace('.lean', ''), wing: front(file, 'wing') || '—', theorems, sealed, declarations,
    proven: sealed.length > 0 && sealed.length === theorems.length - declarations.length }
})

// ── 1 · shared definitions ─────────────────────────────────────────────────────────────────────────────────────
function strands(c: Cluster) {
  const defs = [...new Set([c.file, ...closureOf(c.file)].flatMap(defsIn))]
  const uses = new Map(c.sealed.map((t) => [t.name, defs.filter((d) => new RegExp(`(^|[^A-Za-z_0-9'.])${d.replace(/'/g, "\\'")}($|[^A-Za-z_0-9'])`).test(t.statement))]))
  const parent = new Map(c.sealed.map((t) => [t.name, t.name]))
  const find = (x: string): string => (parent.get(x) === x ? x : (parent.set(x, find(parent.get(x)!)), parent.get(x)!))
  const byDef = new Map<string, string[]>()
  for (const [n, ds] of uses) for (const d of ds) byDef.set(d, [...(byDef.get(d) ?? []), n])
  for (const ns of byDef.values()) for (const n of ns.slice(1)) parent.set(find(n), find(ns[0]))
  const comps = new Map<string, string[]>()
  for (const t of c.sealed) comps.set(find(t.name), [...(comps.get(find(t.name)) ?? []), t.name])
  const binding = [...byDef].filter(([, ns]) => ns.length >= 2).sort((a, b) => b[1].length - a[1].length)
  const edges = [...byDef.values()].reduce((n, ns) => n + (ns.length * (ns.length - 1)) / 2, 0)
  return { binding, strands: [...comps.values()].sort((a, b) => b.length - a.length), edges, loose: [...uses].filter(([, ds]) => !ds.length).map(([n]) => n) }
}

// ── 3 · the joint address, and the check that it binds ────────────────────────────────────────────────────────
function joint(c: Cluster) {
  const receipts = c.sealed.map((t) => live.get(keyOf(t))!)
  const root = merkleFold(receipts)
  const reordered = merkleFold([...receipts].reverse())
  const altered = merkleFold([toUuid(receipts[0] + '·altered'), ...receipts.slice(1)])
  return { root, orderInvariant: root === reordered, bindsEveryReceipt: altered !== root }
}

// ── 4 · the address lattice ────────────────────────────────────────────────────────────────────────────────────
const RAYS = 7, MOD = 9
const coords = (receipt: string) => { const h = receipt.replace(/-/g, ''); return Array.from({ length: RAYS }, (_, i) => parseInt(h.slice(i * 2, i * 2 + 2), 16) % MOD) }
const dist = (a: number[], b: number[]) => a.reduce((s, x, i) => { const d = Math.abs(x - b[i]); return s + Math.min(d, MOD - d) }, 0)
const points = clusters.filter((c) => c.proven).flatMap((c) => c.sealed.map((t) => ({ key: keyOf(t), file: c.file, at: coords(live.get(keyOf(t))!) })))
const nearest = new Map(points.map((p) => [p.key, points.filter((q) => q.key !== p.key).map((q) => ({ q, d: dist(p.at, q.at) }))
  .sort((a, b) => a.d - b.d || a.q.key.localeCompare(b.q.key)).slice(0, RAYS)]))
// ── chance, measured — the same best-lift statistic over reshufflings of which cluster each point belongs to ─────
// A cluster's best lift is the maximum of ~32 small ratios, and the maximum of noisy small ratios is inflated: the
// first lifted run had a median best lift of 2.4 while within- and between-cluster distances were equal everywhere.
// So the statistic is measured against itself: the points and their seven nearest stay fixed, the cluster labels are
// permuted (sizes preserved), and the share of permutations reaching the observed best lift is reported. The
// generator is seeded, so every rebuild gives the same numbers.
const SHUFFLES = 200
const idx = new Map(points.map((p, i) => [p.key, i]))
const nn = points.map((p) => nearest.get(p.key)!.map(({ q }) => idx.get(q.key)!))
const labelsOf = points.map((p) => p.file)
const fileList = [...new Set(labelsOf)]
const sizes = new Map(fileList.map((f) => [f, labelsOf.filter((l) => l === f).length]))
const topLifts = (labels: string[]) => {
  const count = new Map<string, Map<string, number>>()
  labels.forEach((a, i) => { for (const j of nn[i]) { const b = labels[j]; if (b === a) continue; const m = count.get(a) ?? new Map<string, number>(); m.set(b, (m.get(b) ?? 0) + 1); count.set(a, m) } })
  const out = new Map<string, number>()
  for (const a of fileList) {
    let best = 0
    for (const [b, k] of count.get(a) ?? new Map<string, number>()) { if (k < 3) continue; best = Math.max(best, k / ((RAYS * sizes.get(a)! * sizes.get(b)!) / (points.length - 1))) }
    out.set(a, best)
  }
  return out
}
const seeded = (seed: number) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
const observedTop = topLifts(labelsOf)
const reached = new Map(fileList.map((f) => [f, 0]))
const nullTops = new Map(fileList.map((f) => [f, [] as number[]]))
{
  const r = seeded(0x9e3779b9)
  for (let s = 0; s < SHUFFLES; s++) {
    const l = [...labelsOf]
    for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [l[i], l[j]] = [l[j], l[i]] }
    const t = topLifts(l)
    for (const f of fileList) { nullTops.get(f)!.push(t.get(f)!); if (t.get(f)! >= observedTop.get(f)! - 1e-9) reached.set(f, reached.get(f)! + 1) }
  }
}
const chanceShare = (f: string) => +((reached.get(f) ?? 0) / SHUFFLES).toFixed(3)
// the TYPICAL best lift under reshuffling — "a lift near 1 is chance" was wrong for a BEST lift, which is inflated
const nullMedian = (f: string) => { const xs = [...(nullTops.get(f) ?? [])].sort((a, b) => a - b); return +(xs[Math.floor(xs.length / 2)] ?? 0).toFixed(2) }
function neighbours(c: Cluster) {
  const mine = points.filter((p) => p.file === c.file)
  const weight = new Map<string, number>()
  for (const p of mine) for (const { q } of nearest.get(p.key)!) if (q.file !== c.file) weight.set(q.file, (weight.get(q.file) ?? 0) + 1)
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)
  const within = mean(mine.flatMap((p, i) => mine.slice(i + 1).map((q) => dist(p.at, q.at))))
  const between = mean(mine.flatMap((p) => points.filter((q) => q.file !== c.file).map((q) => dist(p.at, q.at))))
  const centre = Array.from({ length: RAYS }, (_, i) => { // circular mean of each coordinate on ℤ/9, rounded to a residue
    const s = mine.reduce((a, p) => a + Math.sin((2 * Math.PI * p.at[i]) / MOD), 0), k = mine.reduce((a, p) => a + Math.cos((2 * Math.PI * p.at[i]) / MOD), 0)
    return ((Math.round((Math.atan2(s, k) * MOD) / (2 * Math.PI)) % MOD) + MOD) % MOD
  })
  // RANKED BY LIFT, NOT BY COUNT. The first run named imagined.lean and mechanical.lean as every cluster's nearest
  // neighbours — they hold 225 of the 632 points, so raw pair counts ranked clusters by SIZE. The expected number of
  // pairs, if neighbours were drawn at random, is 7·|this|·|that|/(N−1); a neighbour is reported by observed/expected,
  // and only with at least three observed pairs, so a lift near 1 reads as chance rather than as structure.
  const N = points.length
  const sizeOf = (f: string) => points.filter((q) => q.file === f).length
  const ranked = [...weight].map(([file, pairs]) => { const expected = (RAYS * mine.length * sizeOf(file)) / (N - 1); return { file, pairs, expected: +expected.toFixed(2), lift: +(pairs / expected).toFixed(2) } })
    .filter((x) => x.pairs >= 3).sort((a, b) => b.lift - a.lift || a.file.localeCompare(b.file))
  return { centre, within: +within.toFixed(2), between: +between.toFixed(2), top: ranked.slice(0, 3), chanceShare: chanceShare(c.file), nullMedian: nullMedian(c.file), shuffles: SHUFFLES }
}

// ── the publication ────────────────────────────────────────────────────────────────────────────────────────────
function deposition(c: Cluster) {
  const s = strands(c), j = joint(c), n = neighbours(c)
  const decided = c.sealed.filter((t) => t.tactic === 'by decide').length, proved = c.sealed.length - decided
  const note = front(c.file, 'prior_art_note'), kind = front(c.file, 'prior_art')
  const credits = creditedIn(c.file)
  const files = ['src/proof/' + c.file, ...closureOf(c.file).map((f) => 'src/proof/' + f)]
  const code = (t: string) => t.replace(/`([^`]+)`/g, '<code>$1</code>')
  const lede = [
    `${pl(c.sealed.length, 'machine-checked theorem', 'machine-checked theorems')} from the Lean 4 source file <code>src/proof/${c.file}</code>, `
      + `by Tsvetan Rouschev, licensed CC BY-NC-ND 4.0. Lean 4 is a proof checker: a theorem it accepts has been checked by its kernel, not argued in prose.`,
    decided ? `${decided === c.sealed.length ? (decided === 1 ? 'It is' : 'All are') : `${decided} ${decided === 1 ? 'is' : 'are'}`} checked case by case over a stated finite domain (<code>by decide</code>).` : '',
    proved ? `${proved === c.sealed.length ? (proved === 1 ? 'It is' : 'All are') : `${proved} ${proved === 1 ? 'is' : 'are'}`} proved for every value, on the standard axioms only (<code>propext</code>, <code>Quot.sound</code>; the verifier refuses any other).` : '',
    c.declarations.length ? `${c.declarations.length === 1 ? 'One further declaration closes' : `${c.declarations.length} further declarations close`} by <code>rfl</code>, checked by evaluation, and ${c.declarations.length === 1 ? 'is' : 'are'} not included here, by design.` : '',
    `Every theorem listed is sealed live in the deposit's ledger, where a withdrawal is marked in place; ${REMOVED} earlier rows removed on ${REMOVED_ON} are listed in <a href="${AT('src/proof/revoked.json')}">src/proof/revoked.json</a>.`,
  ].filter(Boolean).join(' ')
  const verdictLine = n.chanceShare >= 0.05 ? 'consistent with chance'
    : `above chance by this measure, though with ${pl(proven.length, 'cluster', 'clusters')} about ${(proven.length * 0.05).toFixed(2)} are expected there by chance alone`
  const html = [
    `<p><strong>${esc(c.title)}</strong>. ${lede}</p>`,
    `<p><strong>How these theorems are bound.</strong> "Entangled" is used here in a precise, non-quantum sense: theorems are bound when they derive from `
      + `shared definitions (section 1), when their files import one another (section 2), and when their content-addressed receipts fold into one address `
      + `that changes if any one of them changes (section 3). It is correlation by derivation; no information travels through it.</p>`,
    `<p><strong>1 · Shared definitions.</strong> ${pl(s.binding.length, 'definition is', 'definitions are')} used by two or more theorems, binding ${pl(s.edges, 'pair', 'pairs')}; `
      + `the theorems fall into ${pl(s.strands.length, 'strand', 'strands')}${s.strands.length > 1 ? `, the largest of ${s.strands[0].length}` : ''}.`
      + (s.binding.length ? ` Most binding: ${s.binding.slice(0, 6).map(([d, ns]) => `<code>${esc(d)}</code> (${ns.length})`).join(', ')}.` : '')
      + (s.loose.length ? ` ${pl(s.loose.length, 'theorem names', 'theorems name')} no definition of the file and ${s.loose.length === 1 ? 'stands' : 'stand'} on ${s.loose.length === 1 ? 'its' : 'their'} own statement.` : '') + `</p>`,
    `<p><strong>2 · Imports.</strong> Built on: ${importsOf(c.file).map((f) => `<code>${f}</code>`).join(', ') || 'no other cluster'}. `
      + `Built on it: ${dependentsOf(c.file).map((f) => `<code>${f}</code>`).join(', ') || 'no other cluster'}. Checking this cluster needs ${pl(files.length, 'file', 'files')}: <code>${files.join('</code>, <code>')}</code>.</p>`,
    `<p><strong>3 · The joint address.</strong> The ${pl(c.sealed.length, 'sealed receipt folds', 'sealed receipts fold')} to <code>${j.root}</code>. `
      + `Order-invariant: ${j.orderInvariant ? 'yes — the same root in reverse order' : 'NO'}. Altering one receipt changes it: ${j.bindsEveryReceipt ? 'yes, computed when this record was generated' : 'NO'}. `
      + `A content-address proves integrity, not truth.</p>`,
    `<p><strong>4 · The address lattice.</strong> Each theorem sits at the seven ray values its page plots from its receipt, taken mod 9: a point of (ℤ/9)⁷. `
      + `This cluster's centre is (${n.centre.join(', ')}). Its nearest clusters, ranked by lift — pairs counted from this cluster's theorems' seven nearest points, over the pairs expected by chance from the two clusters' sizes: `
      + `${n.top.map((x) => `<code>${x.file}</code> (${x.pairs} observed, ${x.expected} expected, lift ${x.lift})`).join(', ') || 'none with three or more pairs'}. `
      + `A best lift is the largest of about ${fileList.length - 1} small ratios, so chance alone gives a typical best lift of ${n.nullMedian} here (the median over ${n.shuffles} seeded reshufflings of which cluster each point belongs to); `
      + `one at least as high as this cluster's arose in ${(n.chanceShare * 100).toFixed(1)}% of them — ${verdictLine}. `
      + `Mean distance between two of its theorems: ${n.within}; from one of its theorems to a theorem of another cluster: ${n.between}. `
      + `A receipt is a hash, so nearness on this lattice is a property of the addresses, not of the mathematics; the mathematical binding is (1) and (2). `
      + `These figures are as of commit <code>${HEAD.slice(0, 12)}</code> (${HEAD_DATE}), over ${points.length} points; a new seal anywhere moves them.</p>`,
    `<p><strong>Prior art.</strong> ${note ? code(esc(sentence(note))) : `The file declares its prior art as ${esc(kind || 'unclassified')}, with no named source.`}`
      + `${credits.size ? ` Credited per theorem: ${[...credits].map(([t, cr]) => `<code>${esc(t)}</code> — ${code(esc(cr))}`).join('; ')}.` : ''}`
      // A PERMANENT RECORD CARRIES NO TALLY THAT WILL CHANGE: the per-theorem searches live in a ledger searched again as sources allow.
      + ` Per-theorem prior-art searches — OEIS, zbMATH Open, OpenAlex, Crossref, arXiv — are recorded, with what was searched, where and when, `
      + `in the living ledger <a href="${REPO}/blob/main/src/proof/novelty.json">src/proof/novelty.json</a> (main branch). No novelty is claimed here.</p>`,
    `<p><strong>The theorems.</strong></p><ol>${c.sealed.map((t) => `<li><code>${esc(t.name)}</code> — <code>${esc(t.statement.length > 400 ? t.statement.slice(0, 400) + ' …' : t.statement)}</code> `
      + `<a href="${SITE}/theorem/${keyOf(t)}">record</a></li>`).join('')}</ol>`,
    `<p><strong>Recompute.</strong> Clone <a href="${REPO}">${REPO}</a> at commit <code>${HEAD.slice(0, 12)}</code> and run <code>npm ci && npm run lean</code>, `
      + `which checks every Lean file in dependency order. This record was generated by <a href="${AT('scripts/clusters.ts')}">scripts/clusters.ts</a> from the source and the ledger.</p>`,
    `<p><strong>Licence.</strong> CC BY-NC-ND 4.0 — free for non-commercial use with attribution to Tsvetan Rouschev; commercial use by arrangement with the author.</p>`,
  ].join('')
  return {
    upload_type: 'publication', publication_type: 'preprint',
    title: `${c.title} — ${pl(c.sealed.length, 'machine-checked theorem', 'machine-checked theorems')} and how they are bound`,
    creators: zen.creators, description: html, license: zen.license, access_right: zen.access_right ?? 'open', language: 'eng',
    keywords: ['Lean 4', 'machine-checked proof', 'formal verification', 'modular arithmetic', 'content-addressing', 'theorem cluster', c.file.replace('.lean', '')],
    communities: zen.communities ?? [],
    related_identifiers: [
      { identifier: CONCEPT_DOI, relation: 'isPartOf', scheme: 'doi' },
      { identifier: AT(`src/proof/${c.file}`), relation: 'isSupplementTo', scheme: 'url' },
      ...importsOf(c.file).map((f) => ({ identifier: AT(`src/proof/${f}`), relation: 'references', scheme: 'url' })),
      ...c.sealed.map((t) => ({ identifier: `${SITE}/theorem/${keyOf(t)}`, relation: 'hasPart', scheme: 'url' })),
    ],
    notes: `cluster ${c.file} · ${c.sealed.length} sealed · joint address ${j.root} · figures as of commit ${HEAD.slice(0, 12)} (${HEAD_DATE}) · `
      + `concept DOI ${CONCEPT_DOI} · generated by scripts/clusters.ts`,
    files,
    cluster: { file: c.file, wing: c.wing, sealed: c.sealed.length, decided, proved, declarations: c.declarations.length, joint: j, strands: s.strands.length,
      binding: s.binding.slice(0, 12).map(([d, ns]) => ({ def: d, theorems: ns.length })), imports: importsOf(c.file), dependents: dependentsOf(c.file), lattice: n, asOf: HEAD },
  }
}

// ── run ────────────────────────────────────────────────────────────────────────────────────────────────────────
const proven = clusters.filter((c) => c.proven)
const unproven = clusters.filter((c) => !c.proven)
const out = proven.map((c) => ({ c, d: deposition(c) }))
console.log(`clusters: ${clusters.length} Lean source files · proven (every sealable declaration sealed live): ${proven.length}`)
for (const c of unproven) console.log(`  ○ not proven, no publication: ${c.file} — ${c.sealed.length} of ${c.theorems.length - c.declarations.length} sealed`)
for (const { c, d } of out) {
  const k = d.cluster
  console.log(`  ${c.file.padEnd(18)} ${String(k.sealed).padStart(3)} sealed · ${String(k.strands).padStart(2)} strand(s) · joint ${k.joint.root.slice(0, 13)}… · `
    + `binds every receipt ${k.joint.bindsEveryReceipt ? '✓' : '✗'} · lattice neighbours by lift ${k.lattice.top.map((x) => `${x.file.replace('.lean', '')}(${x.pairs}/${x.expected}=${x.lift})`).join(' ') || '—'} · within ${k.lattice.within} / between ${k.lattice.between} · chance ${k.lattice.chanceShare} (typical best ${k.lattice.nullMedian})`)
}
{
  const above = out.filter(({ d }) => d.cluster.lattice.chanceShare < 0.05).map(({ c }) => c.file)
  console.log(`lattice: ${above.length} of ${out.length} cluster(s) have a best lift reached by fewer than 5% of ${SHUFFLES} reshufflings`
    + `${above.length ? ` (${above.join(', ')})` : ''} — about ${(out.length * 0.05).toFixed(2)} are expected there by chance alone`)
}
if (process.argv.includes('--write')) {
  rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true })
  for (const { c, d } of out) writeFileSync(`${OUT}/${c.file.replace('.lean', '')}.json`, JSON.stringify(d, null, 2) + '\n')
  writeFileSync(`${OUT}/_index.json`, JSON.stringify({ concept_doi: CONCEPT_DOI, generated_by: 'scripts/clusters.ts', prepared_not_uploaded: true,
    clusters: out.map(({ c, d }) => ({ file: c.file, title: d.title, wing: c.wing, sealed: d.cluster.sealed, joint: d.cluster.joint.root, neighbours: d.cluster.lattice.top })) }, null, 2) + '\n')
  console.log(`✓ clusters: ${out.length} publication draft(s) → ${OUT}/ (prepared, not uploaded)`)
}
if (out.some(({ d }) => !d.cluster.joint.bindsEveryReceipt || !d.cluster.joint.orderInvariant)) { console.log('✗ clusters: a joint address failed to bind or to be order-invariant'); process.exit(1) }
