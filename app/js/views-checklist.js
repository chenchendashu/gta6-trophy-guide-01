// views-checklist.js — the checklist view: the toolbar (search, kind chips,
// grade filter, hide-earned and the spoiler toggle) and the trophy rows,
// with the guide pane beside them.

import { GRADE_ORDER, KIND_LABELS, formatProgress } from "./data.js";
import { KIND_FILTERS, countForKind, displayDescription, displayName, escapeHtml, filterTrophies, isMasked } from "./filters.js";
import { badgesHtml, medalHtml } from "./marks.js";
import { isEarned } from "./store.js";
import { detailHtml } from "./views-detail.js";

export function toolbarHtml(trophies, ui, state) {
  const chips = KIND_FILTERS.map((kind) => {
    const count = countForKind(trophies, kind.id);
    const pressed = ui.kind === kind.id ? "true" : "false";
    return `<button type="button" class="chip" data-kind="${kind.id}" aria-pressed="${pressed}">${kind.label} <span class="chip-count">${count}</span></button>`;
  }).join("");
  const gradeOptions = ["all", ...GRADE_ORDER]
    .map((grade) => `<option value="${grade}"${ui.grade === grade ? " selected" : ""}>${grade === "all" ? "All grades" : grade[0].toUpperCase() + grade.slice(1)}</option>`)
    .join("");
  return `
  <div class="toolbar">
    <input type="search" id="search" placeholder="Search names, descriptions, guides…" value="${escapeHtml(ui.query)}" aria-label="Search trophies">
    <span class="chips">${chips}</span>
    <select id="grade-filter" aria-label="Filter by grade">${gradeOptions}</select>
    <label class="toggle"><input type="checkbox" id="hide-earned"${ui.hideEarned ? " checked" : ""}> Hide earned</label>
    <label class="toggle"><input type="checkbox" id="spoiler-toggle"${state.settings.spoilers ? " checked" : ""}> Hide story spoilers</label>
  </div>`;
}

function counterHtml(trophy, state) {
  if (typeof trophy.target !== "number") return "";
  const count = Math.min(state.counts[trophy.id] || 0, trophy.target);
  const pct = Math.round((count / trophy.target) * 100);
  return `
    <span class="counter" data-counter="${trophy.id}">
      <button type="button" data-count="${trophy.id}" data-delta="-1" aria-label="One less">−</button>
      <span class="count-text"><b>${count}</b> / ${trophy.target}</span>
      <button type="button" data-count="${trophy.id}" data-delta="1" aria-label="One more">+</button>
    </span>
    <span class="mini-track"><span class="mini-fill" style="display:block;width:${pct}%"></span></span>
    <span class="count-text">${escapeHtml(formatProgress(trophy, count))}</span>`;
}

export function rowHtml(trophy, state, ui) {
  const earned = isEarned(trophy, state);
  const masked = isMasked(trophy, state);
  const checkbox = typeof trophy.target === "number"
    ? ""
    : `<input type="checkbox" data-earn="${trophy.id}"${earned ? " checked" : ""} aria-label="Mark ${escapeHtml(trophy.name)} earned">`;
  return `
  <div class="trophy-row${earned ? " earned" : ""}${ui.selectedId === trophy.id ? " selected" : ""}" data-select="${trophy.id}" role="button" tabindex="0" aria-label="${escapeHtml(displayName(trophy, state))}">
    ${checkbox || "<span></span>"}
    ${medalHtml(trophy)}
    <span>
      <span class="trophy-name">${escapeHtml(displayName(trophy, state))}</span>
      <span class="trophy-desc" style="display:block">${escapeHtml(displayDescription(trophy, state))}</span>
      ${masked ? "" : badgesHtml(trophy)}
      ${masked ? "" : counterHtml(trophy, state)}
    </span>
    <span class="badge">${earned ? "Earned" : KIND_LABELS[trophy.kind] || ""}</span>
  </div>`;
}

export function checklistHtml(trophies, state, ui) {
  const shown = filterTrophies(trophies, ui, state);
  const selected = trophies.find((trophy) => trophy.id === ui.selectedId) || trophies[0];
  let list;
  if (ui.kind === "online") {
    list = `<div class="empty-note"><b>No online trophies.</b> The official PlayStation 5 list for Grand Theft Auto VI holds no online trophies: every one of the 55 is earned in the story and the open world, most of them with Lucia and Jason's partner play rather than a separate online mode. This filter stays here so the kinds the list does use — story, missable, collectibles, activities — are complete.</div>`;
  } else if (shown.length === 0) {
    list = `<div class="empty-note">No trophies match. Loosen the search, the grade filter, or “Hide earned”.</div>`;
  } else {
    list = shown.map((trophy) => rowHtml(trophy, state, ui)).join("");
  }
  return `
    ${toolbarHtml(trophies, ui, state)}
    <div class="checklist-layout">
      <div class="trophy-list">${list}</div>
      <aside class="detail" aria-label="Trophy guide">${detailHtml(selected, trophies, state)}</aside>
    </div>`;
}
