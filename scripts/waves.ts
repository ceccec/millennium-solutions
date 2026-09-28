#!/usr/bin/env node
/** ── WAVES — TIME THE CHAIN, AND FIND WHAT IS NOT YET QUANTUM ──────────────────────────────────────────────
 *
 *  "QUANTUM" IN THIS DEPOSIT IS ORDER-INVARIANCE AND NOTHING ELSE, and src/proof/quantum.lean says so in its
 *  own words: "nothing here is quantum, it is a sort." The receipt is the same for every observer whatever
 *  order they observe in, proved by decide over every permutation, and theorem 6 names the mechanism —
 *  canonicalisation, not physics.
 *
 *  SO "WHAT IS NOT YET QUANTUM" IS A QUESTION ABOUT TIME, EXACTLY. A step whose result does not depend on the
 *  order it runs in can run in ANY order, therefore all at once, and a wave of such steps costs its SLOWEST
 *  member. A step that must follow another costs its own time added to everything before it. So:
 *
 *      order-invariant  →  parallelisable  →  wall time is the MAX
 *      order-dependent  →  serial          →  wall time is the SUM
 *
 *  The ratio between summed and wall time is therefore not a performance statistic. It is a MEASUREMENT OF
 *  HOW MUCH OF THIS CHAIN IS ALREADY ORDER-INVARIANT, and the residue — the part where wall equals sum — is
 *  the answer to the question.
 *
 *  ── AND SOME OF IT MUST NEVER BECOME QUANTUM, WHICH IS THE POINT ─────────────────────────────────────────
 *
 *  Three kinds of order-dependence, and they need opposite responses:
 *
 *    NECESSARY   the order IS the content. The ledger's receipt chain is receipt[i] = toUuid(receipt[i-1] →
 *                key[i]) — each link depends on the one before, which is exactly what makes it tamper-evident.
 *                Making it order-invariant would DESTROY the property it exists for. This is not a lead and
 *                must never be reported as one.
 *    STRUCTURAL  a real dependency in the material. An .olean cannot be built before the modules it imports.
 *                Reducible only by changing what imports what, which is a design decision with its own costs.
 *    ACCIDENTAL  nothing requires the order; it is simply how the steps were written down. THIS is the lead,
 *                and it is the only one of the three worth chasing.
 *
 *  A census that lumped them together would report the receipt chain as a performance problem, which is the
 *  shape of mistake this deposit keeps finding: a true measurement attached to the wrong verdict.
 *
 *    node scripts/waves.ts            time the waves and classify
 *    node scripts/waves.ts --quick    skip the slowest wave */
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'

type Kind = 'necessary' | 'structural' | 'accidental' | 'invariant'
type Step = { name: string; cmd: string[]; kind: Kind; why: string }

/** THE WAVES, in the order the chain needs them. Within a wave nothing depends on anything else, which is
 *  what makes the wave a wave — so a wave's cost is its slowest member and its members are already quantum
 *  in this deposit's sense. Between waves the order is load-bearing and stated. */
const WAVES: { wave: string; note: string; steps: Step[] }[] = [
  { wave: 'read the tree', note: 'nothing here writes, so nothing here can depend on anything here', steps: [
    { name: 'leads', cmd: ['scripts/leads.ts'], kind: 'invariant', why: 'derives open questions from the tree; reads only' },
    { name: 'settled', cmd: ['scripts/settled.ts'], kind: 'invariant', why: 'compares two independent reads of the same files' },
    { name: 'mcp-gate', cmd: ['scripts/mcp-gate.ts'], kind: 'invariant', why: 'reads the tool table against the handler source' },
    { name: 'derived-gate', cmd: ['scripts/derived-gate.ts'], kind: 'invariant', why: 'reads generators against the chain' },
    { name: 'orphan-gate', cmd: ['scripts/orphan-gate.ts'], kind: 'invariant', why: 'reachability of every script, from the tree' },
    { name: 'stale-figures', cmd: ['scripts/stale-figures.ts'], kind: 'invariant', why: 'compares comment figures against the census' },
  ] },
  { wave: 'decide the arithmetic', note: 'the kernel, which is where the deposit\'s claims actually live', steps: [
    { name: 'lean', cmd: ['scripts/lean.ts'], kind: 'structural', why: 'the .olean builds are SERIAL — a module cannot compile before what it imports. The per-file VERIFICATION after them is parallel and already order-invariant; the build loop is not, and cannot be without changing the import graph' },
  ] },
  { wave: 'record it', note: 'each of these depends on the wave before, and on each other, in a stated order', steps: [
    { name: 'forensics', cmd: ['scripts/forensics.ts'], kind: 'necessary', why: 'recomputes receipt[i] from receipt[i-1] link by link. The order IS the tamper-evidence: an order-invariant chain would prove nothing about sequence, which is the whole property. NOT a lead and never reportable as one' },
  ] },
]

