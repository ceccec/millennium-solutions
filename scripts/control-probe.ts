/** ── WHICH UNCONTROLLED GATES CAN BE MADE TO FAIL AT ALL ───────────────────────────────────────────────────
 *
 *  scripts/leads.ts reports 25 scripts that REFUSE — they print ✗ and exit non-zero — and have never been
 *  shown to do it. Writing 25 controls by hand would be the hand-written list this repository does not keep,
 *  and worse, a control I invent tests the mutation I thought of rather than the property the gate claims.
 *
 *  So this PROBES instead. For each uncontrolled refusing script it applies a small set of GENERIC
 *  perturbations to files that script reads, and records whether the script noticed. It does not assert a
 *  control is correct — only whether one is POSSIBLE, which is the question that separates
 *
 *    "this gate has no control yet"        — work to do, ordinary
 *    "no perturbation makes this gate red" — the gate may be unfalsifiable, which is the real defect
 *
 *  A probe that fires is a candidate control, and its mutation is printed so it can be lifted into
 *  gates-fire verbatim. A probe that never fires is the finding.
 *
 *  Every mutation is applied to a backup-and-restore copy, and the tree is verified clean at the end. */
import { readFileSync, writeFileSync, copyFileSync, existsSync, unlinkSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { leanFiles } from '../src/api/index.ts'
import { uncontrolledRefusers } from '../src/api/gates.ts'

const run = (cmd: string): boolean => {
  try { execSync(cmd, { stdio: 'pipe', timeout: 180_000 }); return true } catch { return false }
}
const clean = (): boolean => execSync('git status --porcelain').toString().trim() === ''
if (!clean()) { console.log('✗ control-probe: working tree is dirty — refusing to mutate it'); process.exit(1) }

// ── the uncontrolled refusers, DERIVED exactly as leads.ts derives them ──────────────────────────────────
const targets = uncontrolledRefusers()

// ── generic perturbations: each is a shape a deposit of this kind should never accept ────────────────────
const LEAN = 'src/proof/' + (leanFiles().includes('coin.lean') ? 'coin.lean' : leanFiles()[0])
const PROBES: { name: string; file: string; mutate: (s: string) => string }[] = [
  { name: 'a theorem the kernel cannot close', file: LEAN,
    mutate: (s) => s.replace(/\nend [A-Za-z]+\s*$/, '\ntheorem probe_false : 1 = 2 := by decide\n$&') },
  { name: 'a declaration with no proof at all', file: LEAN,
    mutate: (s) => s + '\n-- probe\ntheorem probe_sorry : 1 = 1 := by sorry\n' },
  { name: 'a ledger entry citing a theorem that does not exist', file: 'src/proof/discovered.json',
    mutate: (s) => s.replace(/\n\]\s*$/, ',\n  { "key": "lean_probe_absent", "name": "lean probe.lean: probe_absent — a key with nothing behind it", "receipt": "00000000-0000-8000-8000-000000000000" }\n]') },
  { name: 'prose citing a command that is not wired', file: 'README.md',
    mutate: (s) => s + '\n\nRun `npm run a-command-that-was-never-wired` to verify.\n' },
]

// ── SUBJECT-AWARE PROBES, DERIVED FROM WHAT EACH GATE ACTUALLY READS ─────────────────────────────────────
// The four generic probes above reached 2 of 13, and the honest note said the rest need a mutation of their
// own subject. That is derivable rather than hand-written: a script names the files it reads, so the probe
// reads the SCRIPT, extracts those paths, and perturbs them. A gate about a narrow subject gets a mutation
// of that subject without anyone deciding what its subject is.
const readsOf = (script: string): string[] => {
  const src = readFileSync(`scripts/${script}.ts`, 'utf8')
  const out = new Set<string>()
  for (const m of src.matchAll(/readFileSync\(\s*'([^']+\.(?:ts|json|lean|md|yml|html))'/g)) out.add(m[1])
  for (const m of src.matchAll(/'(\.github\/workflows\/[^']+)'/g)) out.add(m[1])
  return [...out].filter((f) => existsSync(f) && !f.startsWith('scripts/'))
}
// One perturbation per file KIND, chosen to be a shape any honest gate over that kind should reject.
const perturb = (file: string, s: string): string =>
  file.endsWith('.json') ? s.replace(/"([a-zA-Z_]+)":\s*"([^"]{4,})"/, '"$1": "PROBE_CORRUPTED_VALUE"')
  : file.endsWith('.lean') ? s + '\n-- probe\ntheorem probe_unclosable : 1 = 2 := by decide\n'
  : file.endsWith('.yml') ? s.replace(/run: /, 'run: node scripts/doi-resolve.ts\n        run: ')
  : s + '\n\nPROBE: `npm run a-command-that-was-never-wired`\n'

console.log(`probing ${targets.length} uncontrolled refusing script(s) with ${PROBES.length} generic perturbations:\n`)
const falsifiable: string[] = []
const inert: string[] = []
for (const g of targets.sort()) {
  const cmd = `node scripts/${g}.ts`
  if (!run(cmd)) { console.log(`  ? ${g.padEnd(18)} already red on a clean tree — not probed`); continue }
  let fired: string | null = null
  for (const p of PROBES) {
    if (!existsSync(p.file)) continue
    const backup = `/tmp/cp_${p.file.replace(/[\/.]/g, '_')}`
    copyFileSync(p.file, backup)
    const before = readFileSync(p.file, 'utf8')
    const after = p.mutate(before)
    if (after !== before) { writeFileSync(p.file, after); if (!run(cmd)) fired = p.name }
    copyFileSync(backup, p.file); unlinkSync(backup)
    if (fired) break
  }
  if (!fired) {
    for (const f of readsOf(g)) {
      const backup = `/tmp/cp2_${f.replace(/[\/.]/g, '_')}`
      copyFileSync(f, backup)
      const before = readFileSync(f, 'utf8')
      const after = perturb(f, before)
      if (after !== before) { writeFileSync(f, after); if (!run(cmd)) fired = `perturbing ${f}, which it reads` }
      copyFileSync(backup, f); unlinkSync(backup)
      if (fired) break
    }
  }
  if (fired) { falsifiable.push(g); console.log(`  ✓ ${g.padEnd(18)} CAN be made red — by ${fired}`) }
  else { inert.push(g); console.log(`  ○ ${g.padEnd(18)} not reached, even by perturbing the files it reads`) }
}

if (!clean()) { console.log('\n✗ control-probe: the tree did not come back clean'); process.exit(1) }
console.log(`\n○ control-probe: ${falsifiable.length} of ${targets.length} can be made red by a generic perturbation`)
console.log(`  those are candidate controls — lift the named mutation into scripts/gates-fire.ts.`)
console.log(`  ${inert.length} were not reached, which is NOT proof they are unfalsifiable: a gate about`)
console.log(`  its own narrow subject needs a mutation of that subject, and these probes are deliberately`)
console.log(`  generic. It is the list of gates whose control has to be written by hand and reasoned about.`)
