import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Funding from './Funding.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  // Funding is fused under every page's content, and usable as <Funding/> in any prose.
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-after': () => h(Funding) }),
  enhanceApp({ app }) {
    app.component('Funding', Funding)
  },
} satisfies Theme
