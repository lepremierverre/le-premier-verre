import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function main() {
  console.log("\n===== LES BACCHANTES · PRODUCTEUR =====");

  const producers = await client.fetch(`
    *[
      _type == "producer" &&
      (
        name match "*Bacchantes*" ||
        slug.current match "*bacchantes*"
      )
    ]{
      _id,
      name,
      "slug": slug.current,

      municipality,
      address,
      phone,
      email,
      website,
      instagram,
      facebook,

      "country": country->{_id,name,"slug":slug.current},
      "region": region->{_id,name,"slug":slug.current},

      foundedYear,
      openToVisitors,
      reservationRequired,

      lpvPartner,
      published,

      oneLiner,
      oneLinerEn,
      shortBio,
      shortBioEn,
      bio,
      bioEn,

      approach,
      approachEn,

      whyWeFollow,
      whyWeFollowEn,

      visitDetails,
      visitDetailsEn,

      "signatureGrapes": signatureGrapes[]->{
        _id,
        name,
        "slug": slug.current
      },

      mediaPermissionStatus,
      mediaCredit,
      mediaPermissionDate,
      mediaPermissionNote,

      "photoAsset": photo.asset._ref,
      "heroAsset": heroImage.asset._ref,
      "heroDimensions": heroImage.asset->metadata.dimensions,
      "heroHasAlpha": heroImage.asset->metadata.hasAlpha,

      "secondaryAsset": secondaryImage.asset._ref,
      "secondaryDimensions": secondaryImage.asset->metadata.dimensions,
      secondaryImageCredit
    }
  `);

  console.log(JSON.stringify(producers, null, 2));

  console.log("\n===== LES BACCHANTES · VINS =====");

  const wines = await client.fetch(`
    *[
      _type == "wine" &&
      (
        producer->name match "*Bacchantes*" ||
        producer->slug.current match "*bacchantes*"
      )
    ] | order(published desc, vintage desc, name asc) {
      _id,
      name,
      "slug": slug.current,
      vintage,
      color,
      published,

      "producerId": producer._ref,
      "producer": producer->name,

      "country": country->name,
      "region": region->name,
      "appellation": appellation->name,
      "appellationId": appellation._ref,

      "grapes": grapes[]->name,

      approxPrice,
      purchaseChannel,
      purchaseChannelDetails,
      purchaseUrl,
      purchaseLastChecked,

      "hasImage": defined(bottleImage.asset._ref),
      "assetRef": bottleImage.asset._ref,
      "assetFilename": bottleImage.asset->originalFilename,
      "dimensions": bottleImage.asset->metadata.dimensions,
      "hasAlpha": bottleImage.asset->metadata.hasAlpha,

      oneLiner,
      oneLinerEn,
      tastingKeywords,
      tastingKeywordsEn,
      perfectFor,
      perfectForEn,
      whyWeRecommend,
      whyWeRecommendEn,

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

  console.log(JSON.stringify(wines, null, 2));

  console.log("\n===== RÉSUMÉ =====");

  console.log("Producteur trouvé :", producers.length);
  console.log("Vins trouvés :", wines.length);
  console.log(
    "Vins publiés :",
    wines.filter((wine) => wine.published === true).length
  );
  console.log(
    "Vins avec photo :",
    wines.filter((wine) => wine.hasImage).length
  );
  console.log(
    "Vins avec Wine DNA complet :",
    wines.filter((wine) =>
      [
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
      ].every((field) => typeof wine[field] === "number")
    ).length
  );

  console.log("\n✓ AUDIT SANITY TERMINÉ");
  console.log("✓ Aucune donnée modifiée");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
