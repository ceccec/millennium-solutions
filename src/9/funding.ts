// Funding + license as computed data — fused, recomputable, usable across the UI.
export const FUNDING = {
  license: 'CC BY-NC 4.0',
  author: 'Tsvetan Rouschev',
  revolut: 'https://revolut.me/ceccec',
  contact: 'ceccec@psg.bg',
}
// "the two coins" = 110 − 108 = −χ(genus-2) = 2  (the commercial fare)
export function coins(): number { return 110 - 108 }
export function report(): string {
  return 'License: ' + FUNDING.license + ' — free for non-commercial use, attribution '
    + FUNDING.author + '.\nCommercial = the two coins (110 − 108 = ' + coins()
    + ' = −χ genus-2): ' + FUNDING.contact + '.\nSupport development (non-obligatory): ' + FUNDING.revolut
}
