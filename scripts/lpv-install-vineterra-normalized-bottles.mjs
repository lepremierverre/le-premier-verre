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
  console.log("\n===== VÉRIFICATION =====");

  const docs = await client.fetch(
    `*[_id in $ids]{
      _id,
      name,
      published,
      bottleImage,
      dnaMetadata
    }`,
    { ids: wines.map((w) => w.id) }
  );

  if (docs.length !== 5) {
    throw new Error(
      `${docs.length}/5 vins trouvés. Aucune modification effectuée.`
    );
  }

  for (const wine of wines) {
    const filePath = path.resolve(folder, wine.file);

    if (!fs.existsSync(filePath)) {
      throw new Error(
        `PNG introuvable : ${filePath}. Aucune modification effectuée.`
      );
    }

    const stat = fs.statSync(filePath);

    if (stat.size === 0) {
      throw new Error(`PNG vide : ${wine.file}`);
    }

    console.log(`✓ ${wine.file}`);
  }

  console.log("\n===== TÉLÉVERSEMENT =====");

  /*
    On téléverse d'abord les 5 assets.
    Aucun document vin n'est modifié pendant cette étape.
  */

  const uploaded = [];

  for (const wine of wines) {
    const filePath = path.resolve(folder, wine.file);
    const doc = docs.find((d) => d._id === wine.id);

    console.log(`Téléversement de ${doc.name}...`);

    const asset = await client.assets.upload(
      "image",
      fs.createReadStream(filePath),
      {
        filename: `vineterra-${wine.file}`,
        contentType: "image/png",
      }
    );

    uploaded.push({
      ...wine,
      name: doc.name,
      assetId: asset._id,
      oldAssetRef: doc.bottleImage?.asset?._ref ?? null,
    });

    console.log(`✓ ${asset._id}`);
  }

  console.log("\n===== REMPLACEMENT DES BOTTLEIMAGE =====");

  /*
    Transaction unique.
    On remplace UNIQUEMENT bottleImage.
  */

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

  console.log("✓ 5 bottleImage remplacés");

  console.log("\n===== CONTRÔLE FINAL =====");

  const result = await client.fetch(
    `*[_id in $ids] | order(name asc) {
      _id,
      name,
      published,

      "assetRef": bottleImage.asset._ref,
      "dimensions": bottleImage.asset->metadata.dimensions,
      "hasAlpha": bottleImage.asset->metadata.hasAlpha,

      "dnaDimensions": {
        "body": body,
        "sweetness": sweetness,
        "roundness": roundness,
        "acidity": acidity,
        "tannins": tannins,
        "fruitIntensity": fruitIntensity,
        "minerality": minerality,
        "intensity": intensity,
        "complexity": complexity,
        "oakInfluence": oakInfluence,
        "savory": savory
      },

      dnaMetadata
    }`,
    { ids: wines.map((w) => w.id) }
  );

  console.log(JSON.stringify(result, null, 2));

  const badImages = result.filter(
    (w) =>
      w.dimensions?.width !== 900 ||
      w.dimensions?.height !== 1260 ||
      w.hasAlpha !== true
  );

  if (badImages.length) {
    console.log(
      "\n⚠ Les documents ont été mis à jour, mais certains assets ne correspondent pas au standard attendu."
    );

    for (const wine of badImages) {
      console.log(
        `• ${wine.name} | ${wine.dimensions?.width}×${wine.dimensions?.height} | alpha ${wine.hasAlpha}`
      );
    }

    return;
  }

  console.log("\n✓ 5/5 PNG 900 × 1260");
  console.log("✓ 5/5 transparents");
  console.log("✓ bottleImage uniquement");
  console.log("✓ Wine DNA conservé");
  console.log("✓ DATA LPV conservée");
  console.log("✓ Aucun template modifié");
  console.log("✓ Aucun autre producteur modifié");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
