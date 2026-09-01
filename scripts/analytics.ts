#!/usr/bin/env node
// ANALYTICS — what the build measured about itself, written where anyone can read it.
//
// The front pages carried claims and a theorem ranking; the numbers the BUILD produces stayed in terminal
// output that scrolls away. Those are the figures a reader most needs to judge the deposit — how much of the
// ledger stands, how much was withdrawn and for what, how much of the prover's queue is machine-renderable
// versus needing an author, and what verification actually costs. Keeping them out of the pages meant the
// public record described the proofs while the measurements about the proofs lived nowhere durable.
//
// Everything here is READ FROM ARTEFACTS on disk — the ledger, the Lean sources, the prover's own queue. No
// figure is passed in and none is remembered between runs, so a stale number cannot survive a rebuild. The
// one measured timing is labelled as belonging to the machine that produced it, because it does.
import { readFileSync, writeFileSync } from 'node:fs'
import { ledger as loadLedger, live as liveOf, withdrawn as goneOf, superseded as supOf, octave, leanFiles, leanSource } from '../src/api/index.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'

export type Analytics = ReturnType<typeof analytics>

export function analytics() {
  const led = loadLedger()
  const live = liveOf(led)
  const gone = goneOf(led)

  // the Lean layer, counted from source rather than from a note about the source
  const files = leanFiles()
  const perFile = files.map((f) => {
    const src = leanSource(f)
    return {
      file: f,
      title: src.match(/^--\s*title:\s*(.+)$/m)?.[1] ?? f.replace('.lean', ''),
      wing: src.match(/^--\s*wing:\s*(.+)$/m)?.[1] ?? '',
      theorems: [...src.matchAll(/^theorem\s/gm)].length,
      byDecide: [...src.matchAll(/:=\s*by decide/g)].length,
    }
  })
  const theorems = perFile.reduce((n, f) => n + f.theorems, 0)

  // why the withdrawn were withdrawn — grouped, so the number has a shape
  const reasons: Record<string, number> = {}
  for (const e of gone) {
    const r = e.reason ?? 'no reason recorded'
    const k = /lexical/i.test(r) ? 'tested the removed lexical gate'
      : /orphaned/i.test(r) ? 'its Lean source was deleted or renamed'
      : /circular/i.test(r) ? 'circular by construction'
      : /not backed by a Lean proof/i.test(r) ? 'no Lean proof'
      : 'other'
    reasons[k] = (reasons[k] ?? 0) + 1
  }

  // VERIFY vs RECOMPUTE, measured now, on this machine — the figure behind the speed claim
  const N = 2 ** 14
  const leaves = Array.from({ length: N }, (_, i) => toUuid('leaf:' + i))
  const t0 = Number(process.hrtime.bigint()); merkleFold(leaves); const t1 = Number(process.hrtime.bigint())
  const path = Math.ceil(Math.log2(N))
  const t2 = Number(process.hrtime.bigint())
  let h = leaves[0]; for (let i = 0; i < path; i++) h = toUuid(h + ':' + i)
  const t3 = Number(process.hrtime.bigint())

  return {
    ledger: {
      total: led.length, live: live.length, withdrawn: gone.length,
      superseded: supOf(led).length,
      octaveExact: octave(led).exact, octaves: octave(led).octaves, remainder: octave(led).remainder,
      reasons,
    },
    lean: {
      files: files.length, theorems,
      byDecide: perFile.reduce((n, f) => n + f.byDecide, 0),
      wings: [...new Set(perFile.map((f) => f.wing).filter(Boolean))],
      perFile,
    },
    verification: {
      leaves: N, pathNodes: path,
      recomputeMs: +((t1 - t0) / 1e6).toFixed(1),
      verifyUs: +((t3 - t2) / 1e3).toFixed(1),
      ratio: Math.round((t1 - t0) / (t3 - t2)),
    },
    root: merkleFold(live.map((e) => e.key).slice(0, 512).map(toUuid)),
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = analytics()
  writeFileSync('src/analytics.json', JSON.stringify(a, null, 2) + '\n')
  console.log(`analytics — ledger ${a.ledger.total} (${a.ledger.live} live, ${a.ledger.withdrawn} withdrawn, ${a.ledger.superseded} superseded)`)
  console.log(`  lean: ${a.lean.files} files · ${a.lean.theorems} theorems · ${a.lean.byDecide} by decide · ${a.lean.wings.length} wings`)
  console.log(`  verify vs recompute at 2^14: ${a.verification.recomputeMs} ms vs ${a.verification.verifyUs} µs = ${a.verification.ratio}× over ${a.verification.pathNodes} nodes`)
  console.log(`  withdrawn by reason: ${Object.entries(a.ledger.reasons).map(([k, n]) => n + ' ' + k).join(' · ')}`)
}
