// Public-access trinity — everyone has the latest token to develop on.
// Three public channels; the "token" is the latest version (a public name, not a secret) — clone,
// read, or build on it freely. Status is marked honestly: GitHub + site are LIVE; Zenodo (DOI) and
// npm are STAGED, gated on the author's account actions.
import { toUuid, merkleFold } from '../0/index.ts'

type Channel = { name: string; where: string; status: 'LIVE' | 'STAGED'; note: string }

const CHANNELS: Channel[] = [
  { name: 'GitHub (source)', where: 'github.com/ceccec/millennium-solutions', status: 'LIVE', note: 'all tags public — clone any version' },
  { name: 'Site (published)', where: 'ceccec.psg.bg/millennium-solutions', status: 'LIVE', note: 'recomputes in the browser' },
  { name: 'Zenodo (archive/DOI)', where: 'doi.org/10.5281/zenodo.21819217', status: 'LIVE', note: 'minted; honest abstract (0/7), CC BY-NC 4.0' },
]
const NPM: Channel = { name: 'npm (packages)', where: 'registry.npmjs.org', status: 'STAGED', note: 'npm login → npm run deploy packages (author)' }

export function report(): string {
  const surface = merkleFold([...CHANNELS, NPM].map(c => toUuid(c.name + ':' + c.where)))

  let o = 'public-access trinity — everyone has the latest token to develop on:\n\n'
  o += '  the token = the latest version (a PUBLIC name, not a secret). read / clone / build on it.\n\n'
  CHANNELS.forEach(c => {
    o += '  [' + c.status.padEnd(6) + '] ' + c.name + '\n'
    o += '            ' + c.where + '  — ' + c.note + '\n'
  })
  o += '\n  package channel:\n'
  o += '  [' + NPM.status.padEnd(6) + '] ' + NPM.name + '  ' + NPM.where + '  — ' + NPM.note + '\n\n'
  o += '  access-surface content-address: ' + surface.slice(0, 13) + '…\n'
  o += '  (the live "latest token" = the newest tag + the version-seal root, from scripts/versions.mjs)\n\n'
  o += 'HONEST: GitHub + the site are LIVE and fully public — everyone already has the latest to develop\n'
  o += 'on. Zenodo (DOI) and npm are STAGED, not yet published: both need the author\'s account (Zenodo\n'
  o += 'enablement + a release; npm login). "Token" means a public version handle, never a secret\n'
  o += 'credential — public access is transparency, not a key. entails → 0/7.'
  return o
}
