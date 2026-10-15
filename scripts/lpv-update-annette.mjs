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
  `*[_type == "place" && (
    name == "Annette bar à vin" ||
    name == "Annette" ||
    slug.current == "annette-bar-a-vin"
  )][0]{
    _id,
    name,
    "slug": slug.current,
    instagram,
    website,
    highlights,
    highlightsEn
  }`
);

if (!place?._id) {
  console.error("STOP — fiche Annette introuvable.");
  process.exit(1);
}

console.log("\n===== AVANT =====");
console.log("Nom :", place.name);
console.log("Slug :", place.slug);
console.log("Instagram :", place.instagram || "ABSENT");
console.log("Site :", place.website || "ABSENT");
console.log("FR :", place.highlights);
console.log("EN :", place.highlightsEn);

const block = (key, text) => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [
    {
      _type: "span",
      _key: `${key}-span`,
      marks: [],
      text,
    },
  ],
});

const description = [
  block(
    "annette-fr-1",
    "Ouvert en 2023 dans le secteur des Shops Angus, Annette est le deuxième établissement du chef Marc-André Jetté, derrière Hoogan et Beaufort, situé juste en face. Le bar à vin occupe un bâtiment moderne aux grandes façades vitrées, avec une cuisine ouverte sur la salle et une terrasse pendant la belle saison."
  ),
  block(
    "annette-fr-2",
    "La carte des vins est élaborée par Hugo Duchesne, directeur de la sommellerie. Elle rassemble aussi bien des grands crus que des bouteilles plus accessibles, avec une sélection particulièrement développée au verre. Annette propose également des cocktails conçus par Olivier Quintin. La carte des vins lui a notamment valu un Award of Excellence du magazine Wine Spectator."
  ),
  block(
    "annette-fr-3",
    "En cuisine, Marc-André Jetté et son équipe proposent des assiettes de saison pensées pour le partage. Le menu va bien au-delà des accompagnements habituels d’un bar à vin, avec des plats travaillés qui permettent d’y prendre un véritable repas. Annette a reçu un Bib Gourmand du Guide Michelin en 2025, distinction renouvelée en 2026. L’établissement organise aussi des soupers vignerons, des dégustations et différentes soirées thématiques."
  ),
];

const descriptionEn = [
  block(
    "annette-en-1",
    "Opened in 2023 in the Shops Angus district, Annette is chef Marc-André Jetté’s second establishment, following Hoogan et Beaufort, located just across the street. The wine bar occupies a modern building with large glass façades, an open kitchen overlooking the dining room and a terrace during the warmer months."
  ),
  block(
    "annette-en-2",
    "The wine list is developed by sommelier Hugo Duchesne. It brings together prestigious wines and more accessible bottles, with a particularly extensive selection available by the glass. Annette also serves cocktails created by Olivier Quintin. Its wine program has earned an Award of Excellence from Wine Spectator."
  ),
  block(
    "annette-en-3",
    "In the kitchen, Marc-André Jetté and his team serve seasonal dishes designed for sharing. The menu goes well beyond the usual accompaniments of a wine bar, with composed dishes that make Annette a destination for a full meal. Annette received a Michelin Bib Gourmand in 2025, a distinction renewed in 2026. The restaurant also hosts winemaker dinners, tastings and other themed evenings."
  ),
];

const highlights = [
  "Bar à vin depuis 2023",
  "Bib Gourmand Michelin 2025 et 2026",
  "Grande sélection de vins au verre",
];

const highlightsEn = [
  "Wine bar since 2023",
  "Michelin Bib Gourmand 2025 and 2026",
  "Extensive selection of wines by the glass",
];

const instagram = "https://www.instagram.com/annettebaravin/";

await client
  .patch(place._id)
  .set({
    description,
    descriptionEn,
    highlights,
    highlightsEn,
    instagram,
  })
  .commit();

const check = await client.fetch(
  `*[_id == $id][0]{
    name,
    instagram,
    highlights,
    highlightsEn,
    description,
    descriptionEn
  }`,
  { id: place._id }
);

console.log("\n===== APRÈS =====");
console.log("Nom :", check.name);
console.log("Instagram :", check.instagram);
console.log("FR :", check.highlights);
console.log("EN :", check.highlightsEn);
console.log("Description FR :", check.description?.length, "paragraphes");
console.log("Description EN :", check.descriptionEn?.length, "paragraphes");

if (
  check.instagram !== instagram ||
  check.description?.length !== 3 ||
  check.descriptionEn?.length !== 3 ||
  check.highlights?.length !== 3 ||
  check.highlightsEn?.length !== 3
) {
  console.error("\nSTOP — vérification finale inattendue.");
  process.exit(1);
}

console.log("\nOK — Annette FR mis à jour");
console.log("OK — Annette EN mis à jour");
console.log("OK — 3 cartes FR + EN mises à jour");
console.log("OK — Instagram @annettebaravin ajouté");
console.log("OK — modèle visuel figé intact");
