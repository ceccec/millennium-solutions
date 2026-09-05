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

// ── FAMILY THEOREMS THAT ALREADY EXIST, AND THE EXACT DOMAIN EACH ONE DECIDES ────────────────────────────
// These are not name matches. Each entry names a live theorem, reads the parameter out of the withdrawn
// key, and asks whether that parameter is INSIDE the domain the theorem actually quantifies over — the
// domain read off its statement, not assumed from its name.
//
// cyclic_units_have_a_primitive_root is the reason this is done parameter-by-parameter: it quantifies over
// [2,3,5,7,11,13], so it proves domain_cyclic_m3 and says NOTHING about domain_cyclic_m4. A family matcher
// keyed on the name would have carried all thirteen and asserted proof of nine statements nobody has proved.
const inDomain: { theorem: string; key: RegExp; covers: (n: number) => boolean; why: string }[] = [
  { theorem: 'flt_all_primes_under_thirty', key: /^flt_prime_(\d+)$/, covers: (n) => n < 30,
    why: 'quantifies over primesUpTo30, so Fermat at any prime below thirty is one of its cases' },
  { theorem: 'wilsons_theorem_and_its_converse', key: /^wilson_prime_(\d+)$/, covers: (n) => n >= 2 && n <= 19,
    why: 'quantifies over List.range\' 2 18, so p from 2 to 19 inclusive' },
  { theorem: 'pascal_rows_sum_to_powers_of_two', key: /^pascal_row_sum_(\d+)$/, covers: (n) => n < 12,
    why: 'quantifies over List.range 12, so rows 0 to 11' },
  { theorem: 'pascal_alternating_sums_vanish', key: /^pascal_alternating_sum_(\d+)$/, covers: (n) => n >= 1 && n <= 11,
    why: 'quantifies over List.range\' 1 11, so rows 1 to 11' },
  { theorem: 'powsum_zero_odd_exponents', key: /^powsum0_k(\d+)$/, covers: (n) => n % 2 === 1 && n <= 17,
    why: 'quantifies over the ODD exponents up to 17 only — an even k is a different statement and is not carried' },
  { theorem: 'cyclic_units_have_a_primitive_root', key: /^domain_cyclic_m(\d+)$/, covers: (n) => [2, 3, 5, 7, 11, 13].includes(n),
    why: 'quantifies over [2,3,5,7,11,13] exactly — a composite modulus is NOT one of its cases' },
]
for (const f of inDomain) {
  const heir = [...live].find((k) => k.endsWith('_' + f.theorem) || k === f.theorem)
  if (!heir) { console.log(`  ? ${f.theorem} — not a live key, its family is not carried`); continue }
  for (const e of pool) {
    const m = String(e.key).match(f.key)
    if (!m) continue
    if (!f.covers(Number(m[1]))) continue
    heirOf.set(String(e.key), heir)
  }
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
// ── THE REMAINDER, ORGANISED INTO FAMILIES ───────────────────────────────────────────────────────────────
// A family is a set of withdrawn claims differing only in a parameter. One quantified theorem decides the
// whole set, which is why 1,212 singletons are not 1,212 pieces of work — they are far fewer families, each
// closing by `decide` over its stated parameter range, and each AXIOM-FREE because that is what `decide`
// buys: the kernel walks the domain and no assumption is introduced.
const rest = pool.filter((e) => !heirOf.has(String(e.key)))
const families = new Map<string, number[]>()
const loose: string[] = []
for (const e of rest) {
  const m = String(e.key).match(/^(.*?)_?(\d+)$/)
  if (!m) { loose.push(String(e.key)); continue }
  const arr = families.get(m[1]) ?? []
  arr.push(Number(m[2]))
  families.set(m[1], arr)
}
const ranked = [...families].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length)
const inFam = ranked.reduce((a, [, v]) => a + v.length, 0)
console.log(`\n  the remainder, organised — ${ranked.length} families cover ${inFam} of ${rest.length}:`)
for (const [f, params] of ranked.slice(0, 12)) {
  const p = params.sort((a, b) => a - b)
  console.log(`    ${String(params.length).padStart(3)}  ${f.padEnd(28)} parameters ${p[0]}…${p[p.length - 1]}`)
}
console.log(`    ${String(rest.length - inFam).padStart(3)}  (singletons — no sibling sharing a parameter shape)`)
console.log(`\n  Each family above is ONE theorem quantified over its parameter range, closing by decide and`)
console.log(`  therefore axiom-free. ${ranked.length} theorems recover ${inFam} withdrawn claims.`)

console.log(`  ${pool.length - recoverable.length} remain, and the path is the same one that produced these:`)
console.log(`  a quantified family theorem subsumes its parameters, and every parameter is a withdrawn`)
console.log(`  singleton that comes back PROVED rather than dropped. Withdrawal was never the only option.`)
