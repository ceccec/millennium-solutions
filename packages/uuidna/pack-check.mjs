#!/usr/bin/env node
// C12 — the alignment gate. reserve.mjs pads the tarball to an exact power of two; this asserts it still
// holds, so a package that drifted off the boundary cannot be published. The target is derived, not typed:
// whatever power of two the reserve chose, the measured size must equal it exactly.
import { execSync } from 'node:child_process'

const j = JSON.parse(execSync('npm pack --dry-run --json', { encoding: 'utf8' }))[0]
const size = j.unpackedSize
const isPow2 = size > 0 && (size & (size - 1)) === 0

if (!isPow2) {
  console.error(`✗ alignment: unpacked ${size} bytes is not a power of two — run \`npm run reserve\` to re-pad.`)
  process.exit(1)
}
console.log(`✓ alignment: ${j.entryCount} files, unpacked ${size} bytes = ${(size / 1024).toFixed(0)} KiB exactly (2^${Math.log2(size)}).`)
