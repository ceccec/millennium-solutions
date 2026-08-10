#!/usr/bin/env node
// sw-integrity — after the site builds, SHA-256 every emitted file and write the manifest the service worker
// verifies against (dist/sw-integrity.json). The SW treats the transport as ASSUMED INSECURE and refuses any
// asset whose bytes don’t match this manifest — cryptographic tamper-detection with a pure-TS SHA-256, no
// native crypto. Integrity, not confidentiality. 0/7. Runs as postdocs:build (dist must already exist).
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import { sha256 } from '../src/0/sha256.ts'

const DIST = '.vitepress/dist'
const BASE = '/millennium-solutions/'
if (!existsSync(DIST)) { console.log('sw-integrity: no dist yet — skipping'); process.exit(0) }

const toh = (u: Uint8Array) => { let h = ''; for (const b of u) h += b.toString(16).padStart(2, '0'); return h }
const walk = (dir: string, out: string[] = []): string[] => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p)
  }
  return out
}

const SKIP = new Set(['sw.js', 'sw-integrity.json'])
const manifest: Record<string, string> = {}
let n = 0
for (const file of walk(DIST)) {
  const rel = relative(DIST, file).split('\\').join('/')
  if (SKIP.has(rel)) continue
  manifest[BASE + rel] = toh(sha256(new Uint8Array(readFileSync(file))))
  n++
}
writeFileSync(join(DIST, 'sw-integrity.json'), JSON.stringify(manifest) + '\n')
console.log('sw-integrity: SHA-256 manifest of ' + n + ' files → ' + DIST + '/sw-integrity.json (the SW refuses any mismatch)')
