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
    name == "Casavant" ||
    slug.current == "casavant"
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
  console.error("STOP — fiche Casavant introuvable.");
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
    "casavant-fr-1",
    "Ouvert à l’automne 2023 dans Villeray, à quelques pas du marché Jean-Talon, Casavant est né du projet de Matisse Deslauriers et Geoffroy Gravel, qui se sont rencontrés chez vinvinvin. Le restaurant porte le nom de la grand-mère de Matisse. Le chef Charles-Tristan Prévost et Amélie Demchuck se sont joints au projet, auquel participent également plusieurs associés de vinvinvin."
  ),
  block(
    "casavant-fr-2",
    "En cuisine, Charles-Tristan Prévost revisite les classiques du bistrot français en travaillant notamment avec les produits du marché Jean-Talon. La saucisse-purée est devenue l’un des plats emblématiques de la maison, aux côtés du tartare de bœuf et d’autres propositions qui évoluent selon les saisons. En 2025, Casavant a obtenu un Bib Gourmand du Guide Michelin, une distinction qui souligne les restaurants offrant une cuisine de qualité à prix raisonnable."
  ),
  block(
    "casavant-fr-3",
    "Le vin occupe aussi une place importante. La carte privilégie les vins nature, avec notamment des bouteilles provenant d’À Boire Debout, l’agence d’importation de Matisse Deslauriers. Le restaurant est ouvert sept soirs sur sept, avec une cuisine qui reste ouverte tard. Une formule qui correspond à l’idée de départ des propriétaires, soit créer une table où les gens de la restauration auraient eux-mêmes envie de manger après leur service."
  ),
];

const descriptionEn = [
  block(
    "casavant-en-1",
    "Casavant opened in the fall of 2023 in Villeray, just steps from Jean-Talon Market. The restaurant was founded by Matisse Deslauriers and Geoffroy Gravel, who met while working at vinvinvin. Casavant takes its name from Matisse’s grandmother. Chef Charles-Tristan Prévost and Amélie Demchuck joined the project, along with several partners from vinvinvin."
  ),
  block(
    "casavant-en-2",
    "In the kitchen, Charles-Tristan Prévost revisits French bistro classics, working in particular with products from Jean-Talon Market. The sausage and mashed potatoes has become one of the restaurant’s signature dishes, alongside beef tartare and other dishes that change with the seasons. In 2025, Casavant received a Michelin Bib Gourmand, a distinction recognizing restaurants that offer quality cooking at good value."
  ),
  block(
    "casavant-en-3",
    "Wine also plays an important role. The list focuses on natural wines, including bottles from À Boire Debout, Matisse Deslauriers’ wine import agency. Casavant is open seven nights a week, with the kitchen serving late. That schedule reflects the owners’ original idea of creating the kind of restaurant where people working in the industry would want to eat after their own shift."
  ),
];

const highlights = [
  "Bistrot français depuis 2023",
  "Bib Gourmand Michelin 2025",
  "Vins nature et importations privées",
];

const highlightsEn = [
  "French bistro since 2023",
  "Michelin Bib Gourmand 2025",
  "Natural wines and private imports",
];

const instagram = "https://www.instagram.com/casavantmontreal/";

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

console.log("\nOK — Casavant FR mis à jour");
console.log("OK — Casavant EN mis à jour");
console.log("OK — 3 cartes FR + EN mises à jour");
console.log("OK — Instagram @casavantmontreal ajouté");
console.log("OK — modèle visuel figé intact");
