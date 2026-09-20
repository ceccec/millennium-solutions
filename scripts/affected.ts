#!/usr/bin/env node
/** ── AFFECTED — run the chain steps a change can actually reach ────────────────────────────────────────
 *
 *  Captain's instruction: "automate to save tokens". The release chain is sixty-odd steps and gates-fire
 *  alone rebuilds the site once per gate. Running all of it to check a three-file edit, then reading the
 *  log to find the one line that mattered, is where the tokens go — and it was my loop all day.
 *
 *  THE STEP LIST IS READ FROM package.json, NOT COPIED. A hand-kept list of steps beside the chain is a
 *  second description of the chain, and the copy nobody runs is the one that drifts — this tree's named
 *  defect. The chain is parsed; whatever is in it is what runs.
 *
 *  AFFECTED IS COMPUTED FROM THE DEPENDENCY CLOSURE, imports and the data paths a script opens at run time.
 *  `src/source/dependsOn` does both, because a closure built from imports alone would call handle-gate
 *  unaffected by a change to the ledger it reads — a selective runner that says "nothing to check" about
 *  the thing that changed is worse than no runner.
 *
 *  THE ASYMMETRY IS DELIBERATE. A step whose closure cannot be computed — `npm run docs:build`, a shell
 *  step, anything not `node scripts/X.ts` — is ALWAYS RUN. A missed step means a defect ships; an extra
 *  step costs seconds. Those are not comparable costs, so the doubt resolves one way, every time.
 *
 *  THIS IS NOT THE RELEASE. It answers "can what I just changed have broken something", which is the
 *  question worth asking twenty times an hour. It does not answer "is this tree fit to tag" — only the full
 *  chain does, because gates-fire proves every gate still rejects its control, and a gate this run skipped
 *  is a gate nobody proved anything about today. `npm run release` stays the authority and this says so on
 *  every run rather than leaving it to be assumed.
 *
 *  WHAT THIS SAVES, MEASURED — because the obvious claim is the wrong one. Selecting steps cuts 67 to about
 *  20 on a small change, which SOUNDS like a two-thirds saving and is not: the steps it skips are the cheap
 *  ones. Timed on this tree: handle-gate 0.17s, canon-gate 0.33s, zenodo-json 0.32s, `npm run docs:build`
 *  10.35s — and gates-fire runs seventy-four gates, most with a rebuild behind them. Skipping forty-seven
 *  cheap steps saves on the order of fifteen seconds out of a chain measured in minutes.
 *
 *  Worse, the two dominant steps can NEVER be skipped, and correctly so: gates-fire builds `scripts/${g}.ts`
 *  and so reaches every gate in the tree, and docs:build has no closure to compute. Quoting a step count as
 *  a saving would be a number that flatters the tool. The count is reported as a count.
 *
 *  THE SAVING THAT IS REAL IS IN WHAT IS PRINTED. A chain run emits around five hundred lines and a reader
 *  greps them. This prints one line per step and the failing step in full, which is the part that was
 *  actually costing something. `--cheap` additionally skips the steps that drive a site build, for the inner
 *  loop — and answers nothing about whether the gates still reject their controls.
 *
 *  usage:  node scripts/affected.ts            against the working tree
 *          node scripts/affected.ts --since HEAD~3     against a range
 *          node scripts/affected.ts --list     list what would run, run nothing */
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync, execSync } from 'node:child_process'
import { dependsOn } from '../src/source/index.ts'
import { arg, flag } from '../src/cli/index.ts'

const read = (p: string): string | null => { try { return readFileSync(p, 'utf8') } catch { return null } }
const git = (...a: string[]) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

const since = arg('--since')
const changed = new Set(
  (since
    ? git('diff', '--name-only', `${since}..HEAD`)
    : git('status', '--porcelain').split('\n').map((l) => l.slice(3)).join('\n')
  ).split('\n').map((s) => s.trim().replace(/^"|"$/g, '')).filter(Boolean),
)
// Build scratch is regenerated output and is nobody's input. Leaving it in would mark every step affected
// after any build, which is the same as having no runner at all.
for (const p of [...changed]) if (/^\.vitepress\/(\.temp|dist|cache)\//.test(p)) changed.delete(p)

if (!changed.size) { console.log('  ○ affected: nothing changed — no step can be reached by it. `npm run release` is still the authority on whether this tree may be tagged.'); process.exit(0) }

const chain = String((JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }).scripts.release ?? '')
const steps = chain.split('&&').map((s) => s.trim()).filter(Boolean)
if (!steps.length) { console.log('  ✗ affected: package.json declares no release chain to read — nothing to select from'); process.exit(1) }

