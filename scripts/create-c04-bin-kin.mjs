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
  _id: "wine-domaine-lafrance-bin-kin",
  _type: "wine",

  name: "Bin Kin",
  slug: {
    _type: "slug",
    current: "bin-kin-domaine-lafrance",
  },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-domaine-lafrance"),
  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-quebec"),

  categories: [
    { _key: "cidres", ...ref("category-cidres") },
  ],

  approxPrice: 18.95,
  purchaseChannel: "producer",
  purchaseChannelDetails:
    "Disponible notamment auprès du Domaine Lafrance; disponibilité et prix à vérifier.",
  purchaseChannelDetailsEn:
    "Available notably from Domaine Lafrance; current availability and price should be confirmed.",
  purchaseUrl: "https://domainelafrance.com/produits/",
  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Un pétillant naturel québécois résolument sec, vif et désaltérant, qui place la pomme dans un registre brut et gastronomique.",
  oneLinerEn:
    "A decidedly dry, lively Québec pét-nat that puts apples in a raw, refreshing and food-friendly register.",

  tastingKeywords: [
    "pomme fraîche",
    "agrumes",
    "levure",
    "fraîcheur",
  ],
  tastingKeywordsEn: [
    "fresh apple",
    "citrus",
    "yeast",
    "freshness",
  ],

  perfectFor: [
    "apéritif",
    "huîtres",
    "plateau de fromages",
  ],
  perfectForEn: [
    "aperitif",
    "oysters",
    "cheese board",
  ],

  whyWeRecommend:
    "Parce qu’il déplace complètement les repères habituels du cidre. Très sec et présenté dans l’esprit d’un pétillant naturel, Bin Kin parle autant aux amateurs de bulles peu dosées qu’aux curieux du vin nature. C’est une bouteille particulièrement utile pour montrer que le cidre québécois peut être brut, gastronomique et contemporain.",
  whyWeRecommendEn:
    "Because it shifts the usual expectations of cider. Very dry and made in the spirit of pétillant naturel, Bin Kin can appeal both to lovers of low-dosage bubbles and to natural-wine drinkers. It is an especially useful bottle for showing how raw, gastronomic and contemporary Québec cider can be.",

  body: 2,
  sweetness: 1,
  roundness: 1,

  servingTemperature: "6–8 °C",
  decant: false,

  foodPairings: [
    { _key: "huitres", ...ref("food-huitres") },
    {
      _key: "fruits-mer",
      ...ref("food-poisson-fruits-de-mer"),
    },
    { _key: "fromages", ...ref("food-fromages") },
    {
      _key: "vegetarien",
      ...ref("food-cuisine-vegetarienne"),
    },
  ],

  style: "Cidre pétillant naturel très sec",
  cellaringPotential:
    "À privilégier jeune pour son énergie, ses bulles et sa fraîcheur.",

  alcohol: 7.5,
  sugar: "< 1,2 g/L",

  acidity: 4,
  tannins: 1,

  aromas: [
    "pomme fraîche",
    "agrumes",
    "notes fermentaires",
  ],

  flavors: [
    "pomme",
    "agrumes",
    "fruits frais",
  ],

  texture:
    "Vive et légère, portée par une effervescence énergique.",
  finish:
    "Très sèche, fraîche et nette.",

  fruitIntensity: 3,
  minerality: 2,
  savory: 2,
  intensity: 3,
  complexity: 3,
  oakInfluence: 1,

  vinification: [
    block(
      "Élaboré dans un style pétillant naturel. Le Domaine Lafrance présente Bin Kin comme un cidre pétillant naturel très sec.",
      "vinification-1"
    ),
  ],

  bottleSize: "750 ml",

  tastingNotes: [
    block(
      "Un cidre au profil vif et très sec, où la pomme fraîche s’accompagne d’impressions d’agrumes et de notes fermentaires. La bouche est légère et énergique, avec une acidité marquée et une effervescence qui accentue la sensation de fraîcheur. La finale demeure nette et peu sucrée.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "A lively, very dry cider where fresh apple is joined by citrus impressions and subtle fermentation notes. The palate is light and energetic, with pronounced acidity and bubbles that reinforce its freshness. The finish remains clean and notably dry.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "Bin Kin appartient à cette génération de cidres qui brouille volontairement la frontière avec le monde du vin nature. Son intérêt ne repose pas sur la douceur ou sur une expression classique de la pomme, mais sur la sécheresse, l’énergie et le caractère de la fermentation. À servir à table et dans un verre à vin plutôt que de le cantonner au rôle de simple cidre d’apéritif.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "Bin Kin belongs to a generation of ciders that deliberately blurs the boundary with natural wine. Its appeal is not built around sweetness or a conventional expression of apple, but around dryness, energy and fermentation character. It deserves a place at the table and in a wine glass rather than being limited to the role of a simple aperitif cider.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "intermediate",

  aiSummary:
    "Cidre pétillant naturel très sec du Domaine Lafrance à Saint-Joseph-du-Lac. Léger, vif et énergique, à 7,5 % d’alcool et moins de 1,2 g/L de sucre.",

  seoTitle:
    "Bin Kin — Domaine Lafrance | Le Premier Verre",

  seoDescription:
    "Découvrez Bin Kin du Domaine Lafrance, un cidre pétillant naturel québécois très sec, vif et gastronomique, élaboré à Saint-Joseph-du-Lac.",

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

console.log(`✅ C04 créé : ${wine._id}`);
console.log(`   ${wine.name} — Domaine Lafrance`);
console.log(`   Type : ${wine.beverageType}`);
console.log(`   Catégorie : Cidres`);
console.log(`   Style : ${wine.style}`);
console.log(`   Accords : ${wine.foodPairings.length}`);
console.log(`   Alcool : ${wine.alcohol} %`);
console.log(`   Sucre : ${wine.sugar}`);
