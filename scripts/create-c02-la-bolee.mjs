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
  children: [{
    _key: `${key}-span`,
    _type: "span",
    marks: [],
    text,
  }],
});

const wine = {
  _id: "wine-cidrerie-du-minot-la-bolee",
  _type: "wine",

  name: "La Bolée",
  slug: { _type: "slug", current: "la-bolee-cidrerie-du-minot" },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-cidrerie-du-minot"),
  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-monteregie"),

  categories: [
    { _key: "cidres", ...ref("category-cidres") },
  ],

  appleVarieties: ["McIntosh", "Lobo", "Cortland"],

  approxPrice: 14.45,
  purchaseChannel: "saq",
  purchaseChannelDetails: "Disponible à la SAQ selon les stocks.",
  purchaseChannelDetailsEn: "Available at the SAQ, subject to stock.",
  purchaseUrl: "https://www.saq.com/fr/511956",
  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Un cidre tranquille québécois sec et vif, porté par la pomme fraîche, la pêche et une finale nette qui appelle la table.",
  oneLinerEn:
    "A dry, lively Québec still cider driven by fresh apple, peach and a clean finish made for the table.",

  tastingKeywords: [
    "pomme",
    "pêche",
    "poire",
    "melon miel",
  ],
  tastingKeywordsEn: [
    "apple",
    "peach",
    "pear",
    "honeydew melon",
  ],

  perfectFor: [
    "sushis",
    "fruits de mer",
    "apéritif",
  ],
  perfectForEn: [
    "sushi",
    "seafood",
    "aperitif",
  ],

  whyWeRecommend:
    "Parce qu’il montre une autre facette du cidre québécois : tranquille, sec et pensé pour accompagner un repas. Son fruit reste très présent, mais l’acidité lui donne suffisamment de fraîcheur pour passer facilement de l’apéritif aux sushis, aux moules ou au tartare. Une bouteille particulièrement intéressante pour ceux qui associent encore le cidre uniquement aux bulles ou aux styles sucrés.",
  whyWeRecommendEn:
    "Because it shows another side of Québec cider: still, dry and made for the table. Its fruit remains expressive, while lively acidity gives it enough freshness to move easily from the aperitif to sushi, mussels or tartare. An especially interesting bottle for anyone who still associates cider only with bubbles or sweeter styles.",

  body: 2,
  sweetness: 1,
  roundness: 1,

  servingTemperature: "6–8 °C",
  decant: false,

  foodPairings: [
    { _key: "sushis", ...ref("food-sushis") },
    { _key: "moules", ...ref("food-moules") },
    { _key: "tartare-saumon", ...ref("food-tartare-saumon") },
    { _key: "poulet-roti", ...ref("food-poulet-roti") },
  ],

  style: "Cidre tranquille sec",
  cellaringPotential:
    "À privilégier jeune afin de conserver la fraîcheur du fruit.",

  alcohol: 7,
  sugar: "14 g/L",

  acidity: 4,
  tannins: 1,

  isOrganic: false,
  isNatural: false,
  isBiodynamic: false,
  isVegan: false,

  aromas: [
    "pomme fraîche",
    "pêche",
    "poire",
    "melon miel",
  ],

  flavors: [
    "pomme",
    "fruits à chair blanche",
    "pêche",
  ],

  texture:
    "Légère et droite, avec une acidité vive et sans effervescence.",
  finish:
    "Nette, fraîche et fruitée.",

  fruitIntensity: 4,
  minerality: 1,
  savory: 1,
  intensity: 3,
  complexity: 2,
  oakInfluence: 1,

  vinification: [
    block(
      "Assemblage de pommes McIntosh, Lobo et Cortland. Fermentation à basse température, suivie d’un élevage sur lies. Le cidre est ensuite filtré puis embouteillé à froid.",
      "vinification-1"
    ),
  ],

  bottleSize: "750 ml",
  sku: "511956",

  tastingNotes: [
    block(
      "Un profil franc de pomme fraîche et mûre accompagné de pêche, de poire et de melon miel. La bouche est légère, sèche et dominée par une acidité rafraîchissante. L’absence de bulles met davantage en évidence la pureté du fruit et la finale nette.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "A clear profile of fresh and ripe apple with peach, pear and honeydew melon. The palate is light and dry, driven by refreshing acidity. Without bubbles, the purity of the fruit and the clean finish come through especially well.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "La Bolée est intéressante précisément parce qu’elle ne cherche pas à reproduire le registre d’un cidre pétillant. Servie dans un verre à vin et placée à table, elle permet de comprendre le cidre comme une véritable boisson gastronomique. Sa fraîcheur et son profil sec en font aussi un excellent pont pour les amateurs de blancs vifs qui souhaitent découvrir le cidre québécois.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "La Bolée is compelling precisely because it does not try to reproduce the style of a sparkling cider. Served in a wine glass and brought to the table, it shows cider as a genuine food-pairing beverage. Its freshness and dry profile also make it an excellent bridge for lovers of crisp white wines who want to explore Québec cider.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "beginner",

  aiSummary:
    "Cidre tranquille sec de la Cidrerie du Minot, élaboré à partir de McIntosh, Lobo et Cortland. Léger, fruité et vif, à 7 % d’alcool.",

  seoTitle:
    "La Bolée — Cidrerie du Minot | Le Premier Verre",

  seoDescription:
    "Découvrez La Bolée de la Cidrerie du Minot, un cidre tranquille québécois sec de McIntosh, Lobo et Cortland, vif et fruité.",

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
  console.error(`❌ Doublon détecté : ${duplicate._id} — ${duplicate.name}`);
  process.exit(1);
}

await client.create(wine);

console.log(`✅ C02 créé : ${wine._id}`);
console.log(`   ${wine.name} — Cidrerie du Minot`);
console.log(`   Type : ${wine.beverageType}`);
console.log(`   Catégorie : Cidres`);
console.log(`   Pommes : ${wine.appleVarieties.join(", ")}`);
console.log(`   Accords : ${wine.foodPairings.length}`);
console.log(`   SKU : ${wine.sku}`);
