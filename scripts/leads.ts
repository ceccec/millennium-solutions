/** ── EVERY OPEN LEAD IN THIS REPOSITORY, DERIVED ──────────────────────────────────────────────────────────
 *
 *  "Leave no lead unfollowed" was a thing a session REMEMBERED. That is the same defect as a hand-written
 *  step list or a hand-kept attribution table: it works while someone is paying attention and drifts the
 *  moment they are not, and nothing says so. Every lead below is computed from the tree, so a lead that
 *  appears because of a commit shows up without anyone deciding to look for it.
 *
 *  This REPORTS. A lead is not a failure — it is work that has not been done, which is a different thing
 *  from work that is wrong, and gating a build on an open question would only teach people to close
 *  questions cheaply. What it refuses to do is let the list be silent. */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { homedir } from 'node:os'
import { execSync } from 'node:child_process'
import { leanFiles, leanSource, ledger, live, theoremCount } from '../src/api/index.ts'
import { uncontrolledRefusers, refusersNoChainRuns, unrunUndecided, runByChain, UNRUN_BY_DESIGN } from '../src/api/gates.ts'

type Lead = { area: string; n: number; what: string; how: string }
const leads: Lead[] = []
const add = (area: string, n: number, what: string, how: string) => { if (n > 0) leads.push({ area, n, what, how }) }

// ── 1 · REFUSING SCRIPTS WITH NO NEGATIVE CONTROL ────────────────────────────────────────────────────────
// A gate nobody has shown can go from green to red is a gate whose next regression is silent.
const refusing = uncontrolledRefusers()
add('controls', refusing.length, `script(s) that REFUSE but have never been shown to fail: ${refusing.sort().join(' ')}`,
  'add a control to scripts/gates-fire.ts, or name it uncontrolled there with the reason')

// ── 1b · GATES THAT REFUSE AND THAT NOTHING RUNS ─────────────────────────────────────────────────────────
// The involution of lead 1. A gate with no control may be silently broken; a gate no chain runs protects
// nothing at all, however well controlled. `seo` sat in this state with a real defect — the deposit's paper
// carried zero <h1> — until a probe ran it by accident.
const unrun = unrunUndecided()
const decided = refusersNoChainRuns().length - unrun.length
add('unrun', unrun.length, `gate(s) that refuse, that no chain runs, and that nobody has decided about: ${unrun.join(' ')}`,
  'wire it into a chain, or record WHY not in UNRUN_BY_DESIGN — an absence nobody decided is indistinguishable from an oversight')
if (decided) console.log(`  (${decided} further gate(s) are unrun BY RECORDED DECISION — network, generator, or report-by-design — and are not leads)\n`)

// THE EXEMPTION LIST NEEDS ITS OWN GUARD. UNRUN_BY_DESIGN records WHY a gate is absent from every chain.
// The moment one is wired in, its recorded reason becomes false — and a stale exemption is worse than none,
// because it reads as a decision someone is still standing behind. Derived: an entry naming a gate that a
// chain now runs, or a script that no longer exists, is itself a lead.
{
  const run = runByChain()
  const stale = Object.keys(UNRUN_BY_DESIGN).filter((g) => run.has(g) || !existsSync(`scripts/${g}.ts`))
  add('exemptions', stale.length, `UNRUN_BY_DESIGN entr(y/ies) that no longer describe the tree: ${stale.join(' ')}`,
    'the gate is wired now, or gone — delete the exemption rather than leaving a reason nobody holds')
}

// ── 2 · SOURCES WHOSE PRIOR ART HAS NEVER BEEN SEARCHED ──────────────────────────────────────────────────
const unsearched = leanFiles().filter((f) => {
  const m = leanSource(f).match(/^-- prior_art: (\w[\w-]*)/m)
  return !m || m[1] === 'unclassified'
})
add('prior art', unsearched.length, `source file(s) with no prior-art search: ${unsearched.join(' ')}`,
  'search, then record the result in the file frontmatter and run npm run priorart:gen')

