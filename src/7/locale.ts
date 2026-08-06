// 7D UI from locale — the interface chrome localizes from ONE fused table, deterministically.
// Seven locales = the seven dimensions/rays (one per rosette ray). The fixed UI strings below
// are translated by hand and localize with zero network, exactly and recomputably. This is the
// honest half of "self-translate all languages": a static tool localizes FIXED labels perfectly;
// it does NOT translate arbitrary prose — that needs a translator (human) or a language model.
import { toUuid, merkleFold } from '../0/index.ts'

export const LOCALE_ORDER = ['en', 'bg', 'de', 'fr', 'es', 'ru', 'zh'] as const
export type Locale = (typeof LOCALE_ORDER)[number]

type Strings = {
  label: string          // the language's own name (for the locale switcher)
  title: string
  description: string
  nav: { paper: string; research: string; poc: string; realisations: string; compute: string; decode: string }
  support: string
}

export const LOCALES: Record<Locale, Strings> = {
  en: {
    label: 'English',
    title: 'Millennium Solutions',
    description: 'ℤ/9 vortex framework — recomputable proof of concept',
    nav: { paper: 'Paper', research: 'Research', poc: 'Proof of Concept', realisations: 'Realisations', compute: 'Compute', decode: 'Decode' },
    support: 'Support development (non-obligatory)',
  },
  bg: {
    label: 'Български',
    title: 'Милениум решения',
    description: 'ℤ/9 вихрова рамка — преизчислимо доказателство на концепцията',
    nav: { paper: 'Статия', research: 'Изследване', poc: 'Доказателство на концепцията', realisations: 'Реализации', compute: 'Изчисли', decode: 'Декодиране' },
    support: 'Подкрепете разработката (незадължително)',
  },
  de: {
    label: 'Deutsch',
    title: 'Millennium-Lösungen',
    description: 'ℤ/9-Vortex-Framework — nachrechenbarer Machbarkeitsnachweis',
    nav: { paper: 'Aufsatz', research: 'Forschung', poc: 'Machbarkeitsnachweis', realisations: 'Realisierungen', compute: 'Berechnen', decode: 'Dekodieren' },
    support: 'Entwicklung unterstützen (freiwillig)',
  },
  fr: {
    label: 'Français',
    title: 'Solutions du millénaire',
    description: 'cadre vortex ℤ/9 — preuve de concept recalculable',
    nav: { paper: 'Article', research: 'Recherche', poc: 'Preuve de concept', realisations: 'Réalisations', compute: 'Calculer', decode: 'Décoder' },
    support: 'Soutenir le développement (facultatif)',
  },
  es: {
    label: 'Español',
    title: 'Soluciones del milenio',
    description: 'marco de vórtice ℤ/9 — prueba de concepto recomputable',
    nav: { paper: 'Artículo', research: 'Investigación', poc: 'Prueba de concepto', realisations: 'Realizaciones', compute: 'Calcular', decode: 'Descifrar' },
    support: 'Apoyar el desarrollo (no obligatorio)',
  },
  ru: {
    label: 'Русский',
    title: 'Решения тысячелетия',
    description: 'вихревая структура ℤ/9 — перевычислимое доказательство концепции',
    nav: { paper: 'Статья', research: 'Исследование', poc: 'Доказательство концепции', realisations: 'Реализации', compute: 'Вычислить', decode: 'Декодировать' },
    support: 'Поддержать разработку (необязательно)',
  },
  zh: {
    label: '中文',
    title: '千禧年解',
    description: 'ℤ/9 涡旋框架 — 可重算的概念验证',
    nav: { paper: '论文', research: '研究', poc: '概念验证', realisations: '实现', compute: '计算', decode: '解码' },
    support: '支持开发（非强制）',
  },
}

// The self-localizing accessor: fixed UI strings, resolved deterministically, no network.
export function t(locale: Locale, path: string): string {
  const parts = path.split('.')
  let node: unknown = LOCALES[locale] ?? LOCALES.en
  for (const p of parts) node = (node as Record<string, unknown>)?.[p]
  return typeof node === 'string' ? node : path
}

export function report(): string {
  // The seven locales content-address to one root — the localized chrome, sealed.
  const root = merkleFold(LOCALE_ORDER.map(l => toUuid(l + ':' + JSON.stringify(LOCALES[l]))))

  let o = '7D UI from locale — one fused table, seven dimensions (rosette rays):\n\n'
  LOCALE_ORDER.forEach((l, i) => {
    const s = LOCALES[l]
    o += '  ray ' + (i + 1) + '  ' + l + '  ' + s.label.padEnd(10) + s.nav.compute + '\n'
  })
  o += '\n  sample — "Compute" across the seven:\n    '
  o += LOCALE_ORDER.map(l => LOCALES[l].nav.compute).join(' · ') + '\n\n'
  o += '  locale-table content-address (sealed): ' + root.slice(0, 13) + '…\n\n'
  o += 'HONEST: this table localizes the FIXED UI chrome (title, nav, footer) deterministically —\n'
  o += 'exact, recomputable, no network. That is what a tool CAN self-translate. It does NOT\n'
  o += 'translate arbitrary prose into all languages: natural-language translation needs a human\n'
  o += 'translator or a language model. The ℤ/9 algebra does not translate meaning. Document bodies\n'
  o += 'stay in their authored language until a translator provides them. entails → 0/7.'
  return o
}
