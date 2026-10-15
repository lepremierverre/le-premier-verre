import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const FOLDER = "public/images/lpv/photos bouteilles";

const MAP = [
  {
    id: "wine-les-pervenches-les-rosiers-2024",
    file: "rosiersnew.jpg",
  },
  {
    id: "wine-les-pervenches-lesperance-2025",
    file: "lesperancenew.jpg",
  },
  {
    id: "wine-les-pervenches-macpel-pgg-2024",
    file: "macpelnew.jpg",
  },
  {
    id: "wine-les-pervenches-pinot-zweigelt-2025",
    file: "pinotzweiglt.jpg",
  },
  {
    id: "wine-les-pervenches-pur-pinot-2025",
    file: "purpinotnew.jpg",
  },
  {
    id: "wine-les-pervenches-seyval-chardo-2025",
    file: "seyvalchardonew.jpg",
  },
];

console.log("\n===== LES PERVENCHES — EDITORIAL IMAGES =====");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

const plans = [];

for (const item of MAP) {
  const wine = await client.fetch(`
    *[_id == $id][0]{
      _id,
      name,
      published,
      bottleImage,
      editorialImage,
      "bottleFilename": bottleImage.asset->originalFilename,
      "editorialFilename": editorialImage.asset->originalFilename
    }
  `, { id: item.id });

  if (!wine) {
    throw new Error(`Vin introuvable : ${item.id}`);
  }

  const filepath = path.join(FOLDER, item.file);

  if (!fs.existsSync(filepath)) {
    throw new Error(`Photo introuvable : ${filepath}`);
  }

  console.log(`\n${wine.name}`);
  console.log("Bottle conservée :", wine.bottleFilename || "ABSENTE");
  console.log("Nouvelle éditoriale :", item.file);
  console.log(
    "Éditoriale actuelle :",
    wine.editorialFilename || "ABSENTE"
  );

  plans.push({
    wine,
    file: item.file,
    filepath,
  });
}

if (!WRITE) {
  console.log("\n✓ 6 VINS TROUVÉS");
  console.log("✓ 6 PHOTOS TROUVÉES");
  console.log("✓ BOTTLE IMAGES CONSERVÉES");
  console.log("✓ AUCUNE AUTRE DONNÉE NE SERA MODIFIÉE");
  console.log("\nSIMULATION TERMINÉE — aucune modification.");
  console.log(
    "Pour appliquer : node scripts/lpv-pervenches-editorial-images.mjs --write"
  );
  process.exit(0);
}

if (!client.config().token) {
  throw new Error("Token Sanity absent.");
}

for (const { wine, file, filepath } of plans) {
  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(filepath),
    {
      filename: `lpv-editorial-pervenches-${file}`,
      contentType: "image/jpeg",
    }
  );

  await client
    .patch(wine._id)
    .set({
      editorialImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
        alt: `${wine.name} · Les Pervenches`,
        credit: "Les Pervenches",
      },
    })
    .commit();

  console.log(`✓ ${wine.name} → ${file}`);
}

const check = await client.fetch(`
  *[_id in $ids] | order(name asc) {
    name,
    published,
    "bottle": bottleImage.asset->originalFilename,
    "editorial": editorialImage.asset->originalFilename
  }
`, {
  ids: MAP.map(x => x.id)
});

console.log("\n===== VÉRIFICATION FINALE =====");

for (const wine of check) {
  console.log(`\n✓ ${wine.name}`);
  console.log("  Bottle :", wine.bottle || "ABSENTE");
  console.log("  Editorial :", wine.editorial || "ABSENTE");
}

if (
  check.length !== 6 ||
  check.some(w => !w.editorial)
) {
  throw new Error("Vérification finale échouée.");
}

console.log("\n✓ LES 6 PERVENCHES SONT AU NOUVEAU FORMAT");
console.log("✓ LES ANCIENNES PHOTOS BOUTEILLES SONT CONSERVÉES");
