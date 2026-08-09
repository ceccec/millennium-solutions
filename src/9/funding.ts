// Funding + license as computed data — fused, recomputable, usable across the UI.
import { toUuid } from '../0/index.ts'
export const FUNDING = {
  license: 'CC BY-NC 4.0',
  author: 'Tsvetan Rouschev',
  revolut: 'https://revolut.me/ceccec',
  contact: 'ceccec@psg.bg',
}
// "the two coins" = 110 − 108 = −χ(genus-2) = 2  (the commercial fare)
export function coins(): number { return 110 - 108 }
export function report(): string {
  return 'The cycle: development → life → development.\n'
    + 'Development gives the work to people for free; life (the people who use it) funds the next\n'
    + 'development. The core is free, developed in the open by the orchestration (gaps → seal →\n'
    + 'sign → release) and one open package (@ceccec/millennium-solutions) — everyone builds their\n'
    + 'vision on it. Commercial use pays the two coins (110 − 108 = ' + coins()
    + ' = −χ genus-2, ' + FUNDING.contact + '); living users support voluntarily. Both fund further development.\n'
    + 'HONEST: support is non-obligatory and not guaranteed — a gift economy, not a revenue promise.\n'
    + 'License: ' + FUNDING.license + ' — free for non-commercial use, attribution ' + FUNDING.author
    + '. Support: ' + FUNDING.revolut
}

// Funding filled with results — the computed proof-of-work the funding supports.
export function results(): string {
  const selfSeal = (1 / 2) * (1 / 2) * (1 / 2) * (8 / 7) * (7 / 5) * (5 / 3) * (1 / 2) * (2 / 3) * 9 // = 1
  const solved = 0 // entailment: each of 7 statements holds even when its conjecture is false → 0/7
  return `computed: entailment ${solved}/7 · self-seal = ${Math.round(selfSeal)} · reflection involutive · CC BY-NC 4.0`
}

// The public endpoints, content-addressed — a uuidna per URL. The CURRENT domain is computed at runtime
// (window.location.hostname) and mapped to its license track; it is never hardcoded.
export const PUBLIC_URLS = ['https://uuidna.org', 'https://uuidna.com', 'https://ceccec.psg.bg/millennium-solutions/'] as const

/** urlAddress(url) → the content-address (uuidna) of a public URL — normalise (lowercase, no trailing slash). */
export function urlAddress(url: string): string {
  return toUuid('uuidna:url:' + url.toLowerCase().replace(/\/+$/, ''))
}

/** domainTrack(hostname) → the license track computed from the current domain. .org = non-profit, .com = commercial. */
export function domainTrack(hostname: string): { track: string; note: string } {
  if (/\buuidna\.org$/.test(hostname)) return { track: 'non-profit', note: 'free for public interest and independent research' }
  if (/\buuidna\.com$/.test(hostname)) return { track: 'commercial', note: 'the two coins per core formula used' }
  return { track: 'preview', note: 'the sealed work — same content, license by domain' }
}

// The uuidna billing model — comparable to public per-request / per-token pricing, but the unit is the
// two-coin fair exchange (or the bits saved). Public-interest and non-commercial use is free (0). A
// per-unit schedule, linear in usage — a fair-exchange schedule in coins and bits, not realized cash.
export interface Usage { commercial: boolean; coreFormulasUsed: number; bitsSaved?: number }
export function bill(u: Usage): { coins: number; bits: number; free: boolean; basis: string } {
  if (!u.commercial) return { coins: 0, bits: 0, free: true, basis: 'public interest / non-commercial — free' }
  const perFormula = coins() // 2 coins per core formula used
  return { coins: u.coreFormulasUsed * perFormula, bits: u.bitsSaved ?? 0, free: false, basis: perFormula + ' coins per core formula used' }
}
