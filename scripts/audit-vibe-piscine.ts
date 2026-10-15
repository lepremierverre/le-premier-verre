import { client } from "../sanity/lib/client";
import {
  scoreVibeCompatibility,
  type VibeRecommendationWine,
} from "../lib/vibe-engine";
import { PISCINE_15H } from "../lib/vibes/profiles";

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

const results = wines
  .map((wine) => ({
    wine,
    result: scoreVibeCompatibility(
      wine,
      PISCINE_15H
    ),
  }))
  .sort((a, b) => {
    if (
      b.result.adjustedScore !==
      a.result.adjustedScore
    ) {
      return (
        b.result.adjustedScore -
        a.result.adjustedScore
      );
    }

    if (
      b.result.confidence !==
      a.result.confidence
    ) {
      return (
        b.result.confidence -
        a.result.confidence
      );
    }

    return (a.wine.name ?? "").localeCompare(
      b.wine.name ?? "",
      "fr"
    );
  });

console.log(
  `\nVIBE: ${PISCINE_15H.title}`
);
console.log(
  `VINS PUBLIÉS: ${wines.length}\n`
);

console.table(
  results.map(({ wine, result }, index) => ({
    rank: index + 1,
    wine: wine.name,
    color: wine.color ?? "—",
    alcohol: wine.alcohol ?? "—",
    score: result.score,
    confidence: result.confidence,
    adjusted: result.adjustedScore,
    colorMatch: result.colorMatch,
    contextMatch: result.contextMatch,
    missingRequired:
      result.missingRequiredDimensions.join(", ") ||
      "—",
  }))
);

console.log("\nTOP 15 — DÉTAIL DES DIMENSIONS\n");

for (const { wine, result } of results.slice(0, 15)) {
  console.log(
    `\n# ${wine.name} — adjusted ${result.adjustedScore} / confidence ${result.confidence}`
  );

  console.table(
    result.dimensions.map((dimension) => ({
      dimension: dimension.dimension,
      value: dimension.value ?? "—",
      score: dimension.score ?? "—",
      confidence: dimension.confidence,
      weight: dimension.weight,
      target: dimension.target ?? "—",
      tolerance: dimension.tolerance ?? "—",
      min: dimension.min ?? "—",
      max: dimension.max ?? "—",
      required: dimension.required,
    }))
  );
}

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
