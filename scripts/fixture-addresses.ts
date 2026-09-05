/** Emit the cross-repository address pins INTO docs/statement-address-fixture.json.
 *
 *  Every value here is computed by the implementation in this run. None is typed. That rule exists because
 *  I broke it: I handed two peer repositories a pinned pair whose halves did not correspond — the statement
 *  was my reconstruction of a console line truncated at 50 characters, and the UUID was computed from the
 *  real 163-character record. zeropoint-node implemented the published STRING correctly, got a different
 *  UUID, and reported it as a divergence to hunt. Their implementation was right and my pin was wrong.
 *
 *  A test vector's entire purpose is to be the object that cannot be wrong, so retyping either half destroys
 *  the only property it has. `npm run fixture:addresses -- --write` regenerates; scripts/unique.ts verifies
 *  on every run, so a drifting normaliser or hash is caught here rather than in someone else's afternoon. */
import { readFileSync, writeFileSync } from 'node:fs'
import { mergeKey, statementAddress } from '../src/publication/index.ts'

const shaped = (statement: string): string => {
  const b = [...Buffer.from(mergeKey(statement), 'hex').subarray(0, 16)]
  b[6] = (b[6] & 0x0f) | 0x80
  b[8] = (b[8] & 0x3f) | 0x80
  const h = b.map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

// Statements chosen to exercise the parts that have actually broken across repositories: a Greek identifier
// (the ASCII class corrupted these), symbol adjacency, an equality rewrite, and a long natural-language
// claim from a peer corpus — the one whose pin I got wrong.
const STATEMENTS = [
  "an API operation carries at least the access its collection's strictest standard demands; an endpoint below its legal floor is a gap named before it can be called.",
  'σ (σ l) = l',
  'H₁(Σ₂) = ℤ⁴ with χ = -2',
  '(List.range 9).all (fun d => refl (refl d) == d)',
  'every residue of ℤ/9 has an additive inverse',
]

const P = 'docs/statement-address-fixture.json'
const F = JSON.parse(readFileSync(P, 'utf8'))
F.addresses_note = 'EMITTED BY scripts/fixture-addresses.ts, never typed. mergeKey = sha256(normalise(s)) '
  + 'is the cross-repository key; statementAddress = FNV-1a over the same normalised form is this deposit\'s '
  + 'own ledger address. A peer checking compatibility should reproduce `mergeKeyUuid`.'
F.addresses = STATEMENTS.map((s) => ({
  statement: s,
  mergeKeySha256: mergeKey(s),
  mergeKeyUuid: shaped(s),
  localFnvAddress: statementAddress(s),
}))

if (process.argv.includes('--write')) {
  writeFileSync(P, JSON.stringify(F, null, 2) + '\n')
  console.log(`✓ fixture-addresses: ${F.addresses.length} pins emitted → ${P}`)
} else {
  for (const a of F.addresses) console.log(`  ${a.mergeKeyUuid}  ${a.statement.slice(0, 58)}`)
  console.log(`\n○ fixture-addresses: ${F.addresses.length} pins computed (run with --write to store)`)
}
