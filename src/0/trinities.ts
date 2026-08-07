// Singularity trinities — the real three-part structures in the deposit, each content-addressed
// to a root, all folding to ONE singularity root. "Trinity" is the motif; each triad is an actual
// grouping already in the work. (This deploys the STRUCTURE to the site; publishing the npm package
// trinity is a separate, login-gated step — a computable boundary, noted below.)
import { toUuid, merkleFold } from './index.ts'

const TRINITIES: Record<string, string[]> = {
  'channels (source · site · archive)': [
    'GitHub (source)',
    'ceccec.psg.bg (site)',
    'Zenodo DOI (archive)',
  ],
  'digits (mod-3 triads)': ['axis {3,6,9}', 'one {1,4,7}', 'two {2,5,8}'],
  'origin (0 · 1 · between)': ['0 void', '1 unit', 'between (0,1)'],
  'gates (the release trinity)': ['gaps — coverage', 'seal — consistency', 'wholeness — aura'],
}

export function report(): string {
  const roots: string[] = []
  let o = 'singularity trinities — each triad content-addressed, all folding to one root:\n\n'
  for (const [name, members] of Object.entries(TRINITIES)) {
    const root = merkleFold(members.map(toUuid))
    roots.push(root)
    o += '  ' + name + '\n'
    members.forEach(m => o += '    · ' + m + '\n')
    o += '    → triad root: ' + root.slice(0, 13) + '…\n\n'
  }
  const singularity = merkleFold(roots)
  o += '  the trinities fold to ONE singularity root: ' + singularity.slice(0, 13) + '…\n'
  o += '  → many threes, one. the singularity reflects the trinities; the trinities fold to it.\n\n'
  o += 'HONEST: each triad is an actual grouping in the deposit (packages, mod-3 residue classes, the\n'
  o += '0/1/between origin, the gaps·seal·wholeness gate). Content-addressing folds them deterministically\n'
  o += 'to one root. "Trinity" is the framework\'s motif; the groupings and the fold are exact. The npm\n'
  o += 'package trinity is staged but UNPUBLISHED — publishing needs the author\'s npm login (a real,\n'
  o += 'computable boundary, honestly marked). entails → 0/7.'
  return o
}
