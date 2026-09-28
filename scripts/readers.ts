#!/usr/bin/env node
/** ── READERS — every scientific and medical source, proven against an answer already known ─────────────────
 *
 *  The registry is src/readers/index.ts and holds no fetch. This file does the asking, in the three outcomes
 *  scripts/sources.ts established and for the reason it gives: a broken reader does not announce itself, it
 *  returns nothing and reads as "found nothing".
 *
 *    PROVEN        it answered, and with the fact already known — its results may be used
 *    WRONG         it answered, and not with that fact. The reader is broken, OR the fact I expected is not a
 *                  fact. Either way nothing it says today is evidence about anything but itself. THIS FAILS.
 *    NOT MEASURED  it did not answer. Nothing concluded. Silence is not absence, and no investigation may
 *                  report "found nothing" from a source that said nothing.
 *
 *  WRONG IS THE INTERESTING VERDICT AND IT ACCUSES ME FIRST. Several of these expectations are values I
 *  recalled rather than looked up, and scripts/sources.ts already records what that costs twice over — a probe
 *  asking Crossref for a Zenodo DOI, and one naming an identifier that does not exist. So a WRONG here is read
 *  as a claim about my recollection until the service is shown to be at fault, never the other way round.
 *
 *  NETWORK, AND THEREFORE NOT IN ANY BUILD CHAIN. A chain that ran this would turn an outage at EMBL-EBI or
 *  NCBI into a failed build about THIS tree, which is the false negative this deposit refuses everywhere else.
 *  It is the check to run BEFORE believing an investigation, and src/api/gates.ts records that decision.
 *
 *    node scripts/readers.ts                 probe every readable source
 *    node scripts/readers.ts --domain herbal only one domain
 *    node scripts/readers.ts --list          the registry, with boundaries, no network */
import { READERS, PROBEABLE, GATED, DOMAINS } from '../src/readers/index.ts'

const arg = (f: string) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : null }
const only = arg('--domain')
const UA = { 'User-Agent': 'millennium-solutions/readers (+https://ceccec.psg.bg/millennium-solutions/; read-only, citation checking)' }

if (process.argv.includes('--list')) {
  console.log(`readers: ${READERS.length} source(s) over ${DOMAINS.length} domain(s) — ${PROBEABLE.length} readable, ${GATED.length} behind a credential or licence\n`)
  for (const d of DOMAINS) {
    console.log(`── ${d.toUpperCase()}`)
    for (const r of READERS.filter((x) => x.domain === d)) {
      console.log(`   ${r.url ? '·' : '○'} ${r.source}${r.url ? '' : '  (no anonymous endpoint — recorded, not omitted)'}`)
      console.log(`       ${r.attribution}`)
      console.log(`       FOR      ${r.for}`)
      console.log(`       NOT FOR  ${r.notFor}`)
    }
  }
  console.log('\nEvery source above belongs to somebody else and is credited. None of them is consulted for advice:')
  console.log('this deposit cites literature and resolves names. It does not tell anyone what to do about a body.')
  process.exit(0)
}

