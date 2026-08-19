// Align the published package to EXACTLY 64 KiB (65536 bytes) unpacked, to the byte.
// The reserve is REPRODUCIBLE content-addresses (toUuid of "uuidna:reserve:<i>") — a self-hosted reserve for
// cryptography-goal development, NOT random padding: every line recomputes. Run `node reserve.mjs` after build.
// Verify: `npm pack --dry-run --json` → unpackedSize === 65536.
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { toUuid } from './dist/index.js'

// The target is DERIVED, never typed: the smallest power of two that fits the package. A hardcoded 64 KiB
// held only while the content was smaller than it, and broke silently the moment the CLI, the bundles and the
// generated reference pushed the base past it — an alignment that cannot be met is not an invariant. The
// declared property is now "aligned to an exact power of two", which survives growth: when the base outgrows
// one boundary the next is taken, and the file still lands on the byte.
const RESERVED = 'reserved.uuidna'
const nextPow2 = (n) => { let p = 1; while (p < n) p *= 2; return p }
const KiB = (n) => (n / 1024).toFixed(0) + ' KiB'

const header = (target) =>
`# uuidna reserved space - this package is aligned to EXACTLY ${KiB(target)} (${target} bytes) unpacked, a power of two.
# Below: reproducible content-addresses (toUuid of "uuidna:reserve:<i>"), a self-hosted reserve for the
# cryptography-goal development - NOT random padding; every line recomputes. Regenerate with reserve.mjs.
`

const measure = () => JSON.parse(execSync('npm pack --dry-run --json', { encoding: 'utf8' }))[0]

// learn the base size (everything except the reserve) by measuring with an empty reserve
writeFileSync(RESERVED, '')
let j = measure()
const rEntry = j.files.find((f) => f.path === RESERVED)
const base = j.unpackedSize - (rEntry ? rEntry.size : 0)

// the boundary: the smallest power of two that leaves room for the reserve's own header
let TARGET = nextPow2(base)
const HEADER = () => header(TARGET)
while (TARGET - base < HEADER().length) TARGET *= 2

const R = TARGET - base
// fill: header + content-addresses, ASCII (1 char = 1 byte), truncated to EXACTLY R bytes
let body = HEADER()
for (let i = 0; body.length < R; i++) body += toUuid('uuidna:reserve:' + i) + '\n'
body = body.slice(0, R)
writeFileSync(RESERVED, body)

j = measure()
console.log('base:', base, '· reserve:', R, '· unpacked:', j.unpackedSize, '· exact', KiB(TARGET) + ':', j.unpackedSize === TARGET)
if (j.unpackedSize !== TARGET) throw new Error('NOT exact: ' + j.unpackedSize + ' (target ' + TARGET + ')')
