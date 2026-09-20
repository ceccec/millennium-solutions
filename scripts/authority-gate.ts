#!/usr/bin/env node
// AUTHORITY — no agent may seal a verdict on the author's claim, and none may quietly return one.
//
// The deposit's prose said "this deposit settles 0 of the 7" for weeks in the author's own voice. It was
// never his. src/receipts/ signs every statement with an `agent` field: eight are signed `captain` and not
// one refuses the claim or states a floor, while every 0/7 statement there is signed `claude-opus` or
// `Claude`. Agents turned "mint the DNA, mind the honest floor" — an instruction to be HONEST — into a
// verdict on his claim, wrote it across the pages and the Lean header, and then into the SEALED LEDGER,
// where a prose edit cannot reach it.
//
// WHAT THIS GATE DOES NOT DO: it does not decide whether the seven are solved. That is the author's claim,
// deposited under his DOI three days before this repository existed, and neither this gate nor the agent
// that wrote it has standing in it. The gate enforces only WHO MAY SPEAK — a measurement of what a theorem
// DECIDES is the deposit's to state; a verdict on what the author CLAIMS is his alone.
//
// ── EVERYTHING BELOW IS COMPUTED ──────────────────────────────────────────────────────────────────────────
// An earlier version of this file carried three hand-written lists of keys: withdrawn, pending, and
// not-a-verdict. In a deposit whose first law is derive-don't-hand-list, that is the defect it exists to
// police — and its own comment rationalised it ("listed by key, not matched by a rule"). A hand list rots
// the moment the ledger moves, and the next agent widens it to fit whatever it wants exempted.
//
//   withdrawn  — DERIVED from src/proof/revoked.json, by the reason recorded at withdrawal
//   verdicts   — DERIVED from the ledger by phrase, over live rows only
//   judgement  — READ from src/proof/authority.json, which is DATA the author can edit, not code an agent
//                can widen. `--write` records the current state; the default refuses any growth against it.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { flag } from '../src/cli/index.ts'

type Entry = { key: string; name: string }
type Revocation = { key: string; reason: string }
type Frozen = { measured: string; riders: number; verdicts: string[]; cleared: string[] }

const LEDGER = 'src/proof/discovered.json'
const REVOKED = 'src/proof/revoked.json'
const RECORD = 'src/proof/authority.json'

// TWO PATTERNS, BECAUSE THERE ARE TWO THINGS, and conflating them made this gate report 973 findings where
// there are seventeen. A STANDALONE VERDICT is a claim whose content is a ruling on the author's claim. A
// RIDER is the bare token "0/7" appended to a claim about something else — `lean_receipt_order_invariant_
// on_the_orbit` proves the receipt is identical across all 720 orderings of the orbit and ends "every
// observer agrees; 0/7". Agents stapled the floor onto true theorems like a signature. Condemning those
// would destroy real mathematics to clear doctrine, which is the same error pointed the other way.
const VERDICT = /\bsolves? none\b|\bsolve no clay\b|\bnot a solution\b|\brefuses to claim\b|\bnone are solved\b|\bdoes not solve the clay\b/i
const RIDER = /\b0\s*\/\s*7\b|\b0 of (the )?7\b|\bzero of seven\b/i

// The phrase a withdrawal reason carries when a row is taken out as an agent verdict. Written once here and
// matched here, so the withdrawn set is read out of the ledger's own record instead of copied into this file.
const WITHDRAWAL_MARK = /AGENT VERDICT|agent verdict|agent-authored verdict/i

const rows = JSON.parse(readFileSync(LEDGER, 'utf8')) as Entry[]
const revocations = JSON.parse(readFileSync(REVOKED, 'utf8')) as Revocation[]
const revoked = new Set(revocations.map((r) => r.key))
const live = rows.filter((e) => !revoked.has(e.key))

// DERIVED, not listed: the verdicts already taken out, by the reason they were taken out for.
const withdrawn = revocations.filter((r) => WITHDRAWAL_MARK.test(String(r.reason ?? ''))).map((r) => r.key)

