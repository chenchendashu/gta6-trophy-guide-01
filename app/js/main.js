// main.js — boots the guide: loads the trophy data, restores progress,
// renders the masthead, the view tabs and the current view, and wires every
// control. Views are hash routes (#/roadmap, #/missables, …) so the back
// button and screenshots can name a view. A "?demo" address loads the worked
// example instead of saved progress, without touching what is saved.

import { GRADE_ORDER, loadTrophyData } from "./data.js";
import { checklistHtml } from "./views-checklist.js";
import { missablesHtml } from "./views-missables.js";
import { plannerHtml } from "./views-planner.js";
import { roadmapHtml } from "./views-roadmap.js";
import { settingsHtml } from "./views-settings.js";
import {
  demoState,
  earnedCount,
  emptyState,
  exportText,
  gradeTallies,
  isEarned,
  loadState,
  parseImport,
  saveState,
} from "./store.js";

const VIEWS = [
  { id: "checklist", label: "Checklist & guide" },
  { id: "roadmap", label: "Roadmap" },
  { id: "missables", label: "Missables" },
  { id: "planner", label: "Next up" },
  { id: "settings", label: "Save & settings" },
];

let meta = {};
let trophies = [];
let state = loadState();
let settingsMessage = "";

const ui = { view: "checklist", kind: "all", grade: "all", query: "", hideEarned: false, selectedId: 17 };

