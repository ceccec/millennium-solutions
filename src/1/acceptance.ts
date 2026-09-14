// Acceptance vs proof — the hinge of this whole work.
// Society can ACCEPT a claim; that is adoption, not deduction. A proof stays a proof, and a
// non-proof stays a non-proof, whether or not anyone accepts it. What a UI can honestly
// DELIVER is verifiability — the ground on which *earned* acceptance rests. Not proof-by-vote.
import { toUuid } from '../0/index.ts'

export function report(): string {
  // This project's own record: acceptance is real AND independent of the mathematics.
  const accepted = [
    'zenodo DOI 10.5281/zenodo.21781603',
    'zenodo DOI 10.5281/zenodo.21787144',
    'submission acknowledged (received/forwarded)',
  ]

  let o = 'acceptance vs proof:\n\n'
  o += '  social acceptance (adoption) — real, and on record:\n'
  accepted.forEach(a => o += '    · ' + a + '\n')
  o += '\n'
  o += 'what the UI delivers (honestly):\n'
  o += '  every claim on this site recomputes at page-load from source (fused TS),\n'
  o += '  is content-addressed (' + toUuid('acceptance-vs-proof').slice(0, 13) + '…), and passes the seal gate.\n'
  o += '  → the UI does NOT deliver proof-by-acceptance. It delivers VERIFIABILITY: anyone in\n'
  o += '    society can recompute and check for themselves. That is the only acceptance worth\n'
  o += '    having — earned acceptance FOLLOWS verification, it does not replace it.'
  return o
}
