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

console.log(broken
  ? `\n✗ gates-fire: ${broken} of ${checked} gate(s) do not reject what they exist to reject`
  : `\n✓ gates-fire: all ${checked} gates reject their control and pass a clean tree · working tree restored`)
process.exit(broken ? 1 : 0)
