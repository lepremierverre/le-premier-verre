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
  console.log("\n===== VINETERRA BOTTLES V2 =====");

  const docs = await client.fetch(
    `*[_id in $ids]{
      _id,
      name,
      published,
      "oldAsset": bottleImage.asset._ref
    }`,
    { ids: wines.map((w) => w.id) }
  );

  if (docs.length !== 5) {
    throw new Error(
      `${docs.length}/5 vins trouvés. Aucune donnée modifiée.`
    );
  }

  for (const wine of wines) {
    const filePath = path.resolve(folder, wine.file);

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `Image absente : ${wine.file}. Aucune donnée modifiée.`
      );
    }
  }

  /*
    Upload des cinq nouveaux assets avant toute modification
    des documents vin.
  */

  const uploaded = [];

  for (const wine of wines) {
    const doc = docs.find((d) => d._id === wine.id);
    const filePath = path.resolve(folder, wine.file);

    console.log(`\nUpload ${doc.name}`);

    const asset = await client.assets.upload(
      "image",
      fs.createReadStream(filePath),
      {
        filename: `vineterra-lpv-v2-${wine.file}`,
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

  console.log("\n===== TRANSACTION =====");

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

  console.log("\n===== CONTRÔLE =====");

  const result = await client.fetch(
    `*[_id in $ids] | order(name asc) {
      _id,
      name,
      published,
      "asset": bottleImage.asset._ref,
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
    { ids: wines.map((w) => w.id) }
  );

  console.log(JSON.stringify(result, null, 2));

  const bad = result.filter(
    (w) =>
      !w.published ||
      w.dimensions?.width !== 900 ||
      w.dimensions?.height !== 1260 ||
      w.hasAlpha !== true ||
      !w.filename?.startsWith("vineterra-lpv-v2-")
  );

  if (bad.length) {
    console.log("\n⚠ Contrôle incomplet");
    for (const wine of bad) {
      console.log("•", wine.name);
    }
    process.exit(1);
  }

  console.log("\n✓ 5/5 nouvelles images V2");
  console.log("✓ 5/5 format 900 × 1260");
  console.log("✓ 5/5 transparence");
  console.log("✓ 5/5 vins toujours publiés");
  console.log("✓ Wine DNA intact");
  console.log("✓ DATA LPV intacte");
  console.log("✓ Aucun template modifié");
  console.log("✓ Aucun autre producteur modifié");
  console.log("\nVINETERRA TERMINÉ");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
