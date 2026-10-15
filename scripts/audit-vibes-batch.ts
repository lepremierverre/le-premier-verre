import { client } from "../sanity/lib/client";
import {
  buildVibeCandidatePool,
  type VibeRecommendationWine,
} from "../lib/vibe-engine";
import {
  VIBE_PROFILES,
  validateVibeProfiles,
} from "../lib/vibes/profiles";

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

  console.log(`\nVINS PUBLIÉS: ${wines.length}`);
  console.log("INTÉGRITÉ:", validateVibeProfiles(VIBE_PROFILES));

  for (const vibe of VIBE_PROFILES) {
    const pool = buildVibeCandidatePool(wines, vibe);

    const rejectionCounts = pool.rejected.reduce<Record<string, number>>(
      (acc, item) => {
        const reason = item.rejectionReason ?? "unknown";
        acc[reason] = (acc[reason] ?? 0) + 1;
        return acc;
      },
      {}
    );

    console.log("\n==================================================");
    console.log(vibe.title);
    console.log("ID:", vibe.id);
    console.log("BEST:", pool.bestAdjustedScore);
    console.log("ELIGIBLE:", pool.eligible.length);
    console.log("REJECTED:", pool.rejected.length);
    console.log("REJECTION REASONS:", rejectionCounts);

    console.table(
      pool.eligible.slice(0, 4).map((item, index) => ({
        rank: index + 1,
        wine: item.wine.name ?? item.wine._id,
        adjusted: item.adjustedScore,
        confidence: item.confidence,
      }))
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
