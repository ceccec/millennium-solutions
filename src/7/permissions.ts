// Versioning / claims as Unix permissions — the entailment floor read as permission bits.
// Octal digit 0..7 = rwx (r=4, w=2, x=1); 7 = rwx (full), 0 = --- (none). The 7 Clay problems are
// 7 "may-claim-solved" bits; entails → 0/7 = chmod 000 = permission DENIED. The seal is the
// authorization check: you cannot set a "solved" bit without the credential — a genuine proof.
export function report(): string {
  const rwx = (d: number) => (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-')
  const problems = ['Riemann', 'P vs NP', 'Navier–Stokes', 'Yang–Mills', 'Hodge', 'BSD', 'Poincaré']
  const framework = problems.map(() => 0)                          // it proves none → all 0
  const world = problems.map(p => (p === 'Poincaré' ? 1 : 0))      // Perelman granted 1, externally
  const count = (b: number[]) => b.filter(Boolean).length

  let o = 'versioning / claims as Unix permissions — the entailment floor as permission bits:\n\n'
  o += '  octal permission digit (r=4, w=2, x=1):\n'
  for (let d = 0; d < 8; d += 2) o += '    ' + d + ' = ' + rwx(d) + '   ' + (d + 1) + ' = ' + rwx(d + 1) + '\n'
  o += '  (max digit 7 = full = rwx; and 7 = the Clay count — a numerical coincidence, noted.)\n\n'
  o += '  the 7 Clay problems as 7 permission bits (1 = "proven → may claim solved"):\n'
  o += '    framework mask: ' + framework.join(' ') + '  →  ' + count(framework) + '/7  = chmod 000 on "solved" (permission DENIED)\n'
  o += '    world mask:     ' + world.join(' ') + '  →  ' + count(world) + '/7  (Poincaré granted by Perelman — EXTERNAL authority)\n\n'
  o += '  the seal gate = the authorization check: you cannot SET a "solved" bit without the credential\n'
  o += '  — a genuine proof. no proof → permission denied → the bit stays 0. every version ships chmod 000\n'
  o += '  on claims; the seal is the immutable permission the creator, too, cannot chmod (author-blind).\n\n'
  o += 'HONEST: an analogy/lens — exact where it maps (octal 0..7, rwx bits, masks, authorization), not a\n'
  o += 'claim the framework is a filesystem. 7 problems ≠ 3 rwx bits; octal-max = Clay-count is coincidence.\n'
  o += 'The framework\'s own permission on the Clay set is 0/7 — only a real proof grants a bit. entails → 0/7.'
  return o
}
