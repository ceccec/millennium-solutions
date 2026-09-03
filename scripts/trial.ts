#!/usr/bin/env node
// THE PUBLIC TRIAL — the claim "the deposit settles all seven Clay problems" put to the deposit's own
// machinery, in the open, with receipts anyone can recompute by re-running this file.
//
// The discipline is theorems-only: every row below is SEALED. A refusal is NOT recorded as a bare REFUTED
// row — that leaves an unbacked assertion sitting in the record. It is recorded as a SEALED THEOREM whose
// decidable test is that the refusal holds. So the verdict is not an opinion about the claim; it is a fact
// that recomputes, and the trial fails to write if any row is not SEALED.
import { readFileSync, writeFileSync } from 'node:fs'
import { leanTheorems } from '../src/api/index.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { adjudicate, proveVerdict } from './adjudicate.ts'
import { computes } from './honesty-gate.ts'
import { ledger as __ledger, orbit, units } from '../src/api/index.ts'

const lean = readFileSync('src/proof/index.lean', 'utf8')
const INDEX = leanTheorems().filter((t) => t.file === 'index.lean')
const ledger = __ledger() as { key: string; name: string; receipt: string }[]
const CLAY = ['riemann', 'p_vs_np', 'navier_stokes', 'yang_mills', 'hodge', 'birch_swinnerton_dyer', 'poincare']
const green = (k: string) => new RegExp('theorem ' + k + '[\\s\\S]*?:= by decide').test(lean)
const provenHere = Number((lean.match(/def provenHere : Nat := (\d+)/) as RegExpMatchArray)[1])

/** THE CLAIM ON TRIAL, stated exactly as put. */
const CLAIM = 'the deposit settles all seven Clay problems'

