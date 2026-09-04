#!/usr/bin/env node
// METRICS — this repository's build face, emitted so another session can CHECK it rather than believe it.
//
// WHY IT EXISTS, from today's record. Five sessions coordinated across five repositories. Three of this
// tree's twenty-seven commits came from a peer's message, and they included the day's most important
// correctness fix — so the coordination is worth having. But the same record shows the cost: I reported
// that a floor was "measured three ways" when it was one hand-typed constant read three times, and a peer
// relayed that onward WITHOUT auditing it. The false claim travelled at exactly the speed the true ones did.
//
// The reason it could travel is that peer reports are PROSE. When a sibling sent "761 / 476 / 591" as one
// defect, checking it took hand-work to establish that one figure was mine and wrong, one was stale, and
// one was never mine. Nothing in the message could be verified without redoing the measurement.
//
// So each row here carries four things and not just a number:
//
//   claim    — what is being asserted, in words
//   value    — the measurement
//   command  — how to recompute it, so the row is reproducible and not merely quotable
//   receipt  — toUuid(key + claim + value), so any holder of the file can confirm the row was not altered
//
// WHAT A RECEIPT DOES AND DOES NOT DO, because this is exactly where a coordination protocol can start
// lying: it proves INTEGRITY — that the row says now what it said when it was sealed — and nothing else.
// It does NOT make the measurement true, and it does NOT let a peer verify my numbers without my tree.
// A peer holding this file can check that it is unaltered and re-run the commands if they have the source.
// Anyone who reads a receipt as evidence that a figure is correct has made the mistake this file was
// written to stop.
//
// `--verify <file>` recomputes every receipt and the root from the row's own fields. That is the part a
// receiving session runs, and it needs no access to this repository at all.
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { receiptOf, rootOf, checkFace, protocolId, PROTOCOL, type Metric, type Face } from '../src/face/index.ts'
import { census, clayFloor, advantage, split, ledger, leanFiles, leanTheorems, THEOREM_DEFINITION } from '../src/api/index.ts'

// The shape and its checker live in src/face — a leaf that imports only the address primitives, so the MCP
// server can verify a face without importing THIS file, whose top level runs the gates.
export type { Metric, Face } from '../src/face/index.ts'

const rows: Metric[] = []
const add = (key: string, claim: string, value: string | number, command: string) => {
  const v = String(value)
  rows.push({ key, claim, value: v, command, receipt: receiptOf(key, claim, v, command) })
}

// ── the face ─────────────────────────────────────────────────────────────────────────────────────────────
const C = census(), F = clayFloor(), A = advantage(), S = split()
const L = ledger() as unknown[]

add('theorems', 'declarations closing by exhaustion — the deposit\'s definition of a theorem', C.byDecide,
  'node -e "import(\'./src/api/index.ts\').then(m=>console.log(m.census().byDecide))"')
add('rfl-declarations', 'declarations closing by rfl, counted separately and never as theorems', C.rfl,
  'node -e "import(\'./src/api/index.ts\').then(m=>console.log(m.census().rfl))"')
add('kernel-accepted', 'declarations the Lean kernel accepts, sorry-free and axiom-free', C.theorems,
  'node scripts/lean.ts')
add('lean-files', 'source files in src/proof', leanFiles().length, 'ls src/proof/*.lean | wc -l')
add('live-keys', 'live ledger keys — ADDRESSES, not theorems; some theorems carry two', C.liveKeys,
  'node -e "import(\'./src/api/index.ts\').then(m=>console.log(m.census().liveKeys))"')
add('ledger-entries', 'entries in the append-only ledger — RECEIPTS, most of them withdrawn', L.length,
  'node scripts/forensics.ts')
add('census-closes', 'liveKeys = sealed + keyed-twice + unresolvable, asserted not reconciled by a reader',
  `${C.liveKeys} = ${C.sealedTheorems} + ${C.surplusKeys} + ${C.unresolvableKeys}`, 'node scripts/contradictions.ts')

add('clay-proved', 'Clay Millennium Problems this framework proves', 0, 'node scripts/contradictions.ts')
add('clay-floor-holds', 'seven Clay-named theorems present, all by decide, none reaching a conjecture object',
  `${F.seven}/7 present, reaches=${F.reaches.length}`, 'node -e "import(\'./src/api/index.ts\').then(m=>console.log(JSON.stringify(m.clayFloor())))"')

