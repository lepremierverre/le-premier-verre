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
  _id: "wine-cidrerie-michel-jodoin-petillant-rose",
  _type: "wine",

  name: "Pétillant Rosé",
  slug: {
    _type: "slug",
    current: "petillant-rose-cidrerie-michel-jodoin",
  },

  beverageType: "cider",
  alcoholFree: false,

  producer: ref("producer-cidrerie-michel-jodoin"),
  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-monteregie"),

  categories: [
    { _key: "cidres", ...ref("category-cidres") },
  ],

  appleVarieties: ["McIntosh", "Geneva"],

  approxPrice: 16.25,
  purchaseChannel: "saq",
  purchaseChannelDetails: "Disponible à la SAQ selon les stocks.",
  purchaseChannelDetailsEn: "Available at the SAQ, subject to stock.",
  purchaseUrl: "https://www.saq.com/fr/13514297",
  purchaseLastChecked: "2026-10-02",

  oneLiner:
    "Un cidre rosé pétillant de Rougemont où la fraîcheur de la McIntosh rencontre le fruit et la couleur naturellement expressive de la Geneva.",
  oneLinerEn:
    "A sparkling rosé cider from Rougemont where fresh McIntosh meets the naturally expressive fruit and colour of Geneva.",

  tastingKeywords: [
    "pomme fraîche",
    "petits fruits rouges",
    "fleurs",
    "fruits frais",
  ],
  tastingKeywordsEn: [
    "fresh apple",
    "red berries",
    "flowers",
    "fresh fruit",
  ],

  perfectFor: [
    "apéritif",
    "sushis",
    "terrasse",
  ],
  perfectForEn: [
    "aperitif",
    "sushi",
    "patio",
  ],

  whyWeRecommend:
    "Parce qu’il permet de découvrir la Geneva, une pomme à chair rouge devenue emblématique du travail de Michel Jodoin. Le cidre demeure facile d’approche, mais son fruit, sa couleur et sa fraîcheur lui donnent une vraie personnalité. Une belle bouteille pour montrer que le rosé québécois peut aussi passer par la pomme.",
  whyWeRecommendEn:
    "Because it offers an accessible introduction to Geneva, the red-fleshed apple that has become emblematic of Michel Jodoin's work. The cider remains easy to enjoy, while its fruit, colour and freshness give it real personality. A great bottle for showing that Québec rosé can also begin with apples.",

  body: 2,
  sweetness: 2,
  roundness: 2,

  servingTemperature: "8 °C",
  decant: false,

  foodPairings: [
    { _key: "sushis", ...ref("food-sushis") },
    { _key: "crevettes", ...ref("food-crevettes") },
    { _key: "salade-chevre", ...ref("food-salade-chevre") },
    {
      _key: "asiatique",
      ...ref("food-cuisine-asiatique-sucree-salee"),
    },
  ],

  style: "Cidre rosé pétillant",
  cellaringPotential:
    "À boire jeune pour profiter pleinement de son fruit et de sa fraîcheur.",

  alcohol: 6.4,
  sugar: "20 g/L",

  acidity: 4,
  tannins: 1,

  isOrganic: false,
  isNatural: false,
  isBiodynamic: false,
  isVegan: false,

  aromas: [
    "pomme fraîche",
    "fruits rouges",
    "notes florales",
    "fruits frais",
  ],

  flavors: [
    "pomme",
    "petits fruits rouges",
    "fruits frais",
  ],

  texture:
    "Légère et vive, avec une effervescence rafraîchissante.",
  finish:
    "Fruitée, fraîche et nette.",

  fruitIntensity: 4,
  minerality: 1,
  savory: 1,
  intensity: 3,
  complexity: 2,
  oakInfluence: 1,

  vinification: [
    block(
      "Élaboré à partir de pommes McIntosh et Geneva. Fermentation en cuve inox, suivie d’une filtration puis d’une gazéification avant la mise en bouteille.",
      "vinification-1"
    ),
  ],

  bottleSize: "750 ml",
  sku: "13514297",

  tastingNotes: [
    block(
      "Le nez met de l’avant la pomme fraîche, accompagnée de notes fruitées et florales ainsi que d’une impression de petits fruits rouges. En bouche, le cidre est léger et vif, avec une douceur modérée équilibrée par une acidité rafraîchissante. L’effervescence accentue son caractère désaltérant.",
      "tasting-fr-1"
    ),
  ],

  tastingNotesEn: [
    block(
      "The nose leads with fresh apple, joined by fruity and floral notes and an impression of red berries. The palate is light and lively, with moderate sweetness balanced by refreshing acidity. The bubbles reinforce its thirst-quenching character.",
      "tasting-en-1"
    ),
  ],

  editorialNote: [
    block(
      "La Geneva est au cœur de l’intérêt de cette bouteille. Sa chair rouge permet d’obtenir une couleur naturellement distinctive tout en apportant une dimension fruitée au cidre. Associée à la McIntosh et présentée dans un style pétillant accessible, elle offre une façon simple de découvrir l’une des signatures de la Cidrerie Michel Jodoin.",
      "editorial-fr-1"
    ),
  ],

  editorialNoteEn: [
    block(
      "Geneva is at the heart of this bottle's appeal. Its red flesh gives the cider a naturally distinctive colour while contributing an additional fruity dimension. Paired with McIntosh in an approachable sparkling style, it offers an easy way to discover one of Cidrerie Michel Jodoin's signatures.",
      "editorial-en-1"
    ),
  ],

  experienceLevel: "beginner",

  aiSummary:
    "Cidre rosé pétillant de la Cidrerie Michel Jodoin à Rougemont, élaboré à partir de McIntosh et de Geneva. Fruité, frais et vif, à 6,4 % d’alcool.",

  seoTitle:
    "Pétillant Rosé — Michel Jodoin | Le Premier Verre",

  seoDescription:
    "Découvrez le Pétillant Rosé de Michel Jodoin, un cidre québécois de McIntosh et Geneva, fruité, frais et pétillant, élaboré à Rougemont.",

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

console.log(`✅ C03 créé : ${wine._id}`);
console.log(`   ${wine.name} — Cidrerie Michel Jodoin`);
console.log(`   Type : ${wine.beverageType}`);
console.log(`   Catégorie : Cidres`);
console.log(`   Pommes : ${wine.appleVarieties.join(", ")}`);
console.log(`   Accords : ${wine.foodPairings.length}`);
console.log(`   SKU : ${wine.sku}`);
