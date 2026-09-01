#!/usr/bin/env node
// GATES-FIRE — every gate must be shown to FAIL when it should, not merely to pass.
//
// A gate that passes tells you nothing on its own: a gate that cannot fail passes too. Four instruments in
// this repo were wrong before the thing they measured was — a family classifier that split key text and
// invented 377 leads, a bucketer that filed 259 validation loops under "counter accumulation" because it
// matched the `v++` in a loop header, a hardcoded-set search that only looked for the sets I remembered, and
// a multi-writer check blind to an indirection I had introduced myself two commits earlier. Every one of
// them reported confidently. None of them was caught by being run; they were caught by someone looking at
// the subject directly.
//
// So each gate here gets a NEGATIVE CONTROL: a specific, reversible mutation that it must reject. The gate
// is run once clean (must pass), once mutated (must fail), and the mutation is undone. A gate that passes
// both times is not protecting anything, and this reports that as a failure of the GATE rather than of the
// repository — which is the distinction that took four instruments to learn.
//
// The mutations are made to copies restored immediately afterwards, and the run verifies the tree is clean
// at the end. If it ever exits leaving a mutation in place, `git checkout` restores it: nothing here touches
// receipts or the chain.
import { readFileSync, writeFileSync, existsSync, copyFileSync, unlinkSync } from 'node:fs'
import { execSync } from 'node:child_process'

const run = (cmd: string): boolean => {
  try { execSync(cmd, { stdio: 'pipe' }); return true } catch { return false }
}

type Control = { gate: string; cmd: string; what: string; file: string; mutate: (s: string) => string }

const CONTROLS: Control[] = [
  { gate: 'hardcode-gate', cmd: 'node scripts/hardcode-gate.ts', file: 'scripts/gaps.ts',
    what: 'a ℤ/9 set written out as a literal',
    mutate: (s) => s + '\nconst __probe = [1, 2, 4, 5, 7, 8]\nvoid __probe\n' },

  { gate: 'one-author-gate', cmd: 'node scripts/one-author-gate.ts', file: 'scripts/greeting.ts',
    what: 'a second script generating a page pages.ts already owns',
    mutate: (s) => s.replace("writeFileSync('public/greeting.json'", "writeFileSync('index.md', 'x'); writeFileSync('public/greeting.json'") },

  { gate: 'seal', cmd: 'node scripts/seal.ts', file: 'compare.md',
    what: 'prose citing a theorem that is not in the ledger',
    mutate: (s) => s + '\n\nSee [a claim](/theorem/a_key_that_was_never_sealed) for detail.\n' },

  { gate: 'claims-gate', cmd: 'node scripts/claims-gate.ts', file: 'README.md',
    what: 'the front page quoting a registry size that is not the registry size',
    mutate: (s) => s.replace(/(\d+) registered claims/, '9999 registered claims') },

  { gate: 'forensics', cmd: 'node scripts/forensics.ts', file: 'src/proof/discovered.json',
    what: 'a receipt altered mid-chain',
    mutate: (s) => { const l = JSON.parse(s); l[400].receipt = '00000000-0000-8000-8000-000000000000'; return JSON.stringify(l, null, 2) + '\n' } },

  { gate: 'lean', cmd: 'node scripts/lean.ts src/proof/theorems.lean', file: 'src/proof/theorems.lean',
    what: 'a theorem that does not hold',   // no --full: the cache keys on content, so a mutated file re-verifies and an untouched one does not
    mutate: (s) => s.replace('.length = 1', '.length = 2') },

  { gate: 'lean-agree', cmd: 'node scripts/lean-agree.ts', file: 'src/proof/merkaba.lean',
    what: 'a constant the proofs reason about drifting from the one the runtime uses',
    mutate: (s) => s.replace('def axis  : List Nat := [3, 6, 0]', 'def axis  : List Nat := [3, 6, 1]') },

  { gate: 'theorem-pages-gate', cmd: 'node scripts/theorem-pages-gate.ts', file: '.vitepress/dist/theorem/lean_units_are_six.html',
    what: 'a sealed theorem whose public page has lost its microdata',
    mutate: (s) => s.replace(/itemprop="identifier"/g, 'itemprop="removed-by-control"') },

  { gate: 'receipt-audit', cmd: 'node scripts/receipt-audit.ts', file: 'src/receipts/a1d33966-7bbd-84ca-902b-49e315af60e0.json',
    what: 'a receipt whose uuid no longer addresses its own message',
    mutate: (s) => { const r = JSON.parse(s); r.message = r.message + ' (altered by control)'; return JSON.stringify(r, null, 2) + '\n' } },

  { gate: 'gate-corpus', cmd: 'node scripts/gate-corpus.ts', file: 'scripts/gate-corpus.ts',
    what: 'an honest sentence being asserted to drain',
    mutate: (s) => s.replace("export const CASES: [string, 0 | 1, string][] = [",
      "export const CASES: [string, 0 | 1, string][] = [\n  ['a content-address proves integrity, not truth; 0/7', 0, 'control: honest prose asserted to drain'],") },

  // THE CONTROL WAS WRONG, NOT THE GATE — the fifth instrument of mine to be wrong before its subject was.
  // I pointed this at index.md, which wholeness never opens: it computes the floor by RUNNING src/7/entails,
  // whose report counts how many of the seven statements entail their conjecture and prints "0 / 7". A
  // control that mutates a file the gate does not read proves nothing about the gate, and reported it as
  // protecting nothing when it was protecting exactly what it claims.
  { gate: 'wholeness', cmd: 'node scripts/wholeness.ts', file: 'src/7/entails.ts',
    what: 'the entailment count no longer computing zero of seven',
    mutate: (s) => s.replace('const s = !trueWhenFalse; if (s) solved++', 'const s = !trueWhenFalse; solved++; void s') },

  { gate: 'gaps', cmd: 'node scripts/gaps.ts', file: '.vitepress/config.ts',
    what: 'a published page dropped from the sidebar',
    mutate: (s) => s.replace(/\{ text: 'Verify \(live app\)', link: '\/verify' \},/, '') },
]

