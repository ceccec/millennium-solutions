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
import { stripComments } from '../src/source/index.ts'

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
// ── AND FILES, WHICH IS WHERE A PURGE GOES WRONG ─────────────────────────────────────────────────────────
// A file nothing names is the same defect one scale up again, and this check is the most dangerous in the
// gate for two separate reasons.
//
// FIRST, some files are addressed by CONTENT and no grep can see it. src/receipts/<uuid>.json is opened as
// `dir + '/' + uuid + '.json'` by scripts/receipt.ts — the filename is computed at runtime. All 29 read as
// unreferenced, and 593b546a… is the captain's own message. A sweep deleting "unreferenced data files"
// would destroy the signed record. The exemption is written HERE, in the gate, rather than remembered,
// because a future sweep that has not read this file will run its own grep and be wrong.
//
// SECOND, the obvious implementation is vacuous. The first version asked whether any other file contained
// the BASENAME, and `index.ts` appears in nearly every file in this tree — so it passed for every module
// with a common name, which is most of them. gates-fire caught it: "ACCEPTS a tracked file that nothing in
// the tree names". Relative import specifiers are resolved against the importing file now, so a reference
// means a reference.
//
// The resolution is not transitive: an island of files importing only each other reads as referenced. That
// is a known limit, stated rather than papered over — this catches a file nothing points at, not a
// component nothing reaches.
const CONTENT_ADDRESSED = [/^src\/receipts\//, /^\.zenodo\//, /^\.claude\//, /^src\/proof\//, /^\.vitepress\//]
const norm = (p: string): string => {
  const out: string[] = []
  for (const seg of p.split('/')) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') out.pop()
    else out.push(seg)
  }
  return out.join('/')
}
const referenced = new Set<string>()
// MARKDOWN IMPORTS TOO, and leaving it out is how this detector has been wrong three times. compute.md
// alone carries 87 import statements — every digit-folder module is reached from a page, not from another
// module — so a resolver that reads only .ts/.vue/.mjs reports fifty live modules as dead. The extension is
// also optional there (`from './src/0/entanglement'`), so both spellings resolve.
for (const f of tracked.filter((x) => /\.(ts|vue|mjs|md)$/.test(x))) {
  const body = readFileSync(f, 'utf8')
  const dir = f.includes('/') ? f.slice(0, f.lastIndexOf('/')) : '.'
  for (const m of body.matchAll(/from\s+'([^']+)'|import\(\s*'([^']+)'/g)) {
    const spec = m[1] ?? m[2]
    if (!spec || !spec.startsWith('.')) continue
    const r = norm(dir + '/' + spec)
    referenced.add(r)
    if (!/\.\w+$/.test(r)) { referenced.add(r + '.ts'); referenced.add(r + '/index.ts') }
  }
}
// scripts/ are entry points and have their own check above; mod.core.ts is the published surface.
const nameable = tracked.filter((f) => /^src\/.*\.ts$/.test(f) && !CONTENT_ADDRESSED.some((r) => r.test(f)))
// AND A PLAIN PATH MENTION COUNTS, which is not laziness. src/prove/emit.ts is invoked by scripts/fold.ts
// as `node -e "import('./src/prove/emit.ts').then(m => m.emit())"` — a dynamic import inside a shell string
// with escaped quotes, invisible to any import-specifier regex. It read as dead, and it is not. That is the
// FOURTH way this detector has been wrong, so the last word goes to the conservative test: if the path
// appears anywhere in any other tracked file, something names it. A false negative here leaves dead code;
// a false positive deletes working code, and those are not the same mistake.
// ONLY CODE COUNTS AS A MENTION. Counting any tracked file made this vacuous in the other direction:
// README.md says "Generated by src/prove/emit.ts", and mechanical.lean carries the same sentence in a
// header emit.ts itself writes — so the path was permanently "referenced" by prose about it, and the check
// could never flag anything. Prose describing a file is not a caller of it. The two failures bracket the
// right rule: a reference is the path appearing in something that RUNS.
const CODE = /\.(ts|vue|mjs)$/
const mentions = (f: string): boolean =>
  tracked.some((x) => x !== f && CODE.test(x) && stripComments(readFileSync(x, 'utf8')).includes(f))
const unnamed = nameable.filter((f) => !referenced.has(f) && !mentions(f))
if (unnamed.length) {
  for (const f of unnamed) console.log(`  ✗ ${f} — no tracked file imports it`)
  console.log(`\n✗ orphan-gate: ${unnamed.length} file(s) nothing imports. Check whether they are addressed by CONTENT`)
  console.log(`  before deleting anything — src/receipts holds the signed record under filenames computed at runtime.`)
  process.exit(1)
}
console.log(`\n✓ orphan-gate: every script reachable, every export named, every file named — ${tracked.length} tracked files read`)
console.log(`  (${nameable.length} src module(s) resolved through their importers; content-addressed paths exempt by rule, not by oversight)`)
