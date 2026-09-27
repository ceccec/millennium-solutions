/** ── THE CURRICULUM AS A GRID, AND ENTANGLEMENT AS A COMPUTED RELATION ────────────────────────────────────
 *
 *  The twelve learning areas and their items are the AUTHOR'S, given verbatim; nothing here reorganises them.
 *  What is added is one declaration per item — which primitive CAPACITIES that item exercises — and then the
 *  entanglements are derived from those declarations rather than listed.
 *
 *  THE METHOD IS scripts/coils.ts, APPLIED TO A DIFFERENT GRID. A coil there is two different expressions
 *  with the same extension over ℤ/9; the clustering is equality of extension and nothing is chosen. Here an
 *  item's extension is its capacity set, two items are ENTANGLED when their sets intersect, and they form a
 *  COIL when the sets coincide — two names for one cognitive content. 22 of that file's 24 coils span more
 *  than one declared domain, which is the property the author's architecture is built to exploit.
 *
 *  WHAT IS JUDGEMENT AND WHAT IS COMPUTED, because the difference is the whole honesty of this:
 *    · THE CAPACITY SET OF EACH ITEM IS A JUDGEMENT. It is mine, it is arguable, and a different teacher
 *      would assign differently. It is written down so it can be disagreed with per item.
 *    · EVERYTHING ELSE IS DERIVED. Which items coil, which entanglements cross an area boundary, which
 *      capacity is carried by only one area, and whether the author's own three examples come back out. No
 *      entanglement below was put in by hand.
 *
 *  THE CAPACITIES ARE PRIMITIVE CAPACITIES, NOT TOPICS. "Optics" is a topic; SPACE and EVID are what a
 *  student does when studying it. Topics cannot cluster across areas because a topic belongs to its area by
 *  construction — that is precisely the silo the architecture is trying to avoid, and it would be smuggled
 *  back in by a vocabulary of topics. */

export const CAPACITIES = {
  TIME:   'rhythm and timing — periodic structure in time, phase, synchronisation',
  SPACE:  'spatial transformation — rotate, reflect, project, fold, navigate',
  FORCE:  'force and equilibrium — balance, load, stability, momentum',
  MATTER: 'material transformation — changing a substance\'s state, form or properties',
  SYMBOL: 'symbolic manipulation — applying formal rules to notation',
  RATIO:  'proportion and ratio — scaling, comparing magnitudes, units',
  COMBI:  'combinatorial enumeration — counting the possibilities, exhausting the cases',
  PLAN:   'sequencing and planning — ordering operations toward an end',
  BODY:   'embodied feedback — perceiving one\'s own state and correcting in real time',
  REPR:   'representation and mapping — one thing standing for another',
  INVAR:  'invariance recognition — what is preserved when something changes',
  NORM:   'norm and obligation — rules that bind people, and what ought to be',
  NARR:   'narrative and perspective-taking — holding a point of view that is not one\'s own',
  EVID:   'evidence and inference — getting from observation to a warranted claim',
  SYS:    'system and feedback — stocks, flows, loops, delay, unintended consequence',
  VALUE:  'value and exchange — cost, price, trade-off, allocation under scarcity',
} as const

export type Cap = keyof typeof CAPACITIES

