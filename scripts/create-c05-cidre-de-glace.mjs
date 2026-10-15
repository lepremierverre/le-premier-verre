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
  _id: "wine-domaine-lafrance-cidre-de-glace",
  _type: "wine",

  name: "Cidre de glace",
  slug: {
    _type: "slug",
    current: "cidre-de-glace-domaine-lafrance",
  },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-domaine-lafrance"),
  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-quebec"),

  categories: [
    { _key: "cidres", ...ref("category-cidres") },
  ],

  appleVarieties: ["Cortland", "McIntosh", "Spartan"],

  approxPrice: 23.95,
  purchaseChannel: "saq",
  purchaseChannelDetails: "Disponible à la SAQ selon les stocks.",
  purchaseChannelDetailsEn: "Available at the SAQ, subject to stock.",
  purchaseUrl: "https://www.saq.com/fr/733600",
  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Un cidre de glace québécois riche et concentré où la pomme mûre, le miel et les fruits confits sont portés par une acidité qui garde l’ensemble vivant.",
  oneLinerEn:
    "A rich, concentrated Québec ice cider where ripe apple, honey and candied fruit are lifted by acidity that keeps everything vibrant.",

  tastingKeywords: [
    "pomme confite",
    "miel",
    "abricot",
    "fruits mûrs",
  ],
  tastingKeywordsEn: [
    "candied apple",
    "honey",
    "apricot",
    "ripe fruit",
  ],

  perfectFor: [
    "fromages",
    "dessert",
    "fin de repas",
  ],
  perfectForEn: [
    "cheese",
    "dessert",
    "after dinner",
  ],

  whyWeRecommend:
    "Parce que le cidre de glace est l’une des expressions les plus distinctives du savoir-faire cidricole québécois. Celui du Domaine Lafrance assume sa richesse et sa concentration, mais conserve assez d’acidité pour éviter une impression simplement sucrée. À servir en petite quantité, avec un fromage ou un dessert, pour découvrir ce que le froid québécois peut apporter à la pomme.",
  whyWeRecommendEn:
    "Because ice cider is one of the most distinctive expressions of Québec cider making. Domaine Lafrance embraces richness and concentration while retaining enough acidity to keep the experience from feeling simply sweet. Serve it in a small pour with cheese or dessert to discover what Québec's cold climate can bring to apples.",

  body: 4,
  sweetness: 5,
  roundness: 5,

  servingTemperature: "8–10 °C",
  decant: false,

  foodPairings: [
    { _key: "fromages", ...ref("food-fromages") },
    { _key: "chocolat", ...ref("food-chocolat") },
    {
      _key: "fruits-dessert",
      ...ref("food-fruits-dessert-leger"),
    },
    {
      _key: "creme-brulee",
      ...ref("food-creme-brulee"),
    },
  ],

  style: "Cidre de glace — IGP Cidre de glace du Québec",

  cellaringPotential:
    "Peut évoluer plusieurs années en bouteille; sa concentration et son équilibre sucre-acidité lui donnent un réel potentiel de garde.",

  alcohol: 10.5,
  sugar: "220 g/L",

  acidity: 4,
  tannins: 1,

  aromas: [
    "pomme mûre",
    "pomme confite",
    "miel",
    "abricot",
    "fruits confits",
  ],

  flavors: [
    "pomme concentrée",
    "miel",
    "fruits mûrs",
    "fruits confits",
  ],

  texture:
    "Riche, ample et onctueuse, équilibrée par une acidité bien présente.",

  finish:
    "Longue, concentrée et fruitée, avec une douceur persistante.",

  fruitIntensity: 5,
  minerality: 1,
  savory: 1,
  intensity: 5,
  complexity: 4,
  oakInfluence: 1,

  vinification: [
    block(
      "Élaboré par cryoconcentration à partir de pommes Cortland, McIntosh et Spartan. Les pommes sont cueillies à la main après la première gelée puis pressées. Le jus est ensuite exposé au froid hivernal afin de concentrer naturellement les sucres, les arômes et l’acidité avant une fermentation lente d’environ six mois.",
      "vinification-1"
    ),
  ],

  harvestMethod: "manual",
  bottleSize: "375 ml",
  sku: "733600",

  tastingNotes: [
    block(
      "Le nez est intensément fruité, dominé par la pomme mûre et confite, avec des impressions de miel, d’abricot et de fruits concentrés. La bouche est ample et très douce, mais une acidité soutenue apporte de la tension et évite la lourdeur. La finale est longue, riche et persistante.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "The nose is intensely fruity, led by ripe and candied apple with impressions of honey, apricot and concentrated fruit. The palate is full and distinctly sweet, but sustained acidity provides tension and prevents heaviness. The finish is long, rich and persistent.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "Le cidre de glace est intimement lié au climat québécois : ici, le froid n’est pas seulement une contrainte, il devient un outil de concentration. Chez Domaine Lafrance, les pommes et leur jus passent par le froid hivernal avant une longue fermentation, donnant une bouteille qui concentre le fruit sans perdre complètement sa fraîcheur. Plus qu’un simple vin de dessert à base de pomme, c’est une catégorie à part entière du patrimoine cidricole d’ici.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "Ice cider is intimately connected to Québec's climate: here, cold is not simply a constraint but a tool for concentration. At Domaine Lafrance, winter temperatures help concentrate the apple juice before a long fermentation, producing a bottle that intensifies fruit without completely losing freshness. More than an apple-based dessert drink, it is a category in its own right within Québec's cider heritage.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "beginner",

  aiSummary:
    "Cidre de glace québécois du Domaine Lafrance élaboré par cryoconcentration à partir de Cortland, McIntosh et Spartan. Riche et concentré, à 10,5 % d’alcool et 220 g/L de sucre.",

  seoTitle:
    "Cidre de glace — Domaine Lafrance | Le Premier Verre",

  seoDescription:
    "Découvrez le Cidre de glace du Domaine Lafrance : Cortland, McIntosh et Spartan concentrées par le froid québécois dans un cidre riche et équilibré.",

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

console.log(`✅ C05 créé : ${wine._id}`);
console.log(`   ${wine.name} — Domaine Lafrance`);
console.log("   Type : cider");
console.log("   Catégorie : Cidres");
console.log(`   Pommes : ${wine.appleVarieties.join(", ")}`);
console.log(`   Accords : ${wine.foodPairings.length}`);
console.log(`   Format : ${wine.bottleSize}`);
console.log(`   SKU : ${wine.sku}`);
