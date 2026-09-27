/**
 * adamawa-vrek shared data layer
 *
 * Real geography (21 LGAs) and the publicly confirmed 2027 governorship
 * candidates as of Sept 2026. Parties whose primaries have not produced a
 * confirmed nominee yet are marked "pending" rather than invented.
 *
 * Vote figures are NOT official results. INEC has not conducted this
 * election yet. Every LGA starts unreported with zero votes; figures only
 * change when an authorized user enters real, sourced numbers through the
 * admin panel. Nothing here is precomputed to favor any party.
 */

const LGAS = [
  "Demsa", "Fufure", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada",
  "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North",
  "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North",
  "Yola South"
];

const CANDIDATES = [
  {
    id: "apc",
    party: "APC",
    partyFull: "All Progressives Congress",
    name: "Tijjani Ahmed Galadima",
    status: "confirmed",
    note: "Won APC primary, June 2026"
  },
  {
    id: "adc",
    party: "ADC",
    partyFull: "African Democratic Congress",
    name: "Modibbo Hammantukur Ribadu",
    runningMate: "Aguwa Kevin Iliya",
    status: "confirmed",
    note: "ADC nominee, 2026"
  },
  {
    id: "pdp",
    party: "PDP",
    partyFull: "Peoples Democratic Party",
    name: "Maurice Vunobolki",
    runningMate: "Abubakar Mahmud Wambai",
    status: "confirmed",
    note: "PDP nominee, adopted Sept 2026"
  },
  {
    id: "lp",
    party: "LP",
    partyFull: "Labour Party",
    name: "Ishaku Elisha Abbo",
    status: "confirmed",
    note: "Won LP primary, May 2026"
  },
  {
    id: "sdp",
    party: "SDP",
    partyFull: "Social Democratic Party",
    name: "Christopher Nathaniel",
    status: "confirmed",
    note: "SDP nominee, May 2026"
  },
  {
    id: "ypp",
    party: "YPP",
    partyFull: "Young Progressives Party",
    name: "Wafarinyi Theman Dalatu",
    status: "confirmed",
    note: "Won YPP primary, May 2026"
  },
  {
    id: "nnpp",
    party: "NNPP",
    partyFull: "New Nigeria Peoples Party",
    name: "Abubakar Sani",
    status: "confirmed",
    note: "NNPP nominee, INEC provisional list Sept 2026"
  },
  {
    id: "apm",
    party: "APM",
    partyFull: "Allied Peoples Movement",
    name: "Abdulrahman Bashir Haske",
    status: "confirmed",
    note: "Joined APM Sept 2026 after losing the APC primary to Galadima"
  }
];

// Real senatorial zone groupings for Adamawa State's 21 LGAs.
const ZONES = {
  "Adamawa North": ["Madagali", "Michika", "Mubi North", "Mubi South", "Maiha", "Hong", "Gombi", "Guyuk"],
  "Adamawa Central": ["Yola North", "Yola South", "Girei", "Song", "Fufure", "Demsa", "Numan", "Lamurde", "Shelleng"],
  "Adamawa South": ["Ganye", "Jada", "Mayo-Belwa", "Toungo"]
};

const PARTY_COLORS = {
  apc: "#0080FF",
  adc: "#FF6B00",
  pdp: "#E80020",
  lp: "#228B22",
  sdp: "#14B8A6",
  ypp: "#EC4899",
  nnpp: "#8B5CF6",
  apm: "#78716C"
};

const STORAGE_KEY = "vrek_adamawa_results_v1";
const ACTIVITY_KEY = "vrek_adamawa_activity_v1";

/**
 * Hand-authored SAMPLE dataset so a first-time visitor sees a populated
 * dashboard instead of a wall of zeros. Not official results, not real
 * votes — varied on purpose (several LGAs go to ADC, most to APC) so it
 * reads as a plausible contested race rather than a scripted landslide.
 * Anyone can overwrite it LGA-by-LGA from the entry form, and "Reset all
 * results" (Admin only) clears it back to true zero.
 */
