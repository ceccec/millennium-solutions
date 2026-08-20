#!/usr/bin/env node
// SEAL-LEAN — seal every compiled, axiom-free Lean theorem into the ledger, chained.
//
// The backing for these entries is the Lean proof itself, not a TypeScript test. That is the stronger claim:
// a test reports that a computation agreed once on one machine, while the kernel checks the proposition over
// its whole domain. Nothing is sealed unless `scripts/lean.ts` passes first — compiled, axiom-free, no sorry,
// no native_decide — so the gate is the compiler, not my say-so.
//
// Receipts chain exactly as the ledger's do: receipt = toUuid(previous → key), each sealing the next. Existing
// entries are never touched; altering one is TAMPER by the deposit's own forensics.
//
//   node scripts/seal-lean.ts          report what would be sealed
//   node scripts/seal-lean.ts --seal   seal it
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid } from '../src/0/index.ts'

const DIR = 'src/proof', LEDGER = 'src/proof/discovered.json'

// GATE: the whole Lean layer must verify before anything is sealed.
try { execSync('node scripts/lean.ts', { stdio: 'pipe' }) }
catch (e) { console.error('✗ the Lean layer does not verify — nothing sealed\n' + String((e as { stdout?: Buffer }).stdout ?? '')); process.exit(1) }

const ledger = JSON.parse(readFileSync(LEDGER, 'utf8')) as { key: string; name: string; receipt: string; revoked?: boolean; reason?: string }[]
const known = new Set(ledger.map((e) => e.key))
const revoked = new Set((JSON.parse(readFileSync(`${DIR}/revoked.json`, 'utf8')) as { key: string }[]).map((r) => r.key))

// ONLY ALGEBRAIC THEOREMS. `by decide` is algebra: the kernel evaluates the proposition over its whole finite
// domain and the result is a computation, not a convention. `rfl` on a declared constant proves the
// declaration and nothing else — it is the shape criticised in provenHere = 0, and it is not evidence.
// Sealing it would put declarations in a ledger of theorems, so it is excluded and counted separately.
type Th = { key: string; file: string; name: string; statement: string; tactic: string }
const found: Th[] = []
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.lean')).sort()) {
  const src = readFileSync(`${DIR}/${f}`, 'utf8')
  const ns = src.match(/^namespace\s+([A-Za-z_0-9.]+)/m)?.[1] ?? f.replace('.lean', '')
  for (const m of src.matchAll(/^theorem\s+([A-Za-z_0-9]+)\s*:([\s\S]*?):=\s*(by decide|rfl|by\s+\w+)/gm)) {
    const statement = m[2].replace(/^\s*--.*$/gm, '').replace(/\s+/g, ' ').trim()
    found.push({ key: 'lean_' + ns.toLowerCase() + '_' + m[1], file: f, name: m[1], statement, tactic: m[3] })
  }
}

const algebraic = found.filter((t) => t.tactic === 'by decide')
const declared = found.filter((t) => t.tactic !== 'by decide')
const fresh = algebraic.filter((t) => !known.has(t.key) && !revoked.has(t.key))
console.log(`lean theorems: ${found.length} · algebraic (by decide): ${algebraic.length} · declarations (rfl, not sealed): ${declared.length}`)
for (const d of declared) console.log(`    excluded: ${d.key.padEnd(46)} ${d.tactic} — a declaration, not algebra`)
console.log(`already sealed: ${algebraic.length - fresh.length} · fresh: ${fresh.length}`)

// ── ORPHANS — a sealed theorem whose source is GONE. Sealing was one-way: it noticed new theorems and never
// noticed disappearing ones, so deleting or renaming a proof left its key standing in the ledger as though
// the kernel still checked it every run. Nothing did. That is the same defect as a page claiming to be
// re-verified when it is not, one layer down and harder to see. The ledger is append-only, so an orphan is
// REVOKED IN PLACE with its reason, never deleted — and the build stops until that is done, because a key
// nobody can recompute is exactly what the deposit promises cannot exist.
// Matched on the THEOREM IDENTIFIER, not the composed key. Older entries were sealed as `lean_<theorem>` and
// current ones as `lean_<namespace>_<theorem>`; comparing whole keys called 25 living theorems orphans on the
// first run. A check that cannot survive its own naming history is worse than no check — it would have taught
// the next person to ignore it.
const sealedLean = ledger.filter((e) => !e.revoked && e.key.startsWith('lean_'))
const liveNames = found.map((t) => t.name)
const orphans = sealedLean.filter((e) => {
  const rest = e.key.slice('lean_'.length)
  return !liveNames.some((n) => rest === n || rest.endsWith('_' + n) || rest.endsWith('.' + n))
})
if (orphans.length) {
  console.log(`\n✗ ${orphans.length} sealed theorem(s) have NO source — the kernel has not checked these on any recent run:`)
  for (const o of orphans) console.log('    ' + o.key)
  if (process.argv.includes('--revoke-orphans')) {
    for (const o of orphans) {
      const e = ledger.find((x) => x.key === o.key)!
      e.revoked = true
      e.reason = 'orphaned: the theorem this key was sealed from is no longer in src/proof. It was deleted or renamed, so nothing recomputes it and no kernel run confirms it. Revoked in place — the receipt stays in the append-only chain, the claim does not stand.'
    }
    writeFileSync('src/proof/discovered.json', JSON.stringify(ledger, null, 2) + '\n')
    console.log(`  ✓ revoked ${orphans.length} in place — receipts kept, claims withdrawn`)
  } else {
    console.log('  run with --revoke-orphans to withdraw them (receipts kept, chain intact)')
    process.exit(1)
  }
}

if (process.argv.includes('--seal') && fresh.length) {
  let prev = ledger[ledger.length - 1].receipt
  for (const t of fresh) {
    const name = `lean ${t.file}: ${t.name} — ${t.statement.slice(0, 240)}${t.statement.length > 240 ? '…' : ''} — decided by the Lean kernel over its whole finite domain, axiom-free`
    const receipt = toUuid(prev + '→' + t.key)
    prev = receipt
    ledger.push({ key: t.key, name, receipt })
  }
  writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n')
  console.log(`✓ sealed ${fresh.length} · ledger ${ledger.length} · chain tip ${prev.slice(0, 13)}…`)
  console.log(`  octave: ${ledger.length} = ${(ledger.length / 8).toFixed(3)} × 8 → ${ledger.length % 8 === 0 ? 'EXACT' : 'remainder ' + (ledger.length % 8)}`)
} else if (fresh.length) {
  for (const t of fresh.slice(0, 5)) console.log(`    ${t.key}`)
  console.log(`    … run with --seal`)
}