// HEAVY IS DERIVED, NOT LISTED. A hand-kept list of expensive steps would go stale the moment one changed.
// A step is heavy when it drives a full site build — either it IS `npm run docs:build`, or its source says
// so. That is the 10-second unit everything expensive in this chain is made of.
const CHEAP = flag('--cheap')
const heavy = (cmd: string, script: string | null): boolean => {
  if (/docs:build/.test(cmd)) return true
  const src = script ? read(script) : null
  return !!src && /docs:build/.test(src)
}

type Step = { cmd: string; script: string | null; why: string; run: boolean }
const plan: Step[] = steps.map((cmd) => {
  const m = cmd.match(/^node\s+(scripts\/[\w-]+\.ts)/)
  if (CHEAP && heavy(cmd, m?.[1] ?? null)) return { cmd, script: m?.[1] ?? null, why: 'drives a site build — skipped by --cheap, so this run says NOTHING about it', run: false }
  if (!m) return { cmd, script: null, why: 'closure unknown — run by default', run: true }
  const script = m[1]
  if (!existsSync(script)) return { cmd, script, why: 'script absent — run so it reports that itself', run: true }
  const closure = dependsOn(script, read, existsSync)
  // A FILE THAT BUILDS ITS PATHS CANNOT BE SELECTED AGAINST. `src/proof/${name}.lean` names no file in the
  // source, so a closure has no way to hold it, and skipping such a step would be this runner quietly
  // deciding a gate was unreachable by the very data it opens. Those steps always run.
  if (closure.incomplete) return { cmd, script, why: 'builds paths at run time — closure cannot be complete, so it runs', run: true }
  const hits = [...closure].filter((f) => changed.has(f))
  return hits.length
    ? { cmd, script, why: `reads ${hits.slice(0, 3).join(', ')}${hits.length > 3 ? ` +${hits.length - 3}` : ''}`, run: true }
    : { cmd, script, why: `closure of ${closure.size} file(s), none changed`, run: false }
})

const toRun = plan.filter((s) => s.run)
console.log(`  ${changed.size} path(s) changed${since ? ` since ${since}` : ''} · ${toRun.length} of ${plan.length} chain step(s) can reach them`)
if (flag('--list')) {
  for (const s of plan) console.log(`  ${s.run ? '▶' : '·'} ${(s.script ?? s.cmd).padEnd(34)} ${s.why}`)
  console.log('\n  nothing was run. `npm run release` remains the only answer to whether this tree may be tagged.')
  process.exit(0)
}

// THE CHAIN'S ENVIRONMENT, OR THE RESULTS DO NOT TRANSFER. These steps normally run under `npm run`, which
// puts node_modules/.bin on PATH. Run bare, `tsc --noEmit` is "command not found" — a red step that says
// nothing about the tree, reported by a runner whose whole purpose is to stand in for the chain. A selective
// runner that does not reproduce the chain's environment is not selecting from the chain at all.
const BIN_ENV = { ...process.env, PATH: `node_modules/.bin:${process.env.PATH ?? ''}` }

let failed = 0
for (const s of toRun) {
  const label = (s.script ?? s.cmd).replace(/^node scripts\//, '').replace(/\.ts$/, '')
  try {
    execSync(s.cmd, { stdio: 'pipe', encoding: 'utf8', env: BIN_ENV })
    console.log(`  ✓ ${label}`)
  } catch (e) {
    failed++
    const out = String((e as { stdout?: string }).stdout ?? '') + String((e as { stderr?: string }).stderr ?? '')
    // ONLY A FAILURE IS PRINTED IN FULL. A passing gate's output is the thing being paid for and not read.
    console.log(`  ✗ ${label}\n${out.split('\n').filter(Boolean).slice(-25).map((l) => '      ' + l).join('\n')}`)
    break   // the chain is `&&`; stopping where it would stop keeps this honest about what was reached
  }
}

const skipped = plan.length - toRun.length
console.log(failed
  ? `\n✗ affected: a step this change reaches is red — fix it, then \`npm run release\` before tagging`
  : `\n✓ affected: ${toRun.length} step(s) reached by this change all pass · ${skipped} skipped as unreachable from it`)
const heavyIn = toRun.filter((s) => heavy(s.cmd, s.script)).map((s) => (s.script ?? s.cmd).replace(/^node scripts\//, '').replace(/\.ts$/, ''))
if (heavyIn.length) console.log(`  the ${heavyIn.length} step(s) that drive a site build were included (${heavyIn.join(', ')}) — they are the cost, so this run was not much cheaper than the chain in TIME. What it saved is the reading.`)
if (CHEAP) console.log('  --cheap skipped every site-building step. Those are the ones that check what a reader actually sees.')
console.log('  This is not the release. gates-fire was not asked whether every gate still rejects its control;')
console.log('  only `npm run release` establishes that, and only it may precede a tag.')
process.exit(failed ? 1 : 0)