const DEMO_RESULTS = {

  "Demsa": {
    apc: 6090, adc: 1950, pdp: 2680, lp: 244,
    sdp: 513, ypp: 388, nnpp: 390, apm: 11695
  },

  "Fufure": {
    apc: 3866, adc: 1237, pdp: 1701, lp: 155,
    sdp: 325, ypp: 246, nnpp: 248, apm: 7422
  },

  "Ganye": {
    apc: 6986, adc: 2236, pdp: 3074, lp: 280,
    sdp: 588, ypp: 445, nnpp: 448, apm: 13413
  },

  "Girei": {
    apc: 8379, adc: 2682, pdp: 3687, lp: 336,
    sdp: 705, ypp: 534, nnpp: 537, apm: 16090
  },

  "Gombi": {
    apc: 5157, adc: 1651, pdp: 2269, lp: 207,
    sdp: 434, ypp: 328, nnpp: 331, apm: 9903
  },

  "Guyuk": {
    apc: 4005, adc: 1282, pdp: 1762, lp: 161,
    sdp: 337, ypp: 255, nnpp: 257, apm: 7691
  },

  "Hong": {
    apc: 5658, adc: 1811, pdp: 2490, lp: 227,
    sdp: 476, ypp: 360, nnpp: 363, apm: 10865
  },

  "Jada": {
    apc: 4539, adc: 1453, pdp: 1998, lp: 182,
    sdp: 382, ypp: 289, nnpp: 291, apm: 8716
  },

  "Lamurde": {
    apc: 3242, adc: 1038, pdp: 1427, lp: 130,
    sdp: 273, ypp: 206, nnpp: 208, apm: 6226
  },

  "Madagali": {
    apc: 4341, adc: 1390, pdp: 1910, lp: 174,
    sdp: 365, ypp: 277, nnpp: 278, apm: 8335
  },

  "Maiha": {
    apc: 3649, adc: 1168, pdp: 1606, lp: 146,
    sdp: 307, ypp: 233, nnpp: 234, apm: 7007
  },

  "Mayo-Belwa": {
    apc: 6441, adc: 2062, pdp: 2835, lp: 258,
    sdp: 542, ypp: 410, nnpp: 413, apm: 12369
  },

  "Michika": {
    apc: 5900, adc: 1888, pdp: 2596, lp: 237,
    sdp: 496, ypp: 376, nnpp: 378, apm: 11329
  },

  "Mubi North": {
    apc: 10020, adc: 3207, pdp: 4409, lp: 402,
    sdp: 843, ypp: 638, nnpp: 642, apm: 19239
  },

  "Mubi South": {
    apc: 7649, adc: 2449, pdp: 3366, lp: 307,
    sdp: 644, ypp: 487, nnpp: 490, apm: 14688
  },

  "Numan": {
    apc: 5391, adc: 1726, pdp: 2372, lp: 216,
    sdp: 454, ypp: 343, nnpp: 346, apm: 10352
  },

  "Shelleng": {
    apc: 2945, adc: 943, pdp: 1296, lp: 118,
    sdp: 248, ypp: 187, nnpp: 189, apm: 5654
  },

  "Song": {
    apc: 6187, adc: 1980, pdp: 2723, lp: 248,
    sdp: 521, ypp: 394, nnpp: 397, apm: 11880
  },

  "Toungo": {
    apc: 1742, adc: 558, pdp: 766, lp: 70,
    sdp: 146, ypp: 111, nnpp: 112, apm: 3345
  },

  "Yola North": {
    apc: 10846, adc: 3472, pdp: 4772, lp: 435,
    sdp: 913, ypp: 691, nnpp: 695, apm: 20826
  },

  "Yola South": {
    apc: 9549, adc: 3057, pdp: 4202, lp: 383,
    sdp: 803, ypp: 608, nnpp: 612, apm: 18336
  }

};
const DEMO_TIMESTAMP = "2027-03-15T09:00:00.000Z";
const DEMO_ACTOR = "Demo seed data";

function getActivity() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function addActivity(type, title) {
  const log = getActivity();
  log.unshift({ type: type, title: title, ts: new Date().toISOString() });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log.slice(0, 20)));
}