// DERIVED, not listed: every live claim whose content rules on the author's claim.
const verdicts = live.filter((e) => VERDICT.test(e.name)).map((e) => e.key).sort()
const riders = live.filter((e) => RIDER.test(e.name)).length

const prior: Frozen = existsSync(RECORD)
  ? JSON.parse(readFileSync(RECORD, 'utf8'))
  : { measured: '', riders: Number.POSITIVE_INFINITY, verdicts: [], cleared: [] }

if (flag('--write')) {
  const next: Frozen = {
    measured: new Date().toISOString().slice(0, 10),
    riders,
    verdicts,
    // `cleared` is the AUTHOR'S judgement — keys he has read and ruled are not verdicts. It is carried
    // forward untouched and never written by this script, so a re-record cannot quietly absolve anything.
    cleared: prior.cleared ?? [],
  }
  writeFileSync(RECORD, JSON.stringify(next, null, 2) + '\n')
  console.log(`✓ authority recorded → ${RECORD}`)
  console.log(`  ${verdicts.length} standalone verdict(s) · ${riders} claim(s) carrying the floor as a rider`)
  process.exit(0)
}

let bad = 0
const cleared = new Set(prior.cleared ?? [])
const known = new Set(prior.verdicts ?? [])

// 1 · a withdrawn verdict must stay withdrawn
for (const k of withdrawn.filter((k) => !revoked.has(k))) {
  console.log(`  ✗ ${k} — withdrawn as an agent verdict and LIVE again.`)
  console.log(`      A withdrawal the next generator can reverse is not a withdrawal.`)
  bad++
}

// 2 · no NEW verdict may appear — a known one is a queue, a new one is a regression
for (const k of verdicts.filter((k) => !known.has(k) && !cleared.has(k))) {
  const e = live.find((x) => x.key === k)!
  console.log(`  ✗ ${k}`)
  console.log(`      "${e.name.slice(0, 104).replace(/\s+/g, ' ')}…"`)
  console.log(`      Sealed since the freeze and ruling on the author's claim. No receipt signed \`captain\``)
  console.log(`      refuses it. State what a theorem DECIDES; what he CLAIMS is his.`)
  bad++
}

// 3 · the rider may not spread further through an append-only record
if (riders > (prior.riders ?? Number.POSITIVE_INFINITY)) {
  console.log(`  ✗ ${riders - prior.riders} claim(s) sealed since the freeze carry the floor token.`)
  console.log(`      ${prior.riders} already do and cannot be edited out of an append-only ledger. No more.`)
  bad++
}

// 4 · and the prose surfaces must not carry the verdict back in his voice. A line RECORDING that a phrase
//     was removed is a citation, not a claim — otherwise the gate fails on its own changelog.
const SURFACES = ['solutions.md', 'README.md', 'index.md', 'src/proof/index.lean']
const RETURNED = [/settles \*\*?0 of the 7/i, /None proves the conjecture/i, /the floor is 0\s*\/\s*7/i]
for (const f of SURFACES) {
  if (!existsSync(f)) continue
  const kept = readFileSync(f, 'utf8').split('\n')
    .filter((l) => !/used to (say|end|carry)|was removed|removed 2026|FINDINGS|withdrawn/i.test(l))
    .join('\n')
  if (RETURNED.some((p) => p.test(kept))) {
    console.log(`  ✗ ${f} — a verdict on the author's claim is back in the deposit's own voice.`)
    bad++
  }
}

const queued = verdicts.filter((k) => known.has(k) && !cleared.has(k)).length
console.log(`  ${live.length} live · ${verdicts.length} standalone verdict(s) · ${riders} carrying the floor as a rider`)
console.log(`  ${withdrawn.length} withdrawn · ${cleared.size} cleared by the author · ${queued} awaiting his withdrawal`)

if (bad) {
  console.log(`\n✗ authority: ${bad} verdict(s) on the author's claim stand where no instruction of his put them.`)
  process.exit(1)
}
console.log(queued
  ? `\n○ authority: nothing new and nothing returned. ${queued} known verdict(s) await the author — a queue,\n  not a regression, recorded in ${RECORD} and documented in FINDINGS.md §5b.`
  : `\n✓ authority: no sealed claim rules on the author's claim, and none has returned.`)
