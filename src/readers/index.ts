/** ── THE READERS — every scientific and medical source this deposit can ask, as data ───────────────────────
 *
 *  NAMES, URLS, EXPECTED FACTS AND BOUNDARIES ONLY. No fetch, no handler, no way to reach a network from this
 *  module. scripts/readers.ts holds the probing. That split is not tidiness: scripts/pages.ts and
 *  scripts/notice.ts import registries like this one to derive counts, both sit on the verification path a
 *  third party walks, and a registry that imported its own fetcher would put a network call on the path this
 *  deposit tells that third party needs no network. src/mcp/index.ts carries the same split for the same
 *  reason, and it was written after the defect, not before it.
 *
 *  ── WHAT THESE ARE FOR, AND THE ONE THING THEY ARE NOT FOR ───────────────────────────────────────────────
 *
 *  They are CITATION AND ATTRIBUTION instruments. They answer "who published this, when, and under what
 *  identifier" so that a claim in this deposit can be checked against the literature, and so that work
 *  belonging to somebody else is credited to them.
 *
 *  THEY ARE NOT A SOURCE OF MEDICAL OR THERAPEUTIC GUIDANCE, and that boundary is enforced rather than
 *  promised. scripts/contradictions.ts already refuses 1020 medical and physical-force overclaim phrasings in
 *  this deposit's own voice, and gates-fire carries a control that plants one to prove the refusal fires. A
 *  framework about ℤ/9 has no standing to advise anybody's body, and the herbal sources are the sharpest case:
 *  an ethnobotanical record is EVIDENCE THAT A USE WAS DOCUMENTED, never evidence that it works, and never a
 *  dose. Traditional use, pharmacological activity in a dish, and clinical efficacy in a person are three
 *  different claims that share a plant name, and conflating them is how herbal information hurts people.
 *
 *  Every source therefore declares `notFor` as well as `for`, and the two are checked to be non-empty.
 *
 *  ── EACH IS PROVEN AGAINST AN ANSWER KNOWN BEFORE IT IS ASKED ────────────────────────────────────────────
 *
 *  A broken reader does not announce itself: it returns nothing and reads as "found nothing". This deposit has
 *  been bitten there twice — a CERN filter that returned exactly the API's own total, and a citation counter
 *  that matched the User-Agent it had just sent. So `expect` names a fact true independently of this deposit.
 *  Where I am confident of a specific value it is the value; where I am not, it is a STRUCTURAL fact about the
 *  response, because scripts/sources.ts records what the other kind costs: "a probe whose expected answer
 *  depends on my recollection tests my recollection." A probe reporting WRONG about a healthy service is a
 *  finding about me, and it is better to find it here than to publish it. */

export type Domain =
  | 'literature' | 'trials' | 'chemistry' | 'drugs' | 'genes' | 'pathways'
  | 'taxonomy' | 'herbal' | 'terminology' | 'nutrition' | 'metrology'

export type Reader = {
  source: string
  domain: Domain
  why: string
  /** The request. `null` means the source requires a credential and cannot be probed anonymously — recorded
   *  rather than omitted, because "we could not add this" is a claim about the world and the kind that becomes
   *  folklore if it is never written down. */
  url: string | null
  /** POST, for the sources that only answer to one. Added because Open Targets is GraphQL and a GET-only
   *  prober could not reach it at all — the reader was missing not because the source was unreachable but
   *  because this file could not phrase the question. A framework's shape quietly deciding which sources
   *  exist is the kind of omission that reads as "we checked and found nothing". */
  method?: 'GET' | 'POST'
  /** The request body, for POST. A GraphQL query is data, so it lives here beside the endpoint. */
  body?: string
  /** What must appear in the response. Absent when url is null. */
  expect?: (body: string) => boolean
  /** How the source must be credited. Every one of these belongs to somebody else. */
  attribution: string
  for: string
  notFor: string
}