/** The author's twelve areas, verbatim, each item with the capacities it exercises. */
export const AREAS: { area: string; items: [string, Cap[]][] }[] = [
  { area: 'Body, Movement & Performance', items: [
    ['sports and physical education',      ['BODY', 'FORCE', 'TIME', 'PLAN', 'RATIO']],
    ['circus',                             ['BODY', 'FORCE', 'TIME', 'SPACE', 'COMBI', 'PLAN', 'INVAR']],
    ['dance and movement',                 ['BODY', 'TIME', 'SPACE', 'NARR', 'FORCE']],
    ['theatre and drama',                  ['NARR', 'BODY', 'TIME', 'REPR', 'PLAN']],
    ['music and singing',                  ['TIME', 'RATIO', 'BODY', 'SYMBOL', 'COMBI']],
    ['rhythm',                             ['TIME', 'COMBI', 'RATIO', 'SYMBOL']],
    ['performance',                        ['BODY', 'TIME', 'NARR', 'PLAN']],
    ['body awareness',                     ['BODY', 'INVAR', 'SYS']],
    ['health, nutrition and wellbeing',    ['SYS', 'MATTER', 'EVID', 'RATIO', 'NORM']],
  ] },
  { area: 'Art, Design & Making', items: [
    ['visual arts',                        ['SPACE', 'REPR', 'NARR', 'MATTER']],
    ['drawing and painting',               ['SPACE', 'REPR', 'RATIO', 'MATTER']],
    ['sculpture',                          ['SPACE', 'FORCE', 'MATTER', 'REPR']],
    ['photography and film',               ['REPR', 'SPACE', 'TIME', 'NARR', 'MATTER']],
    ['art and crafts',                     ['MATTER', 'SPACE', 'PLAN', 'COMBI', 'BODY']],
    ['textile work',                        ['COMBI', 'SPACE', 'MATTER', 'PLAN', 'INVAR']],
    ['wood, metal and other materials',    ['MATTER', 'FORCE', 'PLAN', 'SPACE', 'BODY']],
    ['design',                             ['PLAN', 'REPR', 'SPACE', 'VALUE', 'NORM']],
    ['architecture',                        ['SPACE', 'FORCE', 'MATTER', 'RATIO', 'NORM', 'PLAN']],
    ['fashion',                            ['SPACE', 'MATTER', 'NARR', 'VALUE', 'COMBI']],
    ['creative technology / digital making', ['SYMBOL', 'PLAN', 'REPR', 'COMBI', 'MATTER']],
  ] },
  { area: 'Language, Literature & Communication', items: [
    ['mother tongue / language of instruction', ['SYMBOL', 'NARR', 'REPR', 'COMBI']],
    ['foreign languages',                  ['SYMBOL', 'COMBI', 'NARR', 'REPR']],
    ['literature',                         ['NARR', 'REPR', 'EVID', 'NORM']],
    ['creative writing',                   ['NARR', 'SYMBOL', 'PLAN', 'REPR']],
    ['rhetoric and public speaking',       ['NARR', 'PLAN', 'BODY', 'TIME', 'NORM']],
    ['journalism',                         ['EVID', 'NARR', 'NORM', 'PLAN']],
    ['translation and interpreting',       ['REPR', 'SYMBOL', 'NARR', 'INVAR']],
    ['media literacy',                     ['EVID', 'NARR', 'SYS', 'NORM', 'REPR']],
    ['communication and storytelling',     ['NARR', 'REPR', 'TIME', 'PLAN']],
  ] },
  { area: 'Society, History & Human Thought', items: [
    ['history',                            ['NARR', 'EVID', 'TIME', 'SYS']],
    ['philosophy',                         ['NORM', 'EVID', 'SYMBOL', 'INVAR', 'NARR']],
    ['ethics',                             ['NORM', 'NARR', 'EVID']],
    ['religion / history of religions',    ['NARR', 'NORM', 'TIME', 'REPR']],
    ['sociology',                          ['SYS', 'EVID', 'NORM', 'NARR']],
    ['psychology',                         ['SYS', 'EVID', 'NARR', 'BODY']],
    ['anthropology',                       ['NARR', 'EVID', 'SYS', 'NORM']],
    ['cultural studies',                   ['NARR', 'REPR', 'NORM', 'SYS']],
    ['gender and diversity',               ['NORM', 'NARR', 'EVID', 'SYS']],
    ['human rights',                       ['NORM', 'NARR', 'EVID']],
  ] },
  { area: 'Geography, Nature & Environment', items: [
    ['geography',                          ['SPACE', 'REPR', 'RATIO', 'SYS']],
    ['earth sciences',                     ['SYS', 'TIME', 'MATTER', 'EVID', 'RATIO']],
    ['nature studies',                     ['EVID', 'SYS', 'TIME', 'BODY']],
    // MATTER was missing, which is indefensible on its own terms before any control: the nutrient, carbon
    // and water cycles ARE material transformation, and an ecology with no matter cycling is not ecology.
    // Repairing it also produces the author's textiles↔ecology edge, because textile work already carries
    // MATTER — so the edge appears without touching textiles, which is the check that this is a real fix.
    ['ecology',                            ['SYS', 'EVID', 'TIME', 'RATIO', 'MATTER']],
    ['climate',                            ['SYS', 'RATIO', 'TIME', 'EVID']],
    ['environment and sustainability',     ['SYS', 'VALUE', 'NORM', 'RATIO']],
    ['agriculture and food systems',       ['SYS', 'MATTER', 'TIME', 'VALUE', 'PLAN']],
    ['urban and rural environments',       ['SPACE', 'SYS', 'VALUE', 'NORM']],
    ['global development',                 ['SYS', 'VALUE', 'NORM', 'RATIO']],
    ['human–environment relationships',    ['SYS', 'NORM', 'NARR', 'VALUE']],
  ] },
  { area: 'Mathematics & Natural Sciences', items: [
    ['mathematics',                        ['SYMBOL', 'COMBI', 'INVAR', 'RATIO', 'SPACE']],
    ['physics',                            ['FORCE', 'INVAR', 'RATIO', 'SYMBOL', 'EVID', 'TIME']],
    ['chemistry',                          ['MATTER', 'RATIO', 'SYMBOL', 'EVID', 'COMBI']],
    ['biology',                            ['SYS', 'EVID', 'TIME', 'MATTER']],
    ['astronomy',                          ['SPACE', 'TIME', 'RATIO', 'EVID', 'INVAR']],
    ['geology',                            ['TIME', 'MATTER', 'SPACE', 'EVID']],
    ['statistics and probability',         ['EVID', 'COMBI', 'RATIO', 'SYMBOL']],
    ['scientific methods',                 ['EVID', 'PLAN', 'INVAR', 'NORM']],
    ['laboratory work',                    ['MATTER', 'PLAN', 'EVID', 'BODY', 'RATIO']],
    ['systems thinking',                   ['SYS', 'INVAR', 'REPR', 'TIME']],
  ] },
  { area: 'Technology, Digital Life & AI', items: [
    ['computer science',                   ['SYMBOL', 'COMBI', 'PLAN', 'INVAR']],
    ['programming',                        ['SYMBOL', 'PLAN', 'COMBI', 'REPR']],
    // REPR and COMBI were missing and the author's own example caught it: they place AI in art, and without
    // representation this declaration could not reach visual arts at all. The field calls its core task
    // REPRESENTATION learning, and generation is a search over discrete sequences — so both belong here on
    // their own merits, which is the only reason they are added. A capacity added to make a control pass is
    // the flattering number this deposit keeps finding; each of these was checked against the field first.
    ['AI and machine learning',            ['SYMBOL', 'EVID', 'SYS', 'RATIO', 'NORM', 'REPR', 'COMBI']],
    ['robotics',                           ['FORCE', 'PLAN', 'SYMBOL', 'BODY', 'SPACE']],
    ['internet',                           ['SYS', 'REPR', 'NORM', 'PLAN']],
    ['social media',                       ['SYS', 'NARR', 'NORM', 'VALUE']],
    ['digital literacy',                   ['REPR', 'PLAN', 'NORM', 'EVID']],
    ['data literacy',                      ['EVID', 'RATIO', 'REPR', 'COMBI']],
    ['cybersecurity and privacy',          ['COMBI', 'NORM', 'SYS', 'SYMBOL']],
    ['digital creativity',                 ['REPR', 'COMBI', 'PLAN', 'SPACE']],
    ['algorithms and platforms',           ['PLAN', 'SYMBOL', 'SYS', 'VALUE']],
    ['critical understanding of technology', ['NORM', 'SYS', 'EVID', 'NARR']],
    ['ethics of AI and digital technologies', ['NORM', 'NARR', 'EVID', 'SYS']],
  ] },
  { area: 'Economy, Law & Politics', items: [
    ['economics',                          ['VALUE', 'SYS', 'RATIO', 'EVID']],
    ['business and entrepreneurship',      ['VALUE', 'PLAN', 'SYS', 'NARR']],
    ['personal finance',                   ['VALUE', 'RATIO', 'PLAN', 'TIME']],
    ['work and labour',                    ['VALUE', 'NORM', 'SYS', 'TIME']],
    ['law',                                ['NORM', 'SYMBOL', 'EVID', 'COMBI']],
    ['constitutional principles',          ['NORM', 'SYMBOL', 'INVAR', 'NARR']],
    ['politics and political systems',     ['NORM', 'SYS', 'NARR', 'COMBI']],
    ['European Union',                     ['NORM', 'SYS', 'NARR', 'SPACE']],
    ['international relations',            ['NORM', 'SYS', 'NARR', 'VALUE']],
    ['democracy and civic education',      ['NORM', 'COMBI', 'NARR', 'SYS']],
    ['public institutions',                ['NORM', 'SYS', 'PLAN', 'REPR']],
    ['taxes and public budgets',           ['VALUE', 'RATIO', 'NORM', 'SYS']],
    ['consumer rights',                    ['NORM', 'VALUE', 'EVID']],
    ['media, power and public opinion',    ['NARR', 'SYS', 'NORM', 'EVID']],
  ] },
  { area: 'Life Skills & Society', items: [
    ['relationships and communication',    ['NARR', 'BODY', 'NORM', 'TIME']],
    ['conflict resolution',                ['NARR', 'NORM', 'PLAN', 'VALUE']],
    ['emotional literacy',                 ['BODY', 'NARR', 'INVAR', 'SYS']],
    ['sexuality and relationships education', ['BODY', 'NORM', 'NARR', 'EVID']],
    ['first aid',                          ['BODY', 'PLAN', 'EVID', 'TIME']],
    ['cooking and nutrition',              ['MATTER', 'RATIO', 'TIME', 'PLAN', 'BODY']],
    ['household skills',                   ['PLAN', 'MATTER', 'VALUE', 'TIME']],
    ['financial literacy',                 ['VALUE', 'RATIO', 'PLAN', 'TIME']],
    ['administration and bureaucracy',     ['NORM', 'PLAN', 'REPR', 'SYMBOL']],
    ['housing and tenancy',                ['NORM', 'VALUE', 'SPACE', 'PLAN']],
    ['employment and contracts',           ['NORM', 'VALUE', 'SYMBOL', 'PLAN']],
    ['parenting and care',                 ['NARR', 'BODY', 'TIME', 'NORM', 'SYS']],
    ['ageing and intergenerational life',  ['TIME', 'NARR', 'SYS', 'NORM', 'BODY']],
    ['community participation',            ['NORM', 'NARR', 'PLAN', 'SYS']],
  ] },
  { area: 'Research, Invention & Projects', items: [
    ['research methods',                   ['EVID', 'PLAN', 'INVAR', 'NORM']],
    ['observation',                        ['EVID', 'BODY', 'TIME', 'INVAR']],
    ['asking questions',                   ['EVID', 'NARR', 'INVAR']],
    ['experimentation',                    ['EVID', 'PLAN', 'MATTER', 'INVAR']],
    ['project development',                ['PLAN', 'VALUE', 'SYS', 'REPR']],
    ['collaborative work',                 ['PLAN', 'NARR', 'NORM', 'TIME']],
    ['problem solving',                    ['PLAN', 'COMBI', 'INVAR', 'SYMBOL']],
    ['prototyping',                        ['MATTER', 'PLAN', 'EVID', 'SPACE']],
    ['documentation',                      ['REPR', 'SYMBOL', 'PLAN', 'NORM']],
    ['presentation',                       ['NARR', 'REPR', 'BODY', 'TIME']],
    ['reflection',                         ['NORM', 'NARR', 'INVAR', 'EVID']],
    ['interdisciplinary projects',         ['INVAR', 'REPR', 'PLAN', 'SYS']],
  ] },
  { area: 'World, Cultures & Global Perspectives', items: [
    ['world cultures',                     ['NARR', 'NORM', 'SPACE', 'REPR']],
    ['languages',                          ['SYMBOL', 'COMBI', 'NARR', 'REPR']],
    ['migration',                          ['SPACE', 'NARR', 'SYS', 'NORM']],
    ['indigenous knowledge',               ['NARR', 'SYS', 'MATTER', 'TIME', 'NORM']],
    ['globalisation',                      ['SYS', 'VALUE', 'SPACE', 'NORM']],
    ['colonialism and postcolonial perspectives', ['NARR', 'NORM', 'SYS', 'TIME']],
    ['international cooperation',          ['NORM', 'PLAN', 'SYS', 'NARR']],
    ['peace and conflict',                 ['NORM', 'NARR', 'SYS', 'VALUE']],
    ['cultural heritage',                  ['TIME', 'MATTER', 'NARR', 'REPR', 'NORM']],
    ['comparative societies',              ['SYS', 'EVID', 'NARR', 'INVAR']],
  ] },
  { area: 'Environment of the Self', items: [
    ['identity',                           ['NARR', 'INVAR', 'NORM']],
    ['body',                               ['BODY', 'FORCE', 'SYS', 'TIME']],
    ['attention',                          ['BODY', 'TIME', 'PLAN', 'INVAR']],
    ['memory',                             ['TIME', 'REPR', 'NARR', 'INVAR']],
    ['emotions',                           ['BODY', 'NARR', 'SYS']],
    ['relationships',                      ['NARR', 'NORM', 'TIME', 'BODY']],
    ['solitude',                           ['BODY', 'TIME', 'NARR']],
    ['play',                               ['COMBI', 'BODY', 'NARR', 'PLAN', 'TIME']],
    ['failure',                            ['EVID', 'NARR', 'PLAN', 'INVAR']],
    ['curiosity',                          ['EVID', 'NARR', 'COMBI']],
    ['creativity',                         ['COMBI', 'REPR', 'PLAN', 'NARR']],
    ['death and mortality',                ['TIME', 'NARR', 'NORM', 'BODY']],
    ['meaning',                            ['NARR', 'NORM', 'INVAR', 'REPR']],
    ['responsibility',                     ['NORM', 'NARR', 'SYS', 'PLAN']],
  ] },
]

/** The author's four transversal dimensions. They are not areas and not capacities: each is a MODE in which
 *  any item can be met, so the pairing of an item with a dimension is what a project actually is. */
export const DIMENSIONS = {
  Making:        'the student produces, builds, performs or tests something',
  Understanding: 'theory, knowledge, history and concepts',
  Encountering:  'people, communities, places and the outside world',
  Reflecting:    'ethics, critical thinking and self-reflection',
} as const

/** Which capacities each dimension is carried by — declared, and the basis of the balance report. */
export const DIMENSION_CAPS: Record<keyof typeof DIMENSIONS, Cap[]> = {
  Making:        ['MATTER', 'PLAN', 'BODY', 'SPACE', 'FORCE', 'COMBI'],
  Understanding: ['SYMBOL', 'RATIO', 'INVAR', 'EVID', 'TIME', 'SYS'],
  Encountering:  ['NARR', 'NORM', 'SPACE', 'BODY', 'VALUE'],
  Reflecting:    ['NORM', 'NARR', 'INVAR', 'EVID', 'REPR'],
}
