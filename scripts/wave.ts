#!/usr/bin/env node
// WAVE — read the instruments and say what the next wave is, so finishing one produces the next.
//
// Every wave this session followed the same shape: measure, find the largest TRACTABLE thing, do it, and let
// the new measurement name what follows. The weak link was always me choosing what to look at — and when I
// chose from memory rather than measurement I got it wrong eight times, most expensively by announcing "no
// hardcoded sets" from a grep for the three I remembered.
//
// So this does not decide anything. It reads the instruments already in place — the prover's refusal
// buckets, gates-fire's uncontrolled list, forensics, retire-lexical, the demand map, the fold — and prints
// what each currently reports as outstanding, with the number behind it and whether a mechanical path
// exists. Ranked by size within tractability, because a large intractable pile is not the next wave and a
// small tractable one is.
//
// It invents nothing. Every line traces to a script that can be run to check it.
import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { ledger, live, withdrawn, octave, leanTheorems } from '../src/api/index.ts'

const out = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }) } catch (e) {
    return String((e as { stdout?: string }).stdout ?? '')
  }
}

type Item = { n: number; tractable: boolean; what: string; how: string; source: string }
const items: Item[] = []

// ── the prover: what it cannot render, split by whether a mechanical path is known ──
const prover = out('node src/prove/index.ts')
const shapeBuckets = [...prover.matchAll(/^\s*(\d+)\s{2}(.+?)$/gm)]
  .map((m) => ({ n: Number(m[1]), label: m[2].trim() }))
  .filter((b) => b.n > 0 && !b.label.startsWith('e.g.'))
for (const b of shapeBuckets) {
  // a bucket is tractable when its label names a construct with a known Lean equivalent
  const tractable = /\b(loop|range|filter|map|fold|quantifier|push|accumul)/i.test(b.label)
    && !/recurrence|memois|closure|destructur|unbounded/i.test(b.label)
  items.push({ n: b.n, tractable, what: b.label.slice(0, 78), how: tractable
    ? 'extend src/prove/translate.ts with the shape, then emit + seal'
    : 'needs an author: the rendering requires judgement, which a mechanical translator must not supply',
    source: 'node src/prove/index.ts' })
}

// ── gates trusted only because they pass ──
const fire = out('node scripts/gates-fire.ts')
const uncontrolled = fire.match(/trusted only because they pass:\n\s*(.+)/)?.[1]?.trim().split(/\s+/) ?? []
if (uncontrolled.length) items.push({ n: uncontrolled.length, tractable: true,
  what: `release gates with no negative control: ${uncontrolled.slice(0, 8).join(' ')}${uncontrolled.length > 8 ? ' …' : ''}`,
  how: 'add a reversible mutation each must reject, to scripts/gates-fire.ts',
  source: 'node scripts/gates-fire.ts' })

// ── the record: what was withdrawn and never re-established ──
const led = ledger()
const orphanedClaims = withdrawn(led).filter((e) => !e.supersededBy)
const withNoProofYet = orphanedClaims.filter((e) => /not backed by a Lean proof/i.test(e.reason ?? ''))
items.push({ n: withNoProofYet.length, tractable: false,
  what: 'withdrawn claims with no Lean successor, whose reason is only that nobody proved them',
  how: 'reachable only where the claim is decidable finite arithmetic; the prover renders what it can and the rest need an author',
  source: 'node scripts/fold.ts' })

// ── demand the deposit does not answer ──
if (existsSync('src/demand/queries.json')) {
  const demand = JSON.parse(readFileSync('src/demand/queries.json', 'utf8')) as { topics: { topic: string; impressions: number }[] }
  const src = leanTheorems().map((t) => t.name + ' ' + t.statement).join(' ').toLowerCase()
  const uncovered = demand.topics.filter((t) => {
    const toks = t.topic.toLowerCase().match(/[a-z]{4,}/g) ?? []
    return toks.length >= 2 && !toks.some((x) => src.includes(x))
  })
  const top = uncovered.slice(0, 3).map((t) => `${t.topic.slice(0, 34)} (${t.impressions})`).join(', ')
  if (uncovered.length) items.push({ n: uncovered.length, tractable: false,
    what: `search topics no theorem answers — loudest: ${top}`,
    how: 'prove the ones that are decidable finite arithmetic; refuse the rest in writing, as demand2 did for the Weyl estimate',
    source: 'src/demand/queries.json' })
}

