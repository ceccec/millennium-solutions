import { defineConfig } from 'vitepress'
import { LOCALES, LOCALE_ORDER } from '../src/7/locale'

// 7D UI from locale: the interface chrome is SOURCED from the fused locale table.
// Root locale = en; the other six are ready in the table for per-locale content dirs.
const L = LOCALES.en

export default defineConfig({
  title: L.title,
  description: L.description,
  base: '/millennium-solutions/', // GitHub project Pages; set '/' for a custom root domain

  // Repo/dev docs and npm-package sources are not site pages.
  srcExclude: ['README.md', 'DEPLOY.md', 'packages/**', 'src/**'],

  themeConfig: {
    nav: [
      { text: L.nav.paper, link: '/' },
      { text: L.nav.research, link: '/RESEARCH' },
      { text: L.nav.poc, link: '/PROOF-OF-CONCEPT' },
      { text: L.nav.realisations, link: '/REALISATIONS' },
      { text: L.nav.compute, link: '/compute' },
      { text: L.nav.decode, link: '/SEQUENCE-DECODE' },
    ],

    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Paper', link: '/' },
          { text: 'Research', link: '/RESEARCH' },
          { text: 'Proof of Concept', link: '/PROOF-OF-CONCEPT' },
          { text: 'Realisations', link: '/REALISATIONS' },
          { text: 'Proofs', link: '/proofs' },
          { text: 'Signature', link: '/SIGNATURE' },
        ],
      },
      {
        text: 'Fused compute (TS)',
        items: [
          { text: 'Computed results', link: '/compute' },
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
      copyright: 'Support development: <a href="https://revolut.me/ceccec" target="_blank" rel="noopener">revolut.me/ceccec</a> · © Tsvetan Rouschev',
    },
  },

  markdown: {
    lineNumbers: true,
  },
})