export const READERS: Reader[] = [
  // ── BIOMEDICAL LITERATURE ────────────────────────────────────────────────────────────────────────────────
  { source: 'europepmc', domain: 'literature', why: 'a DOI resolves to an indexed record, so a citation can be checked',
    url: 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:%2210.1038/nature12373%22&format=json',
    expect: (b) => /"hitCount"\s*:\s*[1-9]/.test(b),
    attribution: 'Europe PMC, EMBL-EBI. Europe PMC Consortium.',
    for: 'establishing that a paper exists, who wrote it and when — the attribution question',
    notFor: 'concluding a finding is true because it is indexed, or that it is false because it is not' },
  { source: 'pubmed', domain: 'literature', why: 'PMID 1 is the oldest record in the index and does not move',
    url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=1&retmode=json',
    expect: (b) => /"uid"\s*:\s*"1"/.test(b) && /1975/.test(b),
    attribution: 'PubMed, National Library of Medicine (NCBI), U.S. National Institutes of Health.',
    for: 'the same attribution question, against the largest biomedical index',
    notFor: 'ranking evidence quality; an index position is not a peer review' },
  { source: 'crossref:medical', domain: 'literature', why: 'a registered DOI returns its own identifier',
    url: 'https://api.crossref.org/works/10.1136/bmj.39489.470347.AD',
    expect: (b) => /"DOI"\s*:\s*"10\.1136\\?\/bmj\.39489\.470347\.ad"/i.test(b),
    attribution: 'Crossref.',
    for: 'resolving a DOI to its registered metadata',
    notFor: 'anything about the content of the work behind the DOI' },

  // ── CLINICAL TRIALS ──────────────────────────────────────────────────────────────────────────────────────
  { source: 'clinicaltrials', domain: 'trials', why: 'a registered study returns its own NCT number',
    url: 'https://clinicaltrials.gov/api/v2/studies/NCT00000102',
    expect: (b) => /NCT00000102/.test(b),
    attribution: 'ClinicalTrials.gov, U.S. National Library of Medicine.',
    for: 'whether a trial was REGISTERED, its stated design and its status — the pre-registration question, which is what makes selective reporting visible',
    notFor: 'whether the intervention works. A registration is a plan, and a completed trial with no posted results is exactly the thing this source exists to expose' },
  { source: 'who:ictrp', domain: 'trials', why: 'the WHO registry network has no open anonymous JSON endpoint',
    url: null,
    attribution: 'WHO International Clinical Trials Registry Platform.',
    for: 'trials registered outside the U.S. registry — the reason a U.S.-only search is not a world search',
    notFor: 'anything, until it can be read; it is recorded here as a KNOWN GAP in coverage rather than left implicit' },

  // ── CHEMISTRY AND COMPOUNDS ──────────────────────────────────────────────────────────────────────────────
  { source: 'pubchem', domain: 'chemistry', why: 'aspirin is C9H8O4 — a fact older than every database holding it',
    url: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/aspirin/property/MolecularFormula/JSON',
    expect: (b) => /C9H8O4/.test(b),
    attribution: 'PubChem, National Center for Biotechnology Information.',
    for: 'the identity of a compound: formula, mass, structure, synonyms, and the identifiers that let two datasets be joined without matching on a name',
    notFor: 'safety, dose or effect. A molecular formula says nothing about what a substance does in a body' },
  { source: 'chembl', domain: 'chemistry', why: 'CHEMBL25 is aspirin, and its formula is the same fact from a second source',
    url: 'https://www.ebi.ac.uk/chembl/api/data/molecule/CHEMBL25.json',
    expect: (b) => /C9H8O4/.test(b) || /ASPIRIN/i.test(b),
    attribution: 'ChEMBL, EMBL-EBI.',
    for: 'measured bioactivity as PUBLISHED — assay, target, value, and the paper it came from',
    notFor: 'inferring a clinical effect from an assay number. Activity in a well is not efficacy in a person, and the gap between them is where most of this data is misread' },
  { source: 'chebi', domain: 'chemistry', why: 'the ontology resolves a compound to its place in a hierarchy',
    url: 'https://www.ebi.ac.uk/ols4/api/ontologies/chebi/terms?short_form=CHEBI%3A15365',
    expect: (b) => /acetylsalicylic/i.test(b) || /CHEBI_15365/.test(b),
    attribution: 'ChEBI, EMBL-EBI, via the Ontology Lookup Service.',
    for: 'the ontology: what kind of thing a compound is, and what it is a kind of',
    notFor: 'treating an ontological parent as a shared effect. Two salicylates are not interchangeable' },

  // ── DRUGS, LABELS AND ADVERSE EVENTS ─────────────────────────────────────────────────────────────────────
  { source: 'rxnorm', domain: 'drugs', why: 'a normalised drug name returns a concept id, which is the join key between datasets',
    url: 'https://rxnav.nlm.nih.gov/REST/rxcui.json?name=aspirin',
    expect: (b) => /"rxnormId"\s*:\s*\[\s*"\d+"/.test(b),
    attribution: 'RxNorm, National Library of Medicine.',
    for: 'normalising drug names so two records about the same substance can be joined — the problem that makes free-text drug names useless',
    notFor: 'prescribing anything. A normalised name is a name' },
  { source: 'openfda:label', domain: 'drugs', why: 'the label endpoint answers with a result set and its total',
    url: 'https://api.fda.gov/drug/label.json?limit=1',
    expect: (b) => /"results"\s*:\s*\[/.test(b) && /"total"\s*:\s*\d+/.test(b),
    attribution: 'openFDA, U.S. Food and Drug Administration. Not for clinical use, per FDA\'s own terms.',
    for: 'what a manufacturer\'s APPROVED LABEL says — the regulated text, including its warnings and its stated indications',
    notFor: 'medical advice. The FDA states this itself about this API, and a label is the manufacturer\'s regulated claim, not an independent verdict' },
  { source: 'openfda:events', domain: 'drugs', why: 'the adverse event endpoint answers with a total',
    url: 'https://api.fda.gov/drug/event.json?limit=1',
    expect: (b) => /"total"\s*:\s*\d+/.test(b),
    attribution: 'FAERS via openFDA, U.S. Food and Drug Administration.',
    for: 'that a report was FILED — a signal for investigation',
    notFor: 'causation, and not even correlation. FAERS is voluntary, unverified and duplicated; counting reports and calling it risk is the single most common abuse of this dataset' },
  { source: 'dailymed', domain: 'drugs', why: 'the label service returns a paginated list',
    url: 'https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?pagesize=1',
    expect: (b) => /"data"\s*:\s*\[/.test(b) || /setid/i.test(b),
    attribution: 'DailyMed, National Library of Medicine.',
    for: 'the current official label text for a marketed product, including herbal and supplement products that carry one',
    notFor: 'the same limit as any label: it is the manufacturer\'s regulated text' },

  // ── GENES, PROTEINS, PATHWAYS ────────────────────────────────────────────────────────────────────────────
  { source: 'uniprot', domain: 'genes', why: 'P69905 is haemoglobin subunit alpha, one of the best-characterised proteins there is',
    url: 'https://rest.uniprot.org/uniprotkb/P69905.json',
    expect: (b) => /Hemoglobin subunit alpha/i.test(b),
    attribution: 'UniProt Consortium (EMBL-EBI, SIB, PIR).',
    for: 'protein identity, sequence, function as curated, and cross-references',
    notFor: 'inferring what a variant does in a person from a reference sequence' },
  { source: 'ensembl', domain: 'genes', why: 'ENSG00000139618 is BRCA2 — a stable identifier for a much-studied gene',
    url: 'https://rest.ensembl.org/lookup/id/ENSG00000139618?content-type=application/json',
    expect: (b) => /BRCA2/i.test(b),
    attribution: 'Ensembl, EMBL-EBI.',
    for: 'gene coordinates, identifiers and the mapping between naming systems',
    notFor: 'clinical interpretation of a variant. That is a separate, curated, and contested question' },
  { source: 'kegg', domain: 'pathways', why: 'hsa00010 is glycolysis, and has been since long before this deposit',
    url: 'https://rest.kegg.jp/get/hsa00010',
    expect: (b) => /Glycolysis/i.test(b),
    attribution: 'KEGG, Kanehisa Laboratories. Academic use; commercial use requires a licence.',
    for: 'the curated pathway: which reactions are held to connect to which',
    notFor: 'treating a drawn arrow as a measured flux in a particular tissue at a particular time' },
  { source: 'reactome', domain: 'pathways', why: 'the pathway service resolves a stable identifier',
    url: 'https://reactome.org/ContentService/data/query/R-HSA-70171',
    expect: (b) => /[Gg]lycolysis/.test(b) || /"stId"\s*:\s*"R-HSA-70171"/.test(b),
    attribution: 'Reactome, CC0.',
    for: 'a second independent pathway curation, so a claim resting on one curation can be seen to rest on one',
    notFor: 'the same limit as any pathway map' },

  // ── TARGET AND DISEASE ───────────────────────────────────────────────────────────────────────────────────
  { source: 'opentargets', domain: 'genes', why: 'ENSG00000157764 is BRAF — one of the best-characterised oncogenes there is, and the identifier is Ensembl\'s, so this also checks the two services agree on it',
    url: 'https://api.platform.opentargets.org/api/v4/graphql',
    method: 'POST',
    body: JSON.stringify({ query: '{ target(ensemblId: "ENSG00000157764") { id approvedSymbol biotype } }' }),
    expect: (b) => /"approvedSymbol"\s*:\s*"BRAF"/.test(b) && /"biotype"\s*:\s*"protein_coding"/.test(b),
    attribution: 'Open Targets Platform — EMBL-EBI, Wellcome Sanger Institute and partners. CC0 for the data; individual evidence carries its source\'s own terms.',
    for: 'which targets are ASSOCIATED with which diseases, and — the part that matters — the EVIDENCE behind each association, typed and traceable to the study that produced it. It is the only source here that scores a link rather than merely recording one',
    notFor: 'treating an association score as a causal claim, or as a drug that works. The score summarises evidence of a relationship; it is not efficacy, not a mechanism, and not a recommendation. Reading a high score as "this drug treats this disease" is the specific misuse this dataset attracts' },

  // ── TAXONOMY AND PLANTS ──────────────────────────────────────────────────────────────────────────────────
  { source: 'gbif', domain: 'taxonomy', why: 'German chamomile matches to the Asteraceae, which is settled botany',
    url: 'https://api.gbif.org/v1/species/match?name=Matricaria%20chamomilla',
    expect: (b) => /Asteraceae/i.test(b) && /"matchType"\s*:\s*"EXACT"/i.test(b),
    attribution: 'GBIF Secretariat, via the GBIF Backbone Taxonomy.',
    for: 'resolving a plant NAME to an accepted name and a taxonomic position — the first thing that must happen before any plant record is joined to another, because common names are ambiguous across languages and centuries',
    notFor: 'anything about the plant\'s properties. A name is a name' },
  { source: 'wfo', domain: 'taxonomy', why: 'the plant list matches a name to an accepted identifier',
    url: 'https://list.worldfloraonline.org/matching_rest.php?input_string=Matricaria%20chamomilla',
    expect: (b) => /wfo-\d+/i.test(b) || /Matricaria/i.test(b),
    attribution: 'World Flora Online Consortium.',
    for: 'a second independent naming authority, so synonymy disagreements are visible instead of averaged',
    notFor: 'the same limit: naming only. AND A MEASURED CAVEAT, 2026-09-28: this host serves an INCOMPLETE '
      + 'TLS certificate chain — no intermediate — so node refuses it with UNABLE_TO_VERIFY_LEAF_SIGNATURE '
      + 'while curl accepts it from the system trust store. The service is up and answers in under a second; '
      + 'it is misconfigured, which is not the same as down. Recorded here rather than worked around: running '
      + 'node with --use-system-ca would hide a real defect in somebody else\'s deployment behind a flag in '
      + 'this one, and disabling verification would be worse. It reads NOT MEASURED, correctly, with the reason' },
  { source: 'powo', domain: 'taxonomy', why: 'Kew\'s Plants of the World Online has no documented open JSON API',
    url: null,
    attribution: 'Plants of the World Online, Royal Botanic Gardens, Kew.',
    for: 'distribution and accepted nomenclature from the authority most herbal literature cites',
    notFor: 'anything, until read; recorded as a known gap' },

  // ── HERBAL AND ETHNOBOTANICAL — THE SHARPEST BOUNDARY IN THIS FILE ───────────────────────────────────────
  { source: 'wikidata:phyto', domain: 'herbal', why: 'a SPARQL endpoint answers a structured query about plant-compound statements',
    url: 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(
      'SELECT ?c WHERE { wd:Q158695 wdt:P279|wdt:P31 ?c } LIMIT 1'),
    expect: (b) => /"results"/.test(b) && /"bindings"/.test(b),
    attribution: 'Wikidata, CC0. Individual statements carry their own sources and many carry none.',
    for: 'finding WHICH published records link a plant to a compound, as a starting point for reading them',
    notFor: 'treating a link as a fact. Wikidata is openly editable; an unsourced statement there is a lead to check, and citing it as evidence would be citing an edit' },
  { source: 'lotus', domain: 'herbal', why: 'the natural-products dataset is distributed through Wikidata and Zenodo, not a dedicated API',
    url: null,
    attribution: 'LOTUS — the natural products occurrence database (Rutz et al.), CC0.',
    for: 'documented occurrences of a natural product in an organism, with the reference for each',
    notFor: 'an occurrence is not a concentration, a bioavailability or an effect' },
  { source: 'duke:phyto', domain: 'herbal', why: 'Dr Duke\'s databases are served as a web application with no documented JSON API',
    url: null,
    attribution: 'Dr. Duke\'s Phytochemical and Ethnobotanical Databases, USDA Agricultural Research Service.',
    for: 'the classical ethnobotanical record: which uses were DOCUMENTED, by whom, and where',
    notFor: 'a documented traditional use is a historical and anthropological fact. It is not evidence of efficacy, and the distinction is the whole reason this field needs care' },
  { source: 'mpns', domain: 'herbal', why: 'Kew\'s Medicinal Plant Names Services requires a registered API key',
    url: null,
    attribution: 'Medicinal Plant Names Services, Royal Botanic Gardens, Kew.',
    for: 'reconciling the pharmaceutical, trade and scientific names of a medicinal plant — the single hardest joining problem in this domain',
    notFor: 'anything, until a key is held; recorded as a credential gap, the same category as the Zenodo deposit token' },
  { source: 'napralert', domain: 'herbal', why: 'licensed, subscription only',
    url: null,
    attribution: 'NAPRALERT, University of Illinois Chicago.',
    for: 'the most complete curated natural-products literature index there is',
    notFor: 'anything, until licensed; named so that a gap in coverage is not mistaken for an absence of literature' },

  // ── MEDICAL TERMINOLOGY ──────────────────────────────────────────────────────────────────────────────────
  { source: 'mesh', domain: 'terminology', why: 'the vocabulary resolves a label to a descriptor identifier',
    url: 'https://id.nlm.nih.gov/mesh/lookup/descriptor?label=Chamomile&match=exact&limit=1',
    expect: (b) => /D\d{6}/.test(b),
    attribution: 'Medical Subject Headings, National Library of Medicine.',
    for: 'the controlled vocabulary that makes a literature search reproducible instead of dependent on wording',
    notFor: 'a heading is a search term, not a clinical category' },
  { source: 'who:icd11', domain: 'terminology', why: 'the ICD-11 API requires OAuth2 client credentials',
    url: null,
    attribution: 'ICD-11, World Health Organization.',
    for: 'the international standard for naming a condition — without which two datasets about the same illness cannot be compared',
    notFor: 'anything, until credentials are held; a credential gap, recorded' },
  { source: 'hpo', domain: 'terminology', why: 'the phenotype ontology resolves a term through the ontology service',
    url: 'https://www.ebi.ac.uk/ols4/api/ontologies/hp/terms?short_form=HP%3A0001250',
    expect: (b) => /[Ss]eizure/.test(b) || /HP_0001250/.test(b),
    attribution: 'Human Phenotype Ontology, Monarch Initiative.',
    for: 'naming an observed phenotype precisely enough to be comparable between studies',
    notFor: 'diagnosing anybody. A term for a sign is not the presence of the sign' },

  // ── NUTRITION ────────────────────────────────────────────────────────────────────────────────────────────
  { source: 'openfoodfacts', domain: 'nutrition', why: 'the product endpoint answers with a status for a barcode',
    url: 'https://world.openfoodfacts.org/api/v2/product/737628064502.json',
    expect: (b) => /"status"\s*:\s*[01]/.test(b),
    attribution: 'Open Food Facts contributors, ODbL.',
    for: 'what is PRINTED on a product: declared ingredients and declared nutrition',
    notFor: 'a declared value is a declaration. It is crowd-entered, and it is not an assay' },
  { source: 'usda:fdc', domain: 'nutrition', why: 'FoodData Central requires a registered API key',
    url: null,
    attribution: 'FoodData Central, USDA Agricultural Research Service.',
    for: 'laboratory-measured composition, which is the thing a printed label is not',
    notFor: 'anything, until a key is held; a credential gap, recorded' },

  // ── METROLOGY — the one domain where a value is defined rather than measured ──────────────────────────────
  { source: 'nist:codata', domain: 'metrology', why: 'the defined constants are exact by definition of the SI, and src/proof/light.lean already decides consequences of them',
    url: 'https://physics.nist.gov/cuu/Constants/Table/allascii.txt',
    expect: (b) => /299 792 458/.test(b) && /6\.626 070 15/.test(b),
    attribution: 'CODATA, via NIST. The SI defining constants are exact.',
    for: 'the values this deposit\'s physical theorems are stated over, and the uncertainties attached to the measured ones',
    notFor: 'treating a measured constant\'s digits as exact. src/proof/planck.lean exists because that error is easy to make and this deposit made it' },
]

export const DOMAINS = [...new Set(READERS.map((r) => r.domain))].sort()
export const PROBEABLE = READERS.filter((r) => r.url !== null)
/** Sources that exist, matter, and cannot be read without a credential or a licence. Named, not omitted: an
 *  unrecorded gap in coverage becomes an implicit claim of completeness. */
export const GATED = READERS.filter((r) => r.url === null)
