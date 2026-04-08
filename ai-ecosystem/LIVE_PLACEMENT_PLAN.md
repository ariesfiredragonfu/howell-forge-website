# AI Ecosystem Live Placement Plan (Staging)

## Goal

Integrate AI Ecosystem pages into production navigation with the same visual language while keeping claim-safe copy.

## Proposed Placement (Live)

1. Main nav:
   - Keep one top-level entry: `AI Ecosystem`
2. Subnav/landing tabs inside AI Ecosystem:
   - Startup
   - Growth
   - Enterprise
   - Compare
   - Technical
   - Guides
   - Demo
   - Sales
3. Keep existing core product tabs on the main site (`AI Forge`, `Quantum Agent Health`, `GroundChiFlow`) unchanged.

## Staging Implementation Applied

- AI Ecosystem pages now use production-like:
  - background image behavior
  - glass/transparency panel system
  - sticky chrome-style top nav
  - active tab highlighting
- Main staging nav now includes direct AI Ecosystem tab links for review:
  - AE Startup / AE Growth / AE Enterprise / AE Compare

## Pre-Live Gates (Required)

1. Re-run `run_phase4_gate.sh`
2. Re-run `run_all_reality_checks.sh`
3. Manual visual check:
   - homepage nav wrap behavior on narrow widths
   - AI Ecosystem panel readability over background image
4. Keep all copy within `SAFE_TO_CLAIM_MATRIX.md` and `FINAL_COPY_LIBRARY.md` boundaries

## Live Cutover Notes

- Promote only after visual + policy gates pass.
- Keep testimonials disabled unless verified approvals are present.
