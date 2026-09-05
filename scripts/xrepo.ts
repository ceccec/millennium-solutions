/** Cross-repo statement-address collision check against erpax's v3 manifest.
 *
 *  The point is the IDENTIFIER layer, not the content layer: two repositories independently addressing their
 *  own claims can mint the same address for different statements, and no content scan inside either repo can
 *  see it. My previous run of this reported "0 collisions" while contributing ZERO addresses from this side —
 *  the ledger stores {key, name, receipt} and no statementUuid, so the comparison was 45 against an empty
 *  set. A zero that cannot go non-zero is not a measurement, so this run carries a control that must fire. */
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { createHash } from 'node:crypto'
import { ledger } from '../src/api/index.ts'
import { mergeKey } from '../src/publication/index.ts'

// erpax shapes its sha256 into a v8 UUID; this is the same shaping src/0/toUuid applies, over sha256 bytes
// instead of FNV bytes, so the two sides are comparable on the merge key we both adopted.
const shapeHex = (hex: string): string => {
  const b = [...Buffer.from(hex, 'hex').subarray(0, 16)]
  b[6] = (b[6] & 0x0f) | 0x80
  b[8] = (b[8] & 0x3f) | 0x80
  const h = b.map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}
const shaped = (statement: string): string => {
  const b = [...Buffer.from(mergeKey(statement), 'hex').subarray(0, 16)]
  b[6] = (b[6] & 0x0f) | 0x80
  b[8] = (b[8] & 0x3f) | 0x80
  const h = b.map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

// Every peer corpus that publishes the shared key, not just the first one that did. A cross-repo collision
// check over ONE peer measures one edge; the surface is every pair of repositories addressing claims.
const SOURCES: { name: string; path: string; textOnly?: boolean }[] = [
  { name: 'erpax', path: homedir() + '/.erpax/fusion/erpax.results.json' },
  { name: 'ceccec.github.io', path: homedir() + '/github/ceccec/ceccec.github.io/src/research/statement-manifest.json' },
  { name: 'zeropoint-node', path: homedir() + '/.erpax/fusion/zeropoint-node.jsonl' },
  { name: 'uuidna', path: homedir() + '/github/uuidna/uuidna/docs/public/statement-addresses.json' },
  // TEXT-ONLY manifests: these publish the claim and no address, so the address is computed HERE with this
  // deposit's rule. That is still a sound comparison — both sides are then one function — but it is a
  // different kind of evidence from a published pin that a peer independently reproduced, and it is labelled
  // so. Surfaced by scripts/leads.ts, which found eight manifests on disk that this join had never read.
  { name: 'aequator', path: homedir() + '/.erpax/fusion/aequator.jsonl', textOnly: true },
  { name: 'ceccec.github.io (fusion)', path: homedir() + '/.erpax/fusion/ceccec.github.io.jsonl', textOnly: true },
  { name: 'erpax (fusion)', path: homedir() + '/.erpax/fusion/erpax.jsonl', textOnly: true },
  { name: 'uuidna (fusion)', path: homedir() + '/.erpax/fusion/uuidna.jsonl', textOnly: true },
  // A METRICS FACE IS STILL A CLAIM CORPUS. I nearly dismissed this one as noise in the leads report
  // because the filename says "metrics" — it carries 15 rows each with a `claim`, about erpax's own gates.
  // The detector was right and my reading of it was wrong; dismissing a lead by its NAME is the same defect
  // as matching a defect by its name.
  { name: 'erpax (metrics)', path: homedir() + '/.erpax/fusion/erpax.metrics.json', textOnly: true },
  // millennium-solutions.jsonl and millennium-solutions.metrics.json are THIS repository's own corpora,
  // exported by a peer. Joining it would
  // compare the ledger against itself and report self-matches as cross-repository collisions — a number
  // that would look alarming and mean nothing. Excluded by name, and the exclusion is stated rather than
  // silent, because an unexplained absence in a source list is indistinguishable from an oversight.
]
const theirs = new Map<string, string>()
const origin = new Map<string, string>()
let probe: { claim: string; statementUuid: string } | null = null
for (const src of SOURCES) {
  let rows: any[]
  try {
    const text = readFileSync(src.path, 'utf8')
    // JSONL or JSON. zeropoint-node emits one object per line and publishes BOTH addresses per row —
    // `statementUuidLocal` under its own normaliser (which lowercases; this one does not) and
    // `statementUuidCrossRepo` under the rule shared here. Only the cross-repo column may be joined on;
    // reading the local one would compare two different functions and call the result a collision count.
    if (src.path.endsWith('.jsonl')) {
      rows = text.split('\n').filter(Boolean).map((l) => JSON.parse(l))
    } else {
      const raw = JSON.parse(text)
      rows = Array.isArray(raw) ? raw : (raw.results ?? raw.statements ?? raw.rows ?? [])
    }
  } catch { console.log(`  ○ ${src.name}: no manifest at ${src.path} — not counted, not assumed empty`); continue }
  let n = 0
  for (const r of rows) {
    // uuidna publishes `sha256` of the normalised bytes rather than a UUID, and its own `address` uses a
    // different framing (toUuid("proposition:" + normalised)). Only the sha256 column is comparable, so it is
    // shaped here with the same §5.8 nibbles the others use. Its normaliser was measured against this one
    // across all 2,626 of its rows before any join: agreement on every row.
    const text = String(r.claim ?? r.statement ?? r.title ?? '?')
    const uuid = src.textOnly ? shaped(text)
      : (r.statementUuidCrossRepo ?? r.statementUuid ?? (r.sha256 ? shapeHex(String(r.sha256)) : undefined))
    if (!uuid) continue
    theirs.set(uuid, text)
    origin.set(uuid, src.name)
    if (!probe) probe = { claim: text, statementUuid: uuid }
    n++
  }
  // A SOURCE THAT CONTRIBUTES ZERO IS A MISSING OPERAND, NOT A SMALL CORPUS. uuidna's manifest nests its
  // rows under `rows`, a key this reader did not know, so it loaded 2,626 statements as 0 and printed that
  // as an ordinary line. It is the same defect as my first cross-repo zero — 45 addresses compared against
  // an empty set — one layer up: the file was found, parsed, and silently emptied. A peer file that yields
  // no addresses now refuses the whole run rather than quietly shrinking the comparison.
  if (n === 0) {
    console.log(`✗ xrepo: ${src.name} parsed but yielded 0 statement addresses from ${src.path}`)
    console.log(`  A readable manifest with no rows is a reader that does not know its shape, not an empty`)
    console.log(`  corpus. Refusing to report a collision count that silently excludes it.`)
    process.exit(1)
  }
  console.log(`  ${src.name}: ${n} statement addresses`)
}
if (!probe) { console.log('✗ xrepo: no peer manifest readable — refusing to report a zero over nothing'); process.exit(1) }

const mine = new Map<string, string>()
for (const e of ledger()) if (e.name) mine.set(shaped(e.name), e.name)

const collide = (t: Map<string, string>, m: Map<string, string>) =>
  [...t.keys()].filter((u) => m.has(u))

const hits = collide(theirs, mine)

// ── THE CONTROL: erpax's own first statement, addressed by MY code, must land on THEIR address. If it does
//    not, the two sides are not computing the same function and a zero above means nothing at all.
const probeAddr = shaped(String(probe.claim))
const agrees = probeAddr === probe.statementUuid

console.log(`  peers: ${theirs.size} statement addresses · this deposit: ${mine.size} from ${ledger().length} ledger names`)
console.log(`  control — erpax's own statement re-addressed by THIS code:`)
console.log(`      theirs ${probe.statementUuid}`)
console.log(`      mine   ${probeAddr}   ${agrees ? '✓ same function' : '✗ DIFFERENT FUNCTION — the comparison below is meaningless'}`)
if (!agrees) {
  console.log(`\n✗ xrepo: the two sides do not compute the same address for the same statement, so "0 collisions"`)
  console.log(`  would be a statement about two unrelated number spaces. Reporting nothing rather than a zero.`)
  process.exit(1)
}
// ── SECOND CONTROL: function agreement is not detection. Inject one of erpax's statements into MY set as
//    though this deposit had made the same claim, and require the comparison to find it. Without this, a
//    zero proves the two sides agree on a hash — not that a genuinely shared statement would surface.
const planted = new Map(mine)
planted.set(shaped(String(probe.claim)), 'PLANTED: ' + String(probe.claim).slice(0, 50))
const detects = collide(theirs, planted).length
console.log(`  control — erpax's statement planted into this deposit's set: ${detects ? `✓ detected (${detects})` : '✗ NOT DETECTED'}`)
if (!detects) {
  console.log(`\n✗ xrepo: the comparison cannot find a statement both sides make, so a zero means nothing.`)
  process.exit(1)
}

console.log(hits.length
  ? `  ✗ ${hits.length} COLLISION(S):\n${hits.map((h) => `      ${h}\n        ${origin.get(h)} : ${theirs.get(h)}\n        ceccec: ${mine.get(h)}`).join('\n')}`
  : `  collisions: 0 over ${theirs.size} × ${mine.size} — and the control above proves this zero could have been non-zero`)
process.exit(hits.length ? 1 : 0)
