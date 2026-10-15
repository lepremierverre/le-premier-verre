import { createClient } from "@sanity/client";
import { VIBE_PROFILES, validateVibeProfiles } from "../lib/vibes/profiles";
import {
  buildVibeCandidatePool,
  type VibeRecommendationWine,
} from "../lib/vibe-engine";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
});

const query = `*[
  _type == "wine" &&
  !(_id in path("drafts.**"))
]{
  _id,
  name,
  "slug": slug.current,
  beverageType,
  alcoholFree,
  alcohol,
  color,
  body,
  sweetness,
  roundness,
  acidity,
  tannins,
  fruitIntensity,
  minerality,
  intensity,
  complexity,
  oakInfluence,
  savory,
  dnaMetadata
}`;

type Winner = {
  wineId: string;
  wine: string;
  vibeId: string;
  vibe: string;
  adjusted: number;
  confidence: number;
  specificity: number;
  primaryScore: number;
  runnerUp?: string;
  runnerUpScore?: number;
  margin?: number;
  eligibleVibeCount: number;
};

type VibeResult = {
  id: string;
  title: string;
  specificity: number;
  eligibleWineIds: Set<string>;
  top4WineIds: string[];
};

async function main() {
const wines = await client.fetch<VibeRecommendationWine[]>(query);

console.log("\n==================================================");
console.log("LPV GLOBAL VIBE AUDIT");
console.log("==================================================");
console.log("WINES:", wines.length);
console.log("PROFILE INTEGRITY:", validateVibeProfiles(VIBE_PROFILES));

const vibeResults: VibeResult[] = [];
const eligibleByWine = new Map<
  string,
  Array<{
    vibeId: string;
    vibe: string;
    adjusted: number;
    confidence: number;
    specificity: number;
    primaryScore: number;
  }>
>();

const top4Frequency = new Map<
  string,
  { wine: string; count: number; vibes: string[] }
>();

for (const vibe of VIBE_PROFILES) {
  const pool = buildVibeCandidatePool(wines, vibe);

  const eligibleWineIds = new Set(
    pool.eligible.map((candidate) => candidate.wine._id)
  );

  const top4 = pool.eligible.slice(0, 4);

  vibeResults.push({
    id: vibe.id,
    title: vibe.title,
    specificity: vibe.specificity,
    eligibleWineIds,
    top4WineIds: top4.map((candidate) => candidate.wine._id),
  });

  for (const candidate of pool.eligible) {
    const specificity = vibe.specificity;
    const primaryScore = candidate.adjustedScore * specificity;

    const existing = eligibleByWine.get(candidate.wine._id) ?? [];

    existing.push({
      vibeId: vibe.id,
      vibe: vibe.title,
      adjusted: candidate.adjustedScore,
      confidence: candidate.confidence,
      specificity,
      primaryScore,
    });

    eligibleByWine.set(candidate.wine._id, existing);
  }

  for (const candidate of top4) {
    const current = top4Frequency.get(candidate.wine._id) ?? {
      wine: candidate.wine.name ?? candidate.wine._id,
      count: 0,
      vibes: [],
    };

    current.count += 1;
    current.vibes.push(vibe.title);

    top4Frequency.set(candidate.wine._id, current);
  }
}

const winners: Winner[] = [];
const noPrimary: Array<{ wineId: string; wine: string }> = [];

for (const wine of wines) {
  const candidates = [...(eligibleByWine.get(wine._id) ?? [])].sort(
    (a, b) =>
      b.primaryScore - a.primaryScore ||
      b.adjusted - a.adjusted ||
      b.confidence - a.confidence ||
      a.vibe.localeCompare(b.vibe, "fr")
  );

  if (candidates.length === 0) {
    noPrimary.push({
      wineId: wine._id,
      wine: wine.name ?? wine._id,
    });
    continue;
  }

  const winner = candidates[0];
  const runnerUp = candidates[1];

  winners.push({
    wineId: wine._id,
    wine: wine.name ?? wine._id,
    vibeId: winner.vibeId,
    vibe: winner.vibe,
    adjusted: winner.adjusted,
    confidence: winner.confidence,
    specificity: winner.specificity,
    primaryScore: winner.primaryScore,
    runnerUp: runnerUp?.vibe,
    runnerUpScore: runnerUp?.primaryScore,
    margin: runnerUp
      ? winner.primaryScore - runnerUp.primaryScore
      : undefined,
    eligibleVibeCount: candidates.length,
  });
}

// -----------------------------------------------------------------------------
// 1. Distribution des Primary Vibes
// -----------------------------------------------------------------------------

const primaryDistribution = new Map<string, number>();

for (const winner of winners) {
  primaryDistribution.set(
    winner.vibe,
    (primaryDistribution.get(winner.vibe) ?? 0) + 1
  );
}

const distributionRows = VIBE_PROFILES.map((vibe) => ({
  vibe: vibe.title,
  specificity: vibe.specificity,
  primaryWins: primaryDistribution.get(vibe.title) ?? 0,
})).sort(
  (a, b) =>
    b.primaryWins - a.primaryWins ||
    b.specificity - a.specificity ||
    a.vibe.localeCompare(b.vibe, "fr")
);

console.log("\n==================================================");
console.log("PRIMARY VIBE DISTRIBUTION");
console.log("==================================================");
console.table(distributionRows);

// -----------------------------------------------------------------------------
// 2. Vibes sans aucun Primary
// -----------------------------------------------------------------------------

const orphanVibes = distributionRows.filter((row) => row.primaryWins === 0);

console.log("\n==================================================");
console.log("VIBES WITH ZERO PRIMARY WIN");
console.log("==================================================");
console.table(orphanVibes);

// -----------------------------------------------------------------------------
// 3. Vins sans aucune vibe admissible
// -----------------------------------------------------------------------------

console.log("\n==================================================");
console.log("WINES WITH NO ELIGIBLE PRIMARY VIBE");
console.log("==================================================");
console.log("COUNT:", noPrimary.length);
console.table(noPrimary);

// -----------------------------------------------------------------------------
// 4. Nombre de vibes admissibles par vin
// -----------------------------------------------------------------------------

const eligibilityRows = wines
  .map((wine) => ({
    wine: wine.name ?? wine._id,
    eligibleVibes: eligibleByWine.get(wine._id)?.length ?? 0,
  }))
  .sort(
    (a, b) =>
      b.eligibleVibes - a.eligibleVibes ||
      a.wine.localeCompare(b.wine, "fr")
  );

console.log("\n==================================================");
console.log("MOST MULTI-ELIGIBLE WINES — TOP 20");
console.log("==================================================");
console.table(eligibilityRows.slice(0, 20));

console.log("\nELIGIBILITY SUMMARY:", {
  min: Math.min(...eligibilityRows.map((row) => row.eligibleVibes)),
  max: Math.max(...eligibilityRows.map((row) => row.eligibleVibes)),
  average:
    eligibilityRows.reduce((sum, row) => sum + row.eligibleVibes, 0) /
    eligibilityRows.length,
});

// -----------------------------------------------------------------------------
// 5. Marges Primary #1 vs #2
// -----------------------------------------------------------------------------

const marginRows = winners
  .filter((winner) => winner.margin !== undefined)
  .sort(
    (a, b) =>
      (a.margin ?? Infinity) - (b.margin ?? Infinity) ||
      a.wine.localeCompare(b.wine, "fr")
  );

console.log("\n==================================================");
console.log("LOWEST PRIMARY MARGINS — TOP 25");
console.log("==================================================");
console.table(
  marginRows.slice(0, 25).map((winner) => ({
    wine: winner.wine,
    primary: winner.vibe,
    score: Number(winner.primaryScore.toFixed(4)),
    runnerUp: winner.runnerUp,
    runnerUpScore:
      winner.runnerUpScore !== undefined
        ? Number(winner.runnerUpScore.toFixed(4))
        : null,
    margin:
      winner.margin !== undefined
        ? Number(winner.margin.toFixed(4))
        : null,
    eligibleVibes: winner.eligibleVibeCount,
  }))
);

const margins = marginRows
  .map((winner) => winner.margin)
  .filter((margin): margin is number => margin !== undefined);

console.log("\nMARGIN SUMMARY:", {
  under_0_005: margins.filter((margin) => margin < 0.005).length,
  under_0_01: margins.filter((margin) => margin < 0.01).length,
  under_0_02: margins.filter((margin) => margin < 0.02).length,
  average:
    margins.length > 0
      ? margins.reduce((sum, margin) => sum + margin, 0) / margins.length
      : null,
});

// -----------------------------------------------------------------------------
// 6. Fréquence dans les Top 4
// -----------------------------------------------------------------------------

const top4Rows = [...top4Frequency.values()]
  .sort(
    (a, b) =>
      b.count - a.count ||
      a.wine.localeCompare(b.wine, "fr")
  )
  .slice(0, 25)
  .map((entry) => ({
    wine: entry.wine,
    top4Count: entry.count,
    vibes: entry.vibes.join(" | "),
  }));

console.log("\n==================================================");
console.log("MOST FREQUENT WINES IN VIBE TOP 4 — TOP 25");
console.log("==================================================");
console.table(top4Rows);

// -----------------------------------------------------------------------------
// 7. Similarité entre vibes
// Jaccard = intersection / union des pools admissibles.
// Top4 overlap = nombre de vins communs dans les Top 4.
// -----------------------------------------------------------------------------

const similarityRows: Array<{
  vibeA: string;
  vibeB: string;
  eligibleA: number;
  eligibleB: number;
  intersection: number;
  union: number;
  jaccard: number;
  top4Overlap: number;
}> = [];

for (let i = 0; i < vibeResults.length; i++) {
  for (let j = i + 1; j < vibeResults.length; j++) {
    const a = vibeResults[i];
    const b = vibeResults[j];

    const intersection = [...a.eligibleWineIds].filter((id) =>
      b.eligibleWineIds.has(id)
    ).length;

    const union = new Set([
      ...a.eligibleWineIds,
      ...b.eligibleWineIds,
    ]).size;

    const top4Overlap = a.top4WineIds.filter((id) =>
      b.top4WineIds.includes(id)
    ).length;

    similarityRows.push({
      vibeA: a.title,
      vibeB: b.title,
      eligibleA: a.eligibleWineIds.size,
      eligibleB: b.eligibleWineIds.size,
      intersection,
      union,
      jaccard: union > 0 ? intersection / union : 0,
      top4Overlap,
    });
  }
}

similarityRows.sort(
  (a, b) =>
    b.jaccard - a.jaccard ||
    b.top4Overlap - a.top4Overlap ||
    a.vibeA.localeCompare(b.vibeA, "fr")
);

console.log("\n==================================================");
console.log("MOST SIMILAR VIBE PAIRS — TOP 30");
console.log("==================================================");
console.table(
  similarityRows.slice(0, 30).map((row) => ({
    vibeA: row.vibeA,
    vibeB: row.vibeB,
    eligibleA: row.eligibleA,
    eligibleB: row.eligibleB,
    intersection: row.intersection,
    jaccard: Number(row.jaccard.toFixed(3)),
    top4Overlap: row.top4Overlap,
  }))
);

console.log("\n==================================================");
console.log("HIGH-RISK DUPLICATE PAIRS");
console.log("Jaccard >= 0.80 OR Top4 overlap = 4");
console.log("==================================================");
console.table(
  similarityRows
    .filter((row) => row.jaccard >= 0.8 || row.top4Overlap === 4)
    .map((row) => ({
      vibeA: row.vibeA,
      vibeB: row.vibeB,
      eligibleA: row.eligibleA,
      eligibleB: row.eligibleB,
      intersection: row.intersection,
      jaccard: Number(row.jaccard.toFixed(3)),
      top4Overlap: row.top4Overlap,
    }))
);

// -----------------------------------------------------------------------------
// 8. Primary complet des 94 vins
// -----------------------------------------------------------------------------

console.log("\n==================================================");
console.log("PRIMARY VIBE — ALL WINES");
console.log("==================================================");
console.table(
  winners
    .sort((a, b) => a.wine.localeCompare(b.wine, "fr"))
    .map((winner) => ({
      wine: winner.wine,
      primary: winner.vibe,
      adjusted: Number(winner.adjusted.toFixed(3)),
      confidence: Number(winner.confidence.toFixed(3)),
      specificity: winner.specificity,
      primaryScore: Number(winner.primaryScore.toFixed(4)),
      runnerUp: winner.runnerUp ?? null,
      margin:
        winner.margin !== undefined
          ? Number(winner.margin.toFixed(4))
          : null,
      eligibleVibes: winner.eligibleVibeCount,
    }))
);

console.log("\n==================================================");
console.log("GLOBAL AUDIT COMPLETE");
console.log("==================================================");
console.log({
  wines: wines.length,
  vibes: VIBE_PROFILES.length,
  primaryAssigned: winners.length,
  noPrimary: noPrimary.length,
  orphanVibes: orphanVibes.length,
  highRiskDuplicatePairs: similarityRows.filter(
    (row) => row.jaccard >= 0.8 || row.top4Overlap === 4
  ).length,
});


}

main().catch((error) => {
  console.error("GLOBAL VIBE AUDIT FAILED");
  console.error(error);
  process.exit(1);
});
