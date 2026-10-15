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
  _id: "wine-aspall-premier-cru-cyder",
  _type: "wine",

  name: "Premier Cru Cyder",

  slug: {
    _type: "slug",
    current: "aspall-premier-cru-cyder",
  },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-aspall"),
  country: ref("country-angleterre"),
  region: ref("region-suffolk"),

  categories: [
    {
      _key: "cidres",
      ...ref("category-cidres"),
    },
  ],

  appleVarieties: [],

  approxPrice: 4.50,
  purchaseChannel: "other",

  purchaseChannelDetails:
    "Prix indicatif au Royaume-Uni : 26,99 £ la caisse de 6 bouteilles de 500 ml, soit environ 4,50 £ la bouteille. Aucune disponibilité québécoise vérifiée au 2 octobre 2026.",

  purchaseChannelDetailsEn:
    "Indicative UK price: £26.99 for six 500 ml bottles, approximately £4.50 per bottle. No verified Québec availability as of October 2, 2026.",

  purchaseUrl:
    "https://www.sharpsbrewery.co.uk/products/aspall-premier-cru-cyder",

  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Un cidre anglais sec et effervescent, floral et élégant, qui montre le visage précis et gastronomique du Suffolk.",

  oneLinerEn:
    "A dry, sparkling English cyder with floral elegance and a precise, food-friendly Suffolk character.",

  tastingKeywords: [
    "sec",
    "floral",
    "effervescent",
    "élégant",
  ],

  tastingKeywordsEn: [
    "dry",
    "floral",
    "sparkling",
    "elegant",
  ],

  perfectFor: [
    "apéro à table",
    "fromages anglais",
    "découvrir le cidre anglais",
  ],

  perfectForEn: [
    "aperitif at the table",
    "English cheeses",
    "discovering English cider",
  ],

  whyWeRecommend:
    "Parce qu’il apporte au répertoire une expression très différente du cidre québécois, asturien ou français. Premier Cru mise sur la sécheresse, l’effervescence et un registre floral élégant plutôt que sur le sucre ou un fruit exubérant. C’est une bouteille particulièrement intéressante pour les amateurs de bulles sèches.",

  whyWeRecommendEn:
    "Because it brings a distinctly different expression to the directory compared with Québec, Asturian or French cider. Premier Cru emphasizes dryness, sparkle and elegant floral character rather than sweetness or exuberant fruit. It is especially appealing for drinkers who enjoy dry sparkling wines.",

  body: 3,
  sweetness: 1,
  roundness: 2,

  servingTemperature: "5–8 °C",
  decant: false,

  foodPairings: [
    {
      _key: "fromages",
      ...ref("food-fromages"),
    },
    {
      _key: "charcuteries",
      ...ref("food-planche-charcuteries"),
    },
    {
      _key: "poisson-fruits-mer",
      ...ref("food-poisson-fruits-de-mer"),
    },
    {
      _key: "poulet-roti",
      ...ref("food-poulet-roti"),
    },
  ],

  style: "Cidre anglais sec effervescent",

  cellaringPotential:
    "À boire principalement pour sa fraîcheur, son effervescence et son profil floral.",

  alcohol: 6.8,

  acidity: 3,
  tannins: 2,

  isOrganic: false,
  isNatural: false,
  isBiodynamic: false,
  isVegan: true,

  certifications: [],

  aromas: [
    "fleurs",
    "verger",
    "pomme fraîche",
  ],

  flavors: [
    "pomme",
    "fruits du verger",
    "notes florales",
  ],

  texture:
    "Effervescente, nette et sèche, avec une structure élégante et rafraîchissante.",

  finish:
    "Longue, sèche et florale.",

  fruitIntensity: 3,
  minerality: 2,
  savory: 2,
  intensity: 3,
  complexity: 3,
  oakInfluence: 1,

  bottleSize: "500 ml",

  tastingNotes: [
    block(
      "Un cidre effervescent résolument sec, marqué par des arômes floraux élégants et la fraîcheur de la pomme. La bouche est nette et rafraîchissante, avec une effervescence vive et une finale longue et sèche.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "A decidedly dry sparkling cyder showing elegant floral aromas and fresh apple character. The palate is clean and refreshing, with lively bubbles and a long, dry finish.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "Premier Cru est une bonne porte d’entrée pour comprendre le cidre anglais du Suffolk. Ici, le mot « cru » ne doit pas être lu comme une classification viticole française : il s’agit du nom de la cuvée. Le style est surtout intéressant pour son équilibre entre effervescence, sécheresse et caractère floral. Servi bien frais à table, il peut jouer un rôle proche de celui d’un vin effervescent sec.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "Premier Cru is a useful introduction to Suffolk's English cyder tradition. Here, the word 'cru' should not be interpreted as a French wine classification; it is simply the name of the cuvée. The style stands out for its balance of sparkle, dryness and floral character. Served well chilled at the table, it can occupy a role similar to a dry sparkling wine.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "beginner",

  aiSummary:
    "Cidre anglais sec et effervescent produit par Aspall dans le Suffolk. 6,8 % d’alcool, format 500 ml, profil floral et finale longue et sèche. Convient aux végétaliens.",

  seoTitle:
    "Aspall Premier Cru Cyder | Le Premier Verre",

  seoDescription:
    "Découvrez Aspall Premier Cru Cyder, un cidre anglais sec et effervescent du Suffolk à 6,8 %, au profil floral et à la finale longue et sèche.",

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

const requiredRefs = [
  "producer-aspall",
  "country-angleterre",
  "region-suffolk",
  "category-cidres",
  "food-fromages",
  "food-planche-charcuteries",
  "food-poisson-fruits-de-mer",
  "food-poulet-roti",
];

const foundRefs = await client.fetch(
  `*[_id in $ids]._id`,
  { ids: requiredRefs }
);

const missingRefs = requiredRefs.filter(id => !foundRefs.includes(id));

if (missingRefs.length) {
  console.error("❌ Références manquantes :", missingRefs);
  process.exit(1);
}

await client.create(wine);

const created = await client.fetch(
  `*[_id == $id][0]{
    _id,
    name,
    beverageType,
    alcohol,
    bottleSize,
    producer->{name},
    country->{name},
    region->{name},
    categories[]->{title},
    "foodCount": count(foodPairings)
  }`,
  { id: wine._id }
);

console.log("✅ C10 créé et vérifié");
console.log(`   ${created.name} — ${created.producer?.name}`);
console.log(`   ${created.region?.name}, ${created.country?.name}`);
console.log(`   Type : ${created.beverageType}`);
console.log(`   Alcool : ${created.alcohol} %`);
console.log(`   Format : ${created.bottleSize}`);
console.log(`   Catégorie : ${created.categories?.join(", ")}`);
console.log(`   Accords : ${created.foodCount}/4`);
