import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const FOLDER = "public/images/lpv/photos bouteilles";
const PRODUCER = "producer-vignoble-de-l-orpailleur";

const ref = id => ({ _type: "reference", _ref: id });

const imageField = (asset, name) => ({
  _type: "image",
  asset: ref(asset._id),
  alt: `${name} — Vignoble de l'Orpailleur`,
});

const block = (text, key) => [{
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

const WINES = [
  {
    id: "wine-lorpailleur-blanc-2025",
    name: "L'Orpailleur Blanc",
    file: "Orpailleurblanc-new.jpg",
    existing: true,
  },
  {
    id: "wine-l-orpailleur-brut",
    name: "L'Orpailleur Brut",
    file: "orpailleurbrut.jpg",
    existing: true,
  },
  {
    id: "wine-lorpailleur-rose",
    slug: "lorpailleur-rose",
    name: "L'Orpailleur Rosé",
    file: "orpailleurrose.jpg",
    color: "rose",
    alcohol: 11.5,
    grapes: ["Seyval noir", "Petite Perle", "Vidal"],
    style: "Rosé sec, délicat et rafraîchissant",
    oneLiner: "Un rosé délicat qui fait la part belle aux petits fruits rouges, aux fleurs et à la fraîcheur.",
    oneLinerEn: "A delicate rosé celebrating red berries, floral notes and freshness.",
    notes: "Robe saumonée, arômes de petits fruits rouges et de fleurs d'acacia. En bouche, des notes de fraise et de fleurs blanches accompagnent une finale fraîche et équilibrée.",
    notesEn: "Salmon-hued rosé with red berry and acacia blossom aromas. Strawberry and white floral notes lead to a fresh, balanced finish.",
    why: "Parce qu'il offre une expression lumineuse et accessible du rosé québécois, aussi agréable à l'apéro qu'à table.",
    whyEn: "A bright, approachable expression of Quebec rosé, equally enjoyable as an aperitif or with food.",
    perfect: ["Apéro sur la terrasse", "Crevettes grillées", "Cuisine estivale"],
    perfectEn: ["Patio aperitif", "Grilled shrimp", "Summer dishes"],
    keywords: ["fraise", "petits fruits rouges", "acacia", "floral", "frais"],
    keywordsEn: ["strawberry", "red berries", "acacia", "floral", "fresh"],
    aromas: ["Fraise", "Petits fruits rouges", "Fleurs d'acacia"],
    body: 2,
    sweetness: 1,
    acidity: 4,
    roundness: 2,
    intensity: 3,
    fruitIntensity: 4,
    complexity: 2,
    minerality: 2,
    savory: 1,
    tannins: 1,
    oakInfluence: 1,
    servingTemperature: "8–12 °C",
    purchaseUrl: "https://orpailleur.ca/products/orpailleur-rose",
  },
  {
    id: "wine-lorpailleur-rouge",
    slug: "lorpailleur-rouge",
    name: "L'Orpailleur Rouge",
    file: "orpailleurrouge.jpg",
    color: "red",
    alcohol: 11,
    grapes: ["Frontenac", "Marquette"],
    style: "Rouge sec, fruité et gourmand",
    oneLiner: "Un rouge québécois souple et gourmand, entre cerise, fruits des bois et plaisir immédiat.",
    oneLinerEn: "A supple, generous Quebec red with cherry, woodland berries and immediate appeal.",
    notes: "Robe rubis et nez de cerise et de fruits des bois. La bouche est fruitée, structurée sans lourdeur, avec une finale ronde et gourmande.",
    notesEn: "Ruby-coloured with cherry and woodland berry aromas. A fruit-forward palate with balanced structure and a round, generous finish.",
    why: "Parce qu'il montre qu'un rouge québécois peut être à la fois accessible, polyvalent et plein de caractère.",
    whyEn: "An approachable, versatile Quebec red with plenty of personality.",
    perfect: ["Pizza maison", "Pâtes à la tomate", "Hamburger"],
    perfectEn: ["Homemade pizza", "Tomato pasta", "Burgers"],
    keywords: ["cerise", "fruits des bois", "rond", "fruité", "gourmand"],
    keywordsEn: ["cherry", "woodland berries", "round", "fruity", "generous"],
    aromas: ["Cerise", "Fruits des bois"],
    body: 3,
    sweetness: 1,
    acidity: 3,
    roundness: 4,
    intensity: 3,
    fruitIntensity: 4,
    complexity: 2,
    minerality: 2,
    savory: 2,
    tannins: 2,
    oakInfluence: 1,
    servingTemperature: "14–16 °C",
    purchaseUrl: "https://orpailleur.ca/products/orpailleur-rouge",
  },
  {
    id: "wine-lorpailleur-reserve",
    slug: "lorpailleur-reserve",
    name: "L'Orpailleur Réserve",
    file: "orpailleurreserve.jpg",
    color: "white",
    alcohol: 12,
    grapes: ["Seyval", "Vidal"],
    style: "Blanc sec, rond et délicatement boisé",
    oneLiner: "Un blanc ample et élégant où les fruits, la vanille et une touche boisée se rencontrent.",
    oneLinerEn: "An elegant, generous white bringing together fruit, vanilla and subtle oak.",
    notes: "Robe jaune clair brillante. Le nez évoque les fruits, la vanille et les fleurs blanches. En bouche, une touche boisée apporte des nuances fumées, une texture souple et une longue finale équilibrée.",
    notesEn: "Bright pale yellow. Fruit, vanilla and white flower aromas lead to subtle smoky oak, a supple texture and a long, balanced finish.",
    why: "Pour découvrir une autre facette du vin blanc québécois : plus ample, plus enveloppante, mais toujours équilibrée.",
    whyEn: "A fuller, more enveloping side of Quebec white wine, while retaining balance and elegance.",
    perfect: ["Coquilles Saint-Jacques", "Veau à la crème", "Dinde rôtie"],
    perfectEn: ["Scallops", "Creamy veal", "Roast turkey"],
    keywords: ["vanille", "fleurs blanches", "boisé", "rond", "élégant"],
    keywordsEn: ["vanilla", "white flowers", "oak", "round", "elegant"],
    aromas: ["Vanille", "Fleurs blanches", "Fruits", "Notes fumées"],
    body: 4,
    sweetness: 1,
    acidity: 3,
    roundness: 4,
    intensity: 3,
    fruitIntensity: 3,
    complexity: 4,
    minerality: 2,
    savory: 2,
    tannins: 1,
    oakInfluence: 3,
    servingTemperature: "10–14 °C",
    purchaseUrl: "https://orpailleur.ca/products/orpailleur-reserve",
  },
];

console.log("\n===== L'ORPAILLEUR — 5 FICHES =====");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

const producer = await client.getDocument(PRODUCER);

if (!producer) {
  throw new Error("Producteur introuvable.");
}

const existingWines = await client.fetch(`
  *[_type == "wine" && producer._ref == $producer]{
    _id,
    name,
    "slug": slug.current
  }
`, { producer: PRODUCER });

const grapeDocs = await client.fetch(`
  *[_type == "grape"]{
    _id,
    name
  }
`);

const normalize = s => String(s || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim();

const plans = [];

for (const wine of WINES) {
  const filepath = path.join(FOLDER, wine.file);

  if (!fs.existsSync(filepath)) {
    throw new Error(`Photo introuvable : ${filepath}`);
  }

  const existing = await client.getDocument(wine.id);

  if (wine.existing && !existing) {
    throw new Error(`Fiche existante introuvable : ${wine.name}`);
  }

  if (!wine.existing && existing) {
    throw new Error(`ID déjà utilisé : ${wine.id}`);
  }

  if (!wine.existing) {
    const duplicate = existingWines.find(w =>
      normalize(w.name) === normalize(wine.name) ||
      w.slug === wine.slug
    );

    if (duplicate) {
      throw new Error(`Doublon possible : ${wine.name} (${duplicate._id})`);
    }
  }

  const grapes = wine.grapes?.map((name, index) => {
    const found = grapeDocs.find(g =>
      normalize(g.name) === normalize(name)
    );

    if (!found) {
      console.log(`⚠ Cépage sans référence Sanity : ${name}`);
      return null;
    }

    return {
      _type: "reference",
      _key: `grape-${index}`,
      _ref: found._id,
    };
  }).filter(Boolean) || [];

  console.log(`\n${wine.name}`);
  console.log("Action :", wine.existing ? "MISE À JOUR PHOTO" : "CRÉATION");
  console.log("Photo :", wine.file);
  console.log("ID :", wine.id);

  if (!wine.existing) {
    console.log("Cépages :", wine.grapes.join(", "));
  }

  plans.push({ wine, filepath, grapes });
}

if (!WRITE) {
  console.log("\n✓ 5 PHOTOS TROUVÉES");
  console.log("✓ 2 FICHES EXISTANTES CONSERVÉES");
  console.log("✓ 3 NOUVELLES FICHES PRÊTES");
  console.log("✓ AUCUNE MODIFICATION");
  console.log("\nPour appliquer :");
  console.log("node scripts/lpv-create-orpailleur.mjs --write");
  process.exit(0);
}

if (!client.config().token) {
  throw new Error("Token Sanity absent.");
}

const blanc = await client.getDocument("wine-lorpailleur-blanc-2025");

const common = {
  producer: ref(PRODUCER),
  country: blanc.country,
  region: blanc.region,
  appellation: blanc.appellation,
  published: true,
  beverageType: "wine",
  alcoholFree: false,
  bottleSize: "750 ml",
  purchaseChannel: "producer",
  purchaseLastChecked: "2026-10-14",
  experienceLevel: "beginner",
  decant: false,
};

for (const { wine, filepath, grapes } of plans) {
  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(filepath),
    {
      filename: `lpv-orpailleur-${wine.file}`,
      contentType: "image/jpeg",
    }
  );

  const editorialImage = imageField(asset, wine.name);

  if (wine.existing) {
    await client.patch(wine.id).set({
      editorialImage,
    }).commit();

    console.log(`✓ ${wine.name} — éditoriale ajoutée`);
    continue;
  }

  const doc = {
    _id: wine.id,
    _type: "wine",
    ...common,
    name: wine.name,
    slug: {
      _type: "slug",
      current: wine.slug,
    },
    color: wine.color,
    alcohol: wine.alcohol,
    grapes,
    bottleImage: imageField(asset, wine.name),
    editorialImage,
    style: wine.style,
    oneLiner: wine.oneLiner,
    oneLinerEn: wine.oneLinerEn,
    aiSummary: wine.oneLiner,
    tastingNotes: block(wine.notes, `${wine.slug}-tasting-fr`),
    tastingNotesEn: block(wine.notesEn, `${wine.slug}-tasting-en`),
    editorialNote: block(wine.why, `${wine.slug}-editorial-fr`),
    editorialNoteEn: block(wine.whyEn, `${wine.slug}-editorial-en`),
    whyWeRecommend: wine.why,
    whyWeRecommendEn: wine.whyEn,
    perfectFor: wine.perfect,
    perfectForEn: wine.perfectEn,
    tastingKeywords: wine.keywords,
    tastingKeywordsEn: wine.keywordsEn,
    aromas: wine.aromas,
    flavors: wine.aromas,
    body: wine.body,
    sweetness: wine.sweetness,
    acidity: wine.acidity,
    roundness: wine.roundness,
    intensity: wine.intensity,
    fruitIntensity: wine.fruitIntensity,
    complexity: wine.complexity,
    minerality: wine.minerality,
    savory: wine.savory,
    tannins: wine.tannins,
    oakInfluence: wine.oakInfluence,
    servingTemperature: wine.servingTemperature,
    purchaseUrl: wine.purchaseUrl,
    purchaseChannelDetails:
      "Consulter le producteur pour connaître les disponibilités.",
    purchaseChannelDetailsEn:
      "Check with the producer for current availability.",
    seoTitle: `${wine.name} — L'Orpailleur | Le Premier Verre`,
    seoTitleEn: `${wine.name} — L'Orpailleur | Le Premier Verre`,
    seoDescription: wine.oneLiner,
    seoDescriptionEn: wine.oneLinerEn,
  };

  await client.create(doc);

  console.log(`✓ ${wine.name} — fiche créée`);
}

const check = await client.fetch(`
  *[_type == "wine" && producer._ref == $producer]
  | order(name asc) {
    name,
    published,
    "editorial": editorialImage.asset._ref,
    "bottle": bottleImage.asset._ref
  }
`, { producer: PRODUCER });

console.log("\n===== VÉRIFICATION FINALE =====");

for (const wine of check) {
  console.log(
    `${wine.editorial && wine.bottle ? "✓" : "✗"} ${wine.name}`
  );
}

if (
  check.length !== 5 ||
  check.some(w => !w.editorial || !w.bottle || !w.published)
) {
  throw new Error("Vérification finale échouée.");
}

console.log("\n✓ L'ORPAILLEUR — 5/5 AU NOUVEAU FORMAT");
