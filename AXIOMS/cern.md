---
title: "Definitions in cern.lean"
---

[← axiom index](/AXIOMS)

## `cern.lean` — 28 definition(s), 9 theorem(s)

```lean
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
def oaiHarvested : Nat := 74614
def oaiCompleteListSize : Nat := 74614
def oaiInBoth : Nat := 61488
def oaiOnly : Nat := 13126
def siteOnly : Nat := 9
def oaiUnion : Nat := 74623
def total (xs : List Nat) : Nat := xs.foldl (fun a b => a + b) 0
def partition (parts : List Nat) (whole : Nat) : Bool := total parts == whole
def exact (parts : List Nat) (whole : Nat) : Bool :=
def roots : List Nat := [0, 12077, 12112, 12147, 12381, 12063, 12222, 12199, 12350, 12156]
def reflect (d : Nat) : Nat := 10 - d
def fixedDigits : List Nat := (List.range 10).filter (fun d => reflect d == d)
def bucketSum (rs : List Nat) (ds : List Nat) : Nat := ds.foldl (fun a d => a + rs.getD d 0) 0
```
