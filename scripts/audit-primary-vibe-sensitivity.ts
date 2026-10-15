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

type EligibleCandidate = {
  wineId: string;
  wine: string;
  vibeId: string;
  vibe: string;
  adjustedScore: number;
  confidence: number;
  rankInVibe: number;
  eligibleCountInVibe: number;
  percentile: number;
  primaryScore: number;
};

type PrimaryResult = EligibleCandidate & {
  runnerUp?: EligibleCandidate;
  margin?: number;
  eligibleVibeCount: number;
};

function round(value: number, digits = 4) {
  return Number(value.toFixed(digits));
}

/**
 * Percentile relatif au sein des vins admissibles à une vibe.
 *
 * #1 = 1
 * dernier = 0
 *
 * Cas d'une vibe avec un seul vin admissible : 1.
 */
function calculatePercentile(
  rank: number,
  eligibleCount: number
) {
  if (eligibleCount <= 1) return 1;

  return 1 - (rank - 1) / (eligibleCount - 1);
}

/**
 * PRIMARY VIBE V2 — FORMULE D'AUDIT
 *
 * Le Gate reste souverain : seuls les candidats admissibles
 * peuvent participer.
 *
 * 80 % compatibilité absolue
 * 15 % distinctivité relative dans la vibe
 *  5 % confiance des données
 *
 * Important :
 * - aucune quota de distribution;
 * - aucune récompense directe pour une vibe rare;
 * - aucune association wine -> vibe codée en dur;
 * - le percentile sert à départager des compatibilités déjà bonnes.
 *
 * Cette formule est expérimentale et n'est PAS encore
 * la formule de production.
 */
function calculatePrimaryScore({
  adjustedScore,
  percentile,
  confidence,
}: {
  adjustedScore: number;
  percentile: number;
  confidence: number;
}) {
  return (
    adjustedScore * 0.9 +
    percentile * 0.05 +
    confidence * 0.05
  );
}

