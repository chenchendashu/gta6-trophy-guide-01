// views-missables.js — every flagged trophy, with the reason for its flag.
// The flags are reasoned from the official descriptions alone, and this page
// says so: at launch no trophy is confirmed unobtainable after the story,
// so the guide flags moments instead of inventing certainties.

import { displayDescription, displayName, escapeHtml } from "./filters.js";
import { medalHtml } from "./marks.js";
import { isEarned } from "./store.js";

function missableCard(trophy, state) {
  const earned = isEarned(trophy, state);
  return `
  <div class="next-item">
    ${medalHtml(trophy)}
    <span>
      <b>${escapeHtml(displayName(trophy, state))}</b>${earned ? " — earned" : ""}
      <span class="next-reason" style="display:block">“${escapeHtml(displayDescription(trophy, state))}”</span>
      <span style="display:block">${escapeHtml(trophy.missableNote || "")}</span>
      <button type="button" class="btn" data-select="${trophy.id}">Open its guide</button>
    </span>
  </div>`;
}

export function missablesHtml(trophies, state) {
  const flagged = trophies.filter((trophy) => trophy.missable === "flag");
  const watched = trophies.filter((trophy) => trophy.missable === "watch");
  return `
    <p class="view-intro"><b>How to read these flags.</b> No trophy on the official list is confirmed unobtainable after the story — the game is days old and this guide does not invent certainties. What the official descriptions do show is which trophies hang off a single story beat, a choice, or a partner who may not always be beside you. Those are flagged here, from the descriptions alone: <b>flagged</b> means do it when it appears; <b>watch</b> means finish it in good time, before the final mission. Everything not listed is repeatable in free roam.</p>
    <section class="plain-card">
      <h2>Flagged — do it when it appears (${flagged.length})</h2>
      ${flagged.map((trophy) => missableCard(trophy, state)).join("")}
    </section>
    <section class="plain-card">
      <h2>Watch — finish before the finale (${watched.length})</h2>
      ${watched.map((trophy) => missableCard(trophy, state)).join("")}
    </section>`;
}
