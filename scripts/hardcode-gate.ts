#!/usr/bin/env node
// HARDCODE GATE — find ℤ/9 sets written as literals anywhere in the tooling.
//
// I twice announced the tooling held no hardcoded sets and was twice wrong, because I grepped for the
// patterns I already had in mind and the check confirmed exactly what it was told to look for. tetA and tetB
// sat in three places through both passes. A search built from a list of known answers cannot find an unknown
// one, which is the same failure as the classifier that filed 259 validation loops under "counter
// accumulation" — an instrument that measures the question rather than the subject.
//
// So this does not look for known sets. It finds every integer-list literal of 3 to 9 elements drawn from
// 0..9 and asks whether it matches a set the API computes. A match is a copy of something already derived and
// proved, and the gate names it. Anything else is left alone: a list of small integers is not automatically
// an algebraic claim, and refusing them all would be a lexicon by another name.
import { readFileSync, readdirSync } from 'node:fs'
import { units, triad, orbit, tetA, tetB, axis } from '../src/api/index.ts'

const KNOWN: [string, number[]][] = [
  ['the units', units()], ['the triad', triad()], ['the doubling orbit', orbit()],
  ['the first tetrahedron', tetA()], ['the second tetrahedron', tetB()], ['the axis', axis()],
]
// THE ORBIT AND THE UNITS ARE THE SAME SET AND DIFFERENT SEQUENCES. Sorted, {1,2,4,5,7,8} and the doubling
// order 1,2,4,8,7,5 are indistinguishable — the first version of this gate called every unit literal "the
// doubling orbit", which is the shared-vocabulary mistake in miniature: two things that print alike are not
// the same thing. Exact ORDER is tried first, so a sequence is named as itself; only then does it fall back
// to set equality, and where that is ambiguous it says so rather than picking one.
const seq = (xs: number[]) => xs.map((x) => ((x % 9) + 9) % 9).join(',')
const norm = (xs: number[]) => [...xs].map((x) => ((x % 9) + 9) % 9).sort((a, b) => a - b).join(',')
const nameFor = (xs: number[]): string | null => {
  const exact = KNOWN.filter(([, v]) => seq(v) === seq(xs)).map(([n]) => n)
  if (exact.length) return exact.join(' or ')
  const same = KNOWN.filter(([, v]) => norm(v) === norm(xs)).map(([n]) => n)
  if (!same.length) return null
  return same.length === 1 ? same[0] : same.join(' or ') + ' (same set, different order — check which you meant)'
}

// gates-fire.ts is excluded BY NECESSITY, not by convenience: it is the file of negative controls, so
// it must contain the very things this gate rejects. Scanning it made this gate fail on a clean tree —
// which gates-fire caught, on its first run, about the gate it was written to test.
// tooling only: the .lean proofs and the ledger's own tests state these sets on purpose, being the source.
const FILES = [
  ...readdirSync('scripts').filter((f) => f.endsWith('.ts') && f !== 'hardcode-gate.ts' && f !== 'gates-fire.ts' && f !== 'discover.ts').map((f) => 'scripts/' + f),
  ...readdirSync('src/prove').filter((f) => f.endsWith('.ts')).map((f) => 'src/prove/' + f),
]

let found = 0
for (const f of FILES) {
  const src = readFileSync(f, 'utf8')
  const lines = src.split('\n')
  lines.forEach((line, i) => {
    if (/^\s*(\/\/|\*)/.test(line)) return                       // a comment may quote a set to explain it
    for (const m of line.matchAll(/\[\s*(\d(?:\s*,\s*\d){2,8})\s*\]/g)) {
      const xs = m[1].split(',').map((x) => Number(x.trim()))
      const hit = nameFor(xs)
      if (!hit) continue
      if (new Set(xs).size !== xs.length) continue               // repeats are not a set literal
      found++
      console.log(`  ✗ ${f}:${i + 1} — [${xs.join(',')}] is ${hit}, which the API computes and a theorem proves`)
      console.log(`      ${line.trim().slice(0, 96)}`)
    }
  })
}
console.log(found
  ? `\n✗ hardcode-gate: ${found} literal(s) restate a set the deposit already derives — import it instead`
  : `\n✓ hardcode-gate: no tooling literal restates a computed set (${KNOWN.length} checked across ${FILES.length} files)`)
process.exit(found ? 1 : 0)
