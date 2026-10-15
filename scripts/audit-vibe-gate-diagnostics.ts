import { createClient } from "@sanity/client";
import {
  VIBE_PROFILES,
  validateVibeProfiles,
} from "../lib/vibes/profiles";
import {
  buildVibeCandidatePool,
  type VibeRecommendationWine,
} from "../lib/vibe-engine";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    "2025-01-01",
  useCdn: false,
});

const query = `*[
  _type == "wine" &&
  !(_id in path("drafts.**"))
]{
  _id,
  name,
  "slug": slug.current,
  published,
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

async function main() {
  const wines =
    await client.fetch<VibeRecommendationWine[]>(query);

  console.log("\n========================================");
  console.log("LPV — VIBE GATE DIAGNOSTICS");
  console.log("========================================");
  console.log("Wines:", wines.length);
  console.log(
    "Profile integrity:",
    validateVibeProfiles(VIBE_PROFILES)
  );

  const rows: Array<Record<string, unknown>> = [];
  const orphanDetails: Array<Record<string, unknown>> = [];

  for (const vibe of VIBE_PROFILES) {
    const pool =
      buildVibeCandidatePool(wines, vibe);

    rows.push({
      vibe: vibe.title,
      total: pool.diagnostics.total,
      eligible: pool.diagnostics.eligible,
      color: pool.diagnostics.rejectedColor,
      context: pool.diagnostics.rejectedContext,
      requiredData:
        pool.diagnostics.rejectedRequiredData,
      confidence:
        pool.diagnostics.rejectedConfidence,
      absoluteScore:
        pool.diagnostics.rejectedAbsoluteScore,
      relativeScore:
        pool.diagnostics.rejectedRelativeScore,
    });

    if (pool.eligible.length === 0) {
      orphanDetails.push({
        vibe: vibe.title,
        total: pool.diagnostics.total,
        bestScore: pool.bestAdjustedScore,
        rejected: pool.rejected.length,
        topRejected: pool.candidates
          .slice(0, 3)
          .map((candidate) => ({
            wine:
              candidate.wine.name ??
              candidate.wine._id,
            score: candidate.adjustedScore,
            confidence: candidate.confidence,
            reason: candidate.rejectionReason,
            missing:
              candidate.missingRequiredDimensions,
            colorMatch: candidate.colorMatch,
            contextMatch: candidate.contextMatch,
          })),
      });
    }
  }

  console.log("\n--- ALL VIBE GATE COUNTS ---");
  console.table(rows);

  console.log("\n--- ZERO-ELIGIBLE VIBES ---");
  console.dir(orphanDetails, { depth: null });

  console.log("\n--- DATA COMPLETENESS ---");

  const dimensions = [
    "body",
    "sweetness",
    "roundness",
    "acidity",
    "tannins",
    "fruitIntensity",
    "minerality",
    "intensity",
    "complexity",
    "oakInfluence",
    "savory",
  ] as const;

  console.table(
    dimensions.map((dimension) => ({
      dimension,
      present: wines.filter(
        (wine) =>
          typeof wine[dimension] === "number"
      ).length,
      missing: wines.filter(
        (wine) =>
          typeof wine[dimension] !== "number"
      ).length,
    }))
  );

  console.log("\n--- SUMMARY ---");
  console.log({
    wines: wines.length,
    profiles: VIBE_PROFILES.length,
    zeroEligibleVibes:
      orphanDetails.length,
    eligiblePairs: rows.reduce(
      (sum, row) =>
        sum + Number(row.eligible ?? 0),
      0
    ),
  });
}

main().catch((error) => {
  console.error("VIBE GATE DIAGNOSTICS FAILED");
  console.error(error);
  process.exit(1);
});
