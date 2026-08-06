import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Millennium Solutions',
  description: 'ℤ/9 vortex framework — recomputable proof of concept',

  // Repo/dev docs and npm-package sources are not site pages.
  srcExclude: ['README.md', 'DEPLOY.md', 'packages/**', 'src/**'],

  themeConfig: {
    nav: [
      { text: 'Paper', link: '/' },
      { text: 'Research', link: '/RESEARCH' },
      { text: 'Proof of Concept', link: '/PROOF-OF-CONCEPT' },
      { text: 'Realisations', link: '/REALISATIONS' },
      { text: 'Compute', link: '/compute' },
      { text: 'Decode', link: '/SEQUENCE-DECODE' },
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
