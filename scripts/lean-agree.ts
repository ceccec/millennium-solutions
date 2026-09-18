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
import { precedes, staleTail } from '../src/api/gates.ts'
import { unreflect } from '../src/honesty/index.ts'
import { FIELDS } from '../src/0/program.ts'
import { P as ED_P, L as ED_L } from '../src/0/ed25519.ts'
import { vortexOrder, vortexOrderReversed } from '../src/7/rays.ts'
import { refused } from '../src/honesty/claims.ts'
import { execSync } from 'node:child_process'
import { writeFileSync, unlinkSync } from 'node:fs'

// `mod` is the MODULE (which Lean derives from the file name) and `expr` uses the NAMESPACE declared inside
// it — index.lean is the module `Index` and the namespace `MillenniumFloor`, and conflating the two is why
// the first run could not find anything.
// ── AND NOT ONLY CONSTANTS. A rule is as capable of drifting as a number, and worse: instruments.lean
// decides three rules its TypeScript twins implement separately, so without this the kernel would be
// deciding a Lean copy while the gates ran something else. Each pair below evaluates the LEAN rule over a
// finite grid and compares it to the TypeScript rule over the same grid, so agreement is exhaustive on that
// grid rather than argued. `raw` turns off the mod-9 normalisation, which exists for the triad {3,6,9} ↔
// {3,6,0} and would fold character codes on top of each other (117 mod 9 = 0).
const GRID = 12
const bits = (n: number): boolean[][] => n === 0 ? [[]] : bits(n - 1).flatMap((l) => [[false, ...l], [true, ...l]])
const precedesGrid = (): number[] => [
  ...Array.from({ length: GRID }, (_, a) => Array.from({ length: GRID }, (_, b) => precedes(a, b) ? 1 : 0)).flat(),
  precedes(null, 3) ? 1 : 0, precedes(3, null) ? 1 : 0, precedes(null, null) ? 1 : 0,
]
// 0 present · 1 a hole (an absence with a later presence) · 2 a stale tail — a total classification, so the
// comparison cannot be satisfied by two rules that merely agree on how MANY are missing
const staleGrid = (): number[] => bits(4).flatMap((l) => {
  const { holes } = staleTail(l)
  return l.map((p, i) => p ? 0 : holes.includes(i) ? 1 : 2)
})
const codes = (s: string): number[] => [...s].map((c) => c.charCodeAt(0))
const UA_T = 'ua:site', ECHO_T = '<p>' + UA_T + '</p>', TWICE_T = UA_T + ' ' + UA_T

