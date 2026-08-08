#!/usr/bin/env node
// Generate the coherent "pentagon heart" UI page — the pentagon (5 = the heart, σ(5)=5, φ in its
// diagonal) gathered with the games and the arts, all COMPUTED from the discovery ledger. gitignored
// (generated at build), so it never churns. Honest bound, stated in-page: this presents the computed
// structure; the life is the observer's to bring — the page explains geometry, not consciousness. 0/7.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { toUuid, merkleFold, A432_STEP } from '../src/0/index.ts'

const ledger: { key: string; name: string; receipt: string }[] =
  existsSync('src/proof/discovered.json') ? JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) : []
const pick = (pred: (k: string) => boolean) => ledger.filter((e) => pred(e.key))
const games = pick((k) => /^(nim|wythoff|grundy|chess|both_games|duel|trial)/.test(k))
const arts = pick((k) => /^(arts|geom|harmonic|gematria)/.test(k))

// pentagon + pentagram geometry (5 vertices at 72° apart), a432-hued.
const cx = 110, cy = 110, R = 90, P = (n: number) => n.toFixed(1)
const V = Array.from({ length: 5 }, (_, k) => { const a = (-90 + 72 * k) * Math.PI / 180; return [cx + R * Math.cos(a), cy + R * Math.sin(a)] })
const pentagon = 'M' + V.map((v) => v.map(P).join(',')).join(' L') + ' Z'
const star = 'M' + [0, 2, 4, 1, 3].map((i) => V[i].map(P).join(',')).join(' L') + ' Z'
const dots = V.map((v, k) => { const hue = ((k * 2 + 1) * A432_STEP) % 360; return `<circle cx="${P(v[0])}" cy="${P(v[1])}" r="6" fill="hsl(${hue} 72% 55%)"/>` }).join('')

const svg = `<svg viewBox="0 0 220 220" role="img" aria-label="The pentagon heart: a regular pentagon and its pentagram, whose diagonal-to-side ratio is the golden ratio; centre digit 5." xmlns="http://www.w3.org/2000/svg" style="max-width:360px;width:100%;height:auto">
  <style>
    .ph-spin{transform-origin:110px 110px;animation:phspin 44s linear infinite}
    .ph-draw{stroke-dasharray:1200;stroke-dashoffset:1200;animation:phdraw 7s ease-in-out infinite alternate}
    @keyframes phspin{to{transform:rotate(360deg)}}
    @keyframes phdraw{to{stroke-dashoffset:0}}
    @media(prefers-reduced-motion:reduce){.ph-spin,.ph-draw{animation:none;stroke-dashoffset:0}}
  </style>
  <g class="ph-spin">
    <path d="${pentagon}" fill="none" stroke="var(--vp-c-divider,#8884)" stroke-width="1.2"/>
    <path class="ph-draw" d="${star}" fill="none" stroke="hsl(200 75% 55%)" stroke-width="2.2" stroke-linejoin="round"/>
    ${dots}
  </g>
  <circle cx="110" cy="110" r="15" fill="hsl(200 70% 50%)"/>
  <text x="110" y="116" text-anchor="middle" font-size="16" font-weight="700" fill="#fff">5</text>
</svg>`

let o = '---\ntitle: Heart\n---\n\n# The pentagon heart\n\n'
o += '<div style="text-align:center;margin:1.5rem 0">\n' + svg + '\n</div>\n\n'
o += 'Five is the heart: the fixed point of the ℤ/9 involution (σ(5)=5), the digit `vortex` roots to, '
o += 'and the pentagon whose diagonal-to-side ratio is the golden ratio φ. The pentagram draws itself; the centre holds 5.\n\n'
// each theorem rendered as a tarot combination (deterministic encoding of its content-address).
const tarotOf = (u: string) => [0, 1, 2].map((i) => parseInt(u.replace(/[^0-9a-f]/g, '').slice(i * 4, i * 4 + 4), 16) % 78)
const line = (e: { name: string; receipt: string }) => '- ' + e.name + '  ·  tarot [' + tarotOf(e.receipt).join(', ') + ']  ·  `' + e.receipt.slice(0, 13) + '…`\n'
o += '## Games — ' + games.length + ' computed (each with its tarot combination)\n\n'
games.forEach((e) => { o += line(e) })
o += '\n## Arts & geometry — ' + arts.length + ' computed\n\n'
arts.forEach((e) => { o += line(e) })
const root = merkleFold(games.concat(arts).map((e) => e.receipt).concat([toUuid('pentagon:5')]))
o += '\nPage content-address: `' + root + '`.\n\n'
o += '**Honest bound.** This page presents the *computed structure* — the pentagon, the games, the arts — each a decidable fact re-verified every build. It does not explain life or consciousness; the meaning is the observer\'s to bring. Geometry, not a claim about being. Deposit 0/7.\n'
writeFileSync('HEART.md', o)
console.log('heart page — pentagon (5) · ' + games.length + ' games · ' + arts.length + ' arts → ' + root.slice(0, 13) + '…')
