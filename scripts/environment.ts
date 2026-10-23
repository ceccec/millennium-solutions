#!/usr/bin/env node
// ENVIRONMENT — what this machine can do right now, measured, not assumed.
//
//   node scripts/environment.ts             print the probe as JSON
//   ENV_OFF=net,lean node scripts/environment.ts    report those capabilities as absent (to test the skip path)
//
// Capabilities are measured: `net` by a real request to a public host with a timeout, `fs` by writing and reading
// a temporary file, `lean` by running the Lean binary, `git` by running git, `tree` by finding this repository's
// package.json. `ci` is read from the CI variable the runner sets. A probe that fails is reported as absent with
// the reason, so a skipped test always says what was missing.
//
// Used by scripts/run-when.ts (skip a command whose requirements are absent) and by the test helper, so every
// place that decides "skip" reads one probe, not its own guess.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export type Capability = 'net' | 'fs' | 'lean' | 'git' | 'tree' | 'ci'
export type Probe = Record<Capability, { present: boolean; why: string }>

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const forced = new Set((process.env.ENV_OFF ?? '').split(',').map((s) => s.trim()).filter(Boolean))

// Skipping is the last resort. The network is asked three times, with a pause, before it is called absent.
const probeNet = async (): Promise<{ present: boolean; why: string }> => {
  if (forced.has('net')) return { present: false, why: 'forced absent by ENV_OFF' }
  let last = ''
  for (let attempt = 1; attempt <= 3; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    try {
      const res = await fetch('https://api.openalex.org/works?per-page=1', { method: 'HEAD', signal: controller.signal })
      if (res.status < 500) return { present: true, why: `HTTP ${res.status} from a public host (attempt ${attempt})` }
      last = `HTTP ${res.status} (attempt ${attempt})`
    } catch (e) {
      last = `no answer within 5 s (attempt ${attempt}): ${String(e).slice(0, 120)}`
    } finally {
      clearTimeout(timer)
    }
    if (attempt < 3) await new Promise((r) => setTimeout(r, 3000 * attempt))
  }
  return { present: false, why: last }
}

// The CI rule: in continuous integration an absent capability is a failure, never a skip. A skip is allowed only
// on a developer's machine, where it is reported as unmeasured. Call this where a test would skip.
export const skipOrFail = (capability: Capability, why: string): 'SKIP' | 'FAIL' => {
  const inCi = process.env.CI === 'true' || process.env.CI === '1' || !!process.env.GITHUB_ACTIONS
  return inCi ? 'FAIL' : 'SKIP'
}

const probeFs = (): { present: boolean; why: string } => {
  if (forced.has('fs')) return { present: false, why: 'forced absent by ENV_OFF' }
  try {
    const dir = mkdtempSync(join(tmpdir(), 'env-probe-'))
    const f = join(dir, 'probe.txt')
    writeFileSync(f, 'ok')
    const same = readFileSync(f, 'utf8') === 'ok'
    rmSync(dir, { recursive: true, force: true })
    return { present: same, why: same ? 'temporary directory writable and readable' : 'written file did not read back' }
  } catch (e) {
    return { present: false, why: `no writable temporary directory: ${String(e).slice(0, 120)}` }
  }
}

const probeBinary = (name: string, args: string[]): { present: boolean; why: string } => {
  if (forced.has(name)) return { present: false, why: 'forced absent by ENV_OFF' }
  try {
    const out = execFileSync(name, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 15000 })
    return { present: true, why: out.trim().split('\n')[0]!.slice(0, 120) }
  } catch (e) {
    return { present: false, why: `${name} did not run: ${String(e).slice(0, 120)}` }
  }
}

const probeTree = (): { present: boolean; why: string } => {
  if (forced.has('tree')) return { present: false, why: 'forced absent by ENV_OFF' }
  const p = join(ROOT, 'package.json')
  return existsSync(p) ? { present: true, why: 'repository package.json found' } : { present: false, why: 'no package.json beside the scripts' }
}

const probeCi = (): { present: boolean; why: string } => {
  const ci = process.env.CI === 'true' || process.env.CI === '1' || !!process.env.GITHUB_ACTIONS
  return { present: ci, why: ci ? 'running under CI' : 'not running under CI' }
}

export const probe = async (): Promise<Probe> => ({
  net: await probeNet(),
  fs: probeFs(),
  lean: probeBinary('lean', ['--version']),
  git: probeBinary('git', ['--version']),
  tree: probeTree(),
  ci: probeCi(),
})

// Run as a script: print the probe.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  probe().then((p) => console.log(JSON.stringify(p, null, 1)))
}
