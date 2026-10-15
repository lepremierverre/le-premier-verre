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
  "public/images/lpv/photos bouteilles/bauge-normalized";

const wines = [
  {
    id: "wine-bauge-les-beaux-jus-le-blanc",
    file: "le-blanc.png",
  },
  {
    id: "wine-bauge-les-beaux-jus-le-rouge",
    file: "le-rouge.png",
  },
  {
    id: "wine-bauge-la-renversante",
    file: "la-renversante.png",
  },
  {
    id: "wine-bauge-trois-frontenacs",
    file: "trois-frontenacs.png",
  },
  {
    id: "wine-bauge-vidal-sassume",
    file: "vidal-sassume.png",
  },
];

async function main() {
  const docs = await client.fetch(
    `*[_id in $ids]{
      _id,
      name,
      bottleImage,
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
    { ids: wines.map(w => w.id) }
  );

  if (docs.length !== 5) {
    throw new Error(
      `${docs.length}/5 vins trouvés. Aucun remplacement effectué.`
    );
  }

  for (const wine of wines) {
    const filePath = path.resolve(folder, wine.file);

    if (!fs.existsSync(filePath)) {
      throw new Error(`PNG absent : ${wine.file}`);
    }
  }

  const uploaded = [];

  for (const wine of wines) {
    const filePath = path.resolve(folder, wine.file);
    const doc = docs.find(d => d._id === wine.id);

    console.log(`Téléversement de ${doc.name}...`);

    const asset = await client.assets.upload(
      "image",
      fs.createReadStream(filePath),
      {
        filename: `bauge-${wine.file}`,
        contentType: "image/png",
      }
    );

    uploaded.push({
      id: wine.id,
      assetId: asset._id,
    });
  }

  let tx = client.transaction();

  for (const wine of uploaded) {
    tx = tx.patch(wine.id, {
      set: {
        bottleImage: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: wine.assetId,
          },
        },
      },
    });
  }

  await tx.commit();

  const result = await client.fetch(
    `*[_id in $ids] | order(name asc){
      name,
      "dimensions": bottleImage.asset->metadata.dimensions,
      "hasAlpha": bottleImage.asset->metadata.hasAlpha,
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
      savory
    }`,
    { ids: wines.map(w => w.id) }
  );

  console.log(JSON.stringify(result, null, 2));

  const bad = result.filter(
    w =>
      w.dimensions?.width !== 900 ||
      w.dimensions?.height !== 1260 ||
      w.hasAlpha !== true
  );

  if (bad.length) {
    throw new Error(
      `${bad.length} image(s) ne respectent pas le standard LPV`
    );
  }

  console.log("\n✓ 5/5 bouteilles La Bauge");
  console.log("✓ 900 × 1260");
  console.log("✓ transparence confirmée");
  console.log("✓ DATA LPV conservée");
  console.log("✓ seul bottleImage a été remplacé");
}

main().catch(error => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
