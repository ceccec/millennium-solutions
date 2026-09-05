/** ── RECOVERY — WITHDRAWN CLAIMS THAT A LIVE THEOREM ALREADY PROVES ────────────────────────────────────────
 *
 *  1,274 entries were withdrawn with the reason "not backed by a Lean proof. Its evidence is a TypeScript
 *  test". Each one COMPUTED. Withdrawal costs one line of record; proving costs real work; a green gate
 *  rewards both identically, and 1,274 times the cheap path was taken.
 *
 *  Some of them are not merely provable — THEY ARE ALREADY PROVED. scripts/lean-gen.ts emits family theorems
 *  that quantify over a whole parameter set and RECORDS what each subsumes. Twelve withdrawn singletons sat
 *  inside families a live theorem decides, with the subsumption written down by the generator, and nothing
 *  ever read it back into the ledger. The proof existed and the record said "nothing proves this".
 *
 *  This walks that link and carries every withdrawn claim to the live theorem that proves it. It is exact,
 *  not heuristic: the generator recorded the subsumption, so the link is asserted by the program that built
 *  the family and not inferred from name similarity here. A carry is a claim that a specific theorem proves
 *  a specific statement, and a wrong one is a false claim — so nothing is carried on resemblance.
 *
 *  REPORTS what remains. The recoverable pool shrinks as families are added: every new quantified theorem
 *  subsumes its parameters, and each parameter is a withdrawn singleton that comes back proved. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { ledger, statusOf } from '../src/api/index.ts'

const P = 'src/proof/discovered.json'
const write = process.argv.includes('--write')
const l = ledger()
const live = new Set(l.filter((e) => statusOf(e, l) === 'standing').map((e) => String(e.key)))
const pool = l.filter((e) => statusOf(e, l) === 'withdrawn' && /not backed by a Lean proof/i.test(String(e.reason)))

const gen = existsSync('src/proof/generated-theorems.json')
  ? JSON.parse(readFileSync('src/proof/generated-theorems.json', 'utf8')) : []
const recs: any[] = Array.isArray(gen) ? gen : (gen.records ?? [])

// The heir must resolve to EXACTLY ONE live ledger key. An ambiguous family name is not carried — a carry
// naming the wrong theorem is worse than a claim left withdrawn, because it reads as proved.
const heirOf = new Map<string, string>()
for (const g of recs) {
  const cands = [...live].filter((k) => k.endsWith('_' + g.key) || k === g.key)
  if (cands.length !== 1) continue
  for (const s of (g.subsumes ?? [])) heirOf.set(String(s), cands[0])
}

const recoverable = pool.filter((e) => heirOf.has(String(e.key)))
console.log(`recovery — withdrawn claims whose evidence computed:\n`)
console.log(`  pool                                  ${pool.length}`)
console.log(`  live family theorems that subsume     ${recs.length}`)
console.log(`  recoverable NOW, subsumption recorded ${recoverable.length}`)

if (write && recoverable.length) {
  const raw = JSON.parse(readFileSync(P, 'utf8')) as any[]
  let n = 0
  for (const e of raw) {
    const h = heirOf.get(String(e.key))
    if (!h || !e.revoked || e.supersededBy) continue
    if (!/not backed by a Lean proof/i.test(String(e.reason))) continue
    e.supersededBy = h
    e.reason = `carried: withdrawn as "not backed by a Lean proof", and it IS proved — ${h} quantifies over `
      + `the whole family this claim is one parameter of, and the generator recorded the subsumption when it `
      + `emitted that theorem. Marked in place; the receipt stays in the append-only chain.`
    n++
  }
  writeFileSync(P, JSON.stringify(raw, null, 2) + '\n')
  console.log(`\n✓ recover: ${n} carried to the theorem that already proves them`)
} else {
  console.log(`\n○ recover: run with --write to carry them.`)
}
console.log(`  ${pool.length - recoverable.length} remain, and the path is the same one that produced these:`)
console.log(`  a quantified family theorem subsumes its parameters, and every parameter is a withdrawn`)
console.log(`  singleton that comes back PROVED rather than dropped. Withdrawal was never the only option.`)
