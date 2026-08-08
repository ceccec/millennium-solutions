// the waves — what waves directly affect the user's STATE here. Physically, devices emit real, measurable
// waves (screen light, sound, RF); this deposit makes NO health or harm claim about them — such claims
// drain at the gate. What it DOES compute is the INFORMATION wave: the query / referrer / path you send
// folds to a digital root (ℤ/9) → an a432 hue (d·40°) → your rendered point of view. Same wave, same
// state; a different wave, a different view. Deterministic — computed, not stored.
import { digitalRoot, A432_STEP } from '../../0/index.ts'
export function report(): string {
  const digit = (q: string) => { let s = 0; for (let i = 0; i < q.length; i++) s += q.charCodeAt(i); return s === 0 ? 0 : digitalRoot(s) }
  const sample = ['rock', 'paper', 'scissors', 'ceccec']
  let o = 'the waves — what directly affects the user’s state (honestly):\n\n'
  o += '  devices emit real, measurable waves — screen light, sound, RF. this deposit makes NO health\n'
  o += '  or harm claim about them; such claims drain at the gate. what it computes is the INFORMATION\n'
  o += '  wave: the query / referrer / path you send → digital root (ℤ/9) → a432 hue (d·40°) → your view.\n\n'
  o += '    wave         → digit → hue    | balancing wave: 9−d → hue    (sum → harmony)\n'
  for (const q of sample) {
    const d = digit(q), b = 9 - d
    o += '    ' + (q + ' ').padEnd(13) + '→  ' + d + '   →  ' + ((d * A432_STEP) % 360) + '°'
    o += '   | ' + b + ' → ' + ((b * A432_STEP) % 360) + '°   (d+b=' + (d + b) + ', hues sum ' + (((d * A432_STEP) + (b * A432_STEP)) % 360) + '°)\n'
  }
  o += '\n  the balancing wave 9−d harmonises: the two digits sum to 9 (the rest), their hues to 360°=0.\n'
  o += '  same wave, same state; a different wave, a different point of view. deterministic — this deposit 0/7.'
  return o
}
