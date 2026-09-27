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
import { readFileSync, readdirSync, existsSync} from 'node:fs'
import { NEEDS as MCP_NEEDS, TOOLS as MCP_TOOLS, SELF_SUFFICIENT } from '../src/mcp/index.ts'
import { SERVED_WITH_LEDGER as SERVED_BY_PACKAGE } from '../src/mcp/serve.ts'
const TOOL_NAMES = MCP_TOOLS.map((t) => t.name)
import { homedir } from 'node:os'
import { execSync } from 'node:child_process'
import { leanFiles, leanSource, ledger, live, theoremCount } from '../src/api/index.ts'
import { uncontrolledRefusers, refusersNoChainRuns, unrunUndecided, runByChain, UNRUN_BY_DESIGN } from '../src/api/gates.ts'

type Lead = { area: string; n: number; what: string; how: string; causes: Cause[] }

/** ── CROSSING THE LEADS ────────────────────────────────────────────────────────────────────────────────────
 *  A list of leads is a list of chores. The same leads grouped by WHY they are open is something else: two
 *  leads sharing a cause are one problem with two faces, and the cause is a lead nobody entered — it is
 *  derived from the crossing. This is scripts/coils.ts applied to this file's own output: there, expressions
 *  with the same extension form a coil and the cross-domain ones are the load-bearing ones; here, leads with
 *  a shared cause form a crossing, and a crossing that spans two AREAS is the one worth acting on, because
 *  fixing the cause moves both.
 *
 *  The cause vocabulary is deliberately small. A cause per lead would cross nothing, which is the failure mode
 *  of every taxonomy invented to make a report look organised. */
type Cause = 'publication' | 'authority' | 'instrument' | 'derivation' | 'environment'
const CAUSES: Record<Cause, string> = {
  publication: 'the surface a stranger receives is narrower than the tree — work exists here and does not reach them',
  authority: 'it needs an act only the depositor can perform: a credential, a token, a signature',
  instrument: 'the check does not exist, or its domain is narrower than the defect it is named for',
  derivation: 'a value that should be computed is kept by hand, so it drifts and ships',
  environment: 'it depends on something outside this repository: a network, a toolchain, another session',
}
const leads: Lead[] = []
const add = (area: string, n: number, what: string, how: string, causes: Cause[] = []) => {
  if (n > 0) leads.push({ area, n, what, how, causes })
}

// ── 1 · REFUSING SCRIPTS WITH NO NEGATIVE CONTROL ────────────────────────────────────────────────────────
// A gate nobody has shown can go from green to red is a gate whose next regression is silent.
const refusing = uncontrolledRefusers()
add('controls', refusing.length, `script(s) that REFUSE but have never been shown to fail: ${refusing.sort().join(' ')}`,
  'add a control to scripts/gates-fire.ts, or name it uncontrolled there with the reason', ['instrument'])