function viewFromHash() {
  const id = location.hash.replace(/^#\//, "");
  return VIEWS.some((view) => view.id === id) ? id : "checklist";
}

function renderMasthead() {
  const earned = earnedCount(trophies, state);
  const pct = Math.round((earned / trophies.length) * 100);
  const tallies = gradeTallies(trophies, state);
  const tallyHtml = GRADE_ORDER.map(
    (grade) => `<span><b>${tallies[grade].earned}</b>/${tallies[grade].total} ${grade}</span>`,
  ).join("");
  document.querySelector("#masthead-stats").innerHTML = `
    <div class="progress-row">
      <span class="big-count">${earned} <small>/ ${trophies.length} trophies · ${pct}%</small></span>
      <span class="progress-track"><span class="progress-fill" style="display:block;width:${pct}%"></span></span>
      <span class="grade-tallies">${tallyHtml}</span>
    </div>`;
}

function renderTabs() {
  document.querySelector("#tabs").innerHTML = VIEWS.map(
    (view) => `<button type="button" class="tab" data-nav="${view.id}"${ui.view === view.id ? ' aria-current="page"' : ""}>${view.label}</button>`,
  ).join("");
}

function renderView() {
  const host = document.querySelector("#view");
  if (ui.view === "roadmap") host.innerHTML = roadmapHtml(trophies, state);
  else if (ui.view === "missables") host.innerHTML = missablesHtml(trophies, state);
  else if (ui.view === "planner") host.innerHTML = plannerHtml(trophies, state);
  else if (ui.view === "settings") host.innerHTML = settingsHtml(meta, state);
  else host.innerHTML = checklistHtml(trophies, state, ui);
  if (settingsMessage && ui.view === "settings") {
    const note = host.querySelector("#settings-message");
    if (note) note.textContent = settingsMessage;
  }
}

function render() {
  renderMasthead();
  renderTabs();
  renderView();
}

function renderKeepingSearch() {
  const y = window.scrollY;
  render();
  const search = document.querySelector("#search");
  if (search) {
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
  }
  window.scrollTo(0, y);
}

function goTo(view) {
  ui.view = view;
  if (location.hash !== `#/${view}`) location.hash = `#/${view}`;
  render();
  window.scrollTo(0, 0);
}

function selectTrophy(id) {
  ui.selectedId = id;
  if (ui.view !== "checklist") goTo("checklist");
  else render();
}

function changeCount(id, delta) {
  const trophy = trophies.find((t) => t.id === id);
  if (!trophy || typeof trophy.target !== "number") return;
  const next = Math.min(trophy.target, Math.max(0, (state.counts[id] || 0) + delta));
  state.counts[id] = next;
  saveState(state);
  render();
}

function downloadProgress() {
  const blob = new Blob([exportText(state)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "leonida-platinum-progress.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function wireEvents() {
  document.addEventListener("click", (event) => {
    const countButton = event.target.closest("[data-count]");
    if (countButton) {
      changeCount(Number(countButton.dataset.count), Number(countButton.dataset.delta));
      return;
    }
    const completeButton = event.target.closest("[data-complete]");
    if (completeButton) {
      const id = Number(completeButton.dataset.complete);
      const trophy = trophies.find((t) => t.id === id);
      if (trophy) {
        if (isEarned(trophy, state)) {
          delete state.earned[id];
          state.counts[id] = 0;
        } else {
          state.counts[id] = trophy.target;
        }
        saveState(state);
        render();
      }
      return;
    }
    const toggleButton = event.target.closest("[data-toggle-earned]");
    if (toggleButton) {
      const id = Number(toggleButton.dataset.toggleEarned);
      if (state.earned[id]) delete state.earned[id];
      else state.earned[id] = true;
      saveState(state);
      render();
      return;
    }
    const action = event.target.closest("[data-action]");
    if (action) {
      if (action.dataset.action === "export") downloadProgress();
      if (action.dataset.action === "reset" && confirm("Erase all saved progress, counters and notes in this browser?")) {
        state = emptyState();
        saveState(state);
        settingsMessage = "Progress reset.";
        render();
      }
      if (action.dataset.action === "demo") {
        state = demoState();
        saveState(state);
        settingsMessage = "Demo progress loaded — the checklist now shows a run in progress.";
        render();
      }
      return;
    }
    const nav = event.target.closest("[data-nav]");
    if (nav) {
      goTo(nav.dataset.nav);
      return;
    }
    const chip = event.target.closest("[data-kind]");
    if (chip) {
      ui.kind = chip.dataset.kind;
      render();
      return;
    }
    const selectable = event.target.closest("[data-select]");
    if (selectable && !event.target.closest("input, textarea, select, a")) {
      selectTrophy(Number(selectable.dataset.select));
    }
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.id === "grade-filter") {
      ui.grade = target.value;
      render();
    } else if (target.id === "hide-earned") {
      ui.hideEarned = target.checked;
      render();
    } else if (target.id === "spoiler-toggle") {
      state.settings.spoilers = target.checked;
      saveState(state);
      render();
    } else if (target.dataset && target.dataset.earn) {
      const id = Number(target.dataset.earn);
      if (target.checked) state.earned[id] = true;
      else delete state.earned[id];
      saveState(state);
      render();
    } else if (target.id === "import-file") {
      const file = target.files && target.files[0];
      if (!file) return;
      file.text().then((text) => {
        try {
          state = parseImport(text);
          saveState(state);
          settingsMessage = "Progress imported.";
        } catch {
          settingsMessage = "That file could not be read as a progress file; nothing was changed.";
        }
        render();
      });
    }
  });

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target.id === "search") {
      ui.query = target.value;
      renderKeepingSearch();
    } else if (target.dataset && target.dataset.note) {
      state.notes[Number(target.dataset.note)] = target.value;
      saveState(state);
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches && event.target.matches(".trophy-row")) {
      event.preventDefault();
      selectTrophy(Number(event.target.dataset.select));
    }
  });

  window.addEventListener("hashchange", () => {
    ui.view = viewFromHash();
    render();
  });
}

async function boot() {
  const params = new URLSearchParams(location.search);
  if (params.has("demo")) {
    state = demoState();
    if (params.get("spoilers") === "1") state.settings.spoilers = true;
    if (params.get("trophy")) ui.selectedId = Number(params.get("trophy")) || ui.selectedId;
    if (params.get("filter")) ui.kind = params.get("filter");
  }
  ui.view = viewFromHash();
  try {
    const data = await loadTrophyData();
    meta = data.meta;
    trophies = data.trophies;
  } catch (error) {
    document.querySelector("#view").innerHTML =
      `<div class="empty-note">The trophy data could not be loaded (${error.message}). Serve this folder with any static file server and open index.html through it.</div>`;
    return;
  }
  wireEvents();
  render();
}

boot();
