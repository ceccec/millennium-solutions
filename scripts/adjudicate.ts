#!/usr/bin/env node
// The forensic tool — for any statement, a recomputable verdict. It NEVER claims absolute truth:
// the honesty gate is a floor, not an oracle (a gate-clean falsehood like "2+2=5" still passes it).
// So the verdict is three-way and honest about its own limit:
//   REFUTED    — the gate drains a named overclaim, OR a supplied decidable test fails (counterexample).
//   SEALED     — gate-clean AND a decidable test holds → recomputable, admissible.
//   UNVERIFIED — gate-clean but no recomputable receipt supplied → the floor is not an oracle; it may
//                still be true or false. Bring a decidable test to move it to SEALED or REFUTED.
// Integrity, not truth. Everything content-addressed. 0/7.
import { toUuid } from '../src/0/index.ts'
// The trial lives canonically in @uuidna/uuidna — one implementation, no duplication. adjudicate returns the
// three-way verdict; proveVerdict folds the formula receipts through the order-invariant gravity to one proof-
// of-verdict root; verifyUuidna folds the multi-perspective ("quantum") receipt. Integrity, not truth. 0/7.
export { adjudicate, proveVerdict, verifyUuidna } from '@uuidna/uuidna'
export type { Verdict, VerdictKind, ProvenVerdict, UuidnaVerdict } from '@uuidna/uuidna'
import { adjudicate } from '@uuidna/uuidna'

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
