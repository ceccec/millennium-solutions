/** ── GENERATED PROSE MUST AGREE WITH ITS GENERATOR ─────────────────────────────────────────────────────────
 *
 *  README.md, index.md and paper.md carry 37 of the 39 full UUIDs in this repository's prose — trial roots,
 *  content-addresses, receipt tips. Every one is computed by scripts/pages.ts at build time and stored
 *  nowhere else, so there is no artefact to check them against. What CAN be checked is that the committed
 *  text is what the generator produces: run it, and require nothing to move.
 *
 *  WHAT THIS GATE DOES NOT DO, stated because the first version of it pretended otherwise. I sent three
 *  fabricated constants to peer repositories today — a SHA-256 label over FNV-1a code, a pinned test vector
 *  whose halves did not correspond, and a UUID typed into the very message announcing the rule against typing
 *  UUIDs. NONE of those would be caught here. They were not in the repository at all; they were in prose sent
 *  to other people, which no gate in this tree can reach.
 *
 *  The first version of this gate DID claim to reach it, by requiring every UUID in prose to appear in a
 *  stored artefact. Measured: 38 of 39 "failures", 37 of them generated values that are correct and simply
 *  not stored anywhere. A gate whose true-positive rate is 1 in 39 does not protect a surface, it retrains
 *  the reader to skip it. The honest scope is this one, and the peer-message surface stays a discipline
 *  rather than a check: send the PATH and the FIELD, never the value. */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const GENERATED = ['README.md', 'index.md', 'paper.md']
// CAPTURE BEFORE REGENERATING. The first version ran pages.ts and then asked git what had changed — but
// pages.ts REPAIRS a hand-edited constant, so by the time git was consulted the tree was clean again and the
// gate passed. gates-fire caught it in one run: "ACCEPTS a hand-written constant — this gate is not
// protecting anything". A gate that fixes the defect before looking for it reports green, for the same
// reason an empty extractor does.
const before = new Map(GENERATED.map((f) => [f, readFileSync(f, 'utf8')]))
execSync('npx tsx scripts/pages.ts', { stdio: 'ignore' })
const unexpected = GENERATED.filter((f) => readFileSync(f, 'utf8') !== before.get(f))

if (unexpected.length) {
  console.log(`  ✗ ${unexpected.join(', ')} disagree(s) with scripts/pages.ts`)
  console.log(`      The committed text is not what the generator produces. Either a value was edited by hand`)
  console.log(`      — every constant in these files is computed, so a hand-written one is fabricated — or the`)
  console.log(`      tree moved and the pages were not regenerated. Run: npm run pages`)
  process.exit(1)
}
const n = Number(execSync(`grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' ${GENERATED.join(' ')} | wc -l`).toString().trim())
console.log(`✓ constants-gate: ${n} generated constant(s) across ${GENERATED.length} files reproduce from scripts/pages.ts`)
