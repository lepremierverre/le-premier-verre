import { client } from "../sanity/lib/client";
import {
  buildVibeCandidatePool,
  type VibeRecommendationWine,
} from "../lib/vibe-engine";
import { AVANT_TOUT_LE_MONDE } from "../lib/vibes/profiles";

async function main() {
  const wines = await client.fetch<VibeRecommendationWine[]>(`
    *[
      _type == "wine" &&
      !(_id in path("drafts.**")) &&
      published == true
    ]{
      _id,
      name,
      "slug": slug.current,
      beverageType,
      alcoholFree,
      color,
      alcohol,
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
    }
  `);

  const pool = buildVibeCandidatePool(
    wines,
    AVANT_TOUT_LE_MONDE
  );

  console.log(`\nVIBE: ${AVANT_TOUT_LE_MONDE.title}`);
  console.log(`VINS PUBLIÉS: ${wines.length}`);
  console.log(
    `MEILLEUR SCORE FIABLE: ${pool.bestAdjustedScore}\n`
  );

  console.log("DIAGNOSTICS DU GATE");
  console.table([pool.diagnostics]);

  console.log("\nVINS ADMISSIBLES");
  console.table(
    pool.eligible.map((item, index) => ({
      vibeRank: index + 1,
      rawScoreRank: item.rank,
      wine: item.wine.name ?? item.wine._id,
      color: item.wine.color ?? "—",
      alcohol: item.wine.alcohol ?? "—",
      score: item.score,
      confidence: item.confidence,
      adjusted: item.adjustedScore,
      distanceFromBest: item.distanceFromBest,
    }))
  );

  console.log("\nVINS REJETÉS");
  console.table(
    pool.rejected.map((item) => ({
      rawScoreRank: item.rank,
      wine: item.wine.name ?? item.wine._id,
      color: item.wine.color ?? "—",
      adjusted: item.adjustedScore,
      confidence: item.confidence,
      reason: item.rejectionReason,
      distanceFromBest: item.distanceFromBest,
      missingRequired:
        item.missingRequiredDimensions.join(", ") || "—",
    }))
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