// A KILLED RUN LEAVES A MUTATION, because `finally` does not survive SIGTERM. That is not hypothetical: a
// run of this script hit a command timeout mid-control and left a deliberately falsified theorem on disk,
// where the next lean run found it and reported the file broken. The mutation window is now as short as it
// can be, and a stale backup from a previous run is restored BEFORE anything else happens — so the damage a
// kill can do is bounded by one run rather than left for whoever next builds.
const RESTORE_MARK = '/tmp/gf_inflight.json'
const rescue = () => {
  if (!existsSync(RESTORE_MARK)) return
  try {
    const { file, backup } = JSON.parse(readFileSync(RESTORE_MARK, 'utf8')) as { file: string; backup: string }
    if (existsSync(backup)) {
      copyFileSync(backup, file)
      console.log(`  · rescued ${file} — a previous run was killed mid-control and left its mutation in place`)
    }
  } catch { /* nothing recoverable */ }
  unlinkSync(RESTORE_MARK)
}

const snapshot = (): Set<string> =>
  new Set(execSync('git status --porcelain', { encoding: 'utf8' }).split('\n').filter(Boolean))
rescue()
const before = snapshot()

let broken = 0, checked = 0
console.log('gates-fire — each gate must reject its negative control:\n')
for (const c of CONTROLS) {
  if (!existsSync(c.file)) { console.log(`  ? ${c.gate.padEnd(17)} ${c.file} absent — cannot control`); continue }
  const backup = `/tmp/gf_${c.file.replace(/[\/.]/g, '_')}`
  copyFileSync(c.file, backup)
  writeFileSync(RESTORE_MARK, JSON.stringify({ file: c.file, backup }))   // survives a kill; read on next run
  try {
    const cleanPasses = run(c.cmd)
    writeFileSync(c.file, c.mutate(readFileSync(c.file, 'utf8')))
    const mutatedPasses = run(c.cmd)
    copyFileSync(backup, c.file)
    checked++
    if (cleanPasses && !mutatedPasses) console.log(`  ✓ ${c.gate.padEnd(17)} rejects ${c.what}`)
    else if (!cleanPasses) { broken++; console.log(`  ✗ ${c.gate.padEnd(17)} FAILS ON A CLEAN TREE — it is not testing what it claims`) }
    else { broken++; console.log(`  ✗ ${c.gate.padEnd(17)} ACCEPTS ${c.what} — this gate is not protecting anything`) }
  } finally {
    copyFileSync(backup, c.file); unlinkSync(backup)
    if (existsSync(RESTORE_MARK)) unlinkSync(RESTORE_MARK)
  }
}

// WHAT CHANGED DURING THIS RUN, not what is dirty. The tree is almost never clean while someone is working,
// so asking "is anything modified" reported my own in-progress edits as leftover mutations. The state is
// captured before the controls run and compared after: only a file that changed BETWEEN those two points can
// be a mutation this script failed to undo. Testing the difference rather than the level.

const after = snapshot()
const leftover = [...after].filter((l) => !before.has(l))
if (leftover.length) {
  console.log(`\n✗ gates-fire changed the tree and did not restore it:\n${leftover.slice(0, 5).join('\n')}`)
  process.exit(1)
}

// WHICH GATES HAVE NO CONTROL — named, because a coverage figure nobody prints is a coverage figure nobody
// raises. Twelve of the release chain's gates are demonstrated to fail when they should; the rest are trusted
// on the strength of passing, which is exactly the standing this file exists to withdraw. They are listed so
// the gap is a work item rather than an assumption.
const chain = readFileSync('package.json', 'utf8')
const inChain = [...(JSON.parse(chain).scripts.release as string).matchAll(/node scripts\/([a-z-]+)\.ts/g)].map((m) => m[1])
const controlled = new Set(CONTROLS.map((c) => c.gate))
const uncontrolled = inChain.filter((g) => !controlled.has(g) && g !== 'gates-fire' && g !== 'release')
if (uncontrolled.length) {
  console.log(`\n· ${controlled.size} of ${inChain.length - 2} release gates have a negative control. Without one, trusted only because they pass:`)
  console.log('    ' + uncontrolled.join(' '))
}

console.log(broken
  ? `\n✗ gates-fire: ${broken} of ${checked} gate(s) do not reject what they exist to reject`
  : `\n✓ gates-fire: all ${checked} gates reject their control and pass a clean tree · working tree restored`)
process.exit(broken ? 1 : 0)
