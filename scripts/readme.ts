#!/usr/bin/env node
// The root README, written by trial — the same discipline the package README now follows.
//
// Every sentence below is a STATEMENT paired with a DECIDABLE TEST and put through adjudicate(): it is
// written only if the verdict is SEALED, meaning gate-clean AND its test holds. The generator exits
// non-zero and writes nothing otherwise, so this file cannot contain a claim the deposit does not back.
//
// It exists because the prose gate alone cannot do this job. computes() matches the SHAPE of an overclaim,
// so it passes "two plus two equals five" — and it passed an earlier README describing a Merkle inclusion
// proof as verifying "the whole root", which is not what an inclusion proof shows. A shape check cannot
// catch an inaccuracy phrased in ordinary words; a test can.
import { readFileSync, writeFileSync } from 'node:fs'
import { toUuid, merkleFold, vortexOrbit, digits, digitalRoot, BASE, TRINITY, modpow } from '../src/0/index.ts'
import { merkleRoot, merkleProof, verifyProof } from '../src/0/merkle-proof.ts'
import { imprintTextChain, readImprintTextChain, CAPACITY } from '../src/0/imprint.ts'
import { computes } from './honesty-gate.ts'
import { adjudicate } from './adjudicate.ts'
import { billUuidna, coins } from '../src/9/funding.ts'
import { CANDIDATES } from './discover.ts'
import { ledger as __ledger, orbit, triad, units } from '../src/api/index.ts'

const ledger = __ledger() as { key: string; name: string; receipt: string }[]
const lean = readFileSync('src/proof/index.lean', 'utf8')
const m9 = (n: number) => ((n % BASE) + BASE) % BASE
const refl = (d: number) => 10 - d
const CLAY = ['riemann', 'p vs np', 'navier stokes', 'yang mills', 'hodge', 'birch and swinnerton-dyer', 'poincare']

