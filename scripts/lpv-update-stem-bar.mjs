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
    name == "Stem Bar" ||
    slug.current == "stem-bar"
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
  console.error("STOP — fiche Stem Bar introuvable.");
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
    "stem-fr-1",
    "Ouvert en janvier 2020 sur la rue Notre-Dame Ouest, dans la Petite-Bourgogne, Stem Bar est né de l’équipe derrière le September Surf Café, installé juste à côté. Le projet prolonge l’histoire du café, cette fois autour du vin, de la bière et d’une cuisine pensée pour le soir."
  ),
  block(
    "stem-fr-2",
    "La carte des vins compte plus de 300 références et privilégie les petits producteurs indépendants, notamment en importation privée. La sélection évolue régulièrement, tandis que les bières font une place aux microbrasseries québécoises. C’est l’une des particularités du Stem Bar, où la carte des boissons occupe autant de place que celle de la cuisine."
  ),
  block(
    "stem-fr-3",
    "Aux fourneaux, Kevin Tolton propose une cuisine de marché qui change au fil des saisons. Les petites assiettes sont conçues pour être partagées et le menu suit les produits disponibles. Le décor, signé Ravi Handa, mise sur un éclairage tamisé, des détails d’époque et un long espace où se côtoient comptoir et petites tables. Une terrasse complète l’adresse pendant la belle saison."
  ),
];

const descriptionEn = [
  block(
    "stem-en-1",
    "Stem Bar opened in January 2020 on Notre-Dame Street West in Little Burgundy. It was created by the team behind September Surf Café, located right next door. The project extends the story of the café into the evening, this time with wine, beer and food at the centre."
  ),
  block(
    "stem-en-2",
    "The wine list features more than 300 references and focuses on small independent producers, including many private imports. The selection changes regularly, while the beer list also makes room for Quebec microbreweries. It is one of Stem Bar’s defining features, with as much attention given to what is poured as to what comes out of the kitchen."
  ),
  block(
    "stem-en-3",
    "In the kitchen, Kevin Tolton serves market-driven food that changes with the seasons. Small plates are designed for sharing and the menu follows what is available. The interior, designed by Ravi Handa, combines subdued lighting and period details in a long room lined with counter seats and small tables. A terrace adds to the space during the warmer months."
  ),
];

const highlights = [
  "Bar à vin depuis 2020",
  "Plus de 300 références de vin",
  "Cuisine de marché et petites assiettes",
];

const highlightsEn = [
  "Wine bar since 2020",
  "More than 300 wine references",
  "Market-driven food and small plates",
];

const instagram = "https://www.instagram.com/stem_bar/";

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

console.log("\nOK — Stem Bar FR mis à jour");
console.log("OK — Stem Bar EN mis à jour");
console.log("OK — 3 cartes FR + EN mises à jour");
console.log("OK — Instagram @stem_bar ajouté");
console.log("OK — modèle visuel figé intact");