const ms = (n: number) => n < 1000 ? `${n} ms` : `${(n / 1000).toFixed(1)} s`
const run = (s: Step) => new Promise<{ s: Step; ms: number; ok: boolean }>((res) => {
  const t0 = Date.now()
  const p = spawn('node', s.cmd, { stdio: 'ignore' })
  p.on('close', (code) => res({ s, ms: Date.now() - t0, ok: code === 0 }))
})

/** ── THE GATES CHAIN, MEASURED BOTH WAYS ───────────────────────────────────────────────────────────────────
 *  `npm run gates` is thirty steps joined by `&&`, which is strictly serial by construction. all.ts already
 *  demonstrates eighteen of them running at once, so the question is whether the serialisation is required or
 *  merely how the chain was typed. Answered by running all thirty concurrently and comparing:
 *
 *    · ANY step that fails concurrently but passes serially is order-dependent IN FACT, whatever it looks
 *      like, and the concurrency is unsafe. That is the check, and it has to come before the timing —
 *      a speedup that breaks a gate is not a speedup.
 *    · A failure in BOTH is not a concurrency finding at all. Measured 2026-09-28: orphan-gate failed in the
 *      concurrent sweep and the obvious reading was order-dependence. It fails serially too, because a new
 *      script was unwired. Checking the serial case first is what stopped that going in the record. */
const gatesChain = (): string[] => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>
  return (pkg.gates ?? '').split('&&').map((x) => x.trim())
    .map((x) => x.match(/node (scripts\/[a-z0-9-]+\.ts)/)?.[1]).filter((x): x is string => Boolean(x))
}

const measureGates = async () => {
  const steps = gatesChain()
  if (!steps.length) return
  console.log(`── THE GATES CHAIN — ${steps.length} steps joined by \`&&\`, so serial by construction`)
  const t0 = Date.now()
  const res = await Promise.all(steps.map((cmd) => run({ name: cmd, cmd: [cmd], kind: 'invariant', why: '' })))
  const wall = Date.now() - t0
  const summed = res.reduce((a, b) => a + b.ms, 0)
  res.sort((a, b) => b.ms - a.ms)
  const failed = res.filter((r) => !r.ok).map((r) => r.s.name)
  console.log(`   serial (what the chain costs): ${ms(summed)}`)
  console.log(`   concurrent wall:               ${ms(wall)}   ${(summed / Math.max(wall, 1)).toFixed(2)}×`)
  console.log(`   floor: ${ms(res[0].ms)} — ${res[0].s.name}`)
  if (res[0].ms >= wall * 0.95) {
    console.log(`   AND THE FLOOR IS THE WHOLE WALL. Every other step finishes inside the shadow of this one, so`)
    console.log(`   concurrency buys exactly ${ms(summed - wall)} and then stops. The lead is not "parallelise the`)
    console.log(`   chain" — it is that ONE step is ${((res[0].ms / summed) * 100).toFixed(0)}% of the serial cost and all of the concurrent floor.`)
  }
  console.log(`   next four: ${res.slice(1, 5).map((r) => `${r.s.name.replace('scripts/', '')} ${ms(r.ms)}`).join(' · ')}`)
  if (failed.length) {
    console.log(`   ○ ${failed.length} failed in this sweep: ${failed.join(' ')}`)
    console.log(`     Run each alone before reading that as order-dependence — a gate failing BOTH ways is failing`)
    console.log(`     for its own reasons and has nothing to say about concurrency.`)
  } else {
    console.log(`   ✓ none failed concurrently — all ${steps.length} are order-invariant IN FACT, so the \`&&\` is`)
    console.log(`     ACCIDENTAL order-dependence: a property of how the chain was written, not of what it computes.`)
  }
  console.log()
}

