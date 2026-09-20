#!/usr/bin/env node
// ORPHAN GATE — a script nothing runs is either dead or forgotten, and the difference matters.
//
// Four scripts here were reachable by nobody: not an npm script, not imported, not in a workflow, not in a
// hook. Asked to purge legacy code I nearly deleted all four — and then found that three of them do real
// work that nothing else covers. verify.ts produces the per-entry citation verdict and its root; trial-all.ts
// puts every ledger entry in the dock and writes an order-invariant verdict; lean-gen.ts proves ledger
// families at scale. Only one was actually legacy: a sixteen-line SHA-256 demo over two invented
// transactions, superseded by the real receipt chain and forensics.
//
// So the finding was not "delete four things". It was "three things that should be running are not", which is
// the opposite conclusion from the same evidence. This gate exists so the next orphan is noticed while
// somebody still remembers what it was for, instead of being found during a purge and judged in a hurry.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }
const npmText = Object.values(pkg.scripts).join(' ')
const scripts = readdirSync('scripts').filter((f) => f.endsWith('.ts') && !f.startsWith('.'))

const srcText = scripts.map((f) => readFileSync('scripts/' + f, 'utf8')).join('\n')
  + readdirSync('src', { recursive: true }).map(String).filter((f) => f.endsWith('.ts'))
      .map((f) => { try { return readFileSync('src/' + f, 'utf8') } catch { return '' } }).join('\n')
const wfText = existsSync('.github/workflows')
  ? readdirSync('.github/workflows').map((f) => readFileSync('.github/workflows/' + f, 'utf8')).join('\n') : ''
const hookText = existsSync('.githooks')
  ? readdirSync('.githooks').map((f) => { try { return readFileSync('.githooks/' + f, 'utf8') } catch { return '' } }).join('\n') : ''

const orphans = scripts.filter((f) => {
  const n = f.replace('.ts', '')
  if (npmText.includes(`scripts/${f}`)) return false
  if (new RegExp(`from '\\.\\/${n}\\.ts'|from '\\.\\.\\/scripts\\/${n}\\.ts'`).test(srcText)) return false
  if (wfText.includes(`scripts/${f}`) || hookText.includes(`scripts/${f}`)) return false
  return true
})

console.log(`orphan — ${scripts.length} scripts, each reachable from an npm script, an import, a workflow or a hook:`)
if (orphans.length) {
  for (const f of orphans) console.log(`  ✗ ${f} — nothing runs it`)
  console.log(`\n✗ orphan-gate: ${orphans.length} script(s) nothing can reach. Wire it, or delete it — but decide while`)
  console.log(`  someone still knows what it was for. Three of the last four turned out to be worth keeping.`)
  process.exit(1)
}
// ── AN EXPORT NOTHING NAMES IS THE SAME DEFECT, ONE SCALE DOWN ───────────────────────────────────────────
// A script nothing runs and a function nothing calls are the same thing, and this gate had only ever looked
// at the first. Measured 2026-09-20: eight exports were named nowhere but their own definition —
// seedFromText, memoByRoot, createAnimationEngine, addressOf, MERGE_KEY_SPEC, EARTH, an Analytics type, and
// SEED_BYTES. None reached the published package surface; mod.core.ts names its exports explicitly.
//
// SEVEN WERE DEAD AND ONE WAS NOT, which is the same split this gate's own header records for scripts.
// SEED_BYTES was unused because ed25519.ts typed `32` as a literal three lines above it — so deleting the
// constant would have removed the NAME and kept three copies of the NUMBER. It is used now. That is why this
// reports rather than assumes: "nothing names it" is evidence about the tree, not a verdict about the code.
//
// Deliberately blunt: one appearance of the name across every .ts, .vue, .md and .json this repository
// tracks. A name used dynamically, or only in prose, does not trip it. It cannot see re-export chains, so a
// name that reaches the world through one will read as dead — check the published surface before deleting,
// which is what mod.core.ts is for.
const tracked = execSync('git ls-files "*.ts" "*.vue" "*.md" "*.json" "*.yml"', { encoding: 'utf8' })
  .split('\n').filter(Boolean).filter((f) => !f.startsWith('packages/') && !f.startsWith('dist/'))
const corpus = tracked.map((f) => { try { return readFileSync(f, 'utf8') } catch { return '' } }).join('\n')
const dead: string[] = []
for (const f of tracked.filter((x) => x.endsWith('.ts') || x.endsWith('.vue'))) {
  const body = readFileSync(f, 'utf8')
  for (const m of body.matchAll(/^export (?:const|function|class|interface|type) (\w+)/gm)) {
    const hits = (corpus.match(new RegExp('\\b' + m[1] + '\\b', 'g')) ?? []).length
    if (hits <= 1) dead.push(`${f}  ${m[1]}`)
  }
}
if (dead.length) {
  for (const d of dead) console.log(`  ✗ ${d} — exported, and named nowhere else in the tree`)
  console.log(`\n✗ orphan-gate: ${dead.length} export(s) nothing names. Delete it, or find out why it is unused —`)
  console.log(`  the last sweep found one that was unused because its value had been typed out as a literal instead.`)
  process.exit(1)
}
console.log(`\n✓ orphan-gate: every script is reachable, and every export is named — ${tracked.length} tracked files read`)
