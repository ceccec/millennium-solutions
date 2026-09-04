<script setup lang="ts">
// THE QUANTUM FIELD, in three dimensions — src/proof/quantum.lean rendered, not illustrated.
//
// Twenty-four spheres: the orderings of the doubling orbit [1,2,4,8], which `perms_of_four_is_factorial`
// decides there are exactly 24 of. Each sits at the height of the value the CONTROL fold returns for that
// ordering, so the five levels you can count are `the_uncanonicalised_fold_gives_many_answers` — the size
// of the problem canonicalisation solves. Every edge falls to one node, because
// `superposition_collapses_to_one` decides all 24 share a single receipt.
//
// No coordinate is a design choice. Angle is the ordering's index in Lean's own enumeration, height is its
// naive value, and the collapse point is the receipt. scripts/quantum-field.ts recomputes all five figures
// and reads what they should be OUT OF the Lean statements, so this scene cannot drift from the proof
// without the build going red.
//
// three.js is loaded inside onMounted rather than imported at module scope: these pages are prerendered,
// and WebGLRenderer needs a DOM. Without a canvas the numbers below still render, which is the part that
// carries the result.
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { field, naiveLevels, collisions, receipt, ORBIT } from '../../src/quantum/field.ts'

const host = ref<HTMLDivElement | null>(null)
const live = ref(false)
const failed = ref('')
let stop: (() => void) | null = null

const nodes = field()
const levels = naiveLevels()
const one = receipt([...ORBIT])
const groups = collisions()
const sets = computed(() => groups.reduce((n, g) => n + g.sets.length, 0))

onMounted(async () => {
  if (!host.value) return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { failed.value = 'motion reduced by preference'; return }
  let THREE: typeof import('three')
  try { THREE = await import('three') } catch { failed.value = 'three.js unavailable'; return }

  const el = host.value
  const w = () => el.clientWidth || 640
  const h = () => Math.min(460, Math.max(300, Math.round(w() * 0.6)))

  let renderer: import('three').WebGLRenderer
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) }
  catch { failed.value = 'WebGL unavailable'; return }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(w(), h())
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, w() / h(), 0.1, 100)
  camera.position.set(0, 4.2, 11)
  camera.lookAt(0, 1.2, 0)

  const dark = () => document.documentElement.classList.contains('dark')
  // one hue per DISTINCT control value — the palette has exactly as many entries as the theorem has levels
  const hue = (v: number) => (levels.indexOf(v) / levels.length) * 300
  const col = (v: number) => new THREE.Color(`hsl(${hue(v)}, 72%, ${dark() ? 62 : 46}%)`)

  const R = 4.2, SPAN = 3.4
  const y = (v: number) => 0.6 + (levels.indexOf(v) / Math.max(1, levels.length - 1)) * SPAN
  const at = (n: typeof nodes[number]) =>
    new THREE.Vector3(Math.cos(n.angle) * R, y(n.naive), Math.sin(n.angle) * R)

  const geo = new THREE.SphereGeometry(0.17, 20, 16)
  const collapse = new THREE.Vector3(0, 0, 0)
  const group = new THREE.Group()

  for (const n of nodes) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col(n.naive) }))
    m.position.copy(at(n))
    group.add(m)
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([at(n), collapse]),
      new THREE.LineBasicMaterial({ color: col(n.naive), transparent: true, opacity: 0.28 }),
    )
    group.add(line)
  }
  // the one receipt every ordering lands on
  const centre = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 24, 20),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(dark() ? '#f5f5f5' : '#111') }),
  )
  centre.position.copy(collapse)
  group.add(centre)
  scene.add(group)

  let raf = 0
  const tick = () => { group.rotation.y += 0.0022; renderer.render(scene, camera); raf = requestAnimationFrame(tick) }
  tick()
  live.value = true

  const onResize = () => { renderer.setSize(w(), h()); camera.aspect = w() / h(); camera.updateProjectionMatrix() }
  addEventListener('resize', onResize)
  stop = () => {
    cancelAnimationFrame(raf); removeEventListener('resize', onResize)
    geo.dispose(); renderer.dispose(); el.removeChild(renderer.domElement)
  }
})
onBeforeUnmount(() => stop?.())
</script>

<template>
  <figure class="qf">
    <div ref="host" class="qf-canvas" :class="{ 'qf-idle': !live }" role="img"
      :aria-label="`${nodes.length} orderings of the doubling orbit, at ${levels.length} heights given by the uncanonicalised fold, every one joined to the single receipt ${one}`" />
    <p v-if="failed" class="qf-note">Scene not drawn — {{ failed }}. The figures below are the result; the canvas only shows it.</p>
    <figcaption>
      <strong>{{ nodes.length }}</strong> orderings of [{{ ORBIT.join(', ') }}] ·
      <strong>{{ levels.length }}</strong> heights, the distinct values of the control fold ({{ levels.join(', ') }}) ·
      all collapse to the one receipt <strong>{{ one }}</strong>.
      The limit, from the same file: <strong>{{ sets }}</strong> two-element multisets share
      <strong>{{ groups.length }}</strong> receipts, so a receipt is order-invariant and <em>not</em> injective.
    </figcaption>
  </figure>
</template>

<style scoped>
.qf { margin: 2rem 0; }
.qf-canvas { width: 100%; min-height: 300px; border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden; }
.qf-canvas.qf-idle { display: grid; place-items: center; }
.qf-canvas :deep(canvas) { display: block; width: 100% !important; height: auto !important; }
.qf-note { font-size: .85rem; color: var(--vp-c-text-2); margin: .5rem 0 0; }
figcaption { font-size: .9rem; color: var(--vp-c-text-2); margin-top: .75rem; line-height: 1.6; }
</style>