async function main() {
  const wines =
    await client.fetch<VibeRecommendationWine[]>(query);

  console.log("\n==================================================");
  console.log("LPV PRIMARY VIBE SENSITIVITY — 90/5/5");
  console.log("==================================================");
  console.log("WINES:", wines.length);
  console.log(
    "PROFILE INTEGRITY:",
    validateVibeProfiles(VIBE_PROFILES)
  );

  const candidatesByWine = new Map<
    string,
    EligibleCandidate[]
  >();

  const top4Frequency = new Map<
    string,
    {
      wine: string;
      count: number;
      vibes: string[];
    }
  >();

  for (const vibe of VIBE_PROFILES) {
    const pool =
      buildVibeCandidatePool(wines, vibe);

    const eligibleCount = pool.eligible.length;

    pool.eligible.forEach((candidate, index) => {
      const rankInVibe = index + 1;

      const percentile =
        calculatePercentile(
          rankInVibe,
          eligibleCount
        );

      const primaryScore =
        calculatePrimaryScore({
          adjustedScore:
            candidate.adjustedScore,
          percentile,
          confidence:
            candidate.confidence,
        });

      const entry: EligibleCandidate = {
        wineId: candidate.wine._id,
        wine:
          candidate.wine.name ??
          candidate.wine._id,
        vibeId: vibe.id,
        vibe: vibe.title,
        adjustedScore:
          candidate.adjustedScore,
        confidence:
          candidate.confidence,
        rankInVibe,
        eligibleCountInVibe:
          eligibleCount,
        percentile,
        primaryScore,
      };

      const existing =
        candidatesByWine.get(
          candidate.wine._id
        ) ?? [];

      existing.push(entry);

      candidatesByWine.set(
        candidate.wine._id,
        existing
      );
    });

    for (
      const candidate of
      pool.eligible.slice(0, 4)
    ) {
      const current =
        top4Frequency.get(
          candidate.wine._id
        ) ?? {
          wine:
            candidate.wine.name ??
            candidate.wine._id,
          count: 0,
          vibes: [],
        };

      current.count += 1;
      current.vibes.push(vibe.title);

      top4Frequency.set(
        candidate.wine._id,
        current
      );
    }
  }

  const results: PrimaryResult[] = [];
  const noPrimary: Array<{
    wineId: string;
    wine: string;
  }> = [];

  for (const wine of wines) {
    const candidates = [
      ...(candidatesByWine.get(
        wine._id
      ) ?? []),
    ].sort(
      (a, b) =>
        b.primaryScore -
          a.primaryScore ||
        b.adjustedScore -
          a.adjustedScore ||
        b.percentile -
          a.percentile ||
        b.confidence -
          a.confidence ||
        a.vibeId.localeCompare(
          b.vibeId
        )
    );

    if (candidates.length === 0) {
      noPrimary.push({
        wineId: wine._id,
        wine:
          wine.name ??
          wine._id,
      });
      continue;
    }

    const winner = candidates[0];
    const runnerUp = candidates[1];

    results.push({
      ...winner,
      runnerUp,
      margin: runnerUp
        ? winner.primaryScore -
          runnerUp.primaryScore
        : undefined,
      eligibleVibeCount:
        candidates.length,
    });
  }

  // --------------------------------------------------
  // DISTRIBUTION
  // --------------------------------------------------

  const distribution =
    new Map<string, number>();

  for (const result of results) {
    distribution.set(
      result.vibe,
      (distribution.get(
        result.vibe
      ) ?? 0) + 1
    );
  }

  const distributionRows =
    VIBE_PROFILES.map((vibe) => ({
      vibe: vibe.title,
      primaryWins:
        distribution.get(
          vibe.title
        ) ?? 0,
    })).sort(
      (a, b) =>
        b.primaryWins -
          a.primaryWins ||
        a.vibe.localeCompare(
          b.vibe,
          "fr"
        )
    );

  console.log("\n==================================================");
  console.log("PRIMARY V2 DISTRIBUTION");
  console.log("==================================================");
  console.table(distributionRows);

  const orphanVibes =
    distributionRows.filter(
      (row) =>
        row.primaryWins === 0
    );

  console.log("\n==================================================");
  console.log("VIBES WITH ZERO PRIMARY V2");
  console.log("==================================================");
  console.log(
    "COUNT:",
    orphanVibes.length
  );
  console.table(orphanVibes);

  // --------------------------------------------------
  // MARGES
  // --------------------------------------------------

  const withMargins =
    results
      .filter(
        (
          result
        ): result is PrimaryResult & {
          margin: number;
          runnerUp: EligibleCandidate;
        } =>
          result.margin !==
            undefined &&
          result.runnerUp !==
            undefined
      )
      .sort(
        (a, b) =>
          a.margin -
            b.margin ||
          a.wine.localeCompare(
            b.wine,
            "fr"
          )
      );

  const margins =
    withMargins.map(
      (result) =>
        result.margin
    );

  console.log("\n==================================================");
  console.log("LOWEST V2 MARGINS — TOP 30");
  console.log("==================================================");

  console.table(
    withMargins
      .slice(0, 30)
      .map((result) => ({
        wine: result.wine,
        primary: result.vibe,
        primaryScore:
          round(
            result.primaryScore
          ),
        primaryRank:
          `${result.rankInVibe}/${result.eligibleCountInVibe}`,
        primaryPercentile:
          round(
            result.percentile,
            3
          ),
        runnerUp:
          result.runnerUp.vibe,
        runnerUpScore:
          round(
            result.runnerUp
              .primaryScore
          ),
        runnerUpRank:
          `${result.runnerUp.rankInVibe}/${result.runnerUp.eligibleCountInVibe}`,
        margin:
          round(
            result.margin
          ),
        eligibleVibes:
          result.eligibleVibeCount,
      }))
  );

  console.log("\nMARGIN SUMMARY:", {
    under_0_005:
      margins.filter(
        (margin) =>
          margin < 0.005
      ).length,
    under_0_01:
      margins.filter(
        (margin) =>
          margin < 0.01
      ).length,
    under_0_02:
      margins.filter(
        (margin) =>
          margin < 0.02
      ).length,
    average:
      margins.length
        ? margins.reduce(
            (sum, margin) =>
              sum + margin,
            0
          ) / margins.length
        : null,
  });

  // --------------------------------------------------
  // PRIMARY COMPLET
  // --------------------------------------------------


  // --------------------------------------------------
  // PRIMARY / RUNNER-UP COLLISIONS
  // --------------------------------------------------

  const collisionMap = new Map<
    string,
    {
      vibeA: string;
      vibeB: string;
      count: number;
      totalMargin: number;
      wines: string[];
    }
  >();

  for (const result of withMargins) {
    const names = [
      result.vibe,
      result.runnerUp.vibe,
    ].sort((a, b) =>
      a.localeCompare(b, "fr")
    );

    const key = names.join("|||");

    const current =
      collisionMap.get(key) ?? {
        vibeA: names[0],
        vibeB: names[1],
        count: 0,
        totalMargin: 0,
        wines: [],
      };

    current.count += 1;
    current.totalMargin += result.margin;
    current.wines.push(result.wine);

    collisionMap.set(key, current);
  }

  const collisionRows =
    [...collisionMap.values()]
      .map((item) => ({
        vibeA: item.vibeA,
        vibeB: item.vibeB,
        collisions: item.count,
        averageMargin:
          item.totalMargin /
          item.count,
        wines: item.wines.join(" | "),
      }))
      .sort(
        (a, b) =>
          b.collisions -
            a.collisions ||
          a.averageMargin -
            b.averageMargin
      );

  console.log("\n==================================================");
  console.log("PRIMARY / RUNNER-UP COLLISIONS");
  console.log("==================================================");

  console.table(
    collisionRows
      .slice(0, 30)
      .map((item) => ({
        vibeA: item.vibeA,
        vibeB: item.vibeB,
        collisions:
          item.collisions,
        averageMargin:
          round(
            item.averageMargin
          ),
        wines: item.wines,
      }))
  );

  console.log("\n==================================================");
  console.log("PRIMARY VIBE V2 — ALL WINES");
  console.log("==================================================");

  console.table(
    [...results]
      .sort((a, b) =>
        a.wine.localeCompare(
          b.wine,
          "fr"
        )
      )
      .map((result) => ({
        wine: result.wine,
        primary: result.vibe,
        compatibility:
          round(
            result.adjustedScore,
            3
          ),
        confidence:
          round(
            result.confidence,
            3
          ),
        rank:
          `${result.rankInVibe}/${result.eligibleCountInVibe}`,
        percentile:
          round(
            result.percentile,
            3
          ),
        primaryScore:
          round(
            result.primaryScore
          ),
        runnerUp:
          result.runnerUp?.vibe ??
          null,
        margin:
          result.margin !==
          undefined
            ? round(
                result.margin
              )
            : null,
        eligibleVibes:
          result.eligibleVibeCount,
      }))
  );

  // --------------------------------------------------
  // TOP 4 DOMINATION
  // --------------------------------------------------

  console.log("\n==================================================");
  console.log("MOST FREQUENT WINES IN TOP 4");
  console.log("==================================================");

  console.table(
    [...top4Frequency.values()]
      .sort(
        (a, b) =>
          b.count -
            a.count ||
          a.wine.localeCompare(
            b.wine,
            "fr"
          )
      )
      .slice(0, 20)
      .map((entry) => ({
        wine: entry.wine,
        top4Count:
          entry.count,
      }))
  );

  console.log("\n==================================================");
  console.log("WINES WITH NO PRIMARY V2");
  console.log("==================================================");
  console.table(noPrimary);

  console.log("\n==================================================");
  console.log("PRIMARY VIBE V2 AUDIT COMPLETE");
  console.log("==================================================");

  console.log({
    wines: wines.length,
    vibes: VIBE_PROFILES.length,
    primaryAssigned:
      results.length,
    noPrimary:
      noPrimary.length,
    orphanVibes:
      orphanVibes.length,
    marginUnder005:
      margins.filter(
        (margin) =>
          margin < 0.005
      ).length,
    marginUnder01:
      margins.filter(
        (margin) =>
          margin < 0.01
      ).length,
    marginUnder02:
      margins.filter(
        (margin) =>
          margin < 0.02
      ).length,
  });
}

main().catch((error) => {
  console.error(
    "PRIMARY VIBE V2 AUDIT FAILED"
  );
  console.error(error);
  process.exit(1);
});