// ── 3 · PEER MANIFESTS ON DISK THAT THE CROSS-REPO JOIN DOES NOT READ ────────────────────────────────────
const xrepo = existsSync('scripts/xrepo.ts') ? readFileSync('scripts/xrepo.ts', 'utf8') : ''
const candidates = [`${homedir()}/.erpax/fusion`]
const unjoined: string[] = []
for (const dir of candidates) {
  if (!existsSync(dir)) continue
  for (const f of readdirSync(dir)) {
    if (!/\.(json|jsonl)$/.test(f)) continue
    if (xrepo.includes(f)) continue
    // A LEAD MUST BE A LEAD. Flagging every file in the directory listed metrics dumps and a Zenodo record
    // beside real statement manifests — noise in a report is how a report stops being read, which is the
    // same failure as the constants-gate that was right once in thirty-nine. So the file is opened and must
    // actually carry claims before it is called an unjoined corpus.
    let carriesClaims = false
    try {
      const head = readFileSync(`${dir}/${f}`, 'utf8').slice(0, 4000)
      const first = f.endsWith('.jsonl') ? JSON.parse(head.split('\n')[0]) : JSON.parse(head.trim().replace(/,\s*$/, '') + (head.trim().endsWith('}') ? '' : '}'))
      const probe = Array.isArray(first) ? first[0] : (first.rows?.[0] ?? first.statements?.[0] ?? first.results?.[0] ?? first)
      carriesClaims = Boolean(probe && (probe.claim ?? probe.statement))
    } catch { carriesClaims = /"(claim|statement)"\s*:/.test(readFileSync(`${dir}/${f}`, 'utf8').slice(0, 4000)) }
    if (carriesClaims) unjoined.push(`${dir}/${f}`)
  }
}
add('cross-repo', unjoined.length, `peer manifest(s) present but not joined: ${unjoined.join(' ')}`,
  'add to SOURCES in scripts/xrepo.ts after checking the pins reproduce')

// ── 4 · LEDGER ADDRESSES WITH NOTHING BEHIND THEM, AND STATEMENTS WITH NO ADDRESS ────────────────────────
const l = ledger()
const orphanHeirs = l.filter((e) => e.revoked && e.supersededBy && !l.some((x) => x.key === e.supersededBy))
add('ledger', orphanHeirs.length, `withdrawn entr(y/ies) carried to an heir key that is not in the ledger`,
  'the heir must exist and stand; a carried claim pointing at nothing is worse than a withdrawn one')

// ── 5 · FIGURES THAT MOVED, AND COMMANDS QUOTED AS EXAMPLES ──────────────────────────────────────────────
// Both are REPORTS in their own scripts, which means their findings can sit unread indefinitely.
const quiet = (cmd: string, re: RegExp): number => {
  try { const o = execSync(cmd, { stdio: 'pipe' }).toString(); const m = o.match(re); return m ? Number(m[1]) : 0 }
  catch (e: any) { const o = String(e?.stdout ?? ''); const m = o.match(re); return m ? Number(m[1]) : 0 }
}
add('figures', quiet('node scripts/stale-figures.ts', /○ stale-figures: (\d+) figure/),
  'figure(s) in comments claim a present that has moved', 'npm run stale-figures — each is either stale or a record of the past')

// ── 6 · THE DOI QUEUE, AND WHETHER ANYTHING IS MINTED ────────────────────────────────────────────────────
const deps = existsSync('.zenodo/theorems') ? readdirSync('.zenodo/theorems').filter((f) => f.endsWith('.json')) : []
const minted = deps.filter((f) => { try { return Boolean(JSON.parse(readFileSync(`.zenodo/theorems/${f}`, 'utf8')).doi) } catch { return false } })
add('deposit', deps.length - minted.length, `deposition(s) staged and not minted (${minted.length} minted)`,
  'blocked on a Zenodo token with deposit:write and deposit:actions — the depositor\'s to create, not this session\'s')

// ── REPORT ───────────────────────────────────────────────────────────────────────────────────────────────
console.log('open leads, derived from the tree:\n')
if (!leads.length) console.log('  none — every derived lead is closed')
for (const L of leads.sort((a, b) => b.n - a.n)) {
  console.log(`  ${String(L.n).padStart(4)}  ${L.area.padEnd(11)} ${L.what}`)
  console.log(`        → ${L.how}`)
}
console.log(`\n○ leads: ${leads.length} open area(s), ${leads.reduce((a, b) => a + b.n, 0)} item(s).`)
console.log(`  ${theoremCount()} theorems · ${live().length} live keys · ${l.length} ledger entries.`)
console.log(`  Reports and does not fail: an open question is work not done, which is not the same as work`)
console.log(`  that is wrong, and a build that failed on open questions would teach cheap answers.`)
