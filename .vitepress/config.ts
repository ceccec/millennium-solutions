import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { LOCALES, LOCALE_ORDER } from '../src/7/locale'
import { CSP } from '../src/0/csp.ts'
import { A432_STEP } from '../src/0/index.ts'

// The theme accent is COMPUTED, not a typed hex: the ℤ/9 heart is d=5 (the reflection fixed point),
// and the a432 hue map sends each digit d to d·(A432_STEP)° — so the home hue is 5·40 = 200°. The
// browser theme-color and the vortex centre share this one derived hue. (Nine steps close: 9·40 = 360.)
const A432_HEART_HUE = 5 * A432_STEP // 200 — the heart's hue, derived not typed
const THEME_COLOR = `hsl(${A432_HEART_HUE} 68% 45%)`

// Config computed from the ledger: the site metadata reflects the LIVE count of decidable theorems,
// recomputed from src/proof/discovered.json at build — the config is derived by the theorems, not typed.
const THEOREMS: number = (() => { try { return JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')).length } catch { return 0 } })()

// 7D UI from locale: the interface chrome is SOURCED from the fused locale table.
// Root locale = en; the other six are ready in the table for per-locale content dirs.
const L = LOCALES.en

// VitePress i18n: root = English (full site); six locales get translated chrome + a translated
// landing, then link into the English deep pages until those are translated. Honest boundary:
// fixed UI + landing localize deterministically; prose stays English until a translator provides it.
const REPO = 'https://github.com/ceccec/millennium-solutions'
const NON_ROOT = ['bg', 'de', 'fr', 'es', 'ru', 'zh'] as const
const i18nLocales = {
  root: { label: 'English', lang: 'en' },
  ...Object.fromEntries(NON_ROOT.map((code) => {
    const T = LOCALES[code]
    return [code, {
      label: T.label, lang: code, link: `/${code}/`,
      title: T.title, description: T.description,
      themeConfig: {
        nav: [
          { text: T.nav.paper, link: `/${code}/` },
          { text: T.nav.compute, link: '/compute' },
          { text: T.nav.research, link: '/RESEARCH' },
          { text: 'Verify', link: '/verify' },
          { text: 'Solutions', link: '/solutions' },
          { text: 'Compare', link: '/compare' },
          { text: 'Repo ↗', link: REPO },
        ],
      },
    }]
  })),
}

// SEO: OpenGraph + Twitter cards + JSON-LD structured data (per-page og:title/url via transformPageData).
const SITE = 'https://ceccec.psg.bg/millennium-solutions/'
const OG_IMAGE = SITE + 'icon.svg'
const LD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'Millennium Solutions — the ℤ/9 Vortex Framework',
  description: L.description,
  author: { '@type': 'Person', name: 'Tsvetan Rouschev', '@id': 'https://orcid.org/0009-0000-7312-9778' },
  license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  codeRepository: REPO,
  url: SITE,
  identifier: 'https://doi.org/10.5281/zenodo.21819217',
  programmingLanguage: ['TypeScript', 'Lean 4'],
  keywords: ['ℤ/9', 'vortex', 'Pliska rosette', 'Clay Millennium Problems', 'Lean 4', 'recomputable', '0/7', THEOREMS + ' decidable theorems'],
  // structured-data count computed from the ledger, not a typed literal
  mainEntity: { '@type': 'Collection', name: 'decidable theorems (ℤ/9, recomputable)', size: THEOREMS },
}

export default defineConfig({
  title: L.title,
  description: L.description,
  base: '/millennium-solutions/', // GitHub project Pages; set '/' for a custom root domain
  sitemap: { hostname: 'https://ceccec.psg.bg/millennium-solutions/' }, // trinity sitemap: the full site map

  // PWA — installable, offline (service worker registered in theme/index.ts).
  head: [
    // Content-Security-Policy (meta form — GitHub Pages can't set HTTP headers). Single source: src/0/csp.ts.
    ['meta', { 'http-equiv': 'Content-Security-Policy', content: CSP }],
    ['link', { rel: 'manifest', href: '/millennium-solutions/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: THEME_COLOR }],
    ['link', { rel: 'icon', href: '/millennium-solutions/icon.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/millennium-solutions/icon.svg' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    // SEO — site-wide OpenGraph / Twitter / structured data (per-page og:title/description/url below)
    ['meta', { property: 'og:site_name', content: 'Millennium Solutions' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
    ['meta', { name: 'author', content: 'Tsvetan Rouschev' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'keywords', content: 'uuidna, ℤ/9, vortex, Pliska rosette, Clay Millennium Problems, Lean 4, recomputable, 0/7, ' + THEOREMS + ' decidable theorems' }],
    // uuidna brand + Creative Commons license + brand tracks (author's declared .org non-profit / .com commercial)
    ['meta', { name: 'application-name', content: 'uuidna' }],
    ['meta', { property: 'og:see_also', content: 'https://uuidna.org' }],
    ['meta', { name: 'uuidna:tracks', content: 'https://uuidna.org (non-profit) · https://uuidna.com (commercial)' }],
    ['meta', { name: 'license', content: 'CC BY-NC-ND 4.0 — free for public interest and independent research; commercial via uuidna.com' }],
    ['link', { rel: 'license', href: 'https://creativecommons.org/licenses/by-nc-nd/4.0/' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(LD)],
  ],

  transformPageData(pageData) {
    // Each object is the hero of its own page: a dynamic /theorem/<key> page takes its OG title and
    // description from its own params — the theorem's name, and how it was achieved.
    const p = (pageData as { params?: { key?: string; name?: string; receipt?: string; problem?: string; outletName?: string; revoked?: boolean; reason?: string; supersededBy?: string; jsonld?: string } }).params
    if (p?.key) {
      // PER-THEOREM STRUCTURED DATA, injected here because a template cannot do it: Vue refuses to render a
      // <script> tag, so `<component :is="'script'">` built cleanly and emitted nothing — 2425 pages kept
      // carrying one identical site-level blob that described the repository and said nothing about the
      // theorem on the page. transformPageData runs at build time, which is also the only place that helps
      // a search engine. Built in src/publication from the same values as the prose body and the Zenodo
      // record, so the three cannot disagree.
      if (p.jsonld) (pageData.frontmatter.head ??= []).push(['script', { type: 'application/ld+json' }, p.jsonld])
      pageData.title = p.name
      // A WITHDRAWN ENTRY MUST NOT BE DESCRIBED AS STANDING. The OG/meta description is what a search result
      // and a shared link show — the one line most people ever read — so it is the last place a stale claim
      // may survive. An entry that no longer holds says so here first.
      // A page that ranks for a fact the deposit HAS PROVED must not tell the searcher it cannot be cited.
      // These are the deposit's highest-traffic pages: every one was withdrawn for lacking a Lean proof, and
      // the proofs now exist. The description is what a search result shows, so it is the first place the
      // correction has to land.
      pageData.description = p.revoked && p.supersededBy
        ? 'CARRIED — withdrawn on its own evidence for lacking a proof, and now carried by the Lean theorem ' + p.supersededBy + ', machine-checked sorry-free and axiom-free over its whole domain. Integrity, not truth. entails → 0/7.'
        : p.revoked
        ? 'WITHDRAWN — this entry no longer stands as a theorem of the deposit and must not be cited. Its receipt (' + p.receipt + ') remains in the append-only record so the chain still verifies, but the statement is not re-verified on every build. Integrity, not truth. entails → 0/7.'
        : p.key.startsWith('lean_')
        // Established by the Lean kernel, not by enumeration in discover.ts. Saying "computed by exhaustion"
        // of a machine-checked proof misdescribes the strongest evidence in the deposit as the weaker kind.
        ? 'A Lean 4 theorem, machine-checked sorry-free and axiom-free by the kernel over its whole domain — not sampled, and not a TypeScript test that agreed once (content-address ' + p.receipt + '). A standing theorem of the ℤ/9 ledger. Integrity, not truth. entails → 0/7.'
        : p.problem
        ? 'A Lean 4 theorem computed from the ℤ/9 doubling sequence, machine-checked sorry-free and axiom-free (content-address ' + p.receipt + '). Adjacent to the Clay problem “' + p.problem + '” — and NOT the conjecture. Reference: ' + p.outletName + '. Integrity, not truth. entails → 0/7.'
        : 'Achieved by exhaustive computation over a finite domain in scripts/discover.ts, gate-checked against the honesty floor, receipted and chained, and re-verified on every build (content-address ' + p.receipt + '). A decidable fact in the ℤ/9 ledger — integrity, not truth. entails → 0/7.'
    }
    const clean = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
    const url = SITE + clean
    const title = pageData.title ? pageData.title + ' | Millennium Solutions' : 'Millennium Solutions'
    const desc = pageData.description || pageData.frontmatter?.description || L.description
    const lk = ['bg', 'de', 'fr', 'es', 'ru', 'zh'].find((l) => pageData.relativePath.startsWith(l + '/')) || 'en'
    const ogLocale = { en: 'en_US', bg: 'bg_BG', de: 'de_DE', fr: 'fr_FR', es: 'es_ES', ru: 'ru_RU', zh: 'zh_CN' }[lk]
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: desc }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:locale', content: ogLocale }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: desc }],
      ['link', { rel: 'canonical', href: url }],
    )
    // hreflang alternates in <head> — the base page across all locales + x-default. Dynamic pages (e.g.
    // /theorem/<key>) exist only at root, so they get en + x-default only (no locale variants to point at).
    const base = clean.replace(/^(bg|de|fr|es|ru|zh)\//, '')
    const localised = !base.startsWith('theorem/')
    for (const loc of (localised ? ['en', 'bg', 'de', 'fr', 'es', 'ru', 'zh'] : ['en']))
      pageData.frontmatter.head.push(['link', { rel: 'alternate', hreflang: loc, href: SITE + (loc === 'en' ? '' : loc + '/') + base }])
    pageData.frontmatter.head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: SITE + base }])
  },

  locales: i18nLocales,

  // Repo/dev docs and npm-package sources are not site pages.
  srcExclude: ['README.md', 'DEPLOY.md', 'src/**', 'packages/**'],

  themeConfig: {
    // Navigation pyramid (structure borrowed from ceccec.github.io's vortexGatewayPyramids —
    // NOT its 7/7 framing; here the floor stays 0/7). The gateways [8,3,9,0] — the vortex tour's
    // direction-reversal points — lift by peak/valley into a tetrahedron, the minimal pyramid
    // (4 vertices). So the nav folds to exactly four top-level anchors: three trinity-faces
    // (Read · Compute · Build) + the repo apex. Nine leaves fold up the pyramid to four.
    nav: [
      // apex → the parent site (same origin: this deposit lives at /millennium-solutions/ under
      // ceccec). Mirrors ceccec.github.io's "Home + 3 doors" pyramid; the two sites are two faces
      // of one genus-2 whole, navigable seamlessly.
      { text: 'ceccec ↗', link: 'https://ceccec.psg.bg/' },
      { text: 'Read', items: [
        { text: 'Abstract', link: '/ABSTRACT' },
        { text: 'How it folds', link: '/folds' },
        { text: 'The organism', link: '/organism' },
        { text: 'The quantum field', link: '/quantum' },
        { text: 'The harness', link: '/harness' },
        { text: 'The', link: '/the' },
        { text: 'Theorems', link: '/THEOREMS' },
        { text: 'Axiom index', link: '/AXIOMS' },
        { text: 'Challenges', link: '/CHALLENGES' },
        { text: 'Heart', link: '/HEART' },
        { text: 'Rules', link: '/RULES' },
        { text: L.nav.paper, link: '/' },
        { text: L.nav.research, link: '/RESEARCH' },
        { text: 'White paper', link: '/WHITEPAPER' },
        { text: L.nav.poc, link: '/PROOF-OF-CONCEPT' },
        { text: L.nav.realisations, link: '/REALISATIONS' },
      ] },
      { text: L.nav.compute, items: [
        { text: 'State dashboard', link: '/dashboard' },
        { text: 'Accounting', link: '/ACCOUNTING' },
        { text: 'Boundaries', link: '/boundaries' },
        { text: 'Rights', link: '/rights' },
          { text: 'Prior art', link: '/PRIOR-ART' },
          { text: 'Provenance', link: '/forensic' },
          { text: 'Axiom index', link: '/AXIOMS' },
        { text: 'Compare', link: '/compare' },
        { text: 'Examples', link: '/examples' },
        { text: 'Computed results', link: '/compute' },
        { text: 'Real advantage', link: '/speedup' },
        { text: 'Verify', link: '/verify' },
        { text: 'Solutions (adjudicated)', link: '/solutions' },
        { text: 'The public trial', link: '/TRIAL' },
        { text: L.nav.decode, link: '/SEQUENCE-DECODE' },
        { text: 'Physics scales', link: '/PHYSICS-SCALES' },
      ] },
      { text: 'Build', items: [
        { text: 'Guide (7D)', link: '/guide' },
        { text: 'Workflows', link: '/WORKFLOWS' },
        { text: 'Develop', link: '/DEVELOP' },
        { text: 'Proofs', link: '/proofs' },
        { text: 'Signature', link: '/SIGNATURE' },
        { text: 'Cryptography', link: '/cryptography' },
        { text: "Captain's message", link: '/captain' },
      ] },
      { text: 'Repo ↗', link: 'https://github.com/ceccec/millennium-solutions' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ceccec/millennium-solutions' },
    ],

    // Realtime, client-side full-text search — the site reflecting its own content, offline.
    search: { provider: 'local' },

    sidebar: [
      {
        text: 'Overview',
        items: [
          // The homepage reached the sidebar only through the 'Paper' entry, which pointed at `/`.
          // Repointing Paper to the collected paper left `/` with no sidebar link at all, and
          // scripts/gaps.ts — which runs in publish and release CI and nowhere a developer sees — had
          // been failing on a clean tree ever since.
          { text: 'Home', link: '/' },
          { text: 'Abstract', link: '/ABSTRACT' },
          { text: 'Guide (7D)', link: '/guide' },
          { text: 'How it folds (for everyone)', link: '/folds' },
          { text: 'Workflows', link: '/WORKFLOWS' },
          { text: 'The (concepts)', link: '/the' },
          { text: 'Theorems', link: '/THEOREMS' },
          { text: 'Challenges', link: '/CHALLENGES' },
          { text: 'Heart', link: '/HEART' },
          { text: 'Rules', link: '/RULES' },
          { text: 'Paper', link: '/paper' },
          { text: 'Research', link: '/RESEARCH' },
          { text: 'White paper', link: '/WHITEPAPER' },
          { text: 'Proof of Concept', link: '/PROOF-OF-CONCEPT' },
          { text: 'Realisations', link: '/REALISATIONS' },
          { text: 'Proofs', link: '/proofs' },
          { text: 'Develop', link: '/DEVELOP' },
          { text: 'Signature', link: '/SIGNATURE' },
          { text: 'Cryptography', link: '/cryptography' },
          { text: "Captain's message", link: '/captain' },
        ],
      },
      {
        text: 'Fused compute (TS)',
        items: [
          { text: 'Computed results', link: '/compute' },
          { text: 'Harness (dashboard)', link: '/harness' },
          { text: 'Real advantage', link: '/speedup' },
          { text: 'State dashboard', link: '/dashboard' },
          { text: 'Accounting', link: '/ACCOUNTING' },
          { text: 'Boundaries', link: '/boundaries' },
          { text: 'Rights', link: '/rights' },
          { text: 'Prior art', link: '/PRIOR-ART' },
          { text: 'Provenance', link: '/forensic' },
          { text: 'Axiom index', link: '/AXIOMS' },
          { text: 'Compare (standards)', link: '/compare' },
          { text: 'Examples (live)', link: '/examples' },
          { text: 'Verify (live app)', link: '/verify' },
          { text: 'Solutions (adjudicated)', link: '/solutions' },
          { text: 'The public trial', link: '/TRIAL' },
        ],
      },
      {
        text: 'Decode',
        items: [
          { text: 'The organism', link: '/organism' },
          { text: 'The quantum field', link: '/quantum' },
          { text: 'Sequence decode (ℤ/9)', link: '/SEQUENCE-DECODE' },
          { text: 'Physics scales', link: '/PHYSICS-SCALES' },
        ],
      },
    ],

    footer: {
      message: 'computed: entailment 0/7 · self-seal = 1 · reflection involutive · CC BY-NC-ND 4.0 — free for non-commercial use (attribution Tsvetan Rouschev); commercial = the two coins (110 − 108 = 2 = −χ genus-2)',
      copyright: 'Source: <a href="https://github.com/ceccec/millennium-solutions" target="_blank" rel="noopener">github.com/ceccec/millennium-solutions</a> · Support: <a href="https://revolut.me/ceccec?note=uuid" target="_blank" rel="noopener">revolut.me/ceccec</a> · <a href="mailto:ceccec@psg.bg">ceccec@psg.bg</a> · © Tsvetan Rouschev',
    },
  },

  markdown: {
    lineNumbers: true,
  },
})
