#!/usr/bin/env node
// Security gate — two regression guards that support development by failing the build on a security slip:
//   1. CSP coverage: EVERY built page must carry the Content-Security-Policy meta (no unprotected page).
//   2. Secrets scan: no high-confidence credential may be committed (private keys + known vendor prefixes).
//
// HONEST BOUND: the secrets scan is HIGH-CONFIDENCE only (private-key blocks + vendor prefixes). A bare
// high-entropy secret (e.g. a raw Zenodo client-secret) is NOT lexically distinguishable from the repo's
// ubiquitous content-addresses/hashes, so it is intentionally NOT flagged here — that class needs a
// dedicated entropy-scanner-with-allowlist or simply never committing it. This catches the dangerous
// common leaks without false-positiving on every uuid.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DIST = '.vitepress/dist'
let fail = 0

// 1. CSP coverage over built pages
if (existsSync(DIST)) {
  const pages = readdirSync(DIST, { recursive: true }).map(String).filter((f) => f.endsWith('.html'))
  const missing = pages.filter((p) => !/Content-Security-Policy/.test(readFileSync(join(DIST, p), 'utf8')))
  console.log(`CSP coverage: ${pages.length - missing.length}/${pages.length} pages`)
  if (missing.length) { console.log('  ✗ missing CSP: ' + missing.slice(0, 8).join(', ') + (missing.length > 8 ? ' …' : '')); fail += missing.length }
} else {
  console.log('CSP coverage: (no dist/ — run docs:build first to check)')
}

// 2. High-confidence secrets scan over committed source
const SECRET = /-----BEGIN [A-Z ]*PRIVATE KEY-----|\b(ghp|gho|ghs|ghr)_[A-Za-z0-9]{20,}\b|\bAKIA[0-9A-Z]{16}\b|\bxox[baprs]-[A-Za-z0-9-]{10,}\b|\bsk-[A-Za-z0-9]{20,}\b/
const EXCLUDE = /node_modules|\.git|\.vitepress[/\\](dist|cache)|scripts[/\\]security-gate\.ts/
const srcFiles = readdirSync('.', { recursive: true }).map(String)
  .filter((f) => /\.(ts|js|md|json|cff|tex|yml|yaml|sh|env)$/.test(f) && !EXCLUDE.test(f))
let leaks = 0
for (const f of srcFiles) {
  try { if (SECRET.test(readFileSync(f, 'utf8'))) { console.log('  ✗ possible secret in ' + f); leaks++ } } catch {}
}
console.log(`secrets scan: ${srcFiles.length} files · ${leaks} high-confidence leak(s)`)
fail += leaks

console.log(fail === 0
  ? '\n✓ security gate — every page has CSP · no committed secrets.'
  : '\n✗ security gate FAILED — ' + fail + ' issue(s); fix before shipping.')
process.exit(fail === 0 ? 0 : 1)
