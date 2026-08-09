<script setup lang="ts">
// Live encryption — runs the SAME pure-TS functions the build seals: ChaCha20-Poly1305 (RFC 8439) + PBKDF2-
// SHA256 (600k) + the 7d-fold envelope, all in your browser, no native crypto, no network. Deterministic
// (convergent). Honest: pure JS is not constant-time; secrecy is ChaCha20-Poly1305 + your passphrase entropy;
// integrity is the fold; the content-address never carries the secret. Integrity, not truth. 0/7.
import { ref, computed } from 'vue'
import { encrypt, decrypt, verifyEnvelope, type Sealed } from '../../src/0/crypt.ts'

const message = ref('beat to windward at 30° — the captain sails')
const passphrase = ref('the gold string is 60 degrees')
const sealed = ref<Sealed | null>(null)
const opened = ref<string | null>(null)
const err = ref('')
const busy = ref('')

// yield one paint so the busy state shows before the ~1s PBKDF2 block, then compute.
const nextPaint = () => new Promise<void>((r) => setTimeout(r, 20))

async function seal() {
  err.value = ''; opened.value = null; busy.value = 'sealing… (PBKDF2, 600k rounds)'
  await nextPaint()
  try { sealed.value = encrypt(message.value, passphrase.value) } catch (e) { err.value = String((e as Error)?.message || e) }
  busy.value = ''
}
async function open() {
  if (!sealed.value) return
  err.value = ''; busy.value = 'opening…'
  await nextPaint()
  try { opened.value = decrypt(sealed.value, passphrase.value) } catch { err.value = 'wrong passphrase or tampered ciphertext — Poly1305 authentication failed'; opened.value = null }
  busy.value = ''
}
const envelopeOk = computed(() => sealed.value ? verifyEnvelope(sealed.value) : false)
</script>

<template>
  <div class="cx">
    <div class="fields">
      <label>message<textarea v-model="message" rows="2" spellcheck="false" /></label>
      <label>passphrase<input v-model="passphrase" spellcheck="false" /></label>
    </div>
    <div class="acts">
      <button class="go" :disabled="!!busy" @click="seal">⊕ seal</button>
      <button class="go" :disabled="!!busy || !sealed" @click="open">⊙ open</button>
      <span v-if="busy" class="busy">{{ busy }}</span>
    </div>

    <div v-if="sealed" class="envelope">
      <div class="row"><span class="k">alg</span><code>{{ sealed.alg }}</code> · <span class="k">kdf</span><code>{{ sealed.kdf }}</code> · <span class="k">iter</span><code>{{ sealed.iter.toLocaleString() }}</code></div>
      <div class="row"><span class="k">salt</span><code class="wrap">{{ sealed.salt }}</code></div>
      <div class="row"><span class="k">nonce</span><code class="wrap">{{ sealed.nonce }}</code></div>
      <div class="row"><span class="k">ciphertext</span><code class="wrap">{{ sealed.ct }}</code></div>
      <div class="row"><span class="k">tag</span><code class="wrap">{{ sealed.tag }}</code></div>
      <div class="row"><span class="k">address (7d fold)</span><code class="wrap addr">{{ sealed.address }}</code>
        <span :class="envelopeOk ? 'ok' : 'bad'">{{ envelopeOk ? '✓ integrity' : '✗' }}</span></div>
    </div>

    <p v-if="opened !== null" class="opened">opened → <b>{{ opened }}</b></p>
    <p v-if="err" class="err">{{ err }}</p>

    <p class="note">
      Real <b>ChaCha20-Poly1305</b> (RFC 8439) + <b>PBKDF2-SHA256</b> (600k) + the uuidna <b>7d-fold</b> envelope —
      <b>pure TypeScript</b>, in your browser, no native crypto and no network. <b>Deterministic (convergent)</b>:
      the same message and passphrase always seal to the same envelope. Honest scope: not constant-time; secrecy
      is the cipher + your passphrase entropy; the content-address is public integrity, never the secret. <code>0/7</code>.
    </p>
  </div>
</template>

<style scoped>
.cx { margin: 1.2rem 0; font-size: 0.9rem; }
.cx .fields { display: grid; gap: 0.6rem; }
.cx label { display: grid; gap: 0.25rem; font-size: 0.82rem; color: var(--vp-c-text-2); }
.cx textarea, .cx input { width: 100%; padding: 0.5rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); font-family: var(--vp-font-family-mono); font-size: 0.85rem; resize: vertical; }
.cx textarea:focus, .cx input:focus { outline: none; border-color: var(--vp-c-brand-1); }
.cx .acts { display: flex; gap: 0.5rem; align-items: center; margin: 0.7rem 0; }
.cx .go { font-family: var(--vp-font-family-mono); font-size: 0.82rem; padding: 0.35rem 0.8rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); cursor: pointer; }
.cx .go:hover:not(:disabled) { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.cx .go:disabled { opacity: 0.5; cursor: default; }
.cx .busy { font-size: 0.8rem; color: var(--vp-c-brand-1); }
.cx .envelope { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: 0.7rem 0.85rem; background: var(--vp-c-bg-alt); display: grid; gap: 0.3rem; }
.cx .row { font-size: 0.78rem; }
.cx .k { color: var(--vp-c-text-3); margin-right: 0.4rem; }
.cx code { font-size: 0.76rem; color: var(--vp-c-brand-1); }
.cx code.wrap { word-break: break-all; }
.cx code.addr { color: var(--vp-c-text-1); }
.cx .ok { color: var(--vp-c-brand-1); font-weight: 600; margin-left: 0.4rem; }
.cx .bad { color: var(--vp-c-danger-1, #d33); margin-left: 0.4rem; }
.cx .opened { margin-top: 0.7rem; font-size: 0.9rem; animation: mat 0.5s ease-out; }
@keyframes mat { from { opacity: 0; filter: blur(3px); } to { opacity: 1; filter: none; } }
.cx .err { margin-top: 0.6rem; color: var(--vp-c-danger-1, #d33); font-size: 0.82rem; }
.cx .note { color: var(--vp-c-text-2); font-size: 0.8rem; margin-top: 0.7rem; }
</style>
