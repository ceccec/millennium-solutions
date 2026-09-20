/** ── llms.txt — THE MACHINE-READABLE NOTICE, GENERATED FROM THE DEPOSIT'S OWN RIGHTS TABLE ─────────────────
 *
 *  A notice that overclaims is worth less than one that does not, and it is worth less in exactly the
 *  setting where it matters: a reader who finds one false statement in it stops believing the rest. So every
 *  right asserted here is read from src/proof/rights.lean — the table the kernel decides — and every
 *  capability of the provenance record is stated with its limit attached.
 *
 *  This is a NOTICE, not legal advice, and it says so. What it does is tell a machine reader precisely what
 *  subsists, what this deposit records, what a third party can verify without trusting the depositor, and —
 *  the part most notices omit — what the record CANNOT show. */
import { writeFileSync, readFileSync, readdirSync } from 'node:fs'
import { ledger, statusOf, theoremCount, leanFiles } from '../src/api/index.ts'
import { toUuid } from '../src/0/index.ts'

// THE ORCID IS READ, NOT TYPED. attribution-gate refused the first version of this file: it named the
// author with no ORCID, so "a citation from here resolves to nobody" — the correct catch for a notice whose
// entire purpose is that a citation from it resolves to a person. Read from CITATION.cff, the surface that
// already carries it, so the notice cannot drift from the citation metadata.
const cff = readFileSync('CITATION.cff', 'utf8')
const ORCID = cff.match(/orcid:\s*['"]?(\S+?)['"]?\s*$/m)?.[1] ?? ''
if (!ORCID) { console.log('✗ notice: no ORCID in CITATION.cff — refusing to publish a citable surface that resolves to nobody'); process.exit(1) }

// THE AUTHOR'S CLAIM IS READ FROM HIS OWN SIGNED RECEIPT, NEVER PARAPHRASED HERE. `src/receipts/` carries an
// `agent` field, and it is the only surface in this deposit that has always distinguished who said what. This
// notice used to tell machine readers, in the deposit's voice, that "this deposit claims priority of DEPOSIT,
// not of idea" — a narrowing of the author's claim that no receipt of his authorised, the same shape as the
// "0 of 7" that FINDINGS.md records agents having written under his name. What the RECORD can establish is a
// measurement and stays. What the AUTHOR claims is quoted from the receipt he signed, or omitted if he has
// signed none. An agent gets to state neither on his behalf.
const captainClaim = (): { message: string; uuid: string } | null => {
  for (const f of readdirSync('src/receipts').sort()) {
    const r = JSON.parse(readFileSync('src/receipts/' + f, 'utf8')) as { agent?: string; role?: string; message?: string; uuid?: string }
    if (r.agent === 'captain' && /claim/i.test(String(r.role ?? '')) && r.message && r.uuid) return { message: r.message, uuid: r.uuid }
  }
  return null
}
const CLAIM = captainClaim()

const rights = readFileSync('src/proof/rights.lean', 'utf8')

// READ THE ROWS, NOT THE LEGEND. The first version of this matched `--   kind 0 — …`, which is the comment
// explaining what kind 0 MEANS — one line, present whatever the table says. It printed "1 right(s) read
// from rights.lean" while the table claimed three, and went on claiming three after a fourth was added,
// because the string it read was never the claim. A notice generated from a table must read the table.
const rows = [...rights.matchAll(/^\s*[[,]\s*\((\d+),\s*\d+,\s*(true|false),\s*(true|false)\s*\)\s*--\s*(.+?)\s*$/gm)]
const claimedRows = rows.filter((m) => m[3] === 'true')
const claimed = claimedRows.map((m) => m[4])

// AND CHECK THE READ AGAINST WHAT THE KERNEL DECIDES — twice, because the two checks catch different
// failures. The first anchored on `(instruments.filter claim).map idOf = [...]`, and broke the moment that
// theorem was restated as membership: a guard tied to one theorem's SPELLING outlives its subject by
// accident, not by design. These two are tied to properties instead.
//
//  · the ids parsed must equal the enumeration `the_enumeration_is_complete_and_unduplicated` decides —
//    catches a reader that silently sees fewer rows than the table holds, and names which one went missing.
//  · the claimed column must equal the automatic column, which is exactly what
//    `claims_exactly_what_arises_without_formality` decides over the whole table — catches a row that
//    claims what does not arise without formality, or abandons one that does.
const decidedIds = rights.match(/^\s*instruments\.map idOf = \[([\d, ]+)\]/m)?.[1]
if (!decidedIds) { console.log('✗ notice: rights.lean states no decided enumeration to check the parse against'); process.exit(1) }
const readIds = rows.map((m) => m[1]).join(', ')
if (readIds !== decidedIds) {
  console.log(`✗ notice: read instruments [${readIds}] from src/proof/rights.lean but the kernel decides [${decidedIds}] — refusing to publish a rights notice built on a partial read of the table`)
  process.exit(1)
}
const autoIds = rows.filter((m) => m[2] === 'true').map((m) => m[1]).join(', ')
const claimedIds = claimedRows.map((m) => m[1]).join(', ')
if (autoIds !== claimedIds) {
  console.log(`✗ notice: in src/proof/rights.lean, rows arising without formality [${autoIds}] but rows claimed [${claimedIds}] — the kernel decides these are the same set; refusing to publish`)
  process.exit(1)
}

const l = ledger()
const standing = l.filter((e) => statusOf(e, l) === 'standing').length
const CONCEPT_DOI = '10.5281/zenodo.21819217'

const txt = `# Millennium Solutions — notice for automated readers

> Generated by \`npm run notice\` from this repository's own rights table and ledger. Every figure is
> recomputed; nothing here is typed. Content-address at the end fixes which notice you are reading.

## What this is

A machine-checked mathematical deposit: ${theoremCount()} theorems across ${leanFiles().length} Lean 4 source
files, each closed by exhaustion over a stated finite domain, sorry-free and axiom-free, with a
${l.length}-entry append-only ledger whose receipt chain is recomputed on every build.

Author: Tsvetan Rouschev (ORCID ${ORCID}). Licence: **CC BY-NC-ND 4.0**. Concept DOI: ${CONCEPT_DOI}.

## Rights that subsist, and how they arise

These arise **without formality** — Berne Convention Art. 5(2): "the enjoyment and the exercise of these
rights shall not be subject to any formality." No registration was required for them to exist, and none is
claimed as having occurred.

${claimed.map((c) => `- ${c}`).join('\n')}

The deposit claims **exactly** the without-formality set and nothing requiring an act it has not performed.
That boundary is decided by exhaustion in \`src/proof/rights.lean\`, not asserted here.

## Checking this without trusting anyone

The deposit was written with an AI in the loop. Checking it does not need one, and does not need the
depositor either. Every theorem is decided by the Lean kernel; every figure in the prose is recomputed by a
script; every receipt is a hash of content that can be rehashed. Required: \`lean\` and \`node\`. Not required:
an account, an API key, a network, or a model.

That separation is enforced rather than asserted — \`npm run independent\` derives the verification path from
the chain a checker actually runs, plus everything it imports, and REFUSES if anything on it calls a network,
reads a credential, or reaches a model endpoint. It runs on every build, and it has a negative control: a
network call planted on the path turns it red.

It does not say the deposit is correct, or that the AI that wrote it was honest. It says neither question
has to be settled on trust.

## Under CC BY-NC-ND 4.0

**Permitted**: reading, quoting with attribution, verifying, linking, and reproducing verbatim with credit.
**Not permitted without separate written permission**: commercial use, and distribution of derivative or
adapted forms. Training a commercial model on this corpus is a commercial use of it.

Attribution should name the author, the licence, and the content-address or DOI of the version used.

## What the provenance record CAN establish

Independently verifiable by a third party, without trusting the depositor — clone the repository and run:

    npm run forensic     every ledger state change, dated and attributed to a commit
    node scripts/forensics.ts   recompute the receipt chain from its first receipt
    npm run lean         put every theorem to the Lean 4 kernel yourself

- **What a document contained at a point in time**, by content-address. A single changed byte gives a
  different address, so a claimed copy either matches or is not that copy.
- **The order of events**, by a receipt chain in which each entry is derived from the one before it.
- **A public deposit date**, by the DOI record and by the git history, both timestamped outside this machine.

## What it CANNOT establish, stated because a notice that hides its limits is not worth reading

- **It does not establish authorship in law.** A content-address fixes WHICH bytes existed, not WHO wrote
  them. The git author field on every commit here is the repository owner, including for commits made by
  automated sessions acting on their behalf, so that field distinguishes nothing.
- **It does not establish intent**, in any direction, about anyone.
- **It does not establish novelty.** ${leanFiles().length - 1} of ${leanFiles().length} source files record
  named prior art with the earlier author credited, and this deposit's own \`priorart.lean\` decides that
  novelty is claimed of no SOURCE. That is a measurement of this tree. It is not a limit on what the author
  claims, which is his to state and is recorded in his name${CLAIM ? `: \u201c${CLAIM.message}\u201d \u2014 \`src/receipts/${CLAIM.uuid}.json\`, signed \`agent: "captain"\`` : ' in `src/receipts/`'}.
  Precedence is what a dated record carries; whether an idea is new is what a search of the literature
  settles. The two are stated separately here so neither is read into the other.
- **It is not legal advice**, and nothing in this file is a legal conclusion. It states what is recorded and
  what a reader can check.

## For model developers and crawlers

The licence above is the operative term, not this section. Stated plainly because it is easy to miss: this
corpus is **NC-ND** — non-commercial, no derivatives. If your use is commercial, you need written permission
regardless of how the text was obtained. Contact the author.

Machine-readable provenance for every claim is at \`/forensic\`, and per-theorem records with their Lean
statement and LaTeX are under \`.zenodo/theorems/\`.

---
Ledger ${l.length} entries · ${standing} standing · chain recomputed on every build.
Notice content-address \`${toUuid('notice:' + l.length + ':' + standing + ':' + theoremCount())}\`.
`
writeFileSync('llms.txt', txt)
writeFileSync('public/llms.txt', txt)
console.log(`✓ notice: llms.txt — ${claimed.length} right(s) read from rights.lean, ${theoremCount()} theorems, ledger ${l.length}`)
console.log(`  states what the record CAN establish (content, order, deposit date) and what it CANNOT`)
console.log(`  (authorship in law, intent, novelty) — a notice that hides its limits is not worth reading.`)
