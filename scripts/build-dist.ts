// THE PUBLISHED PACKAGE IS WHAT A USER CAN IMPORT. Until this existed, `exports` pointed at mod.core.ts: Node refuses to
// strip types under node_modules (ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING), so `import` and `require` both failed and
// TypeScript raised eleven errors — nobody could use the package at all. This compiles the entry and everything it
// reaches into dist/ as plain ES modules with declarations, then refuses to finish unless the compiled toUuid agrees
// with the source's on the same input: a build that changed an address would be a different package with our name on it.
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, rmSync, statSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

rmSync('dist', { recursive: true, force: true })
execFileSync(join('node_modules', '.bin', 'tsc'), ['-p', 'tsconfig.dist.json'], { stdio: 'inherit' })
// ── AND THE MCP ENTRY, UNDER ITS OWN CONFIG, FOR A REASON WORTH KEEPING ──────────────────────────────────
// tsconfig.dist.json declares NO node types, and that is load-bearing rather than an oversight: nothing in
// the published core reaches a node builtin, so the absence of those types is a standing CHECK on it. The
// moment the MCP stdio loop was written inside src/mcp/serve.ts the build refused it, which is exactly what
// should happen. Putting `types: ["node"]` into the shared config to make that go away would have removed the
// check for every module at once to buy one file a `process`. So the transport has its own config and is the
// only file in it: mcp.bin.ts may know it is a process, and if anything under src/ ever needs to, the core
// build says so instead of a reviewer having to notice.
execFileSync(join('node_modules', '.bin', 'tsc'), ['-p', 'tsconfig.mcp.json'], { stdio: 'inherit' })

// ── AND THE LEDGER TRAVELS WITH IT ───────────────────────────────────────────────────────────────────────
// The four evidence tools measure src/proof/discovered.json, and the package did not carry it — so the
// deposit's own evidence was the one artefact a stranger could not examine, which is the worst place for a
// publication gap to sit. Copied rather than imported: it is data, tsc has no business with it, and the MCP
// entry reads it from beside itself. Nothing is transformed on the way, so the bytes a reader checks are the
// bytes this repository sealed — a re-serialisation would change the file while changing nothing in it, and
// then no receipt computed from the copy would be comparable to one computed here.
{
  const from = join('src', 'proof', 'discovered.json')
  if (existsSync(from)) {
    mkdirSync(join('dist', 'data'), { recursive: true })
    copyFileSync(from, join('dist', 'data', 'discovered.json'))
    const n = (JSON.parse(readFileSync(from, 'utf8')) as unknown[]).length
    console.log(`  · ledger shipped: ${n} entries → dist/data/discovered.json (the evidence tools work from the package)`)
  }
  // AND THE FORMULA CATALOGUE, so `formulas` is reachable from an install. Copied, not re-serialised: the
  // site publishes this file and scripts/e2e.ts checks what a reader opens against it, so the bytes a caller
  // gets here are the bytes the site serves — re-emitting them would create a second source of one truth.
  const fj = join('public', 'formulas.jsonld')
  if (existsSync(fj)) {
    mkdirSync(join('dist', 'data'), { recursive: true })
    copyFileSync(fj, join('dist', 'data', 'formulas.jsonld'))
    const n = (JSON.parse(readFileSync(fj, 'utf8')) as { numberOfItems?: number }).numberOfItems ?? 0
    console.log(`  · formulas shipped: ${n} items → dist/data/formulas.jsonld`)
  } else {
    console.log('  ○ no ledger at src/proof/discovered.json — the published MCP entry will report it ABSENT, not zero')
  }
}

// tsc rewrites `.ts` specifiers in the JavaScript it emits but not in the declarations; a consumer's checker resolves
// `./x.js` to `./x.d.ts`, so the declarations are given the same specifiers the JavaScript has.
const walk = (d: string): string[] => readdirSync(d).flatMap((e) => { const p = join(d, e); return statSync(p).isDirectory() ? walk(p) : [p] })
let fixed = 0
for (const f of walk('dist').filter((p) => p.endsWith('.d.ts'))) {
  const src = readFileSync(f, 'utf8')
  const out = src.replace(/(from\s+['"]\.{1,2}\/[^'"]+)\.ts(['"])/g, '$1.js$2')
  if (out !== src) { writeFileSync(f, out); fixed += 1 }
}

const built = await import(pathToFileURL(join(process.cwd(), 'dist', 'mod.core.js')).href)
const source = await import(pathToFileURL(join(process.cwd(), 'mod.core.ts')).href)
const probe = 'uuidna'
if (built.toUuid(probe) !== source.toUuid(probe)) throw new Error(`dist/ disagrees with the source: toUuid(${probe}) = ${built.toUuid(probe)} against ${source.toUuid(probe)}`)
const names = Object.keys(built).sort().join(',')
if (names !== Object.keys(source).sort().join(',')) throw new Error('dist/ exports a different set of names than mod.core.ts')
const files = walk('dist')
console.log(`✓ dist: ${files.filter((f) => f.endsWith('.js')).length} modules + ${files.filter((f) => f.endsWith('.d.ts')).length} declarations (${fixed} declaration specifier file(s) rewritten) · ${Object.keys(built).length} exports · toUuid agrees with the source`)
