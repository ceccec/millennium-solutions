/** ── WHAT THE LIVE SITE SERVES, AGAINST WHAT THE TREE HOLDS ────────────────────────────────────────────────
 *
 *  Every gate here reads the tree or the built `dist`. NONE reads what is actually SERVED. A deploy that
 *  failed, half-landed, or was served from a stale cache would leave every check in this repository green
 *  while a reader is handed numbers that no longer exist.
 *
 *  That is the layer question this deposit keeps arriving at from other directions: WHAT LAYER CAN OBSERVE
 *  THIS CLAIM. Whether the deploy landed is observable only from outside — hitsol-8d's harder case was 24
 *  local tests green against a path broken in production, because the emulator streamed inbound bodies where
 *  the platform buffered them. No local layer could see it. Neither can this one see a bad deploy.
 *
 *  REPORTS, never fails. The network is not this repository: an outage, a DNS blip or a CDN edge would make
 *  a gate red about something the tree did not do, and a build that fails on someone else's downtime teaches
 *  people to skip it. What it refuses to do is stay silent. */
import { theoremCount, live, ledger } from '../src/api/index.ts'

const SITE = 'https://ceccec.psg.bg/millennium-solutions/'
const tree = { theorems: theoremCount(), keys: live().length, ledger: ledger().length }

let html: string
try {
  const r = await fetch(SITE, { signal: AbortSignal.timeout(25_000) })
  if (!r.ok) { console.log(`○ deployed: ${SITE} answered ${r.status} — not compared, and NOT read as agreement`); process.exit(0) }
  html = await r.text()
} catch (e) {
  console.log(`○ deployed: ${SITE} unreachable (${String(e).slice(0, 60)}) — not compared.`)
  console.log(`  An unreachable site is not a passing one. This says nothing about the deploy either way.`)
  process.exit(0)
}

// Read the figures the page publishes about itself. A figure the page does not state is reported as ABSENT
// rather than as agreeing — the vacuous-zero shape this deposit has been bitten by four times.
const num = (re: RegExp): number | null => { const m = html.match(re); return m ? Number(m[1].replace(/,/g, '')) : null }
const served = {
  // ANCHORED, not first-match. `([\d,]+) theorems` matched "36 theorems" — a per-FILE count inside a
  // prior-art note — and reported a 533-vs-36 drift that was my regex, not the deploy. Fourth extractor
  // today narrower or looser than its subject. `N Lean theorems` appears once, in the footer, as the
  // site-wide figure.
  theorems: num(/([\d,]+) Lean theorems/),
  ledger: num(/([\d,]+) ledger entries/),
}

const rows: [string, number, number | null][] = [
  ['theorems', tree.theorems, served.theorems],
  ['ledger entries', tree.ledger, served.ledger],
]
let drift = 0, absent = 0
for (const [what, here, there] of rows) {
  if (there === null) { absent++; console.log(`  ○ ${what.padEnd(15)} tree ${here} · the page states no figure — absent, not agreeing`) }
  else if (there !== here) { drift++; console.log(`  ✗ ${what.padEnd(15)} tree ${here} · SERVED ${there} — the deploy is behind the tree, or did not land`) }
  else console.log(`  ✓ ${what.padEnd(15)} tree ${here} · served ${there}`)
}
console.log(drift
  ? `\n○ deployed: ${drift} figure(s) served differ from the tree — every local gate is green and a reader is`
    + `\n  being handed numbers this repository no longer holds. Reported, not failed: the fix is a deploy,`
    + `\n  not a code change, and the network is not this repository.`
  : absent
    ? `\n○ deployed: ${rows.length - absent} figure(s) agree, ${absent} not stated on the page`
    : `\n✓ deployed: the live site serves what the tree holds — ${rows.map(([w, h]) => `${w} ${h}`).join(' · ')}`)
