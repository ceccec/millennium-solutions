#!/usr/bin/env node
// PARALLEL-SEAL — what order-invariance actually buys, measured rather than assumed.
//
// I told the owner the ledger has "a single writer" and so teams must seal serially. That was wrong as
// stated, and the deposit's own theorems say so: merkleFold SORTS its leaves before pairing, which is why
// fold_is_order_independent_on_two and _on_three hold. Segments sealed by independent workers fold to the
// SAME root whatever order they arrive in — nobody has to wait for a turn to keep the root correct.
//
// But two constraints were being conflated, and only one of them is dissolved:
//
//   ORDER — dissolved. The merkle root does not depend on who finished first. Proved, not assumed.
//   WRITES — not dissolved. The chain is receipt = toUuid(previous → key), which is order-DEPENDENT by
//            construction: that is exactly what makes it tamper-evident, since altering one link changes
//            every receipt after it. And the ledger is one JSON file, so two processes appending to it race
//            regardless of what the mathematics permits.
//
// So parallel sealing is licensed by the fold and blocked by the file. Sharding the ledger per segment would
// remove the second constraint too; that is a real change to the record's shape and is not made here on the
// strength of a convenience. This script measures the claim so the option rests on a number.
import { readFileSync } from 'node:fs'
import { merkleFold } from '../src/0/index.ts'

const led = JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) as
  { key: string; receipt: string; revoked?: boolean }[]
const live = led.filter((e) => !e.revoked)

// segment by the Lean file each theorem came from — the natural unit of independent work
const segs = new Map<string, string[]>()
for (const e of live) {
  const m = e.key.match(/^lean_([a-z0-9]+)_/)
  const s = m ? m[1] : 'other'
  ;(segs.get(s) ?? segs.set(s, []).get(s)!).push(e.receipt)
}
const names = [...segs.keys()].sort()
const roots = names.map((n) => merkleFold(segs.get(n)!))

// the same segment roots, folded in several arrival orders
const rot = (a: string[], k: number) => a.slice(k).concat(a.slice(0, k))
const orders = [roots, rot(roots, 1), rot(roots, Math.floor(roots.length / 2)), [...roots].reverse()]
const folded = orders.map((o) => merkleFold(o))
const invariant = folded.every((f) => f === folded[0])

console.log(`parallel-seal — ${live.length} live receipts in ${names.length} segments (by Lean file):`)
for (const n of names) console.log(`  ${n.padEnd(18)} ${String(segs.get(n)!.length).padStart(4)} receipt(s)`)
console.log(`\n  segment-root fold, ${orders.length} different arrival orders:`)
for (const f of folded) console.log(`    ${f}`)
console.log(`  order-invariant: ${invariant ? 'YES — any worker may finish first' : 'NO'}`)
console.log(`\n  What this licenses: independent workers sealing independent segments, with no agreed order.`)
console.log(`  What it does NOT license: two processes appending to one discovered.json. The chain is`)
console.log(`  order-dependent on purpose (that is the tamper-evidence) and the file is a single artefact.`)
console.log(`  To seal in parallel for real, the ledger shards per segment — a change to the record's shape,`)
console.log(`  not a scheduling tweak.`)
process.exit(invariant ? 0 : 1)
