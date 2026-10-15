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
    name == "larrys" ||
    name == "Larrys" ||
    slug.current == "larrys"
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
  console.error("STOP — fiche larrys introuvable.");
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
    "larrys-fr-1",
    "Ouvert en 2016 dans le Mile End, larrys est un projet de l’équipe derrière Lawrence et la Boucherie Lawrence. Situé au coin du boulevard Saint-Laurent et de la rue Fairmount, ce café-restaurant-bar à vin reprend l’intérêt du groupe pour les produits locaux et une cuisine soignée, dans une formule plus décontractée."
  ),
  block(
    "larrys-fr-2",
    "L’une de ses particularités est d’être ouvert du matin au soir. On peut y prendre un café et déjeuner, revenir pour un sandwich ou un burger à midi, puis s’installer autour de petites assiettes à partager en soirée. Le menu évolue selon les saisons et fait une place importante aux ingrédients provenant de producteurs québécois."
  ),
  block(
    "larrys-fr-3",
    "Le vin accompagne cette formule toute la journée, avec une sélection qui côtoie les bières et les cocktails. larrys fait aussi une place à la vente de bouteilles à emporter. C’est cette combinaison de café, restaurant, bar à vin et caviste qui distingue l’adresse des autres établissements du quartier."
  ),
];

const descriptionEn = [
  block(
    "larrys-en-1",
    "Opened in 2016 in the Mile End, larrys is a project from the team behind Lawrence and Boucherie Lawrence. Located at the corner of Saint-Laurent Boulevard and Fairmount Street, the café, restaurant and wine bar carries over the group’s interest in local products and thoughtful cooking in a more casual format."
  ),
  block(
    "larrys-en-2",
    "One of its defining features is that it is open from morning through evening. You can stop in for coffee and breakfast, come back for a sandwich or burger at lunch, then settle in over small plates to share later in the day. The menu changes with the seasons and gives an important place to ingredients from Quebec producers."
  ),
  block(
    "larrys-en-3",
    "Wine is part of the experience throughout the day, alongside beer and cocktails. larrys also offers bottles to take home. That combination of café, restaurant, wine bar and bottle shop is part of what sets it apart in the neighbourhood."
  ),
];

const highlights = [
  "Dans le Mile End depuis 2016",
  "Du café du matin au vin du soir",
  "Cuisine de saison et produits locaux",
];

const highlightsEn = [
  "In the Mile End since 2016",
  "From morning coffee to evening wine",
  "Seasonal cooking and local products",
];

const instagram = "https://www.instagram.com/larrys.gram/";

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

console.log("\nOK — larrys FR mis à jour");
console.log("OK — larrys EN mis à jour");
console.log("OK — 3 cartes FR + EN mises à jour");
console.log("OK — Instagram @larrys.gram ajouté");
console.log("OK — modèle visuel figé intact");