type Verdict = 'PROVEN' | 'WRONG' | 'NOT MEASURED'
const ask = async (r: typeof PROBEABLE[number]): Promise<{ source: string; domain: string; verdict: Verdict; detail: string }> => {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), 20_000)
  try {
    // POST WHERE THE SOURCE ONLY ANSWERS TO ONE. Open Targets is GraphQL: a GET-only prober could not ask it
    // anything, so it was absent from this registry — not because it is unreachable, but because this file
    // could not phrase the question. A framework's shape deciding which sources "exist" is how a gap in
    // coverage comes to read as a finding about the world.
    const init: RequestInit = r.method === 'POST'
      ? { method: 'POST', headers: { ...UA, 'content-type': 'application/json' }, body: r.body ?? '', signal: ctl.signal, redirect: 'follow' }
      : { headers: UA, signal: ctl.signal, redirect: 'follow' }
    const res = await fetch(r.url!, init)
    const body = await res.text()
    if (!res.ok) return { source: r.source, domain: r.domain, verdict: 'NOT MEASURED', detail: `HTTP ${res.status} — a status is not an answer` }
    return r.expect!(body)
      ? { source: r.source, domain: r.domain, verdict: 'PROVEN', detail: `HTTP ${res.status}, ${body.length} byte(s), and the known fact is present` }
      : { source: r.source, domain: r.domain, verdict: 'WRONG', detail: `HTTP ${res.status}, ${body.length} byte(s), and the known fact is ABSENT — the reader or my expectation is broken: ${body.slice(0, 110).replace(/\s+/g, ' ')}` }
  } catch (e) {
    // ── "fetch failed" IS NOT A DIAGNOSIS, AND IT HID A REAL ONE FOR TWO RUNS ───────────────────────────────
    // node's fetch reports every transport failure as the same two words and puts the reason in `cause`,
    // which this threw away. World Flora Online came back NOT MEASURED twice, hours apart, and the honest
    // reading of that line was "one run, one network". It was neither: the service answers curl in 0.65s with
    // HTTP 200, and node refuses it with UNABLE_TO_VERIFY_LEAF_SIGNATURE because the server sends an
    // INCOMPLETE CERTIFICATE CHAIN — no intermediate. curl accepts it from the system trust store; node's
    // bundled store correctly does not.
    //
    // That is a fact about the SOURCE, and it was being reported as a fact about the weather. A reader seeing
    // "fetch failed" concludes the service is down and moves on; the truth is that it is up and misconfigured,
    // which somebody can act on. The cause chain is unwrapped and named now.
    //
    // NOT WORKED AROUND. Running node with --use-system-ca would make this pass, and hide a real defect in
    // somebody else's deployment behind a flag in mine. Disabling verification would be worse. The verdict
    // stays NOT MEASURED, which is correct — nothing was measured — and it now says why.
    const m = e instanceof Error ? e.message : String(e)
    const causes: string[] = []
    let c: unknown = (e as { cause?: unknown }).cause
    for (let d = 0; c && d < 4; d++) {
      const cc = c as { code?: string; message?: string; cause?: unknown }
      if (cc.code || cc.message) causes.push([cc.code, cc.message].filter(Boolean).join(': '))
      c = cc.cause
    }
    const why = causes.length ? causes.join(' ← ') : m
    const tls = /CERT|SIGNATURE|SSL|TLS/i.test(why)
    return { source: r.source, domain: r.domain, verdict: 'NOT MEASURED',
      detail: /abort/i.test(m) ? 'timed out at 20s — inconclusive, never "blocked"'
        : tls ? `${why.slice(0, 130)} — the SOURCE's certificate chain, not this network. It is up and misconfigured, which is not the same as down`
        : why.slice(0, 130) }
  } finally { clearTimeout(t) }
}

const targets = PROBEABLE.filter((r) => !only || r.domain === only)
if (!targets.length) { console.log(`readers: no readable source in domain "${only}" — domains are ${DOMAINS.join(' ')}`); process.exit(1) }

// ASKED AT ONCE. They are independent, and asking in turn only teaches stopping at the first failure — the
// interesting answer is WHICH source is unreliable today, not that one was.
const rows = await Promise.all(targets.map(ask))
const proven = rows.filter((r) => r.verdict === 'PROVEN')
const wrong = rows.filter((r) => r.verdict === 'WRONG')
const unmeasured = rows.filter((r) => r.verdict === 'NOT MEASURED')

console.log(`readers: ${rows.length} source(s) asked${only ? ` in ${only}` : ''} · ${proven.length} PROVEN · ${wrong.length} WRONG · ${unmeasured.length} NOT MEASURED\n`)
for (const d of DOMAINS) {
  const inD = rows.filter((r) => r.domain === d)
  if (!inD.length) continue
  console.log(`── ${d}`)
  for (const r of inD) console.log(`   ${r.verdict === 'PROVEN' ? '✓' : r.verdict === 'WRONG' ? '✗' : '○'} ${r.source.padEnd(20)} ${r.verdict.padEnd(13)} ${r.detail}`)
}
const gatedIn = GATED.filter((r) => !only || r.domain === only)
if (gatedIn.length) {
  console.log(`\n○ ${gatedIn.length} source(s) cannot be read anonymously and are NOT counted as failures:`)
  for (const r of gatedIn) console.log(`   ${r.source.padEnd(20)} ${r.why}`)
  console.log('  Each is a real gap in coverage. Named here so that "we found nothing" is never read as "there is nothing".')
}
console.log('\n  Every source is credited in src/readers/index.ts and none is consulted for advice. A citation index')
console.log('  answers who published what; it does not say whether anything is true, and for the herbal sources a')
console.log('  documented traditional use is an anthropological fact rather than evidence that the use works.')
if (unmeasured.length) console.log(`\n  NOT MEASURED is not a failure of this deposit and not a finding about any source's reliability — it is one run, on one network, today.`)
if (wrong.length) {
  console.log(`\n✗ readers: ${wrong.length} source(s) answered WITHOUT the fact known in advance. Until each is resolved,`)
  console.log(`  nothing read from it is evidence about anything but the reader — and the first hypothesis is that MY`)
  console.log(`  expectation is wrong, not that the service is.`)
  process.exit(1)
}
console.log(`\n✓ readers: every source that answered answered correctly — ${proven.length} proven against a fact known before asking`)
