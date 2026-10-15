import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const PRODUCER = "producer-ferme-cidricole-equinoxe";
const COUNTRY = "d9fc0ce6-5f30-4e00-8bc5-63146a0a6407";
const REGION = "55a9fe9a-b3fe-41d6-8145-6adca1a818a8";
const CATEGORY = "category-cidres";

const PHOTO_DIR = "public/images/lpv/photos bouteilles";

const ref = (id, key) => ({
  _type: "reference",
  _ref: id,
  ...(key ? { _key: key } : {}),
});

function block(text, key) {
  return [{
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{
      _type: "span",
      _key: `${key}-span`,
      marks: [],
      text,
    }],
  }];
}

const products = [
  {
    id: "wine-equinoxe-lueur",
    name: "Lueur",
    slug: "lueur-ferme-cidricole-equinoxe",
    photo: "lueur.jpg",
    alcohol: 10,
    sugar: "1,5 g/L",
    apples: ["Cortland", "Golden Russet"],
    style: "Cidre biologique pétillant sur marcs de Frontenac blanc",
    aromas: ["fruit de la passion", "pomme", "fruits exotiques"],
    flavors: ["fruit de la passion", "pomme fraîche", "fruits exotiques"],
    oneLiner: "La rencontre entre la pomme et le raisin, portée par des bulles fines et une touche exotique.",
    oneLinerEn: "Apple meets grape in fine bubbles with an exotic twist.",
    notes: "Lueur emprunte au vin son caractère vineux tout en conservant la fraîcheur du cidre. La macération sur marcs de Frontenac blanc apporte une dimension aromatique évoquant le fruit de la passion. Les bulles fines donnent de l'élan à cet assemblage original.",
    notesEn: "Lueur borrows a wine-like character while retaining cider's freshness. Maceration on Frontenac Blanc grape pomace brings an aromatic dimension reminiscent of passion fruit. Fine bubbles give this original blend its energy.",
    vinification: "Cidre biologique élaboré à partir de pommes Cortland et Golden Russet, avec macération prolongée de marcs de raisins Frontenac blanc pendant la fermentation.",
    editorial: "Une belle porte d'entrée vers les cidres qui dialoguent avec l'univers du vin. Lueur montre comment les marcs de raisin peuvent enrichir la personnalité de la pomme sans lui voler la vedette.",
    editorialEn: "An inviting introduction to ciders that converse with the world of wine. Lueur shows how grape pomace can enrich apple's personality without overshadowing it.",
    why: "Pour sa façon de réunir deux cultures de fermentation québécoises dans une bouteille vive, expressive et facile à partager.",
    whyEn: "For bringing together two Québec fermentation traditions in a lively, expressive bottle made for sharing.",
    perfect: ["apéritif", "brunch", "repas de poisson"],
    perfectEn: ["aperitif", "brunch", "fish dishes"],
    keywords: ["fruit de la passion", "bulles fines", "vineux", "fraîcheur"],
    keywordsEn: ["passion fruit", "fine bubbles", "wine-like", "freshness"],
    foods: ["food-poisson-blanc-au-beurre", "food-huitres", "food-brunch-oeufs-benedictine"],
    body: 2, sweetness: 1, roundness: 2,
    acidity: 4, intensity: 3, complexity: 3,
    fruitIntensity: 4, minerality: 2, tannins: 1,
    savory: 1, oakInfluence: 1,
    servingTemperature: "6–8 °C",
    source: "https://www.fermecidricoleequinoxe.com/produits-boutique/p/balade-gsp6h-tapyt-mwg97-hterj-de27f-wp32r",
  },
  {
    id: "wine-equinoxe-eclipse",
    name: "Éclipse",
    slug: "eclipse-ferme-cidricole-equinoxe",
    photo: "eclipse.jpg",
    alcohol: 10.6,
    sugar: "1,5 g/L",
    apples: ["Golden Russet", "Cortland"],
    style: "Cidre biologique pétillant sur marcs de raisins rouges",
    aromas: ["fruits rouges", "pomme mûre", "raisins"],
    flavors: ["fruits rouges", "pomme", "fruits mûrs"],
    oneLiner: "Un cidre vineux et gourmand, où les raisins rouges rencontrent une bulle souple et généreuse.",
    oneLinerEn: "A generous, wine-like cider where red grapes meet soft, inviting bubbles.",
    notes: "Éclipse mise sur une texture onctueuse et un caractère résolument vineux. La macération de marcs de Frontenac noir et de Marquette en cuve froide préserve l'expression fruitée de l'assemblage. Le résultat est riche, enveloppant et animé par une effervescence naturelle.",
    notesEn: "Éclipse emphasizes a supple texture and distinctly wine-like character. Cold maceration with Frontenac Noir and Marquette grape pomace preserves the blend's fruit expression. The result is rich and enveloping, lifted by natural effervescence.",
    vinification: "Assemblage de pommes Golden Russet et Cortland avec des marcs de raisins biologiques Frontenac noir et Marquette. Macération à froid des peaux de raisin. Prise de mousse naturelle de type pét-nat, sans dégorgement.",
    editorial: "Éclipse brouille délicieusement la frontière entre cidre et vin. Ses marcs de raisins rouges lui donnent une dimension gourmande et une présence en bouche qui invitent à le servir à table.",
    editorialEn: "Éclipse deliciously blurs the line between cider and wine. Red grape pomace gives it a generous dimension and a palate presence that makes it a natural companion at the table.",
    why: "Pour son caractère vineux affirmé et sa texture généreuse, particulièrement intéressants pour les amateurs de rouges légers et de bulles nature.",
    whyEn: "For its assertive wine-like character and generous texture, especially appealing to lovers of light reds and natural bubbles.",
    perfect: ["apéro gourmand", "charcuteries", "repas entre amis"],
    perfectEn: ["generous aperitif", "charcuterie", "dinner with friends"],
    keywords: ["fruits rouges", "vineux", "onctueux", "bulles naturelles"],
    keywordsEn: ["red fruit", "wine-like", "supple", "natural bubbles"],
    foods: ["food-planche-charcuteries", "food-canard", "food-fromages"],
    body: 3, sweetness: 1, roundness: 4,
    acidity: 3, intensity: 4, complexity: 4,
    fruitIntensity: 4, minerality: 1, tannins: 2,
    savory: 2, oakInfluence: 1,
    servingTemperature: "8–10 °C",
    source: "https://www.fermecidricoleequinoxe.com/produits-boutique/p/balade-gsp6h-tapyt-x3wga-aze6l",
  },
  {
    id: "wine-equinoxe-balade",
    name: "Balade",
    slug: "balade-ferme-cidricole-equinoxe",
    photo: "balade.jpg",
    alcohol: 7.5,
    sugar: "< 1,5 g/L",
    apples: ["McIntosh", "Red Atlas"],
    style: "Cidre biologique pétillant à la fraise et au sumac",
    aromas: ["fraise", "pomme fraîche", "sumac"],
    flavors: ["fraise d'été", "pomme croquante", "épices"],
    oneLiner: "La fraise d'été, la pomme croquante et le sumac : une balade fraîche qui ne manque pas de caractère.",
    oneLinerEn: "Summer strawberry, crisp apple and sumac: a fresh, spirited stroll in a glass.",
    notes: "Balade est un cidre pétillant frais et croquant. La fraise apporte une impression de rondeur fruitée, tandis que le sumac vinaigrier relève la finale d'une touche piquante. Les bulles naturelles maintiennent l'ensemble vif et désaltérant.",
    notesEn: "Balade is a fresh, crisp sparkling cider. Strawberry brings a rounded fruit impression, while staghorn sumac adds a lively, tangy edge to the finish. Natural bubbles keep the whole experience bright and refreshing.",
    vinification: "Cidre biologique de pommes McIntosh et Red Atlas, avec macération de fraises et de sumac vinaigrier. Prise de mousse naturelle de type pét-nat, sans dégorgement.",
    editorial: "Balade a ce talent rare de faire goûter l'été sans tomber dans le sucré. La fraise et le sumac travaillent en contraste : l'une arrondit, l'autre réveille.",
    editorialEn: "Balade captures summer without leaning into sweetness. Strawberry and sumac work in contrast: one rounds the palate, the other wakes it up.",
    why: "Pour son assemblage audacieux de fruits québécois et sa finale relevée, qui en font un cidre particulièrement amusant à découvrir.",
    whyEn: "For its playful blend of Québec fruit and its tangy finish, making it a particularly enjoyable cider to discover.",
    perfect: ["pique-nique", "apéro estival", "terrasse"],
    perfectEn: ["picnic", "summer aperitif", "patio"],
    keywords: ["fraise", "sumac", "croquant", "estival"],
    keywordsEn: ["strawberry", "sumac", "crisp", "summery"],
    foods: ["food-salade-chevre", "food-crevettes-epicees", "food-poulet-grille"],
    body: 2, sweetness: 1, roundness: 3,
    acidity: 4, intensity: 3, complexity: 3,
    fruitIntensity: 4, minerality: 1, tannins: 1,
    savory: 1, oakInfluence: 1,
    servingTemperature: "6–8 °C",
    source: "https://www.fermecidricoleequinoxe.com/produits-boutique/p/balade-gsp6h-tapyt-x3wga",
  },
  {
    id: "wine-equinoxe-imposteur",
    name: "Imposteur",
    slug: "imposteur-ferme-cidricole-equinoxe",
    photo: "imposteur.jpg",
    alcohol: 7,
    sugar: "1,5 g/L",
    apples: ["Golden Russet"],
    style: "Cidre biologique tranquille rosé aux bleuets",
    aromas: ["bleuet", "fleurs", "pomme"],
    flavors: ["bleuet", "fruits frais", "pomme"],
    oneLiner: "Un cidre rosé tranquille et floral qui joue volontiers dans la cour du vin rosé.",
    oneLinerEn: "A still, floral rosé cider that happily plays in rosé wine's territory.",
    notes: "Imposteur séduit par son expression florale et fruitée. La macération de bleuets apporte une personnalité rosée à ce vin de pomme issu de Golden Russet gelées. Sans effervescence, la bouche privilégie la fraîcheur et la finesse du fruit.",
    notesEn: "Imposteur charms with floral and fruity expression. Blueberry maceration gives a rosé personality to this apple wine made from frozen Golden Russet apples. Without bubbles, the palate focuses on freshness and delicate fruit.",
    vinification: "Vin de pommes Golden Russet gelées avec macération de bleuets. Cidre biologique tranquille, élevé en cuve chaude selon la méthode décrite par le producteur.",
    editorial: "Imposteur porte bien son nom : il ressemble à un rosé, se sert comme un rosé et rappelle pourtant que la pomme peut raconter une tout autre histoire.",
    editorialEn: "Imposteur lives up to its name: it looks and serves like a rosé, yet reminds us that apples can tell a completely different story.",
    why: "Pour sa personnalité florale, son faible sucre résiduel et sa capacité à surprendre ceux qui pensent connaître le cidre.",
    whyEn: "For its floral personality, low residual sugar and ability to surprise anyone who thinks they already know cider.",
    perfect: ["apéritif", "repas léger", "soirée d'été"],
    perfectEn: ["aperitif", "light meal", "summer evening"],
    keywords: ["bleuet", "floral", "rosé", "rafraîchissant"],
    keywordsEn: ["blueberry", "floral", "rosé", "refreshing"],
    foods: ["food-salade-chevre", "food-saumon", "food-chevre-frais"],
    body: 2, sweetness: 1, roundness: 2,
    acidity: 3, intensity: 3, complexity: 3,
    fruitIntensity: 3, minerality: 1, tannins: 1,
    savory: 1, oakInfluence: 1,
    servingTemperature: "8–10 °C",
    source: "https://www.fermecidricoleequinoxe.com/produits-boutique/p/balade-gsp6h-tapyt-mwg97-hterj-de27f",
  },
  {
    id: "wine-equinoxe-zephyr",
    name: "Zéphyr",
    slug: "zephyr-ferme-cidricole-equinoxe",
    photo: "zephyr.jpg",
    alcohol: 8,
    sugar: "3 g/L",
    apples: ["Cortland", "Golden Russet"],
    style: "Cidre biologique tranquille aux poires et au miel",
    aromas: ["poire", "noisette", "beurre"],
    flavors: ["poire", "pomme", "noisette", "épices"],
    oneLiner: "Un cidre tranquille de pomme et de poire, enrichi de miel, avec une texture tout en douceur.",
    oneLinerEn: "A still apple-and-pear cider with farm honey and a beautifully soft texture.",
    notes: "Zéphyr propose un profil fruité et vif, avec une bouche onctueuse. Les poires Beauté Flamande et le miel de la ferme accompagnent les pommes Cortland et Golden Russet. Des notes de noisette, de beurre et d'épices apportent une dimension gourmande à ce cidre tranquille.",
    notesEn: "Zéphyr offers a fruity, lively profile with a supple palate. Beauté Flamande pears and farm honey accompany Cortland and Golden Russet apples. Hazelnut, butter and spice notes add a generous dimension to this still cider.",
    vinification: "Cidre biologique tranquille assemblant des pommes Cortland et Golden Russet, des poires Beauté Flamande et du miel des ruches de la ferme. Fermentation malolactique.",
    editorial: "Zéphyr montre une facette plus gastronomique du cidre : pas de bulles pour distraire, mais une matière souple où la poire, le miel et les notes de noisette prennent leur place.",
    editorialEn: "Zéphyr reveals a more gastronomic side of cider: no bubbles to distract, just a supple texture where pear, honey and hazelnut notes take their place.",
    why: "Pour découvrir un cidre tranquille complexe, dont l'assemblage de pommes, de poires et de miel sort des sentiers battus.",
    whyEn: "To discover a complex still cider whose blend of apples, pears and honey takes a less-travelled path.",
    perfect: ["repas à table", "fromages", "soirée automnale"],
    perfectEn: ["dinner", "cheese", "autumn evening"],
    keywords: ["poire", "miel", "noisette", "onctueux"],
    keywordsEn: ["pear", "honey", "hazelnut", "supple"],
    foods: ["food-brie", "food-poulet-roti", "food-poire-pochee"],
    body: 3, sweetness: 1, roundness: 4,
    acidity: 3, intensity: 3, complexity: 4,
    fruitIntensity: 3, minerality: 1, tannins: 1,
    savory: 2, oakInfluence: 1,
    servingTemperature: "9–11 °C",
    source: "https://www.fermecidricoleequinoxe.com/produits-boutique/p/balade-gsp6h-tapyt-mwg97-hterj-8a7ph-gg5r3-hmppg-ffp8e-pgfap",
  },
];

