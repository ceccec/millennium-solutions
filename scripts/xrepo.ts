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
const shaped = (statement: string): string => {
  const b = [...Buffer.from(mergeKey(statement), 'hex').subarray(0, 16)]
  b[6] = (b[6] & 0x0f) | 0x80
  b[8] = (b[8] & 0x3f) | 0x80
  const h = b.map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

// Every peer corpus that publishes the shared key, not just the first one that did. A cross-repo collision
// check over ONE peer measures one edge; the surface is every pair of repositories addressing claims.
const SOURCES: { name: string; path: string }[] = [
  { name: 'erpax', path: homedir() + '/.erpax/fusion/erpax.results.json' },
  { name: 'ceccec.github.io', path: homedir() + '/github/ceccec/ceccec.github.io/src/research/statement-manifest.json' },
  { name: 'zeropoint-node', path: homedir() + '/.erpax/fusion/zeropoint-node.jsonl' },
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
      rows = Array.isArray(raw) ? raw : (raw.results ?? raw.statements ?? [])
    }
  } catch { console.log(`  ○ ${src.name}: no manifest at ${src.path} — not counted, not assumed empty`); continue }
  let n = 0
  for (const r of rows) {
    const uuid = r.statementUuidCrossRepo ?? r.statementUuid
    if (!uuid) continue
    const text = String(r.claim ?? r.statement ?? r.title ?? '?')
    theirs.set(uuid, text)
    origin.set(uuid, src.name)
    if (!probe) probe = { claim: text, statementUuid: uuid }
    n++
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
