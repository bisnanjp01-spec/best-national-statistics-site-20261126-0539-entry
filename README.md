# Valdoria National Statistics — best-national-statistics-site-20261126-0539

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/bisnanjp01-spec/best-national-statistics-site-20261126-0539-entry/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/bisnanjp01-spec/best-national-statistics-site-20261126-0539-entry/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

A national statistics portal for the fictional Republic of Valdoria: key indicators, population, economy, health, education and regional data for 2020–2025, with charts drawn in code, a year selector, a region filter, a sortable regions table and chart-type toggles. Every figure is internally consistent and cited to its (fictional) source — the Valdoria National Statistics Office and the Valdoria Census 2025. The site is a single static page with no network dependencies: all data, styling and charts live in the repository.

## How to run

Serve the `app/` directory with any static server, then open `index.html` in a browser:

```sh
python3 -m http.server 8123 --directory app
```

Then visit `http://localhost:8123/` — no build step, no dependencies, no keys.

## Structure

- `app/index.html` — single page, navigation and view container
- `app/style.css` — all styling, responsive for desktop and phone
- `app/data.js` — every figure (2020–2025 series, six regions, indicators)
- `app/charts.js` — canvas chart helpers (line, bar, donut, age pyramid)
- `app/views.js` — one render function per section
- `app/app.js` — hash router and control wiring
- `main.ts` — builds the grader dossier from `app/` and `screenshots/`

## Screenshots

Four screenshots in `screenshots/` show the site as rendered: the overview and economy pages on desktop (1280×800), the regions page on desktop, and the overview on a phone (390×844). They are real renders of the code in `app/`, taken with headless Chromium.
