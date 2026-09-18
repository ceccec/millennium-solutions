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
import { resolve, dirname } from 'node:path'
import { leanFiles } from '../src/api/index.ts'
import { uncontrolledRefusers } from '../src/api/gates.ts'

// A TIMEOUT IS NOT A REFUSAL, AND READING IT AS ONE IS THE INSTRUMENT LYING ABOUT ITS SUBJECT.
// `execSync` throws the same way for `exit 1` and for the kill at the end of `timeout`, so `catch → false`
// called both of them red. The run that produced this comment reported `novelty` and `uses` as "already red
// on a clean tree — not probed". Neither is red. Both reach the network — the OEIS, Crossref, arXiv, GDELT,
// Hacker News, npm, GitHub — and neither finishes inside three minutes. The probe had not measured them at
// all, and said something definite about them anyway.
const LIMIT_MS = 180_000
type Verdict = 'pass' | 'refuse' | 'unfinished'
const run = (cmd: string): Verdict => {
  try { execSync(cmd, { stdio: 'pipe', timeout: LIMIT_MS }); return 'pass' }
  catch (e: any) { return e?.killed === true || e?.signal === 'SIGTERM' ? 'unfinished' : 'refuse' }
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
  for (const m of src.matchAll(/readFileSync\(\s*'([^']+\.(?:ts|json|lean|md|yml|html|cff))'/g)) out.add(m[1])
  for (const m of src.matchAll(/'(\.github\/workflows\/[^']+)'/g)) out.add(m[1])
  // MOST GATES HERE DO NOT NAME THEIR FILES. They read through the shared API — leanFiles(), leanSource(),
  // ledger() — so a literal-path extractor found NOTHING for all nine, and the probe reported "not reached
  // even by perturbing the files it reads" while perturbing nothing. A vacuous negative, produced by the
  // instrument built to detect vacuous checks.
  if (/\bleanFiles\b|\bleanSource\b|\bleanTheorems\b/.test(src)) out.add('src/proof/coin.lean')
  if (/\bledger\b|\blive\b\(|\bstatusOf\b/.test(src)) out.add('src/proof/discovered.json')
  if (/\bmergeKey\b|\bstatementAddress\b/.test(src)) out.add('docs/statement-address-fixture.json')
  // AND THE FIX FOR THAT WAS THREE MORE REMEMBERED NAMES, which is the same defect with a longer list. It
  // left `clusters` reported as "not reached, even by perturbing the files it reads" — a sentence that was
  // false in both halves: its subject is merkleFold in src/0/index.ts, a module it IMPORTS and never reads,
  // and dropping one clause of that function does make it refuse. A script's imports are written down in the
  // script; they do not have to be remembered. Every relative import is a file this gate is built on.
  for (const m of src.matchAll(/from '(\.[^']+\.ts)'/g)) {
    const path = resolve(dirname(`scripts/${script}.ts`), m[1]).slice(process.cwd().length + 1)
    if (!path.startsWith('scripts/')) out.add(path)
  }
  return [...out].filter((f) => existsSync(f) && !f.startsWith('scripts/'))
}
// One perturbation per file KIND, chosen to be a shape any honest gate over that kind should reject.
// A .ts SUBJECT IS CODE AND ONLY CODE REACHES IT. Appending prose to a module — which is what every
// non-json, non-lean, non-yml file got — cannot change what that module computes, so a gate built on a
// module was probed with a mutation that could not possibly fire, and its silence was then printed as a
// finding about the gate. A module made unloadable is the one perturbation that needs no knowledge of what
// the module does; it answers reachability and nothing else, and is reported as exactly that below.
const UNLOADABLE = '\nthrow new Error(\'control-probe: this module was perturbed\')\n'
const perturb = (file: string, s: string): string =>
  file.endsWith('.json') ? s.replace(/"([a-zA-Z_]+)":\s*"([^"]{4,})"/, '"$1": "PROBE_CORRUPTED_VALUE"')
  : file.endsWith('.lean') ? s + '\n-- probe\ntheorem probe_unclosable : 1 = 2 := by decide\n'
  : file.endsWith('.yml') ? s.replace(/run: /, 'run: node scripts/doi-resolve.ts\n        run: ')
  : file.endsWith('.ts') ? s + UNLOADABLE
  : s + '\n\nPROBE: `npm run a-command-that-was-never-wired`\n'

