// Decode a version as Unix permissions → RBAC. A chmod is THREE octal digits (owner·group·other,
// each rwx); a version is THREE components (major·minor·patch). Same shape — so the version decodes
// as a role-based access triple. Structural isomorphism, exact for octal digits 0..7.
function rwx(d: number): string { return (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-') }

export function report(): string {
  const roles = ['owner  (author)', 'group  (contributors)', 'other  (public)']
  const decode = (v: number[]) => v.map((d) => (d <= 7 ? rwx(d) : '?? (8,9 exceed rwx)')).join(' ')

  const rows: [string, number[]][] = [
    ['v0.0.0', [0, 0, 0]],
    ['v1.0.0', [1, 0, 0]],
    ['v1.1.6', [1, 1, 6]],
    ['chmod 755', [7, 5, 5]],
  ]

  let o = 'decode the version as Unix permissions → RBAC:\n\n'
  o += '  major·minor·patch  ≅  owner·group·other  (each octal digit 0..7 = rwx):\n'
  o += '    ' + roles.join('   ') + '\n'
  rows.forEach(([name, v]) => { o += '    ' + name.padEnd(10) + v.join('.') + '  →  ' + decode(v) + '\n' })
  o += '\n  the RBAC reading: major = owner (author) rights, minor = group (contributors), patch =\n'
  o += '  other (public). "0 is always stable" ⇒ patch 0 = other "---" = the public has NO write at a\n'
  o += '  stable v1.x.0 — the release is locked/read-only. development (patch>0) opens more bits.\n\n'
  o += 'HONEST: the STRUCTURE is an exact isomorphism (3 components ↔ 3 classes × rwx, for octal 0..7).\n'
  o += 'But the version numbers were NOT chosen as an access policy, so a specific decode (e.g. public\n'
  o += '"rw-" at v1.1.6) is incidental, not a real permission. And single-digit versions run 0..9 while\n'
  o += 'rwx octal runs 0..7 — components 8,9 exceed rwx. Real access control here is the SEAL GATE +\n'
  o += 'CC BY-NC (public, no secret), not a filesystem ACL. RBAC is a LENS on the version, not an\n'
  o += 'enforced system. entails → 0/7.'
  return o
}
