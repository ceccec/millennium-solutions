// Reading source text as CODE, once.
//
// A gate that scans the tree scans its own explanation. It happened three times in one session:
// canon-gate flagged the file that documents the patterns it looks for; the orphan-exports control planted
// a name that gates-fire's own mutation string then named a second time; and orphan-gate counted a module
// as referenced because two comments explaining why it LOOKED unreferenced mentioned its path.
//
// Every one of those is the same mistake, and the fix is always this: a claim about what the code does must
// be measured over code, not over the prose beside it. canon-gate had a private copy of this function and
// orphan-gate was about to grow a second — which is the point at which src/html/index.ts's story starts.
//
// Deliberately blunt: it does not parse, so a `//` inside a string literal is treated as a comment. That
// loses a little code and keeps the rule simple, and losing code is the safe direction here — a gate that
// sees less is conservative, one that sees prose as code is wrong.
export const stripComments = (s: string): string =>
  s.replace(/\/\*[\s\S]*?\*\//g, ' ')
    .split('\n').filter((l) => !/^\s*(\/\/|\*)/.test(l)).map((l) => l.replace(/\/\/.*$/, '')).join('\n')
