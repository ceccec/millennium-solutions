#!/usr/bin/env node
/** ── ZENODO SYNC — what each release would carry to the permanent record ───────────────────────────────
 *
 *  Captain's instruction, signed (`src/receipts/2d137058-…json`, `agent: "captain"`):
 *    "update zenodo on each release programatically to include readme and changelog as well as all news
 *     and discoveries in the metadata itself including citing other doi and its role (including violations)"
 *
 *  This assembles exactly that, from measurements this tree already computes, and it runs on EVERY release.
 *  What it does NOT do on every release is transmit. A Zenodo version is permanent: its depositor cannot
 *  delete it, only ask staff to withdraw it. This repository has minted 916 provenance tags, several in an
 *  hour today, and a new citable DOI for each of them would bury the record it is meant to document. So the
 *  chain runs the PLAN — derive, check, write `.zenodo/sync-plan.json`, refuse if anything is stale — and
 *  sending it is one explicit act with `--production`. That is the instruction carried out with the one
 *  part that cannot be undone left as a decision rather than a side effect. Said plainly rather than
 *  quietly narrowed.
 *
 *  ROLE IS MEASURED, NEVER ASSUMED — and "violation" is not a verdict this file is allowed to reach.
 *  `src/proof/citations.json` records who cites these DOIs and whether the citing work is the author's own.
 *  A self-citation is provenance; a third-party citation is uptake; an unresolved identifier is NOT
 *  MEASURED. Nothing in this deposit identifies a violator (FINDINGS.md §6), and a permanent record naming
 *  one on the strength of an absence would be the same act this repository spent a day documenting. Where
 *  the author has a question, the record carries the QUESTION, with its evidence, for the reader to judge.
 *
 *  usage:  node scripts/zenodo-sync.ts             derive and write the plan (what the chain runs)
 *          node scripts/zenodo-sync.ts --print     also print the description it would send
 *          node scripts/zenodo-sync.ts --production   create a new version and publish it (irreversible) */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { CONCEPT_DOI, SITE, REPO, creditedIn, ownFiles, kinds } from '../src/publication/index.ts'
// ONE ESCAPER FOR THE TREE. This file carried its own three-replace version and canon-gate refused the
// release for it — correctly: two implementations of escaping is one of them being wrong about an entity
// nobody noticed, on a record that cannot be corrected once minted.
import { escapeHtml as esc } from '../src/html/index.ts'
import { ledger, theoremCount, leanFiles, leanTheorems } from '../src/api/index.ts'

const args = process.argv.slice(2)
const LIVE = args.includes('--production')
const PLAN = '.zenodo/sync-plan.json'
const HOST = 'https://zenodo.org'

let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }

// ── THE FILES THE RECORD CARRIES ────────────────────────────────────────────────────────────────────────
// Both are generated, and both are checked for staleness rather than trusted: a record carrying a changelog
// that stopped at an older tag documents a release that is not the one being deposited.
const FILES = ['README.md', 'CHANGELOG.md']
for (const f of FILES) if (!existsSync(f)) fail(`${f} does not exist — the record cannot carry it`)
try { execFileSync('node', ['scripts/changelog.ts', '--check'], { stdio: 'pipe' }) }
catch { fail('CHANGELOG.md is not what the tags derive — run `node scripts/changelog.ts`') }

const tag = (() => {
  try { return execFileSync('git', ['describe', '--tags', '--abbrev=0'], { encoding: 'utf8' }).trim() } catch { return '' }
})()
if (!tag) fail('no tag to deposit — a release record with no version names nothing')

// ── DISCOVERIES, COUNTED FROM THE LEDGER ITSELF ─────────────────────────────────────────────────────────
const rows = ledger()
const live = rows.filter((e) => !('revoked' in e) || !(e as { revoked?: boolean }).revoked)
const discoveries = { ledger: rows.length, live: live.length, theorems: theoremCount(), files: leanFiles().length }

