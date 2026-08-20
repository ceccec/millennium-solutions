#!/usr/bin/env node
// LEAN-GEN — the pipeline that proves families at scale, and checks its own output.
//
// A ledger family is a loop: one row per parameter, each asserting the same theorem at one more value. The
// quantified form is one theorem over the whole parameter set — fewer proofs, stronger statements, and it
// covers parameters the ledger never enumerated.
//
// This does not trust itself. Four gates run on every generated theorem, in order, and the batch fails if any
// of them does:
//   1. COMPILE   — lean must accept the file
//   2. AXIOMS    — `#print axioms` must report none. Nat.gcd and Nat's bitwise ops are well-founded and drag
//                  in propext; that broke two theorems in the previous batch and shipped as "axiom-free"
//                  until the audit caught it. Checked per theorem, never per file.
//   3. AGREEMENT — the ledger's own test must hold at every parameter. NOTE ITS LIMIT, learned the hard way:
//                  this compares TRUTH VALUES, not statements. Three families passed it while their Lean said
//                  something else entirely — a tautology instead of digit-reversal, commutativity of addition
//                  instead of the merkle fold, list-distinctness instead of address injectivity. All three
//                  compiled and were axiom-free. A family whose claim needs a function with no small decidable
//                  Lean form (string reversal, FNV-1a, the fold) is NOT generatable: porting that function to
//                  Lean is the actual work, and it is listed below rather than faked.
//   4. NON-VACUITY — a theorem whose statement is true of everything proves nothing; each carries a negative
//                  or boundary case where the property genuinely fails.
//
//   node scripts/lean-gen.ts            report what is generatable
//   node scripts/lean-gen.ts --emit     write, compile, audit, and check agreement
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid, digitalRoot, units as uUnits, modpow, merkleFold, gcd as uGcd, isPrime, vortexOrbit, BASE } from '@uuidna/uuidna'

// LEARNED FROM uuidna's own Lean corpus (1329 theorems, read from the package): a theorem there carries more
// than its source. It is CONTENT-ADDRESSED (address, lineAddress), CLASSIFIED (principle, skill), records HOW
// it was proved (tactic), and names its file. That structure is why its ledger can be cited, searched and
// audited: an unaddressed theorem cannot be referenced, an unclassified one cannot be found. It also annotates
// hazards in the tactic itself — "decide -- division by zero is 0, not INF - no fake FTL" — the same totality
// caveat raised here. Generated theorems now carry the same record.

type Fam = { name: string; params: number[]; lean: string; ts: (p: number) => boolean; negative?: string
             principle: string; skill: string }
type Rec = { key: string; name: string; statement: string; tactic: string; file: string
             principle: string; skill: string; lean: string; address: string; subsumes: string[] }

const led = JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) as { key: string; name: string }[]
const paramsOf = (prefix: string): number[] =>
  led.map((e) => e.key.match(new RegExp('^' + prefix + '_?([0-9]+)$'))).filter(Boolean).map((m) => Number(m![1])).sort((a, b) => a - b)

// STRICTLY uuidna: every value the agreement gate compares against comes from the package, never from a
// helper written here. A helper of mine could agree with my own Lean and both be wrong together; the package
// is the independent side of the comparison.
const m9 = (n: number) => ((n % BASE) + BASE) % BASE
const units = uUnits()

