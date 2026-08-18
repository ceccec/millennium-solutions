#!/usr/bin/env node
// C6 — the browser/CDN bundle. esbuild rolls src/ into two self-contained artifacts (no external
// imports, no eval → CSP-safe) for <script type=module>, unpkg, esm.sh, and jsDelivr:
//   dist/uuidna.esm.js  — minified ESM  (import { toUuid } from '.../uuidna.esm.js')
//   dist/uuidna.min.js  — minified IIFE (window.uuidna.toUuid(...))
// The core is Web-standard only (see lint-agnostic.mjs), so the same source bundles for every runtime.
import { build } from 'esbuild'
import { readFileSync, statSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
const banner = { js: `/*! @uuidna/uuidna v${pkg.version} — content-addressed identity, honest by construction. CC BY-NC 4.0 · Tsvetan Rouschev. Integrity, not truth. 0/7. */` }

const common = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  minify: true,
  target: 'es2020',
  platform: 'browser',
  charset: 'utf8',
  legalComments: 'none',
  banner,
}

const kib = (p) => (statSync(p).size / 1024).toFixed(1) + ' KiB'

await build({ ...common, format: 'esm', outfile: 'dist/uuidna.esm.js' })
await build({ ...common, format: 'iife', globalName: 'uuidna', outfile: 'dist/uuidna.min.js' })

// Guard: the artifacts must be self-contained (no bare import/require survives) and eval-free (CSP).
for (const f of ['dist/uuidna.esm.js', 'dist/uuidna.min.js']) {
  const src = readFileSync(f, 'utf8')
  if (/\brequire\s*\(/.test(src)) throw new Error(`${f}: contains require() — not self-contained`)
  if (/\beval\s*\(/.test(src)) throw new Error(`${f}: contains eval() — not CSP-safe`)
  if (f.endsWith('.esm.js') && /\bimport\s*[({]|\bfrom\s*['"]/.test(src.replace(banner.js, ''))) {
    throw new Error(`${f}: contains an external import — not self-contained`)
  }
}
console.log(`✓ bundle: dist/uuidna.esm.js (${kib('dist/uuidna.esm.js')}) · dist/uuidna.min.js (${kib('dist/uuidna.min.js')}) — self-contained, eval-free`)
