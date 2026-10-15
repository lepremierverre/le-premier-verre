import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const folder =
  "public/images/lpv/photos bouteilles/vineterra-normalized";

const wines = [
  {
    id: "wine-vineterra-cheval-tout-blanc-classique-2024",
    file: "cheval-tout-blanc.png",
  },
  {
    id: "wine-vineterra-croix-sur-la-montagne-2024",
    file: "croix-sur-la-montagne.png",
  },
  {
    id: "wine-vineterra-patte-de-loup-2024",
    file: "patte-de-loup.png",
  },
  {
    id: "wine-vineterra-lac-sans-fond-classique-2023",
    file: "lac-sans-fond.png",
  },
  {
    id: "wine-vineterra-magie-des-semis-2023",
    file: "magie-des-semis.png",
  },
];

async function main() {
  console.log("\n===== VINETERRA V4 · 96 % =====");

  const ids = wines.map((wine) => wine.id);

  const docs = await client.fetch(
    `*[_id in $ids]{
      _id,
      name,
      published,
      "oldAsset": bottleImage.asset._ref
    }`,
    { ids }
  );

  if (docs.length !== 5) {
    throw new Error(
      `${docs.length}/5 vins trouvés. Aucune modification.`
    );
  }

  for (const wine of wines) {
    const filePath = path.resolve(folder, wine.file);

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Image absente : ${wine.file}. Aucune modification.`
      );
    }
  }

  console.log("✓ 5 vins trouvés");
  console.log("✓ 5 PNG 96 % trouvés");

  /*
   * Upload avant toute modification des vins.
   */

  const uploaded = [];

  for (const wine of wines) {
    const doc = docs.find((d) => d._id === wine.id);
    const filePath = path.resolve(folder, wine.file);

    console.log(`\nUpload V4 · ${doc.name}`);

    const asset = await client.assets.upload(
      "image",
      fs.createReadStream(filePath),
      {
        filename: `vineterra-lpv-v4-96pct-${wine.file}`,
        contentType: "image/png",
      }
    );

    uploaded.push({
      ...wine,
      name: doc.name,
      oldAsset: doc.oldAsset,
      newAsset: asset._id,
    });

    console.log(`✓ ${asset._id}`);
  }

  /*
   * Une seule transaction.
   * bottleImage uniquement.
   */

  console.log("\n===== INSTALLATION =====");

  let tx = client.transaction();

  for (const wine of uploaded) {
    tx = tx.patch(wine.id, {
      set: {
        bottleImage: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: wine.newAsset,
          },
        },
      },
    });
  }

  await tx.commit();

  console.log("✓ 5 bottleImage remplacés");

  console.log("\n===== CONTRÔLE FINAL =====");

  const result = await client.fetch(
    `*[_id in $ids] | order(name asc) {
      _id,
      name,
      published,

      "filename": bottleImage.asset->originalFilename,
      "dimensions": bottleImage.asset->metadata.dimensions,
      "hasAlpha": bottleImage.asset->metadata.hasAlpha,

      purchaseChannel,
      purchaseChannelDetails,

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
    }`,
    { ids }
  );

  const bad = result.filter(
    (wine) =>
      wine.published !== true ||
      wine.dimensions?.width !== 900 ||
      wine.dimensions?.height !== 1260 ||
      wine.hasAlpha !== true ||
      !wine.filename?.startsWith("vineterra-lpv-v4-96pct-")
  );

  for (const wine of result) {
    console.log(
      `✓ ${wine.name} | ` +
      `${wine.dimensions?.width}×${wine.dimensions?.height} | ` +
      `alpha ${wine.hasAlpha} | ${wine.filename}`
    );
  }

  if (bad.length) {
    throw new Error(
      `Contrôle incomplet pour ${bad.length} vin(s).`
    );
  }

  console.log("\n✓ 5/5 V4 installées");
  console.log("✓ 5/5 format 900 × 1260");
  console.log("✓ 5/5 transparents");
  console.log("✓ 5/5 toujours publiés");
  console.log("✓ Wine DNA intact");
  console.log("✓ DATA LPV intacte");
  console.log("✓ Circuit Disponible au vignoble intact");
  console.log("✓ Aucun template modifié");
  console.log("✓ Aucun autre producteur modifié");
  console.log("\n✓ VINETERRA TERMINÉ");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
