// views-roadmap.js — the roadmap to the platinum: the eight stages, each
// with its trophies and its progress, in the order the official descriptions
// argue for.

import { escapeHtml } from "./filters.js";
import { chipHtml } from "./marks.js";
import { ROADMAP_STAGES, stageProgress, trophiesInStage } from "./roadmap.js";

export function roadmapHtml(trophies, state) {
  const stages = ROADMAP_STAGES.map((stage) => {
    const progress = stageProgress(trophies, state, stage.n);
    const pct = progress.total ? Math.round((progress.earned / progress.total) * 100) : 0;
    const chips = trophiesInStage(trophies, stage.n).map((trophy) => chipHtml(trophy, state)).join("");
    return `
    <section class="stage-card">
      <div class="stage-head">
        <span class="stage-num">${stage.n}</span>
        <h2>${escapeHtml(stage.title)}</h2>
        <span class="stage-progress">${progress.earned} of ${progress.total} earned</span>
      </div>
      <p class="stage-blurb">${escapeHtml(stage.blurb)}</p>
      <span class="mini-track" style="display:block"><span class="mini-fill" style="display:block;width:${pct}%"></span></span>
      <div class="trophy-chips">${chips}</div>
    </section>`;
  }).join("");
  return `
    <p class="view-intro"><b>The order to earn them in.</b> Built from the official descriptions — which story chapters and missions, which collectibles and counts: the campaign first because several trophies hang off one-time story beats, the stranger strands before the finale, then the collectible sweeps, activities and free-roam feats, the money totals the late story feeds, and 100% completion last, because almost everything else counts toward it. A chip with a <b>!</b> is flagged missable; a struck-through chip is earned. Click any chip to open its guide.</p>
    ${stages}`;
}