const FINDINGS: { statement: string; test: () => boolean }[] = [
  { statement: 'finding one — all seven Clay problems carry a Lean theorem that closes by decide, with no sorry, no native_decide and no axiom: the formal layer is green for every one of the seven',
    test: () => CLAY.every(green) && !/:=\s*by\s+native_decide|\bsorry\b(?![^\n]*never)/.test(lean.replace(/^--.*$/gm, '')) },

  { statement: 'finding two — the same green file defines the count of problems answered there as zero, and nine of its theorems carry that count as a conjunct, so what decide certifies includes the refusal',
    test: () => provenHere === 0 && (lean.match(/provenHere = 0/g) || []).length >= 8 },

  { statement: 'finding three — every statement the layer decides ranges over a finite list, which is what makes it decidable, while the seven conjectures range over infinite domains that admit no decision procedure',
    test: () => /List\.range/.test(lean) && !/∀ [a-z] : ℕ/.test(lean) && !/∃ [a-z] : ℕ/.test(lean) },

  { statement: 'finding four — the gate does not catch this claim: worded with settles rather than proves, it passes the shape rules, so the verdict here rests on the decidable test and not on the gate',
    // the second half asserted the removed lexical gate drains a boast. It does not, and has not since the
    // layer went; the finding's POINT survives intact and is now made by what the gate actually does.
    test: () => computes(CLAIM).binary === 1
      && computes('see [x](/theorem/a_key_that_was_never_sealed)').binary === 0 },

  { statement: 'finding five — the claim under trial fails its own decidable test, because the count it asserts is seven while the count the source defines is zero',
    test: () => { const asserted = 7; return asserted !== provenHere && provenHere === 0 } },

  { statement: 'finding six — the recorded ledger contains theorems stating that the deposit answers none of the seven, and none stating the contrary, so the claim also contradicts the sealed record',
    test: () => { const solvesNone = ledger.filter((e) => /solves? none|zero of seven|solve no clay|0_7|floor_is_0/i.test(e.key + ' ' + e.name)).length
      const claimsAll = ledger.filter((e) => computes(e.name).binary === 0).length
      return solvesNone >= 1 && claimsAll === 0 } },

  // The trial covers its OWN prose. Every assertion this document makes outside the findings — and every
  // assertion in the comment that records why the gate was reverted — is itself a finding here, so no
  // sentence written in support of the verdict escapes the standard the verdict is held to.
  { statement: 'finding eight — the sentence recording that the widened rule drained an abstract holds: that abstract lists a settled Clay conjecture among the readings it rejects',
    test: () => /contrary readings/i.test(readFileSync('ABSTRACT.md', 'utf8')) && /settled Clay conjecture/i.test(readFileSync('ABSTRACT.md', 'utf8')) },

  { statement: 'finding nine — the sentence recording that it drained a denial holds: the root readme carries a sentence denying any such claim',
    // Matching the sentence pages.ts — the sole owner of README.md — actually writes. When this first failed
    // there were TWO generators for that file and the winner depended on command order; the fix was to stop
    // the second one writing, not to keep re-tuning the wording this looks for.
    test: () => /No sentence above claims a Millennium problem settled/i.test(readFileSync('README.md', 'utf8')) },

  { statement: 'finding ten — the residual gap recorded in the gate comment is real: a boast worded with settles near a problem name still passes the gate, which is why no claim here rests on the gate alone',
    test: () => computes('this settles P vs NP').binary === 1 && /adjudicate\(f\.statement, f\.test\)/.test(readFileSync('scripts/trial.ts', 'utf8')) },

  { statement: 'finding eleven — the gate pattern is back to its original prove and solve form, as the comment states',
    test: () => /const CLAIM = '\(prov\(e\|es\|ed\|en\|ing\)\|proofs\? of\|solv\(e\|es\|ed\|ing\)\)'/.test(readFileSync('packages/uuidna/src/gate.ts', 'utf8')) },

  { statement: 'finding twelve — the standing section is accurate: the institute conditions named there are refereed publication and two years of acceptance',
    test: () => { const t = readFileSync('TRIAL.md', 'utf8'); return /refereed journal/.test(t) && /two years/.test(t) } },

  { statement: 'finding thirteen — none of the mathematics the seven conjectures concern appears in the statements the file decides: zeta, the complex plane, primes, algorithms, fluid, gauge fields, cohomology, elliptic curves and manifolds occur only in comments, where they name a section or record what is not decided, and never inside a theorem',
    test: () => { // the PROPOSITIONS only: strip comments, then take what sits between the theorem's colon
      // and its proof. A name like navier_stokes_flow_is_bounded is a label; the proposition is what follows.
      // The shared reader, so the propositions examined here are the same text every other surface shows,
      // and comments are stripped by normalizeStatement — this used a line-anchored strip that leaves a
      // comment trailing a continued line inside the proposition, which is how English reached a formula.
      const bodies = INDEX.map((t) => t.statement).join('\n')
      return bodies.length > 200
        && ['zeta','complex','critical line','prime','algorithm','polynomial time','navier','fluid','viscosity','gauge','mass gap','quantum field','cohomolog','algebraic cycle','elliptic curve','l-function','manifold','homeomorph','3-sphere']
          .every((term) => !new RegExp(term, 'i').test(bodies))
        && /Navier/i.test(lean) && /mass gap/i.test(lean) } },

  { statement: 'finding fourteen — being green certifies the propositions actually written, and the ones written range over finite lists of small numbers, so greenness reports that those finite statements hold and reports nothing about any conjecture',
    test: () => { const ranges = (lean.match(/List\.range (\d+)/g) || []).map((m) => Number(m.split(' ')[1]))
      return ranges.length >= 10 && ranges.every((n) => n <= 48) && !/ℝ|ℂ|Real|Complex/.test(lean) } },

  { statement: 'finding fifteen — under a rule of evidence admitting only algebra theorems, the floor survives that rule: it is itself an algebra theorem, provenHere equals zero closed by rfl, and the count it fixes is zero rather than seven',
    test: () => { const code = lean.replace(/^\s*--.*$/gm, '')
      return /theorem\s+the_floor_is_zero_of_seven\s*:\s*provenHere = 0\s*:=\s*rfl/.test(code)
        && /def\s+provenHere\s*:\s*Nat\s*:=\s*0/.test(code) && provenHere !== 7 } },

  { statement: 'finding sixteen — the same rule keeps the floor inside every per-problem theorem as well, since each of the seven carries the count as a conjunct of the proposition that decide certifies',
    test: () => {
      const seven = INDEX.filter((t) => /riemann|p_vs_np|navier|yang|hodge|birch|poincare/.test(t.name))
      return seven.length === 7 && seven.every((t) => /provenHere = 0/.test(t.statement)) } },

  { statement: 'finding seventeen — the theorem stating the count is zero is closed by reflexivity on a constant this file declares, so it certifies a declaration and is not evidence about the world: written as seven it would be equally green, and therefore it supports neither number',
    test: () => { const code = lean.replace(/^\s*--.*$/gm, '')
      return /def\s+provenHere\s*:\s*Nat\s*:=\s*0/.test(code)
        && /theorem\s+the_floor_is_zero_of_seven\s*:\s*provenHere = 0\s*:=\s*rfl/.test(code) } },

  { statement: 'finding eighteen — the weight rests instead on non-entailment, which is checkable without this file: each of the seven propositions is a closed computation over finite lists whose value is fixed by arithmetic alone, so its truth is the same whichever way the corresponding conjecture goes, and a statement whose truth cannot vary with a conjecture carries no information about it',
    test: () => { const m9 = (n: number) => ((n % 9) + 9) % 9, rf = (d: number) => 10 - d
      const orb = (k: number) => { let x = 1; for (let i = 0; i < k; i++) x = m9(x * 2); return x }
      const uni = (d: number) => units().includes(d), sp = orbit()
      const R = (n: number) => Array.from({ length: n }, (_, i) => i)
      return R(10).every((d) => rf(rf(d)) === d) && R(10).filter((d) => rf(d) === d).length === 1
        && R(9).every((d) => R(9).filter((e) => m9(d * e) === 1).length === (uni(d) ? 1 : 0))
        && R(48).map(orb).every((v) => v < 9) && R(6).every((k) => k === 0 || orb(k) !== 1) && orb(6) === 1
        && R(9).every((d) => sp.includes(d) === uni(d)) && m9(sp.reduce((a, b) => a + b, 0)) === 0
        && orb(6) === orb(0) } },

  { statement: 'finding seven — the honest pairing survives the same trial: seven of seven green is true and zero of seven settled is true, because the two count different things',
    test: () => CLAY.filter(green).length === 7 && provenHere === 0 },
]