// ── the octave, which is a target and not a debt ──
const oct = octave(led)
if (!oct.exact) items.push({ n: 8 - oct.remainder, tractable: true,
  what: `theorems short of the next octave (${led.length} → ${(oct.octaves + 1) * 8})`,
  how: 'only ever as a side effect of work that earns them — never padded to reach the number',
  source: 'node scripts/forensics.ts' })

// ── what happened AFTER the push, which no instrument here used to look at ──
// Every other source in this file reads the tree. The conformance matrix was red for two weeks and the way
// it surfaced was the owner asking. A reader that only looks inward cannot see the half of the deposit that
// meets anyone else.
const ci = out('node scripts/ci-health.ts')
const ciFail = [...ci.matchAll(/^\s+(.+?) — (\d+) consecutive failure/gm)]
for (const m of ciFail) items.push({ n: Number(m[2]), tractable: true,
  what: `workflow red for ${m[2]} consecutive run(s): ${m[1]}`,
  how: 'read the failing log and fix the cause — a red workflow is the deposit failing in public',
  source: 'node scripts/ci-health.ts' })
const unseen = ci.match(/declared workflow\(s\) with no run/) ? (ci.match(/no run in the last \d+[\s\S]*?(?=\n\n|\n✓|\n✗)/)?.[0].split('\n').slice(1).map((l) => l.trim()).filter(Boolean) ?? []) : []
if (unseen.length) items.push({ n: unseen.length, tractable: false,
  what: `declared workflows with no recent run — unobserved, not green: ${unseen.join(', ').slice(0, 70)}`,
  how: 'trigger them, or accept that their state is unknown; publish fires on a release and trinity on a schedule',
  source: 'node scripts/ci-health.ts' })

// ── the artefacts, against what the tree says they are ──
const pub = out('node scripts/published.ts')
for (const m of pub.matchAll(/^\s+·\s+(\S+)\s+tree (\S+)\s+registry (\S+)\s+← differ/gm))
  items.push({ n: 1, tractable: false,
    what: `${m[1]} is ${m[2]} in the tree and ${m[3]} on the registry — and it is the registry copy the gates import`,
    how: 'the tree copy is not what runs; deciding which should be authoritative changes which gate this deposit uses',
    source: 'node scripts/published.ts' })
for (const m of pub.matchAll(/^\s+✗ live site\s+(.+)$/gm))
  items.push({ n: 1, tractable: true, what: `the live site does not serve this ledger: ${m[1].trim()}`,
    how: 'the deploy succeeded but the content is stale — rebuild and redeploy', source: 'node scripts/published.ts' })

items.sort((a, b) => Number(b.tractable) - Number(a.tractable) || b.n - a.n)

console.log(`wave — read from the instruments, ${new Date === undefined ? '' : ''}not chosen from memory\n`)
console.log(`  standing ${live(led).length} · withdrawn ${withdrawn(led).length} · ledger ${led.length}${oct.exact ? ` = ${oct.octaves} × 8 exact` : ''}\n`)
console.log('NEXT — tractable, largest first:')
for (const i of items.filter((x) => x.tractable)) {
  console.log(`  ${String(i.n).padStart(5)}  ${i.what}`)
  console.log(`         → ${i.how}`)
  console.log(`         · ${i.source}`)
}
console.log('\nSTANDING — measured, and not mechanical:')
for (const i of items.filter((x) => !x.tractable)) {
  console.log(`  ${String(i.n).padStart(5)}  ${i.what}`)
  console.log(`         → ${i.how}`)
}
console.log('\nEvery line above traces to the command beside it. Nothing here is a plan; it is a reading.')
