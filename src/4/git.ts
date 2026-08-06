// git trinity — the content-addressed Merkle store this deposit actually rides on. Fills digit 4:
// git has exactly FOUR object types (the trinity blob·tree·commit + tag = 4). git IS content-
// addressing done for real (SHA), where this deposit only demonstrates the shape with toUuid (FNV).
import { toUuid, merkleFold } from '../0/index.ts'

export function report(): string {
  const objects = [
    ['blob', 'file content — addressed by the hash of its bytes'],
    ['tree', 'a directory listing — hashes of blobs/trees'],
    ['commit', 'a snapshot + parent(s) — hash of a tree + parents'],
    ['tag', 'the 4th: a named/signed pointer — the mark on a commit'],
  ]
  // Illustrate git's model with this deposit's own tool: three objects fold to a root.
  const root = merkleFold(['blob', 'tree', 'commit'].map(toUuid))

  let o = 'git trinity — the content-addressed Merkle store the deposit rides on (digit 4):\n\n'
  o += '  git object model — the trinity + the mark (4 types → digit 4):\n'
  objects.forEach(([n, d]) => o += '    ' + n.padEnd(7) + '— ' + d + '\n')
  o += '  → 3 core objects (blob·tree·commit) + tag = 4 object types.\n\n'
  o += '  every object is named by the hash of its content — git IS content-addressing, for real:\n'
  o += '    demo with toUuid (this deposit\'s tool): blob·tree·commit fold to a root: ' + root.slice(0, 13) + '…\n'
  o += '    git uses SHA-1 (→ SHA-256), a CRYPTOGRAPHIC hash; toUuid is FNV (non-crypto).\n\n'
  o += '  the deposit\'s provenance already rides on git: the signed tags, the version-seal, and the\n'
  o += '  singularity chain form a git Merkle DAG. content-addressing here is DEMONSTRATED with FNV,\n'
  o += '  and PROVEN in git with SHA.\n\n'
  o += 'HONEST: git\'s object model and content-addressing are exact and real (SHA-based). This module\n'
  o += 'shows the SHAPE with toUuid (FNV, a toy) — for cryptographic integrity, git\'s SHA-256 is the\n'
  o += 'real thing. Fills the digit-4 development gap (audited: 4 and 6 were empty). entails → 0/7.'
  return o
}
