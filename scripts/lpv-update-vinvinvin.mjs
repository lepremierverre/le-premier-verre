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
    name match "vinvinvin*" ||
    slug.current == "vinvinvin"
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
  console.error("STOP — fiche vinvinvin introuvable.");
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
    "vinvinvin-fr-1",
    "Ouvert en juin 2019 sur la rue Beaubien Est, dans la Petite-Patrie, vinvinvin est né du projet de trois associés issus de la restauration montréalaise, Marina De Figueiredo, Antonin Laporte et Nikolas Da Fonseca. Le nom fait d’ailleurs référence à ce trio."
  ),
  block(
    "vinvinvin-fr-2",
    "Dès le départ, le bar a choisi de mettre en valeur les vins de climats nordiques et frais. On y retrouve notamment des bouteilles d’Autriche, d’Allemagne, de République tchèque et de Slovaquie, aux côtés de vins québécois et ontariens. Une sélection qui permet de découvrir des régions encore peu connues de plusieurs amateurs."
  ),
  block(
    "vinvinvin-fr-3",
    "La carte ne suit pas tout à fait les conventions habituelles. Les vins sont notamment regroupés sous les catégories « tranquille » et « pas tranquille », plutôt que simplement séparés entre rouges, blancs et bulles. Côté cuisine, les petites assiettes, les charcuteries et les plats de saison accompagnent les verres. Le bar dispose également d’une terrasse sur Beaubien."
  ),
];

const descriptionEn = [
  block(
    "vinvinvin-en-1",
    "vinvinvin opened in June 2019 on Beaubien Street East in Petite-Patrie. The bar was founded by three partners from Montreal’s restaurant scene, Marina De Figueiredo, Antonin Laporte and Nikolas Da Fonseca. The name itself is a reference to the trio."
  ),
  block(
    "vinvinvin-en-2",
    "From the beginning, the bar has focused on wines from northern and cool-climate regions. The selection includes bottles from Austria, Germany, the Czech Republic and Slovakia, alongside wines from Quebec and Ontario. It is an opportunity to discover regions that remain unfamiliar to many wine drinkers."
  ),
  block(
    "vinvinvin-en-3",
    "The wine list does not quite follow the usual conventions. Wines are notably grouped into categories such as “still” and “not still” rather than simply divided into red, white and sparkling. Small plates, charcuterie and seasonal dishes accompany the wines, and the bar also has a terrace on Beaubien."
  ),
];

const highlights = [
  "Bar à vin depuis 2019",
  "Vins nordiques et d’Europe centrale",
  "Carte « tranquille » et « pas tranquille »",
];

const highlightsEn = [
  "Wine bar since 2019",
  "Northern and Central European wines",
  "A “still” and “not still” wine list",
];

const instagram = "https://www.instagram.com/barvinvinvin/";

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

console.log("\nOK — vinvinvin FR mis à jour");
console.log("OK — vinvinvin EN mis à jour");
console.log("OK — 3 cartes FR + EN mises à jour");
console.log("OK — Instagram @barvinvinvin ajouté");
console.log("OK — modèle visuel figé intact");
