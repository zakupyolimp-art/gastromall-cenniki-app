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

## Related repo

`cenniki-automatyzacja` (private) holds the actual supplier price-list files and the `analiza cenowa`
automation trigger (Excel COM via PowerShell, Windows-only). That repo's CLAUDE.md documents the
`analiza cenowa` trigger phrase and the master-workbook update rules in detail — read it for the
source-of-truth data/logic this app's comparison view should visually match.
