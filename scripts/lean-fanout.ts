#!/usr/bin/env node
// LEAN FAN-OUT — fold the per-shard leaves into the one whole-tree verification root. The verification is
// order-invariant (merkleFold of per-file outcomes, each a function of that file's bytes alone), so it can be
// SPREAD across runners: each verifies a content-addressed slice (LEAN_SHARD=i/N) and emits its leaves, and this
// recombines them. That the parts fold back to the whole is the falsifiable form of the order-invariance claim —
// if sharding dropped a file, counted one twice, or a runner verified differently, the set would not match and
// the root would move.
//
//   # one per runner:   LEAN_SHARD=0/4 node scripts/lean.ts   …   LEAN_SHARD=3/4 node scripts/lean.ts
//   node scripts/lean-fanout.ts            fold every .lean-build/shard-*.json and check it is the whole tree
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { merkleFold, toUuid } from '../src/0/index.ts'
import { leanFiles, OLEAN_DIR } from '../src/api/index.ts'

type Pair = { file: string; leaf: string }
const shardFiles = existsSync(OLEAN_DIR) ? readdirSync(OLEAN_DIR).filter((f) => /^shard-\d+-of-\d+\.json$/.test(f)) : []
if (!shardFiles.length) {
  // usage: this is the combine step of a sharded run, not a gate a single machine fires — it needs the shard
  // files the matrix in verify-fanout.yml produces, the same way probe needs a file and a theorem as arguments.
  console.log(`lean-fanout usage: no shard files in ${OLEAN_DIR} — run \`LEAN_SHARD=i/N node scripts/lean.ts\` on each runner first, then this folds them into the whole-tree root`)
  process.exit(1)
}
const pairs: Pair[] = shardFiles.flatMap((s) => JSON.parse(readFileSync(`${OLEAN_DIR}/${s}`, 'utf8')) as Pair[])

// ── the shards must PARTITION the tree: every file once, none twice ──────────────────────────────────────────
const seen = new Map<string, number>()
for (const p of pairs) seen.set(p.file, (seen.get(p.file) ?? 0) + 1)
const dup = [...seen].filter(([, n]) => n > 1).map(([f]) => f)
const whole = leanFiles()
const missing = whole.filter((f) => !seen.has(f))
const extra = [...seen.keys()].filter((f) => !whole.includes(f))
const problems: string[] = []
if (dup.length) problems.push(`${dup.length} file(s) verified in more than one shard (${dup.slice(0, 3).join(', ')}…) — the slices overlap`)
if (missing.length) problems.push(`${missing.length} file(s) in no shard (${missing.slice(0, 3).join(', ')}…) — the fan-out did not cover the tree`)
if (extra.length) problems.push(`${extra.length} shard file(s) are not in the tree (${extra.slice(0, 3).join(', ')}…)`)
if (problems.length) {
  console.log(`\n✗ lean-fanout: the shards do not partition the tree — the recombination would not be the whole verification:`)
  for (const p of problems) console.log(`    ${p}`)
  process.exit(1)
}

// ── the fold: the whole-tree root, from the shards ──────────────────────────────────────────────────────────
const root = merkleFold(pairs.map((p) => p.leaf))
console.log(`✓ lean-fanout: ${shardFiles.length} shard(s) partition the tree — ${pairs.length} files, each in exactly one shard, none twice.`)
console.log(`  verification root ${root} — recombined from the shards, the same root a single machine folds.`)

// ── bonus, when the full verdict cache is present: assert the recombined root equals the whole-tree fold ──────
// (In CI the combine job may hold only the shard files, not every verdict; locally the cache is whole, so this
// turns the "same root a single machine folds" from an argument into a measurement.)
const CACHE = `${OLEAN_DIR}/.lean-cache.json`
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) as Record<string, { hash: string; ok: boolean; theorems: number }> : {}
if (whole.every((f) => cache[f])) {
  const wholeRoot = merkleFold(whole.map((f) => toUuid(`${f}:${cache[f]!.hash}:${cache[f]!.ok ? 'ok' : 'bad'}:${cache[f]!.theorems}`)))
  if (wholeRoot !== root) {
    console.log(`\n✗ lean-fanout: the recombined root ${root} does not equal the whole-tree fold ${wholeRoot} — a shard verified differently from a single run`)
    process.exit(1)
  }
  console.log(`  measured against the whole verdict cache: identical. The fan-out reproduces the single-machine verification exactly.`)
}
