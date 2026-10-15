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
    name == "Le Rouge Gorge" ||
    slug.current == "le-rouge-gorge"
  )][0]{
    _id,
    name,
    "slug": slug.current,
    instagram,
    highlights,
    highlightsEn
  }`
);

if (!place?._id) {
  console.error("STOP — fiche Le Rouge Gorge introuvable.");
  process.exit(1);
}

console.log("\n===== AVANT =====");
console.log("Nom :", place.name);
console.log("Slug :", place.slug);
console.log("Instagram :", place.instagram || "ABSENT");
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
    "rouge-gorge-fr-1",
    "Ouvert en mars 2015 au coin de l’avenue du Mont-Royal et de la rue De Brébeuf, le Rouge Gorge est le projet de Laurent Farre et d’Alain Rochard. Leur histoire dans la restauration remonte à Saumur, en France, avant de se poursuivre à Montréal, notamment avec le restaurant Continental."
  ),
  block(
    "rouge-gorge-fr-2",
    "Au Rouge Gorge, le vin est au premier plan. La carte rassemble des références françaises, européennes et nord-américaines, dont plusieurs vins québécois. Le choix au verre est particulièrement développé, mais les amateurs de cocktails ne sont pas oubliés."
  ),
  block(
    "rouge-gorge-fr-3",
    "Le lieu possède aussi plusieurs visages. Au rez-de-chaussée, de grandes fenêtres donnent sur l’avenue du Mont-Royal. En été, la terrasse prend le relais. Au sous-sol, un deuxième bar offre une atmosphère plus intime, avec des DJ certaines soirées. Côté cuisine, les huîtres, les charcuteries et les plats à partager permettent aussi d’y passer pour souper."
  ),
];

const descriptionEn = [
  block(
    "rouge-gorge-en-1",
    "Le Rouge Gorge opened in March 2015 at the corner of Mont-Royal Avenue and De Brébeuf Street. It is the project of Laurent Farre and Alain Rochard, whose history in the restaurant world began in Saumur, France, before continuing in Montreal, notably with Restaurant Continental."
  ),
  block(
    "rouge-gorge-en-2",
    "Wine takes centre stage at Le Rouge Gorge. The list brings together bottles from France, elsewhere in Europe and North America, including several Quebec wines. There is an especially broad selection by the glass, alongside a cocktail program."
  ),
  block(
    "rouge-gorge-en-3",
    "The space has several sides to it. At street level, large windows look out onto Mont-Royal Avenue, while a terrace takes over in summer. Downstairs, a second bar offers a more intimate setting, with DJs on select nights. Oysters, charcuterie and dishes made for sharing also make it a place where you can stay for dinner."
  ),
];

const highlights = [
  "Bar à vin depuis 2015",
  "Grande sélection de vins au verre",
  "Un deuxième bar au sous-sol",
];

const highlightsEn = [
  "Wine bar since 2015",
  "A wide selection of wines by the glass",
  "A second bar downstairs",
];

const instagram = "https://www.instagram.com/rougegorge_mtl/";

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

console.log("\nOK — Le Rouge Gorge FR mis à jour");
console.log("OK — Le Rouge Gorge EN mis à jour");
console.log("OK — 3 cartes FR + EN mises à jour");
console.log("OK — Instagram @rougegorge_mtl ajouté");
console.log("OK — modèle figé non modifié");
