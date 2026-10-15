import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const ref = (_ref) => ({ _type: "reference", _ref });

const block = (text, key) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [
    {
      _key: `${key}-span`,
      _type: "span",
      marks: [],
      text,
    },
  ],
});

const wine = {
  _id: "wine-cidrerie-du-minot-cremant-de-pomme",
  _type: "wine",

  name: "Crémant de Pomme",
  slug: {
    _type: "slug",
    current: "cremant-de-pomme-cidrerie-du-minot",
  },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-cidrerie-du-minot"),
  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-monteregie"),

  categories: [
    {
      _key: "cidres",
      ...ref("category-cidres"),
    },
  ],

  appleVarieties: ["McIntosh"],

  approxPrice: 14.45,
  purchaseChannel: "saq",
  purchaseChannelDetails: "Disponible à la SAQ selon les stocks.",
  purchaseChannelDetailsEn: "Available at the SAQ, subject to stock.",
  purchaseUrl: "https://www.saq.com/fr/245316",
  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Un cidre pétillant québécois tout en fraîcheur, où la McIntosh croquante rencontre une douceur fruitée et des bulles délicates.",
  oneLinerEn:
    "A fresh Québec sparkling cider where crisp McIntosh apple meets gentle fruit sweetness and delicate bubbles.",

  tastingKeywords: [
    "pomme fraîche",
    "pomme mûre",
    "melon",
    "fleur de pommier",
  ],
  tastingKeywordsEn: [
    "fresh apple",
    "ripe apple",
    "melon",
    "apple blossom",
  ],

  perfectFor: [
    "brunch",
    "apéritif",
    "desserts aux fruits",
  ],
  perfectForEn: [
    "brunch",
    "aperitif",
    "fruit desserts",
  ],

  whyWeRecommend:
    "Parce qu’il montre à quel point un cidre québécois peut être simple d’approche sans être banal. Ses bulles, sa fraîcheur et son fruit bien présent en font une bouteille facile à servir au brunch comme à l’apéritif. C’est aussi une belle porte d’entrée pour découvrir l’histoire du cidre moderne au Québec.",
  whyWeRecommendEn:
    "Because it shows how approachable a Québec cider can be without being ordinary. Its bubbles, freshness and expressive fruit make it easy to serve at brunch or as an aperitif. It is also a great introduction to the story of modern Québec cider.",

  body: 1,
  sweetness: 3,
  roundness: 2,

  servingTemperature: "4–6 °C",
  decant: false,

  foodPairings: [
    { _key: "brunch", ...ref("food-brunch-oeufs-benedictine") },
    { _key: "fromages", ...ref("food-fromages") },
    { _key: "vegetarien", ...ref("food-cuisine-vegetarienne") },
    { _key: "tarte-fruits", ...ref("food-tarte-aux-fruits") },
  ],

  style: "Cidre pétillant demi-doux",
  cellaringPotential: "À boire jeune pour profiter de sa fraîcheur et de son fruit.",

  alcohol: 2.5,
  sugar: "61 g/L",

  acidity: 4,
  tannins: 1,

  isOrganic: false,
  isNatural: false,
  isBiodynamic: false,
  isVegan: false,

  aromas: [
    "pomme fraîche",
    "pomme mûre",
    "melon",
    "fleur de pommier",
  ],

  flavors: [
    "pomme",
    "fruits frais",
    "notes florales",
  ],

  texture: "Légère, vive et délicatement effervescente.",
  finish: "Fraîche, fruitée et doucement persistante.",

  fruitIntensity: 4,
  minerality: 1,
  savory: 1,
  intensity: 3,
  complexity: 2,
  oakInfluence: 1,

  vinification: [
    block(
      "Élaboré à partir de pommes McIntosh. Fermentation à basse température, suivie d’une prise de mousse en cuve close. L’effervescence provient naturellement de la fermentation, sans ajout de sucre pour créer les bulles.",
      "vinification-1"
    ),
  ],

  harvestMethod: "manual",
  bottleSize: "750 ml",
  sku: "245316",

  tastingNotes: [
    block(
      "Le nez s’ouvre sur la pomme fraîche et mûre, accompagnée de notes de melon et de fleur de pommier. En bouche, le cidre est léger et vif, avec une douceur perceptible équilibrée par une acidité rafraîchissante. Les bulles sont délicates et prolongent le caractère fruité.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "The nose opens on fresh and ripe apple, with notes of melon and apple blossom. The palate is light and lively, with noticeable sweetness balanced by refreshing acidity. Delicate bubbles carry the fruit through the finish.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "Le Crémant de Pomme fait partie des bouteilles qui ont contribué à installer le cidre artisanal québécois dans le paysage moderne. Créée en 1988 par la Cidrerie du Minot, cette cuvée demeure particulièrement accessible : peu alcoolisée, expressive et suffisamment fraîche pour garder son équilibre malgré son sucre. Une bouteille à sortir du seul registre du dessert.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "Crémant de Pomme is one of the bottles that helped establish Québec craft cider in the modern beverage landscape. First produced by Cidrerie du Minot in 1988, it remains especially approachable: low in alcohol, expressive and fresh enough to balance its sweetness. A bottle that deserves a place beyond the dessert table.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "beginner",

  aiSummary:
    "Cidre pétillant québécois de la Cidrerie du Minot élaboré à partir de McIntosh. Léger, fruité, vif et demi-doux, à 2,5 % d’alcool.",

  seoTitle:
    "Crémant de Pomme — Cidrerie du Minot | Le Premier Verre",

  seoDescription:
    "Découvrez le Crémant de Pomme de la Cidrerie du Minot : un cidre pétillant québécois de McIntosh, léger, fruité et vif, à 2,5 % d’alcool.",

  published: true,
};

const duplicate = await client.fetch(
  `*[_type == "wine" && (
    _id == $id ||
    slug.current == $slug ||
    sku == $sku
  )][0]{_id,name}`,
  {
    id: wine._id,
    slug: wine.slug.current,
    sku: wine.sku,
  }
);

if (duplicate) {
  console.error(
    `❌ Doublon détecté : ${duplicate._id} — ${duplicate.name}`
  );
  process.exit(1);
}

await client.create(wine);

console.log(`✅ C01 créé : ${wine._id}`);
console.log(`   ${wine.name} — Cidrerie du Minot`);
console.log(`   Type : ${wine.beverageType}`);
console.log(`   Catégorie : Cidres`);
console.log(`   Pommes : ${wine.appleVarieties.join(", ")}`);
console.log(`   Accords : ${wine.foodPairings.length}`);
console.log(`   SKU : ${wine.sku}`);
