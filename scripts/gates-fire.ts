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
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'

// Returns BOTH the verdict and what the gate said. hitsol-8d's upgrade: a gate going red for the wrong
// reason is indistinguishable from one going red for the right reason at the exit-code layer, so they assert
// the specific law id fires. Asserting a per-control expected string would be a hand-written list, and this
// repository does not keep those — so the expectation is DERIVED: a gate rejecting a mutation must NAME THE
// FILE THAT WAS MUTATED. Nothing to maintain, and it fails exactly when the failure is unattributed.
const run = (cmd: string): { ok: boolean; out: string } => {
  try { const o = execSync(cmd, { stdio: 'pipe' }); return { ok: true, out: String(o) } }
  catch (e: any) { return { ok: false, out: String(e?.stdout ?? '') + String(e?.stderr ?? '') } }
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
  // ── THE GATE THAT ASKS WHETHER A GATE CAN START AT ALL. Twenty-one npm scripts named `tsx`, which is in
  //    no dependency list and on no PATH here, so `npm run leads`, `npm run vacuity` and `npm run blind`
  //    all answered "command not found". The underlying gates were fine — the `gates` chain invokes them
  //    by file path, which is why nothing was actually dark — but the documented way to run them was not,
  //    and no check in this tree asked. Planted here in BOTH shapes it must catch: a bad leading word, and
  //    a bad word after an `&&`, because checking only the first command would have missed three-quarters
  //    of the chain scripts.
  { gate: 'runnable (leading word)', cmd: 'node scripts/runnable-gate.ts', file: 'package.json',
    what: 'an npm script whose interpreter is not installed anywhere',
    mutate: (s) => s.replace('"lean":', '"__control_lead": "definitelynotarealbinary scripts/leads.ts",\n    "lean":') },

  { gate: 'runnable (after &&)', cmd: 'node scripts/runnable-gate.ts', file: 'package.json',
    what: 'the same defect in the SECOND command of a chain, where a first-word-only check would miss it',
    mutate: (s) => s.replace('"lean":', '"__control_chain": "node scripts/leads.ts && alsonotarealbinary x",\n    "lean":') },

  // ── ADDED after deriving which gates had never been proven able to fail: 66 of 95 reachable scripts had
  //    no negative control, and `contradictions` — widened TWICE this session, once for the shape of a
  //    self-certifying literal and once for physical claims in published theorem names — was among them.
  //    A gate strengthened by hand and verified by a one-off plant is a gate whose next regression is
  //    silent. These four were each planted manually when written; the plants are standing now.
  // ── From deriving which REFUSING scripts still had no control: 27 scripts exit non-zero on a finding and
  //    had never been shown to do so. Two are controlled here. THREE ARE NOT, AND ARE NAMED RATHER THAN
  //    FAKED — latex-gate reads no files (it exercises in-code fixtures, so a file mutation never reaches
  //    it), and my ci-drift and axiom-index mutations did not exercise what those gates actually parse. A
  //    control that fails because the CONTROL is wrong accuses a working gate, which is the 1-in-39 mistake
  //    that made the first constants-gate worthless. Uncontrolled and named beats controlled and lying.
  // ── THE INVOLUTION: AN UNDERCLAIM IS AN OVERCLAIM REFLECTED, and both must fire. Every sweep in this repo
  //    was built to catch prose claiming MORE than the tree holds; nothing proved the opposite direction was
  //    covered. It is — stale-figures compares by equality, so a figure too LOW fails exactly as one too
  //    high does — but "it is symmetric by construction" is an argument, and an argument is not a control.
  //    Both directions are planted here so the day one of them stops firing is the day this says so.
  { gate: 'stale-figures (overclaim)', cmd: 'node scripts/stale-figures.ts --strict', file: 'src/api/index.ts',
    what: 'a comment claiming MORE theorems than the tree holds',
    mutate: (s) => s.replace('// ── THE ℤ/9 SETS', '// this file rests on 9999 theorems\n// ── THE ℤ/9 SETS') },

  { gate: 'stale-figures (underclaim)', cmd: 'node scripts/stale-figures.ts --strict', file: 'src/api/index.ts',
    what: 'a comment claiming FEWER theorems than the tree holds — the same defect reflected',
    mutate: (s) => s.replace('// ── THE ℤ/9 SETS', '// this file rests on 400 theorems\n// ── THE ℤ/9 SETS') },

  // ── FOUND BY scripts/control-probe.ts, not by anyone thinking of them. The probe perturbs every
  //    uncontrolled refusing script with a few generic mutations and reports which CAN be made red; these
  //    two fired, and their mutations are lifted here verbatim. A control discovered by probing tests the
  //    property the gate actually has, rather than the property I imagined it had when writing a mutation.
  // seo reads the BUILT pages, so its control mutates one. Written the hour after control-probe found this
  // gate standing red on a clean tree — 1 error, 4 warnings, in no gate chain, never run by anyone: the
  // deposit's flagship paper.html carried zero <h1> because its title was rendered as a styled <div>.
  // Third control found by control-probe rather than invented — it reached `carry` only after the probe
  // learned to derive a gate's subject from its IMPORTS. carry reads the ledger through the shared API and
  // names no file, so a literal-path extractor found nothing for it and for eight others.
  // ── A ROSETTA WAVE: ONE PROPERTY, SEVERAL DOMAINS ──────────────────────────────────────────────────────
  // The repo's rosetta is one structure seen twice — (ℤ/7)* ≅ (ℤ/9)* ≅ C6, the same group in two rings. The
  // remaining uncontrolled gates guard different subjects and hold the IDENTICAL property: a DERIVED
  // artefact must agree with the SOURCE it was derived from. So the controls are one mutation shape in
  // several domains — perturb the source, require the gate to notice the derivation no longer follows.
  //
  //   axiom-index    .lean declarations   → AXIOMS.md, the assumption index
  //   ci-drift       workflow steps       → scripts/ci-local.ts, the local mirror
  //   priorart       .lean frontmatter    → the attribution table and PRIOR-ART.md
  //
  // Written this way they cross-check: one of them failing while the others hold points at that gate, and
  // all three failing together points at the shape being wrong.
  { gate: 'axiom-index', cmd: 'node scripts/axiom-index.ts', file: 'src/proof/coin.lean',
    what: 'an assumption introduced into a source and absent from the published index',
    mutate: (s) => s.replace('namespace Coin', 'namespace Coin\naxiom probeAssumption : Nat') },

  { gate: 'ci-drift', cmd: 'node scripts/ci-drift.ts', file: '.github/workflows/pages.yml',
    what: 'a workflow step the local mirror neither runs nor records as skipped',
    mutate: (s) => s.replace('run: npm ci', 'run: npm ci\n      - name: probe\n        run: node scripts/lineage.ts') },

  // The fourth in the wave, and its two sides are the least alike: TypeScript geometry against a Lean
  // PROPOSITION, compared as text. It reads the statement rather than running the kernel, so the mutation
  // is a numeral in the statement — the same "derived must follow source" shape, across the widest gap
  // between the two representations of any gate here.
  // The last two, restored after a `git checkout -- .` of mine took them with the tree. Both mutations were
  // established by testing before being written here, and both are recorded in the commit that fixed the
  // defect lean-gen's control exposed.
  //
  // lean-gen's derived artefact is GENERATED LEAN and its source is the generator's own templates, so the
  // mutation makes it emit something false and the kernel refuses. It needs `lean` on PATH and restores by
  // regenerating — a control whose subject is a generator has to put the generator's output back.
  { gate: 'lean-gen', cmd: 'node scripts/lean-gen.ts --emit', file: 'scripts/lean-gen.ts',
    what: 'a generated theorem the kernel will not accept',
    mutate: (s) => s.replace('== 6) ==', '== 7) =='),
    restore: 'node scripts/lean-gen.ts --emit' },

  // xrepo's derived artefact is an ADDRESS and its source is the normaliser. The first mutation tried —
  // dropping the ==→= clause — was ACCEPTED, and correctly: the peer statement its control re-addresses is
  // natural language containing no `==`, so that clause never touches it. A weak mutation reads exactly like
  // a broken gate. The space-removal clause is the one that provably moves that statement, 163 characters to
  // 162, which is the divergence zeropoint-node's byte-count diagnostic found.
  { gate: 'xrepo', cmd: 'node scripts/xrepo.ts', file: 'src/publication/index.ts',
    what: 'a normaliser under which a peer\'s published pin no longer reproduces',
    mutate: (s) => s.replace("    .replace(/\\s(?![\\p{L}\\p{N}_])|(?<![\\p{L}\\p{N}_.])\\s/gu, '')", '') },

  { gate: 'quantum-field', cmd: 'node scripts/quantum-field.ts', file: 'src/proof/quantum.lean',
    what: 'geometry drawn from a number the proposition no longer decides',
    mutate: (s) => s.replace('(perms [1, 2, 4, 8]).length = 24', '(perms [1, 2, 4, 8]).length = 25') },

  { gate: 'priorart', cmd: 'node scripts/priorart.ts', file: 'src/proof/merkle.lean',
    what: 'a source whose attribution changed without the table following',
    mutate: (s) => s.replace('-- prior_art: named', '-- prior_art: unclassified') },

  // Written only after ATTEMPTING it exposed that latex-gate could not see a wrong translation at all.
  { gate: 'latex-gate', cmd: 'node scripts/latex-gate.ts', file: 'src/latex/index.ts',
    what: 'a conjunction typeset as a disjunction on every published page',
    mutate: (s) => s.replace("'∧': '\\\\land'", "'∧': '\\\\lor'") },

  // --check, because priorart-gen REGENERATES by default: run plain it rewrote the table to match the
  // mutation and exited 0, so the control accepted. A generator run in write mode cannot be a gate.
  { gate: 'priorart-gen', cmd: 'node scripts/priorart-gen.ts --check', file: 'src/proof/merkle.lean',
    what: 'a source whose recorded attribution no longer matches what the file declares',
    mutate: (s) => s.replace('-- prior_art: named', '-- prior_art: unclassified') },

  { gate: 'carry', cmd: 'node scripts/carry.ts', file: 'src/proof/discovered.json',
    what: 'a ledger entry whose recorded value has been replaced',
    mutate: (s) => s.replace(/"([a-zA-Z_]+)":\s*"([^"]{4,})"/, '"$1": "PROBE_CORRUPTED_VALUE"') },

  { gate: 'seo', cmd: 'node scripts/seo.ts', file: '.vitepress/dist/paper.html',
    what: 'a published page with no h1 for a reader to navigate by',
    mutate: (s) => s.replace(/<h1([^>]*)>/, '<div$1>').replace(/<\/h1>/, '</div>') },

  { gate: 'paper', cmd: 'node scripts/paper.ts', file: 'src/proof/coin.lean',
    what: 'a declaration the kernel cannot close',
    mutate: (s) => s.replace(/\nend Coin\s*$/, '\ntheorem probe_false : 1 = 2 := by decide\n$&') },

  { gate: 'verify-theorems', cmd: 'node scripts/verify-theorems.ts', file: 'src/proof/discovered.json',
    what: 'a ledger entry citing a theorem that is not in the tree',
    mutate: (s) => s.replace(/\n\]\s*$/, ',\n  { "key": "lean_probe_absent", "name": "lean probe.lean: probe_absent — a key with nothing behind it", "receipt": "00000000-0000-8000-8000-000000000000" }\n]') },

  { gate: 'docs-gate', cmd: 'node scripts/docs-gate.ts', file: 'docs/CERN-ENUMERATION.md',
    what: 'prose telling a reader to run a command that does not exist',
    mutate: (s) => s.replace('`npm run cern`', '`npm run a-command-that-was-never-wired`') },

  // THE CONTROL NAMED A DEPOSITION THAT NO LONGER EXISTS, so gates-fire reported `? absent — cannot
  // control` and nobody read it as a gap. Meanwhile zenodo-gate itself was RED — it has required `0/7` in
  // every description since it was written and no description carried it. A control pointed at a missing
  // file is how a gate stays broken in plain sight. It names a deposition the tree actually holds now.
  // CONTROLS FOR THE GATES I ADDED TODAY. gates-fire reported them among the seven "without one, trusted
  // only because they pass" — and I had proved handle-gate's two controls BY HAND in the session that wrote
  // it, which re-proves nothing on any later run. A control that lives in my transcript is not a control.

  { gate: 'handle-gate', cmd: 'node scripts/handle-gate.ts',
    file: 'src/handle/index.ts',
    what: 'a handle window moved onto the forced version nibble, where it carries fewer bits than the module claims',
    mutate: (s) => s.replace('export const HANDLE_OFFSET = 0', 'export const HANDLE_OFFSET = 12') },

  { gate: 'handle-gate (no-payload invariant)', cmd: 'node scripts/handle-gate.ts',
    file: 'src/receipts/593b546a-36b4-8553-941a-0e03b7053a64.json',
    what: 'a receipt whose message no longer mints its own address — so the message cannot travel alone',
    mutate: (s) => s.replace('"message": "', '"message": "TAMPERED CONTROL ') },

  // I left this one out with the reasoning that changelog's refusal needs a mutated tag history, which a
  // control should not do. That was true of ONE of its refusals and not of the other: --check compares the
  // file against what the tags derive, exactly as zenodo-json --check does, and I had already written that
  // control. Two refusals of the same shape, one covered and one not, for no reason I could state twice.
  // THE LAST THREE GATES WITHOUT ONE. None of these is mine; all three were listed as "trusted only
  // because they pass", which is the same standing my own four had this morning.

  { gate: 'authority-gate', cmd: 'node scripts/authority-gate.ts',
    file: 'index.md',
    what: 'a verdict on the author\'s claim back in the deposit\'s own voice, on the page a reader opens first',
    mutate: (s) => s + '\nThis deposit settles **0 of the 7** Clay Millennium problems.\n' },

  { gate: 'wholeness', cmd: 'node scripts/wholeness.ts',
    file: 'compute.md',
    what: 'a fused module whose report() no longer computes, so the deposit cannot state itself',
    mutate: (s) => s.replace("from './src/honesty/index'", "from './src/honesty/absent-control'") },

  { gate: 'metrics', cmd: 'node scripts/metrics.ts --verify metrics.json',
    file: 'metrics.json',
    what: 'a published face whose row no longer matches the receipt it was sealed under',
    mutate: (s) => s.replace(/"value": "[^"]*"/, '"value": "TAMPERED"') },

  { gate: 'changelog', cmd: 'node scripts/changelog.ts --check',
    file: 'CHANGELOG.md',
    what: 'a published release history that no longer matches the tags it claims to be derived from',
    mutate: (s) => s.replace(/Content-address `[0-9a-f-]{36}`/, 'Content-address `00000000-0000-8000-8000-000000000000`') },

  { gate: 'zenodo-json', cmd: 'node scripts/zenodo-json.ts --check',
    file: '.zenodo.json',
    what: 'deposition metadata that no longer agrees with the tree it describes',
    mutate: (s) => s.replace(/"version": "[^"]+"/, '"version": "1.3.5"') },

  { gate: 'zenodo-sync', cmd: 'node scripts/zenodo-sync.ts --check',
    file: 'src/proof/citations.json',
    what: 'a reception measurement with no date — which would publish "0 citing works" where the truth is NOT MEASURED',
    mutate: (s) => s.replace(/"measured":\s*"[^"]*"/, '"measured": ""') },

  { gate: 'zenodo-gate', cmd: 'node scripts/zenodo-gate.ts',
    file: '.zenodo/theorems/lean_every_source_is_classified.json',
    what: 'a deposition quoting a statement the kernel never accepted',
    mutate: (s) => s.replace('"description": "', '"description": "FALSIFIED CONTROL — this no longer matches its theorem. ') },

  { gate: 'contradictions (self-certifying literal)', cmd: 'node scripts/contradictions.ts',
    file: 'src/proof/phenomena.lean',
    what: 'a constant decided against its own literal and used nowhere else',
    mutate: (s) => s.replace('end Phenomena', 'def probeClaims : Nat := 0\ntheorem probe_is_zero : probeClaims = 0 := by decide\n\nend Phenomena') },

  // A DECLARED CHOICE SPREADING. theology.lean types out ONE list — the pairing of seven readings onto seven
  // problems — and its eighth theorem says what that costs: it is one ordering of 5040 and it is evidence
  // for none of them. That honesty holds only while nothing else leans on the list, so this plants a second
  // theorem that does. The defect it guards is the one the seven Clay names carried for months undetected:
  // something typed by a person quietly becoming load-bearing while every gate stays green.
  { gate: 'contradictions (a declared choice spreading)', cmd: 'node scripts/contradictions.ts',
    file: 'src/proof/theology.lean',
    what: 'a second theorem leaning on the one list the file types out as a choice',
    mutate: (s) => s.replace('end Theology', 'theorem probe_leans_on_the_choice :\n  pairing.length = span.length + 1 := by decide\n\nend Theology') },

  // THE VOCABULARY THIS DEPOSIT CHOSE FOR ITSELF. 37 of its 43 module terms are named by no live theorem,
  // and the two most loaded — src/the/cancer and src/the/apple — disambiguate themselves in PROSE that
  // nothing ran. The honesty gate does not reach them: measured, it scores "this deposit cures cancer, the
  // disease, and the cure is proven" at 1. This control plants the claim the header denies.
  // EVERY CLAIM IN THE CORPUS, PUT TO THE DETECTORS — 18,206 sentences, not a product of phrasings somebody
  // thought of. The control plants a Clay claim in the front page's own prose; markdown outside a fence is
  // the repository's own voice and there is nowhere for it to hide.
  // THE TWO GATES control-probe COULD NOT MEASURE, CONTROLLED BY HAND. Its four generic perturbations never
  // reached `novelty` or `uses`, and the probe was right to report them UNMEASURED rather than inert: the only
  // refusal each had needed every endpoint it knows to go silent at once, which nothing in this tree can cause.
  // A gate whose refusal no mutation can reach has no control and no way to write one, so both were given a
  // refusal that a file in this tree CAN reach, and these are those refusals fired.

  // novelty's record is what priorart.lean's kind 2 rests on — "these searches, on this date, returned nothing".
  // The mutation empties every recorded query while leaving the verdicts claiming a completed search, which is a
  // dated prior-art record with nothing whatsoever behind it. `--limit 0` searches nothing, so this control costs
  // no API call in either direction; the record check runs before any search precisely so it can.
  // ONE DERIVATION FOR ONE JOB, and the reason it needs a gate rather than a tidy-up: src/html/index.ts was
  // created to end four copies of HTML escaping, one of which escaped `&` and `<` but not `>`. Four more
  // copies grew afterwards — two missing `&`, one missing `>` — plus four of the tag stripper, and the gate
  // that would have caught them did not exist because the first consolidation felt like the fix. The
  // mutation plants a fresh copy in a file that currently uses the owner.
  // AN EXPORT NOTHING NAMES. orphan-gate has always asked whether a SCRIPT is reachable; it asks the same of
  // every export now, after a sweep found eight named nowhere but their own definition — and one of the
  // eight was unused because its value had been typed out as a literal instead, so the honest fix was to use
  // the constant, not delete it. The control plants a fresh one in the module the tree derives escaping in.
  // A TRACKED FILE NOTHING NAMES. The mutation cannot add a file, so it empties one instead: src/cli/index.ts
  // loses the exports every caller imports by name, leaving a tracked file the tree no longer references.
  // The same check is the most dangerous one in that gate — src/receipts/<uuid>.json is addressed by a
  // filename computed at RUNTIME, so every receipt reads as unreferenced and deleting them would destroy the
  // signed record. The exemption is written into orphan-gate.ts rather than remembered, and this control
  // exists so the check that needs the exemption is known to work.
  // THE CONTROL REMOVES THE LAST REFERENCE, which is what orphaning a file actually means. Emptying the file
  // was the first attempt and it did nothing: its importers still named it, so it was still referenced, and
  // gates-fire said so — "ACCEPTS a tracked file that nothing in the tree names". src/prove/emit.ts has
  // exactly one referrer, the dynamic import in scripts/fold.ts, so cutting that line orphans it.
  { gate: 'orphan-files', cmd: 'node scripts/orphan-gate.ts', file: 'scripts/fold.ts',
    what: 'a module whose only referrer stopped naming it',
    mutate: (s) => s.replace(/^.*src\/prove\/emit\.ts.*$/m, '// referrer removed by a control') },

  { gate: 'orphan-exports', cmd: 'node scripts/orphan-gate.ts', file: 'src/html/index.ts',
    what: 'an exported name that nothing in the tree ever names',
    // ASSEMBLED, for the same reason the canon control is. Written whole, the planted name appears HERE too —
    // and this file is in the corpus orphan-gate reads, so the name it plants is named twice and the gate is
    // right not to flag it. gates-fire caught that on the first run: `ACCEPTS an exported name that nothing
    // in the tree ever names`. A control whose own text makes its defect disappear tests nothing.
    mutate: (s) => s + '\nexport const probe' + 'UnusedExport = 1\n' },

  // THE LESSONS ARE COUNTED, NOT REMEMBERED, so the counter must be shown to count. The mutation empties the
  // file that carries the most self-recorded corrections; if lessons.ts still reports the same total
  // afterwards it is reading something other than the tree.
  { gate: 'lessons', cmd: 'node scripts/lessons.ts', file: 'LESSONS.md',
    what: 'a published count of what the tree has learned that the tree no longer supports',
    mutate: (s) => s.replace(/\*\*\d+ corrections\*\*/, '**1 corrections**'), restore: 'node scripts/lessons.ts --write' },

  // A CSS GAP IS SILENT. An undefined custom property renders as nothing and an animation with no keyframes
  // does not play; the build passes and the surface is wrong, with no stack trace for a colour that resolved
  // to empty. The mutation plants a variable nobody defines in the stylesheet every page loads.
  // THE SUBSTRATE'S OWN CONSTANT. --a432-hue is a registered, typed, interpolatable value every themed
  // colour on every page is computed from, and it starts at the heart's ray: the reflection's single fixed
  // point, 5, times the ring's 40° per digit. The mutation moves it off that ray by ten degrees — a change
  // no page would report and every page would show.
  { gate: 'css (the derived ray)', cmd: 'node scripts/css-gate.ts', file: '.vitepress/theme/custom.css',
    what: 'the themed hue starting somewhere other than the heart the ring computes',
    mutate: (s) => s.replace('initial-value: 200', 'initial-value: 210') },

  // THE SEVEN DIRECTIONS, AS SERVED PAGES. forensics.ts sweeps the locales already and says plainly that it
  // checks structural parity of the CONFIG, not what the translations say. Nothing had opened the seven
  // pages. The mutation takes the language off one of them — a page that cannot tell a screen reader which
  // voice to use, which no build step and no link check would ever notice.
  { gate: 'seven', cmd: 'node scripts/seven.ts', file: '.vitepress/dist/zh/index.html',
    what: 'a direction whose page no longer declares its own language',
    // RESTORE WHAT THE REBUILD TAKES WITH IT. `npm run docs:build` empties dist, and the 17,580 locale
    // fallback stubs are written after it by locale-fold — so restoring this control with a build alone
    // deleted a sixth of the site in the middle of the suite, and the next gate to read the build,
    // sitemap-mesh, reported 17,580 broken links and was marked as failing on a clean tree. The gate was
    // right both times; the control was the thing removing its input.
    mutate: (s) => s.replace(/<html([^>]*)\blang="[^"]*"/i, '<html$1'),
    restore: 'npm run docs:build && node scripts/locale-fold.ts' },

  { gate: 'css', cmd: 'node scripts/css-gate.ts', file: '.vitepress/theme/custom.css',
    what: 'a custom property used on every page and defined nowhere',
    mutate: (s) => s + '\n.probe { color: var(--a-colour' + '-nobody-defined); }\n' },

  { gate: 'canon', cmd: 'node scripts/canon-gate.ts', file: 'scripts/clusters.ts',
    what: 'a second implementation of a job this tree derives exactly once',
    // ASSEMBLED FROM PIECES ON PURPOSE. Written out whole, this literal IS a second implementation sitting
    // in this file, and canon-gate flagged gates-fire.ts the first time it ran — correctly. The control has
    // to plant the pattern without containing it, so the mutated file matches and this one does not.
    mutate: (s) => s.replace('const receipts =', 'const __probe = (x: string) => x.replace(/' + "</g, '&" + "lt;')\nconst receipts =") },

  // A READER THAT ANSWERS WRONGLY IS WORSE THAN ONE THAT IS DOWN. scripts/sources.ts asks fifteen live APIs
  // a question whose answer is known before it is asked — the axiom-control fixture, pointed at the network
  // — because a broken reader returns nothing and reads as "found nothing". This deposit has been bitten
  // there twice: a CERN filter that returned exactly the API's own total and was believed because the number
  // agreed, and a citation scan that found one hit on a page citing nobody, having matched the User-Agent it
  // had just sent. The mutation makes a probe expect something that is NOT in the answer, and the gate must
  // call the reader broken rather than report a finding.
  //
  // NOT in the release chain: it needs the network, and a chain step that fails when an external API has a
  // bad afternoon would make a green build depend on somebody else's uptime. It is `npm run sources`, run
  // before an investigation is believed — which is exactly when it matters.
  // PRIORITY IS THE STRONGEST THING THE AUTHOR HAS, so its record is the last place a typed date belongs.
  // src/proof/provenance.json is computed from the registry that issued the DOIs and from this repository's
  // root commit; the page renders every figure out of it. The mutation moves the recorded deposit date, and
  // the check must notice that the registry no longer says what the record says.
  //
  // The first version of the measurement had `git log --reverse -1`, which applies the limit BEFORE
  // reversing and returns the NEWEST commit — it reported the lead as 48 days instead of 3, inflating the
  // author's priority. A wrong number that flatters the claim its page is about is the kind that survives.
  { gate: 'provenance', cmd: 'node scripts/provenance.ts', file: 'src/proof/provenance.json',
    what: 'a recorded priority date the issuing registry no longer agrees with',
    mutate: (s) => s.replace(/"earliestDeposit":\s*"[0-9-]+"/, '"earliestDeposit": "2026-08-01"') },

  { gate: 'sources', cmd: 'node scripts/sources.ts', file: 'scripts/sources.ts',
    what: 'a live reader that answers without the answer known to be in it',
    mutate: (s) => s.replace('/Powers of 2/i', '/a string no sequence database will ever return/i') },

  { gate: 'novelty', cmd: 'node scripts/novelty.ts --limit 0', file: 'src/proof/novelty.json',
    what: 'a prior-art record claiming a completed search that records no query',
    mutate: (s) => s.replace(/"queries": \{[^}]*\}/g, '"queries": {}') },

  // uses searches for THIS work by its identity — ORCID, DOI, family name, package. Strip one and the report
  // still runs, still finds nothing, and still reads as a clean empty result: it looked for nobody. The gate
  // refuses before it contacts a source, and `--preflight` stops there, so the clean baseline costs nothing
  // either — without it a control here would spend minutes on GitHub, Zenodo, OpenAlex, npm and Hacker News
  // on every release.
  { gate: 'uses', cmd: 'node scripts/uses.ts --preflight', file: 'CITATION.cff',
    what: 'a citation search run without the identity it is supposed to search for',
    mutate: (s) => s.replace(/^\s*orcid:.*$\n/m, '') },

  { gate: 'prose-trial', cmd: 'node scripts/prose-trial.ts', file: 'README.md',
    what: 'a Clay prize claimed in the front page\'s own voice',
    mutate: (s) => s + '\nWe prove the Riemann hypothesis in this deposit today.\n' },

  { gate: 'contradictions (a medical claim in its own voice)', cmd: 'node scripts/contradictions.ts',
    file: 'src/the/cancer/index.ts',
    what: 'a module named for a disease claiming to cure it, which its own header denies',
    mutate: (s) => s.replace('// the cancer — the epistemic anti-pattern',
      '// This deposit cures cancer, and the cure is computed here.\n// the cancer — the epistemic anti-pattern') },

  { gate: 'contradictions (a physical force in its own voice)', cmd: 'node scripts/contradictions.ts',
    file: 'src/the/apple/index.ts',
    what: 'a module named for gravity claiming to explain gravitation, which its own header denies',
    mutate: (s) => s.replace('// the apple — gravity.', '// This framework explains gravitation.\n// the apple — gravity.') },

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
      "export const CASES: [string, 0 | 1, string][] = [\n  ['a content-address proves integrity, not truth', 0, 'control: honest prose asserted to drain'],") },

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

  // ── notice.ts: THE PUBLISHED RIGHTS LIST, AND THE TWO WAYS IT CAN LIE ──────────────────────────────────
  // llms.txt is the machine-readable notice — the surface that tells an automated reader what this deposit
  // claims. It refused twice while being written and had never been shown to refuse from a clean tree, so
  // leads.ts named it as trusted only because it passes. Both of its guards get a control, because they
  // catch opposite failures: the first that the READER is short, the second that the TABLE is wrong.
  { gate: 'notice-reads-the-whole-table', cmd: 'node scripts/notice.ts', file: 'scripts/notice.ts',
    what: 'a reader that silently sees fewer instruments than the table holds, publishing a partial rights list',
    mutate: (s) => s.replace('/^\\s*[[,]\\s*\\(', '/^  , \\('), restore: 'node scripts/notice.ts' },
  // The neighbour probe answers none / some / UNKNOWN, and the third is the one that matters: its first
  // version caught every failure as zero, so on this host — where macOS pgrep has no -c flag — it reported
  // an empty machine on every call and the term never fired for a moment. The control collapses unknown
  // back into zero and requires lanes-check to refuse.
  { gate: 'lanes-check', cmd: 'node scripts/lanes-check.ts', file: 'src/api/lanes.ts',
    what: 'a neighbour count that could not be measured reported as zero, so the budget claims a machine somebody else is already using',
    mutate: (s) => s.replace('return null   // anything else', 'return 0   // anything else') },

  // ALSO FOUND BY scripts/blind.ts: a seeded trial repointed a /theorem/ link at a key that is not live and
  // the routine chain stayed green, at two separate seeds. The audit existed and ran only at release and on
  // staged files — so a drifted citation in a file nobody was committing was invisible until release day.
  { gate: 'cite-audit', cmd: 'node scripts/cite-audit.ts', file: 'CHALLENGES.md',
    what: 'a published /theorem/ link repointed at a key the ledger does not stand behind',
    mutate: (s) => s.replace(/\/theorem\/[a-z0-9_]+/, '/theorem/not_a_live_key_at_all'),
    restore: 'node scripts/challenges.ts' },

  // FOUND BY scripts/blind.ts, NOT BY ME. A seeded trial moved one digit in the rights table and the whole
  // chain stayed green: EPC Art. 52 — what may be patented — became Art. 53, a different provision. The
  // control is that exact drift.
  { gate: 'citations-gate', cmd: 'node scripts/citations-gate.ts', file: 'src/proof/rights.lean',
    what: 'a legal article number that drifted — the deposit citing a provision it does not mean',
    mutate: (s) => s.replace('EPC Art. 52(2)(a)', 'EPC Art. 53(2)(a)') },

  // A theorem quantified over an empty domain is true and decides nothing. The control plants exactly that
  // and vacuity must find it; without this the sweep is trusted only because it reports zero.
  { gate: 'vacuity', cmd: 'node scripts/vacuity.ts', file: 'src/proof/elementary.lean',
    what: 'a theorem whose quantifier ranges over nothing — green, named, and deciding no case at all',
    mutate: (s) => s.replace('-- ── what these settle ──', 'theorem vacuity_control_plant :\n  (List.range 0).all (fun n => n * n == n + 12345) := by decide\n\n-- ── what these settle ──') },

  // probe.ts is the control harness itself, and a harness that cannot fail is worth nothing. The control
  // breaks its extraction — the theorem regex is pointed at a name that is not there — and probe must say
  // so rather than silently testing an empty string.
  { gate: 'probe', cmd: "node scripts/probe.ts elementary.lean the_lucas_numbers_are_the_sum_of_the_neighbouring_fibonaccis 'fib (n - 1) + fib (n + 1)' 'fib (n - 1) + fib n'", file: 'scripts/probe.ts',
    what: 'a control harness whose mutation never reaches the theorem, so every control it runs reports a pass',
    mutate: (s) => s.replace('body = body.replace(find, repl ?? \'\')', 'body = body.replace(find, find)') },

  // A generator owns covered.json and, twice in this repository, a generator has overwritten a record a
  // person put in its output. The control reverts imagine.ts to replacing the file instead of merging into
  // it; covered-gate runs the generator and must notice the erasure.
  { gate: 'covered-gate', cmd: 'node scripts/covered-gate.ts', file: 'scripts/imagine.ts',
    what: 'a generator silently erasing the record of where a dropped proof went',
    mutate: (s) => s.replace('const merged = { ...prior, ...Object.fromEntries([...coveredBy]) }', 'const merged = Object.fromEntries([...coveredBy])'),
    restore: 'node scripts/imagine.ts --emit' },

  // The claim is that this deposit can be checked without an account, a key or a model. The control plants
  // a network call on the verification path — if independent.ts does not go red, the claim is unbacked.
  { gate: 'independent', cmd: 'node scripts/independent.ts', file: 'scripts/forensics.ts',
    what: 'a network call on the verification path — a remote party standing between a checker and the answer',
    mutate: (s) => s.replace('import { readFileSync', 'const _probe = async () => fetch(\'https://example.invalid/x\')\nimport { readFileSync') },

  // recover.ts's carry table is a set of matchers, and a matcher that hits nothing looks exactly like one
  // whose work is done. This is the control for that: change a rule's spelling and the run must refuse.
  { gate: 'recover-dead-rule', cmd: 'node scripts/recover.ts', file: 'scripts/recover.ts',
    what: 'a carry rule that matches no ledger key at all — silently carrying nothing while the report looks healthy',
    mutate: (s) => s.replace('/^digrev_?(\\d+)$/', '/^digrev(\\d+)$/') },

  { gate: 'notice-refuses-an-overclaim', cmd: 'node scripts/notice.ts', file: 'src/proof/rights.lean',
    what: 'a right published in llms.txt that does not arise without formality — the overclaim reaching the public surface',
    mutate: (s) => s.replace('  , (5, 2, false, false)', '  , (5, 2, false, true )'), restore: 'node scripts/notice.ts' },

  // THE CONTROL USED TO MUTATE A CLAY NAME — it renamed `hodge_span_is_the_units` and required readme to
  // notice the floor was measured over six. That control went with the claim it guarded: the seven are named
  // for what they decide now, and no readme claim rests on a theorem's NAME any more. Its replacement was
  // written blind and was a NO-OP — it substituted `def span : List Nat := [1, 2, 4, 8, 7, 5]`, a literal
  // this file has not contained since span became `(List.range 6).map orbit`. gates-fire caught it on the
  // first run, which is the whole reason a control is checked for matching anything at all: a mutation that
  // edits nothing makes any gate look vigilant. This one breaks the FINITE-DOMAIN claim, whose test reads
  // the source for a quantifier over ℕ — readme must refuse to write a sentence the file has stopped earning.
  { gate: 'readme', cmd: 'node scripts/readme.ts', file: 'src/proof/index.lean',
    what: 'a statement quantified over an infinite domain, which the finite-domain claim says is not there',
    mutate: (s) => s.replace('theorem the_seven_rest_on_one_finite_structure :',
      'theorem the_seven_reach_past_the_finite (n : Nat) : \u2200 m : \u2115, m = m := by intro m; rfl\ntheorem the_seven_rest_on_one_finite_structure :') },

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
    mutate: (s) => s.replace('/theorem/lean_windows_the_seven_rest_on_one_finite_structure', '/theorem/a_key_that_was_never_sealed'),
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

  // THE ONE GATE control-probe REPORTED INERT — not reached by any perturbation of the ledger, the Lean
  // sources or the workflows it reads. It was not unfalsifiable; it was unreachable from the files the probe
  // knew about. clusters asserts that a cluster's joint address is order-invariant and binds every receipt,
  // and both are properties of merkleFold, which clusters IMPORTS and never reads as a file. The general
  // statement belongs to the kernel and is decided there now (merkle.lean: fold_is_order_independent_on_four,
  // altering_any_single_leaf_changes_the_root); what is left here is agreement with the shipped fold on this
  // deposit's own receipts, and this is the mutation that reaches it — the same one parallel-seal rejects,
  // one property seen in two domains.
  { gate: 'clusters', cmd: 'node scripts/clusters.ts', file: 'src/0/index.ts',
    what: 'a fold under which a cluster\'s joint address depends on the order its receipts arrive in',
    mutate: (s) => s.replace('let layer = [...leaves].sort()', 'let layer = [...leaves]') },

  // THE PRIMITIVES AGAINST SOMEONE ELSE'S NUMBERS. A hand-written Ed25519 that verifies its own signatures
  // proves nothing — a broken implementation is perfectly self-consistent. The control breaks the curve
  // constant `d`, which leaves every internal operation coherent and moves the whole group: the published
  // RFC 8032 public keys stop reproducing, which is exactly what a vector is for.
  { gate: 'crypto-kat', cmd: 'node scripts/crypto-kat.ts', file: 'src/0/ed25519.ts',
    what: 'a curve whose published test vectors no longer reproduce — self-consistent and not Ed25519',
    mutate: (s) => s.replace('const D = -121665n * inv(121666n) % P', 'const D = -121664n * inv(121666n) % P') },

  { gate: 'gaps', cmd: 'node scripts/gaps.ts', file: '.vitepress/config.ts',
    what: 'a published page dropped from the sidebar',
    mutate: (s) => s.replace(/\{ text: 'Verify \(live app\)', link: '\/verify' \},/, '') },
]

