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
  { title: 'the game', src: 'src/the/game/index.ts', text: theGame() },
  { title: 'the heart', src: 'src/the/heart/index.ts', text: theHeart() },
  { title: 'from the heart', src: 'src/from/the/heart/index.ts', text: fromTheHeart() },
  { title: 'play the game', src: 'src/play/the/game/index.ts', text: playTheGame() },
]
</script>

<template>
  <div class="the-concepts">
    <article v-for="c in CONCEPTS" :key="c.src" class="the-card">
      <header class="the-head">
        <h3>{{ c.title }}</h3>
        <code>{{ c.src }}</code>
      </header>
      <pre>{{ c.text }}</pre>
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
}
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
