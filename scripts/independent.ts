#!/usr/bin/env node
/** ── THE VERIFICATION PATH IS AI-INDEPENDENT, AND THAT IS CHECKED RATHER THAN ASSERTED ────────────────────
 *
 *  This deposit was produced with an AI in the loop, and the whole record is worth nothing if checking it
 *  also requires one. It does not. Every theorem is decided by the Lean kernel; every figure in the prose is
 *  recomputed by a script; every receipt is a hash of content that anyone can rehash. A third party needs
 *  `lean` and `node`, no account, no key, and no model — and does not need to trust the agent that wrote it,
 *  or the depositor, or this file.
 *
 *  SAYING SO IS NOT SHOWING IT. What this script does is derive the verification path — the chain a checker
 *  actually runs, plus everything it transitively imports — and read every file in it for the three things
 *  that would make the claim false:
 *
 *      · a call out to a network, which would put a remote party between the checker and the answer
 *      · a credential read from the environment, which would mean the check is not open to everyone
 *      · any reference to a model endpoint, which would mean an AI is in the checking loop
 *
 *  It REFUSES if it finds one. The network scripts in this repository — the CERN survey, the DOI resolver,
 *  the Zenodo minting — are real and are deliberately outside this path: they publish or corroborate, and
 *  nothing in the verification depends on them. That separation is the claim, so this measures it.
 *
 *      npm run independent
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

const pkg = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>

// THE PATH IS DERIVED, NOT LISTED. `ci:local` is what a checker runs; ci-local.ts names the steps it shells
// out to, and each of those imports more. A hand-written list of "the verification scripts" would drift the
// first time a step was added, and would drift in the direction that makes this pass.
//
// AND THE DERIVATION IS NARROWER THAN "EVERY SCRIPT NAMED IN THE FILE". The first version scanned
// ci-local.ts for `scripts/*.ts` and pulled in zenodo-mint, which ci-local mentions only in order to say it
// does NOT run it — publishing DOIs is exactly the kind of thing a checker must not need. The check then
// reported the mint's `fetch` as a dependency of verification, which would have been a true finding about a
// false path. Steps are read from the `cmd:` fields, which is what actually runs.
const seeds = new Set<string>(['scripts/ci-local.ts', 'scripts/lean.ts', 'scripts/forensics.ts', 'scripts/verify.ts'])
// A ci-local Step that carries a `why` is one it deliberately does NOT run — that field is where it records
// the reason. Reading `cmd:` alone put the DOI mint on the verification path because the not-run list uses
// the same shape to name what it is declining to do.
const stepCmds = readFileSync('scripts/ci-local.ts', 'utf8').split('\n')
  .filter((ln) => /\bcmd:\s*'/.test(ln) && !/\bwhy:\s*'/.test(ln))
  .map((ln) => ln.match(/\bcmd:\s*'([^']+)'/)![1])
if (!stepCmds.length) { console.log('✗ independent: read no steps out of scripts/ci-local.ts — the path cannot be derived'); process.exit(1) }
const fromCmds = [...stepCmds, String(pkg['ci:local'] ?? ''), String(pkg['docs:build'] ?? ''), String(pkg['predocs:build'] ?? ''), String(pkg['metrics:enforce'] ?? ''), String(pkg['gates'] ?? '')].join(' ')
for (const m of fromCmds.matchAll(/scripts\/([a-z0-9-]+)\.ts/g)) seeds.add(`scripts/${m[1]}.ts`)
// an `npm run -s X` step is a chain of its own; expand one level through package.json
for (const m of fromCmds.matchAll(/npm run -s ([a-z:-]+)/g))
  for (const n of String(pkg[m[1]] ?? '').matchAll(/scripts\/([a-z0-9-]+)\.ts/g)) seeds.add(`scripts/${n[1]}.ts`)

const path = new Set<string>()
const walk = (f: string): void => {
  const rel = relative(process.cwd(), resolve(f))
  if (path.has(rel) || !existsSync(rel)) return
  path.add(rel)
  for (const m of readFileSync(rel, 'utf8').matchAll(/from\s+'(\.[^']+)'/g)) walk(join(dirname(rel), m[1]))
}
for (const s of seeds) walk(s)

// WHAT WOULD FALSIFY THE CLAIM. Each pattern is a CALL, not a mention: a URL in a comment is documentation
// and a `fetch(` is a dependency on somebody else's server. The distinction matters because this file's own
// prose names three AI endpoints, and a check that read prose would fail on the document that describes it.
const FALSIFIERS: { what: string; re: RegExp }[] = [
  { what: 'a network call', re: /\b(?:fetch|axios|got|undici)\s*\(|https?\.request\s*\(|new\s+WebSocket\s*\(/ },
  { what: 'a shelled-out network call', re: /\b(?:curl|wget)\s+-|execSync\([^)]*\b(?:curl|wget)\b/ },
  { what: 'a credential from the environment', re: /process\.env\.[A-Z_]*(?:TOKEN|KEY|SECRET|PASSWORD|CREDENTIAL)/ },
  { what: 'a model endpoint', re: /api\.(?:anthropic|openai)\.com|generativelanguage\.googleapis|\bopenai\b\s*\(|anthropic\s*\(/ },
]
// Comments and string-free prose are stripped before matching, so a documented URL is not a dependency.
const code = (s: string): string => s.replace(/^\s*(?:\/\/|\*|\/\*).*$/gm, '')

const found: { file: string; what: string; line: number; text: string }[] = []
for (const f of [...path].sort()) {
  const src = code(readFileSync(f, 'utf8'))
  src.split('\n').forEach((ln, i) => {
    for (const { what, re } of FALSIFIERS) if (re.test(ln)) found.push({ file: f, what, line: i + 1, text: ln.trim().slice(0, 90) })
  })
}

console.log(`independent — what a third party needs to check this deposit:\n`)
console.log(`  files on the verification path      ${path.size}`)
console.log(`  derived from                        package.json ci:local, and every local import it reaches`)
console.log(`  tools required                      lean (the kernel decides every theorem) and node (the scripts recompute every figure)`)
console.log(`  accounts, keys, models required     none — which is what the check below is about\n`)

if (found.length) {
  console.log(`✗ independent: ${found.length} dependenc(ies) on the verification path that a checker cannot supply:`)
  for (const x of found) console.log(`    ${x.file}:${x.line}  ${x.what}\n        ${x.text}`)
  console.log(`\n  Either the dependency moves off the verification path, or the claim that this deposit can be`)
  console.log(`  checked without an account, a key or a model is false and must stop being made.`)
  process.exit(1)
}

console.log(`✓ independent: nothing on the verification path calls a network, reads a credential, or reaches a`)
console.log(`  model. The deposit was written with an AI in the loop and can be checked without one — by the`)
console.log(`  Lean kernel, which decides the theorems, and by rehashing the content, which anyone can do.`)
console.log(`\n  This does NOT say the deposit is correct, or that its theorems are interesting, or that the AI`)
console.log(`  that wrote them was honest. It says none of those questions has to be settled on trust.`)
