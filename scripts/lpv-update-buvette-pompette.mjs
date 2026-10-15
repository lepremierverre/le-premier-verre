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
    name == "Buvette Pompette" ||
    slug.current == "buvette-pompette"
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
  console.error("STOP — fiche Buvette Pompette introuvable.");
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
    "pompette-fr-1",
    "Installée depuis la fin de 2022 sur la rue Saint-Zotique Est, dans la Petite-Patrie, Buvette Pompette s’inspire des bars à tapas espagnols. L’établissement réunit une carte de vins nature, une cuisine de petites assiettes et des cocktails qui empruntent à la culture espagnole."
  ),
  block(
    "pompette-fr-2",
    "La sélection de vins privilégie les cuvées biologiques, biodynamiques et nature, principalement en importation privée. De nouveaux arrivages viennent régulièrement renouveler la carte. Les cocktails, quant à eux, mettent en valeur des produits d’ici tout en s’inspirant de la Movida Española, le mouvement culturel qui a marqué l’Espagne après la fin du franquisme."
  ),
  block(
    "pompette-fr-3",
    "En cuisine, les classiques espagnols occupent une place importante. On retrouve notamment des patatas bravas, du chorizo à la sidra, des calmars frits ainsi que des planches de charcuteries et de fromages. Buvette Pompette est ouverte tous les jours, de la fin de l’après-midi jusqu’en soirée."
  ),
];

const descriptionEn = [
  block(
    "pompette-en-1",
    "Buvette Pompette opened in late 2022 on Saint-Zotique Street East in Petite-Patrie, drawing inspiration from Spanish tapas bars. The concept brings together natural wines, small plates and cocktails influenced by Spanish culture."
  ),
  block(
    "pompette-en-2",
    "The wine selection focuses on organic, biodynamic and natural wines, primarily through private imports. New arrivals regularly refresh the list. The cocktails highlight local ingredients while drawing inspiration from the Movida Española, the cultural movement that emerged in Spain following the end of the Franco era."
  ),
  block(
    "pompette-en-3",
    "Spanish classics have an important place on the food menu. Patatas bravas, chorizo cooked in cider, fried calamari and boards of charcuterie and cheese are among the offerings. Buvette Pompette is open every day from late afternoon into the evening."
  ),
];

const highlights = [
  "Buvette d’inspiration espagnole",
  "Vins nature et importations privées",
  "Tapas et cocktails inspirés de l’Espagne",
];

const highlightsEn = [
  "A Spanish-inspired wine bar",
  "Natural wines and private imports",
  "Spanish-inspired tapas and cocktails",
];

const instagram = "https://www.instagram.com/buvettepompette/";

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

console.log("\nOK — Buvette Pompette FR mis à jour");
console.log("OK — Buvette Pompette EN mis à jour");
console.log("OK — 3 cartes FR + EN mises à jour");
console.log("OK — Instagram @buvettepompette ajouté");
console.log("OK — modèle visuel figé intact");
