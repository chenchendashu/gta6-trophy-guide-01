// data.js — loads the trophy data file and names the guide's sources.
// app/data/trophies.json is a file of this app, fetched from the same server
// that served the page; the app makes no other request, and works offline
// once a static server has handed it these files.

export const SOURCE_PAGES = [
  {
    label: "Exophase — Grand Theft Auto VI trophies (PS5): the official list",
    url: "https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/",
  },
  {
    label: "PSNProfiles — Grand Theft Auto VI trophies: the counts PlayStation tracks",
    url: "https://psnprofiles.com/trophies/43531-grand-theft-auto-vi",
  },
];

export const GRADE_ORDER = ["platinum", "gold", "silver", "bronze"];

export const KIND_LABELS = {
  story: "Story",
  collectibles: "Collectibles",
  activities: "Activities",
  online: "Online",
};

export async function loadTrophyData() {
  const response = await fetch("data/trophies.json");
  if (!response.ok) throw new Error(`trophies.json answered ${response.status}`);
  const data = await response.json();
  const trophies = Array.isArray(data) ? data : data.trophies;
  if (!Array.isArray(trophies)) throw new Error("trophies.json holds no trophies array");
  return { meta: Array.isArray(data) ? {} : data, trophies };
}

export function formatCount(n) {
  return n.toLocaleString("en-US");
}

// Money targets are counted in dollars; everything else in its own unit.
export function formatProgress(trophy, count) {
  if (typeof trophy.target !== "number") return "";
  const shown = trophy.unit && trophy.unit.startsWith("dollars")
    ? `$${formatCount(count)} of $${formatCount(trophy.target)}`
    : `${formatCount(count)} of ${formatCount(trophy.target)}`;
  return trophy.unit ? `${shown} ${trophy.unit.replace(/^dollars /, "")}`.trim() : shown;
}
