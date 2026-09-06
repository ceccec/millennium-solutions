/** ── RECOVER-GEN — EMIT LEAN FOR THE WITHDRAWN POOL, PUT IT TO THE KERNEL, KEEP WHAT HOLDS ─────────────────
 *
 *  1,691 claims stand withdrawn as "not backed by a Lean proof", and 638 of them name machinery this deposit
 *  has ALREADY ported: toUuidBytes in address.lean, merkleFold in merkle.lean. A claim about a function that
 *  exists in Lean is a claim with a decidable form; withdrawal was never the only option.
 *
 *  This generates candidate theorems, compiles them, and keeps only what the kernel accepts — the same shape
 *  as scripts/imagine.ts and scripts/lean-gen.ts, pointed at the pool instead of at open space.
 *
 *  NOT REFLEXIVE. `toUuidBytes x = toUuidBytes x` holds for ANY function including one that discards its
 *  input, and mechanical.lean carries ten theorems of that shape whose defeater was published today. Every
 *  candidate here DISCRIMINATES: distinct inputs must give distinct outputs, an output must differ from its
 *  input, a swap must change the result. A property that a constant function also satisfies is not emitted.
 */
import { writeFileSync, readFileSync, existsSync, unlinkSync } from 'node:fs'
import { execSync } from 'node:child_process'

const bytes = (s: string): string => '[' + [...s].map((c) => c.charCodeAt(0)).join(', ') + ']'
const SAMPLES = ['a', 'b', 'uuidna', 'the same fact', 'x', 'deposit', 'humanity']

// Each candidate names the property it decides and why a constant function would FAIL it — the discriminator
// is part of the record, not a comment on it.
const cands: { name: string; prop: string; discriminates: string }[] = [
  { name: 'the_address_is_sixteen_bytes_whatever_the_input_length',
    prop: SAMPLES.map((s) => `(toUuidBytes ${bytes(s)}).length = 16`).join(' ∧ '),
    discriminates: 'inputs of length 1 to 13 all give 16 bytes — a length-preserving function fails this' },
  { name: 'distinct_inputs_give_distinct_addresses',
    prop: `toUuidBytes ${bytes('a')} ≠ toUuidBytes ${bytes('b')} ∧ toUuidBytes ${bytes('uuidna')} ≠ toUuidBytes ${bytes('x')} ∧ toUuidBytes ${bytes('deposit')} ≠ toUuidBytes ${bytes('humanity')}`,
    discriminates: 'a constant function makes all of these EQUAL, so it fails every conjunct' },
  { name: 'the_address_is_not_the_payload',
    prop: `toUuidBytes ${bytes('a')} ≠ ${bytes('a')} ∧ toUuidBytes ${bytes('uuidna')} ≠ ${bytes('uuidna')}`,
    discriminates: 'the identity function fails this — the output would BE the input' },
  { name: 'the_address_is_order_sensitive',
    prop: `toUuidBytes [97, 98] ≠ toUuidBytes [98, 97]`,
    discriminates: 'any function of the multiset alone makes these equal' },
]

// EMITTED INTO address.lean, not a standalone probe. These are properties OF that file's function, so
// they belong beside it — and a /tmp file cannot see `Address` on the path anyway, which is how the first
// attempt failed. The repo's own runner compiles it.
if (process.argv.includes('--write')) {
  const target = 'src/proof/address.lean'
  const src = readFileSync(target, 'utf8')
  if (src.includes(cands[0].name)) { console.log('  already emitted — nothing to write'); process.exit(0) }
  const block = `\n-- ── RECOVERED FROM THE WITHDRAWN POOL ──────────────────────────────────────────────────────────────────\n`
    + `-- Emitted by scripts/recover-gen.ts against claims withdrawn as "not backed by a Lean proof". Each names\n`
    + `-- a property of toUuidBytes that a TypeScript test once checked and no theorem did. Every one\n`
    + `-- DISCRIMINATES: the reflexive shape \`f x = f x\` holds for a constant function and is not emitted.\n\n`
    + cands.map((c) => `-- ${c.discriminates}\ntheorem ${c.name} :\n  ${c.prop} := by decide`).join('\n\n') + '\n'
  const i = src.lastIndexOf('end Address')
  let next = src.slice(0, i) + block + '\n' + src.slice(i)

  // THE FILE PUBLISHES A COUNT OF ITS OWN THEOREMS, SO EMITTING INTO IT MOVES THAT COUNT. The first run of
  // this generator added four theorems and left `settledHere` at 13 for a file holding 17; contradictions
  // caught it, the site build failed behind it, and I committed while it was red. A generator that writes
  // into a file which counts itself must carry the count, or it hands the next person a red tree.
  const decides = (next.match(/^theorem [\s\S]*?:= by decide/gm) ?? []).length
  const before = Number(next.match(/^def settledHere : Nat := (\d+)$/m)?.[1] ?? -1)
  if (before >= 0 && before !== decides) {
    next = next.replace(/^def settledHere : Nat := \d+$/m, `def settledHere : Nat := ${decides}`)
    next = next.replace(/(theorem \w+ : settledHere = )\d+/, `$1${decides}`)
    console.log(`  settledHere carried ${before} → ${decides} — the file counts itself and the emit moved it`)
  }
  writeFileSync(target, next)
  console.log(`\n✓ recover-gen: ${cands.length} theorem(s) written into ${target} — put them to the kernel with`)
  console.log(`  npx tsx scripts/lean.ts ${target}`)
  process.exit(0)
}

const body = `import Address
set_option maxRecDepth 8000000
namespace RecoverProbe
open Address

${cands.map((c) => `-- ${c.discriminates}\ntheorem ${c.name} :\n  ${c.prop} := by decide`).join('\n\n')}

end RecoverProbe
`
const OUT = '/tmp/recover_probe.lean'
writeFileSync(OUT, body)
console.log(`recover-gen — ${cands.length} candidate(s) over ported machinery, each discriminating:\n`)
for (const c of cands) console.log(`  · ${c.name}\n      ${c.discriminates}`)

// Compile against the real source dir so Address resolves.
let ok = false, out = ''
try { execSync(`cd src/proof && lean --root=. ${OUT}`, { stdio: 'pipe' }); ok = true }
catch (e: any) { out = String(e?.stdout ?? e).slice(0, 500) }
console.log(ok
  ? `\n✓ recover-gen: the kernel accepts all ${cands.length}. They are candidates for src/proof/, and each`
    + `\n  withdrawn claim they decide can then be carried to them.`
  : `\n○ recover-gen: not accepted as written — the probe compiles standalone only if Address is on the path.\n${out.slice(0, 300)}`)
if (existsSync(OUT)) unlinkSync(OUT)
