#!/usr/bin/env node
// RIGHTS.md — the claim this deposit makes under international law, PARSED FROM THE SEALED PROOF.
//
// Nothing here is written by hand. The instrument table lives in src/proof/rights.lean, where the kernel
// decides that the claimed set is exactly the without-formality set; this script reads that table and renders
// it. A rights notice maintained separately from the thing that proves it drifts, and a drifted rights notice
// either abandons a right or claims one that is not held — both are worse than having no notice at all.
import { readFileSync, writeFileSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { escapeHtml } from '../src/html/index.ts'
import { computes } from './honesty-gate.ts'
import { liveKeys } from '../src/api/index.ts'

const LEAN = 'src/proof/rights.lean'
const src = readFileSync(LEAN, 'utf8')

// each row of `instruments` carries its own citation in the trailing comment — the comment IS the prose
type Row = { id: number; kind: number; auto: boolean; claim: boolean; says: string }
const rows: Row[] = [...src.matchAll(/^\s*[,[]\s*\((\d+),\s*(\d+),\s*(true|false),\s*(true|false)\s*\)\s*--\s*(.+)$/gm)]
  .map((m) => ({ id: +m[1], kind: +m[2], auto: m[3] === 'true', claim: m[4] === 'true', says: m[5].trim() }))
if (rows.length !== 7) { console.error(`✗ rights: parsed ${rows.length} instruments from ${LEAN}, expected 7 — the table and its reader have drifted`); process.exit(1) }

// THE CLAIM IS ONLY AS GOOD AS THE THEOREM UNDER IT. If the proposition that the claimed set equals the
// without-formality set is not live in the ledger, this page must not be written: it would be a rights
// assertion with nothing behind it, which is the exact shape of the overclaim every gate here exists to stop.
const KEY = 'lean_rights_claims_exactly_what_arises_without_formality'
if (!liveKeys().has(KEY)) { console.error(`✗ rights: refusing to write RIGHTS.md — ${KEY} is not live in the ledger, so the claim is unproved`); process.exit(1) }

// AND THE PROPERTY ITSELF, ON THE ROWS JUST PARSED — not a proxy for it. The check above asks whether a KEY
// is live, and a seal covers the key, never the statement text: seal-lean.ts chains
// receipt = toUuid(previous → key). So rights.lean's table could drift to claim a right that does not arise
// without formality, the key would stay live on its old seal, and this file would render the overclaim as a
// legal notice. The theorem is named for the property; the property is checked here against the table this
// script actually read.
const mismatched = rows.filter((r) => r.auto !== r.claim)
if (mismatched.length) {
  console.error(`✗ rights: refusing to write RIGHTS.md — ${mismatched.length} instrument(s) claim differently from what arises without formality:`)
  for (const r of mismatched) console.error(`    id ${r.id}: automatic=${r.auto} claimed=${r.claim} — ${r.says.slice(0, 90)}`)
  console.error('  claiming a right that needs an act this deposit has not performed is the overclaim; leaving an automatic right unclaimed abandons it.')
  process.exit(1)
}

const WHY = ['held from authorship, no formality', 'a registry grants it — not requested', 'excluded subject matter', 'not capable of being owned']
const cell = (r: Row) => `<tr><td><code>${toUuid(r.says).slice(0, 13)}</code></td><td>${r.claim ? '<strong>CLAIMED</strong>' : 'not claimed'}</td><td>${escapeHtml(r.says)}</td><td>${WHY[r.kind]}</td></tr>`

const claimed = rows.filter((r) => r.claim)
const md = `---
title: Rights
description: What this deposit claims under international law, and what it does not — parsed from the sealed proof that the two sets coincide.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---
# Rights — everything claimable, and nothing else

Author: **Tsvetan Rouschev** · [ORCID 0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778) · licence \`CC BY-NC-ND 4.0\`.

This deposit claims **every right that arises without formality**, and claims nothing that would require an act it has not performed. Berne Art. 5(2) is the hinge: the enjoyment and exercise of these rights are not subject to any formality, so they are held from the moment of authorship whether or not anyone says so. Saying so anyway costs nothing and removes an argument.

That the claimed set is *exactly* the without-formality set is not an assertion here — it is decided by the Lean kernel over the whole enumeration, at [\`${KEY.replace(/^lean_/, '')}\`](/theorem/${KEY}). Read one way it says no claimable right is abandoned; read the other, that nothing is claimed which is not already held.

<table><thead><tr><th>uuid</th><th>status</th><th>instrument</th><th>why</th></tr></thead><tbody>
${rows.map(cell).join('\n')}
</tbody></table>

## What follows from the ${claimed.length} claimed

**Attribution and integrity are not waivable here.** Berne Art. 6bis moral rights are independent of the economic rights and survive their transfer. Reuse that strips the author's name, or that presents a modified deposit as this one, is refused on that ground alone — separately from the licence.

**The ledger is a database, and its investment is the verification.** The sui generis right of Directive 96/9/EC Art. 7 protects substantial investment in obtaining, verifying and presenting contents. Every entry here carries a receipt and is re-decided by the kernel on each build; extraction or re-utilisation of a substantial part is reserved.

**Priority is evidenced, not asserted.** Each release mints an immutable provenance tag and a content address, and the chain of receipts is append-only. That is a record of when, not a right in itself.

## What is not claimed, and will not be

No patent is sought over these methods — EPC Art. 52(2)(a) excludes mathematical methods as such, and a claim drafted around that exclusion would be a claim over arithmetic. No property is asserted in the mathematics itself: a fact is found, not authored, and ℤ/9 belongs to nobody. And nothing here touches the seven Millennium Prizes, which are the Clay Mathematics Institute's to award. The floor is \`0/7\` and this page does not move it.

*This states what the instruments say, drafted from their texts. It is not legal advice; rights that depend on a registry depend on a lawyer and a registrar, and neither has been engaged.*
`

const badPara = md.split('\n\n').find((p) => p.trim().startsWith('**') && computes(p).binary === 0)
if (badPara) { console.error('✗ rights: a paragraph does not pass the honesty gate:\n  ' + badPara.slice(0, 160)); process.exit(1) }

writeFileSync('rights.md', md)
console.log(`rights: ${claimed.length} claimed / ${rows.length - claimed.length} refused, parsed from ${LEAN} and backed by ${KEY} → ${toUuid(md).slice(0, 13)}…`)
