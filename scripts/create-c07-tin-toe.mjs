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
  _id: "wine-domaine-lafrance-tin-toe",
  _type: "wine",

  name: "Tin Toé",
  slug: {
    _type: "slug",
    current: "tin-toe-domaine-lafrance",
  },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-domaine-lafrance"),
  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-quebec"),

  categories: [
    { _key: "cidres", ...ref("category-cidres") },
  ],

  approxPrice: 17.95,
  purchaseChannel: "saq",
  purchaseChannelDetails:
    "Disponible à la SAQ selon les stocks.",
  purchaseChannelDetailsEn:
    "Available at the SAQ, subject to stock.",
  purchaseUrl: "https://www.saq.com/fr/14758904",
  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Un cidre québécois demi-sec, vineux et structuré, où la pomme mûre rencontre les fleurs blanches, les fruits blancs et une touche de foin.",
  oneLinerEn:
    "A structured, wine-like off-dry Québec cider where ripe apple meets white flowers, white fruit and a subtle hay note.",

  tastingKeywords: [
    "pomme mûre",
    "fleurs blanches",
    "fruits blancs",
    "foin",
  ],
  tastingKeywordsEn: [
    "ripe apple",
    "white flowers",
    "white fruit",
    "hay",
  ],

  perfectFor: [
    "fromages",
    "cuisine asiatique",
    "repas à table",
  ],
  perfectForEn: [
    "cheese",
    "Asian cuisine",
    "dinner table",
  ],

  whyWeRecommend:
    "Parce que Tin Toé montre une autre dimension du cidre québécois. Avec ses 12 % d’alcool, son profil demi-sec et son corps plus présent, il se rapproche davantage d’une bouteille destinée à la table que d’un simple cidre rafraîchissant. C’est aussi un excellent contrepoint aux cidres très secs et aux cidres de glace : la pomme y prend une expression plus ample, florale et structurée.",
  whyWeRecommendEn:
    "Because Tin Toé shows another dimension of Québec cider. At 12% alcohol, with an off-dry profile and greater body, it feels more like a bottle made for the table than a simple refreshing cider. It also provides an excellent counterpoint to very dry ciders and ice cider, giving apple a broader, more floral and structured expression.",

  body: 3,
  sweetness: 3,
  roundness: 3,

  servingTemperature: "4–6 °C",
  decant: false,

  foodPairings: [
    { _key: "fromages", ...ref("food-fromages") },
    {
      _key: "asiatique",
      ...ref("food-cuisine-asiatique-sucree-salee"),
    },
    { _key: "porc", ...ref("food-porc") },
    { _key: "poulet", ...ref("food-poulet-roti") },
  ],

  style: "Cidre demi-sec",

  cellaringPotential:
    "Prêt à boire; à privilégier relativement jeune pour conserver son fruit et sa fraîcheur.",

  alcohol: 12,
  sugar: "24 g/L",

  acidity: 4,
  tannins: 1,

  isOrganic: true,
  isNatural: false,
  isBiodynamic: false,
  isVegan: false,

  certifications: [
    "Produit bio",
  ],

  aromas: [
    "fleurs blanches",
    "foin",
    "fruits blancs",
    "pomme mûre",
  ],

  flavors: [
    "pomme mûre",
    "fruits blancs",
    "notes florales",
  ],

  texture:
    "Mi-corsée et souple, avec une douceur perceptible équilibrée par une acidité présente.",

  finish:
    "Fruitée, légèrement douce et fraîche.",

  fruitIntensity: 4,
  minerality: 2,
  savory: 2,
  intensity: 3,
  complexity: 3,
  oakInfluence: 1,

  vinification: [
    block(
      "Cidre québécois élaboré par le Domaine Lafrance. Les sources officielles consultées ne précisent pas les variétés de pommes ni les détails techniques de vinification de cette cuvée; ces éléments sont donc volontairement laissés non spécifiés.",
      "vinification-1"
    ),
  ],

  bottleSize: "750 ml",
  sku: "14758904",

  tastingNotes: [
    block(
      "Le nez associe la pomme mûre aux fleurs blanches, aux fruits blancs et à une discrète note de foin. La bouche est mi-corsée et demi-sèche, avec une douceur perceptible que vient équilibrer une acidité bien présente. L’ensemble possède davantage de volume et de structure que plusieurs cidres légers, tout en conservant une expression nette de la pomme.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "The nose combines ripe apple with white flowers, white fruit and a subtle hay note. The palate is medium-bodied and off-dry, with noticeable sweetness balanced by lively acidity. It carries more volume and structure than many lighter ciders while maintaining a clear expression of apple.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "Avec Tin Toé, on quitte le registre du cidre léger qu’on ouvre uniquement à l’apéritif. Ses 12 % d’alcool, son corps plus affirmé et son équilibre demi-sec lui donnent une vraie présence à table. Dans le répertoire LPV, il permet surtout de montrer que la catégorie cidre ne se résume pas à une opposition entre bulles très sèches et cidres de glace très doux : il existe tout un territoire entre les deux.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "Tin Toé moves beyond the idea of a light cider reserved for the aperitif. Its 12% alcohol, fuller body and off-dry balance give it genuine presence at the table. Within the LPV directory, it also helps show that cider is not simply a choice between bone-dry bubbles and intensely sweet ice cider: there is an entire territory between the two.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "beginner",

  aiSummary:
    "Cidre québécois bio demi-sec du Domaine Lafrance, en bouteille de 750 ml. 12 % d’alcool, 24 g/L de sucre, avec des notes de pomme mûre, fleurs blanches, fruits blancs et foin.",

  seoTitle:
    "Tin Toé — Domaine Lafrance | Le Premier Verre",

  seoDescription:
    "Découvrez Tin Toé du Domaine Lafrance, un cidre québécois bio demi-sec de 12 %, floral, fruité et structuré, offert en 750 ml.",

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

console.log(`✅ C07 créé : ${wine._id}`);
console.log(`   ${wine.name} — Domaine Lafrance`);
console.log("   Type : cider");
console.log("   Catégorie : Cidres");
console.log(`   Style : ${wine.style}`);
console.log(`   Accords : ${wine.foodPairings.length}`);
console.log(`   Format : ${wine.bottleSize}`);
console.log(`   SKU SAQ : ${wine.sku}`);
console.log(`   Prix approx. : ${wine.approxPrice} $`);
