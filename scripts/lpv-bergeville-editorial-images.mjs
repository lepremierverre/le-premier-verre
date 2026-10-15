import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("STOP — aucun token Sanity d’écriture. Aucun changement effectué.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const wines = [
  {
    id: "wine-domaine-bergeville-amourette-2025",
    name: "Amourette",
    file: "public/images/lpv/photos bouteilles/amourettenew.jpg",
  },
  {
    id: "wine-domaine-bergeville-colfo-2025",
    name: "Colfo",
    file: "public/images/lpv/photos bouteilles/colfonew.jpg",
  },
  {
    id: "wine-domaine-bergeville-le-soleil-s-en-est-mele-2025",
    name: "Le soleil s’en est mêlé",
    file: "public/images/lpv/photos bouteilles/soleilsenestmelenew.jpg",
  },
  {
    id: "wine-domaine-bergeville-plus-petit-que-2025",
    name: "Plus Petit Que",
    file: "public/images/lpv/photos bouteilles/pluspetitquenew.jpg",
  },
];

for (const wine of wines) {
  if (!fs.existsSync(wine.file)) {
    console.error(`STOP — image introuvable pour ${wine.name} : ${wine.file}`);
    console.error("Aucun changement effectué.");
    process.exit(1);
  }
}

const existing = await client.fetch(
  `*[_id in $ids]{
    _id,
    name,
    published,
    bottleImage,
    editorialImage
  }`,
  { ids: wines.map((wine) => wine.id) }
);

if (existing.length !== wines.length) {
  console.error("STOP — les 4 vins n’ont pas tous été retrouvés dans Sanity.");
  console.error("Aucun changement effectué.");
  console.dir(existing, { depth: null });
  process.exit(1);
}

console.log("\n===== AVANT =====");

for (const wine of wines) {
  const doc = existing.find((item) => item._id === wine.id);

  console.log(`\n${wine.name}`);
  console.log("published :", doc?.published);
  console.log(
    "bottleImage :",
    doc?.bottleImage?.asset?._ref || "ABSENTE"
  );
  console.log(
    "editorialImage :",
    doc?.editorialImage?.asset?._ref || "ABSENTE"
  );
}

console.log("\n===== TÉLÉVERSEMENT =====");

const uploaded = [];

for (const wine of wines) {
  console.log(`Téléversement — ${wine.name}...`);

  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(wine.file),
    {
      filename: wine.file.split("/").pop(),
    }
  );

  if (!asset?._id) {
    console.error(`STOP — échec du téléversement pour ${wine.name}.`);
    process.exit(1);
  }

  uploaded.push({
    ...wine,
    assetId: asset._id,
  });

  console.log(`✓ ${wine.name} — ${asset._id}`);
}

console.log("\n===== MISE À JOUR SANITY =====");

let tx = client.transaction();

for (const wine of uploaded) {
  tx = tx.patch(wine.id, (patch) =>
    patch.set({
      editorialImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: wine.assetId,
        },
        alt: `${wine.name} du Domaine Bergeville`,
        credit: "Domaine Bergeville",
      },
    })
  );
}

await tx.commit();

const after = await client.fetch(
  `*[_id in $ids]{
    _id,
    name,
    published,
    bottleImage,
    editorialImage
  } | order(name asc)`,
  { ids: wines.map((wine) => wine.id) }
);

console.log("\n===== APRÈS =====");

for (const wine of after) {
  console.log(`\n${wine.name}`);
  console.log("published :", wine.published);
  console.log(
    "bottleImage conservée :",
    wine.bottleImage?.asset?._ref || "ABSENTE"
  );
  console.log(
    "editorialImage :",
    wine.editorialImage?.asset?._ref || "ABSENTE"
  );
  console.log("alt :", wine.editorialImage?.alt || "ABSENT");
  console.log("crédit :", wine.editorialImage?.credit || "ABSENT");
}

const success = after.every(
  (wine) => wine.published === true && wine.editorialImage?.asset?._ref
);

if (!success) {
  console.error("\nATTENTION — vérification finale incomplète.");
  process.exit(1);
}

console.log("\nOK — BERGEVILLE PHOTOS");
console.log("✓ Amourette");
console.log("✓ Colfo");
console.log("✓ Le soleil s’en est mêlé");
console.log("✓ Plus Petit Que");
console.log("✓ anciennes bottleImage conservées");
console.log("✓ nouvelles fiches LPV activées FR + EN");