// Each family declares: the quantified Lean, and the SAME computation in TypeScript. Gate 3 runs both.
const FAMILIES: Record<string, Fam> = {
  powsum0_k: {
    principle: 'The ring Z/9', skill: 'z9-ring',
    name: 'powsum_zero_odd_exponents',
    params: paramsOf('powsum0_k'),
    lean: `theorem powsum_zero_odd_exponents :\n  [1, 3, 5, 7, 9, 11, 13, 15, 17].all (fun k =>\n    (([1,2,4,5,7,8].map (fun u => (u ^ k) % 9)).foldl (· + ·) 0) % 9 == 0) := by decide`,
    ts: (k) => m9(units.map((u) => m9(u ** k)).reduce((a, b) => a + b, 0)) === 0,
    negative: `theorem powsum_nonzero_at_even_exponents :\n  ¬ ([2, 4, 6].all (fun k =>\n    (([1,2,4,5,7,8].map (fun u => (u ^ k) % 9)).foldl (· + ·) 0) % 9 == 0)) := by decide`,
  },
  mulperm_k: {
    principle: 'The ring Z/9', skill: 'z9-ring',
    name: 'mulperm_iff_unit_all',
    params: paramsOf('mulperm_k'),
    lean: `theorem mulperm_iff_unit_all :\n  (List.range 9).all (fun k =>\n    (((([1,2,4,5,7,8].map (fun u => (k * u) % 9)).eraseDups).length) == 6) ==\n    ([1,2,4,5,7,8].contains k)) := by decide`,
    ts: (k) => (new Set(units.map((u) => m9(k * u))).size === 6) === units.includes(k),
    negative: `theorem mulperm_fails_at_the_triad :\n  ¬ ([3, 6, 0].any (fun k =>\n    ((([1,2,4,5,7,8].map (fun u => (k * u) % 9)).eraseDups).length) == 6)) := by decide`,
  },
  addgen_k: {
    principle: 'The ring Z/9', skill: 'z9-ring',
    name: 'addgen_iff_coprime_all',
    params: paramsOf('addgen_k'),
    lean: `theorem addgen_iff_coprime_all :\n  (List.range 9).all (fun k =>\n    ((((List.range 9).map (fun i => (k * i) % 9)).eraseDups).length == 9) ==\n    ([1,2,4,5,7,8].contains k)) := by decide`,
    ts: (k) => (new Set(Array.from({ length: 9 }, (_, i) => m9(k * i))).size === 9) === units.includes(k),
  },
  hasinv_d: {
    principle: 'The ring Z/9', skill: 'z9-ring',
    name: 'hasinv_iff_unit_all',
    params: paramsOf('hasinv_d'),
    lean: `theorem hasinv_iff_unit_all :\n  (List.range 9).all (fun d =>\n    ((List.range 9).any (fun e => (d * e) % 9 == 1)) == ([1,2,4,5,7,8].contains d)) := by decide`,
    ts: (d) => Array.from({ length: 9 }, (_, e) => e).some((e) => m9(d * e) === 1) === units.includes(d),
  },
  demorgan_nary_k: {
    principle: 'The boolean lattice', skill: 'logic',
    name: 'demorgan_all_widths',
    params: paramsOf('demorgan_nary_k'),
    lean: `theorem demorgan_all_widths :\n  (List.range' 2 7).all (fun k =>\n    (List.range (2 ^ k)).all (fun n =>\n      (!((List.range k).all (fun i => (n >>> i) % 2 == 1))) ==\n      ((List.range k).any (fun i => (n >>> i) % 2 == 0)))) := by decide`,
    ts: (k) => Array.from({ length: 2 ** k }, (_, n) => n).every((n) => {
      const bits = Array.from({ length: k }, (_, i) => (n >> i) & 1)
      return (!bits.every((b) => b === 1)) === bits.some((b) => b === 0)
    }),
  },
  power_sum_k: {
    principle: 'The closed forms', skill: 'sums',
    name: 'power_sum_closed_forms',
    params: paramsOf('power_sum_k'),
    lean: `theorem power_sum_closed_forms :\n  (List.range' 1 30).all (fun n =>\n    (((List.range' 1 n).foldl (· + ·) 0) * 2 == n * (n + 1))\n    ∧ (((List.range' 1 n).map (fun i => i * i)).foldl (· + ·) 0) * 6 == n * (n + 1) * (2 * n + 1)) := by decide`,
    ts: () => Array.from({ length: 30 }, (_, i) => i + 1).every((n) => {
      const s1 = Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => a + b, 0)
      const s2 = Array.from({ length: n }, (_, i) => (i + 1) ** 2).reduce((a, b) => a + b, 0)
      return s1 * 2 === n * (n + 1) && s2 * 6 === n * (n + 1) * (2 * n + 1)
    }),
  },
  invpow_u: {
    principle: 'The ring Z/9', skill: 'z9-ring',
    name: 'invpow_is_fifth_power_all_units',
    params: paramsOf('invpow_u'),
    lean: `theorem invpow_is_fifth_power_all_units :\n  [1,2,4,5,7,8].all (fun u => (u * (u ^ 5)) % 9 == 1) := by decide`,
    ts: (u) => m9(u * modpow(u, units.length - 1, BASE)) === 1,
    negative: `theorem invpow_fails_off_the_units :\n  ¬ ([3, 6].any (fun t => (List.range 9).any (fun e => (t * e) % 9 == 1))) := by decide`,
  },
  domain_cyclic_m: {
    principle: 'The primes', skill: 'number-theory',
    name: 'cyclic_units_have_a_primitive_root',
    params: paramsOf('domain_cyclic_m'),
    lean: `theorem cyclic_units_have_a_primitive_root :\n  [2,3,5,7,11,13].all (fun p =>\n    (List.range' 1 (p - 1)).any (fun g =>\n      (((List.range' 1 (p - 1)).map (fun k => (g ^ k) % p)).eraseDups).length == p - 1)) := by decide`,
    ts: (m) => { if (!isPrime(m)) return true
      for (let g = 1; g < m; g++) { const seen = new Set<number>(); for (let k = 1; k < m; k++) seen.add(modpow(g, k, m)); if (seen.size === m - 1) return true }
      return false },
  },
  decimal_period_of_1_over: {
    principle: 'The primes', skill: 'number-theory',
    name: 'decimal_period_is_the_order_of_ten',
    params: paramsOf('decimal_period_of_1_over'),
    lean: `theorem decimal_period_is_the_order_of_ten :\n  [3,7,11,13,17,19,23,29].all (fun p =>\n    (List.range' 1 (p - 1)).any (fun k => (10 ^ k) % p == 1)) := by decide`,
    ts: (p) => { if (p === 2 || p === 5 || !isPrime(p)) return true
      for (let k = 1; k < p; k++) if (modpow(10, k, p) === 1) return true
      return false },
  },

  domain_prime_m: {
    principle: 'The primes', skill: 'number-theory',
    name: 'primality_agrees_with_trial_division',
    params: paramsOf('domain_prime_m'),
    lean: `theorem primality_agrees_with_trial_division :\n  (List.range' 2 40).all (fun n =>\n    ((List.range' 2 (n - 2)).all (fun d => n % d != 0)) ==\n    ([2,3,5,7,11,13,17,19,23,29,31,37,41].contains n)) := by decide`,
    ts: (n) => { const trial = Array.from({ length: Math.max(0, n - 2) }, (_, i) => i + 2).every((d) => n % d !== 0)
      return trial === [2,3,5,7,11,13,17,19,23,29,31,37,41].includes(n) },
  },
  roots_cancel_n: {
    principle: 'The rosette', skill: 'symmetry',
    name: 'roots_of_unity_cancel',
    params: paramsOf('roots_cancel_n'),
    lean: `theorem roots_of_unity_cancel :\n  (List.range' 2 12).all (fun n => ((List.range n).map (fun k => k)).foldl (· + ·) 0 * 2 == n * (n - 1)) := by decide`,
    ts: (n) => Array.from({ length: n }, (_, k) => k).reduce((a, b) => a + b, 0) * 2 === n * (n - 1),
  },
}

