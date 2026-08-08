<script setup lang="ts">
// The `the/*` concepts as a VitePress component itself — each module's report() runs at render,
// so every card recomputes on page-load (no stored answers). Deterministic (pure toUuid/merkleFold),
// so SSR and client hydration agree. Every card lands on the same floor: 0/7.
import { report as theAll } from '../../src/the/index'
import { report as theSequence } from '../../src/the/sequence/index'
import { report as theTheorem } from '../../src/the/theorem/index'
import { report as theAbstract } from '../../src/the/abstract/index'
import { report as theState } from '../../src/the/state/index'
import { report as theSuperposition } from '../../src/the/superposition/state/index'
import { report as theDomain } from '../../src/the/domain/index'
import { report as theCreation } from '../../src/the/creation/index'
import { report as theSolids } from '../../src/the/solids/index'
import { report as theCrystal } from '../../src/the/crystal/index'
import { report as thePath } from '../../src/the/path/index'
import { report as theTorus } from '../../src/the/torus/index'
import { report as theSurface } from '../../src/the/surface/index'
import { report as theAbundance } from '../../src/the/abundance/index'
import { report as theCancer } from '../../src/the/cancer/index'
import { report as theWaves } from '../../src/the/waves/index'
import { report as theRosetta } from '../../src/the/rosetta/index'
import { report as theClown } from '../../src/the/clown/index'
import { report as theGame } from '../../src/the/game/index'
import { report as theHeart } from '../../src/the/heart/index'
import { report as fromTheHeart } from '../../src/from/the/heart/index'
import { report as playTheGame } from '../../src/play/the/game/index'

const CONCEPTS = [
  { title: 'the', src: 'src/the/index.ts', text: theAll() },
  { title: 'the sequence', src: 'src/the/sequence/index.ts', text: theSequence() },
  { title: 'the theorem', src: 'src/the/theorem/index.ts', text: theTheorem() },
  { title: 'the abstract', src: 'src/the/abstract/index.ts', text: theAbstract() },
  { title: 'the state', src: 'src/the/state/index.ts', text: theState() },
  { title: 'the superposition', src: 'src/the/superposition/state/index.ts', text: theSuperposition() },
  { title: 'the domain', src: 'src/the/domain/index.ts', text: theDomain() },
  { title: 'the creation', src: 'src/the/creation/index.ts', text: theCreation() },
  { title: 'the solids', src: 'src/the/solids/index.ts', text: theSolids() },
  { title: 'the crystal', src: 'src/the/crystal/index.ts', text: theCrystal() },
  { title: 'the path', src: 'src/the/path/index.ts', text: thePath() },
  { title: 'the torus', src: 'src/the/torus/index.ts', text: theTorus() },
  { title: 'the surface', src: 'src/the/surface/index.ts', text: theSurface() },
  { title: 'the abundance', src: 'src/the/abundance/index.ts', text: theAbundance() },
  { title: 'the cancer', src: 'src/the/cancer/index.ts', text: theCancer() },
  { title: 'the waves', src: 'src/the/waves/index.ts', text: theWaves() },
  { title: 'the rosetta', src: 'src/the/rosetta/index.ts', text: theRosetta() },
  { title: 'the clown', src: 'src/the/clown/index.ts', text: theClown() },
  { title: 'the game', src: 'src/the/game/index.ts', text: theGame() },
  { title: 'the heart', src: 'src/the/heart/index.ts', text: theHeart() },
  { title: 'from the heart', src: 'src/from/the/heart/index.ts', text: fromTheHeart() },
  { title: 'play the game', src: 'src/play/the/game/index.ts', text: playTheGame() },
]

// Make every card interactive: link anything linkable INSIDE the card — source-file paths (→ the repo)
// and URLs (→ the target). Bare "/word" tokens are deliberately NOT linked, because the concept text
// carries math like ℤ/9 and 0/7 that are not routes (no dead links, no prose poison).
const REPO = 'https://github.com/ceccec/millennium-solutions/blob/main/'
const repoHref = (src: string) => REPO + src
type Seg = { t: string; href?: string; ext?: boolean }
function linkify(text: string): Seg[] {
  const segs: Seg[] = []
  const re = /(https?:\/\/[^\s)]+)|((?:src|scripts)\/[\w./-]+\.(?:ts|vue|md|json))/g
  let last = 0, m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segs.push({ t: text.slice(last, m.index) })
    const tok = m[0]
    segs.push({ t: tok, href: m[1] ? tok : repoHref(tok), ext: true })
    last = m.index + tok.length
  }
  if (last < text.length) segs.push({ t: text.slice(last) })
  return segs
}
const cards = CONCEPTS.map((c) => ({ ...c, segs: linkify(c.text) }))
</script>

<template>
  <div class="the-concepts">
    <article v-for="c in cards" :key="c.src" class="the-card">
      <header class="the-head">
        <h3>{{ c.title }}</h3>
        <a class="the-src" :href="repoHref(c.src)" target="_blank" rel="noopener" title="view source on GitHub"><code>{{ c.src }}</code></a>
      </header>
      <pre class="the-body"><template v-for="(s, i) in c.segs" :key="i"><a v-if="s.href" :href="s.href" target="_blank" rel="noopener">{{ s.t }}</a><template v-else>{{ s.t }}</template></template></pre>
    </article>
  </div>
</template>

<style scoped>
.the-concepts { display: grid; gap: 1rem; margin: 1.25rem 0; }
.the-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1rem 1.15rem;
  background: var(--vp-c-bg-soft);
  transition: border-color .2s ease;
}
.the-card:hover { border-color: var(--vp-c-brand-1); }
.the-src { text-decoration: none; }
.the-src code { color: var(--vp-c-text-2); }
.the-src:hover code { color: var(--vp-c-brand-1); }
.the-body a { color: var(--vp-c-brand-1); text-decoration: underline; text-underline-offset: 2px; }
.the-head {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap; margin-bottom: .5rem;
}
.the-head h3 { margin: 0; border: 0; padding: 0; font-size: 1.05rem; letter-spacing: .01em; }
.the-head code { font-size: .78rem; color: var(--vp-c-text-2); }
.the-card pre {
  margin: 0; overflow-x: auto;
  font-size: .82rem; line-height: 1.5; white-space: pre-wrap; word-break: break-word;
}
</style>
