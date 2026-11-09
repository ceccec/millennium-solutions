-- title: The CERN Open Data corpus, as measured, checked by its own arithmetic
-- wing: the floor
-- prior_art: unclassified
-- prior-art note: not applicable — arithmetic over measured counts
-- prior_art_search: none performed; the claims are identities and one refutation over the cached summary.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- SOURCE OF EVERY LITERAL: .cern/corpus.json and .cern/oai.json, written by scripts/cern.ts and scripts/cern-oai.ts
-- from the portal's sitemap and OAI-PMH feed. The literals below are REWRITTEN from those caches by scripts/cern-lean.ts; do
-- not edit them by hand. The sitemap files themselves are no longer in the cache (.cern/sitemaps is empty),
-- so these theorems check the SUMMARY the script wrote, not the records. A theorem here is about the measurement as
-- recorded, and says nothing about the portal as it is today.
--
-- WHAT THIS FILE DOES NOT SAY. It does not state a collision with the deposit's expressions. A residue mod 9 always
-- falls in one of three classes, so a test of "does a CERN figure land in a class" cannot fail and is not a finding.
-- What is decided below: the recorded counts add up as their definitions say, and the script's involution check is an
-- identity on the ten digits that cannot fail, so it does not test the records. An earlier parity argument that read
-- the records as the points of an involution was wrong, and is withdrawn in section 6.

namespace Cern

-- ── THE MEASURED FIGURES (from .cern/corpus.json) ─────────────────────────────────────────────────────────
def sitemaps : Nat := 318
def urls : Nat := 158518
def listedRecordUrls : Nat := 151435
def duplicatedInSitemap : Nat := 41728
def records : Nat := 109707
def distinctRecids : Nat := 62229
def nonRecordUrls : Nat := 7083
def numericIds : Nat := 51375
def slugAliases : Nat := 58332
def canonicalRecords : Nat := 62229
def addresses : Nat := 109707
def collisions : Nat := 0
def notInvolutive : Nat := 0
def fixed : Nat := 12063
def swapped : Nat := 97644

-- ── THE MEASURED FIGURES (from .cern/oai.json) ───────────────────────────────────────────────────────────
def oaiHarvested : Nat := 74614
def oaiCompleteListSize : Nat := 74614
def oaiInBoth : Nat := 61488
def oaiOnly : Nat := 13126
def siteOnly : Nat := 9
def oaiUnion : Nat := 74623

-- ── 1 · THE RECORD COUNT IS THE SUM OF ITS TWO ID KINDS ──────────────────────────────────────────────────
-- ── THE IDENTITIES AS LAWS WITH THEIR INVERSES (2026-11-02). Each read `whole = a + b` over the recorded counts,
-- which the kernel can only read back — leads.ts filed all seven under "a certificate, not a proof". The parts
-- are a list now, `partition parts whole` decides that they sum to the whole, and each theorem also decides that
-- they do NOT sum to the whole's neighbours: a statement that can come out false, over the parts it names.
def total (xs : List Nat) : Nat := xs.foldl (fun a b => a + b) 0
def partition (parts : List Nat) (whole : Nat) : Bool := total parts == whole
/-- a partition is exact: the parts reach the whole and neither of its neighbours -/
def exact (parts : List Nat) (whole : Nat) : Bool :=
  partition parts whole && !partition parts (whole + 1) && (whole == 0 || !partition parts (whole - 1))

theorem records_are_numeric_plus_slug :
  exact [numericIds, slugAliases] records = true := by decide

-- ── 2 · THE SITEMAP LISTS EACH RECORD AND ITS DUPLICATES ─────────────────────────────────────────────────
theorem listed_urls_are_records_plus_duplicates :
  exact [records, duplicatedInSitemap] listedRecordUrls = true := by decide

-- ── 3 · EVERY URL IS A RECORD OR A NON-RECORD PAGE ───────────────────────────────────────────────────────
theorem urls_are_listed_records_plus_non_records :
  exact [listedRecordUrls, nonRecordUrls] urls = true := by decide

-- ── 4 · EVERY ADDRESS IS FIXED OR MOVED, AND THE MOVED ONES ARE THE REST ─────────────────────────────────
theorem fixed_and_swapped_partition_the_records :
  exact [fixed, swapped] records = true := by decide

-- ── 5 · THE OAI HARVEST IS COMPLETE AND ITS UNION IS THE SUM OF ITS PARTS ────────────────────────────────
theorem oai_harvest_is_complete :
  exact [oaiHarvested] oaiCompleteListSize = true := by decide

theorem oai_union_is_the_sum_of_its_parts :
  exact [oaiInBoth, oaiOnly] oaiHarvested = true ∧ exact [oaiInBoth, oaiOnly, siteOnly] oaiUnion = true := by decide

-- ── 6 · WHAT THE INVOLUTION CHECK MEASURES. WITHDRAWN: an earlier version of this section claimed the recorded counts
-- refute an involution by parity. That was wrong. The records are not the points of the involution: the script applies
-- d ↦ 10 − d to each record's DIGIT (scripts/cern.ts:122-133), so the involution acts on the ten digits, and
-- "notInvolutive = 0" is the identity 10 − (10 − d) = d, which holds for every digit and cannot fail. The check is
-- unfalsifiable as written, and it says nothing about the address map of the records. The measured counts are the
-- ten digit buckets: they sum to the record count, and the fixed count is the bucket of digit 5.
def roots : List Nat := [0, 12077, 12112, 12147, 12381, 12063, 12222, 12199, 12350, 12156]

theorem the_digit_buckets_sum_to_the_records :
  roots.foldl (fun a b => a + b) 0 = records := by decide

def reflect (d : Nat) : Nat := 10 - d
def fixedDigits : List Nat := (List.range 10).filter (fun d => reflect d == d)
def bucketSum (rs : List Nat) (ds : List Nat) : Nat := ds.foldl (fun a d => a + rs.getD d 0) 0

theorem the_fixed_count_is_the_bucket_of_digit_five :
  fixedDigits = [5] ∧ bucketSum roots fixedDigits = fixed
  ∧ bucketSum roots ((List.range 10).filter (fun d => reflect d != d)) = swapped
  ∧ bucketSum roots fixedDigits + bucketSum roots ((List.range 10).filter (fun d => reflect d != d)) = total roots := by decide

-- The involution claim, stated on the digits it actually acts on. It is true of d ↦ 10 − d and decides nothing about
-- the records, which is why the script's check is recorded here as an identity and not as a finding.
theorem the_reflection_is_an_involution_on_the_digits :
  (List.range 10).all (fun d => 10 - (10 - d) == d) = true := by decide

end Cern
