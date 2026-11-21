// filters.js — which trophies the checklist shows, and how a trophy's text
// shows under the spoiler setting.

import { isEarned } from "./store.js";

export const KIND_FILTERS = [
  { id: "all", label: "All" },
  { id: "story", label: "Story" },
  { id: "missable", label: "Missable" },
  { id: "collectibles", label: "Collectibles" },
  { id: "activities", label: "Activities" },
  { id: "online", label: "Online" },
];

export function matchesKind(trophy, kind) {
  if (kind === "all") return true;
  if (kind === "missable") return trophy.missable !== "no";
  return trophy.kind === kind;
}

export function countForKind(trophies, kind) {
  return trophies.filter((trophy) => matchesKind(trophy, kind)).length;
}

// The spoiler setting hides the names and descriptions of story trophies
// until they are earned. The platinum is exempt: its name and description
// are the game's congratulations, and reveal nothing about the story.
export function isMasked(trophy, state) {
  return (
    state.settings.spoilers === true &&
    trophy.kind === "story" &&
    trophy.grade !== "platinum" &&
    !isEarned(trophy, state)
  );
}

export function displayName(trophy, state) {
  return isMasked(trophy, state) ? "Hidden story trophy" : trophy.name;
}

export function displayDescription(trophy, state) {
  return isMasked(trophy, state)
    ? "Name and description hidden by the spoiler setting until this trophy is earned."
    : trophy.description;
}

export function filterTrophies(trophies, ui, state) {
  const query = ui.query.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (!matchesKind(trophy, ui.kind)) return false;
    if (ui.grade !== "all" && trophy.grade !== ui.grade) return false;
    if (ui.hideEarned && isEarned(trophy, state)) return false;
    if (query) {
      const haystack = isMasked(trophy, state)
        ? ""
        : `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
