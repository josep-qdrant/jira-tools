# Scoring model — multiplicative RICE, verification, and the inverse-size trap

This explains a priority model many product backlogs use, how to verify it
against real data, and the one structural effect that drives most audit findings.

> **This is the common case, not a given.** Reverse-engineer the actual model
> from the data before relying on it. Some boards use an additive model, WSJF, a
> weighted sum, or a fully custom formula. The verification recipe below is how
> you find out which — if the arithmetic doesn't reconcile, the model is
> different (or a factor is missing), not "broken".

## The formula (common case)

The Score often behaves as a **multiplicative RICE**:

```
Score = Impact(calc) × Confidence(calc) × Size factor(calc)
```

Each backlog tends to store both a human-facing **select** value (High/Medium/Low,
XS/S/M/L/XL) and a system-computed **numeric** value used in the Score. The numeric
("calc") fields are the ones that multiply.

## Value mappings (confirm, don't assume)

These mappings are a frequently-seen calibration. Treat them as a prior to
check, but **verify against the actual data** for any team — a different project
may calibrate the buckets differently (or use story points, a 1–5 scale, etc.).

| Variable | Qualitative | Numeric |
|----------|-------------|---------|
| **Impact / Confidence** | High | 9 |
| | Medium | 6 |
| | Low | 2 |
| **Size factor** (T-Shirt, inverse to effort) | XS | 10 |
| | S | 8 |
| | M | 6 |
| | L | 4 |
| | XL | 2 |

If a value (e.g. XL) doesn't appear in your set, you may have to **infer** it
from the pattern — record that it was inferred, don't present it as observed.

## The verification recipe

For every issue that has Impact, Confidence, and Size:

1. Read the **calculated** numeric fields (Impact-calc, Confidence-calc,
   Size-factor-calc) and the stored **Score**.
2. Compute `Impact × Confidence × Size` yourself.
3. Compare to the stored Score.
   - **Reconciles** → the formula holds; record ✓.
   - **Doesn't reconcile or Score = 0** → a factor is missing. This is almost
     always missing Impact and/or Confidence, not a formula bug. Record the
     issue as **"scoring incomplete"** and note which factor is absent.

The point of this pass: prove that any ranking problems come from **input
quality** (optimistic sizes, generous impacts, missing factors), not from the
arithmetic. (A typical result: the formula reconciles on every issue with
complete data, and the only Score-0 rows are those missing Impact/Confidence.)

## The inverse-size trap (the most important consequence)

Size enters as a factor **inverse to effort**: XS = 10 (highest) … XL = 2
(lowest). So a smaller estimate produces a *higher* Score.

Concretely: an XS estimate multiplies the Score by 10; calling the same work M
multiplies by 6. An over-optimistic XS/S can therefore launch a modest item to
the top of the backlog purely on estimation, not on value.

**Implications you must carry into the per-ticket audit:**

- The T-Shirt Size is a **variable to audit**, not a given. Re-estimate
  suspicious XS/S items against their real scope (API + UI + billing +
  migration + risky behavior all hiding under one "XS").
- For any item whose ranking depends on a small size, **recompute the Score with
  a realistic size** to show how far it would move. (E.g. XS=10 → M=6 cuts the
  Score by 40%.)
- Top-of-backlog items that are all XS deserve the most estimation scrutiny —
  they may be leading the ranking for the wrong reason.

## Recording "scoring incomplete"

When Score = 0 because of a missing factor, don't drop the issue — it can be
strategically important yet invisible to any score-based ordering (a real DR
epic with no Impact/Confidence sorts to the bottom). Record:

- which factor(s) are missing,
- whether the item is nonetheless strategic / has customer demand,
- the action: complete Impact/Confidence so it can be ranked.
