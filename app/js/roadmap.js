// roadmap.js — the road to the platinum, in stages.
// The order is built from the official descriptions: the campaign's chapters
// and named missions first (several trophies hang off one-time story beats),
// then the stranger strands, then the collectibles and counts the
// descriptions name, then activities, free-roam feats and the money totals,
// and 100% completion last, because almost everything else feeds it.

import { isEarned } from "./store.js";

export const ROADMAP_STAGES = [
  {
    n: 1,
    title: "First steps in Leonida",
    blurb: "The prologue mission Gone Fishing and Chapter 1, plus one quiet Ocean Beach moment the list places at the story's start. Nothing here can be missed; settle in.",
  },
  {
    n: 2,
    title: "The campaign",
    blurb: "Chapters 2 to 4, the named story missions and the final mission. This stage also holds every flagged one-time beat — the VCIA departure, the Rhino encounter, the pair's story moments and the choice counter — so play it with the missables page open.",
  },
  {
    n: 3,
    title: "Strangers of Leonida",
    blurb: "The stranger strands: Andy, Kenton, Billy, Randy and Tyrone's finals, Cal's fishing challenge and Bret's hunt. Eight completed strands fill the Strangers & Freaks silver; close strands out before the final mission.",
  },
  {
    n: 4,
    title: "Collect the state",
    blurb: "The exploration counts the descriptions name: 52 areas of Leonida, 18 meditation spots, 3 card sets, 100 WAiNK locations and 100 discovered vehicles. Sweep them together, district by district.",
  },
  {
    n: 5,
    title: "Vice City pastimes",
    blurb: "Activities and challenges: sample all 9 activity types, gold the 42 Shooting Range challenges, win the 14 drone races and 20 different races, ride out 250 stunts and 50 challenges, and bowl at Kolt & Associates.",
  },
  {
    n: 6,
    title: "Crime pays",
    blurb: "Free-roam feats, most of them with your partner: the jewelry store taken quietly, 5 bank vaults, an armored truck, one illegal operation per gang, and the wanted-level escapes. Partner trophies belong here, while the pair are together.",
  },
  {
    n: 7,
    title: "Money, shops and property",
    blurb: "The economy trophies: launder $250,000 of marked bills, spend $100,000 across the shops, buy all 8 garage properties and register 10 vehicles to the Scooter Bros app. The late story's scores feed all four.",
  },
  {
    n: 8,
    title: "The long road",
    blurb: "100% completion, then the platinum it unlocks. By this stage the tracker should show a nearly-full board; whatever category the game's completion screen says is short is the only work left.",
  },
];

export function stageOf(trophy) {
  return ROADMAP_STAGES.find((stage) => stage.n === trophy.stage) || ROADMAP_STAGES[0];
}

export function trophiesInStage(trophies, n) {
  return trophies.filter((trophy) => trophy.stage === n);
}

export function stageProgress(trophies, state, n) {
  const inStage = trophiesInStage(trophies, n);
  const earned = inStage.filter((trophy) => isEarned(trophy, state)).length;
  return { earned, total: inStage.length };
}
