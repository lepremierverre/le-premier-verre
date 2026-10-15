import { client } from "../sanity/lib/client";
import {
  buildVibeCandidatePool,
  type VibeRecommendationWine,
} from "../lib/vibe-engine";
import {
  PISCINE_15H,
  IL_PLEUT_ROUGE,
  BELLE_BOUTEILLE,
  AVANT_TOUT_LE_MONDE,
} from "../lib/vibes/profiles";

const CALIBRATION_VIBES = [
  PISCINE_15H,
  IL_PLEUT_ROUGE,
  BELLE_BOUTEILLE,
  AVANT_TOUT_LE_MONDE,
];

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

  const pools = CALIBRATION_VIBES.map((vibe) => ({
    vibe,
    pool: buildVibeCandidatePool(wines, vibe),
  }));

  console.log(`\nVINS PUBLIÉS: ${wines.length}`);
  console.log("AUDIT — DIFFÉRENCIATION DES VIBES");

  console.log("\nTOP 4 PAR VIBE");

  for (const { vibe, pool } of pools) {
    console.log(`\n${vibe.title}`);

    console.table(
      pool.eligible.slice(0, 4).map((item, index) => ({
        rank: index + 1,
        wine: item.wine.name ?? item.wine._id,
        adjusted: item.adjustedScore,
        confidence: item.confidence,
      }))
    );
  }

  const piscine = pools.find(
    ({ vibe }) => vibe.id === PISCINE_15H.id
  );

  const avant = pools.find(
    ({ vibe }) => vibe.id === AVANT_TOUT_LE_MONDE.id
  );

  if (piscine && avant) {
    const piscineTop4 = piscine.pool.eligible.slice(0, 4);
    const avantTop4Ids = new Set(
      avant.pool.eligible
        .slice(0, 4)
        .map((item) => item.wine._id)
    );

    const sharedTop4 = piscineTop4.filter((item) =>
      avantTop4Ids.has(item.wine._id)
    );

    console.log(
      "\nDIAGNOSTIC DIMENSIONNEL — TOP 4 COMMUN PISCINE / AVANT"
    );

    for (const piscineItem of sharedTop4) {
      const avantItem = avant.pool.eligible.find(
        (item) => item.wine._id === piscineItem.wine._id
      );

      if (!avantItem) continue;

      console.log(
        `\nVIN: ${piscineItem.wine.name ?? piscineItem.wine._id}`
      );

      console.log("\nPiscine, 15 h");
      console.table(
        piscineItem.dimensions.map((dimension) => ({
          dimension: dimension.dimension,
          value: dimension.value ?? "missing",
          score: dimension.score ?? "missing",
          confidence: dimension.confidence,
          weight: dimension.weight,
          target: dimension.target ?? "",
          min: dimension.min ?? "",
          max: dimension.max ?? "",
          required: dimension.required,
        }))
      );

      console.log("\nJuste avant que tout le monde arrive");
      console.table(
        avantItem.dimensions.map((dimension) => ({
          dimension: dimension.dimension,
          value: dimension.value ?? "missing",
          score: dimension.score ?? "missing",
          confidence: dimension.confidence,
          weight: dimension.weight,
          target: dimension.target ?? "",
          min: dimension.min ?? "",
          max: dimension.max ?? "",
          required: dimension.required,
        }))
      );
    }
  }

  console.log("\nCHEVAUCHEMENT PAR PAIRE");

  const rows = [];

  for (let i = 0; i < pools.length; i += 1) {
    for (let j = i + 1; j < pools.length; j += 1) {
      const a = pools[i];
      const b = pools[j];

      const eligibleA = new Set(
        a.pool.eligible.map((item) => item.wine._id)
      );

      const eligibleB = new Set(
        b.pool.eligible.map((item) => item.wine._id)
      );

      const top4A = new Set(
        a.pool.eligible
          .slice(0, 4)
          .map((item) => item.wine._id)
      );

      const top4B = new Set(
        b.pool.eligible
          .slice(0, 4)
          .map((item) => item.wine._id)
      );

      const eligibleOverlap = [...eligibleA].filter(
        (id) => eligibleB.has(id)
      ).length;

      const top4Overlap = [...top4A].filter(
        (id) => top4B.has(id)
      ).length;

      rows.push({
        vibeA: a.vibe.title,
        vibeB: b.vibe.title,
        eligibleA: eligibleA.size,
        eligibleB: eligibleB.size,
        eligibleOverlap,
        top4Overlap,
      });
    }
  }

  console.table(rows);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
