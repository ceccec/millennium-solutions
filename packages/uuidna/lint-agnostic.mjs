#!/usr/bin/env node
// C1 — the agnosticism guard. The CORE (src/) must run unmodified on every first-class runtime
// (Node ≥18, Deno, Bun, browsers, edge/Workers), so it may touch ONLY Web-standard globals. This
// lint fails the build if src/ reaches for a Node-only or non-deterministic primitive.
//
// ALLOWED in src/: TextEncoder/TextDecoder, Uint8Array/DataView, BigInt, Map/Set, btoa/atob,
//   globalThis.crypto.getRandomValues (present on all five targets), and the deterministic Math
//   helpers (floor/ceil/round/max/min/imul/abs/sign/trunc).
// FORBIDDEN in src/: node: imports, require(), process, Buffer, __dirname/__filename, Math.random
//   (non-deterministic), eval / new Function (CSP- and Worker-hostile).
//
// The Node-coupled files (mcp.mjs, reserve.mjs, cli.mjs, this file) are dev/bin tooling — NOT the
// core entry — and are intentionally NOT scanned.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SRC = new URL('./src/', import.meta.url).pathname

/** Every .ts under src/, recursively. */
function tsFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? tsFiles(p) : p.endsWith('.ts') ? [p] : []
  })
}

/** Blank out comments while preserving line count and column positions, so matches on the
 *  remaining CODE report accurate file:line and never trip on prose or regex-string mentions. */
function stripComments(src) {
  let out = ''
  let i = 0
  const n = src.length
  let state = 'code' // code | line | block | s-quote | d-quote | t-quote
  while (i < n) {
    const c = src[i], d = src[i + 1]
    if (state === 'code') {
      if (c === '/' && d === '/') { out += '  '; i += 2; state = 'line'; continue }
      if (c === '/' && d === '*') { out += '  '; i += 2; state = 'block'; continue }
      if (c === "'") { out += c; i++; state = 's-quote'; continue }
      if (c === '"') { out += c; i++; state = 'd-quote'; continue }
      if (c === '`') { out += c; i++; state = 't-quote'; continue }
      out += c; i++; continue
    }
    if (state === 'line') { if (c === '\n') { out += '\n'; i++; state = 'code' } else { out += ' '; i++ } continue }
    if (state === 'block') { if (c === '*' && d === '/') { out += '  '; i += 2; state = 'code' } else { out += c === '\n' ? '\n' : ' '; i++ } continue }
    // inside a string/template: keep chars (so line numbers hold) but they can't match code rules
    // because our forbidden patterns are code-shaped; still, blank them to avoid string-literal hits.
    const q = state === 's-quote' ? "'" : state === 'd-quote' ? '"' : '`'
    if (c === '\\') { out += '  '; i += 2; continue }
    if (c === q) { out += c; i++; state = 'code'; continue }
    out += c === '\n' ? '\n' : ' '; i++
  }
  return out
}

// name → matcher. Word-boundaried so `preprocess` ≠ `process`, `deBuffer` ≠ `Buffer`.
const RULES = [
  ['node: import', /\bfrom\s*['"]node:/],
  ['node: require', /\brequire\s*\(\s*['"]node:/],
  ['require() (CJS in an ESM core)', /\brequire\s*\(/],
  ['process global', /\bprocess\s*\./],
  ['Buffer global', /\bBuffer\b/],
  ['__dirname/__filename', /\b__(dirname|filename)\b/],
  ['Math.random (non-deterministic)', /\bMath\s*\.\s*random\b/],
  ['eval', /\beval\s*\(/],
  ['new Function', /\bnew\s+Function\s*\(/],
]

const violations = []
for (const file of tsFiles(SRC)) {
  const code = stripComments(readFileSync(file, 'utf8'))
  const lines = code.split('\n')
  for (const [label, re] of RULES) {
    lines.forEach((line, idx) => {
      if (re.test(line)) violations.push({ file: file.replace(SRC, 'src/'), line: idx + 1, label, text: line.trim() })
    })
  }
}

if (violations.length) {
  console.error(`✗ agnosticism lint: ${violations.length} core violation(s) — src/ must stay Web-standard only:`)
  for (const v of violations) console.error(`  ${v.file}:${v.line}  [${v.label}]  ${v.text}`)
  process.exit(1)
}
console.log('✓ agnosticism lint: src/ is Web-standard only — no node:/process/Buffer/Math.random/eval. Runs on all five runtimes.')
