// views-planner.js — Next up: what to do next, worked out from the tracker's
// own state. Missable flags first (their windows close), then the roadmap's
// order; and the counted trophies nearest their targets, because a counter
// at 90% is a trophy one session away.

import { formatProgress } from "./data.js";
import { displayName, escapeHtml } from "./filters.js";
import { medalHtml } from "./marks.js";
import { stageOf } from "./roadmap.js";
import { isEarned } from "./store.js";

function reasonFor(trophy, state) {
  if (trophy.missable === "flag") return `Missable — ${trophy.missableNote || "its window can close"}`;
  if (trophy.missable === "watch") return "Watch — finish before the final mission";
  if (typeof trophy.target === "number") return formatProgress(trophy, state.counts[trophy.id] || 0);
  return `Roadmap stage ${trophy.stage} — ${stageOf(trophy).title}`;
}

export function plannerHtml(trophies, state) {
  const remaining = trophies.filter((trophy) => !isEarned(trophy, state));
  if (remaining.length === 0) {
    return `<section class="plain-card"><h2>Nothing left.</h2><p>All 55 trophies are earned — the platinum is yours. Vice got a price, and you paid it.</p></section>`;
  }
  const rank = (trophy) => (trophy.missable === "flag" ? 0 : trophy.missable === "watch" ? 1 : 2);
  const next = [...remaining]
    .sort((a, b) => rank(a) - rank(b) || a.stage - b.stage || a.id - b.id)
    .slice(0, 8);
  const closest = remaining
    .filter((trophy) => typeof trophy.target === "number" && (state.counts[trophy.id] || 0) > 0)
    .sort((a, b) => (b.counts[b.id] || 0) / b.target - (a.counts[a.id] || 0) / a.target)
    .slice(0, 5);
  const item = (trophy) => `
    <div class="next-item">
      ${medalHtml(trophy)}
      <span><b>${escapeHtml(displayName(trophy, state))}</b>
      <span class="next-reason" style="display:block">${escapeHtml(reasonFor(trophy, state))}</span></span>
      <button type="button" class="btn" data-select="${trophy.id}">Guide</button>
    </div>`;
  const closestHtml = closest.length
    ? closest.map(item).join("")
    : `<p class="next-reason">No counters started yet — the first stunt, race and range challenge will put trophies on this list.</p>`;
  return `
    <p class="view-intro"><b>Worked out from your tracker, not a fixed list.</b> Flagged missables come first because their windows close; after them, the roadmap's order. Below, the counted trophies nearest their targets.</p>
    <section class="plain-card">
      <h2>Do these next</h2>
      ${next.map(item).join("")}
    </section>
    <section class="plain-card">
      <h2>Closest to done</h2>
      ${closestHtml}
    </section>`;
}
