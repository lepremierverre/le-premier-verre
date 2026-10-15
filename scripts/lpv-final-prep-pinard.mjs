import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  console.log("\n========================================");
  console.log("1. TOUS LES CÉPAGES PERTINENTS");
  console.log("========================================\n");

  const grapes = await client.fetch(`
    *[_type == "grape"]{
      _id,
      name,
      "slug":slug.current
    } | order(name asc)
  `);

  const wanted = [
    "crescent",
    "itasca",
    "frontenac",
    "chardonnay",
    "riesling",
    "savagnin",
    "hibernal",
    "briana",
    "brianna",
    "pinot",
    "meunier",
    "seyval",
    "vidal",
    "marquette",
    "radisson",
    "petite perle"
  ];

  const relevant = grapes.filter(g => {
    const s = `${g.name || ""} ${g.slug || ""}`.toLowerCase();
    return wanted.some(x => s.includes(x));
  });

  console.dir(relevant, { depth: null });

  console.log("\n========================================");
  console.log("2. RÉGIONS QUÉBEC");
  console.log("========================================\n");

  const regions = await client.fetch(`
    *[
      _type == "region" &&
      (
        name match "*Estrie*" ||
        name match "*Cantons*" ||
        name match "*Lanaudière*"
      )
    ]{
      _id,
      name,
      "slug":slug.current
    }
  `);

  console.dir(regions, { depth: null });

  console.log("\n========================================");
  console.log("3. APPELLATIONS QUÉBEC");
  console.log("========================================\n");

  const appellations = await client.fetch(`
    *[
      _type == "appellation" &&
      (
        name match "*Québec*" ||
        name match "*Quebec*"
      )
    ]{
      _id,
      name,
      "slug":slug.current
    }
  `);

  console.dir(appellations, { depth: null });

  console.log("\n========================================");
  console.log("4. STRUCTURE PROFIL JOHN DOE");
  console.log("========================================\n");

  const john = await client.fetch(`
    *[_id == "wine-john-doe-2025"][0]{
      acidity,
      alcohol,
      body,
      complexity,
      fruitIntensity,
      intensity,
      isNatural,
      minerality,
      roundness,
      savory,
      sweetness,
      tannins,
      servingTemperature,
      decant,
      dnaMetadata
    }
  `);

  console.dir(john, { depth: null });

  console.log("\n========================================");
  console.log("5. CHAMPS DNA METADATA DU SCHÉMA");
  console.log("========================================\n");

  const schemaPath = "sanity/schemaTypes/wine.ts";
  const source = fs.readFileSync(schemaPath, "utf8");

  const start = source.indexOf('name: "dnaMetadata"');

  if (start >= 0) {
    console.log(
      source.slice(start, Math.min(source.length, start + 9500))
    );
  } else {
    console.log("⚠️ dnaMetadata introuvable");
  }

  console.log("\n========================================");
  console.log("6. PHOTOS PINARD ORIGINALES");
  console.log("========================================\n");

  const photos = [
    "janedoe.png",
    "frangine.png",
    "piscineblanche.png",
    "supernova.png",
  ];

  for (const photo of photos) {
    const path =
      `public/images/lpv/photos bouteilles/${photo}`;

    console.log(
      fs.existsSync(path) ? `✓ ${photo}` : `❌ ${photo}`
    );
  }

  console.log("\n✓ Aucun document Sanity modifié");
}

main().catch(err => {
  console.error("\n❌", err);
  process.exit(1);
});
