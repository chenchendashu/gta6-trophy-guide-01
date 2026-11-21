// store.js — the tracker's progress state.
// Earned marks, progress counters and per-trophy notes live in the browser's
// localStorage under one key, and can be exported to a JSON file and imported
// back from the Save & settings view. Nothing leaves the browser.

export const STORAGE_KEY = "leonida-platinum-v1";

export function emptyState() {
  return { earned: {}, counts: {}, notes: {}, settings: { spoilers: false } };
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Keep only the shapes this app writes, so a hand-edited import cannot break it.
export function sanitiseState(raw) {
  const state = emptyState();
  if (!isPlainObject(raw)) return state;
  if (isPlainObject(raw.earned)) {
    for (const [id, mark] of Object.entries(raw.earned)) if (mark === true) state.earned[id] = true;
  }
  if (isPlainObject(raw.counts)) {
    for (const [id, n] of Object.entries(raw.counts)) {
      if (typeof n === "number" && Number.isFinite(n) && n >= 0) state.counts[id] = Math.floor(n);
    }
  }
  if (isPlainObject(raw.notes)) {
    for (const [id, text] of Object.entries(raw.notes)) if (typeof text === "string") state.notes[id] = text;
  }
  if (isPlainObject(raw.settings)) state.settings.spoilers = raw.settings.spoilers === true;
  return state;
}

export function loadState() {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    return text ? sanitiseState(JSON.parse(text)) : emptyState();
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked: the tracker keeps working for this session.
  }
}

// A trophy is earned when it is ticked, or when its counter reaches the count
// PlayStation tracks for it.
export function isEarned(trophy, state) {
  if (state.earned[trophy.id] === true) return true;
  return typeof trophy.target === "number" && (state.counts[trophy.id] || 0) >= trophy.target;
}

export function earnedCount(trophies, state) {
  return trophies.filter((trophy) => isEarned(trophy, state)).length;
}

export function gradeTallies(trophies, state) {
  const tallies = {};
  for (const trophy of trophies) {
    const row = (tallies[trophy.grade] ||= { earned: 0, total: 0 });
    row.total += 1;
    if (isEarned(trophy, state)) row.earned += 1;
  }
  return tallies;
}

export function exportText(state) {
  return JSON.stringify({ app: "leonida-platinum", version: 1, ...state }, null, 2);
}

export function parseImport(text) {
  const raw = JSON.parse(text);
  if (!isPlainObject(raw)) throw new Error("That file is not a progress file.");
  return sanitiseState(raw);
}

// A worked example for trying the tracker (and for this guide's screenshots):
// a run part-way through the story, with counters part-way to their targets.
export function demoState() {
  const state = emptyState();
  for (const id of [2, 3, 4, 8, 16, 20, 21, 44, 46, 49, 50]) state.earned[id] = true;
  Object.assign(state.counts, {
    15: 87, 17: 19, 25: 5, 28: 11, 30: 1, 31: 34, 32: 23, 35: 63,
    42: 21, 48: 212, 52: 96500, 53: 100000, 55: 10,
  });
  state.notes[17] = "Two ranges left at silver. The moving-target drill is the wall — redo it first each session.";
  state.notes[37] = "Do this during VCIA Takedown, while the airfield is open.";
  return state;
}
