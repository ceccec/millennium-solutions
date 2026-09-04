#!/usr/bin/env node
// CI-LOCAL — run what CI runs, where CI runs it.
//
// WHY THIS EXISTS, precisely. Checking "does CI pass" meant reading five workflow files and retyping their
// commands, and retyping them is where the error is. I ran `npm run build` at the repository root and
// reported that every workflow was broken; the root has no `build` script and never needed one, because
// every `npm run build` in CI is `(cd packages/uuidna && npm run build)`, guarded by an existence check.
// That was the fourth instrument error of the day and the most confident one.
//
// Then the same care in the other direction found a REAL failure that the wrong path had hidden:
// `pack:check`, run properly inside packages/uuidna, rejected the package — 262228 bytes unpacked, 84 past
// the 2^18 boundary, so the alignment invariant the publish workflow enforces did not hold.
//
// So: one place, with the working directory written down beside each command. Not a YAML interpreter —
// a list that can be read against the workflows and does not depend on anyone remembering the `cd`.
//
// WHAT IT DOES NOT RUN, deliberately: anything that mutates the record or reaches the network. seal.ts,
// release.ts and the publish step change the ledger or the registry, and a local dry-run of them would
// either be a lie or a mutation. They are listed as skipped, with the reason, rather than silently omitted —
// a check that quietly narrows its own scope reports the health of what is left.
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'

type Step = { name: string; cmd: string; cwd?: string; needs?: string; why?: string }

const STEPS: Step[] = [
  { name: 'gates (11 that ran in no chain)', cmd: 'npm run -s gates' },
  { name: 'lean kernel + axioms',            cmd: 'node scripts/lean.ts' },
  { name: 'lean-claims',                     cmd: 'node scripts/lean-claims.ts' },
  { name: 'claims-gate',                     cmd: 'node scripts/claims-gate.ts' },
  { name: 'quantum-field',                   cmd: 'node scripts/quantum-field.ts' },
  { name: 'axiom-index (+ control)',         cmd: 'node scripts/axiom-index.ts' },
  { name: 'docs-gate (commands resolve)',    cmd: 'node scripts/docs-gate.ts' },
  { name: 'priorart table is generated',     cmd: 'node scripts/priorart-gen.ts --check' },
  { name: 'zenodo (per-theorem DOIs)',        cmd: 'node scripts/zenodo-gate.ts' },
  { name: 'gate-corpus',                     cmd: 'node scripts/gate-corpus.ts' },
  { name: 'forensics (chain of custody)',    cmd: 'node scripts/forensics.ts' },
  { name: 'wholeness',                       cmd: 'node scripts/wholeness.ts' },
  { name: 'gaps (nav + sidebar coverage)',   cmd: 'node scripts/gaps.ts' },
  // THE WORKSPACE STEPS. packages/uuidna is NOT a declared npm workspace — package.json has no
  // `workspaces` field — so these only make sense from inside that directory, which is exactly what the
  // workflows do and exactly what I got wrong.
  { name: 'uuidna build (workspace)',        cmd: 'npm run -s build',      cwd: 'packages/uuidna', needs: 'packages/uuidna/package.json' },
  { name: 'uuidna pack:check (alignment)',   cmd: 'npm run -s pack:check', cwd: 'packages/uuidna', needs: 'packages/uuidna/package.json' },
]

const SKIPPED: Step[] = [
  { name: 'seal.ts',    cmd: 'node scripts/seal.ts',    why: 'appends to the append-only ledger' },
  { name: 'zenodo-mint.ts', cmd: 'node scripts/zenodo-mint.ts --production', why: 'publishes permanent public DOIs that the depositor cannot delete' },
  { name: 'release.ts', cmd: 'node scripts/release.ts', why: 'tags and stages a release' },
  { name: 'npm publish', cmd: '(publish.yml)',          why: 'reaches the registry; runs only on a published GitHub Release' },
  { name: 'gates-fire', cmd: 'node scripts/gates-fire.ts', why: 'mutates files in place — run it explicitly with `npm run gates:fire`' },
]

let failed = 0, skipped = 0
for (const s of STEPS) {
  if (s.needs && !existsSync(s.needs)) {
    console.log(`  ○ ${s.name.padEnd(36)} skipped — ${s.needs} absent, and the workflow guards it the same way`)
    skipped++
    continue
  }
  const where = s.cwd ? `  (cd ${s.cwd})` : ''
  try {
    execSync(s.cmd, { cwd: s.cwd, stdio: 'pipe' })
    console.log(`  ✓ ${s.name.padEnd(36)}${where}`)
  } catch (e: unknown) {
    const out = String((e as { stdout?: Buffer; stderr?: Buffer }).stdout ?? '') + String((e as { stderr?: Buffer }).stderr ?? '')
    const last = out.trim().split('\n').filter(Boolean).slice(-2).join(' · ').slice(0, 150)
    console.log(`  ✗ ${s.name.padEnd(36)}${where}\n      ${last}`)
    failed++
  }
}

console.log('\n  not run here, and why:')
for (const s of SKIPPED) console.log(`  ○ ${s.name.padEnd(36)} ${s.why}`)

console.log(failed
  ? `\n✗ ci-local: ${failed} step(s) fail as CI runs them`
  : `\n✓ ci-local: ${STEPS.length - skipped} step(s) pass as CI runs them, ${skipped} guarded-absent, ${SKIPPED.length} not run here by design`)
process.exit(failed ? 1 : 0)