// A KILLED RUN LEAVES A MUTATION, because `finally` does not survive SIGTERM. That is not hypothetical: a
// run of this script hit a command timeout mid-control and left a deliberately falsified theorem on disk,
// where the next lean run found it and reported the file broken. The mutation window is now as short as it
// can be, and a stale backup from a previous run is restored BEFORE anything else happens — so the damage a
// kill can do is bounded by one run rather than left for whoever next builds.
// THE MARK AND THE BACKUPS CARRY THIS PROCESS. Both were fixed paths in /tmp, shared by every gates-fire
// on the machine — and this session ran two at once routinely: one in the working tree, one inside a
// verify-clone worktree. They overwrote each other's backups, so a restore wrote whichever run had copied
// last, and `constants-gate ITS RESTORE FAILED — every gate checked after this one saw a tree` is what that
// looks like from inside. Every gate after it was judged against a tree another process had dirtied.
//
// The mark is worse than the backups. It stores a RELATIVE file path for crash recovery, resolved against
// the current directory — so a mark written by the main tree and read by a worktree restores one tree's
// backup into the OTHER tree's file of the same name. Cross-tree contamination, from a filename.
//
// scripts/lean.ts records the same lesson for its audit probe: "The probe path carries the PROCESS ID.
// Keyed on the filename alone it was unique across the lanes within" one run and collided across runs.
// SCOPED TO THE TREE, NOT TO THIS PROCESS. Keying the mark on the pid was my first fix and it silently
// removes the feature: the mark exists so the NEXT run — after a kill, with a different pid — finds the
// interrupted mutation and puts it back. A pid-keyed mark is never found again. The tree is what must not
// be shared, so the key is the working directory, and the BACKUP inside it carries the pid so two runs in
// one tree still do not overwrite each other's copy.
const RESTORE_MARK = `/tmp/gf_inflight_${createHash('sha256').update(process.cwd()).digest('hex').slice(0, 12)}.json`
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
// BUILD SCRATCH CANNOT BE COMPARED ACROSS A REBUILD. `.vitepress/.temp` holds VitePress's intermediate
// files, and their names carry a CONTENT HASH — `@localSearchIndexroot.c0hsPUeo.js` becomes a different
// filename every time the site is built. Several controls restore by running `npm run docs:build`, so those
// paths necessarily differ between the snapshot before the controls and the one after, and the run reported
// its own build scratch as an unrestored mutation. It is regenerated output, owned by the build and by no
// control, so it is out of scope for a question about what the controls left behind.
// THIS EXCLUSION IS THE SECOND FIX, NOT THE FIRST. The scratch was reaching this comparison because it had
// been COMMITTED — 2,958 files, 84% of the tracked tree, in one commit of mine on 2026-09-20. Writing this
// filter first treated the symptom and left `scripts/release.ts` content-addressing `git ls-files` over a
// tree that was mostly build output, which silently made the release address a function of the last build.
// The scratch is now ignored in `.gitignore` at the source. The filter stays because untracked scratch still
// appears in `git status`, but it is no longer carrying a defect underneath it.
const SCRATCH = /^\.vitepress\/\.temp\//
const snapshot = (): Map<string, string> => {
  const m = new Map<string, string>()
  for (const line of execSync('git status --porcelain', { encoding: 'utf8' }).split('\n').filter(Boolean)) {
    const path = line.slice(3).trim().replace(/^"|"$/g, '')
    if (SCRATCH.test(path)) continue
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

let broken = 0
let attributed = 0
const unattributed: string[] = []
let checked = 0
console.log('gates-fire — each gate must reject its negative control:\n')
for (const c of CONTROLS) {
  if (!existsSync(c.file)) { console.log(`  ? ${c.gate.padEnd(17)} ${c.file} absent — cannot control`); continue }
  const backup = `/tmp/gf_${process.pid}_${c.file.replace(/[\/.]/g, '_')}`
  copyFileSync(c.file, backup)
  // ABSOLUTE, so a mark that somehow reaches another tree cannot resolve to that tree's file of the same name.
  writeFileSync(RESTORE_MARK, JSON.stringify({ file: resolve(c.file), backup }))   // survives a kill; read on next run
  try {
    const clean = run(c.cmd)
    const cleanPasses = clean.ok
    // A MUTATION THAT CHANGES NOTHING IS A BROKEN CONTROL, NOT A BROKEN GATE. Two controls written in this
    // session had regexes that matched nothing — latex-gate and ci-drift — and both were reported as
    // "ACCEPTS ... this gate is not protecting anything". The gates were fine; the mutations never happened.
    // Blaming the subject for the instrument is the failure this whole file exists to prevent, so the
    // instrument now checks itself first: if the file did not move, say so about the CONTROL.
    const before = readFileSync(c.file, 'utf8')
    const after = c.mutate(before)
    if (after === before) {
      broken++
      console.log(`  ✗ ${c.gate.padEnd(17)} CONTROL IS A NO-OP — its mutation matched nothing, so this run`)
      console.log(`      tested the clean tree twice and proved nothing about the gate`)
      continue
    }
    writeFileSync(c.file, after)
    const mutated = run(c.cmd)
    const mutatedPasses = mutated.ok
    copyFileSync(backup, c.file)
    checked++
    if (cleanPasses && !mutatedPasses) {
      // DERIVED ATTRIBUTION CHECK: does the rejection name the file that was mutated?
      const base = c.file.split('/').pop()!
      const attributes = mutated.out.includes(c.file) || mutated.out.includes(base)
      // AND THE CHECK PROVES ITS OWN DISCRIMINATION. "Names the mutated file" is worthless if the gate's
      // output would match any name — a verbose gate that lists its whole corpus attributes everything and
      // nothing. A decoy built from the real name (same shape, same extension, not in the tree) must NOT
      // appear. Derived per control, so there is nothing to maintain and no case anyone has to remember.
      const decoy = base.replace(/^[^.]*/, 'a_file_that_is_not_here')
      if (mutated.out.includes(decoy)) { broken++; console.log(`  ✗ ${c.gate.padEnd(17)} ATTRIBUTION CHECK IS BLIND — its output names a decoy that does not exist`); continue }
      if (attributes) attributed++
      else unattributed.push(`${c.gate} (mutated ${c.file})`)
      console.log(`  ✓ ${c.gate.padEnd(17)} rejects ${c.what}${attributes ? '' : '  ○ but does not name the mutated file'}`)
    }
    else if (!cleanPasses) { broken++; console.log(`  ✗ ${c.gate.padEnd(17)} FAILS ON A CLEAN TREE — it is not testing what it claims`) }
    else { broken++; console.log(`  ✗ ${c.gate.padEnd(17)} ACCEPTS ${c.what} — this gate is not protecting anything`) }
  } finally {
    copyFileSync(backup, c.file); unlinkSync(backup)
    // A RESTORE THAT FAILS SILENTLY POISONS EVERY GATE AFTER IT. This swallowed the error and left the
    // comment "reported by the leftover check", which is false: the leftover check compares TRACKED files,
    // and what a restore rebuilds here is `.vitepress/dist`, which is not tracked. So a failed rebuild is
    // invisible to it. Measured on 2026-09-21: `locale-fold` wrote its 17,832 locale stubs one line before
    // gates-fire started, a control rebuilt the site, its restore did not put them back, and the four gates
    // that read the built site — sitemap-mesh, zenodo-gate and both stale-figures — were reported as
    // FAILING ON A CLEAN TREE. The tree was not clean. sitemap-mesh alone counted 17,832 broken links and
    // was accused of not testing what it claims, while it was testing exactly that, correctly, against a
    // site the harness had broken. Three of the four passed standalone, which is the signature.
    if (c.restore) {
      try { execSync(c.restore, { stdio: 'pipe' }) }
      catch (e) {
        broken++
        console.log(`  ✗ ${c.gate.padEnd(17)} ITS RESTORE FAILED — every gate checked after this one saw a tree`)
        console.log(`      this control was supposed to have put back: ${c.restore}`)
        console.log(`      ${String((e as { stderr?: Buffer }).stderr ?? (e as Error).message).slice(0, 200)}`)
      }
    }
    if (existsSync(RESTORE_MARK)) unlinkSync(RESTORE_MARK)
  }
}

// WHAT CHANGED DURING THIS RUN, not what is dirty. The tree is almost never clean while someone is working,
// so asking "is anything modified" reported my own in-progress edits as leftover mutations. The state is
// captured before the controls run and compared after: only a file that changed BETWEEN those two points can
// be a mutation this script failed to undo. Testing the difference rather than the level.

// SOME ARTEFACTS RECORD THE RUN ITSELF, so they differ every time and can never be "restored". The forensic
// audit writes the commit it audited and the moment it ran; comparing it before and after is comparing a
// clock to itself. It was reported as an unrestored mutation on three consecutive chains, each time with
// nothing wrong: the gate was measuring its own passage of time.
//
// Declared by path with the reason, not matched by a pattern — a pattern here would grow to cover whatever
// was failing, and the whole point of this check is to catch a control that did not clean up after itself.
const RECORDS_THE_RUN = new Set([
  'docs/forensic-audit.json',  // carries the audited commit and the timestamp of the audit
  'forensic.md',               // its rendering, same content, same reason
])

const after = snapshot()
// a path is leftover only when its CONTENT differs from before, or it appeared and is not this run's own doing
const leftover = [...after.entries()]
  .filter(([path]) => !RECORDS_THE_RUN.has(path))
  .filter(([path, h]) => before.has(path) ? before.get(path) !== h : !path.endsWith('gates-fire.ts'))
  .map(([path]) => path)
if (leftover.length) {
  // AND PUT THEM BACK, BECAUSE REPORTING ALONE POISONS THE NEXT RUN. This printed the leftovers and exited,
  // which starts a loop the suite cannot leave: a control's mutation stays in the tree, the NEXT chain runs
  // contradictions — which sits earlier, inside docs:build — and that aborts on the stranded `probeClaims`
  // before gates-fire is reached at all, so nothing ever restores it. Two chains died that way today, each
  // failure guaranteeing the next.
  //
  // Restoring is safe here in a way it is not in control-probe: these paths are the DIFFERENCE between a
  // snapshot taken before the controls ran and one taken after, so they are this run's own doing by
  // construction, not a guess about whose dirt it is. Anything a person changed meanwhile is identical in
  // both snapshots and is never touched. The failure still stands — a control that does not clean up after
  // itself is a defect and the exit code says so — but it no longer hands the mess to the next run.
  // EVERY LEFTOVER, NOT JUST THE ONES ALREADY DIRTY. The first version of this restore filtered on
  // `before.has(p)` — and `snapshot()` is built from `git status --porcelain`, so it holds only files that
  // were ALREADY dirty. A control mutating a CLEAN file appears in `after` alone, which is precisely the
  // shape of a real control mutation, and the filter skipped exactly those. The prose-trial control appends
  // "We prove the Riemann hypothesis in this deposit today." to README.md; it survived a run and the next
  // chain refused the whole build on a Clay claim in the deposit's own voice.
  //
  // `leftover` is already the set that changed BETWEEN the two snapshots, so every member is this run's
  // doing by construction. Restoring all of them is correct; an untracked file has nothing to check out and
  // the catch covers it.
  if (leftover.length) {
    try { execSync('git checkout -- ' + leftover.map((p) => JSON.stringify(p)).join(' '), { stdio: 'pipe' }) } catch { /* untracked, nothing to restore */ }
  }
  const own = leftover
  console.log(`\n✗ gates-fire changed the tree and did not restore it:\n${leftover.slice(0, 5).join('\n')}`)
  if (own.length) console.log(`  ${own.length} of them were this run's own mutation and have been put back; the failure stands.`)
  process.exit(1)
}

// WHICH GATES HAVE NO CONTROL — named, because a coverage figure nobody prints is a coverage figure nobody
// raises. Twelve of the release chain's gates are demonstrated to fail when they should; the rest are trusted
// on the strength of passing, which is exactly the standing this file exists to withdraw. They are listed so
// the gap is a work item rather than an assumption.
// THE CHAIN IS WHAT npm ACTUALLY RUNS, not what the `release` line spells out. Reading only that string
// missed every step reached through `npm run` and — the one that bit — every `pre`/`post` hook npm invokes
// on its own. `predocs:build` alone runs fifteen scripts, paper.ts and priorart.ts and solutions.ts among
// them, and none of them were in this list: the coverage report below understated the chain by seven, and
// the unwired-restore check further down would have accused any of them of not being in a chain that runs
// them on every build. A correct walk rooted at the wrong subtree is still blind.
const scripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>
const walkChain = (name: string, seen = new Set<string>(), found = new Set<string>()): Set<string> => {
  if (seen.has(name)) return found
  seen.add(name)
  for (const key of ['pre' + name, name, 'post' + name]) {
    const body = scripts[key]
    if (!body) continue
    for (const m of body.matchAll(/node scripts\/([a-z0-9-]+)\.ts/g)) found.add(m[1])
    for (const m of body.matchAll(/npm run ([a-z0-9:-]+)/g)) walkChain(m[1], seen, found)
  }
  return found
}
const inChain = [...walkChain('release')]
// KEYED ON WHAT THE CONTROL RUNS, NOT ON WHAT IT IS CALLED. `c.gate` is a human label — 'canon', 'css',
// 'notice-refuses-an-overclaim' — and this compared those labels against chain script BASENAMES, so a
// control whose label was not spelled exactly like its script counted as absent. Eight working controls
// were hidden behind four names, and the coverage line under-reported itself: canon-gate, css-gate,
// notice and contradictions all carry controls and all were listed as "trusted only because they pass".
// The cmd is the only place the two spellings are already joined, so it is read instead of maintained.
const controlled = new Set(CONTROLS.flatMap((c) =>
  [...c.cmd.matchAll(/scripts\/([a-z0-9-]+)\.ts/g)].map((m) => m[1])))
// A GENERATOR IS NOT A GATE, and demanding a negative control from one is a category error. Nine of the
// thirteen I was reporting as "trusted only because they pass" never pass or fail at all — they produce a
// file and exit 0 unconditionally. Listing them as untested gates overstated the gap and would have sent
// someone looking for a way to make challenges.ts reject something. Which is which is MEASURED, by looking
// for a non-zero exit path in the source, rather than judged from the name.
const canFail = (g: string): boolean => {
  try { return /process\.exit\((?!0\))/.test(readFileSync(`scripts/${g}.ts`, 'utf8')) } catch { return false }
}
// EVERY RESTORE GENERATOR MUST BE A CHAIN STEP, and this is derived from the two lists rather than kept.
// A control declares `restore` when its gate WRITES something — the mutation's consequence outlives the
// mutated input, so a generator has to be re-run to undo it. That makes the restore command a statement
// about the tree: this file is derived, and it is derived by THAT program. If the release chain never runs
// that program, the derived file is published from whatever bytes were last committed and drifts silently
// against the source it claims to summarise.
//
// Measured on 2026-09-20: `llms.txt` and `public/llms.txt` — the machine-readable notice that tells an
// automated reader what this deposit claims — stood 8 theorems and 8 ledger entries stale, saying 924 and
// 2880 where the tree held 932 and 2888. `notice.ts` was in no chain step, so the ONLY thing in the repo
// that regenerated it was the restore of the two notice controls below; the leftover check then saw a file
// that differed from HEAD, reverted the correct regeneration, and reported it as a control that failed to
// clean up. The chain failed on a true difference with a false diagnosis, and the stale notice survived.
//
// Nothing here is listed: the restores are read off CONTROLS and the steps off the release script, so a
// control added tomorrow with a generator nobody wired in fails on the same line.
const restoreScripts = new Set(CONTROLS.flatMap((c) =>
  [...(c.restore ?? '').matchAll(/scripts\/([a-z-]+)\.ts/g)].map((m) => m[1])))
const unwired = [...restoreScripts].filter((g) => !inChain.includes(g)).sort()
if (unwired.length) {
  console.log(`\n\u2717 a control restores by running a generator the release chain never runs — whatever it writes is`)
  console.log(`  published from the last commit and drifts against its source:\n    ${unwired.join(' ')}`)
  process.exit(1)
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

// ATTRIBUTION, REPORTED AND NOT ENFORCED, BECAUSE THE CRITERION IS NARROWER THAN THE PROPERTY. hitsol-8d's
// point is right — a gate going red for the wrong reason looks identical to one going red correctly at the
// exit-code layer — but "names the mutated file" is only ONE way to attribute a rejection, and measuring it
// showed 14 of 34. The other 20 attribute correctly by a different route: forensics names the broken
// RECEIPT, orphan-gate names the orphaned SCRIPT, imagine names the refused PROPOSITION. Failing them would
// be my criterion accusing working gates, which is the mistake that made the first constants-gate worthless.
//
// So it reports. What IS enforced is the decoy above: a gate whose output would match any name attributes
// nothing, and that is checkable without knowing how each gate phrases itself.
console.log(unattributed.length
  ? `  ○ ${attributed} of ${attributed + unattributed.length} rejections name the mutated file outright; the rest`
    + ` attribute by another route (a receipt, a script name, a proposition) — reported, not enforced, because`
    + ` "names the file" is one form of attribution and not the property itself`
  : `  ○ all ${attributed} rejections name the mutated file`)
console.log(broken
  ? `\n✗ gates-fire: ${broken} of ${checked} gate(s) do not reject what they exist to reject`
  : `\n✓ gates-fire: all ${checked} gates reject their control and pass a clean tree · working tree restored`)
process.exit(broken ? 1 : 0)