// ── 1b · GATES THAT REFUSE AND THAT NOTHING RUNS ─────────────────────────────────────────────────────────
// The involution of lead 1. A gate with no control may be silently broken; a gate no chain runs protects
// nothing at all, however well controlled. `seo` sat in this state with a real defect — the deposit's paper
// carried zero <h1> — until a probe ran it by accident.
const unrun = unrunUndecided()
const decided = refusersNoChainRuns().length - unrun.length
add('unrun', unrun.length, `gate(s) that refuse, that no chain runs, and that nobody has decided about: ${unrun.join(' ')}`,
  'wire it into a chain, or record WHY not in UNRUN_BY_DESIGN — an absence nobody decided is indistinguishable from an oversight', ['instrument'])
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
// UNSEARCHED, not merely unclassified. A file may be kind 1 — claiming nothing — because nobody looked, or
// because a search WAS run and the taxonomy has no row for what it found. priorart.lean is the second: the
// practice of recording attribution is long-established prior art (PROV-O, DataCite, Dublin Core, PREMIS),
// while its propositions decide facts about THIS table that no external work precedes. Kind 0 would be false
// and kind 2 requires a search that found nothing. Counting the two states alike is what this census exists
// to prevent, so the presence of a recorded search is what distinguishes them.
const unsearched = leanFiles().filter((f) => {
  const src = leanSource(f)
  const m = src.match(/^-- prior_art: (\w[\w-]*)/m)
  if (m && m[1] !== 'unclassified') return false
  return !/^-- prior_art_search:/m.test(src)
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
  'figure(s) in comments claim a present that has moved', 'npm run stale-figures — each is either stale or a record of the past', ['derivation'])

// ── 5b · WHAT THE LIVE SITE SERVES ───────────────────────────────────────────────────────────────────────
// Every other lead reads the tree or the built dist. None reads what is actually SERVED, so a deploy that
// failed or a stale cache leaves every gate green while a reader is handed numbers the tree no longer holds.
// Reported here as a lead rather than run inline, because it needs the network and this census must not.
add('deploy', 0, '', 'run `npm run deployed` — it compares the served figures against the tree; an unreachable site is reported as unreachable, never as agreement', ['publication', 'environment'])

// ── 6 · THE DOI QUEUE, AND WHETHER ANYTHING IS MINTED ────────────────────────────────────────────────────
const deps = existsSync('.zenodo/theorems') ? readdirSync('.zenodo/theorems').filter((f) => f.endsWith('.json')) : []
const minted = deps.filter((f) => { try { return Boolean(JSON.parse(readFileSync(`.zenodo/theorems/${f}`, 'utf8')).doi) } catch { return false } })
// TWO DIFFERENT THINGS, AND THEY WERE ONE LINE UNTIL A RELEASE SHOWED THE DIFFERENCE. Cutting v8.8.4
// triggered publish.yml, whose own comment calls it "also the Zenodo DOI trigger, if enabled" — and the
// concept DOI still resolves to the record issued a month earlier, with one version relation. So the
// webhook is NOT enabled, which is a separate blocker from the missing token and has a separate fix.
add('deposit', deps.length - minted.length, `deposition(s) staged and not minted (${minted.length} minted)`,
  'TWO paths, both the depositor\'s: (a) enable the Zenodo↔GitHub integration for this repo, which mints ONE '
  + 'DOI per release for the whole deposit — verified NOT active, a release cut today minted nothing; '
  + '(b) a token with deposit:write and deposit:actions, which mints the per-theorem records individually. '
  + 'They are different artefacts and "a DOI for all" could mean either.', ['authority', 'publication'])

// ── 7 · CERTIFICATES TO DEVELOP INTO LEAN LAWS ───────────────────────────────────────────────────────────
// "The purges are leads to develop in lean theorems" (user, 2026-09-14). A theorem whose statement rests only on
// a value its own file sets by hand — no function of the file applied, no quantifier, no list computation —
// checks the typing, not the mathematics: a certificate. Those that had a law were restated with their inverse
// (split.lean and coin.lean, 2026-09-14). The rest are listed here, computed from the tree, so the list shrinks
// by itself as each becomes a law, and nothing is dropped because nobody remembered it.
const certificates: string[] = []
for (const f of leanFiles()) {
  const src = leanSource(f).replace(/\/-[\s\S]*?-\//g, '').replace(/--[^\n]*/g, '')
  const consts = new Set<string>(), funcs = new Set<string>()
  for (const m of src.matchAll(/^\s*(?:def|abbrev)\s+([\p{L}_][\p{L}\p{N}_']*)([^:=\n]*)(?::[^=\n]*)?:=\s*([^\n]*)/gmu)) {
    const body = m[3].trim()
    if (m[2].trim()) { funcs.add(m[1]); continue }
    const ids = (body.match(/[\p{L}_][\p{L}\p{N}_']*/gu) ?? []).filter((w) => !['Nat', 'Int', 'List', 'true', 'false'].includes(w))
    if (body && ids.every((w) => consts.has(w))) consts.add(m[1])
    else funcs.add(m[1])
  }
  for (const m of src.matchAll(/^\s*theorem\s+([\p{L}_][\p{L}\p{N}_']*)\s*:([\s\S]*?):=\s*(by\s+\S+|rfl)/gmu)) {
    const stmt = m[2]
    if (/\bfun\b|∀|∃|\.(all|any|map|filter|foldl|foldr|eraseDups)\b|List\.range/u.test(stmt)) continue
    const names = [...new Set(stmt.match(/[\p{L}_][\p{L}\p{N}_']*/gu) ?? [])]
    if (names.some((w) => funcs.has(w))) continue
    if (names.some((w) => consts.has(w)) || m[3] === 'rfl') certificates.push(`${f}:${m[1]}`)
  }
}
// ── 8 · WHAT A STRANGER CAN RUN, AND WHAT THIS DEPOSIT SHIPS THEM ────────────────────────────────────────
// The standing claim is that a third party can check this deposit "without an account, a key or a model". The
// MCP server is the surface that claim is made ON, so the size of its self-sufficient part is part of the
// claim and was never counted. Two separate gaps, and they have separate fixes:
//
//   (a) TOOLS THAT NEED MORE THAN THE PACKAGE. 17 of 25 need the source tree, a git checkout, the Lean
//       toolchain, the ledger file, the network or a shared directory. That is not a defect by itself — a
//       tool that compiles Lean obviously needs Lean — but the COUNT is the honest size of "run it yourself",
//       and it is 8, not 25. Reported so it can be raised deliberately rather than assumed.
//   (b) THE SERVER IS NOT IN THE PACKAGE AT ALL. package.json ships ["dist", "README.md", "LICENSE",
//       "CITATION.cff"], there is no `bin`, and nothing in dist/ is the MCP. So even the 8 self-sufficient
//       tools are unreachable by `npm install`: the only way to run any of them is to clone the repository,
//       which is precisely the thing the claim says is not required. This is the larger of the two.
// COUNTED BY WHAT THE PACKAGE SERVES, NOT BY WHAT NEEDS MORE THAN THE CORE. The first version of this lead
// counted tools whose NEEDS was anything but ['core'] — a proxy, and it went wrong the moment the ledger was
// shipped: the four evidence tools still NEED the ledger, and that requirement is now SATISFIED by the
// package, which is a different thing. A requirement met is not a requirement absent, and the proxy reported
// tools as out of reach while a stranger was already running three of them. What the lead is about is what an
// install can reach, so that is what it counts now.
const unreachable = TOOL_NAMES.filter((n) => !SERVED_BY_PACKAGE.includes(n))
add('mcp-reach', unreachable.length,
  `MCP tool(s) an npm install cannot reach (${SERVED_BY_PACKAGE.length} of ${TOOL_NAMES.length} are served from the package, ledger included): `
  + unreachable.slice(0, 6).map((n) => `${n}:${(MCP_NEEDS[n] ?? []).join('+')}`).join(' ') + (unreachable.length > 6 ? ' …' : ''),
  'each names what it needs, and list_tools tells a caller before they call rather than failing when they do. '
  + 'Reducing the count means moving a tool onto data or logic the package carries — shipping the ledger took '
  + 'it from 19 to 16 — and for some it cannot be done: lean_verify needs the Lean toolchain and probe needs '
  + 'the network. Those are honest requirements, not gaps.', ['publication'])

const shipsMcp = (() => {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { files?: string[]; bin?: unknown; exports?: Record<string, unknown> }
    const hasBin = Boolean(pkg.bin)
    const exported = Object.keys(pkg.exports ?? {}).some((k) => /mcp/i.test(k))
    return hasBin || exported
  } catch { return true }
})()
add('mcp-ship', shipsMcp ? 0 : SELF_SUFFICIENT.length,
  `self-sufficient MCP tool(s) that npm install cannot reach: the package declares no bin and exports no MCP entry, `
  + `so all ${SELF_SUFFICIENT.length} of them require cloning the repository — which is what "no account, no key, no model" says is unnecessary`,
  'publish an MCP entry built from the core-only tools: a `bin`, and an export that imports nothing needing '
  + 'the tree, git, Lean, the ledger or a shared directory. scripts/mcp-gate.ts already derives exactly which '
  + 'tools those are, so the subset is computed and not chosen', ['publication'])

add('laws', certificates.length,
  `theorem(s) that only read back a hand-set value — a certificate, not a proof: ${certificates.slice(0, 6).join(' ')}${certificates.length > 6 ? ' …' : ''}`,
  'restate each as a law with its inverse over the domain its constant describes, decided at every instance (the involution discipline); where no law exists yet, the lead stays open', ['derivation'])
if (process.argv.includes('--laws')) { for (const c of certificates) console.log(c); process.exit(0) }

// ── REPORT ───────────────────────────────────────────────────────────────────────────────────────────────
console.log('open leads, derived from the tree:\n')
if (!leads.length) console.log('  none — every derived lead is closed')
for (const L of leads.sort((a, b) => b.n - a.n)) {
  console.log(`  ${String(L.n).padStart(4)}  ${L.area.padEnd(11)} ${L.what}`)
  console.log(`        → ${L.how}`)
}
// ── THE CROSSINGS ────────────────────────────────────────────────────────────────────────────────────────
const byCause = new Map<Cause, Lead[]>()
for (const L of leads) for (const c of L.causes) byCause.set(c, [...(byCause.get(c) ?? []), L])
const crossings = [...byCause.entries()]
  .map(([c, ls]) => ({ c, ls, areas: new Set(ls.map((l) => l.area)).size, items: ls.reduce((a, b) => a + b.n, 0) }))
  .filter((x) => x.ls.length > 0)
  .sort((a, b) => b.areas - a.areas || b.items - a.items)
const uncaused = leads.filter((L) => !L.causes.length)

console.log('\ncrossed by cause — a cause shared by two areas is one problem with two faces:\n')
for (const x of crossings) {
  const mark = x.areas > 1 ? '✳' : '·'
  console.log(`  ${mark} ${x.c.toUpperCase()} — ${x.areas} area(s), ${x.items} item(s)`)
  console.log(`      ${CAUSES[x.c]}`)
  for (const L of x.ls) console.log(`      · ${L.area} (${L.n})`)
  if (x.areas > 1) {
    console.log(`      ⇒ THE CROSSING IS ITSELF A LEAD: ${x.ls.map((l) => l.area).join(' and ')} are not two tasks here.`)
    console.log(`        Anything that only fixes one of them leaves the cause in place, and the other returns.`)
  }
}
if (uncaused.length) {
  console.log(`\n  ○ ${uncaused.length} lead(s) carry no cause and therefore cross with nothing: ${uncaused.map((l) => l.area).join(' ')}`)
  console.log(`    An uncrossed lead is either genuinely singular or has a cause nobody has named. Both are worth a look.`)
}

console.log(`\n○ leads: ${leads.length} open area(s), ${leads.reduce((a, b) => a + b.n, 0)} item(s).`)
console.log(`  ${theoremCount()} theorems · ${live().length} live keys · ${l.length} ledger entries.`)
console.log(`  Reports and does not fail: an open question is work not done, which is not the same as work`)
console.log(`  that is wrong, and a build that failed on open questions would teach cheap answers.`)
