import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Funding from './Funding.vue'
import Hero from './Hero.vue'
import NextObserver from './NextObserver.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Funding is fused under every page's content, and usable as <Funding/> in any prose.
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-after': () => h(Funding) }),
  enhanceApp({ app }) {
    app.component('Funding', Funding)
    app.component('Hero', Hero)
    app.component('NextObserver', NextObserver)
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
