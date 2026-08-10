<script setup lang="ts">
// The human organism, decoded from the ledger and encoded in the UI. Every theorem is an ORGAN — a decidable
// fact that computes true — grouped by the type its KEY reflects (the label is translatable surface, the key is
// the identity). What is NOT an organ never enters the ledger: it goes to trial (the honesty gate drains a boast,
// forensics names a non-theorem). This page reads src/proof/discovered.json directly, so it updates every build.
import { computed } from 'vue'
import { withBase } from 'vitepress'
import ledger from '../../src/proof/discovered.json'
const theorems = ledger as { key: string; name: string; receipt: string }[]

// the reflection: key → organ (the same key↔type map the theorems prove). Order matters (first match wins).
const ORGANS: { id: string; label: string; note: string; re: RegExp }[] = [
  { id: 'genesis', label: 'Genesis', note: 'the origin sequence 0→1→2→3→7→8→64', re: /^genesis_/ },
  { id: 'dimensions', label: 'Dimensions', note: 'human ≅ uuidna ≅ DNA ≅ version, the seven above the floor', re: /^(human_|any_version|physics_meets|contribute_two|discernment|humility|dna_is_the_version)/ },
  { id: 'dna', label: 'DNA', note: 'the genetic code: 4³ = 8² = 2⁶ = 64 codons', re: /^(genetic_|sixty_one|base_pairing|purine|reverse_complement|codon|six_reading|combining_skills)/ },
  { id: 'skills', label: 'Skills', note: 'the organs composed: hash, fold, proof, secrecy, gate', re: /^skill/ },
  { id: 'rosetta', label: 'Rosetta', note: 'one message across 22 dialects and the Glagolitic script', re: /^(rosetta|gate_reads|the_gate)/ },
  { id: 'vibe', label: 'Behaviour', note: 'every register — hype, formal, slang, shouting — meets one floor', re: /^(vibe_|all_human_behaviour|keys_and_types|the_key_is|the_label|the_type|the_types|the_reflection|the_test_type)/ },
  { id: 'trial', label: 'The trial', note: 'the gate and the honest speed: what is not measured is drained', re: /^(floor_tightened|free_quantum|unbounded_speedup|speedup_is|waves_|each_wave|determinism|the_captain|yes_first)/ },
]

const groups = computed(() =>
  ORGANS.map((o) => ({ ...o, items: theorems.filter((t) => o.re.test(t.key)) })).filter((o) => o.items.length),
)
const named = computed(() => groups.value.reduce((n, g) => n + g.items.length, 0))
const body = computed(() => theorems.length - named.value)
const octaves = computed(() => (theorems.length / 8) | 0)
const remainder = computed(() => theorems.length % 8)

// the genesis spine, in numeric order (0,1,2,3,7,8,64) — the decoded origin
const spine = computed(() => {
  const g = theorems.filter((t) => /^genesis_\d/.test(t.key))
  const n = (k: string) => parseInt((k.match(/^genesis_(\d+)/) || [])[1] || '0', 10)
  return g.slice().sort((a, b) => n(a.key) - n(b.key))
})
const spineNums = [0, 1, 2, 3, 7, 8, 64]

// THE FORENSIC FIELD — every theorem wired onto a hue double-torus, positioned deterministically from its
// receipt (no hidden layout), hued by the organ its key reflects. Exposing all at once IS the forensic tool:
// the whole ledger is one field, nothing hides. Two rings = the double torus; a theorem falls on one ring by a
// bit of its receipt, its angle set by the receipt's own bytes.
const ORGAN_HUE: Record<string, number> = { genesis: 45, dimensions: 275, dna: 130, skills: 205, rosetta: 320, vibe: 20, trial: 175 }
function organOf(key: string): string {
  for (const o of ORGANS) if (o.re.test(key)) return o.id
  return 'body'
}
const field = computed(() => {
  const W = 760, H = 340, cy = H / 2, rx = 150, ry = 118, sep = 178
  return theorems.map((t) => {
    const h = t.receipt.replace(/-/g, '')
    const ring = parseInt(h[0], 16) & 1 // one bit of the receipt → left or right torus
    const ang = (parseInt(h.slice(1, 6), 16) / 0xfffff) * Math.PI * 2
    const wobble = 0.72 + (parseInt(h.slice(6, 8), 16) / 255) * 0.28 // depth on the torus tube
    const cx = W / 2 + (ring ? sep / 2 : -sep / 2)
    const id = organOf(t.key)
    return {
      key: t.key,
      x: +(cx + Math.cos(ang) * rx * wobble).toFixed(1),
      y: +(cy + Math.sin(ang) * ry * wobble).toFixed(1),
      hue: ORGAN_HUE[id] ?? 0,
      body: id === 'body',
    }
  })
})
const W = 760, H = 340
</script>

