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

const folder = "public/images/lpv/photos bouteilles";

const wines = [
  {
    name: "Croix sur la montagne",
    slug: "vineterra-croix-sur-la-montagne-2024",
    vintage: 2024,
    color: "white",
    grapes: ["Chardonnay", "Vidal"],
    filename: "DSC08091-Edit-Edit-Edit.JPEG",
  },
  {
    name: "Patte de loup",
    slug: "vineterra-patte-de-loup-2024",
    vintage: 2024,
    color: "rose",
    grapes: [],
    filename: "DSC08032-Edit-Edit.JPEG",
  },
  {
    name: "Magie des semis",
    slug: "vineterra-magie-des-semis-2023",
    vintage: 2023,
    color: "white",
    grapes: ["Chardonnay"],
    filename: "DSC08049-Edit-Edit.JPEG",
  },
  {
    name: "Lac sans fond classique",
    slug: "vineterra-lac-sans-fond-classique-2023",
    vintage: 2023,
    color: "red",
    grapes: [],
    filename: "DSC07992-Edit-Edit-Edit-Edit.JPEG",
  },
  {
    name: "Cheval tout-blanc classique",
    slug: "vineterra-cheval-tout-blanc-classique-2024",
    vintage: 2024,
    color: "white",
    grapes: [],
    filename: "DSC08069-Edit-Edit.JPEG",
  },
];

const normalize = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

async function main() {
  console.log("\n===== 1. VÉRIFICATION DES PHOTOS =====");

  const missing = wines.filter(
    (wine) => !fs.existsSync(path.join(folder, wine.filename))
  );

  if (missing.length) {
    console.error("\nPhotos manquantes dans :", folder);

    missing.forEach((wine) =>
      console.error(" •", wine.filename)
    );

    throw new Error(
      "Importation annulée. Place les cinq photos dans le dossier indiqué."
    );
  }

  wines.forEach((wine) =>
    console.log("✓", wine.filename)
  );

  console.log("\n===== 2. VÉRIFICATION DES RÉFÉRENCES =====");

  const producer = await client.getDocument("producer-vineterra");

  if (!producer || producer.slug?.current !== "vineterra") {
    throw new Error("Producteur Vineterra introuvable.");
  }

  const countries = await client.fetch(`
    *[_type == "country"]{_id, name}
  `);

  const regions = await client.fetch(`
    *[_type == "region"]{_id, name}
  `);

  const grapes = await client.fetch(`
    *[_type == "grape"]{_id, name}
  `);

  const country = countries.find(
    (item) => normalize(item.name) === "canada"
  );

  const region = regions.find(
    (item) => normalize(item.name) === "monteregie"
  );

  if (!country || !region) {
    console.log("Pays trouvés :", countries.map(x => x.name));
    console.log("Régions trouvées :", regions.map(x => x.name));

    throw new Error(
      "Référence Canada ou Montérégie introuvable."
    );
  }

  console.log("✓ Pays :", country.name);
  console.log("✓ Région :", region.name);
  console.log("✓ Producteur :", producer.name);

  console.log("\n===== 3. CRÉATION DES CINQ VINS =====");

  for (const wine of wines) {
    const id = `wine-${wine.slug}`;
    const draftId = `drafts.${id}`;

    const existing = await client.fetch(
      `*[_id in [$id, $draftId]][]._id`,
      { id, draftId }
    );

    if (existing.length) {
      console.log(
        `⚠ ${wine.name} existe déjà. Aucun écrasement.`
      );
      continue;
    }

    const grapeRefs = wine.grapes.map((name) => {
      const found = grapes.find(
        (item) => normalize(item.name) === normalize(name)
      );

      if (!found) {
        throw new Error(
          `Cépage introuvable pour ${wine.name} : ${name}`
        );
      }

      return {
        _type: "reference",
        _key: found._id.replace(/[^a-zA-Z0-9_-]/g, "-"),
        _ref: found._id,
      };
    });

    const imagePath = path.join(folder, wine.filename);

    console.log(`\nImportation : ${wine.name}`);

    const asset = await client.assets.upload(
      "image",
      fs.createReadStream(imagePath),
      {
        filename: wine.filename,
        title: `${wine.name} ${wine.vintage} — Domaine Vineterra`,
      }
    );

    const document = {
      _id: draftId,
      _type: "wine",

      name: wine.name,

      slug: {
        _type: "slug",
        current: wine.slug,
      },

      beverageType: "wine",
      alcoholFree: false,

      producer: {
        _type: "reference",
        _ref: "producer-vineterra",
      },

      country: {
        _type: "reference",
        _ref: country._id,
      },

      region: {
        _type: "reference",
        _ref: region._id,
      },

      vintage: wine.vintage,
      color: wine.color,

      ...(grapeRefs.length
        ? { grapes: grapeRefs }
        : {}),

      bottleImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },

      published: false,
    };

    await client.createIfNotExists(document);

    console.log(`✓ Fiche créée : ${wine.name}`);
    console.log("✓ Photo importée");
    console.log("✓ Producteur relié");
    console.log("✓ Statut : brouillon");
  }

  console.log("\n===== 4. VALIDATION =====");

  const result = await client.fetch(`
    *[
      _type == "wine" &&
      references("producer-vineterra")
    ] | order(name asc) {
      _id,
      name,
      vintage,
      color,
      published,
      "hasImage": defined(bottleImage.asset._ref),
      "grapes": grapes[]->name,
      "producer": producer->name
    }
  `);

  console.log(JSON.stringify(result, null, 2));

  console.log("\n✓ IMPORTATION TERMINÉE");
  console.log("Les fiches restent en brouillon.");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
