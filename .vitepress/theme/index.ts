import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Funding from './Funding.vue'
import Sponsor from './Sponsor.vue'
import Hero from './Hero.vue'
import NextObserver from './NextObserver.vue'
import TheConcepts from './TheConcepts.vue'
import AllTheorems from './AllTheorems.vue'
import Vortex7D from './Vortex7D.vue'
import StandardsCompare from './StandardsCompare.vue'
import Examples from './Examples.vue'
import Recompute from './Recompute.vue'
import Reeducate from './Reeducate.vue'
import Coins from './Coins.vue'
import SealMath from './SealMath.vue'
import Version from './Version.vue'
import TokenCost from './TokenCost.vue'
import Propulsion from './Propulsion.vue'
import Teleporter from './Teleporter.vue'
import Crypt from './Crypt.vue'
import Organism from './Organism.vue'
import QuantumField from './QuantumField.vue'
import TheoremField from './TheoremField.vue'
import Harness from './Harness.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Funding — the captain's message with the donation link — is fused under EVERY page (layout-bottom renders
  // on all layouts: home, doc, and custom), and usable as <Funding/> in any prose.
  // Funding sits under every page; Sponsor takes the aside slot VitePress reserves for carbonAds — served
  // from this repo rather than from a third-party ad network, for the reasons in Sponsor.vue.
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-bottom': () => h(Funding),
    'aside-bottom': () => h(Sponsor),
  }),
  enhanceApp({ app }) {
    app.component('Funding', Funding)
    app.component('Sponsor', Sponsor)
    app.component('Hero', Hero)
    app.component('NextObserver', NextObserver)
    app.component('TheConcepts', TheConcepts)
    app.component('AllTheorems', AllTheorems)
    app.component('Vortex7D', Vortex7D)
    app.component('StandardsCompare', StandardsCompare)
    app.component('Examples', Examples)
    app.component('Recompute', Recompute)
    app.component('Reeducate', Reeducate)
    app.component('Coins', Coins)
    app.component('SealMath', SealMath)
    app.component('Version', Version)
    app.component('TokenCost', TokenCost)
    app.component('Propulsion', Propulsion)
    app.component('Teleporter', Teleporter)
    app.component('Crypt', Crypt)
    app.component('Organism', Organism)
    app.component('QuantumField', QuantumField)
    app.component('TheoremField', TheoremField)
    app.component('Harness', Harness)
    // PWA: register the offline service worker (client-only; HTTPS or localhost).
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/millennium-solutions/sw.js').catch(() => {})
      })
    }
    // A432 · shadcn orchestration: what you type in the search harness re-themes the
    // site. Reduce the query to a vortex digit (digital root, ℤ/9), place it on the
    // 9-point circle (d·40°), drive one hue → the shadcn token set → live re-theme.
    if (typeof window !== 'undefined') {
      const digit = (q: string): number => { // digital root 1..9; 0 = empty (no override)
        let s = 0; for (let i = 0; i < q.length; i++) s += q.charCodeAt(i)
        return s === 0 ? 0 : 1 + (s - 1) % 9
      }
      const root = document.documentElement
      const BRAND = ['--vp-c-brand-1', '--vp-c-brand-2', '--vp-c-brand-3']
      const apply = (q: string) => {
        const d = digit(q.trim())
        if (!d) { // empty: revert to the default VitePress theme
          delete root.dataset.a432
          root.style.removeProperty('--a432-hue')
          for (const b of BRAND) root.style.removeProperty(b)
          return
        }
        const hue = (d * (360 / 9)) % 360 // step derived: full circle / base 9 = 40° per digit
        root.dataset.a432 = String(d)
        root.style.setProperty('--a432-hue', String(hue))
        // set concrete hsl() strings directly — inline beats the stylesheet and avoids
        // nested-var-across-@property substitution (which computes to invalid/empty).
        root.style.setProperty('--vp-c-brand-1', `hsl(${hue} 68% 45%)`)
        root.style.setProperty('--vp-c-brand-2', `hsl(${hue} 72% 52%)`)
        root.style.setProperty('--vp-c-brand-3', `hsl(${hue} 62% 58%)`)
      }
      const isSearch = (el: Element | null): el is HTMLInputElement =>
        !!el && el.tagName === 'INPUT' && (
          (el as HTMLInputElement).type === 'search' ||
          !!el.closest('.VPLocalSearchBox') ||
          (el.getAttribute('aria-label') || '').toLowerCase().includes('search'))
      document.addEventListener('input', (e) => {
        const t = e.target as Element
        if (isSearch(t)) apply((t as HTMLInputElement).value || '')
      }, true)
    }
  },
} satisfies Theme