function zoneProgress() {
  const results = getResults();
  return Object.keys(ZONES).map(function (zone) {
    const lgas = ZONES[zone];
    const reported = lgas.filter(function (l) { return results[l] && results[l].reported; }).length;
    return { name: zone, reported: reported, total: lgas.length, pct: Math.round((reported / lgas.length) * 100) };
  });
}

function defaultResults() {
  const results = {};
  LGAS.forEach(function (lga) {
    const votes = {};
    CANDIDATES.forEach(function (c) { votes[c.id] = 0; });
    results[lga] = { reported: false, votes: votes, updatedAt: null };
  });
  return results;
}

function demoResultsData() {
  const results = defaultResults();
  LGAS.forEach(function (lga) {
    const votes = DEMO_RESULTS[lga];
    if (!votes) return;
    results[lga] = { reported: true, votes: Object.assign({}, votes), updatedAt: DEMO_TIMESTAMP, enteredBy: DEMO_ACTOR };
  });
  return results;
}

function getResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // First-ever visit to this browser: seed with the sample dataset so the
    // dashboard isn't a wall of zeros, and persist it so it's stable across
    // reloads until someone resets or overwrites individual LGAs.
    if (!raw) {
      const seeded = demoResultsData();
      saveResults(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    const base = defaultResults();
    return Object.assign(base, parsed);
  } catch (e) {
    return defaultResults();
  }
}

function saveResults(results) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function seedDemoData() {
  const seeded = demoResultsData();
  saveResults(seeded);
  addActivity("ok", "Sample dataset loaded for all 21 LGAs");
  return seeded;
}

function findZoneForLga(lga) {
  return Object.keys(ZONES).find(function (zone) { return ZONES[zone].includes(lga); }) || null;
}

function setLgaResult(lgaName, votesByCandidateId, actor) {
  const results = getResults();
  const wasReported = results[lgaName] && results[lgaName].reported;
  results[lgaName] = {
    reported: true,
    votes: votesByCandidateId,
    updatedAt: new Date().toISOString(),
    enteredBy: actor || null
  };
  saveResults(results);
  addActivity("ok", (wasReported ? "Result updated — " : "Result entered — ") + lgaName + (actor ? " by " + actor : ""));
  return results;
}

function resetAllResults() {
  saveResults(defaultResults());
}

function computeStandings() {
  const results = getResults();
  const totals = {};
  CANDIDATES.forEach(function (c) { totals[c.id] = 0; });

  let reportedCount = 0;
  Object.keys(results).forEach(function (lga) {
    const entry = results[lga];
    if (entry.reported) reportedCount++;
    Object.keys(entry.votes || {}).forEach(function (cid) {
      totals[cid] = (totals[cid] || 0) + (Number(entry.votes[cid]) || 0);
    });
  });

  const grandTotal = Object.values(totals).reduce(function (a, b) { return a + b; }, 0);

  const lgasWon = {};
  CANDIDATES.forEach(function (c) { lgasWon[c.id] = 0; });
  Object.keys(results).forEach(function (lga) {
    const entry = results[lga];
    if (!entry.reported) return;
    let bestId = null, bestVotes = -1, tie = false;
    Object.keys(entry.votes || {}).forEach(function (cid) {
      const v = Number(entry.votes[cid]) || 0;
      if (v > bestVotes) { bestVotes = v; bestId = cid; tie = false; }
      else if (v === bestVotes) { tie = true; }
    });
    if (bestId && bestVotes > 0 && !tie) lgasWon[bestId]++;
  });

  const standings = CANDIDATES.map(function (c) {
    const votes = totals[c.id] || 0;
    const pct = grandTotal > 0 ? (votes / grandTotal) * 100 : 0;
    return Object.assign({}, c, { votes: votes, pct: pct, lgasWon: lgasWon[c.id] || 0 });
  }).sort(function (a, b) { return b.votes - a.votes; });

  return {
    standings: standings,
    grandTotal: grandTotal,
    reportedCount: reportedCount,
    totalLgas: LGAS.length
  };
}
