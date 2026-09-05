#!/usr/bin/env node
// GATES-FIRE — every gate must be shown to FAIL when it should, not merely to pass.
//
// A gate that passes tells you nothing on its own: a gate that cannot fail passes too. Four instruments in
// this repo were wrong before the thing they measured was — a family classifier that split key text and
// invented 377 leads, a bucketer that filed 259 validation loops under "counter accumulation" because it
// matched the `v++` in a loop header, a hardcoded-set search that only looked for the sets I remembered, and
// a multi-writer check blind to an indirection I had introduced myself two commits earlier. Every one of
// them reported confidently. None of them was caught by being run; they were caught by someone looking at
// the subject directly.
//
// So each gate here gets a NEGATIVE CONTROL: a specific, reversible mutation that it must reject. The gate
// is run once clean (must pass), once mutated (must fail), and the mutation is undone. A gate that passes
// both times is not protecting anything, and this reports that as a failure of the GATE rather than of the
// repository — which is the distinction that took four instruments to learn.
//
// The mutations are made to copies restored immediately afterwards, and the run verifies the tree is clean
// at the end. If it ever exits leaving a mutation in place, `git checkout` restores it: nothing here touches
// receipts or the chain.
import { readFileSync, writeFileSync, existsSync, copyFileSync, unlinkSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'

const run = (cmd: string): boolean => {
  try { execSync(cmd, { stdio: 'pipe' }); return true } catch { return false }
}

// `restore` re-derives what a control's gate WROTE before it failed. pages.ts writes README.md and index.md
// and only then checks its citations, so a mutated run leaves those two files behind — restoring the script
// does not restore its output. A control that cleans up its input but not its consequences is a control that
// dirties the tree, which this file's own leftover check then reports as a failure. Correctly.
type Control = { gate: string; cmd: string; what: string; file: string; mutate: (s: string) => string; restore?: string }

// ORDER MATTERS FOR SOME GATES, and running one alone is not the same as running it in the chain.
// sitemap-mesh reported 14202 broken links and failed at HEAD — which looked like a pre-existing broken gate
// until the cause turned out to be that locale-fold had not run. It builds the locale pages every page links
// to; without it, every page in six languages is a dangling link, and the count is exactly 2335 pages times
// six. Nothing was broken. I had been running gates individually all session and had simply left one out.
// A gate with a prerequisite must have it stated, so the controls that need a built, folded dist say so.
const PREREQ = 'node scripts/locale-fold.ts'

const CONTROLS: Control[] = [
  // ── ADDED after deriving which gates had never been proven able to fail: 66 of 95 reachable scripts had
  //    no negative control, and `contradictions` — widened TWICE this session, once for the shape of a
  //    self-certifying literal and once for physical claims in published theorem names — was among them.
  //    A gate strengthened by hand and verified by a one-off plant is a gate whose next regression is
  //    silent. These four were each planted manually when written; the plants are standing now.
  { gate: 'contradictions (self-certifying literal)', cmd: 'node scripts/contradictions.ts',
    file: 'src/proof/phenomena.lean',
    what: 'a constant decided against its own literal and used nowhere else',
    mutate: (s) => s.replace('end Phenomena', 'def probeClaims : Nat := 0\ntheorem probe_is_zero : probeClaims = 0 := by decide\n\nend Phenomena') },

  { gate: 'contradictions (physical claim in a name)', cmd: 'node scripts/contradictions.ts',
    file: 'src/proof/coin.lean',
    what: 'a refusing file publishing a theorem NAME that asserts a physical fact',
    mutate: (s) => s.replace('end Coin', 'theorem the_reflection_is_the_mass_of_a_star : digits.length = 10 := by decide\n\nend Coin') },

  { gate: 'fixture-addresses (cross-repo pin)', cmd: 'node scripts/fixture-addresses.ts',
    file: 'docs/statement-address-fixture.json',
    what: 'a published address pin that no longer matches what the implementation computes',
    mutate: (s) => s.replace(/"mergeKeySha256": "[0-9a-f]{4}/, '"mergeKeySha256": "dead') },

  { gate: 'constants-gate', cmd: 'node scripts/constants-gate.ts', file: 'README.md',
    what: 'a hand-written constant in prose that only a generator may write',
    mutate: (s) => s.replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/, 'deadbeef-0000-0000-0000-000000000000'),
    restore: 'node scripts/pages.ts' },

  { gate: 'hardcode-gate', cmd: 'node scripts/hardcode-gate.ts', file: 'scripts/gaps.ts',
    what: 'a ℤ/9 set written out as a literal',
    mutate: (s) => s + '\nconst __probe = [1, 2, 4, 5, 7, 8]\nvoid __probe\n' },

  { gate: 'one-author-gate', cmd: 'node scripts/one-author-gate.ts', file: 'scripts/greeting.ts',
    what: 'a second script generating a page pages.ts already owns',
    mutate: (s) => s.replace("writeFileSync('public/greeting.json'", "writeFileSync('index.md', 'x'); writeFileSync('public/greeting.json'") },

  { gate: 'seal', cmd: 'node scripts/seal.ts', file: 'compare.md',
    what: 'prose citing a theorem that is not in the ledger',
    mutate: (s) => s + '\n\nSee [a claim](/theorem/a_key_that_was_never_sealed) for detail.\n' },

  { gate: 'claims-gate', cmd: 'node scripts/claims-gate.ts', file: 'README.md',
    what: 'the front page quoting a registry size that is not the registry size',
    mutate: (s) => s.replace(/(\d+) registered claims/, '9999 registered claims') },

  { gate: 'forensics', cmd: 'node scripts/forensics.ts', file: 'src/proof/discovered.json',
    what: 'a receipt altered mid-chain',
    mutate: (s) => { const l = JSON.parse(s); l[400].receipt = '00000000-0000-8000-8000-000000000000'; return JSON.stringify(l, null, 2) + '\n' } },

  { gate: 'lean', cmd: 'node scripts/lean.ts src/proof/theorems.lean', file: 'src/proof/theorems.lean',
    what: 'a theorem that does not hold',   // no --full: the cache keys on content, so a mutated file re-verifies and an untouched one does not
    mutate: (s) => s.replace('.length = 1', '.length = 2') },

  { gate: 'lean-agree', cmd: 'node scripts/lean-agree.ts', file: 'src/proof/merkaba.lean',
    what: 'a constant the proofs reason about drifting from the one the runtime uses',
    mutate: (s) => s.replace('def axis  : List Nat := [3, 6, 0]', 'def axis  : List Nat := [3, 6, 1]') },

  { gate: 'theorem-pages-gate', cmd: 'node scripts/theorem-pages-gate.ts', file: '.vitepress/dist/theorem/lean_units_are_six.html',
    what: 'a sealed theorem whose public page has lost its microdata',
    mutate: (s) => s.replace(/itemprop="identifier"/g, 'itemprop="removed-by-control"') },

  { gate: 'receipt-audit', cmd: 'node scripts/receipt-audit.ts', file: 'src/receipts/a1d33966-7bbd-84ca-902b-49e315af60e0.json',
    what: 'a receipt whose uuid no longer addresses its own message',
    mutate: (s) => { const r = JSON.parse(s); r.message = r.message + ' (altered by control)'; return JSON.stringify(r, null, 2) + '\n' } },

  { gate: 'gate-corpus', cmd: 'node scripts/gate-corpus.ts', file: 'scripts/gate-corpus.ts',
    what: 'an honest sentence being asserted to drain',
    mutate: (s) => s.replace("export const CASES: [string, 0 | 1, string][] = [",
      "export const CASES: [string, 0 | 1, string][] = [\n  ['a content-address proves integrity, not truth; 0/7', 0, 'control: honest prose asserted to drain'],") },

  // THE CONTROL WAS WRONG, NOT THE GATE — the fifth instrument of mine to be wrong before its subject was.
  // I pointed this at index.md, which wholeness never opens: it computes the floor by RUNNING src/7/entails,
  // whose report counts how many of the seven statements entail their conjecture and prints "0 / 7". A
  // control that mutates a file the gate does not read proves nothing about the gate, and reported it as
  // protecting nothing when it was protecting exactly what it claims.
  { gate: 'wholeness', cmd: 'node scripts/wholeness.ts', file: 'src/7/entails.ts',
    what: 'the entailment count no longer computing zero of seven',
    mutate: (s) => s.replace('const s = !trueWhenFalse; if (s) solved++', 'const s = !trueWhenFalse; solved++; void s') },

  { gate: 'seal-lean', cmd: 'node scripts/seal-lean.ts', file: 'src/proof/theorems.lean',
    what: 'a sealed theorem whose source has been removed',
    mutate: (s) => s.replace('theorem universal_reflection_involution', 'theorem renamed_by_control') },

  // WRONG CONTROL, TWICE OVER — the sixth of mine to be aimed at something its gate does not check. I first
  // broke a receipt, but lean-claims verifies the tamper-evidence MECHANISM (falsify a link and every
  // downstream receipt changes), which is a property of the construction and is not violated by an actually
  // broken chain. The current chain is forensics' job, and its control passes. What lean-claims does check is
  // the ARITHMETIC the Lean theorems assert, recomputed independently of any Lean toolchain — so the control
  // breaks the arithmetic.
  { gate: 'lean-claims', cmd: 'node scripts/lean-claims.ts', file: 'src/0/index.ts',
    what: 'the runtime computing a doubling orbit that is not the one the proofs assert',
    mutate: (s) => s.replace('do { orbit.push(x); x = (x * 2) % BASE } while (x !== 1)',
                             'do { orbit.push(x); x = (x * 4) % BASE } while (x !== 1)') },

  { gate: 'import-gate', cmd: 'node scripts/import-gate.ts', file: '.vitepress/dist/compare.html',
    what: 'a page loading a third-party resource',
    mutate: (s) => s.replace('</head>', '<script src="https://cdn.example.com/tracker.js"></script></head>') },

  { gate: 'trial', cmd: 'node scripts/trial.ts', file: 'README.md',
    what: 'the page losing the sentence the trial records it as carrying',
    mutate: (s) => s.replace('No sentence above claims a Millennium problem settled', 'REMOVED BY CONTROL') },

  // THE CONTROL MUST MUTATE WHAT THE GATE NOW READS. This replaced `def provenHere : Nat := 0` with `:= 1`,
  // and that constant was removed from index.lean — so the mutation matched nothing, the file was unchanged,
  // the gate passed, and gates-fire correctly reported that readme "ACCEPTS" the mutation. A control whose
  // edit no longer applies is a control that tests nothing while reading green. The readme gate now asks
  // clayFloor(), so the mutation takes one of the seven Clay-named theorems out of the count.
  // rights was the ONE release gate this harness reported as having no negative control — "trusted only
  // because it passes". It had a real gap behind that: it parsed the instrument table and then verified a
  // ledger KEY, and a seal covers the key and never the statement text, so a drifted table would have
  // rendered as a legal notice on the strength of an old seal. It checks the property on the rows it parsed
  // now, and this is the control: claiming a registered trade mark, which a registry grants and an author
  // cannot, must stop the page being written.
  { gate: 'rights', cmd: 'node scripts/rights.ts', file: 'src/proof/rights.lean',
    what: 'a right claimed that does not arise without formality — a registry\'s act asserted as an author\'s',
    mutate: (s) => s.replace('  , (4, 1, false, false)', '  , (4, 1, false, true )') },

  { gate: 'readme', cmd: 'node scripts/readme.ts', file: 'src/proof/index.lean',
    what: 'one of the seven Clay theorems no longer being Clay-named, so the floor is measured over six',
    mutate: (s) => s.replace('theorem hodge_span_is_the_units', 'theorem span_is_the_units') },

  // My first mutation renamed the header to "Content-Security-Policy-Removed-By-Control", which still
  // CONTAINS the string the gate greps for, so the gate passed and I read that as the gate being broken. The
  // seventh control of mine aimed wrong. It also shows what the gate really tests: the presence of that
  // substring anywhere in the page, not a well-formed policy — true of most CSP checks, and worth knowing it
  // is what is being claimed.
  { gate: 'security-gate', cmd: 'node scripts/security-gate.ts', file: '.vitepress/dist/compare.html',
    what: 'a built page served with no Content-Security-Policy at all',
    mutate: (s) => s.replace(/Content-Security-Policy/g, 'X-Control-Removed-Header') },

  { gate: 'harmony-currency', cmd: 'node scripts/harmony-currency.ts', file: 'src/9/security.ts',
    what: 'a reporting module that no longer computes',
    mutate: (s) => s.replace('export function report(): string {', 'export function report(): string {\n  if (true) throw new Error("control")') },

  // Emptying the file left the ROUTE intact, and this gate checks that link targets resolve, not what they
  // contain — so an empty page is still a perfectly good destination. The control has to break a LINK.
  { gate: 'sitemap-mesh', cmd: 'node scripts/sitemap-mesh.ts', file: '.vitepress/dist/verify.html',
    what: 'a page linking to a route that was never built',
    mutate: (s) => s.replace('</body>', '<a href="/millennium-solutions/a-route-that-does-not-exist">control</a></body>') },

  { gate: 'attribution-gate', cmd: 'node scripts/attribution-gate.ts', file: 'CITATION.cff',
    what: 'a citable surface naming the author without their ORCID',
    mutate: (s) => s.replace(/0009-0000-7312-9778/g, '') },

  { gate: 'parallel-seal', cmd: 'node scripts/parallel-seal.ts', file: 'src/0/index.ts',
    what: 'a fold whose root depends on the order its segments arrive in',
    mutate: (s) => s.replace('let layer = [...leaves].sort()', 'let layer = [...leaves]') },

  { gate: 'retire-lexical', cmd: 'node scripts/retire-lexical.ts', file: 'src/proof/discovered.json',
    what: 'an entry filed as testing the removed gate whose test now passes',
    mutate: (s) => { const l = JSON.parse(s)
      const holds = l.find((e: { key: string; reason?: string }) => e.key === 'the_seven_locales_all_hold_the_honest_floor')
      if (holds) holds.reason = 'revoked in place: its test asserted a lexical drain and the word-list gate was removed'
      return JSON.stringify(l, null, 2) + '\n' } },

  { gate: 'pages', cmd: 'node scripts/pages.ts', file: 'scripts/pages.ts',
    what: 'the front page citing a theorem that is not live in the ledger',
    mutate: (s) => s.replace('/theorem/lean_millenniumfloor_riemann_reflection_and_heart', '/theorem/a_key_that_was_never_sealed'),
    restore: 'node scripts/pages.ts' },

  { gate: 'orphan-gate', cmd: 'node scripts/orphan-gate.ts', file: 'package.json',
    what: 'a script nothing can reach',
    mutate: (s) => s.replace(/"wave": "node scripts\/wave\.ts",?\n?/, '') },

  // imagine only judges when it EMITS: without --emit it proposes and exits 0, so the control has to run the
  // emitting path and put a false proposition to the kernel.
  { gate: 'imagine', cmd: 'node scripts/imagine.ts --emit', file: 'scripts/imagine.ts',
    what: 'a proposition the kernel refuses',
    mutate: (s) => s.replace("{ id: 'double',   lean: 'm9 (2 * d)',", "{ id: 'double',   lean: 'm9 (2 * d) + 1',"),
    restore: 'node scripts/imagine.ts --emit' },

  { gate: 'verify', cmd: 'node scripts/verify.ts', file: 'src/proof/discovered.json',
    what: 'an entry citing a theorem that is not sealed',
    mutate: (s) => { const l = JSON.parse(s)
      const e = l.find((x: { key: string; revoked?: boolean }) => !x.revoked && x.key.startsWith('lean_'))
      if (e) e.name += ' — proved by /theorem/a_key_that_was_never_sealed'
      return JSON.stringify(l, null, 2) + '\n' } },

  // the control reintroduces the exact bug that nearly sealed a false statement: a shadow guard that matches
  // `=` but not the `:=` the binding chain has already been rewritten into.
  { gate: 'translate-gate', cmd: 'node scripts/translate-gate.ts', file: 'src/prove/translate.ts',
    what: 'a rendering that substitutes a rebound name and still type-checks',
    mutate: (s) => s.replace('\\\\s*:?=`)', '\\\\s*=`)') },

  { gate: 'gaps', cmd: 'node scripts/gaps.ts', file: '.vitepress/config.ts',
    what: 'a published page dropped from the sidebar',
    mutate: (s) => s.replace(/\{ text: 'Verify \(live app\)', link: '\/verify' \},/, '') },
]

// A KILLED RUN LEAVES A MUTATION, because `finally` does not survive SIGTERM. That is not hypothetical: a
// run of this script hit a command timeout mid-control and left a deliberately falsified theorem on disk,
// where the next lean run found it and reported the file broken. The mutation window is now as short as it
// can be, and a stale backup from a previous run is restored BEFORE anything else happens — so the damage a
// kill can do is bounded by one run rather than left for whoever next builds.
const RESTORE_MARK = '/tmp/gf_inflight.json'
const rescue = () => {
  if (!existsSync(RESTORE_MARK)) return
  try {
    const { file, backup } = JSON.parse(readFileSync(RESTORE_MARK, 'utf8')) as { file: string; backup: string }
    if (existsSync(backup)) {
      copyFileSync(backup, file)
      console.log(`  · rescued ${file} — a previous run was killed mid-control and left its mutation in place`)
    }
  } catch { /* nothing recoverable */ }
  unlinkSync(RESTORE_MARK)
}

// CONTENT, NOT STATUS. `git status --porcelain` encodes staged-versus-worktree in its two-character prefix,
// so re-running a generator flips ` M` to `MM` for a file whose CONTENT never changed — and comparing status
// lines read that as a leftover mutation. It reported a failure whose entire cause was that I had staged two
// files earlier. What a restore has to guarantee is that the bytes are as they were, so the bytes are what is
// compared: every path git mentions, mapped to a hash of what is on disk.
const snapshot = (): Map<string, string> => {
  const m = new Map<string, string>()
  for (const line of execSync('git status --porcelain', { encoding: 'utf8' }).split('\n').filter(Boolean)) {
    const path = line.slice(3).trim().replace(/^"|"$/g, '')
    let h = 'absent'
    try { h = createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 16) } catch { /* deleted */ }
    m.set(path, h)
  }
  return m
}
rescue()
// bring the tree to the state the chain would have it in before judging any gate that reads dist/
try { execSync(PREREQ, { stdio: 'pipe' }) } catch { /* dist may not exist yet; the controls report that */ }
const before = snapshot()

let broken = 0, checked = 0
console.log('gates-fire — each gate must reject its negative control:\n')
for (const c of CONTROLS) {
  if (!existsSync(c.file)) { console.log(`  ? ${c.gate.padEnd(17)} ${c.file} absent — cannot control`); continue }
  const backup = `/tmp/gf_${c.file.replace(/[\/.]/g, '_')}`
  copyFileSync(c.file, backup)
  writeFileSync(RESTORE_MARK, JSON.stringify({ file: c.file, backup }))   // survives a kill; read on next run
  try {
    const cleanPasses = run(c.cmd)
    writeFileSync(c.file, c.mutate(readFileSync(c.file, 'utf8')))
    const mutatedPasses = run(c.cmd)
    copyFileSync(backup, c.file)
    checked++
    if (cleanPasses && !mutatedPasses) console.log(`  ✓ ${c.gate.padEnd(17)} rejects ${c.what}`)
    else if (!cleanPasses) { broken++; console.log(`  ✗ ${c.gate.padEnd(17)} FAILS ON A CLEAN TREE — it is not testing what it claims`) }
    else { broken++; console.log(`  ✗ ${c.gate.padEnd(17)} ACCEPTS ${c.what} — this gate is not protecting anything`) }
  } finally {
    copyFileSync(backup, c.file); unlinkSync(backup)
    if (c.restore) { try { execSync(c.restore, { stdio: 'pipe' }) } catch { /* reported by the leftover check */ } }
    if (existsSync(RESTORE_MARK)) unlinkSync(RESTORE_MARK)
  }
}

// WHAT CHANGED DURING THIS RUN, not what is dirty. The tree is almost never clean while someone is working,
// so asking "is anything modified" reported my own in-progress edits as leftover mutations. The state is
// captured before the controls run and compared after: only a file that changed BETWEEN those two points can
// be a mutation this script failed to undo. Testing the difference rather than the level.

const after = snapshot()
// a path is leftover only when its CONTENT differs from before, or it appeared and is not this run's own doing
const leftover = [...after.entries()]
  .filter(([path, h]) => before.has(path) ? before.get(path) !== h : !path.endsWith('gates-fire.ts'))
  .map(([path]) => path)
if (leftover.length) {
  console.log(`\n✗ gates-fire changed the tree and did not restore it:\n${leftover.slice(0, 5).join('\n')}`)
  process.exit(1)
}

// WHICH GATES HAVE NO CONTROL — named, because a coverage figure nobody prints is a coverage figure nobody
// raises. Twelve of the release chain's gates are demonstrated to fail when they should; the rest are trusted
// on the strength of passing, which is exactly the standing this file exists to withdraw. They are listed so
// the gap is a work item rather than an assumption.
const chain = readFileSync('package.json', 'utf8')
const inChain = [...(JSON.parse(chain).scripts.release as string).matchAll(/node scripts\/([a-z-]+)\.ts/g)].map((m) => m[1])
const controlled = new Set(CONTROLS.map((c) => c.gate))
// A GENERATOR IS NOT A GATE, and demanding a negative control from one is a category error. Nine of the
// thirteen I was reporting as "trusted only because they pass" never pass or fail at all — they produce a
// file and exit 0 unconditionally. Listing them as untested gates overstated the gap and would have sent
// someone looking for a way to make challenges.ts reject something. Which is which is MEASURED, by looking
// for a non-zero exit path in the source, rather than judged from the name.
const canFail = (g: string): boolean => {
  try { return /process\.exit\((?!0\))/.test(readFileSync(`scripts/${g}.ts`, 'utf8')) } catch { return false }
}
const rest = inChain.filter((g) => !controlled.has(g) && g !== 'gates-fire' && g !== 'release')
const uncontrolled = rest.filter(canFail)
const generators = rest.filter((g) => !canFail(g))
if (uncontrolled.length) {
  console.log(`\n· ${controlled.size} of ${controlled.size + uncontrolled.length} release GATES have a negative control. Without one, trusted only because they pass:`)
  console.log('    ' + uncontrolled.join(' '))
}
if (generators.length) {
  console.log(`· ${generators.length} chain steps are GENERATORS, not gates — they exit 0 unconditionally, so there is nothing for them to reject:`)
  console.log('    ' + generators.join(' '))
}

console.log(broken
  ? `\n✗ gates-fire: ${broken} of ${checked} gate(s) do not reject what they exist to reject`
  : `\n✓ gates-fire: all ${checked} gates reject their control and pass a clean tree · working tree restored`)
process.exit(broken ? 1 : 0)