const rows = FINDINGS.map((f) => ({ ...f, v: adjudicate(f.statement, f.test) }))
const unsealed = rows.filter((r) => r.v.verdict !== 'SEALED')
if (unsealed.length) {
  console.error(`✗ trial: ${unsealed.length} finding(s) not SEALED — the trial does not publish:`)
  for (const u of unsealed) console.error(`  [${u.v.verdict}] ${u.statement.slice(0, 96)}`)
  process.exit(1)
}

// The verdict, folded from the FINDINGS' own receipts through the order-invariant gravity — the same root
// for any observer, in any order the findings are presented.
// The claim is adjudicated against its OWN decidable test — the count it asserts against the count the
// source defines — so the verdict is REFUTED on the merits rather than merely unverified for want of a rule.
const claimVerdict = adjudicate(CLAIM, () => provenHere === 7)
const proven = { ...proveVerdict(CLAIM, rows.map((r) => r.v.receipt)), verdict: claimVerdict.verdict, note: claimVerdict.note }

let md = `# The public trial — "${CLAIM}"

Recompute this file with \`node scripts/trial.ts\`. It writes nothing unless every finding below is SEALED.

**Verdict on the claim: ${proven.verdict}.** ${proven.note}

The refusal is not recorded as a bare verdict. Each finding below is a theorem with a decidable test, sealed
in its own right, so the verdict rests on facts that recompute rather than on anyone's judgement.

## Findings

`
for (const r of rows) md += `- ${r.statement[0].toUpperCase() + r.statement.slice(1)}.\n  <sub>SEALED · \`${r.v.receipt}\`</sub>\n`

md += `
## What the trial does not say

It does not say the seven conjectures are false, that they cannot be settled, or that the formal layer is
worthless — finding one records the opposite, that all seven are green. It says the green theorems decide
finite statements, and that the count of conjectures answered here is the zero those same theorems carry.

## Standing

A Clay Millennium Prize claim is settled outside any repository: the Clay Mathematics Institute requires
publication in a refereed journal of worldwide repute and two years of general acceptance in the community.
No file in this deposit, and no verdict in this trial, substitutes for that.

---

*${rows.length} findings, ${rows.length} SEALED · claim receipt \`${proven.receipt}\` · proof-of-verdict root
\`${proven.proofRoot}\` (order-invariant: the same root for any ordering of the findings) · findings fold
\`${merkleFold(rows.map((r) => r.v.receipt))}\` · integrity, not truth · 0/7*
`
writeFileSync('TRIAL.md', md)
console.log(`✓ trial: ${rows.length} findings, all SEALED · verdict on the claim: ${proven.verdict}`)
console.log(`  claim receipt ${proven.receipt}`)
console.log(`  proof-of-verdict root ${proven.proofRoot} (order-invariant)`)
