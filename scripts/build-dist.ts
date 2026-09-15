// THE PUBLISHED PACKAGE IS WHAT A USER CAN IMPORT. Until this existed, `exports` pointed at mod.core.ts: Node refuses to
// strip types under node_modules (ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING), so `import` and `require` both failed and
// TypeScript raised eleven errors — nobody could use the package at all. This compiles the entry and everything it
// reaches into dist/ as plain ES modules with declarations, then refuses to finish unless the compiled toUuid agrees
// with the source's on the same input: a build that changed an address would be a different package with our name on it.
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

rmSync('dist', { recursive: true, force: true })
execFileSync(join('node_modules', '.bin', 'tsc'), ['-p', 'tsconfig.dist.json'], { stdio: 'inherit' })

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
