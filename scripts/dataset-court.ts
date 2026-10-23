#!/usr/bin/env node
// DATASET-COURT — a predicate over every value of a public dataset, tried by the court.
//
//   node scripts/dataset-court.ts <dataset.json> '<lean predicate in x>'
//
// The dataset is a JSON array of natural numbers. The tool writes the claim "every value satisfies the predicate" as a
// Lean proposition over the embedded values, and the court tries it: SEALED when the kernel decides it for the whole
// dataset, REFUSED when a value falsifies it, UNKNOWN or NOT TRIABLE otherwise. A court verdict covers the dataset
// it was given and nothing beyond it: a finite check is not a proof about an infinite set.
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const [file, predicate] = process.argv.slice(2)
if (!file || !predicate) { console.log(JSON.stringify({ verdict: 'NOT TRIABLE', why: 'usage: dataset-court.ts <dataset.json> <predicate>' })); process.exit(1) }
const values = JSON.parse(readFileSync(file, 'utf8')) as number[]
if (!Array.isArray(values) || !values.every((v) => Number.isSafeInteger(v) && v >= 0)) {
  console.log(JSON.stringify({ verdict: 'NOT TRIABLE', why: 'the dataset must be a JSON array of natural numbers' })); process.exit(1)
}
const claim = `[${values.join(', ')}].all (fun x => ${predicate}) = true`
const r = spawnSync('node', ['scripts/court-trial.ts'], { input: claim, encoding: 'utf8', cwd: new URL('..', import.meta.url).pathname, timeout: 900_000 })
const verdict = JSON.parse(r.stdout || '{}')
console.log(JSON.stringify({ dataset: file, values: values.length, claim, scope: 'this dataset only; a finite check is not a proof about an infinite set', ...verdict }, null, 1))
