// views-settings.js — Save & settings: the spoiler setting, export and
// import of the progress file, a reset, the demo progress, and the guide's
// own account of its sources and limits.

import { SOURCE_PAGES } from "./data.js";
import { escapeHtml } from "./filters.js";

export function settingsHtml(meta, state) {
  const sourceLinks = SOURCE_PAGES.map(
    (page) => `<li><a href="${page.url}" target="_blank" rel="noopener">${escapeHtml(page.label)}</a></li>`,
  ).join("");
  const metaSources = (meta.sources || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  return `
  <div class="settings-grid">
    <section class="plain-card">
      <h2>Spoiler setting</h2>
      <p>Hide the names and descriptions of story trophies until they are earned. The platinum is never hidden: its text gives nothing away.</p>
      <label class="toggle"><input type="checkbox" id="spoiler-toggle"${state.settings.spoilers ? " checked" : ""}> Hide story spoilers</label>
    </section>
    <section class="plain-card">
      <h2>Your progress file</h2>
      <p>Progress is saved in this browser as you go. Export it to a file to keep it or move it to another browser; import restores it. The file is plain JSON and leaves your machine only when you save it.</p>
      <div class="button-row">
        <button type="button" class="btn primary" data-action="export">Export progress</button>
        <label class="btn" for="import-file">Import progress</label>
        <input type="file" id="import-file" accept=".json,application/json" hidden>
        <button type="button" class="btn danger" data-action="reset">Reset everything</button>
      </div>
      <p id="settings-message" class="next-reason" role="status"></p>
    </section>
    <section class="plain-card">
      <h2>Try the tracker</h2>
      <p>Load a worked example — a run part-way through the story, counters part-way to their targets, two notes written — to see the checklist, roadmap and planner as a working player sees them. It replaces the progress currently saved in this browser.</p>
      <div class="button-row">
        <button type="button" class="btn" data-action="demo">Load demo progress</button>
      </div>
    </section>
    <section class="plain-card">
      <h2>About this guide and its sources</h2>
      <p>${escapeHtml(meta.list || "")}</p>
      <ul class="sources">${metaSources}</ul>
      <p>The official list, as published:</p>
      <ul class="sources">${sourceLinks}</ul>
      <p>Every trophy's guide is this entry's own words, written from the official descriptions; a source is cited beside each guide, never copied. Where a description does not pin a fact down — a place, a moment — the guide says so and flags the trophy rather than inventing the detail. The look is this guide's own: no Rockstar Games logo, artwork or game screenshots are used. This app works fully offline and makes no network request.</p>
    </section>
  </div>`;
}
