// VitePress build-time data loader — the ISO 690 reference list, so EVERY page can render it as a publication.
//
// NOTHING IS TYPED HERE. isoReferences() reads the ISO standards from src/iso's own classification record and
// the prior art from the provenance chain — the one source scripts/zenodo-json.ts (the Zenodo record) and the
// README (scripts/pages.ts) already draw from. This loader only hands that list to a Vue component so the
// footer of every page carries the same bibliography; it mints no reference.
import { isoReferences } from '../../src/publication/index.ts'

declare const data: string[]
export { data }

export default {
  // re-run when either source of the list changes
  watch: ['../../src/iso/README.md', '../../src/ledger/provenance.json'],
  load(): string[] { return isoReferences() },
}