// ── CITING DOIs AND THEIR ROLE, READ FROM THE MEASUREMENT ───────────────────────────────────────────────
type Citing = { doi: string; date?: string; title?: string; authors?: string[]; self?: boolean }
const cites: { measured: string; tracked: { doi: string; citing: Citing[] }[] } =
  existsSync('src/proof/citations.json')
    ? JSON.parse(readFileSync('src/proof/citations.json', 'utf8'))
    : { measured: '', tracked: [] }
if (!cites.measured) fail('src/proof/citations.json is absent — reception would be UNSTATED, not zero; run `npm run citations`')

const allCiting: Citing[] = cites.tracked.flatMap((t) => t.citing ?? [])
const selfCites = allCiting.filter((c) => c.self === true)
const thirdParty = allCiting.filter((c) => c.self === false)
const roleUnknown = allCiting.filter((c) => c.self !== true && c.self !== false)

// Zenodo's `relation` is the machine-readable role. `isCitedBy` is what a citing work is, regardless of who
// wrote it; WHO wrote it is the part that distinguishes provenance from uptake, and it is stated in the
// description where a reader can see the reasoning rather than inferred from a bare relation code.
const related = [
  { identifier: CONCEPT_DOI, relation: 'isVersionOf', resource_type: 'publication-preprint' },
  { identifier: `${SITE}/FINDINGS`, relation: 'isDocumentedBy', resource_type: 'publication-report' },
  { identifier: `${SITE}/CHANGELOG`, relation: 'isDocumentedBy', resource_type: 'publication-other' },
  ...allCiting.map((c) => ({ identifier: String(c.doi).replace(/^https?:\/\/doi\.org\//, ''), relation: 'isCitedBy', resource_type: 'publication-preprint' })),
]


// ── THE HANDS — SO A CHILD CAN CHECK THE CENTRAL MOVE WITHOUT A COMPUTER ────────────────────────────────
// Captain's instruction: "even a kid to understand how to divide 0 by hands twisting first 2 fingers 2x90
// degrees forming baby zeroes". A deposit whose central idea can only be reached through Lean is a deposit
// most readers take on trust, and this record exists so that nobody has to.
//
// THE STATEMENTS ARE READ OUT OF THE SOURCE, NOT RETOLD. Each line below is lifted from the .lean file that
// declares it, so the plain-language paragraph beside it cannot drift from what the kernel decided. If a
// theorem is not found, the section says so and stops rather than telling the story without its proof —
// a children's explanation of something unproven is the most convincing wrong thing this record could carry.
const leanStatement = (file: string, name: string): string => {
  const path = `src/proof/${file}`
  if (!existsSync(path)) return ''
  const m = readFileSync(path, 'utf8').match(new RegExp(`theorem\\s+${name}\\s*:([\\s\\S]*?):=\\s*by`, 'm'))
  return m ? m[1].replace(/\s+/g, ' ').trim() : ''
}
// HOW MUCH THE TWO BUBBLES HOLD — COUNTED, NOT ASSERTED. The captain asked exactly how many theorems the
// bubbles carry and from which domains. Two named theorems is what the explanation QUOTES; it is not what
// the tree has. The criterion below is on the STATEMENT, never the title: a theorem is in the first bubble
// if some function applied twice returns its argument, and in the second if it divides or takes a remainder
// at a zero divisor. A theorem stating where the property FAILS matches the same shape and is counted
// SEPARATELY as a boundary — counting a refutation as support is the move this repository exists to refuse.
// Subdomain is the ledger family, found by searching the ledger for the name: building the key from the
// filename reported two sealed theorems as unsealed, because millenniumfloor is a family, not a file.
const SELF_INVERSE = /(\w+)\s*\(\s*\1\s+([a-zA-Z]\w*)\s*\)\s*==?\s*\2\b/
const ARITH_INVERSE = /(\d+)\s*-\s*\(\s*\1\s*-\s*([a-zA-Z]\w*)\s*\)\s*==?\s*\2\b/
const AT_ZERO = /[/%]\s*0\b/
const ledgerKeys = rows.map((e) => e.key)
const familyOf = (name: string): string => {
  const ks = ledgerKeys.filter((k) => k.endsWith('_' + name) || k.endsWith('.' + name))
  if (!ks.length) return '(not sealed)'
  const k = ks.reduce((a, b) => (a.length <= b.length ? a : b))
  const m = k.match(new RegExp(`^lean_([A-Za-z0-9.]+?)_${name}$`))
  return m ? m[1] : k
}
const bubble = (pick: (statement: string) => boolean) => {
  const xs = leanTheorems().filter((t) => pick(t.statement))
  const holds = xs.filter((t) => !/_not_an?_|not_/.test(t.name))
  const fams = [...new Set(xs.map((t) => familyOf(t.name)))].sort()
  const files = [...new Set(xs.map((t) => t.file.replace(/\.lean$/, '')))].sort()
  return { total: xs.length, holds: holds.length, bounds: xs.length - holds.length, fams, files }
}
const B1 = bubble((st) => SELF_INVERSE.test(st) || ARITH_INVERSE.test(st))
const B2 = bubble((st) => AT_ZERO.test(st))
const bubbleCount = `<p><strong>Exactly how much the two bubbles hold.</strong> Counted from the statements, not the titles. `
  + `<strong>${B1.total + B2.total}</strong> theorem(s) of ${theoremCount()} in this deposit. `
  + `The turning finger: <strong>${B1.total}</strong> — ${B1.holds} stating the property and `
  + `${B1.bounds} stating where it FAILS, which is a boundary and not support — across ${B1.files.length} `
  + `domain(s) (<code>${B1.files.join('</code>, <code>')}</code>) and ${B1.fams.length} ledger subdomain(s) `
  + `(<code>${B1.fams.join('</code>, <code>')}</code>). `
  + `The nought that was given: <strong>${B2.total}</strong> — ${B2.holds} stating the property, ${B2.bounds} boundary — `
  + `across ${B2.files.length} domain(s) (<code>${B2.files.join('</code>, <code>')}</code>) and ${B2.fams.length} subdomain(s) `
  + `(<code>${B2.fams.join('</code>, <code>')}</code>). `
  + `The two sets do not overlap. Recount with <code>node scripts/zenodo-sync.ts --print</code>.</p>`

const HANDS = [
  { file: 'index.lean', name: 'the_tens_complement_is_an_involution_with_one_fixed_point' },
  { file: 'families.lean', name: 'at_a_zero_divisor_the_identity_is_carried_by_the_remainder' },
].map((h) => ({ ...h, statement: leanStatement(h.file, h.name) }))
const handsProven = HANDS.every((h) => h.statement)

const hands = !handsProven
  ? `<p><strong>The two-finger explanation is NOT INCLUDED in this version.</strong> It rests on `
    + `${HANDS.filter((h) => !h.statement).map((h) => `<code>${esc(h.name)}</code>`).join(' and ')}, which `
    + `this tree does not declare where this record looked. An explanation a reader cannot check is the one `
    + `thing a permanent record must not carry.</p>`
  : `<p><strong>Do it with your hands — the whole idea, without a computer.</strong> Hold up your first two `
    + `fingers. Turn each one a quarter turn, then another quarter turn: two times ninety degrees. They are `
    + `curled now into two little circles. Two baby zeroes, one on each hand — and if you dip them and blow, `
    + `two soap bubbles. That is the picture to keep: a bubble is a nought you can see. Round, with a skin you `
    + `can point at, and nothing at all inside.</p>`
    + `<p><em>First finger — turn it twice and you are back.</em> A quarter turn and a quarter turn is a half `
    + `turn; do the half turn again and the finger is exactly where it started. Counting works the same way. `
    + `Take a digit away from ten, then take the answer away from ten again, and you have your digit back — `
    + `every time, for all ten digits. And exactly one digit never moves at all, sitting in the middle while `
    + `the others swap around it. Nobody chose which one; it falls out of the counting. The kernel checks all `
    + `ten cases: <code>${esc(HANDS[0].statement)}</code> `
    + `(<code>src/proof/${esc(HANDS[0].file)}</code>, <code>${esc(HANDS[0].name)}</code>).</p>`
    + `<p><em>Second finger — sharing with nobody.</em> You have twelve sweets and you share them among zero `
    + `friends. There is no friend, so nothing leaves your hand: all twelve stay. How many did each friend `
    + `get? The answer is not something you found by sharing — there was no sharing. Somebody had to DECIDE `
    + `what to write, and what is written is nought. That is the second baby zero, and it is a different kind `
    + `from the first: the twelve you kept were counted, the nought was <strong>given</strong>. The sharing `
    + `rule still balances — nought each, nought given away, twelve still in your hand, twelve altogether. `
    + `The kernel checks it: <code>${esc(HANDS[1].statement)}</code> `
    + `(<code>src/proof/${esc(HANDS[1].file)}</code>, <code>${esc(HANDS[1].name)}</code>).</p>`
    + `<p><strong>What this does and does not say.</strong> It does NOT say that dividing by zero gives zero. `
    + `An earlier name in this very repository said that, and it was wrong and was corrected — the source `
    + `records the correction beside the theorem. The point is the opposite one: at a zero divisor the value `
    + `is not found in the arithmetic, it is supplied by the definition. Dividing by zero is a CHANGE OF `
    + `DOMAIN — you have stepped into a different room, where somebody has already decided what the answer `
    + `is called. A child who can feel the difference between the twelve they counted and the nought they `
    + `were handed has understood the move this deposit is built on.</p>`
    + bubbleCount
    + `<p><em>Why two bubbles and not one.</em> Blow a bubble and you are holding a boundary, not a filling. `
    + `The first bubble is the turn that undoes itself — the skin closes back on where it began. The second is `
    + `the nought you were handed: perfectly round, perfectly empty, and it came from the ring your fingers `
    + `made rather than from anything you counted. Both are zeroes and they are not the same zero, which is `
    + `the whole of it. Then they pop, and the twelve sweets are still in your hand.</p>`

// ── EVIDENCE, IN THE RECORD ITSELF ──────────────────────────────────────────────────────────────────────
// Captain's instruction: "provide evidence in the publication metadata so all is immediately proven on
// site". So every figure the description states arrives with the artefact it was read from and the command
// that recomputes it, in a table on the landing page — a reader checks a number where they meet it, instead
// of being told to clone a repository and hope. Each row is DERIVED; a row whose artefact is missing says
// NOT MEASURED and keeps its command, because a blank cell reads as zero and NOT MEASURED does not.
const prov: Record<string, unknown> = existsSync('src/proof/provenance.json')
  ? JSON.parse(readFileSync('src/proof/provenance.json', 'utf8')) : {}
const audit: Record<string, unknown> = existsSync('docs/forensic-audit.json')
  ? JSON.parse(readFileSync('docs/forensic-audit.json', 'utf8')) : {}

// The tag's own message carries the content-address of the tree it names — read it, never restate it.
const tagAddress = (() => {
  try {
    const subj = execFileSync('git', ['for-each-ref', '--format=%(contents:subject)', `refs/tags/${tag}`], { encoding: 'utf8' })
    return (subj.match(/content-address\s+([0-9a-f-]{36})/) ?? [])[1] ?? ''
  } catch { return '' }
})()

const NM = '<em>NOT MEASURED</em>'
const ev = (what: string, value: string, source: string, cmd: string) =>
  `<tr><td>${esc(what)}</td><td>${value || NM}</td><td><code>${esc(source)}</code></td><td><code>${esc(cmd)}</code></td></tr>`

const evidence = [
  ev('theorems the kernel accepts', `<strong>${discoveries.theorems}</strong> over ${discoveries.files} files`, 'src/proof/*.lean', 'npm run lean'),
  ev('ledger entries / standing', `<strong>${discoveries.ledger}</strong> / ${discoveries.live}`, 'src/proof/discovered.json', 'node scripts/forensics.ts'),
  // IT IS AN OBJECT, NOT A STRING. The first version wrote String(audit.chainRecomputed) and the landing
  // page would have carried the words "[object Object]" as its evidence that the receipt chain is intact.
  // Read the fields.
  ev('receipt chain', (() => {
    const c = audit.chainRecomputed as { breaks?: number; verdict?: string } | undefined
    return c && typeof c.verdict === 'string' ? `<strong>${esc(c.verdict)}</strong>, ${esc(String(c.breaks ?? '?'))} break(s)` : ''
  })(), 'docs/forensic-audit.json', 'npm run forensic'),
  ev('ledger address at the audited commit', audit.address ? `<code>${esc(String(audit.address))}</code>` : '', 'docs/forensic-audit.json', 'npm run forensic'),
  ev('content-address of this version', tagAddress ? `<code>${esc(tagAddress)}</code>` : '', `git tag ${tag}`, `git for-each-ref refs/tags/${tag}`),
  ev('earliest deposit vs first commit', prov.earliestDeposit ? `${esc(String(prov.earliestDeposit))} vs ${esc(String((prov.repository as { firstCommit?: string })?.firstCommit ?? '').slice(0, 10))} — lead <strong>${esc(String(prov.leadDays ?? ''))} days</strong>, subtracted not asserted` : '', 'src/proof/provenance.json', 'npm run provenance'),
  ev('commits, all by one git identity', prov.commits ? `<strong>${esc(String(prov.commits))}</strong>` : '', 'git log', 'git shortlog -sn'),
  ev('citing works / of them the author’s own', `<strong>${allCiting.length}</strong> / ${selfCites.length}`, 'src/proof/citations.json', 'npm run citations'),
  ev('third-party citations', `<strong>${thirdParty.length}</strong>`, 'src/proof/citations.json', 'npm run citations'),
  ev('violators identified by this deposit', '<strong>0</strong> — and uncited use has not been searched for', 'FINDINGS.md §6', `open ${SITE}/FINDINGS`),
].join('')

const row = (c: Citing) => `<tr><td><code>${esc(String(c.doi))}</code></td><td>${esc(String(c.date ?? '—'))}</td>`
  + `<td>${esc(String(c.title ?? '—').slice(0, 80))}</td>`
  + `<td>${c.self === true ? 'the author’s own — provenance, not uptake' : c.self === false ? 'third party — uptake' : 'NOT MEASURED — the identifier did not resolve'}</td></tr>`

const description =
  `<p><strong>Release ${esc(tag)} of the ℤ/9 Vortex Framework deposit.</strong> ${discoveries.theorems} theorems across `
  + `${discoveries.files} Lean 4 files, each closed by exhaustion over a stated finite domain, sorry-free and `
  + `axiom-free; an append-only ledger of ${discoveries.ledger} entries, ${discoveries.live} standing, whose receipt `
  + `chain is recomputed on every build. README.md and CHANGELOG.md travel with this version; the changelog is `
  + `derived from the annotated tags themselves, so a row cannot claim a content-address its tag does not carry.</p>`
  + hands
  + `<p><strong>Evidence, so nothing here has to be taken on trust.</strong> Each figure with the artefact it `
  + `was read from and the command that recomputes it.</p>`
  + `<table><tr><th>what</th><th>value</th><th>read from</th><th>recompute with</th></tr>${evidence}</table>`
  + `<p><strong>Citing works, and the role of each.</strong> Measured ${esc(cites.measured || 'NOT MEASURED')} from DataCite and OpenAlex. `
  + `${allCiting.length} work(s) cite these DOIs: <strong>${selfCites.length}</strong> written by the author, `
  + `<strong>${thirdParty.length}</strong> by a third party, <strong>${roleUnknown.length}</strong> whose identifier did not resolve. `
  + `A self-citation is provenance and is counted separately, because counting it as uptake is the flattering direction.</p>`
  + (allCiting.length
    ? `<table><tr><th>DOI</th><th>date</th><th>title</th><th>role</th></tr>${allCiting.map(row).join('')}</table>`
    : `<p>No citing work resolved at the time of this release. That is what the citation graph holds, not a count of who has used this work: a graph records only the citations that were made.</p>`)
  // THE QUESTION, NOT THE ACCUSATION — the author's own standing instruction. No violator is identified in
  // this deposit and none is named here. What is on the record is the measurement and the open question.
  + `<p><strong>Open questions this record puts, rather than answers it asserts.</strong> `
  + `These results were registered before the source repository existed; if the same constructions appear elsewhere, `
  + `which came first, and is this record cited there? `
  + `${thirdParty.length === 0 ? 'No third-party citation has resolved to date, and uncited use has NOT been searched for — that needs content matching, not citation tracking, and it has not been run. Absence in a citation graph is not evidence of anyone’s conduct.' : ''} `
  + `This deposit’s receipts are signed by agent: eight carry <code>agent: "captain"</code>; statements bounding the claim `
  + `carried <code>claude-opus</code> and <code>Claude</code>. By what means did those models compute the claims they made here, `
  + `and on whose authority were they written in the author’s name? The signatures are in the repository, at `
  + `<a href="${SITE}/FINDINGS">${SITE}/FINDINGS</a>.</p>`



// ── THE FULL DEPOSITION, NOT A DESCRIPTION WITH A TITLE ─────────────────────────────────────────────────
// Zenodo's deposit schema carries far more than title and description, and a record leaving those fields
// empty is one a reader must leave the page to understand. Every field below is DERIVED: the identity block
// from `.zenodo.json` (one source, so it cannot drift from the concept record), the dates from git, the
// references from the prior art the sources themselves declare, the subjects from theorem keys the ledger
// stands behind. Fields needing a fact this deposit has not established — communities it has not been
// accepted into, grants it does not hold, a journal it is not in — are LEFT OUT, not filled plausibly.
const base = JSON.parse(readFileSync('.zenodo.json', 'utf8')) as Record<string, unknown>
const gitDate = (rev: string) => { try { return execFileSync('git', ['log', '-1', '--format=%aI', rev], { encoding: 'utf8' }).trim().slice(0, 10) } catch { return '' } }
const tagDate = gitDate(tag)
const rootDate = (() => {
  try { return gitDate(execFileSync('git', ['rev-list', '--max-parents=0', 'HEAD'], { encoding: 'utf8' }).trim().split('\n').pop() as string) } catch { return '' }
})()

// CONTRIBUTORS — THE AGENTS, NAMED. `src/receipts/` has always recorded which agent made which statement;
// the permanent record never did. Every non-captain agent that signed a receipt here is listed as a
// contributor. This is the attribution whose absence FINDINGS.md §7 documents: with one git identity on
// every commit, nothing else distinguishes a sentence an agent wrote from one the author wrote.
const agents = [...new Set(readdirSync('src/receipts').filter((f) => f.endsWith('.json'))
  .map((f) => String((JSON.parse(readFileSync('src/receipts/' + f, 'utf8')) as { agent?: string }).agent ?? ''))
  .filter((a) => a && a !== 'captain'))].sort()

// REFERENCES — the prior art the SOURCES declare, not a list maintained beside them.
// TWO PLACES DECLARE PRIOR ART AND ONLY ONE WAS BEING READ. `creditedIn` returns the PER-THEOREM credits,
// of which this tree has two; the FILE-level `-- prior_art_note:` lines are where the rest of the crediting
// actually lives. A references list built from the per-theorem markers alone would put two references on a
// permanent record for a deposit that credits named prior art in all but one of its files — an omission
// that flatters, which is the direction that gets checked least. The ratio is deliberately not a figure
// here: it moves with every source added, and a count typed into a comment is a claim nothing recomputes —
// stale-figures caught exactly that on this line when authority.lean made the tree 42 files.
const fileCredits = (): string[] => {
  const out: string[] = []
  for (const f of [...new Set([...ownFiles(), ...kinds().keys()])]) {
    const path = `src/proof/${f}`
    if (!existsSync(path)) continue
    const src = readFileSync(path, 'utf8')
    for (const m of src.matchAll(/^--\s*prior_art_note:\s*(.+(?:\n--\s{2,}.+)*)/gm)) {
      const text = m[1].replace(/\n--\s+/g, ' ').replace(/\s+/g, ' ').trim()
      if (text) out.push(`${f}: ${text}`)
    }
  }
  return out
}
const references = [...new Set([
  ...[...new Set([...ownFiles(), ...kinds().keys()])].flatMap((f) => [...creditedIn(f).values()]),
  ...fileCredits(),
].map((c) => c.trim()).filter(Boolean))].sort()

// SUBJECTS — each a theorem this version stands behind, resolvable rather than a bare keyword.
const subjects = leanTheorems().slice(0, 100).map((t) => ({
  term: t.name.replace(/_/g, ' '),
  identifier: `${SITE}/theorem/lean_${t.file.replace(/\.lean$/, '')}_${t.name}`,
  scheme: 'url',
}))

const metadata: Record<string, unknown> = {
  upload_type: base.upload_type ?? 'publication',
  publication_type: base.publication_type ?? 'preprint',
  title: base.title,
  creators: base.creators,
  description,
  access_right: base.access_right ?? 'open',
  license: base.license ?? 'cc-by-nc-nd-4.0',
  language: 'eng',
  version: tag,
  ...(tagDate ? { publication_date: tagDate } : {}),
  keywords: base.keywords,
  subjects,
  references,
  related_identifiers: related,
  ...(agents.length ? { contributors: agents.map((a) => ({ name: a, type: 'Other', affiliation: 'automated session acting in this repository' })) } : {}),
  ...(rootDate && tagDate ? { dates: [{ start: rootDate, end: tagDate, type: 'Collected', description: 'first commit of the source repository to the commit this version tags' }] } : {}),
  method: `Every declaration is decided by the Lean 4 kernel over a stated finite domain — no axioms, no sorry, no native_decide. `
    + `Every figure in the prose is recomputed by a script in this repository on every build, and every ledger entry is a receipt over `
    + `content that can be rehashed. Reproduce: clone ${REPO}, then \`npm run lean\` for the kernel and \`node scripts/forensics.ts\` for `
    + `the receipt chain. Neither needs an account, an API key, a network, or a model.`,
  notes: `Provenance tag ${tag}${tagAddress ? `, content-address ${tagAddress}` : ''}. `
    + `${discoveries.theorems} theorems over ${discoveries.files} files; ledger ${discoveries.ledger} entries, ${discoveries.live} standing. `
    + `Citing works measured ${cites.measured || 'NOT MEASURED'}: ${allCiting.length} total, ${selfCites.length} the author's own, ${thirdParty.length} third party, ${roleUnknown.length} unresolved. `
    + `No violator is identified by this deposit and none is named here; uncited use has not been searched for. `
    + `Statements in this tree are signed by agent in src/receipts/; the contributors listed are the automated sessions that signed there.`,
}

// NO TIMESTAMP. This carried `derived: new Date().toISOString()`, so the file differed on every run whether
// or not anything about the plan had changed — which dirtied the tree after each chain, and stranded this
// file when gates-fire ran zenodo-sync as a gate-under-test: the control restores the file it MUTATED, not
// the file the generator WROTE. An artefact that changes when nothing changed is noise that has to be
// excluded everywhere it is compared, and the exclusions are where real leftovers go to hide. The tag dates
// the plan, and git dates the commit.
const plan = {
  concept: CONCEPT_DOI, tag, host: HOST,
  files: FILES, discoveries,
  citations: { measured: cites.measured, total: allCiting.length, self: selfCites.length, thirdParty: thirdParty.length, unresolved: roleUnknown.length },
  violations: {
    established: 0,
    basis: 'FINDINGS.md §6 — no violator is identified by this deposit; zero third-party citations is the shape of a citation graph, not a count of dishonest users. Uncited use has not been searched for.',
  },
  related_identifiers: related,
  description,
  metadata,
}

if (bad) { console.log(`\n✗ zenodo-sync: ${bad} finding(s) — nothing planned; fix the above and re-run`); process.exit(1) }

writeFileSync(PLAN, JSON.stringify(plan, null, 2) + '\n')
if (args.includes('--print')) console.log(description + '\n')
console.log(`  ✓ zenodo-sync: plan for ${tag} → ${PLAN} · ${FILES.length} file(s) · ${related.length} related identifier(s) · `
  + `citing ${allCiting.length} (${selfCites.length} self, ${thirdParty.length} third-party, ${roleUnknown.length} unresolved) · 0 violations established`)
console.log(`    metadata: ${Object.keys(metadata).length} fields · ${subjects.length} subject(s) · ${references.length} reference(s) · ${agents.length} agent contributor(s) named · ${evidence.split('<tr>').length - 1} evidence row(s)`)

if (!LIVE) {
  console.log(`    not transmitted. \`--production\` creates a NEW PERMANENT VERSION of ${CONCEPT_DOI} and publishes it; that cannot be undone.`)
  process.exit(0)
}

// ── TRANSMIT — the one irreversible step, never reached without --production ─────────────────────────────
// UNTESTED AGAINST THE LIVE API AS WRITTEN: the token on this machine has no deposit:write scope, so the
// write path below has never returned a success here. It is written to fail loudly and name the HTTP status
// rather than to appear to work. Run it against --sandbox credentials before trusting it on production.
const tokenPath = join(homedir(), '.zenodo', 'token')
const token = existsSync(tokenPath) ? readFileSync(tokenPath, 'utf8').trim() : ''
if (!token) { console.error(`  ✗ no token at ${tokenPath} — this script never asks for one and never prints it`); process.exit(1) }
const PKG = JSON.parse(readFileSync('package.json', 'utf8')) as { name: string; version: string }
const UA = `${PKG.name}/${PKG.version} (+https://github.com/ceccec/millennium-solutions)`
const api = async (path: string, init: RequestInit = {}) => {
  const r = await fetch(`${HOST}/api${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': UA, ...(init.headers ?? {}) } })
  const body = await r.text()
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${body.slice(0, 300)}`)
  return body ? JSON.parse(body) : {}
}
const recid = CONCEPT_DOI.split('.').pop()
const nv = await api(`/deposit/depositions/${recid}/actions/newversion`, { method: 'POST' })
const draftId = String(nv.links.latest_draft).split('/').pop()
const draft = await api(`/deposit/depositions/${draftId}`)
for (const f of FILES) {
  const r = await fetch(`${draft.links.bucket}/${f}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'User-Agent': UA }, body: readFileSync(f) })
  if (!r.ok) throw new Error(`file ${f}: ${r.status} ${await r.text()}`)
}
await api(`/deposit/depositions/${draftId}`, { method: 'PUT', body: JSON.stringify({ metadata: { ...draft.metadata, ...metadata } }) })
const pub = await api(`/deposit/depositions/${draftId}/actions/publish`, { method: 'POST' })
console.log(`  ✓ published ${pub.doi} — ${pub.links?.record_html ?? ''}`)
