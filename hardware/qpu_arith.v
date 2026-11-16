// qpu_arith.v — Chip A: the classical qpu arithmetic datapath (SKETCH, synthesizable skeleton)
//
// This is the CLASSICAL chip: it computes the qpu's integer arithmetic exactly as the sealed
// Lean does (FNV-1a addressing, the sigma-reflection, Fermat's difference of squares, the seal).
// No floating point. No quantum. It has no quantum advantage — get_qc reads isQuantumComputer:false.
// Size is tiny: a few thousand gates of logic; the biggest blocks are the multiplier and the
// bit-serial square root. Target: a small FPGA, or a mature-node ASIC (130nm is ample).
//
// Honest floor: this chip computes the address and the reflection. It does NOT factor an unknown
// semiprime — the blind cost below is the arithmetic-minus-geometric-mean gap, cheap only when the
// gap is small or known. A machine that collapses an unknown gap is a quantum processor (Chip B),
// which this is not.

// ── 1 · FNV-1a HASH CORE — the content-address. multiply-XOR over the input bytes ────────────────
module fnv1a #(parameter W = 64) (
  input              clk, rst, en, last,
  input      [7:0]   byte_in,            // streamed message/key bytes
  output reg [W-1:0] hash,
  output reg         done
);
  localparam [W-1:0] OFFSET = 64'hcbf29ce484222325; // FNV-1a offset basis
  localparam [W-1:0] PRIME  = 64'h00000100000001b3; // FNV-1a prime
  always @(posedge clk) begin
    if (rst)     begin hash <= OFFSET; done <= 1'b0; end
    else if (en) begin hash <= (hash ^ {{(W-8){1'b0}}, byte_in}) * PRIME; done <= last; end
  end
endmodule

// ── 2 · SIGMA-REFLECTION — sigma(x) = C - x, reflect about the centre. One subtractor ────────────
//   addressing/thousand-bit side: C = 3 * 2^(n-1)   ·   Fermat side: C = 2 * centre = p + q
module reflect #(parameter W = 128) (
  input  [W-1:0] c,                       // the reflection constant
  input  [W-1:0] x,
  output [W-1:0] y                        // y = c - x   (sigma is its own inverse)
);
  assign y = c - x;
endmodule

// ── 3 · INTEGER SQUARE ROOT — ceilSqrt(N). THE digital<->analog block ─────────────────────────────
//   A discrete, bit-serial datapath (restoring sqrt) converging on the continuous root: one result
//   bit per two input bits, add-compare-shift. ~W/2 cycles, no multiplier. This is where the
//   integer hardware approximates the analog geometric mean — the binding the author names.
module isqrt #(parameter W = 1024) (
  input                clk, rst, start,
  input      [W-1:0]   n,
  output reg [(W/2):0] root,              // floor(sqrt(n)); ceil by the flag below
  output reg           is_exact,          // root*root == n
  output reg           done
);
  reg [W-1:0]   rem;                       // running remainder
  reg [W+1:0]   test;                      // (root<<2 | 1) trial
  reg [(W/2):0] q;
  integer       i;
  always @(posedge clk) begin
    if (rst || start) begin
      rem <= n; q <= 0; root <= 0; is_exact <= 0; done <= 0; i <= (W/2);
    end else if (!done) begin
      // one iteration of restoring sqrt: test = (q<<2)|1; if (test<<(2*(i-1))) <= rem, subtract & set bit
      // (loop body elided for the sketch; standard bit-serial isqrt — see FPGA cookbooks)
      if (i == 0) begin root <= q; is_exact <= (rem == 0); done <= 1; end
      else         i <= i - 1;
    end
  end
  // ceilSqrt(n) = is_exact ? root : root + 1
endmodule

// ── 4 · FERMAT DECODE — the centre, the difference of squares, and the blind cost ────────────────
//   centre = (p+q)/2 = arithmetic mean (digital).   rootN = ceilSqrt(N) ~ geometric mean (analog).
//   blind = centre - rootN + 1 = the AM-GM gap = the security margin. Zero gap only at p == q.
module fermat #(parameter W = 1024) (
  input  [W-1:0]   p, q, n,               // n = p*q
  input  [(W/2):0] ceil_rootN,            // from isqrt (+1 when not exact)
  output [W-1:0]   centre,                // (p+q)/2
  output [W-1:0]   half_gap,              // (q-p)/2  = Fermat's b, with centre^2 - n = b^2
  output [W-1:0]   blind                  // centre - ceil_rootN + 1
);
  assign centre   = (p + q) >> 1;
  assign half_gap = (q - p) >> 1;
  assign blind    = centre - ceil_rootN + 1;
endmodule

// ── 5 · SEAL NIBBLE — textbook RSA on 91, folded mod 8 (RFC 9562 version field) ──────────────────
//   r^7 mod 91 is a short fixed modular-exponentiation chain (7 = 111b: square, square, mul...),
//   then +1 and mod 8. A handful of 7-bit mults and mods — trivial.
module seal (
  input  [6:0] r,                          // residue mod 91
  output [3:0] nibble                      // 1 + (r^7 mod 91) mod 8
);
  wire [13:0] r2 = (r  * r ) % 91;
  wire [13:0] r4 = (r2 * r2) % 91;
  wire [13:0] r6 = (r4 * r2) % 91;
  wire [13:0] r7 = (r6 * r ) % 91;
  assign nibble = (1 + (r7 % 8)) & 4'hF;
endmodule

// ── TOP — one control FSM sequences the shared ALU across the two functions ──────────────────────
//   ADDRESSING:  bytes -> fnv1a -> UUID format (version/variant) -> merkle fold (sort/merge/hash)
//   REFLECTION:  N -> isqrt -> fermat (centre, blind) ;  r -> seal
//   The merkle fold reuses fnv1a + a comparator (sort) — no new arithmetic.
module qpu_arith_top ( /* clk, rst, byte stream, N, p, q, r -> address, root, blind, nibble */ );
  // instantiate fnv1a, reflect, isqrt, fermat, seal under an FSM; share one integer ALU.
endmodule
