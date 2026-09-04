#!/usr/bin/env node
// LEAN-AGREE — the runtime and the proofs must name the same numbers.
//
// The deposit states its constants twice: once in src/ where the code uses them, once in src/proof where the
// kernel proves things about them. Nothing compared the two. A theorem about ℤ/9 says nothing about a runtime
// that has quietly moved to ℤ/7, and both halves stay green while meaning different things.
//
// THE VALUES COME FROM LEAN, NOT FROM READING LEAN. The first version of this compared the runtime against the
// TEXT of each definition, which meant pairing names that looked related — it matched the trinity against
// `provenHere` and the doubling orbit against a tetrahedron, and reported both as though they were the same
// quantity. Shared vocabulary is not shared mathematics; that is the error this repo keeps finding in other
// tools and I wrote it again here. Each definition is now EVALUATED by Lean and the result compared, so a
// pairing is either exact or it fails.
//
// The triad is normalised mod 9 before comparing: the runtime writes {3,6,9} and the proofs write {3,6,0},
// which is the same class named by its residue — stated here rather than hidden in a lenient comparison.
import { BASE, units, triad, vortexOrbit } from '../src/0/index.ts'
import { execSync } from 'node:child_process'
import { writeFileSync, unlinkSync } from 'node:fs'

// `mod` is the MODULE (which Lean derives from the file name) and `expr` uses the NAMESPACE declared inside
// it — index.lean is the module `Index` and the namespace `MillenniumFloor`, and conflating the two is why
// the first run could not find anything.
const PAIRS = [
  { what: 'the modulus',        runtime: [BASE],        mod: 'Z9',      expr: 'Z9.B' },
  { what: 'the units',          runtime: units(),       mod: 'Z9',      expr: 'Z9.units' },
  { what: 'the triad',          runtime: triad(),       mod: 'Merkaba', expr: 'Merkaba.axis' },
  { what: 'the doubling orbit', runtime: vortexOrbit(), mod: 'Index',   expr: 'MillenniumFloor.span' },
]

const mod9 = (xs: number[]) => xs.map((n) => ((n % 9) + 9) % 9)

const probe = '/tmp/lean_agree.lean'
const mods = [...new Set(PAIRS.map((p) => p.mod))]
// build the .oleans this probe needs. scripts/lean.ts only builds modules that something IMPORTS, and a file
// nobody imports (merkaba.lean) has none — so the check has to make its own rather than assume.
// IS THERE A LEAN TOOLCHAIN AT ALL? Without one, `lean -o …` throws exactly as it does for a file the
// kernel rejects, and this script reported "z9.lean does not compile" on a file that compiles perfectly —
// a broken deploy blamed on a proof. No workflow here installs Lean, so that message was wrong every time
// it could have appeared in CI.
//
// Absent toolchain is now reported as absent and the check is SKIPPED, loudly. A skip that reads like a
// pass is the defect this tree spends its gates on, so it prints what was not checked and where it is
// checked instead — locally by `npm run lean`, and on every commit by the pre-commit hook.
const hasLean = (() => {
  try { execSync('lean --version', { stdio: 'pipe' }); return true } catch { return false }
})()
if (!hasLean) {
  console.log('○ lean-agree: NOT CHECKED HERE — no Lean toolchain on this machine, so nothing was compiled')
  console.log('  this does not mean the constants agree; it means they were not compared.')
  console.log('  they are compared by `npm run lean-agree` where lean is installed, and by the pre-commit hook.')
  process.exit(0)
}

const ENV = { ...process.env, LEAN_PATH: 'src/proof' }
for (const m of mods) {
  const file = m.toLowerCase() + '.lean'
  try { execSync(`lean -o src/proof/${m}.olean src/proof/${file}`, { stdio: 'pipe', env: ENV }) }
  catch { console.error(`✗ lean-agree: the kernel rejects src/proof/${file} — fix that before comparing constants`); process.exit(1) }
}
writeFileSync(probe, mods.map((m) => `import ${m}`).join('\n') + '\n' + PAIRS.map((p) => `#eval ${p.expr}`).join('\n') + '\n')
let out = ''
try { out = execSync(`lean ${probe}`, { encoding: 'utf8', env: ENV }) }
catch (e) {
  console.error('✗ lean-agree: the probe did not elaborate — run `node scripts/lean.ts` first so the .oleans exist')
  console.error(String((e as { stdout?: string }).stdout ?? '').split('\n').slice(0, 6).join('\n'))
  process.exit(1)
}
unlinkSync(probe)

const values = out.trim().split('\n').map((l) => l.trim())
let bad = 0
console.log('runtime ↔ Lean — evaluated, not read:')
PAIRS.forEach((p, i) => {
  const got = (values[i] ?? '').replace(/[\[\]]/g, '').split(',').map((x) => Number(x.trim())).filter((n) => !Number.isNaN(n))
  const a = JSON.stringify(mod9(p.runtime)), b = JSON.stringify(mod9(got))
  const ok = a === b
  if (!ok) bad++
  console.log(`  ${ok ? '✓' : '✗'} ${p.what.padEnd(20)} runtime ${JSON.stringify(p.runtime).padEnd(22)} ${p.expr} = ${values[i] ?? '(no value)'}`)
})
console.log(bad
  ? `\n✗ lean-agree: ${bad} constant(s) differ between the runtime and the proofs — one of them is describing something the other does not`
  : `\n✓ lean-agree: every constant the proofs reason about is the one the runtime uses (triad compared mod 9: {3,6,9} and {3,6,0} are one class)`)
process.exit(bad ? 1 : 0)
