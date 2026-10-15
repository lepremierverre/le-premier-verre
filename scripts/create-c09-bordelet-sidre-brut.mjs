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
  _id: "wine-eric-bordelet-sidre-brut",
  _type: "wine",

  name: "Sidre Brut",
  slug: {
    _type: "slug",
    current: "sidre-brut-eric-bordelet",
  },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-eric-bordelet"),
  country: ref("country-france"),
  region: ref("region-pays-de-la-loire"),

  categories: [
    { _key: "cidres", ...ref("category-cidres") },
  ],

  approxPrice: 18.30,
  purchaseChannel: "private-import",

  purchaseChannelDetails:
    "Disponible au Québec en importation privée auprès de La QV. Prix particulier observé : 18,30 $ par bouteille, vendue en caisse de 6. Vérifier le prix et la disponibilité au moment de commander.",

  purchaseChannelDetailsEn:
    "Available in Québec through private import agency La QV. Observed consumer price: $18.30 per bottle, sold by the case of six. Check current price and availability before ordering.",

  purchaseUrl: "https://laqv.ca/products/sidre-brut",
  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Le cidre extra-sec classique d’Éric Bordelet : vif, structuré et gastronomique, avec la précision d’un ancien sommelier et la complexité d’un grand assemblage de pommes.",

  oneLinerEn:
    "Éric Bordelet's classic extra-dry cider: lively, structured and food-friendly, combining a former sommelier's precision with the complexity of a broad apple blend.",

  tastingKeywords: [
    "pomme",
    "sec",
    "acidulé",
    "structuré",
  ],

  tastingKeywordsEn: [
    "apple",
    "dry",
    "tart",
    "structured",
  ],

  perfectFor: [
    "charcuteries",
    "repas à table",
    "découvrir le cidre français",
  ],

  perfectForEn: [
    "charcuterie",
    "dinner table",
    "discovering French cider",
  ],

  whyWeRecommend:
    "Parce que c’est une excellente bouteille pour comprendre le cidre gastronomique français sans commencer par une cuvée plus ambitieuse ou plus chère. Le Sidre Brut est sec, énergique et structuré, mais demeure très accessible à table. Il montre surtout comment l’assemblage de nombreuses variétés de pommes peut donner au cidre autant de relief qu’un assemblage de cépages dans le vin.",

  whyWeRecommendEn:
    "Because it is an excellent introduction to gastronomic French cider without starting with a more ambitious or expensive cuvée. Sidre Brut is dry, energetic and structured while remaining highly approachable at the table. Above all, it shows how blending numerous apple varieties can give cider the same kind of dimension that grape blending can bring to wine.",

  body: 3,
  sweetness: 1,
  roundness: 2,

  servingTemperature: "8–10 °C",
  decant: false,

  foodPairings: [
    {
      _key: "charcuteries",
      ...ref("food-planche-charcuteries"),
    },
    {
      _key: "fromages",
      ...ref("food-fromages"),
    },
    {
      _key: "poulet",
      ...ref("food-poulet-roti"),
    },
    {
      _key: "poisson",
      ...ref("food-poisson-grille"),
    },
  ],

  style: "Cidre extra-sec",

  cellaringPotential:
    "Peut évoluer en bouteille, mais peut être apprécié dès maintenant pour son fruit, sa tension et sa fraîcheur.",

  alcohol: 7,

  acidity: 4,
  tannins: 3,

  isOrganic: true,
  isNatural: false,
  isBiodynamic: false,
  isVegan: false,

  certifications: [
    "Vergers certifiés biologiques",
  ],

  aromas: [
    "pomme fraîche",
    "pomme mûre",
    "notes florales",
    "agrumes",
  ],

  flavors: [
    "pomme",
    "fruits frais",
    "notes acidulées",
  ],

  texture:
    "Sèche et structurée, avec une matière nette, une acidité vive et une effervescence rafraîchissante.",

  finish:
    "Sèche, tendue et persistante.",

  fruitIntensity: 3,
  minerality: 3,
  savory: 3,
  intensity: 3,
  complexity: 4,
  oakInfluence: 1,

  vinification: [
    block(
      "Les pommes sont récoltées manuellement et sélectionnées selon leur maturité. Les différentes variétés sont travaillées séparément avant assemblage : broyage grossier, pressurage délicat, débourbage et soutirage du jus. La fermentation ancestrale se poursuit en cuve puis en bouteille pendant plusieurs semaines ou plusieurs mois selon la récolte, sans ajout de saccharose.",
      "vinification-1"
    ),
  ],

  harvestMethod: "manual",

  bottleSize: "750 ml",
  sku: "15168842",

  tastingNotes: [
    block(
      "Un cidre résolument sec et rafraîchissant, construit autour de la pomme fraîche et mûre, avec des nuances florales et acidulées. La bouche possède une belle tension, une acidité vive et suffisamment de structure tannique pour accompagner un repas. La finale est nette, sèche et persistante.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "A decidedly dry and refreshing cider built around fresh and ripe apple, with floral and tart nuances. The palate shows bright tension, lively acidity and enough tannic structure to accompany a meal. The finish is clean, dry and persistent.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "Éric Bordelet parle de pommes comme un vigneron parlerait de cépages. Son Sidre Brut est probablement l’une des façons les plus simples de comprendre cette démarche : plusieurs profils de pommes sont assemblés pour rechercher non pas seulement le fruit, mais un équilibre entre matière, acidité, amertume et tanins. À table, il peut prendre exactement la place qu’on réserverait spontanément à un blanc sec ou à des bulles peu dosées.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "Éric Bordelet speaks about apples much as a winemaker would speak about grape varieties. Sidre Brut is one of the clearest ways to understand that approach: multiple apple profiles are blended not simply for fruit, but to balance texture, acidity, bitterness and tannin. At the table, it can comfortably occupy the place normally reserved for a dry white wine or low-dosage sparkling wine.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "beginner",

  aiSummary:
    "Cidre extra-sec français d’Éric Bordelet, élaboré à partir d’un assemblage de pommes issues de vergers biologiques. Récolte manuelle, fermentation ancestrale, 7 % d’alcool, 750 ml. Disponible au Québec en importation privée.",

  seoTitle:
    "Sidre Brut — Éric Bordelet | Le Premier Verre",

  seoDescription:
    "Découvrez le Sidre Brut d’Éric Bordelet, un cidre français extra-sec de 7 %, biologique, structuré et gastronomique, disponible au Québec en importation privée.",

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

console.log(`✅ C09 créé : ${wine._id}`);
console.log(`   ${wine.name} — Éric Bordelet`);
console.log("   Région : Pays de la Loire");
console.log("   Catégorie : Cidres");
console.log(`   Style : ${wine.style}`);
console.log(`   Alcool : ${wine.alcohol} %`);
console.log(`   Format : ${wine.bottleSize}`);
console.log(`   Code article : ${wine.sku}`);
console.log(`   Prix approx. : ${wine.approxPrice} $`);
console.log(`   Accords : ${wine.foodPairings.length}`);
