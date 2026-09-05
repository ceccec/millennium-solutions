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
import { mergeKey, statementAddress, normaliseForFixture } from '../src/publication/index.ts'

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
// The NORMALISED form and both character counts travel with every pin. zeropoint-node diverged from this
// deposit on a peer claim and proposed the byte count as the diagnostic; it was the ENTIRE answer — this
// normaliser deletes the space after a semicolon, so 163 characters become 162 and every downstream value
// differs. A pin carrying only statement→uuid cannot show that. One carrying the length shows it in a line.
F.addresses = STATEMENTS.map((s) => {
  const n = normaliseForFixture(s)
  return {
    statement: s,
    rawLength: [...s].length,
    normalised: n,
    normalisedLength: [...n].length,
    mergeKeySha256: mergeKey(s),
    mergeKeyUuid: shaped(s),
    localFnvAddress: statementAddress(s),
  }
})

if (process.argv.includes('--write')) {
  writeFileSync(P, JSON.stringify(F, null, 2) + '\n')
  console.log(`✓ fixture-addresses: ${F.addresses.length} pins emitted → ${P}`)
} else {
  // VERIFY, not merely display. The pins were checked inside scripts/unique.ts, which is a REPORT that exits
  // non-zero whenever it finds same-text candidates for a reader — so it is not in CI and can never be a
  // clean-tree control. Pin drift therefore had no gate that could go from green to red. It does now.
  const stored = JSON.parse(readFileSync(P, 'utf8')).addresses as typeof F.addresses | undefined
  let bad = 0
  for (const a of F.addresses) {
    const was = stored?.find((x) => x.statement === a.statement)
    if (!was) { console.log(`  ✗ no stored pin for: ${a.statement.slice(0, 56)}`); bad++; continue }
    // EVERY FIELD, not the two I happened to think of. The first version compared only mergeKeyUuid and
    // normalisedLength, so gates-fire mutated mergeKeySha256 and the gate accepted it: a check narrower than
    // the record it guards leaves the rest of that record unheld. Compared field by field, derived from the
    // object itself, so a field added later is covered without anyone remembering to add it here.
    const differs = (Object.keys(a) as (keyof typeof a)[]).filter((k) => String(was[k]) !== String(a[k]))
    if (differs.length) {
      console.log(`  ✗ pin drifted on ${differs.join(', ')}: ${a.statement.slice(0, 44)}`)
      for (const k of differs) console.log(`      ${String(k)}: stored ${String(was[k]).slice(0, 40)} · computed ${String(a[k]).slice(0, 40)}`)
      bad++
    }
  }
  // ── THE FIXTURE MUST BE ABLE TO CATCH THE DEFECT IT EXISTS FOR ─────────────────────────────────────────
  // zeropoint-node showed that the single pin I sent them reproduces IDENTICALLY under `[A-Za-z0-9_]` in
  // place of `\p{L}` — same byte count, same UUID — while that swap corrupts every Greek identifier, the
  // 211-of-832 failure the spec warns about in the same sentence. Their pin was thin; the fixture as a whole
  // is not (3 of 5 pins discriminate). But nothing PROVED that, so trimming the fixture to Latin-only cases
  // would have left a green gate blind to its own headline defect.
  //
  // So the fixture now asserts its own discriminating power: at least one pin must change under the ASCII
  // class. A fixture that passes under the defect it exists to catch is not a fixture.
  const ascii = (x: string) => x.replace(/\s+/gu, ' ')
    .replace(/\s(?![A-Za-z0-9_])|(?<![A-Za-z0-9_.])\s/gu, '')
    .replace(/==/g, '=').replace(/!=/g, '≠')
  const discriminating = F.addresses.filter((a) => ascii(a.statement) !== a.normalised)
  if (!discriminating.length) {
    console.log(`  ✗ no pin distinguishes \\p{L} from [A-Za-z0-9_] — the fixture cannot detect the very`)
    console.log(`      regression it documents. Add a statement carrying a non-Latin identifier.`)
    bad++
  } else {
    console.log(`  ${discriminating.length} of ${F.addresses.length} pins change under the ASCII class — the fixture can see that regression`)
  }

  console.log(bad
    ? `\n✗ fixture-addresses: ${bad} of ${F.addresses.length} published pin(s) no longer reproduce`
    : `\n✓ fixture-addresses: all ${F.addresses.length} published pins reproduce, normalised lengths agree`)
  process.exit(bad ? 1 : 0)
}