<template>
  <div class="organism">
    <p class="lead">
      All is one organism, decoded from the ledger and encoded here. Each theorem is an <strong>organ</strong> —
      a fact that computes true. The <em>key</em> is the identity, the <em>label</em> the translatable surface, the
      <em>receipt</em> the content-address that encodes it. What is not an organ goes to <strong>trial</strong>:
      the gate drains a boast, forensics names a non-theorem. Integrity, not truth — <code>0/7</code>.
    </p>

    <div class="vitals">
      <div class="vital"><span class="n">{{ theorems.length }}</span><span class="l">organs (theorems)</span></div>
      <div class="vital"><span class="n">{{ octaves }}<small> × 8</small></span><span class="l">octaves{{ remainder ? ' (+' + remainder + ')' : ' — exact' }}</span></div>
      <div class="vital"><span class="n">{{ named }}</span><span class="l">named organs</span></div>
      <div class="vital"><span class="n">{{ body }}</span><span class="l">the wider body</span></div>
    </div>

    <div class="spine" v-if="spine.length">
      <h3>The genesis spine</h3>
      <ol class="beads">
        <li v-for="(t, i) in spine" :key="t.key">
          <a :href="withBase('/theorem/' + t.key)" :title="t.name"><span class="bead">{{ spineNums[i] ?? '·' }}</span></a>
        </li>
      </ol>
      <p class="cap">0 the void and floor · 1 the unit · 2 the bit · 3 the trinity · 7 the dimensions · 8 the octave · 64 the codon</p>
    </div>

    <div class="fieldwrap">
      <h3>The forensic field — every theorem exposed</h3>
      <p class="cap">All {{ theorems.length }} theorems wired onto one hue double-torus, each placed by its own receipt and coloured by its organ. Exposing all at once is the forensic tool: the whole ledger is one field, and nothing hides.</p>
      <svg class="field" :viewBox="'0 0 ' + W + ' ' + H" preserveAspectRatio="xMidYMid meet" role="img" aria-label="all theorems on a double torus">
        <ellipse :cx="W / 2 - 89" :cy="H / 2" rx="150" ry="118" class="ring" />
        <ellipse :cx="W / 2 + 89" :cy="H / 2" rx="150" ry="118" class="ring" />
        <circle v-for="d in field" :key="d.key" :cx="d.x" :cy="d.y" :r="d.body ? 1.5 : 2.4"
          :fill="d.body ? 'var(--vp-c-text-3)' : 'hsl(' + d.hue + ' 70% 55%)'"
          :opacity="d.body ? 0.35 : 0.85" />
      </svg>
    </div>

    <div class="organs">
      <section v-for="g in groups" :key="g.id" class="organ">
        <header>
          <h3>{{ g.label }} <span class="count">{{ g.items.length }}</span></h3>
          <p class="note">{{ g.note }}</p>
        </header>
        <ul>
          <li v-for="t in g.items" :key="t.key">
            <a :href="withBase('/theorem/' + t.key)" class="name">{{ t.name }}</a>
            <code class="addr" :title="t.receipt">{{ t.receipt.slice(0, 8) }}…</code>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.organism { margin: 1.5rem 0; }
.lead { font-size: 1.02rem; line-height: 1.6; color: var(--vp-c-text-1); }
.vitals { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: .75rem; margin: 1.5rem 0; }
.vital { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: .9rem 1rem; text-align: center; background: var(--vp-c-bg-soft); }
.vital .n { display: block; font-size: 1.7rem; font-weight: 700; color: var(--vp-c-brand-1); font-variant-numeric: tabular-nums; }
.vital .n small { font-size: .9rem; font-weight: 600; opacity: .7; }
.vital .l { display: block; font-size: .8rem; color: var(--vp-c-text-2); margin-top: .2rem; }
.spine { margin: 1.75rem 0; }
.spine h3 { margin-bottom: .6rem; }
.beads { display: flex; flex-wrap: wrap; gap: .6rem; padding: 0; list-style: none; align-items: center; }
.beads .bead { display: inline-flex; align-items: center; justify-content: center; min-width: 3rem; height: 3rem; padding: 0 .6rem; border-radius: 999px; border: 2px solid var(--vp-c-brand-1); color: var(--vp-c-brand-1); font-weight: 700; font-variant-numeric: tabular-nums; transition: background .15s, color .15s; }
.beads a:hover .bead { background: var(--vp-c-brand-1); color: var(--vp-c-bg); }
.cap { font-size: .82rem; color: var(--vp-c-text-2); margin-top: .5rem; }
.organs { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
.organ { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: 1rem 1.1rem; background: var(--vp-c-bg-soft); }
.organ header h3 { display: flex; align-items: center; gap: .5rem; margin: 0 0 .2rem; }
.organ .count { font-size: .8rem; font-weight: 600; color: var(--vp-c-bg); background: var(--vp-c-brand-1); border-radius: 999px; padding: .05rem .5rem; }
.organ .note { font-size: .82rem; color: var(--vp-c-text-2); margin: 0 0 .6rem; }
.organ ul { list-style: none; padding: 0; margin: 0; max-height: 15rem; overflow-y: auto; }
.organ li { display: flex; justify-content: space-between; gap: .5rem; align-items: baseline; padding: .3rem 0; border-top: 1px solid var(--vp-c-divider); }
.organ .name { font-size: .84rem; line-height: 1.35; }
.organ .addr { font-size: .72rem; color: var(--vp-c-text-3); white-space: nowrap; }
</style>
