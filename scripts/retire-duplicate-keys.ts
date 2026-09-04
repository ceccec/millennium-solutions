#!/usr/bin/env node
// TWO ADDRESSES FOR ONE THEOREM — the oldest open item in this tree, retired.
//
// 25 theorems carry both a bare key (`lean_units_are_six`) and a namespaced one
// (`lean_z9_units_are_six`). The namespace convention arrived after the first sealing and both keys were
// sealed, so the same proposition has two live addresses. It has been reported in every census this session
// as "keyed twice" and never resolved.
//
// WHAT IS AND IS NOT BEING SAID. The bare key is not a failed claim — its theorem stands and the kernel
// re-checks it on every run. What is wrong is that it is a SECOND ADDRESS for something already addressed,
// so a reader citing it and a reader citing the namespaced key cite the same theorem without either knowing.
// It is marked with `supersededBy` pointing at the namespaced key and a reason that says exactly that, which
// is the same mechanism seal-lean uses for a renamed theorem and which statusOf reports as `carried` — a
// category forensics already keeps distinct from "withdrawn with nothing proving them".
//
// APPEND-ONLY IS RESPECTED. Nothing is deleted, no receipt is touched, no key is renamed, and the order is
// unchanged. The entry stays in the chain and is marked in place.
//
// WHICH ONE SURVIVES needs no judgment: the namespaced key is unambiguous and the bare one is not — that is
// why the convention exists, and it is why `lean_add_group` remains unresolvable, being a bare name declared
// in two files with no namespaced key to fall back to.
import { readFileSync, writeFileSync } from 'node:fs'
import { ledger as __ledger, leanTheorems, theoremOfKey } from '../src/api/index.ts'

const ledger = __ledger() as { key: string; name: string; revoked?: boolean; reason?: string; supersededBy?: string }[]
const T = leanTheorems()
const byThm = new Map<string, string[]>()
for (const e of ledger) {
  if (e.revoked) continue
  const t = theoremOfKey(e.key, T)
  if (t) byThm.set(t.name, [...(byThm.get(t.name) ?? []), e.key])
}

let retired = 0, skipped = 0
for (const [name, keys] of byThm) {
  if (keys.length < 2) continue
  const namespaced = keys.filter((k) => k !== `lean_${name}`).sort((a, b) => b.length - a.length)[0]
  const bare = keys.find((k) => k === `lean_${name}`)
  if (!namespaced || !bare) { skipped++; console.log(`  ○ ${name}: ${keys.length} keys and no clear bare/namespaced split — left alone`); continue }
  const e = ledger.find((x) => x.key === bare)!
  if (e.revoked) continue
  if (process.argv.includes('--retire')) {
    e.revoked = true
    e.supersededBy = namespaced
    e.reason = `duplicate address: this key and ${namespaced} both address the theorem \`${name}\`, sealed before and `
      + `after the namespace convention. The statement STANDS and the kernel re-checks it on every run at `
      + `${namespaced}; what is withdrawn is this second address for it, so one theorem has one address. `
      + `Marked in place — the receipt is untouched and stays in the append-only chain.`
  }
  retired++
}

if (process.argv.includes('--retire')) writeFileSync('src/proof/discovered.json', JSON.stringify(ledger, null, 2) + '\n')
console.log(`\n${'✓'} retire-duplicate-keys: ${retired} bare key(s) ${process.argv.includes('--retire') ? 'retired in favour of' : 'would be retired in favour of'} their namespaced form`
  + (skipped ? `, ${skipped} left alone for having no clear split` : ''))