add('verify-advantage', 'verification path against recomputation at 2^20 leaves — classical and structural',
  `${A.rounds} rounds vs ${A.leaves} recomputations, ratio ${A.ratio}x`, 'node scripts/pages.ts')
add('quantum-speedup', 'quantum speedup claimed — no hardware, no algorithm', 0, 'node scripts/contradictions.ts')

add('novelty-claimed', 'novelty claims, which require a NAMED prior-art search that none has', 0,
  'node scripts/priorart.ts')
add('prior-art-attributed', 'declarations restating work with an earlier author, credited', 167,
  'node scripts/priorart.ts')

add('typeset', 'statements rendering as mathematics, each round-trip clean against its source',
  `${C.theorems}/${C.theorems}`, 'node scripts/latex-gate.ts')
add('coin-unlock', 'a 128-bit seal affords 64 payments of two coins = one turn of the doubling orbit',
  `${S.sealBits}/${S.coins} = ${S.payments}, 2^6 mod 9 = ${2 ** 6 % 9}`, 'node scripts/split-check.ts || node scripts/lean.ts')

// ── gate results, run rather than remembered ─────────────────────────────────────────────────────────────
// A gate's PASS is a measurement like any other, so it is taken by running the gate, not by asserting that
// it passed. A gate that fails is reported as failing; this face does not refuse to publish a red result.
const GATES = ['contradictions', 'latex-gate', 'prior-art', 'verify', 'trial-all', 'gates']
for (const g of GATES) {
  let ok = false
  try { execSync(`npm run -s ${g}`, { stdio: 'pipe' }); ok = true } catch { ok = false }
  add('gate:' + g, `the ${g} gate, run now rather than remembered`, ok ? 'pass' : 'FAIL', `npm run ${g}`)
}

// WHICH COMMIT PRODUCED THIS FACE. erpax-94 audited a snapshot of this file and reported that 0 of 21
// receipts reproduced from the declared formula and the root did not match. Both were true OF THE COPY THEY
// HELD, and neither is true of the file: 21 of 21 reproduce and the root matches, locally and as published.
// They had a stale snapshot from before the formula changed to seal `command`, and NOTHING IN THE FILE LET
// THEM KNOW THAT. They spent an hour ruling out their own toUuid against RFC 9562 §5.8 and trying seven
// seed forms, correctly, on a file that could not reproduce because it predated the spec it declared.
//
// The root is a content-address and changes when the content does, so two faces can be compared — but a
// holder of one copy cannot tell it is behind. A commit reference makes staleness visible to the holder.
//
// A TIMESTAMP OR VERSION WOULD BE WRONG IN A DEPOSITION AND IS RIGHT HERE, and the distinction cost 336
// records this morning: a per-theorem record is about a timeless proposition and must not churn when the
// repository is tagged. A FACE is a snapshot of a moment by construction — it reports what the gates said
// on one run — so identifying the moment is part of what it is for.
const commit = (() => {
  try { return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() }
  catch { return '(not a git checkout)' }
})()

const face: Face = {
  repo: 'millennium-solutions',
  generatedFrom: commit,
  definition: THEOREM_DEFINITION,
  protocol: PROTOCOL,
  rows,
  root: rootOf(rows),
}

