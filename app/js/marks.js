// marks.js — the small marks every view draws: a grade's medal swatch, a
// trophy's badges, and the compact trophy chip used by the roadmap,
// missables and planner views.

import { KIND_LABELS } from "./data.js";
import { displayName, escapeHtml } from "./filters.js";
import { isEarned } from "./store.js";

export function medalHtml(trophy) {
  return `<span class="medal ${trophy.grade}" aria-hidden="true"></span>`;
}

export function missableBadge(trophy) {
  if (trophy.missable === "flag") return `<span class="badge missable-flag">Missable</span>`;
  if (trophy.missable === "watch") return `<span class="badge missable-watch">Watch</span>`;
  return "";
}

export function badgesHtml(trophy) {
  const parts = [
    `<span class="badge grade-${trophy.grade}">${trophy.grade}</span>`,
    `<span class="badge kind">${KIND_LABELS[trophy.kind] || trophy.kind}</span>`,
    missableBadge(trophy),
    `<span class="badge">Roadmap ${trophy.stage}</span>`,
  ];
  if (trophy.hidden) parts.push(`<span class="badge">Hidden on PSN</span>`);
  return `<span class="badges">${parts.join("")}</span>`;
}

export function chipHtml(trophy, state) {
  const done = isEarned(trophy, state);
  const flag = trophy.missable === "flag" ? `<span class="flag-dot" title="Missable">!</span>` : "";
  return `<button type="button" class="trophy-chip${done ? " done" : ""}" data-select="${trophy.id}">${medalHtml(trophy)}<span>${escapeHtml(displayName(trophy, state))}</span>${flag}</button>`;
}