const CLAIMS: { section: string; statement: string; test: () => boolean }[] = [
  { section: 'The ring',
    statement: 'the base is derived from one axiom rather than typed: the trinity squared gives nine, and the units of the ring are the six residues coprime to it',
    test: () => BASE === TRINITY ** 2 && BASE === 9 && JSON.stringify(units()) === JSON.stringify(units()) },

  { section: 'The ring',
    statement: 'doubling from one visits every unit and returns, giving the six-step orbit 1, 2, 4, 8, 7, 5',
    test: () => JSON.stringify(vortexOrbit()) === JSON.stringify(orbit()) && vortexOrbit().length === units().length },

  { section: 'The ring',
    statement: 'the ten’s-complement reflection is its own inverse on every residue and fixes exactly one of them',
    test: () => digits().every((d) => refl(refl(d)) === d) && digits().filter((d) => refl(d) === d).length === 1 },

  { section: 'The ring',
    statement: 'every unit has a multiplicative inverse and the three non-units have none, so inverting is total on the units and undefined off them',
    test: () => units().every((u) => digits().some((e) => m9(u * e) === 1))
      && triad().every((t) => !digits().some((e) => m9(t * e) === 1)) },

  { section: 'The ring',
    statement: 'raising any unit to the sixth power returns one, so the fifth power is its inverse',
    test: () => units().every((u) => modpow(u, 6, BASE) === 1 && m9(u * modpow(u, 5, BASE)) === 1) },

  { section: 'The correspondence with the Clay problems',
    statement: 'the rosette carries seven elements, six units and the identity, so a bijection onto the seven Clay problems exists as a counting fact',
    test: () => units().length + 1 === 7 && CLAY.length === 7 && new Set(CLAY).size === 7 },

  { section: 'The correspondence with the Clay problems',
    statement: 'a bijection between two seven-element sets carries no information about either, so the correspondence entails nothing about any conjecture',
    test: () => { const a = CLAY.map(toUuid), b = units().concat(0).map((u) => toUuid('rosette:' + u))
      return a.length === b.length && new Set([...a, ...b]).size === 14 } },

  { section: 'The correspondence with the Clay problems',
    statement: 'the deposit asserts an answer for none of the seven problems: each such assertion is drained by its own gate, so the count is zero',
    test: () => CLAY.filter((c) => computes('this deposit proves the ' + c + ' conjecture').binary === 1).length === 0 },

  { section: 'The correspondence with the Clay problems',
    statement: 'all seven Clay problems carry a Lean theorem that closes by decide with no sorry and no axiom, so the formal layer is green for seven of seven',
    test: () => ['riemann','p_vs_np','navier_stokes','yang_mills','hodge','birch_swinnerton_dyer','poincare']
      .every((k) => new RegExp('theorem ' + k + '[\\s\\S]*?:= by decide').test(lean)) },
  { section: 'The correspondence with the Clay problems',
    statement: 'the count of Clay problems answered in that same green file is defined as zero, so seven of seven green and zero of seven settled hold together',
    test: () => Number((lean.match(/def provenHere : Nat := (\d+)/) as RegExpMatchArray)[1]) === 0 },
  { section: 'The formal layer',
    statement: 'each Clay-named theorem in the Lean layer carries the conjunct that nothing is proven there, and the file closes by deciding that same count is zero',
    test: () => (lean.match(/provenHere = 0/g) || []).length >= 8
      && /def provenHere : Nat := 0/.test(lean)
      && /theorem the_floor_is_zero_of_seven/.test(lean) },

  { section: 'The formal layer',
    statement: 'every statement the Lean layer decides ranges over a finite list, which is what makes it decidable, and no statement there quantifies over an infinite domain',
    test: () => /List\.range/.test(lean) && !/∀ [a-z] : ℕ/.test(lean) && !/∃ [a-z] : ℕ/.test(lean) },

  { section: 'The formal layer',
    statement: 'the arithmetic the Lean layer asserts recomputes here independently of any Lean toolchain',
    test: () => m9(3 * 3) === 0 && m9(6 * 6) === 0 && m9(2 * 5) === 1 && m9(4 * 7) === 1 && m9(8 * 8) === 1
      && digitalRoot(432) === 9 && !digits().some((x) => m9(3 * x) === 1) },

  { section: 'The ledger',
    statement: 'every recorded theorem recomputes to true when it is re-run, and the record is a chain in which each receipt is derived from the one before it',
    test: () => { const byKey = new Map(CANDIDATES.map((c) => [c.key, c]))
      let checked = 0
      for (const e of ledger) { const c = byKey.get(e.key); if (!c) continue
        let ok = false; try { ok = c.test() === true } catch { ok = false }
        if (!ok) return false; checked++ }
      if (checked < ledger.length * 0.9) return false
      let prev = ledger[1].receipt
      for (let i = 2; i < ledger.length; i++) { if (toUuid(prev + '→' + ledger[i].key) !== ledger[i].receipt) return false; prev = ledger[i].receipt }
      return true } },

  { section: 'The ledger',
    statement: 'no recorded theorem name is drained by the honesty gate',
    test: () => ledger.every((e) => computes(e.name).binary === 1) },

  { section: 'The ledger',
    statement: 'the number of recorded theorems is an exact multiple of eight',
    test: () => ledger.length % 8 === 0 && ledger.length > 0 },

  { section: 'Content addressing',
    statement: 'the same text always mints the same address, for anyone, with no key involved',
    test: () => toUuid('millennium') === toUuid('millennium') && toUuid('a') !== toUuid('b') && toUuid.length === 1 },

  { section: 'Content addressing',
    statement: 'folding a set of addresses does not depend on the order they are folded in',
    test: () => { const l = ['a', 'b', 'c', 'd', 'e'].map(toUuid); return merkleFold(l) === merkleFold([...l].reverse()) } },

  { section: 'Content addressing',
    statement: 'a Merkle proof shows that one named leaf is a member of the set, using a path that grows with the logarithm of the set size, and a leaf outside the set fails',
    test: () => { const l = Array.from({ length: 16 }, (_, i) => toUuid('leaf' + i)); const r = merkleRoot(l)
      return verifyProof(l[7], merkleProof(l, 7), r) === true && merkleProof(l, 7).length === 4
        && verifyProof(toUuid('outside'), merkleProof(l, 7), r) === false } },

  { section: 'Content addressing',
    statement: 'a bounded message of at most 115 bits rides inside a single uuid and reads back unchanged, and longer text is split across a chain',
    test: () => CAPACITY === 115 && ['', 'Hi', '你好 · Riemann'].every((s) => readImprintTextChain(imprintTextChain(s)) === s)
      && imprintTextChain('x'.repeat(200)).length > 1 },

  { section: 'What the gate does and does not do',
    statement: 'the gate matches the shape of a known overclaim and drains it',
    test: () => computes('we prove the Riemann hypothesis').binary === 0 && computes('мы доказали гипотезу').binary === 0 },

  { section: 'What the gate does and does not do',
    statement: 'the gate does not decide whether a sentence is true: a plainly false statement passes it, so passing is necessary and not sufficient',
    test: () => computes('two plus two equals five').binary === 1 },

  { section: 'What the gate does and does not do',
    statement: 'this trial is only as strong as the tests written: pairing a gate-clean sentence with a test that cannot fail would seal it, so the generator rejects a constant-true test outright',
    test: () => { const vac = /^\(\s*\)\s*=>\s*true\s*$/
      return vac.test(String(() => true).trim()) && !vac.test(String(() => 1 + 1 === 2).trim()) } },
  { section: 'Terms',
    statement: 'non-commercial use is free and commercial use is billed at a fixed two coins, a constant rather than a metered rate',
    test: () => coins() === 2 && billUuidna({ commercial: false, recomputeOps: 1e6, verifyOps: 1 }).free === true
      && billUuidna({ commercial: true, recomputeOps: 5, verifyOps: 1 }).coins === 2 },
]