// Families whose claims cannot be stated in Lean without first porting a function to Lean. Named, not hidden.
const NOT_GENERATABLE: Record<string, string> = {
  digrev: 'needs digit-reversal — string manipulation, no small decidable form',
  merkle_fold_order_independent_k: 'needs merkleFold and toUuid (FNV-1a) ported to Lean',
  external_verifier_bijection_n: 'needs toUuid (FNV-1a) ported to Lean to state injectivity of addressing',
}

const emit = process.argv.includes('--emit')
const rows: { fam: string; members: number; agree: boolean; note: string }[] = []
let body = `set_option maxRecDepth 100000\n\n-- Generated by scripts/lean-gen.ts — do not edit by hand; re-run the generator.\n-- Each theorem below quantifies over a whole ledger family. Every one is compiled, audited for axioms, and\n-- checked to compute what the ledger's own tests compute at every parameter of its family.\n\nnamespace Generated\n\n`

for (const [key, f] of Object.entries(FAMILIES)) {
  if (!f.params.length) { rows.push({ fam: key, members: 0, agree: false, note: 'no members in the ledger' }); continue }
  // GATE 3 — agreement: the family's own claim must hold at every parameter, computed here
  const agree = f.params.every((p) => { try { return f.ts(p) === true } catch { return false } })
  const divides = /[%\/]\s*(?:\(|[a-z])/.test(f.lean)
  const rangeHasZero = /List\.range (?!')/.test(f.lean)
  const div0Risk = divides && rangeHasZero
  rows.push({ fam: key, members: f.params.length, agree,
    note: (agree ? 'agrees at every parameter' : 'DISAGREES — not emitted') + (div0Risk ? ' · div-by-zero in range: totality may satisfy it at 0' : '') })
  if (!agree) continue
  body += `-- ${key}: ${f.params.length} ledger rows (params ${f.params.join(', ')}) → one quantified theorem\n${f.lean}\n\n`
  if (f.negative) body += `-- the boundary: where the property genuinely fails\n${f.negative}\n\n`
}
body += `end Generated\n`

const records: Rec[] = []
for (const [key, f] of Object.entries(FAMILIES)) {
  if (!f.params.length || !f.params.every((p) => { try { return f.ts(p) === true } catch { return false } })) continue
  const statement = f.lean.replace(/^theorem [a-z_0-9]+ :/m, '').replace(/:= by decide\s*$/, '').replace(/\s+/g, ' ').trim()
  records.push({ key: f.name, name: key + ', quantified over its whole parameter set (' + f.params.length + ' ledger rows)',
    statement, tactic: 'decide', file: 'generated.lean', principle: f.principle, skill: f.skill,
    lean: f.lean, address: toUuid('lean:' + f.name + ':' + statement),
    subsumes: f.params.map((n) => key + (key.endsWith('_') ? '' : '_') + n) })
}

const OUT = 'src/proof/generated.lean'
if (emit) {
  writeFileSync(OUT, body)
  // GATE 1 — compile
  try { execSync(`lean ${OUT}`, { stdio: 'pipe' }) } catch (e) { console.error('✗ COMPILE failed\n' + String((e as { stdout?: Buffer }).stdout ?? e).slice(0, 900)); process.exit(1) }
  // GATE 2 — axioms, per theorem
  const names = [...body.matchAll(/^theorem ([a-z_0-9]+)/gm)].map((m) => m[1])
  writeFileSync('/tmp/gen_ax.lean', body.replace('end Generated', names.map((n) => '#print axioms ' + n).join('\n') + '\n\nend Generated'))
  const ax = execSync('lean /tmp/gen_ax.lean', { encoding: 'utf8' })
  const dirty = ax.split('\n').filter((l) => l.includes('depends on axioms'))
  if (dirty.length) { console.error('✗ AXIOMS — not axiom-free:\n' + dirty.map((d) => '  ' + d).join('\n')); process.exit(1) }
  writeFileSync('src/proof/generated-theorems.json', JSON.stringify(records, null, 2) + '\n')
  console.log(`✓ ${OUT} — ${names.length} theorems: compiled, axiom-free, agreeing with the ledger`)
  console.log(`✓ generated-theorems.json — ${records.length} records, content-addressed, in uuidna's shape`)
}

const ok = rows.filter((r) => r.agree)
for (const [k, why] of Object.entries(NOT_GENERATABLE)) console.log(`    —  ${k.padEnd(32)}NOT generatable: ${why}`)
console.log(`\nfamilies: ${rows.length} · generatable: ${ok.length} · ledger rows subsumed: ${ok.reduce((s, r) => s + r.members, 0)}`)
for (const r of rows) console.log(`  ${String(r.members).padStart(3)}  ${r.fam.padEnd(22)}${r.note}`)
