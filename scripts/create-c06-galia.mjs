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
  _id: "wine-cidrerie-milton-galia",
  _type: "wine",

  name: "Galia",
  slug: {
    _type: "slug",
    current: "galia-cidrerie-milton",
  },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-cidrerie-milton"),
  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-quebec"),

  categories: [
    { _key: "cidres", ...ref("category-cidres") },
  ],

  appleVarieties: [
    "Cortland",
    "McIntosh",
  ],

  approxPrice: 17.75,
  purchaseChannel: "saq",
  purchaseChannelDetails:
    "Disponible à la SAQ selon les stocks.",
  purchaseChannelDetailsEn:
    "Available at the SAQ, subject to stock.",

  purchaseUrl: "https://www.saq.com/fr/14721909",
  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Un cidre mousseux nature québécois, très sec et tendu, qui transforme Cortland et McIntosh en bulles franches, fraîches et résolument gastronomiques.",
  oneLinerEn:
    "A very dry, vibrant Québec natural sparkling cider that turns Cortland and McIntosh apples into fresh, energetic and distinctly food-friendly bubbles.",

  tastingKeywords: [
    "pomme croquante",
    "melon",
    "fraîcheur",
    "bulles",
  ],
  tastingKeywordsEn: [
    "crisp apple",
    "melon",
    "freshness",
    "bubbles",
  ],

  perfectFor: [
    "apéritif",
    "fruits de mer",
    "repas décontracté",
  ],
  perfectForEn: [
    "aperitif",
    "seafood",
    "casual dinner",
  ],

  whyWeRecommend:
    "Parce que Galia montre une facette particulièrement actuelle du cidre québécois. Très sec, sans sulfites ajoutés et travaillé à partir de Cortland et de McIntosh selon des approches distinctes, il se rapproche davantage de l’univers des bulles nature que du cidre fruité traditionnel. Une excellente bouteille pour faire découvrir le cidre à quelqu’un qui boit déjà du vin nature ou des mousseux peu dosés.",
  whyWeRecommendEn:
    "Because Galia shows a particularly contemporary side of Québec cider. Very dry, made without added sulfites and built from Cortland and McIntosh handled in distinct ways, it sits closer to the world of natural sparkling wine than to conventional fruity cider. An excellent bottle for introducing cider to someone who already enjoys natural wine or low-dosage sparkling wines.",

  body: 2,
  sweetness: 1,
  roundness: 2,

  servingTemperature: "6–8 °C",
  decant: false,

  foodPairings: [
    { _key: "petoncles", ...ref("food-petoncles") },
    {
      _key: "fruits-mer",
      ...ref("food-poisson-fruits-de-mer"),
    },
    {
      _key: "poulet-roti",
      ...ref("food-poulet-roti"),
    },
    { _key: "fromages", ...ref("food-fromages") },
  ],

  style: "Cidre mousseux nature très sec",

  cellaringPotential:
    "À privilégier jeune pour profiter de son énergie, de son fruit et de son effervescence.",

  alcohol: 6.7,
  sugar: "< 1,2 g/L",

  acidity: 4,
  tannins: 1,

  isOrganic: false,
  isNatural: true,
  isBiodynamic: false,
  isVegan: false,

  aromas: [
    "pomme croquante",
    "melon",
    "fruits frais",
  ],

  flavors: [
    "pomme",
    "fruits frais",
    "agrumes",
  ],

  texture:
    "Légère et vive, avec une effervescence franche et une acidité bien présente.",

  finish:
    "Très sèche, fraîche et persistante.",

  fruitIntensity: 3,
  minerality: 2,
  savory: 2,
  intensity: 3,
  complexity: 4,
  oakInfluence: 1,

  vinification: [
    block(
      "Galia réunit deux approches de la pomme. La Cortland est déshydratée à l’extérieur jusqu’à l’hiver afin de concentrer son caractère, tandis que la McIntosh est travaillée par macération sur ses pellicules. Le cidre est élaboré sans sulfites ajoutés.",
      "vinification-1"
    ),
  ],

  bottleSize: "750 ml",
  sku: "14721909",

  tastingNotes: [
    block(
      "Le profil est vif et très sec, dominé par la pomme croquante et des impressions de melon et de fruits frais. L’acidité donne beaucoup d’élan à la bouche tandis que l’effervescence accentue la sensation de fraîcheur. La finale est nette, sèche et désaltérante.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "The profile is lively and very dry, led by crisp apple with impressions of melon and fresh fruit. Bright acidity drives the palate while the bubbles reinforce the sense of freshness. The finish is clean, dry and refreshing.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "Galia est intéressant parce qu’il traite la pomme avec un vocabulaire que les amateurs de vin reconnaîtront immédiatement : concentration du fruit, macération sur pellicules, très peu de sucre et absence de sulfites ajoutés. Le résultat n’essaie pas d’imiter le vin; il montre plutôt jusqu’où le cidre peut aller lorsqu’on considère la pomme comme une véritable matière de terroir.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "Galia is compelling because it approaches apples with a vocabulary wine drinkers will immediately recognize: fruit concentration, skin maceration, very little residual sugar and no added sulfites. The result does not try to imitate wine; instead, it shows how far cider can go when apples are treated as genuine terroir-driven raw material.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "intermediate",

  aiSummary:
    "Cidre mousseux nature très sec de la Cidrerie Milton, élaboré avec Cortland et McIntosh. 6,7 % d’alcool, moins de 1,2 g/L de sucre, sans sulfites ajoutés et offert en bouteille de 750 ml.",

  seoTitle:
    "Galia — Cidrerie Milton | Le Premier Verre",

  seoDescription:
    "Découvrez Galia de la Cidrerie Milton, un cidre mousseux nature québécois très sec de Cortland et McIntosh, offert en bouteille de 750 ml.",

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

console.log(`✅ C06 créé : ${wine._id}`);
console.log(`   ${wine.name} — Cidrerie Milton`);
console.log("   Type : cider");
console.log("   Catégorie : Cidres");
console.log(`   Pommes : ${wine.appleVarieties.join(", ")}`);
console.log(`   Accords : ${wine.foodPairings.length}`);
console.log(`   Format : ${wine.bottleSize}`);
console.log(`   SKU SAQ : ${wine.sku}`);
console.log(`   Prix approx. : ${wine.approxPrice} $`);