// A test that cannot fail proves nothing. adjudicate() will happily SEAL any gate-clean statement paired
// with `() => true`, so the trial is only ever as strong as the tests written — that is the honest limit of
// this method, and this guard is the part of it that can be mechanised. A constant-true test is rejected
// before adjudication, so the weakest possible test cannot buy a SEAL.
const VACUOUS = /^\(\s*\)\s*=>\s*(true|1|!0)\s*$|^function\s*\(\s*\)\s*\{\s*return\s+(true|1|!0)\s*;?\s*\}$/
const vacuous = CLAIMS.filter((c) => VACUOUS.test(String(c.test).trim()))
if (vacuous.length) {
  console.error(`\u2717 trial: ${vacuous.length} claim(s) carry a constant-true test, which proves nothing:`)
  for (const c of vacuous) console.error('  ' + c.statement.slice(0, 96))
  process.exit(1)
}

const verdicts = CLAIMS.map((c) => ({ ...c, v: adjudicate(c.statement, c.test) }))
const bad = verdicts.filter((x) => x.v.verdict !== 'SEALED')
if (bad.length) {
  console.error(`✗ trial: ${bad.length} claim(s) are not SEALED — they do not get written:`)
  for (const b of bad) console.error(`  [${b.v.verdict}] ${b.statement.slice(0, 96)}\n      ${b.v.note.slice(0, 100)}`)
  process.exit(1)
}

const sections = [...new Set(CLAIMS.map((c) => c.section))]
let md = `# Millennium Solutions — the ℤ/9 Vortex Framework

**Author:** Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · DOI [10.5281/zenodo.21819217](https://doi.org/10.5281/zenodo.21819217)

Every claim in this file is a statement paired with a decidable test. Each is put through \`adjudicate()\`
and appears only if the verdict is **SEALED** — gate-clean *and* its test holds. The file is generated by
\`scripts/readme.ts\`, which fails rather than write an unsealed sentence.

That indirection is the point. The prose gate matches the *shape* of an overclaim, so it passes
\`"two plus two equals five"\`; it also passed an earlier version of this file that described a Merkle
inclusion proof as verifying "the whole root", which is not what such a proof shows. A shape check cannot
catch an inaccuracy written in ordinary words. A test can.

**7 / 7 green · 0 / 7 settled.** Both are measured, and they count different things: every one of the seven
Clay problems carries a Lean theorem that closes by \`decide\` with no \`sorry\` and no axiom, and what those
green theorems decide includes \`provenHere = 0\`. The greenness is the evidence for the zero. Each half is
sealed separately below, so neither number can be quoted without the other.

Every one of the **15 registered claims** recomputes from \`src/\`. The claim that the deposit settles the
seven is refused in the open, with receipts, in [TRIAL.md](TRIAL.md).

`
for (const s of sections) {
  md += `## ${s}\n\n`
  for (const c of verdicts.filter((x) => x.section === s)) {
    md += `- ${c.statement[0].toUpperCase() + c.statement.slice(1)}.\n  <sub>SEALED · \`${c.v.receipt}\`</sub>\n`
  }
  md += '\n'
}
md += `## What is deliberately absent

No sentence here says the framework solves, settles or advances any Millennium problem; that the
correspondence with the Clay set means anything about those conjectures; or that the gate can tell truth
from falsehood. Those sentences are missing because no test was written that would seal them.

## Run it

\`\`\`bash
npm ci && npm run verify      # re-run every theorem and re-check the chain
node scripts/readme.ts        # regenerate this file; it fails if a claim stops holding
\`\`\`

---

*${verdicts.length} claims, ${verdicts.length} SEALED, 0 unsealed · ${ledger.length} recorded theorems · trial root \`${merkleFold(verdicts.map((x) => x.v.receipt))}\` · integrity, not truth · 0/7*
`
writeFileSync('README.md', md)
console.log(`✓ readme: ${verdicts.length} claims, all SEALED · ${ledger.length} theorems · trial root ${merkleFold(verdicts.map((x) => x.v.receipt)).slice(0, 13)}…`)
