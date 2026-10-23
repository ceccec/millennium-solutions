#!/usr/bin/env node
// EXPLAIN — what a named thing is, from its Lean documentation and nothing else.
//
//   node scripts/explain.ts <name>
//
// The name is a theorem, or a Lean file (with or without .lean). The answer is the doc comment the Lean source
// carries for it, or the file's header. When the source carries no doc, the answer says so: this tool writes no
// prose of its own, so a missing doc is shown as missing rather than filled in.
import { all } from './leandoc.ts'

const name = (process.argv[2] ?? '').trim()
if (!name) {
  console.log(JSON.stringify({ status: 'NO NAME', why: 'give a theorem name or a Lean file name' }, null, 1))
  process.exit(1)
}
const bare = name.replace(/\.lean$/, '')
const docs = all()
const file = docs.find((d) => d.file === name || d.file === name + '.lean' || d.file === bare + '.lean')
if (file) {
  console.log(JSON.stringify({ status: 'FOUND', kind: 'file', file: file.file, title: file.title, wing: file.wing, explanation: file.summary || null,
    why: file.summary ? null : 'the file carries no header summary' }, null, 1))
  process.exit(0)
}
for (const d of docs) {
  const t = d.theorems.find((x) => x.name === name)
  if (t) {
    console.log(JSON.stringify({ status: 'FOUND', kind: 'theorem', file: d.file, theorem: t.name, explanation: t.doc || null, docFrom: t.docFrom,
      why: t.doc ? null : 'the theorem has no doc comment in its Lean source' }, null, 1))
    process.exit(0)
  }
}
console.log(JSON.stringify({ status: 'NOT FOUND', name, why: 'no Lean file or theorem has this name; nothing is explained from elsewhere' }, null, 1))
process.exit(1)
