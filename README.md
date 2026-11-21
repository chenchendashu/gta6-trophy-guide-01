# Leonida Platinum — a GTA VI trophy guide & tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/chenchendashu/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/chenchendashu/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies of Grand Theft Auto VI**, built for make.fun's [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) bounty.

## What it does

- **The full official list** — every trophy with its official name, description and grade as PlayStation publishes them (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden), in `app/data/trophies.json`.
- **A cited guide to each trophy** — what to do, where and how, and when it can be missed, in this entry's own words, with its sources named beside it (the official list on Exophase; the counts PlayStation tracks, via PSNProfiles). Where a description does not pin a fact down, the guide says so instead of inventing it.
- **A tracker** — a checklist saved in the browser (localStorage), progress counters for the counted trophies (250 stunts, 42 range golds, 500 choices…), per-trophy notes, and export/import of the progress file.
- **Filters and a spoiler setting** — filter by kind (story, missable, collectibles, activities, online), by grade, or by search; the spoiler setting hides story trophies' names and descriptions until they are earned.
- **A roadmap to the platinum** — eight stages built from the official descriptions, in the order to earn them, each with its own progress.
- **The missables, flagged honestly** — no trophy is confirmed unobtainable at launch, so flags are reasoned from the official descriptions alone: *flagged* means do it when it appears, *watch* means finish it before the finale.
- **A Next up planner** — what to do next, worked out from your own tracker state.

The app is plain static files under `app/` — no build step, no network requests, works fully offline. Its look is its own: no Rockstar Games logo, artwork or game screenshots.

## Run it

```sh
node serve.ts          # serves app/ at http://localhost:8080
```

or serve the `app/` folder with any static file server and open `index.html`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the kit's vendored `vendor/makefun-frontend.ts`, byte for byte as the scorer builds it.

## Screenshots

`screenshots/` holds real renders of this app in a browser, listed in `shots.json`: the checklist with a guide open, the roadmap, the missables, and the checklist with the spoiler setting on — all with the demo progress loaded.

## License

MIT — see `LICENSE`. Trophy names and descriptions are PlayStation's, shown as published.
