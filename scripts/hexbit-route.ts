#!/usr/bin/env node
// HEXBIT-ROUTE — where a bit string goes. The handle family (qpu src/families/handle) says: a hexbit handle is 8 hex
// digits, equal handles address one folder, and the folder path is the handle's hex. So a string's content address
// (toUuid, the deposit's own) gives its handle, the first 8 hex, and the folder is that handle. The files that share the
// handle are the files inside the folder. Nothing is created: this is an index over the repository, computed on each call.
//
//   echo 'some bits' | node scripts/hexbit-route.ts          route the input to its folder and the files inside it
//   node scripts/hexbit-route.ts --index                     the whole index: every handle and the files under it
//
// Each file returned is checked: its content address is recomputed from its bytes and must carry the same handle, or the
// route is refused. The index covers src/proof/*.lean, the deposit's Lean sources.
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toUuid } from '../src/0/index.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const handleOf = (seed: string): string => toUuid(seed).replace(/-/g, '').slice(0, 8)

const files = readdirSync(join(ROOT, 'src/proof')).filter((f) => f.endsWith('.lean')).sort()
const index = new Map<string, string[]>()
for (const f of files) {
  const h = handleOf(readFileSync(join(ROOT, 'src/proof', f), 'utf8'))
  index.set(h, [...(index.get(h) ?? []), 'src/proof/' + f])
}

if (process.argv.includes('--index')) {
  const lines = [...index.entries()].sort((a, b) => b[1].length - a[1].length).map(([h, fs]) => `${h}  ${fs.length} file(s): ${fs.join(' ')}`)
  console.log(JSON.stringify({ folders: index.size, files: files.length, index: lines }, null, 1))
  process.exit(0)
}

const input = readFileSync(0, 'utf8')
const handle = handleOf(input)
const inside = index.get(handle) ?? []
// the check: every file the route returns must recompute to the same handle from its own bytes
const refused = inside.filter((f) => handleOf(readFileSync(join(ROOT, f), 'utf8')) !== handle)
const result = {
  input: input.slice(0, 80),
  uuid: toUuid(input),
  folder: handle,
  files: refused.length ? [] : inside,
  status: refused.length ? 'REFUSED: a file does not recompute to this handle' : inside.length ? 'ROUTED' : 'ROUTED to an empty folder: no repository file shares this handle',
}
console.log(JSON.stringify(result, null, 1))
process.exit(refused.length ? 1 : 0)
