#!/usr/bin/env node
// The forensic tool — for any statement, a recomputable verdict. It NEVER claims absolute truth: the gate is
// a floor, not an oracle (a gate-clean falsehood like "2+2=5" passes it). The verdict is three-way, and it is
// decided ENTIRELY by the supplied test:
//   SEALED     — a decidable test recomputes true → recomputable, admissible.
//   REFUTED    — a decidable test recomputes FALSE → a counterexample stands against the statement as written.
//   UNVERIFIED — no decidable test was supplied. Not false: nobody has brought a proof.
//
// This header used to say REFUTED could also come from "the gate draining a named overclaim". That path has
// been unreachable since the lexical layer was removed — the gate no longer drains overclaims, and all three
// returns below decide on the test before any gate result is consulted. The sentence described an era, not
// the code, and a stale doc-comment is worse than none because it reads exactly like a live contract. Found
// by measurement, not by rereading: an audit of the ledger's own gate-dependent claims turned it up.
// Integrity, not truth. Everything content-addressed. 0/7.
import { toUuid } from '../src/0/index.ts'
// The trial lives canonically in @uuidna/uuidna — one implementation, no duplication. adjudicate returns the
// three-way verdict; proveVerdict folds the formula receipts through the order-invariant gravity to one proof-
// of-verdict root; verifyUuidna folds the multi-perspective ("quantum") receipt. Integrity, not truth. 0/7.
export { proveVerdict, verifyUuidna } from '@uuidna/uuidna'
export type { ProvenVerdict, UuidnaVerdict } from '@uuidna/uuidna'
import { adjudicate as packaged, type Verdict as PackagedVerdict } from '@uuidna/uuidna'
import { computes } from './honesty-gate.ts'

// THE THIRD VERDICT, RESTORED — and why it is not a re-implementation.
//
// The packaged trial narrowed to two kinds, VERIFIED | UNVERIFIED, and files a FAILING decidable test as
// UNVERIFIED with the note "not false". The caution behind that is real: a test can fail because the test is
// wrong, not because the claim is. But collapsing the bucket loses the difference between "a counterexample
// exists" and "nobody has looked", and that difference is the whole point of a trial. It is also not
// hypothetical here — the Lean kernel refuted a theorem in this deposit today (a comparison of seal-bits
// against a leaf count), and "UNVERIFIED" would have been a false description of what happened.
//
// So the deposit keeps three kinds. Nothing is judged by wording: the verdict is read off the test's own
// boolean, which is the theorem itself. No lexicon, no word list, no second implementation of the trial —
// the packaged adjudicate still produces the statement, receipt and development path, and this widens only
// the kind. The caution it was narrowed for is preserved in the note rather than by deleting the bucket.
export type VerdictKind = 'SEALED' | 'REFUTED' | 'UNVERIFIED'
// gateBinary is the gate's own 0/1 on the statement, which the packaged Verdict stopped carrying. It is
// reported, never used to decide the kind: the gate is a floor, not an oracle, and since the lexical layer
// was removed it only answers whether a cited theorem is sealed. A 1 here means "nothing the gate checks
// objected", which is a much smaller statement than it used to be — that is why it is a column, not a verdict.
export interface Verdict extends Omit<PackagedVerdict, 'verdict'> { verdict: VerdictKind; gateBinary: 0 | 1 }

export function adjudicate(statement: string, decidableTest?: () => boolean): Verdict {
  const base = { ...packaged(statement, decidableTest), gateBinary: computes(statement).binary }
  if (!decidableTest) return { ...base, verdict: 'UNVERIFIED' }
  let held = false
  try { held = decidableTest() === true } catch { held = false }
  if (held) return { ...base, verdict: 'SEALED' }

  // A REFUTATION IS NOT A DEAD END. The packaged development path assumes no test was supplied and tells you
  // to bring one — useless advice to someone who brought one and watched it fail. What a counterexample
  // actually licenses is a short list of computable moves, and one of them always applies: the claim is too
  // wide (narrow it until it holds, and the narrowed form is a theorem), or the test is wrong (then the
  // refutation lands on the test), or the boundary is itself the interesting object and can be searched for.
  // This is not consolation. It is what happened to this deposit today: a theorem comparing seal-bits against
  // a leaf count was refuted by the kernel, the units were made to match, and the corrected form sealed.
  return {
    ...base,
    verdict: 'REFUTED',
    note: 'its decidable test recomputes FALSE — a counterexample stands against the statement AS WRITTEN. That refutes this statement, not its subject: a wrong test refutes itself, so read the test before believing the verdict.',
    develop: [
      'Read the counterexample first. If the test misstates the claim, the refutation is of the test — fix the test and re-run; nothing has been learned about the subject yet.',
      'If the test is right, the claim is too wide. Narrow the domain until it holds — the narrowed statement is a theorem, and a smaller true thing outranks a larger false one.',
      'Search for the boundary: the largest sub-domain where the predicate still recomputes true. Over a finite structure that search is itself decidable, so the boundary is a theorem too.',
      'Check the units and the types on both sides of every comparison. A refutation that surprises you is usually two different quantities being compared as though they were one.',
    ],
  }
}

// uuidna domain control — verified INDEPENDENTLY, not by anyone's word. The controller publishes the
// challenge token at a place only they can write (e.g. https://<domain>/.well-known/uuidna.txt, or a
// DNS TXT record, or a meta tag on the site); anyone recomputes the expected token and checks the
// published one matches. Control is PROVEN by the publication — no trust. The fetch is the verifier's
// task (external); the token and the comparison are decidable and reproducible here. Integrity, not truth.
export function domainChallenge(domain: string): string {
  return toUuid('uuidna:domain-control:' + domain.toLowerCase())
}
export function verifyDomainControl(domain: string, publishedToken: string): boolean {
  return publishedToken === domainChallenge(domain)
}

// CLI: `node scripts/adjudicate.ts "statement one" "statement two" ...`
if (import.meta.url === `file://${process.argv[1]}`) {
  const statements = process.argv.slice(2)
  if (!statements.length) {
    console.log('usage: node scripts/adjudicate.ts "<statement>" ["<statement>" ...]')
  } else {
    for (const s of statements) {
      const v = adjudicate(s)
      const mark = v.verdict === 'SEALED' ? '✓' : v.verdict === 'REFUTED' ? '✗' : '?'
      console.log(`  ${mark} ${v.verdict.padEnd(10)} ${v.receipt.slice(0, 13)}…  ${s}`)
      console.log(`      ${v.note}`)
    }
    console.log('\n  verdicts are integrity, not truth — UNVERIFIED means bring a decidable test. 0/7.')
  }
}
