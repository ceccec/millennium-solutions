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

export default defineConfig({
  title: L.title,
  description: L.description,
  base: '/millennium-solutions/', // GitHub project Pages; set '/' for a custom root domain
  sitemap: { hostname: 'http://ceccec.psg.bg/millennium-solutions/' }, // trinity sitemap: the full site map

  // PWA — installable, offline (service worker registered in theme/index.ts).
  head: [
    ['link', { rel: 'manifest', href: '/millennium-solutions/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#3451b2' }],
    ['link', { rel: 'icon', href: '/millennium-solutions/icon.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/millennium-solutions/icon.svg' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ],

  locales: i18nLocales,

  // Repo/dev docs and npm-package sources are not site pages.
  srcExclude: ['README.md', 'DEPLOY.md', 'src/**'],

  themeConfig: {
    nav: [
      { text: L.nav.paper, link: '/' },
      { text: L.nav.research, link: '/RESEARCH' },
      { text: L.nav.poc, link: '/PROOF-OF-CONCEPT' },
      { text: L.nav.realisations, link: '/REALISATIONS' },
      { text: L.nav.compute, link: '/compute' },
      { text: 'Verify', link: '/verify' },
      { text: L.nav.decode, link: '/SEQUENCE-DECODE' },
      { text: 'Develop', link: '/DEVELOP' },
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
