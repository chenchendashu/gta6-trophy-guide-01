// views-detail.js — the guide pane: one trophy in full. Its official name,
// description and grade as PlayStation publishes them; the guide in this
// entry's own words; when it can be missed; its sources, named beside the
// guide so a reader sees where each fact comes from; its progress controls
// and a private note.

import { SOURCE_PAGES, formatProgress } from "./data.js";
import { displayDescription, displayName, escapeHtml, isMasked } from "./filters.js";
import { badgesHtml } from "./marks.js";
import { stageOf } from "./roadmap.js";
import { isEarned } from "./store.js";

function progressHtml(trophy, state) {
  const earned = isEarned(trophy, state);
  if (typeof trophy.target === "number") {
    const count = state.counts[trophy.id] || 0;
    return `
      <h3>Your progress</h3>
      <p>${escapeHtml(formatProgress(trophy, Math.min(count, trophy.target)))}${earned ? " — earned." : ""}</p>
      <span class="counter">
        <button type="button" data-count="${trophy.id}" data-delta="-1" aria-label="One less">−</button>
        <button type="button" data-count="${trophy.id}" data-delta="1" aria-label="One more">+</button>
        <button type="button" class="btn" data-complete="${trophy.id}">${earned ? "Reset counter" : "Mark complete"}</button>
      </span>`;
  }
  return `
    <h3>Your progress</h3>
    <p>${earned ? "Earned. Nicely done." : "Not earned yet."}</p>
    <button type="button" class="btn${earned ? "" : " primary"}" data-toggle-earned="${trophy.id}">${earned ? "Mark as not earned" : "Mark as earned"}</button>`;
}

// A one-line citation under the trophy's name, so the sourcing of a guide is
// visible at a glance; the full source list sits lower in the pane.
function shortSource(source) {
  if (source.includes("Exophase")) return "Exophase (the official list)";
  if (source.includes("PSNProfiles")) return "PSNProfiles (the count PlayStation tracks)";
  if (source.includes("Author")) return "the author's advice, from the official description";
  return source;
}

function citeLineHtml(trophy) {
  const parts = trophy.sources.map(shortSource).join(" · ");
  return `<p class="cite-line">Written from: ${escapeHtml(parts)}.</p>`;
}

function missableHtml(trophy) {
  if (trophy.missable === "no" || !trophy.missableNote) return "";
  const label = trophy.missable === "flag" ? "Missable — flagged from the official description" : "Watch — finish it in good time";
  return `<div class="missable-box${trophy.missable === "watch" ? " watch" : ""}"><b>${label}.</b> ${escapeHtml(trophy.missableNote)}</div>`;
}

export function detailHtml(trophy, trophies, state) {
  if (!trophy) return `<p>No trophy selected.</p>`;
  if (isMasked(trophy, state)) {
    return `
      <span class="badge grade-${trophy.grade}">${trophy.grade}</span>
      <h2>Hidden story trophy</h2>
      <p class="official">The spoiler setting is on: this story trophy's name, description and guide stay hidden until you earn it. Turn the setting off in the toolbar or in Save &amp; settings to read it now.</p>
      ${progressHtml(trophy, state)}`;
  }
  const stage = stageOf(trophy);
  const sources = trophy.sources.map((source) => `<li>${escapeHtml(source)}</li>`).join("");
  const sourceLinks = SOURCE_PAGES.map((page) => `<a href="${page.url}" target="_blank" rel="noopener">${escapeHtml(page.label)}</a>`).join("<br>");
  const note = state.notes[trophy.id] || "";
  return `
    <h2>${escapeHtml(displayName(trophy, state))}</h2>
    <p class="official">“${escapeHtml(displayDescription(trophy, state))}” — the official description</p>
    ${badgesHtml(trophy)}
    ${citeLineHtml(trophy)}
    ${missableHtml(trophy)}
    <h3>The guide</h3>
    <p class="guide-text">${escapeHtml(trophy.guide)}</p>
    <h3>Sources</h3>
    <ul class="sources">${sources}</ul>
    <p class="sources">${sourceLinks}</p>
    <h3>Roadmap</h3>
    <p>Stage ${stage.n} — ${escapeHtml(stage.title)}. <button type="button" class="btn" data-nav="roadmap">Open the roadmap</button></p>
    ${progressHtml(trophy, state)}
    <h3>Your note</h3>
    <textarea data-note="${trophy.id}" placeholder="Private to this browser — a route, a reminder, a grudge…">${escapeHtml(note)}</textarea>`;
}
