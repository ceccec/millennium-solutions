#!/usr/bin/env node
/** ── VERIFY AS A FRESH CLONE WOULD ────────────────────────────────────────────────────────────────────
 *
 *  This exists because I checked HEAD by hand. I wrote a shell script on the spot, chose which chain steps
 *  went into it, and ran it — and a verification whose scope the runner decides, per run, is the exact shape
 *  of a check that gets tuned until it passes. The captain asked why it was manual. There is no good answer,
 *  so it is a script now: same steps every time, read from the chain, adjustable only by editing this file
 *  where the edit shows in a diff.
 *
 *  WHAT IT CATCHES THAT THE WORKING TREE CANNOT. `npm run release` runs against a tree carrying build
 *  artefacts from every earlier run — .olean files, caches, generated pages. Those are gitignored, so a
 *  reader who clones this repository has none of them. Measured 2026-09-21: the committed lean.ts compiled
 *  imported modules in readdir order, `merkle.lean` imports `Address` and `Address` came after it, and the
 *  whole Lean layer only built because oleans from a previous run were already on disk. The working tree
 *  passed every time. A clean checkout did not build at all — which is what llms.txt tells a reader to do.
 *
 *  ALSO WHY IT IS ISOLATED. gates-fire mutates Lean sources by design: plant a control, run the gate,
 *  restore. Another process reading the tree mid-run sees a deposit that briefly disagrees with itself, and
 *  two chain runs this session went red on controls stranded by a concurrent session rather than on anything
 *  in the tree. A detached worktree is not reachable by that.
 *
 *  WHAT IT IS NOT. node_modules is symlinked rather than installed, so this does NOT verify that the
 *  dependency set resolves from a clean npm install — stated because a check that quietly skips a step is
 *  worse than one that says which step it skipped. And `release.ts` is cut: a git tag is repo-wide, not
 *  worktree-local, so minting one here would put a real tag in the real repository from a throwaway
 *  directory. Everything before it runs, gates-fire included.
 *
 *  usage:  node scripts/verify-clone.ts [--ref HEAD] [--keep] */
import { readFileSync, rmSync, symlinkSync, readdirSync, unlinkSync } from 'node:fs'
import { execFileSync, execSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { arg, flag } from '../src/cli/index.ts'

const REF = arg('--ref') ?? 'HEAD'
const KEEP = flag('--keep')
const ROOT = process.cwd()
const W = join(tmpdir(), `verify-clone-${process.pid}`)
const git = (...a: string[]) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

// THE STEPS ARE READ FROM THE CHAIN, NOT LISTED HERE. A hand-kept copy is a second description of the
// chain, and the copy nobody runs is the one that drifts.
const chain = String((JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }).scripts.release ?? '')
const steps = chain.split('&&').map((s) => s.trim()).filter(Boolean)
const cut = steps.findIndex((s) => /scripts\/release\.ts/.test(s))
const plan = cut >= 0 ? steps.slice(0, cut) : steps
if (!plan.length) { console.log('  ✗ verify-clone: the release chain is empty — nothing to verify'); process.exit(1) }

const sha = git('rev-parse', '--short', REF).trim()
console.log(`  verify-clone: ${REF} (${sha}) → ${plan.length} step(s), release.ts and everything after it cut`)

let failed = 0
try {
  rmSync(W, { recursive: true, force: true })
  git('worktree', 'add', '--detach', W, REF)
  symlinkSync(join(ROOT, 'node_modules'), join(W, 'node_modules'))

  // A FRESH CLONE HAS NO BUILD ARTEFACTS. `git worktree add` gives a clean checkout, but anything gitignored
  // and generated must be absent too, or this checks the same warm state the working tree already checks.
  const proof = join(W, 'src/proof')
  for (const f of readdirSync(proof)) if (f.endsWith('.olean') || f === '.lean-cache.json') unlinkSync(join(proof, f))
  console.log(`  worktree ${W} — no .olean, no cache; node_modules symlinked (NOT a clean install)`)

  const env = { ...process.env, PATH: `${join(W, 'node_modules/.bin')}:${process.env.PATH ?? ''}` }
  for (const cmd of plan) {
    const label = cmd.replace(/^node scripts\//, '').replace(/\.ts.*$/, '')
    try { execSync(cmd, { cwd: W, stdio: 'pipe', encoding: 'utf8', env }); console.log(`  ✓ ${label}`) }
    catch (e) {
      failed++
      const out = String((e as { stdout?: string }).stdout ?? '') + String((e as { stderr?: string }).stderr ?? '')
      console.log(`  ✗ ${label}\n${out.split('\n').filter(Boolean).slice(-20).map((l) => '      ' + l).join('\n')}`)
      break   // the chain is `&&`; stopping where it would stop keeps this honest about what was reached
    }
  }
} finally {
  if (!KEEP) { try { git('worktree', 'remove', '--force', W) } catch { rmSync(W, { recursive: true, force: true }) } }
  else console.log(`  --keep: worktree left at ${W}`)
}

console.log(failed
  ? `\n✗ verify-clone: ${sha} does NOT verify from a clean checkout. The working tree may still pass — it carries artefacts a reader will not have.`
  : `\n✓ verify-clone: ${sha} verifies from a clean checkout, with no build artefact carried in from any earlier run.`)
process.exit(failed ? 1 : 0)
