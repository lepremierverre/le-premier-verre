import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("STOP — token Sanity d’écriture introuvable.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const place = await client.fetch(
  `*[_type == "place" && name == "Buvette Chez Simone"][0]{
    _id,
    name,
    description,
    highlights
  }`
);

if (!place?._id) {
  console.error("STOP — fiche Buvette Chez Simone introuvable.");
  process.exit(1);
}

console.log("\n===== AVANT =====");
console.log("Nom :", place.name);
console.log("Highlights :", place.highlights);

const description = [
  {
    _type: "block",
    _key: "simone-desc-1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "simone-desc-1-span",
        marks: [],
        text: "Ouverte en 2008 sur l’avenue du Parc, la Buvette Chez Simone est devenue un classique du Mile End. Derrière le projet, il y a notamment Simone Chevalot, dont l’établissement porte le prénom. Près de vingt ans plus tard, la Buvette continue d’attirer les Montréalais autour de son grand comptoir et de ses tables animées."
      }
    ]
  },
  {
    _type: "block",
    _key: "simone-desc-2",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "simone-desc-2-span",
        marks: [],
        text: "La carte des vins occupe une place centrale, avec des bouteilles de différentes régions et une sélection qui évolue au fil des découvertes. On peut s’y arrêter pour un verre, mais aussi prendre le temps de parcourir la carte et de partager une bouteille."
      }
    ]
  },
  {
    _type: "block",
    _key: "simone-desc-3",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "simone-desc-3-span",
        marks: [],
        text: "Côté cuisine, les charcuteries, les fromages et les petites assiettes côtoient le fameux poulet rôti, un classique de la maison. C’est aussi ce qui distingue Chez Simone d’un simple bar à vin. On peut y passer toute la soirée, sans avoir à choisir entre bien boire et bien manger."
      }
    ]
  }
];

const highlights = [
  "Bar à vin depuis 2008",
  "Charcuteries et fromages",
  "À boire au verre ou à la bouteille"
];

await client
  .patch(place._id)
  .set({
    description,
    highlights
  })
  .commit();

const check = await client.fetch(
  `*[_id == $id][0]{
    name,
    highlights,
    description
  }`,
  { id: place._id }
);

console.log("\n===== APRÈS =====");
console.log("Nom :", check.name);
console.log("Highlights :", check.highlights);
console.log("Description mise à jour :", check.description?.length, "paragraphes");
console.log("\nOK — Buvette Chez Simone mise à jour");
