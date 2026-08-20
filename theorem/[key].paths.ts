// Dynamic route: one page per theorem (a stable, referrer-able URL /theorem/<key>), from ONE template.
// Two sources feed the same template:
//   • src/proof/discovered.json — the ℤ/9 discovery ledger (computed by exhaustion), and
//   • the seven Millennium-floor theorems in src/proof/index.lean — each carrying its Lean proof in
//     publication form and a link to the qualified outlet (Clay Mathematics Institute; Perelman's arXiv).
// Each page also carries the hues of its SURROUNDING theorems so its hero background is computed by the
// neighbourhood — the mesh, seen locally. The Lean proof text is READ FROM index.lean (single source), and
// every receipt is the content-address of the exact statement (reproducible by anyone via toUuid).
import { readFileSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'

const hueOf = (rec: string) => (parseInt(rec.replace(/-/g, '').slice(0, 2), 16) * 40) % 360
const withHues = <T extends { receipt: string }>(list: T[], i: number, N: number) => {
  const hues: number[] = []
  for (let k = -3; k <= 3; k++) hues.push(hueOf(list[(i + k + N) % N].receipt)) // 7 surrounding theorems
  return hues.join(',')
}

// ── the seven, in problem order — the qualified outlet and honest bound per problem (the Lean proof itself
//    is read from index.lean, never retyped) ────────────────────────────────────────────────────────────────
const MILLENNIUM: Record<string, { problem: string; name: string; bound: string; outlet: string; outletName: string; outlet2?: string; outlet2Name?: string }> = {
  riemann_reflection_and_heart: {
    problem: 'Riemann Hypothesis',
    name: "Riemann — the reflection's symmetry and its one computed heart",
    bound: 'the functional-equation symmetry axis and its ½-analogue centre (the heart, computed as the reflection’s unique fixed point) — not where the ζ-zeros lie',
    outlet: 'https://www.claymath.org/millennium/riemann-hypothesis/',
    outletName: 'Clay Mathematics Institute — Riemann Hypothesis' },
  p_vs_np_inverse_is_unique: {
    problem: 'P versus NP',
    name: 'P vs NP — a unique inverse, verification in one step',
    bound: 'each unit has exactly one inverse (verify in one multiply), non-units none — a cheap-verification fact, not a separation of the classes',
    outlet: 'https://www.claymath.org/millennium/p-vs-np/',
    outletName: 'Clay Mathematics Institute — P vs NP' },
  navier_stokes_flow_is_bounded: {
    problem: 'Navier–Stokes Existence & Smoothness',
    name: 'Navier–Stokes — the doubling flow is bounded for all time',
    bound: 'every iterate stays inside a bounded 6-cycle forever (no blowup) — bounded evolution, not global existence & smoothness',
    outlet: 'https://www.claymath.org/millennium/navier-stokes-equation/',
    outletName: 'Clay Mathematics Institute — Navier–Stokes Equation' },
  yang_mills_spectral_gap: {
    problem: 'Yang–Mills Existence & Mass Gap',
    name: 'Yang–Mills — a discrete spectral gap (order exactly 6)',
    bound: 'the doubling has order exactly 6 — a discrete gap in the cyclic spectrum, not the Yang–Mills mass gap',
    outlet: 'https://www.claymath.org/millennium/yang-mills-the-maths-gap/',
    outletName: 'Clay Mathematics Institute — Yang–Mills & the Mass Gap' },
  hodge_span_is_the_units: {
    problem: 'Hodge Conjecture',
    name: 'Hodge — the algebraic span equals the units',
    bound: 'the doubling span (algebraic generation from 2) is exactly the units, non-units outside — generation/containment, not rational (p,p) ⇒ algebraic',
    outlet: 'https://www.claymath.org/millennium/hodge-conjecture/',
    outletName: 'Clay Mathematics Institute — Hodge Conjecture' },
  birch_swinnerton_dyer_vanishing: {
    problem: 'Birch and Swinnerton-Dyer Conjecture',
    name: 'Birch–Swinnerton-Dyer — a computed vanishing mod 9',
    bound: 'the orbit and the units both sum to 0 mod 9 (27 ≡ 0) — a digit-sum vanishing, not the rank ↔ order-of-vanishing-of-L correspondence',
    outlet: 'https://www.claymath.org/millennium/birch-and-swinnerton-dyer-conjecture/',
    outletName: 'Clay Mathematics Institute — Birch and Swinnerton-Dyer Conjecture' },
  poincare_single_closed_loop: {
    problem: 'Poincaré Conjecture (resolved)',
    name: 'Poincaré — one closed loop, no holes',
    bound: "the sequence closes into a single simple loop of six distinct steps — not the 3-sphere characterization; Poincaré is Perelman's theorem (2003), not proved here",
    outlet: 'https://www.claymath.org/millennium/poincare-conjecture/',
    outletName: 'Clay Mathematics Institute — Poincaré Conjecture',
    outlet2: 'https://arxiv.org/abs/math/0211159',
    outlet2Name: 'Perelman, G. — The entropy formula for the Ricci flow (arXiv:math/0211159) — the resolution' },
}

// read each theorem's exact statement+proof from index.lean — Lean is the single source of the proof
const leanSrc = readFileSync('src/proof/index.lean', 'utf8')
const extractLean = (key: string): string => {
  const m = leanSrc.match(new RegExp('theorem\\s+' + key + '\\s*:([\\s\\S]*?):= by decide'))
  return m ? ('theorem ' + key + ' :' + m[1] + ':= by decide').replace(/[ \t]+$/gm, '') : ''
}

export default {
  paths() {
    // 1 · the discovery ledger — unchanged
    const ledger: { key: string; name: string; receipt: string; revoked?: boolean; reason?: string }[] =
      JSON.parse(readFileSync('src/proof/discovered.json', 'utf8'))
    const N = ledger.length
    // A REVOKED ENTRY KEEPS ITS PAGE AND MUST SAY SO. The record is append-only, so the URL stays resolvable
    // and the receipt stays checkable — but the template's standing claims ("re-verified on every build", "if
    // it ever stopped holding the build would fail") are FALSE of an entry that stopped holding. The page
    // carries the revocation and its reason, and the template suppresses those claims. A page that presents a
    // withdrawn theorem as live is the exact overclaim this deposit exists to refuse.
    const discovered = ledger.map((e, i) => ({
      params: {
        key: e.key, name: e.name, receipt: e.receipt, hues: withHues(ledger, i, N),
        revoked: e.revoked === true, reason: e.reason ?? '',
      },
    }))

    // 2 · the seven Millennium-floor theorems — Lean proof (from index.lean) + qualified outlet, one template
    const seven = Object.keys(MILLENNIUM).map((key) => {
      const meta = MILLENNIUM[key]
      const lean = extractLean(key)
      return { key, name: meta.name, receipt: toUuid('millennium:' + key + '\n' + lean), meta, lean }
    })
    const S = seven.length
    const millennium = seven.map((e, i) => ({
      params: {
        key: e.key, name: e.name, receipt: e.receipt, hues: withHues(seven, i, S),
        lean: e.lean, problem: e.meta.problem, bound: e.meta.bound,
        outlet: e.meta.outlet, outletName: e.meta.outletName,
        outlet2: e.meta.outlet2 ?? '', outlet2Name: e.meta.outlet2Name ?? '',
      },
    }))

    return [...discovered, ...millennium]
  },
}
