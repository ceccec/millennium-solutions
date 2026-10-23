-- title: The CERN Open Data corpus, as measured, checked by its own arithmetic
-- wing: the floor
-- prior_art: not applicable (arithmetic over measured counts)
-- prior_art_search: none performed; the claims are identities and one refutation over the cached summary.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- SOURCE OF EVERY LITERAL: .cern/corpus.json and .cern/oai.json, written by scripts/cern.ts from the portal's sitemap
-- and OAI-PMH feed on 2026-09-05. The sitemap files themselves are no longer in the cache (.cern/sitemaps is empty),
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
def sitemaps : Nat := 317
def urls : Nat := 158489
def listedRecordUrls : Nat := 150102
def duplicatedInSitemap : Nat := 36873
def records : Nat := 113229
def distinctRecids : Nat := 61497
def nonRecordUrls : Nat := 8387
def numericIds : Nat := 57408
def slugAliases : Nat := 55821
def canonicalRecords : Nat := 61497
def addresses : Nat := 113229
def collisions : Nat := 0
def notInvolutive : Nat := 0
def fixed : Nat := 12400
def swapped : Nat := 100829

-- ── THE MEASURED FIGURES (from .cern/oai.json) ───────────────────────────────────────────────────────────
def oaiHarvested : Nat := 74614
def oaiCompleteListSize : Nat := 74614
def oaiInBoth : Nat := 61488
def oaiOnly : Nat := 13126
def siteOnly : Nat := 9
def oaiUnion : Nat := 74623

-- ── 1 · THE RECORD COUNT IS THE SUM OF ITS TWO ID KINDS ──────────────────────────────────────────────────
theorem records_are_numeric_plus_slug :
  records = numericIds + slugAliases := by decide

-- ── 2 · THE SITEMAP LISTS EACH RECORD AND ITS DUPLICATES ─────────────────────────────────────────────────
theorem listed_urls_are_records_plus_duplicates :
  listedRecordUrls = records + duplicatedInSitemap := by decide

-- ── 3 · EVERY URL IS A RECORD OR A NON-RECORD PAGE ───────────────────────────────────────────────────────
theorem urls_are_listed_records_plus_non_records :
  urls = listedRecordUrls + nonRecordUrls := by decide

-- ── 4 · EVERY ADDRESS IS FIXED OR MOVED, AND THE MOVED ONES ARE THE REST ─────────────────────────────────
theorem fixed_and_swapped_partition_the_records :
  fixed + swapped = records := by decide

-- ── 5 · THE OAI HARVEST IS COMPLETE AND ITS UNION IS THE SUM OF ITS PARTS ────────────────────────────────
theorem oai_harvest_is_complete :
  oaiHarvested = oaiCompleteListSize := by decide

theorem oai_union_is_the_sum_of_its_parts :
  oaiHarvested = oaiInBoth + oaiOnly
  ∧ oaiUnion = oaiInBoth + oaiOnly + siteOnly := by decide

-- ── 6 · WHAT THE INVOLUTION CHECK MEASURES. WITHDRAWN: an earlier version of this section claimed the recorded counts
-- refute an involution by parity. That was wrong. The records are not the points of the involution: the script applies
-- d ↦ 10 − d to each record's DIGIT (scripts/cern.ts:122-133), so the involution acts on the ten digits, and
-- "notInvolutive = 0" is the identity 10 − (10 − d) = d, which holds for every digit and cannot fail. The check is
-- unfalsifiable as written, and it says nothing about the address map of the records. The measured counts are the
-- ten digit buckets: they sum to the record count, and the fixed count is the bucket of digit 5.
def roots : List Nat := [0, 12517, 12499, 12534, 12769, 12400, 12681, 12508, 12777, 12544]

theorem the_digit_buckets_sum_to_the_records :
  roots.foldl (fun a b => a + b) 0 = records := by decide

theorem the_fixed_count_is_the_bucket_of_digit_five :
  roots.getD 5 0 = fixed := by decide

-- The involution claim, stated on the digits it actually acts on. It is true of d ↦ 10 − d and decides nothing about
-- the records, which is why the script's check is recorded here as an identity and not as a finding.
theorem the_reflection_is_an_involution_on_the_digits :
  (List.range 10).all (fun d => 10 - (10 - d) == d) = true := by decide

end Cern
