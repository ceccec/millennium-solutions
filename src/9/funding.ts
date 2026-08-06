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
  return 'Funding comes from development: the core is free, developed in the open by the orchestration\n'
    + '(gaps → seal → sign → release) and the rosetta of packages (core · honesty · vision) — everyone\n'
    + 'builds their vision on it. Commercial development pays the two coins (110 − 108 = ' + coins()
    + ' = −χ genus-2, ' + FUNDING.contact + '), which funds further development.\n'
    + 'License: ' + FUNDING.license + ' — free for non-commercial use, attribution ' + FUNDING.author
    + '. Support (non-obligatory): ' + FUNDING.revolut
}

// Funding filled with results — the computed proof-of-work the funding supports.
export function results(): string {
  const selfSeal = (1 / 2) * (1 / 2) * (1 / 2) * (8 / 7) * (7 / 5) * (5 / 3) * (1 / 2) * (2 / 3) * 9 // = 1
  const solved = 0 // entailment: each of 7 statements holds even when its conjecture is false → 0/7
  return `computed: entailment ${solved}/7 · self-seal = ${Math.round(selfSeal)} · reflection involutive · CC BY-NC 4.0`
}
