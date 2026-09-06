# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`gastromall-cenniki-app` is a single-page PWA (`index.html` + `manifest.json` + `sw.js` + icons) — a
mobile-first price search/comparison tool for Gastromall Group. It is a companion to (but a separate
codebase from) the `cenniki-automatyzacja` repo, which maintains the master Excel workbook
("analiza cenowa" workflow). This app's `PRODUCTS` array (a big literal near the top of the `<script>`
in `index.html`) should stay aligned with that workbook's "Cennik zbiorczy" data — mięso (meat) and
warzywa (vegetables/produce), each product with a list of supplier offers (`{supplier, price, region, promo}`).

## Two view modes in the app

- **Search mode** (default): free-text search across all products, results as stacked cards
  (`groupHtml` / `.product-group`), one card per product with each supplier as a row, cheapest
  offer tagged "Najniższa cena".
- **Category / compare mode** ("Porównaj mięso" / "Porównaj warzywa" buttons): renders a spreadsheet-style
  comparison table (`compareTableHtml`) — **this mirrors the "Cennik zbiorczy" / "do druku" sheets from
  `analiza cenowa`**: sticky index column = product name, one column per supplier (kontrahent), price
  cells, and the lowest price in each row highlighted (`--best` / `--best-bg` tokens). Missing supplier
  offer for a product renders as an empty cell ("—"), never as 0 — same "blank means no offer" rule as
  the Excel workbook.

Keep these two modes visually distinct but on the same design system (colors/fonts/tokens in `:root`).
When asked to bring the app's comparison view "in line with analiza cenowa", it means: index + kontrahenci
w kolumnach + podświetlona najniższa cena — the compare-table layout, not the card layout.

## Persisting decisions across sessions

This project may be worked on from different devices/sessions (phone, desktop) that don't share chat
memory. **Anything agreed here that should survive to the next session must be written into this file**,
not just stated in chat — a session only "remembers" what's committed to the repo (code + this file).
Update this file whenever a lasting decision is made about the app's structure, data format, or conventions.

## Region-aware supplier columns (compare view)

Which supplier column shows for which region (Północ/Południe) is **not** inferred from sample
offer counts — it's hardcoded in `SUPPLIER_REGION` (in `index.html`) verbatim from analiza cenowa's
own source of truth: the **"Synonimy" sheet's Dostawca/Region reference table** (columns D:E), the
same table the workbook's own search formula (`Cennik zbiorczy!V`, via `VLOOKUP`) uses. If a new
supplier is added or a region assignment changes, update that table in the Excel workbook first,
then mirror the same mapping into `SUPPLIER_REGION` here — don't re-derive it by counting sample
offers, that produced wrong results before (a single stray "Oba"-tagged conditional offer among 114
Południe-only ones once made a supplier wrongly appear in both regions).

`COMPARE_DATA` (the compare-table dataset, sourced from "Mięso/Warzywa - do druku") sometimes lacks
a column for a real supplier entirely (e.g. Transhurt was missing from meat) or has one with zero
prices filled in (e.g. Rodmer for warzywa) — when that happens, backfill it from `PRODUCTS` by exact
product-name match rather than leaving the supplier out, and propagate into duplicate TOP/CENY
STANDARD rows of the same product (matched by identical price vectors across the original 4
suppliers) so both rows show the backfilled price, not just one.

## Canonical product identity (search-view grouping)

The same real product is often listed under different literal names per supplier in `PRODUCTS`
(e.g. "łopatka wieprzowa", "BP Łopatka wieprzowa b/k ok.4kg [PROMOCJA]", "Łopatka wp b/k 4D" are all
the same "ŁOPATKA"). General search groups results by a **canonical key** derived from `COMPARE_DATA`
(see `canonicalKeyFor` / `CANONICAL_ROWS` in `index.html`), not by raw product name — this merges
those into one card instead of one misleading card per raw name, each wrongly tagged "Najniższa
cena". When `COMPARE_DATA` changes, this mapping is rebuilt automatically from it; no separate data
file to maintain.

## Price normalization — zł/kg wherever honestly possible

Every price (search cards and compare-table cells alike) is shown per kg whenever the product's real
weight is knowable — parsed from a weight stated in the product name (`parseWeightKg` /
`perKg` in `index.html`), the same number analiza cenowa itself keeps in "Ilość w jedn. bazowej".
**A product with no parseable weight (a single avocado, a head of lettuce, a decorative edible
flower — genuinely priced per sztuka with no stated weight) is deliberately left at its original
per-sztuka/per-worek price** — analiza cenowa itself does this too (its "Jednostka bazowa" column is
not always kg). Do not invent an assumed weight to force these to zł/kg; a fabricated conversion
factor would silently show a wrong number in a tool used for real purchasing decisions. When a price
is converted, the original package price/unit is still shown as a small secondary line so nothing is
hidden. "Najniższa cena" / row-highlight sorting always compares the per-kg price when one exists,
never the raw package price (otherwise a bigger pack could wrongly look cheaper).

## Visual conventions

- Search-result cards (`.product-group`) need a visibly distinct boundary from each other — border +
  shadow + a real gap between cards (`main`'s `gap`) — so a list of different articles doesn't blur
  into one mass. Don't shrink that gap back down for density's sake.
- The compare table uses a dedicated `--table-border` token (brighter than the regular `--border` in
  dark mode) for its row/column divider lines — the regular `--border` token is too low-contrast
  against the dark surface for a dense data table. Keep using `--table-border` there, not `--border`.

## Related repo

`cenniki-automatyzacja` (private) holds the actual supplier price-list files and the `analiza cenowa`
automation trigger (Excel COM via PowerShell, Windows-only). That repo's CLAUDE.md documents the
`analiza cenowa` trigger phrase and the master-workbook update rules in detail — read it for the
source-of-truth data/logic this app's comparison view should visually match.