console.log("\n===== ÉQUINOXE — 5 CIDRES =====");
console.log("MODE :", WRITE ? "ÉCRITURE SANITY" : "SIMULATION");

const requiredIds = [
  PRODUCER,
  COUNTRY,
  REGION,
  CATEGORY,
  ...new Set(products.flatMap(p => p.foods)),
];

const existingRefs = await client.fetch(
  `*[_id in $ids]{_id, _type}`,
  { ids: requiredIds }
);

const found = new Set(existingRefs.map(d => d._id));
const missingRefs = requiredIds.filter(id => !found.has(id));

if (missingRefs.length) {
  throw new Error(`Références Sanity absentes : ${missingRefs.join(", ")}`);
}

const existingWines = await client.fetch(
  `*[_type == "wine" && producer._ref == $producer]{
    _id, name, "slug": slug.current
  }`,
  { producer: PRODUCER }
);

if (existingWines.length) {
  console.log("\nSTOP — Équinoxe possède déjà des fiches :");
  console.dir(existingWines);
  console.log("Aucune modification. Vérifier avant de relancer.");
  process.exit(1);
}

if (WRITE && !process.env.SANITY_API_WRITE_TOKEN) {
  throw new Error("SANITY_API_WRITE_TOKEN absent. Charger .env.local.");
}

