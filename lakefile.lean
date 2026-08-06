import Lake
open Lake DSL

package «millennium-solutions»

require mathlib from git "https://github.com/leanprover-community/mathlib4.git"

@[default_target]
lean_lib «Vortex» where
  roots := #[`Vortex]
