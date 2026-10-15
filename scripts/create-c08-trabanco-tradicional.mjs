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
  _id: "wine-trabanco-sidra-tradicional",
  _type: "wine",

  name: "Sidra Trabanco Tradicional",
  slug: {
    _type: "slug",
    current: "sidra-trabanco-tradicional",
  },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-trabanco"),
  country: ref("country-espagne"),
  region: ref("region-asturies"),

  categories: [
    { _key: "cidres", ...ref("category-cidres") },
  ],

  approxPrice: 0,
  purchaseChannel: "other",
  purchaseChannelDetails:
    "Non répertorié à la SAQ lors de notre dernière vérification. Vérifier la disponibilité auprès de détaillants spécialisés ou du producteur.",
  purchaseChannelDetailsEn:
    "Not listed at the SAQ at our last check. Check availability through specialty retailers or the producer.",

  purchaseUrl: "https://www.sidratrabanco.com/sidra-natural",
  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Une sidra natural asturienne sèche, rustique et gastronomique, fermentée principalement en fûts de châtaignier et profondément ancrée dans la tradition locale.",
  oneLinerEn:
    "A dry, rustic and food-friendly Asturian natural cider, fermented mainly in chestnut barrels and deeply rooted in local tradition.",

  tastingKeywords: [
    "pomme mûre",
    "herbes fines",
    "sec",
    "tanins",
  ],
  tastingKeywordsEn: [
    "ripe apple",
    "fine herbs",
    "dry",
    "tannins",
  ],

  perfectFor: [
    "charcuteries",
    "repas rustique",
    "découverte des cidres européens",
  ],
  perfectForEn: [
    "charcuterie",
    "rustic meal",
    "exploring European cider",
  ],

  whyWeRecommend:
    "Parce qu’elle permet de comprendre que le cidre possède ses propres traditions régionales, tout comme le vin. Trabanco Tradicional n’est ni une bulle fruitée ni un cidre doux : c’est une sidra natural sèche, structurée et légèrement tannique, pensée pour être bue à table et profondément liée à la culture des Asturies.",
  whyWeRecommendEn:
    "Because it shows that cider has its own regional traditions, much like wine. Trabanco Tradicional is neither a fruity sparkling cider nor a sweet one: it is a dry, structured and slightly tannic natural cider made for the table and deeply connected to Asturian culture.",

  body: 3,
  sweetness: 1,
  roundness: 2,

  servingTemperature: "8–10 °C",
  decant: false,

  foodPairings: [
    { _key: "fromages", ...ref("food-fromages") },
    {
      _key: "charcuteries",
      ...ref("food-planche-charcuteries"),
    },
    {
      _key: "poisson",
      ...ref("food-poisson-grille"),
    },
    {
      _key: "saucisses",
      ...ref("food-saucisses"),
    },
  ],

  style: "Sidra natural asturienne",

  cellaringPotential:
    "À privilégier relativement jeune afin de conserver son caractère frais et expressif.",

  alcohol: 6,

  acidity: 4,
  tannins: 3,

  isOrganic: false,
  isNatural: true,
  isBiodynamic: false,
  isVegan: false,

  aromas: [
    "pomme mûre",
    "herbes aromatiques",
    "notes fermentaires",
  ],

  flavors: [
    "pomme",
    "herbes fines",
    "notes légèrement amères",
  ],

  texture:
    "Sèche et structurée, avec une présence tannique inhabituelle pour qui découvre la sidra asturienne.",

  finish:
    "Sèche, légèrement tannique et persistante.",

  fruitIntensity: 3,
  minerality: 2,
  savory: 4,
  intensity: 3,
  complexity: 4,
  oakInfluence: 2,

  vinification: [
    block(
      "Élaborée à partir de jus de pomme 100 % naturel provenant de catégories de pommes à cidre amères, acides et acidulées. Le jus fermente avec ses levures naturelles à température contrôlée, principalement dans les grands fûts traditionnels de châtaignier utilisés par Trabanco.",
      "vinification-1"
    ),
  ],

  aging:
    "Travail traditionnel principalement en grands contenants de bois de châtaignier.",

  bottleSize: "700 ml",

  tastingNotes: [
    block(
      "Le nez est complexe et sec, avec des notes de pomme mûre et d’herbes fines. En bouche, le cidre est franc, peu sucré et structuré par une acidité marquée et des tanins secs. L’ensemble possède un caractère plus rustique et gastronomique que les cidres fruités modernes, avec une finale persistante et légèrement amère.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "The nose is complex and dry, with ripe apple and subtle fine-herb notes. On the palate, the cider is direct and dry, structured by bright acidity and dry tannins. It feels more rustic and food-oriented than modern fruit-driven ciders, finishing with persistence and a slight bitter edge.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "Pour comprendre Trabanco, il faut oublier un instant l’idée nord-américaine du cidre. Dans les Asturies, la sidra natural appartient à une culture entière : cidreries, nourriture, service et gestes traditionnels. Cette bouteille est une excellente porte d’entrée dans cet univers. Elle est sèche, acidulée, légèrement tannique et volontairement moins polie qu’un cidre mousseux conventionnel. C’est précisément ce qui la rend intéressante.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "To understand Trabanco, it helps to set aside the North American idea of cider for a moment. In Asturias, natural cider belongs to an entire culture involving cider houses, food, service and traditional rituals. This bottle is an excellent introduction to that world. It is dry, tart, slightly tannic and deliberately less polished than conventional sparkling cider. That is precisely what makes it interesting.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "intermediate",

  aiSummary:
    "Sidra natural traditionnelle des Asturies élaborée par Trabanco. 6 % d’alcool, 700 ml, fermentation avec levures naturelles principalement en fûts de châtaignier, avec un profil sec de pomme mûre, herbes fines et tanins.",

  seoTitle:
    "Trabanco Tradicional — Sidra Natural des Asturies | Le Premier Verre",

  seoDescription:
    "Découvrez Trabanco Tradicional, une sidra natural asturienne sèche de 6 %, fermentée principalement en fûts traditionnels de châtaignier.",

  published: true,
};

const duplicate = await client.fetch(
  `*[_type == "wine" && (
    _id == $id ||
    slug.current == $slug
  )][0]{_id,name}`,
  {
    id: wine._id,
    slug: wine.slug.current,
  }
);

if (duplicate) {
  console.error(`❌ Doublon détecté : ${duplicate._id} — ${duplicate.name}`);
  process.exit(1);
}

await client.create(wine);

console.log(`✅ C08 créé : ${wine._id}`);
console.log(`   ${wine.name} — Trabanco`);
console.log("   Origine : Asturies, Espagne");
console.log("   Catégorie : Cidres");
console.log(`   Style : ${wine.style}`);
console.log(`   Alcool : ${wine.alcohol} %`);
console.log(`   Format : ${wine.bottleSize}`);
console.log(`   Accords : ${wine.foodPairings.length}`);