for (const p of products) {
  const photoPath = path.join(PHOTO_DIR, p.photo);

  if (!fs.existsSync(photoPath)) {
    throw new Error(`Photo manquante : ${photoPath}`);
  }

  console.log(`\n✓ ${p.name}`);
  console.log(`  Photo : ${p.photo}`);
  console.log(`  Alcool : ${p.alcohol} %`);
  console.log(`  Sucre : ${p.sugar}`);
  console.log(`  Accords : ${p.foods.length}`);
  console.log(`  Textes FR/EN : oui`);
  console.log(`  Source : ${p.source}`);

  if (!WRITE) continue;

  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(photoPath),
    {
      filename: p.photo,
      contentType: "image/jpeg",
    }
  );

  const image = {
    _type: "image",
    asset: ref(asset._id),
    alt: `${p.name} — Ferme cidricole Équinoxe`,
    credit: "Ferme cidricole Équinoxe",
  };

  const doc = {
    _id: p.id,
    _type: "wine",
    name: p.name,
    slug: { _type: "slug", current: p.slug },
    producer: ref(PRODUCER),
    country: ref(COUNTRY),
    region: ref(REGION),
    categories: [ref(CATEGORY, "cidres")],

    published: true,
    beverageType: "cider",
    alcoholFree: false,
    alcohol: p.alcohol,
    bottleSize: "750 ml",
    sugar: p.sugar,
    appleVarieties: p.apples,
    style: p.style,

    bottleImage: image,
    editorialImage: image,

    oneLiner: p.oneLiner,
    oneLinerEn: p.oneLinerEn,
    tastingKeywords: p.keywords,
    tastingKeywordsEn: p.keywordsEn,
    tastingNotes: block(p.notes, "tasting-fr"),
    tastingNotesEn: block(p.notesEn, "tasting-en"),
    vinification: block(p.vinification, "vinification-fr"),
    editorialNote: block(p.editorial, "editorial-fr"),
    editorialNoteEn: block(p.editorialEn, "editorial-en"),

    whyWeRecommend: p.why,
    whyWeRecommendEn: p.whyEn,
    perfectFor: p.perfect,
    perfectForEn: p.perfectEn,

    aromas: p.aromas,
    flavors: p.flavors,
    foodPairings: p.foods.map((id, i) =>
      ref(id, `food-${i}`)
    ),

    body: p.body,
    sweetness: p.sweetness,
    roundness: p.roundness,
    acidity: p.acidity,
    intensity: p.intensity,
    complexity: p.complexity,
    fruitIntensity: p.fruitIntensity,
    minerality: p.minerality,
    tannins: p.tannins,
    savory: p.savory,
    oakInfluence: p.oakInfluence,

    decant: false,
    servingTemperature: p.servingTemperature,
    cellaringPotential: "À déguster jeune pour profiter de sa fraîcheur.",

    purchaseChannel: "producer",
    purchaseUrl: p.source,
    purchaseChannelDetails:
      "Consulter le producteur pour connaître la disponibilité.",
    purchaseChannelDetailsEn:
      "Check with the producer for current availability.",

    seoTitle: `${p.name} — Ferme cidricole Équinoxe | Le Premier Verre`,
    seoTitleEn: `${p.name} — Équinoxe Cider Farm | Le Premier Verre`,
    seoDescription: p.oneLiner,
    seoDescriptionEn: p.oneLinerEn,
  };

  await client.createIfNotExists(doc);
  console.log(`  ✓ CRÉÉ : ${p.id}`);
}

console.log("\n===== RÉSULTAT =====");

if (WRITE) {
  const created = await client.fetch(
    `*[_type == "wine" && producer._ref == $producer && published == true]{
      _id, name,
      "image": editorialImage.asset._ref,
      "countryName": country->name,
      "regionName": region->name
    }`,
    { producer: PRODUCER }
  );

  for (const wine of created) {
    console.log(
      `✓ ${wine.name} | image=${Boolean(wine.image)} | ` +
      `${wine.countryName} / ${wine.regionName}`
    );
  }

  console.log(`\n✓ ÉQUINOXE ${created.length}/5`);
} else {
  console.log("✓ SIMULATION VALIDÉE — aucune modification");
  console.log("Pour créer : node scripts/lpv-create-equinoxe-final.mjs --write");
}
