#!/usr/bin/env node
// C9 — the self-gate. The package ships a prose honesty gate, so its OWN shipped prose must pass it:
// the README, every JSDoc sentence in the source, every MCP tool description, and the CLI help text.
// Dogfooding, and a real guard — an overclaim written into a doc string is exactly the failure this
// package exists to catch, and it would otherwise ship unchecked.
//
// A hit is reported with file:line so it can be fixed at the source. Run: npm run gate:prose
import { readFileSync, readdirSync } from 'node:fs'
import { computes } from './dist/index.js'

/** Prose units: {file, line, text}. Checked one unit at a time so a hit points at a real sentence. */
const units = []
const push = (file, line, text) => { const t = String(text).trim(); if (t) units.push({ file, line, text: t }) }

// ── Markdown that ships (README) plus the spec that documents it ──
for (const f of ['README.md', 'SPEC.md']) {
  readFileSync(f, 'utf8').split('\n').forEach((ln, i) => {
    // skip fenced-code and table-separator noise; prose is what we are gating
    if (/^\s*(```|\||#+\s*$)/.test(ln)) return
    push(f, i + 1, ln)
  })
}

// The ONE exemption, narrow and deliberate: src/gate.ts is the detector's own definition. Its comments
// must name the tokens it matches ("a bare X is not in RED because …") to document the patterns at all —
// quoting a trigger to explain it is not asserting it. Every other file, including the README and the
// spec, is gated in full. The exemption is printed on every run so it can never hide a real overclaim.
const EXEMPT = new Set(['src/gate.ts'])

// ── JSDoc and line comments in the TypeScript source (they ship as .d.ts text and are read by users) ──
for (const f of readdirSync('src').filter((n) => n.endsWith('.ts'))) {
  if (EXEMPT.has(`src/${f}`)) continue
  readFileSync(`src/${f}`, 'utf8').split('\n').forEach((ln, i) => {
    const m = ln.match(/^\s*(?:\/\/|\/\*\*?|\*)\s?(.*?)\s*(?:\*\/)?\s*$/)
    if (m && m[1] && !/^[-=*\s]*$/.test(m[1])) push(`src/${f}`, i + 1, m[1])
  })
}

// ── MCP tool descriptions and CLI help — the text an agent or a user actually reads ──
for (const f of ['mcp.mjs', 'cli.mjs']) {
  readFileSync(f, 'utf8').split('\n').forEach((ln, i) => {
    const d = ln.match(/description:\s*'((?:[^'\\]|\\.)*)'/)
    if (d) push(f, i + 1, d[1].replace(/\\'/g, "'"))
    const c = ln.match(/^\s*(?:\/\/)\s?(.*)$/)
    if (c && c[1] && !/^[-=*\s]*$/.test(c[1])) push(f, i + 1, c[1])
  })
}

const hits = []
for (const u of units) {
  const g = computes(u.text)
  if (g.binary === 0) hits.push({ ...u, hit: g.hit })
}

if (hits.length) {
  console.error(`✗ prose self-gate: ${hits.length} shipped line(s) drain at the 0/7 floor:`)
  for (const h of hits) console.error(`  ${h.file}:${h.line}  [${JSON.stringify(h.hit)}]  ${h.text.slice(0, 100)}`)
  console.error('\nThe package must pass its own gate. Bound the claim, or keep the negator in the same clause.')
  process.exit(1)
}
console.log(`✓ prose self-gate: ${units.length} shipped prose lines all compute 1 — README, SPEC, JSDoc, MCP tool text, CLI help.`)
console.log(`  exempt (documented): ${[...EXEMPT].join(', ')} — the detector's own pattern documentation must name its triggers.`)