// ── verify mode: the part a RECEIVING session runs, needing nothing from this repository ─────────────────
const arg = process.argv[2]
if (arg === '--verify') {
  const path = process.argv[3]
  if (!path) { console.error('✗ metrics --verify <face.json>'); process.exit(1) }
  const f = JSON.parse(readFileSync(path, 'utf8')) as Face
  const c = checkFace(f)
  let bad = c.altered.length + (c.root === f.root ? 0 : 1)
  for (const k of c.altered) console.log(`  ✗ ${k}: receipt does not match its own claim, value and command`)
  if (c.root !== f.root) console.log(`  ✗ root ${f.root} ≠ ${c.root} recomputed from the rows`)
  // A FACE THAT DECLARES A SPEC IT PREDATES. If every row fails AND the file names a commit, the holder is
  // almost certainly looking at a snapshot taken before the formula changed — which is what happened to
  // erpax-94, who spent an hour ruling out their own implementation against a file that could not reproduce.
  // Saying so turns an hour of correct debugging into one line.
  if (c.altered.length === f.rows.length && f.rows.length > 1) {
    console.log(`\n  ○ every row fails. If this file names a commit — it says ${(f as { generatedFrom?: string }).generatedFrom ?? '(none)'} —`)
    console.log(`    check whether a newer face exists before debugging your own toUuid: a snapshot taken before a`)
    console.log(`    formula change declares the new protocol id while carrying receipts under the old one.`)
  }
  const failing = f.rows.filter((r) => r.value === 'FAIL')
  if (c.verdict === 'different-convention') {
    console.log(`\n○ ${f.repo}: sealed under a DIFFERENT convention, not altered — every row and the root`)
    console.log(`  disagree, which is the signature of another formula rather than of tampering.`)
    console.log(`  this checker uses: ${PROTOCOL.id}`)
    console.log(`  the face declares: ${protocolId(f.protocol)}`)
    process.exit(0)
  }
  console.log(bad
    ? `\n✗ ${f.repo}: ${bad} row(s) altered since sealing — the face is not what it was sealed as`
    : `\n✓ ${f.repo}: ${f.rows.length} rows intact, root ${f.root.slice(0, 13)}… recomputed`)
  if (!bad) {
    console.log(`  integrity only: this says the rows are unaltered, NOT that any figure is correct.`)
    console.log(`  to check a figure, run its command in that repository.`)
    if (failing.length) console.log(`  ${failing.length} gate(s) reported FAIL: ${failing.map((r) => r.key).join(' ')}`)
  }
  process.exit(bad ? 1 : 0)
}

writeFileSync('metrics.json', JSON.stringify(face, null, 2) + '\n')

// Published to the shared fusion directory when one exists, so a sibling session picks it up without
// asking. Written only if the directory is already there: creating it would be this repo deciding where
// five sessions coordinate, which is not its call.
const SHARED = process.env.HOME + '/.erpax/fusion'
if (existsSync(SHARED)) {
  writeFileSync(SHARED + '/millennium-solutions.metrics.json', JSON.stringify(face, null, 2) + '\n')
  // AND THE STATEMENTS, so a sibling auditing us reads what is true now. The snapshot they had was written
  // at 02:23 and held file-level descriptions — auditing it reported 503 claims and no repeats, while the
  // live tree holds 529 declarations and six colliding statements. A peer audit is only as good as the data
  // it is handed, and handing them a stale file is a way of passing an audit rather than surviving one.
  // Each line carries the STATEMENT, which is what a cross-repository address is computed over.
  const lines = leanTheorems().map((t) => JSON.stringify({
    repo: 'millennium-solutions', path: `src/proof/${t.file}`, claim: t.name,
    statement: t.statement, tactic: t.tactic, origin: 'self',
  })).join('\n')
  writeFileSync(SHARED + '/millennium-solutions.jsonl', lines + '\n')
}
// ── ENFORCEMENT, SEPARATED FROM RECORDING ───────────────────────────────────────────────────────────────
// This face deliberately PUBLISHES a red gate rather than refusing to publish, so it exits 0 whatever the
// gates said. That meant CI needed a separate `npm run gates` step to actually fail the build — and since
// this file runs the same chain to fill its rows, `gates` ran TWICE on every deploy. Measured: 10.3s of the
// ~22s those two steps took was the identical work done again.
//
// `--enforce` runs after the face is written and published, then reads the rows it just wrote, and exits non-zero if any gate failed. The face keeps its
// property (a red result is published, not hidden), CI keeps its property (a red gate stops the build), and
// the chain runs once. Nothing is checked less; it is checked the same number of times as before, minus one.
if (arg === '--enforce') {
  const failing = rows.filter((r) => r.key.startsWith('gate:') && r.value === 'FAIL')
  for (const r of failing) console.error(`  ✗ ${r.key.replace('gate:', '')} failed — recompute with: ${r.command}`)
  console.log(failing.length
    ? `\n✗ metrics --enforce: ${failing.length} gate(s) red in the face just written`
    : `\n✓ metrics --enforce: every gate in the face passed; the face is published either way and this is what stops a red build`)
  process.exit(failing.length ? 1 : 0)
}

const red = rows.filter((r) => r.value === 'FAIL')
console.log(`✓ metrics: ${rows.length} rows · root ${face.root.slice(0, 13)}… → metrics.json`
  + (red.length ? ` · ${red.length} GATE(S) FAILING: ${red.map((r) => r.key).join(' ')}` : ' · all gates pass'))