console.log(`probing ${targets.length} uncontrolled refusing script(s) with ${PROBES.length} generic perturbations:\n`)
const falsifiable: string[] = []
const inert: string[] = []
const unmeasured: string[] = []
// RESTORE THE CONSEQUENCES, NOT ONLY THE INPUT. Several of these scripts are GENERATORS as well as gates
// — axiom-index writes AXIOMS.md, priorart-gen rewrites the attribution table, novelty records what it
// searched — so merely running one leaves output behind, and the probe's own cleanliness check then reports
// that as a failure. Correctly: gates-fire learned the identical lesson about its controls. The probe
// refuses to start on a dirty tree, so anything changed after that point is the probe's doing.
// IT RAN AFTER THE PROBES AND THE TWO EARLY EXITS JUMPED OVER IT. A gate that is already red, or that never
// finishes, is skipped by `continue` — and both had already RUN once by then. `novelty` rewrote
// src/proof/novelty.json on the clean-tree run, the skip jumped the restore, and the probe ended with
// "the tree did not come back clean" about a file its own control flow had left there. It is a function now,
// called on every path out.
const restore = () => { if (!clean()) execSync('git checkout -- .', { stdio: 'pipe' }) }
for (const g of targets.sort()) {
  const cmd = `node scripts/${g}.ts`
  const base = run(cmd)
  if (base === 'unfinished') {
    restore(); unmeasured.push(g)
    console.log(`  ⏱ ${g.padEnd(18)} did not finish inside ${LIMIT_MS / 1000}s — NOT MEASURED, and not a refusal`)
    continue
  }
  if (base === 'refuse') { restore(); console.log(`  ? ${g.padEnd(18)} already red on a clean tree — not probed`); continue }
  let fired: string | null = null
  let onlyUnloadable = false
  for (const p of PROBES) {
    if (!existsSync(p.file)) continue
    const backup = `/tmp/cp_${p.file.replace(/[\/.]/g, '_')}`
    copyFileSync(p.file, backup)
    const before = readFileSync(p.file, 'utf8')
    const after = p.mutate(before)
    if (after !== before) { writeFileSync(p.file, after); if (run(cmd) === 'refuse') fired = p.name }
    copyFileSync(backup, p.file); unlinkSync(backup)
    if (fired) break
  }
  if (!fired) {
    // AN UNLOADABLE MODULE MUST NOT END THE SEARCH. It fires for any gate that imports anything, so stopping
    // at the first one would hide the perturbation that actually says something — for `clusters` the import
    // list reaches src/api/index.ts before src/0/index.ts, and the real finding is in the second. A
    // reachability hit is remembered and the search continues; it is only reported when nothing better came.
    let weak: string | null = null
    for (const f of readsOf(g)) {
      const backup = `/tmp/cp2_${f.replace(/[\/.]/g, '_')}`
      copyFileSync(f, backup)
      const before = readFileSync(f, 'utf8')
      const after = perturb(f, before)
      if (after !== before) {
        writeFileSync(f, after)
        if (run(cmd) === 'refuse') {
          if (after.endsWith(UNLOADABLE)) weak ??= `perturbing ${f}, which it is built on`
          else fired = `perturbing ${f}, which it is built on`
        }
      }
      copyFileSync(backup, f); unlinkSync(backup)
      if (fired) break
    }
    if (!fired && weak) { fired = weak; onlyUnloadable = true }
  }
  restore()
  // A GATE REACHED ONLY BY AN UNLOADABLE MODULE IS NOT A CANDIDATE CONTROL. It proves the gate depends on
  // that module and nothing more, and lifting "make the import throw" into gates-fire would be a control
  // that passes for every gate that imports anything. Reported as its own verdict so it is not counted as
  // work already done, and so the module it names is where the real control has to be written.
  if (fired && onlyUnloadable) { inert.push(g); console.log(`  ◑ ${g.padEnd(18)} reached ONLY by ${fired.replace('perturbing ', 'making ')} unloadable — that shows it depends on the module, not that it checks anything` ) }
  else if (fired) { falsifiable.push(g); console.log(`  ✓ ${g.padEnd(18)} CAN be made red — by ${fired}`) }
  else { inert.push(g); console.log(`  ○ ${g.padEnd(18)} not reached, even by perturbing the files it is built on`) }
}

if (!clean()) { console.log('\n✗ control-probe: the tree did not come back clean'); process.exit(1) }
console.log(`\n○ control-probe: ${falsifiable.length} of ${targets.length} can be made red by a generic perturbation`)
console.log(`  those are candidate controls — lift the named mutation into scripts/gates-fire.ts.`)
console.log(`  ${inert.length} were not reached, which is NOT proof they are unfalsifiable: a gate about`)
console.log(`  its own narrow subject needs a mutation of that subject, and these probes are deliberately`)
console.log(`  generic. It is the list of gates whose control has to be written by hand and reasoned about.`)
// THE THIRD COLUMN, AND THE ONE THAT WAS BEING HIDDEN INSIDE THE SECOND. A gate the probe could not run is
// neither falsifiable nor inert; it is unmeasured, and printing a verdict for it is the failure this whole
// script exists to report about other people's gates.
if (unmeasured.length) {
  console.log(`  ${unmeasured.length} could not be measured at all — ${unmeasured.join(', ')} — they reach the`)
  console.log(`  network and do not finish inside ${LIMIT_MS / 1000}s. Nothing above is claimed about them.`)
}