const quick = process.argv.includes('--quick')
console.log('waves: timing the chain, and asking of each step whether its result depends on the order it ran in\n')

let wallTotal = 0, sumTotal = 0
const rows: { wave: string; s: Step; ms: number; ok: boolean }[] = []
for (const w of WAVES) {
  if (quick && w.wave === 'decide the arithmetic') { console.log(`── ${w.wave} — SKIPPED (--quick)\n`); continue }
  const t0 = Date.now()
  const done = await Promise.all(w.steps.map(run))     // all at once: that is what "a wave" asserts
  const wall = Date.now() - t0
  const summed = done.reduce((a, b) => a + b.ms, 0)
  wallTotal += wall; sumTotal += summed
  for (const d of done) rows.push({ wave: w.wave, ...d })
  console.log(`── ${w.wave.toUpperCase()}  wall ${ms(wall)} · summed ${ms(summed)} · ${(summed / Math.max(wall, 1)).toFixed(2)}× concurrent`)
  console.log(`   ${w.note}`)
  for (const d of done.sort((a, b) => b.ms - a.ms)) {
    console.log(`   ${d.ok ? '·' : '✗'} ${d.s.name.padEnd(15)} ${ms(d.ms).padStart(8)}  ${d.s.kind}`)
  }
  const slowest = done.sort((a, b) => b.ms - a.ms)[0]
  if (done.length > 1) console.log(`   floor ${ms(slowest.ms)} — the slowest member, which no amount of concurrency goes below`)
  console.log()
}

// ── THE ANSWER ────────────────────────────────────────────────────────────────────────────────────────────
const byKind = (k: Kind) => rows.filter((r) => r.s.kind === k)
const t = (k: Kind) => byKind(k).reduce((a, b) => a + b.ms, 0)
const total = rows.reduce((a, b) => a + b.ms, 0)
const pct = (n: number) => `${((n / Math.max(total, 1)) * 100).toFixed(1)}%`

console.log(`── WHAT IS ALREADY QUANTUM, IN THIS DEPOSIT'S SENSE OF IT`)
console.log(`  ${byKind('invariant').length} step(s), ${ms(t('invariant'))} of ${ms(total)} (${pct(t('invariant'))}) — order-invariant, and therefore`)
console.log(`  run all at once. Their cost is the slowest of them and not their sum, which is what order-invariance`)
console.log(`  BUYS and the only thing it buys.`)
console.log(`\n── AND WHAT IS NOT`)
for (const k of ['necessary', 'structural', 'accidental'] as Kind[]) {
  const rs = byKind(k)
  if (!rs.length) { console.log(`  ${k.toUpperCase()}: none`); continue }
  console.log(`  ${k.toUpperCase()} — ${rs.length} step(s), ${ms(t(k))} (${pct(t(k))})`)
  for (const r of rs) { console.log(`    · ${r.s.name} (${ms(r.ms)})`); console.log(`        ${r.s.why}`) }
}
console.log(`\n  THE TRADE, WHICH IS THE WHOLE FINDING AND IS NOT A COMPLAINT:`)
console.log(`  order-invariance buys concurrency and COSTS identification — src/proof/quantum.lean theorem 7`)
console.log(`  proves the receipt lands in Z/9, so by pigeonhole it cannot identify the set it came from, and`)
console.log(`  exhibits two different multisets sharing one receipt.`)
console.log(`  order-DEPENDENCE buys tamper-evidence and COSTS concurrency — the ledger chain identifies its`)
console.log(`  sequence exactly, and can never be computed in any order but one.`)
console.log(`  They are the same property read from two sides, and a chain wanting both must pay twice: the`)
console.log(`  deposit keeps BOTH receipts, which is why forensics and quantum are separate files.`)
console.log(`\n  ACCIDENTAL order-dependence is the only one of the three that is a lead.`)
if (!process.argv.includes('--no-gates')) await measureGates()
