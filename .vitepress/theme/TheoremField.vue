<script setup lang="ts">
// EVERY THEOREM IN THREE DIMENSIONS — its parse tree, not an ornament.
//
// A generic 3D scene attached to 525 different propositions would look the same whatever it was given, and
// a picture that cannot vary with its subject is a lie by implication. This one is the PARSE of the
// statement on this page, and scripts/latex-gate verifies every statement round-trips — read back symbol
// for symbol against its source — so the tree provably represents the proposition the kernel accepted.
//
// Nothing is chosen per theorem: depth is depth in the parse, horizontal position is the symbol's in-order
// rank as you read the statement, and depth in Z is the size of the subtree beneath it. Two theorems with
// the same structure get the same shape, which is what makes a difference in shape worth seeing.
//
// three.js loads inside onMounted because these pages are prerendered and WebGLRenderer needs a DOM.
// Without a canvas the figures below still render, and those carry the result.
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps<{ statement: string; nodes: string }>()
const host = ref<HTMLDivElement | null>(null)
const failed = ref('')
let stop: (() => void) | null = null

type N = { id: number; parent: number | null; label: string; kind: string; depth: number; order: number; weight: number }
const tree = computed<N[]>(() => { try { return JSON.parse(props.nodes || '[]') } catch { return [] } })
const depth = computed(() => tree.value.length ? Math.max(...tree.value.map((n) => n.depth)) + 1 : 0)
const leaves = computed(() => tree.value.filter((n) => !tree.value.some((m) => m.parent === n.id)).length)

onMounted(async () => {
  if (!host.value || !tree.value.length) return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { failed.value = 'motion reduced by preference'; return }
  let THREE: typeof import('three')
  try { THREE = await import('three') } catch { failed.value = 'three.js unavailable'; return }

  const el = host.value
  const w = () => el.clientWidth || 640
  const h = () => Math.min(420, Math.max(260, Math.round(w() * 0.5)))
  let renderer: import('three').WebGLRenderer
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) } catch { failed.value = 'WebGL unavailable'; return }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(w(), h())
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, w() / h(), 0.1, 200)
  const dark = () => document.documentElement.classList.contains('dark')

  const T = tree.value
  const maxOrder = Math.max(1, ...T.map((n) => n.order))
  const maxW = Math.max(1, ...T.map((n) => n.weight))
  const SPAN = 8
  const at = (n: N) => new THREE.Vector3(
    (n.order / maxOrder - 0.5) * SPAN,
    (depth.value - 1 - n.depth) * 1.15,
    (n.weight / maxW - 0.5) * 2.4,
  )
  // One hue per node KIND, so colour carries the grammar rather than decorating it.
  const KINDS = [...new Set(T.map((n) => n.kind))].sort()
  const col = (k: string) => new THREE.Color(`hsl(${(KINDS.indexOf(k) / KINDS.length) * 320}, 70%, ${dark() ? 64 : 44}%)`)

  const group = new THREE.Group()
  const geo = new THREE.SphereGeometry(0.16, 18, 14)
  for (const n of T) {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col(n.kind) }))
    m.position.copy(at(n))
    group.add(m)
    if (n.parent !== null) {
      const p = T.find((x) => x.id === n.parent)!
      group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([at(p), at(n)]),
        new THREE.LineBasicMaterial({ color: col(n.kind), transparent: true, opacity: 0.35 }),
      ))
    }
  }
  scene.add(group)
  const centreY = ((depth.value - 1) * 1.15) / 2
  camera.position.set(0, centreY + 1.2, Math.max(9, depth.value * 2.4))
  camera.lookAt(0, centreY, 0)

  let raf = 0
  const tick = () => { group.rotation.y += 0.0018; renderer.render(scene, camera); raf = requestAnimationFrame(tick) }
  tick()
  const onResize = () => { renderer.setSize(w(), h()); camera.aspect = w() / h(); camera.updateProjectionMatrix() }
  addEventListener('resize', onResize)
  stop = () => { cancelAnimationFrame(raf); removeEventListener('resize', onResize); geo.dispose(); renderer.dispose(); el.removeChild(renderer.domElement) }
})
onBeforeUnmount(() => stop?.())
</script>

<template>
  <figure v-if="tree.length" class="tf">
    <div ref="host" class="tf-canvas" role="img"
      :aria-label="`the parse tree of this statement: ${tree.length} nodes, ${depth} levels deep, ${leaves} leaves`" />
    <p v-if="failed" class="tf-note">Scene not drawn — {{ failed }}. The figures below are the result.</p>
    <figcaption>
      The statement's <strong>parse tree</strong>: <strong>{{ tree.length }}</strong> nodes,
      <strong>{{ depth }}</strong> levels, <strong>{{ leaves }}</strong> leaves. Height is depth in the parse,
      horizontal position is the symbol's in-order rank as the statement reads, and depth is the size of the
      subtree beneath each node. Colour is the node's grammatical kind.
      Nothing here is chosen for this theorem — the shape is the parse, and
      <code>npm run latex-gate</code> checks that this parse reads back symbol for symbol against the Lean
      source, for this statement and all others.
    </figcaption>
  </figure>
</template>

<style scoped>
.tf { margin: 2rem 0; }
.tf-canvas { width: 100%; min-height: 260px; border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden; }
.tf-canvas :deep(canvas) { display: block; width: 100% !important; height: auto !important; }
.tf-note { font-size: .85rem; color: var(--vp-c-text-2); margin: .5rem 0 0; }
figcaption { font-size: .88rem; color: var(--vp-c-text-2); margin-top: .7rem; line-height: 1.6; }
</style>
