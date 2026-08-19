#!/usr/bin/env node
// C10 — the API reference, generated from the BUILT .d.ts so it can never drift from the shipped types.
// Written by hand rather than pulled from a doc generator: the package ships zero runtime dependencies and
// the output needed here is small and deterministic (same input → same API.md → same content-address), so a
// ~100-line reader beats adding a large dev-dependency tree. Run: npm run docs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { toUuid } from './dist/index.js'

const pkg = JSON.parse(readFileSync('package.json', 'utf8'))

// Module → the one-line purpose shown as its section blurb (the entry file's own framing).
const BLURB = {
  address: 'The content-address itself, and the ℤ/9 vortex primitives derived from one axiom.',
  merkle: 'Holographic inclusion proofs — verify the whole from a tiny part, in O(log N).',
  gate: 'The prose honesty gate: a lexical tripwire that drains named overclaims. Necessary, not sufficient.',
  gravity: 'Decidable contractions — order-invariant folds. Not physics.',
  diamond: 'The involution r(d) = 10 − d and its lift to a list.',
  adjudicate: 'The trial — a recomputable three-way verdict, folded to one proof-of-verdict root.',
  harness: 'Make any output auditable; bound an overclaim until it holds.',
  imprint: 'A reversible codec that encodes text INTO uuids. Public and reversible — not encryption.',
  crypt: 'Authenticated encryption: ChaCha20-Poly1305 + PBKDF2-SHA256, convergent or randomized.',
  sha256: 'SHA-256, HMAC-SHA-256 and PBKDF2 — pure TypeScript, KAT-verified.',
  chacha: 'ChaCha20, Poly1305 and the AEAD construction (RFC 8439) — pure TypeScript.',
  billing: 'The measured billing model. Public interest is free.',
  render: 'Framework-free, CSP-safe HTML for presenting theorems by reference.',
}

/** Pull `export declare` items out of a .d.ts, each with the JSDoc immediately above it. */
function declarations(dts) {
  const out = []
  const lines = dts.split('\n')
  let doc = []
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i]
    if (/^\s*\/\*\*/.test(ln)) { doc = [ln.replace(/^\s*\/\*\*\s?/, '').replace(/\s*\*\/\s*$/, '')]; if (/\*\/\s*$/.test(ln)) { continue } ; continue }
    if (/^\s*\*/.test(ln) && !/^\s*\*\//.test(ln)) { doc.push(ln.replace(/^\s*\*\s?/, '')); continue }
    if (/^\s*\*\//.test(ln)) continue
    const m = ln.match(/^export declare (function|const) ([A-Za-z0-9_]+)(.*)$/)
      || ln.match(/^export (interface|type) ([A-Za-z0-9_]+)(.*)$/)
    if (m) {
      const [, kind, name, rest] = m
      // a signature can wrap; join until the line balances or ends with ; or {
      let sig = ln.replace(/^export (declare )?/, '').replace(/[{;]\s*$/, '').trim()
      out.push({ kind, name, sig, doc: doc.filter(Boolean).join(' ').trim() })
      doc = []
      continue
    }
    if (ln.trim()) doc = []
  }
  return out
}

const modules = readdirSync('dist')
  .filter((f) => f.endsWith('.d.ts') && f !== 'index.d.ts')
  .map((f) => f.replace(/\.d\.ts$/, ''))
  .sort()

let md = `# \`${pkg.name}\` — API reference

*Generated from the built \`.d.ts\` by \`docs.mjs\`; it cannot drift from the shipped types. Do not edit by hand.*

${pkg.description}

**Version** \`${pkg.version}\` (a held label — the content-address is the true latest) · **License** ${pkg.license} · ESM-only, zero runtime dependencies.

\`\`\`js
import { toUuid, computes, encrypt } from '${pkg.name}'
// or a subpath, to pull only what you need:
import { encrypt } from '${pkg.name}/crypt'
\`\`\`

A content-address proves **integrity, not truth**: the same input mints the same identifier for anyone, with no key. It does not assert the value is correct. \`0/7\`.

---

`

let count = 0
for (const mod of modules) {
  const decls = declarations(readFileSync(`dist/${mod}.d.ts`, 'utf8'))
  if (!decls.length) continue
  md += `## \`${mod}\`\n\n`
  if (BLURB[mod]) md += `${BLURB[mod]}\n\n`
  md += `| Export | Signature | Notes |\n|---|---|---|\n`
  for (const d of decls) {
    count++
    const sig = d.sig.replace(/\|/g, '\\|').replace(/^(function|const|interface|type) /, '')
    md += `| \`${d.name}\` | \`${sig}\` | ${(d.doc || '').replace(/\|/g, '\\|')} |\n`
  }
  md += '\n'
}

md += `---\n\n*${count} exports across ${modules.length} modules · receipt \`${toUuid(md)}\` · integrity, not truth · 0/7*\n`
writeFileSync('API.md', md)
console.log(`✓ docs: API.md — ${count} exports across ${modules.length} modules, generated from the built .d.ts`)
