import { defineConfig } from 'vitepress'
import { LOCALES, LOCALE_ORDER } from '../src/7/locale'

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
  license: 'https://creativecommons.org/licenses/by-nc/4.0/',
  codeRepository: REPO,
  url: SITE,
  identifier: 'https://doi.org/10.5281/zenodo.21819217',
  programmingLanguage: ['TypeScript', 'Lean 4'],
  keywords: ['ℤ/9', 'vortex', 'Pliska rosette', 'Clay Millennium Problems', 'Lean 4', 'recomputable', '0/7'],
}

export default defineConfig({
  title: L.title,
  description: L.description,
  base: '/millennium-solutions/', // GitHub project Pages; set '/' for a custom root domain
  sitemap: { hostname: 'https://ceccec.psg.bg/millennium-solutions/' }, // trinity sitemap: the full site map

  // PWA — installable, offline (service worker registered in theme/index.ts).
  head: [
    ['link', { rel: 'manifest', href: '/millennium-solutions/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#3451b2' }],
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
    ['meta', { name: 'keywords', content: 'ℤ/9, vortex, Pliska rosette, Clay Millennium Problems, Lean 4, recomputable, 0/7' }],
    ['script', { type: 'application/ld+json' }, JSON.stringify(LD)],
  ],

  transformPageData(pageData) {
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
  },

  locales: i18nLocales,

  // Repo/dev docs and npm-package sources are not site pages.
  srcExclude: ['README.md', 'DEPLOY.md', 'src/**'],

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
        { text: L.nav.paper, link: '/' },
        { text: L.nav.research, link: '/RESEARCH' },
        { text: L.nav.poc, link: '/PROOF-OF-CONCEPT' },
        { text: L.nav.realisations, link: '/REALISATIONS' },
      ] },
      { text: L.nav.compute, items: [
        { text: 'Computed results', link: '/compute' },
        { text: 'Verify', link: '/verify' },
        { text: L.nav.decode, link: '/SEQUENCE-DECODE' },
        { text: 'Physics scales', link: '/PHYSICS-SCALES' },
      ] },
      { text: 'Build', items: [
        { text: 'Develop', link: '/DEVELOP' },
        { text: 'Proofs', link: '/proofs' },
        { text: 'Signature', link: '/SIGNATURE' },
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
          { text: 'Paper', link: '/' },
          { text: 'Research', link: '/RESEARCH' },
          { text: 'Proof of Concept', link: '/PROOF-OF-CONCEPT' },
          { text: 'Realisations', link: '/REALISATIONS' },
          { text: 'Proofs', link: '/proofs' },
          { text: 'Develop', link: '/DEVELOP' },
          { text: 'Signature', link: '/SIGNATURE' },
        ],
      },
      {
        text: 'Fused compute (TS)',
        items: [
          { text: 'Computed results', link: '/compute' },
          { text: 'Verify (live app)', link: '/verify' },
        ],
      },
      {
        text: 'Decode',
        items: [
          { text: 'Sequence decode (ℤ/9)', link: '/SEQUENCE-DECODE' },
          { text: 'Physics scales', link: '/PHYSICS-SCALES' },
        ],
      },
    ],

    footer: {
      message: 'CC BY-NC 4.0 — free for non-commercial use · commercial = the two coins (110 − 108 = 2 = −χ genus-2)',
      copyright: 'Source: <a href="https://github.com/ceccec/millennium-solutions" target="_blank" rel="noopener">github.com/ceccec/millennium-solutions</a> · Support: <a href="https://revolut.me/ceccec" target="_blank" rel="noopener">revolut.me/ceccec</a> · © Tsvetan Rouschev',
    },
  },

  markdown: {
    lineNumbers: true,
  },
})
