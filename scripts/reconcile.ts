#!/usr/bin/env node
/** ── RECONCILE — the bridge between the seal pipeline and the commit pipeline ──────────────────────────────
 *
 *  THE GAP THIS CLOSES. Two pipelines move the tree, and nothing joined them:
 *    · the RELEASE chain (package.json `release`) regenerates every derived file from the ledger and the Lean
 *      sources — THEN gates them. Its generator block runs pages, priorart-gen, paper, dashboard, … in order.
 *    · the PRE-COMMIT chain (.githooks/pre-commit) only GATES. It assumes the derived files are already fresh.
 *  So after a local `seal-lean --seal`, or after adding a .lean file, the derived files are stale and the
 *  pre-commit court refuses — naming one stale file at a time (a front page unmentioning the new source, a
 *  settled.lean count that no longer matches), each with its own remediation. Closing it meant knowing the
 *  release chain's generator ORDER by hand and running four to twenty scripts in sequence. That knowledge
 *  lived nowhere a committer could run; it was the gap.
 *
 *  This is the single command that regenerates every ledger/source-derived file, in the release chain's own
 *  order, so `add a .lean → seal → reconcile → commit` has no manual step. The ORDER below mirrors the
 *  `release` script's generator block (the single source) plus `settled.ts`, which the release chain omits
 *  even though settled.lean is a committed file generated only by it — itself a seam this records.
 *
 *  IT DOES NOT seal, generate families, or build the site: those are their own steps. Run it AFTER sealing;
 *  with --seal it seals first (any pending axiom-free `by decide` theorem), so one command does the whole
 *  bridge. It never touches the network or ships.
 *
 *    node scripts/reconcile.ts            regenerate every derived file (run after a seal)
 *    node scripts/reconcile.ts --seal     seal pending theorems first, then regenerate
 *    node scripts/reconcile.ts --check    regenerate, FAIL if any tracked file changed (the tree was stale),
 *                                         then restore — the gate that proves the commit pipeline has no gap */
import { execSync } from 'node:child_process'

const argv = new Set(process.argv.slice(2))
const check = argv.has('--check')
const seal = argv.has('--seal')

// The generator block of `release`, in its order, plus settled (which release omits). Each entry is one
// generator that writes a committed derived file from the ledger or the Lean sources. PURE checks in the
// release chain (contradictions, latex-gate, …) are NOT here: reconcile regenerates, the court verifies. A
// gate that ALSO writes a committed file IS here, because its output drifts like any other — forensic-audit
// writes forensic.md + docs/forensic-audit.json (the ledger counts in them went stale at 28632 while the tree
// held 28656, uncaught through four commits until --check flagged what reconcile could not fix). If release
// gains or reorders a generator, this list is what to update — named here, once.
const STEPS: [string, string][] = [
  ['forensic.md + docs/forensic-audit.json', 'node scripts/forensic-audit.ts'],
  ['settled.lean', 'node scripts/settled.ts --emit'],
  ['priorart.lean', 'node scripts/priorart-gen.ts'],
  ['AXIOMS.md', 'node scripts/axiom-index.ts'],
  ['covered.json', 'node scripts/imagine.ts'],
  ['analytics', 'node scripts/analytics.ts'],
  ['README.md + index.md', 'node scripts/pages.ts'],
  ['gaps', 'node scripts/gaps.ts'],
  ['dashboard.md', 'node scripts/dashboard.ts'],
  ['clock.md', 'node scripts/clock.ts'],
  ['evidence/factor/2pow999plus1.json', 'node scripts/factor-999.ts'],
  ['evidence/factor/primecerts.json', 'node scripts/primecert-999.ts'],
  ['iso-conformance.md', 'node scripts/iso-conformance.ts'],
  ['chsh-run.md', 'node scripts/chsh-harness.ts'],
  ['accreditation.md', 'node scripts/accreditation-dossier.ts'],
  ['boundaries', 'node scripts/boundaries.ts'],
  ['rights.md', 'node scripts/rights.ts'],
  ['notice', 'node scripts/notice.ts'],
  ['CHALLENGES.md', 'node scripts/challenges.ts'],
  ['HEART.md', 'node scripts/heart.ts'],
  ['ACCOUNTING.md', 'node scripts/accounting.ts'],
  ['speedup.md', 'node scripts/speedup.ts'],
  ['PRIOR-ART.md', 'node scripts/priorart.ts'],
  ['paper.md + paper.tex', 'node scripts/paper.ts'],
  ['.zenodo.json', 'node scripts/zenodo-json.ts'],
  ['.zenodo/index.json', 'node scripts/zenodo-theorems.ts --write'],
  ['trial-all.json', 'node scripts/trial-all.ts'],
]

const run = (cmd: string) => execSync(cmd, { stdio: check ? 'pipe' : 'inherit' })
const dirty = (): string[] => execSync('git status --porcelain', { encoding: 'utf8' })
  .split('\n').filter(Boolean).map((l) => l.slice(3)).filter((p) => !p.startsWith('evidence/'))

if (seal) { console.log('· seal: sealing any pending theorems'); run('node scripts/seal-lean.ts --seal') }

const before = check ? new Set(dirty()) : new Set<string>()

for (const [out, cmd] of STEPS) {
  if (!check) console.log(`· ${out}`)
  try { run(cmd) } catch (e) {
    console.error(`✗ reconcile: ${cmd} failed\n${String((e as { stdout?: Buffer }).stdout ?? '')}${String((e as { stderr?: Buffer }).stderr ?? '')}`)
    process.exit(1)
  }
}

if (check) {
  // Anything that changed and was NOT already dirty before reconcile is a derived file the committed tree had
  // let go stale — the gap. Name them, restore the tree, and refuse.
  const after = dirty()
  const stale = after.filter((p) => !before.has(p))
  if (stale.length) {
    for (const p of stale) { try { execSync(`git checkout -- '${p}'`) } catch { /* new/untracked: leave */ } }
    console.error(`✗ reconcile --check: ${stale.length} derived file(s) are stale in the committed tree — the commit pipeline has a gap:`)
    for (const p of stale) console.error(`    · ${p}`)
    console.error('  Run `npm run reconcile` and commit the result.')
    process.exit(1)
  }
  console.log('✓ reconcile --check: every derived file is a fixed point of its generator — no gap between seal and commit')
} else {
  const changed = dirty()
  console.log(`\n✓ reconcile: ${STEPS.length} generator(s) ran. ${changed.length ? `${changed.length} derived file(s) updated — review and commit:` : 'the tree was already consistent (nothing changed).'}`)
  for (const p of changed) console.log(`    · ${p}`)
}
