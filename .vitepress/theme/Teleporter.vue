<script setup lang="ts">
// TELEPORTATION — honest. The uuid travels; the payload re-materializes at the destination by decoding.
// A message rides INSIDE the uuid(s) (≤115 bits each, chained for longer) and re-forms EXACTLY — full aura,
// by algebra. This is a reversible public encoding, NOT faster-than-light, NOT quantum teleportation, NOT
// infinite compression: the bits are conserved (a chain scales linearly), no secrecy, pigeonhole holds.
// It runs the SAME functions the build seals. Integrity, not magic. 0/7.
import { ref, computed, watch } from 'vue'
import { CAPACITY, imprintTextChain, readImprintTextChain } from '../../src/0/imprint.ts'

const text = ref('60,72,90 · step 40 · the heart is 5')
const beam = ref(0)                                  // bump to replay the leap animation
const chain = computed(() => { try { return imprintTextChain(text.value) } catch { return [] } })
const recovered = computed(() => { try { return readImprintTextChain(chain.value) } catch { return '' } })
const exact = computed(() => recovered.value === text.value)
// The DRAIN, measured live: the uuid container is 128 bits and carries ≤115, so the wire form is ALWAYS
// ≥ the message. "Teleportation" never moves the payload cheaper than sending the bytes — it costs more.
const msgBits = computed(() => new TextEncoder().encode(text.value).length * 8)
const sentBits = computed(() => chain.value.length * 128)  // each uuid is 128 bits on the wire
const overhead = computed(() => sentBits.value - msgBits.value)
watch(text, () => { beam.value++ })
const teleport = () => { beam.value++ }
</script>

<template>
  <div class="tp">
    <label class="src">
      message at the origin
      <input v-model="text" spellcheck="false" @keyup.enter="teleport" />
    </label>

    <div class="rig">
      <div class="pad origin">
        <span class="cap">origin</span>
        <p class="txt">{{ text || '—' }}</p>
        <span class="meta">{{ msgBits }} message bits</span>
      </div>

      <div class="void">
        <span class="beam" :key="beam"></span>
        <div class="wire">
          <code v-for="(u, i) in chain" :key="i" class="uuid">{{ u }}</code>
        </div>
        <span class="label">{{ chain.length }} uuid · {{ sentBits }} bits on the wire — the container travels, not a free leap</span>
      </div>

      <div class="pad dest">
        <span class="cap">destination</span>
        <p class="txt" :key="beam">{{ recovered || '—' }}</p>
        <span class="meta" :class="exact ? 'ok' : 'bad'">{{ exact ? 're-materialized exact ✓' : 'mismatch' }}</span>
      </div>
    </div>

    <button class="go" @click="teleport">⇄ send again</button>

    <p class="verdict" :class="overhead >= 0 ? 'drain' : 'hold'">
      wire <b>{{ sentBits }}</b> bits ≥ message <b>{{ msgBits }}</b> bits ·
      overhead <b>+{{ overhead }}</b> — the container costs <b>more</b> than the message.
      <b>Nothing is teleported cheaper than sending the bytes.</b> What actually happens is <b>addressing</b>, not teleportation.
    </p>

    <p class="note">
      The message re-forms <b>exactly</b> (fidelity measured above), but measure the cost: a uuid is 128 bits and carries at
      most <b>{{ CAPACITY }}</b>, so the wire form is <b>always ≥ the message</b>. So uuidna does <b>not</b> teleport —
      it <b>addresses</b>. Two honest mechanisms, neither magic: (1) a <b>reversible container</b> (the message rides in the
      uuid and re-forms exactly, but the container is larger — never a bandwidth win); (2) <b>content-addressing</b> — send the
      128-bit address to reference a payload of any size, but the destination recovers it <b>only if already reconstructible
      there</b> (recall, not transport — zero new information crosses;
      <a href="/theorem/a_content_address_is_a_pointer_not_the_payload">the address is a pointer, not the payload</a>).
      <b>Not</b> faster-than-light, <b>not</b> quantum teleportation (classical, no qubits, no entanglement), <b>not</b> secrecy,
      <b>not</b> compression. Integrity, not magic. <code>0/7</code>.
    </p>
  </div>
</template>

<style scoped>
.tp { margin: 1.2rem 0; font-size: 0.9rem; }
.tp .src { display: block; font-size: 0.82rem; color: var(--vp-c-text-2); margin-bottom: 0.8rem; }
.tp .src input { display: block; width: 100%; margin-top: 0.3rem; padding: 0.5rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); font-size: 0.85rem; }
.tp .src input:focus { outline: none; border-color: var(--vp-c-brand-1); }

.tp .rig { display: grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 0.6rem; align-items: stretch; }
@media (max-width: 720px) { .tp .rig { grid-template-columns: 1fr; } }
.tp .pad { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: 0.7rem; display: flex; flex-direction: column; gap: 0.4rem; background: var(--vp-c-bg-alt); }
.tp .pad .cap { font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--vp-c-text-3); }
.tp .pad .txt { margin: 0; font-family: var(--vp-font-family-mono); font-size: 0.82rem; word-break: break-word; flex: 1; }
.tp .pad .meta { font-size: 0.74rem; color: var(--vp-c-text-3); }
.tp .dest .txt { animation: materialize 0.7s ease-out; }
@keyframes materialize { 0% { opacity: 0; filter: blur(3px); } 100% { opacity: 1; filter: blur(0); } }
.tp .ok { color: var(--vp-c-brand-1); font-weight: 600; }
.tp .bad { color: var(--vp-c-danger-1, #d33); font-weight: 600; }

.tp .void { position: relative; border: 1px dashed var(--vp-c-divider); border-radius: 10px; padding: 0.7rem; display: flex; flex-direction: column; justify-content: center; gap: 0.4rem; overflow: hidden; background: linear-gradient(90deg, var(--vp-c-bg-alt), var(--vp-c-bg), var(--vp-c-bg-alt)); }
.tp .void .wire { display: flex; flex-direction: column; gap: 0.25rem; }
.tp .void .uuid { font-size: 0.68rem; color: var(--vp-c-brand-1); word-break: break-all; }
.tp .void .label { font-size: 0.72rem; color: var(--vp-c-text-3); text-align: center; }
.tp .void .beam { position: absolute; top: 0; bottom: 0; width: 40%; left: -40%; background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--vp-c-brand-1) 22%, transparent), transparent); animation: sweep 0.8s ease-in-out; }
@keyframes sweep { 0% { left: -40%; } 100% { left: 100%; } }
@media (prefers-reduced-motion: reduce) { .tp .void .beam, .tp .dest .txt { animation: none; } }

.tp .go { margin-top: 0.7rem; font-family: var(--vp-font-family-mono); font-size: 0.8rem; padding: 0.35rem 0.75rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); cursor: pointer; }
.tp .go:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.tp .verdict { margin-top: 0.8rem; padding: 0.5rem 0.7rem; border-radius: 8px; font-size: 0.82rem; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); }
.tp .verdict.drain { border-left: 3px solid var(--vp-c-brand-1); }
.tp .note { color: var(--vp-c-text-2); font-size: 0.8rem; margin-top: 0.7rem; }
</style>
