## Definition of Ready (DoR)

> [!success] Verdict: 🟢 READY TO START — <one-line justification>

<!-- Callout type follows the verdict: 🟢 → [!success] · 🟡 → [!warning] · 🔴 → [!danger].
     Keep the frontmatter `dor:` (ready | almost-ready | not-ready) in sync with it. -->

| DoR criterion | Status |
|---|---|
| Objective / description clear | <✅ / 🔎 / ⚠️ / ❌> |
| Acceptance criteria defined | <✅ / 🔎 / ⚠️ / ❌> |
| Well scoped (realistic size, not an épic) | <✅ / 🔎 / ⚠️ / ❌> |
| Scoring complete (Impact·Confidence·Size) | <✅ / 🔎 / ⚠️ / ❌> |
| Design / UI available | <✅ / 🔎 / ⚠️ / ❌ / N/A> |
| Extrapolable from existing code/contract | <✅ / 🔎 / ⚠️ / ❌> |
| Context sufficient | <✅ / 🔎 / ⚠️ / ❌> |

<!-- 🔎 = not explicit in the ticket, deduced by extrapolation (similar design /
     analogous code / derivable requirement). Mark 🔎, never ✅, and list it below. -->

**Deductions to verify:** <only if any row is 🔎; otherwise "none">
- <what was deduced> — basis: <similar design / analogous code / precedent ticket>; confidence: <High/Med/Low>; confirm by: <who/what checks it>

**To be ready it needs:** <pick reasons from the taxonomy — missing definitions/AC,
missing UI/design, not extrapolable from existing code, missing context, not well
scoped (épic/split), incomplete scoring, unrealistic estimate — and state the
concrete next step. If the verdict rests on deductions, mark it conditional:
"🟡 Almost ready — pending confirmation of N deductions".>

<!--
Reason taxonomy (use in the line above):
- Missing definitions / AC
- Missing UI / design
- Not extrapolable from existing code (new contract / ADR owed)
- Missing context (empty/placeholder, unclear origin/dependencies)
- Not well scoped (épic / needs splitting)
- Incomplete scoring (Impact/Confidence/Size missing → Score 0)
- Unrealistic estimate (size doesn't match real scope)
-->