const PAIRS = [
  { what: 'the modulus',        runtime: [BASE],        mod: 'Z9',      expr: 'Z9.B' },
  { what: 'the units',          runtime: units(),       mod: 'Z9',      expr: 'Z9.units' },
  { what: 'the triad',          runtime: triad(),       mod: 'Merkaba', expr: 'Merkaba.axis' },
  { what: 'the doubling orbit', runtime: vortexOrbit(), mod: 'Index',   expr: 'MillenniumFloor.span' },

  { what: 'the time boundary',  runtime: precedesGrid(), mod: 'Instruments', raw: true,
    expr: '((List.range 12).flatMap (fun a => (List.range 12).map (fun b => if Instruments.precedes (some a) (some b) then 1 else 0))) '
      + '++ [if Instruments.precedes none (some 3) then 1 else 0, if Instruments.precedes (some 3) none then 1 else 0, if Instruments.precedes none none then 1 else 0]' },

  { what: 'hole vs stale tail', runtime: staleGrid(), mod: 'Instruments', raw: true,
    expr: '(Instruments.bits 4).flatMap (fun l => (List.range 4).map (fun i => if l.getD i false then 0 else if (Instruments.holes l).contains i then 1 else 2))' },

  { what: 'the echo removed',   runtime: codes(unreflect(ECHO_T, UA_T)), mod: 'Instruments', raw: true,
    expr: 'Instruments.clip Instruments.echoed' },

  { what: 'every copy removed', runtime: codes(unreflect(TWICE_T, UA_T)), mod: 'Instruments', raw: true,
    expr: 'Instruments.clip Instruments.twice' },

  { what: 'the page untouched', runtime: codes(unreflect('<p>site</p>', UA_T)), mod: 'Instruments', raw: true,
    expr: 'Instruments.clip Instruments.genuine' },

  // THE CONTAINER'S LAYOUT. The field WIDTHS are the error class here — the middle of a uuid is 48 bits and
  // only 42 of them are free, because the version nibble and the variant each open a group inside it — so
  // the three field maps are compared position by position, not by their lengths. A codec built to the
  // obvious reading of "the middle" would agree on every count and differ on every position.
  { what: 'the check field',    runtime: FIELDS.check,   mod: 'Program', raw: true, expr: 'Program.checkF' },
  { what: 'the program field',  runtime: FIELDS.program, mod: 'Program', raw: true, expr: 'Program.programF' },
  { what: 'the message field',  runtime: FIELDS.message, mod: 'Program', raw: true, expr: 'Program.messageF' },

  // THE CURVE'S FIELD, compared as the residues the implementation actually branches on rather than as a
  // 78-digit number nobody reads. src/0/ed25519.ts recovers x by raising to (p+3)/8, which is the rule for
  // a prime ≡ 5 (mod 8) and for no other; a port to another field would change these and nothing else here
  // would notice. `4L < p < 8L` pins the cofactor by bracket, so the 8 cannot be edited to anything.
  { what: 'the curve field',    mod: 'Asymmetric', raw: true,
    runtime: [Number(ED_P % 8n), Number((ED_P + 3n) % 8n), Number(ED_P % 4n),
      4n * ED_L < ED_P ? 1 : 0, ED_P < 8n * ED_L ? 1 : 0, ED_L < ED_P ? 1 : 0],
    expr: '[Asymmetric.p % 8, (Asymmetric.p + 3) % 8, Asymmetric.p % 4, '
      + 'if 4 * Asymmetric.L < Asymmetric.p then 1 else 0, if Asymmetric.p < 8 * Asymmetric.L then 1 else 0, '
      + 'if Asymmetric.L < Asymmetric.p then 1 else 0]' },

  // THE RAY ORDER. The seven are visited in the (ℤ/7)* orbit, not in byte order, and the reverse direction
  // walks it backwards — so a transposed entry on either side is a different lattice that would still look
  // like seven rays. Both orders are derived from the generator on both sides; this compares the results.
  { what: 'the vortex order',   runtime: vortexOrder(),         mod: 'Rays', raw: true, expr: 'Rays.vortexOrder' },
  { what: 'the reversed order', runtime: vortexOrderReversed(), mod: 'Rays', raw: true, expr: 'Rays.vortexReversed' },

  // THE REFUSAL WINDOW — the lenient side of every claim detector, where a widening goes unnoticed because
  // the report stays green and the count stays large. Compared over every claim position against a fixed
  // negator, and over the empty sentence, which is the case a reader assumes rather than checks.
  { what: 'the refusal window', mod: 'Instruments', raw: true,
    runtime: [...Array.from({ length: 10 }, (_, c) => refused([3], c) ? 1 : 0),
      ...Array.from({ length: 10 }, (_, c) => refused([], c) ? 1 : 0),
      refused([7, 2, 9], 5) ? 1 : 0, refused([7, 9], 5) ? 1 : 0, refused([5], 5) ? 1 : 0],
    expr: '((List.range 10).map (fun c => if Instruments.refused [3] c then 1 else 0)) '
      + '++ ((List.range 10).map (fun c => if Instruments.refused [] c then 1 else 0)) '
      + '++ [if Instruments.refused [7, 2, 9] 5 then 1 else 0, if Instruments.refused [7, 9] 5 then 1 else 0, '
      + 'if Instruments.refused [5] 5 then 1 else 0]' },
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
// ONE LINE PER VALUE, OR THE PAIRING IS WRONG. The verdicts are matched to PAIRS by line index, and a bare
// `#eval` hands its value to Lean's PRETTY PRINTER, which wraps a long list across several lines — so the
// moment a compared value grew past the default width every pair after it was read against the wrong
// expression, and five rules that agree exactly were reported as five disagreements. `set_option
// format.width` does not reach `#eval`; printing the value as a STRING does, because `IO.println` emits
// what it is given and nothing else. The four short constants never showed this, which is why it waited
// until a long one arrived.
writeFileSync(probe, mods.map((m) => `import ${m}`).join('\n') + '\n'
  + PAIRS.map((p) => `#eval IO.println (toString (${p.expr}))`).join('\n') + '\n')
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
  const N = (p as { raw?: boolean }).raw ? (xs: number[]) => xs : mod9
  const a = JSON.stringify(N(p.runtime)), b = JSON.stringify(N(got))
  const ok = a === b
  if (!ok) bad++
  const show = (x: string) => x.length > 46 ? x.slice(0, 43) + '…' : x
  console.log(`  ${ok ? '✓' : '✗'} ${p.what.padEnd(20)} runtime ${show(JSON.stringify(p.runtime)).padEnd(47)} lean ${show(values[i] ?? '(no value)')}`)
})
console.log(bad
  ? `\n✗ lean-agree: ${bad} constant(s) differ between the runtime and the proofs — one of them is describing something the other does not`
  : `\n✓ lean-agree: every constant the proofs reason about is the one the runtime uses (triad compared mod 9: {3,6,9} and {3,6,0} are one class)`)
process.exit(bad ? 1 : 0)
