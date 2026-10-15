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

const wines = [
  {
    code: "champs-fleuris-2025",
    name: "Champs Fleuris",
    vintage: 2025,
    color: "red",
    photo: "champsfleuris.jpg",
    grapes: ["Marquette", "Frontenac gris", "Frontenac noir", "Pinot noir", "Saint-Pépin"],
    body: 2,
    sweetness: 1,
    roundness: 2,
    temperature: "12–14 °C",
    decant: false,
    style: "Rouge léger, fruité et vibrant",
    oneLiner: "Un rouge de grande soif, entre fruits rouges, fraîcheur et liberté.",
    oneLinerEn: "A lively, thirst-quenching red with fresh red fruit and an easygoing spirit.",
    keywords: ["fraise", "cerise", "agrumes", "herbes", "frais"],
    keywordsEn: ["strawberry", "cherry", "citrus", "herbal", "fresh"],
    perfect: ["Un pique-nique", "Une pizza entre amis", "Un rouge légèrement rafraîchi"],
    perfectEn: ["Picnics", "Pizza with friends", "A lightly chilled red"],
    why: "On l'aime pour sa façon de bousculer les attentes. Cet assemblage de cépages blancs et rouges donne un vin léger, fruité et vivant, qui montre une autre facette du rouge québécois.",
    whyEn: "We love how it challenges expectations. Blending white and red grapes creates a lively, fruit-forward wine that reveals another side of Québec reds.",
  },
  {
    code: "soir-dete-2025",
    name: "Soir d’Été",
    vintage: 2025,
    color: "white",
    photo: "soirdete.jpg",
    grapes: ["Saint-Pépin", "Louise Swenson", "Frontenac gris", "La Crescent"],
    alcohol: 12.2,
    body: 3,
    sweetness: 2,
    roundness: 3,
    temperature: "8–10 °C",
    decant: false,
    style: "Blanc fruité et aromatique",
    oneLiner: "Un blanc qui goûte les longues soirées d'été, entre poire, fruits à noyau et ananas.",
    oneLinerEn: "A white made for long summer evenings, with pear, stone fruit and pineapple notes.",
    keywords: ["poire", "ananas", "fruits à noyau", "miel", "frais"],
    keywordsEn: ["pear", "pineapple", "stone fruit", "honey", "fresh"],
    perfect: ["Un souper sur la terrasse", "Les plats légèrement épicés", "Un apéro prolongé"],
    perfectEn: ["Patio dinners", "Gently spiced dishes", "Long aperitifs"],
    why: "On le recommande pour son fruit expressif et sa personnalité lumineuse. La courte macération du Saint-Pépin apporte une dimension supplémentaire à ce blanc convivial.",
    whyEn: "We recommend it for its expressive fruit and bright personality. A short skin maceration of Saint-Pépin adds another dimension to this approachable white.",
  },
  {
    code: "le-rose-2025",
    name: "Le Rosé",
    vintage: 2025,
    color: "rose",
    photo: "rosepigeonhill.jpg",
    grapes: ["Marquette"],
    alcohol: 12.3,
    body: 2,
    sweetness: 1,
    roundness: 2,
    temperature: "8–10 °C",
    decant: false,
    style: "Rosé frais et fruité",
    oneLiner: "Un rosé vibrant où se rencontrent fraise des champs, framboise et fraîcheur.",
    oneLinerEn: "A vibrant rosé bringing together wild strawberry, raspberry and refreshing energy.",
    keywords: ["fraise des champs", "framboise", "canneberge", "fleurs sauvages"],
    keywordsEn: ["wild strawberry", "raspberry", "cranberry", "wildflowers"],
    perfect: ["Un après-midi au soleil", "Les salades estivales", "Un apéro entre amis"],
    perfectEn: ["Sunny afternoons", "Summer salads", "Aperitifs with friends"],
    why: "On l'aime parce qu'il ne se contente pas d'être estival. Sa fraîcheur, son fruit et sa légère structure en font un rosé qu'on a envie de retrouver aussi à table.",
    whyEn: "We love that it's more than a summer wine. Its freshness, fruit and gentle structure make it just as inviting at the dinner table.",
  },
  {
    code: "le-pigeon-2024",
    name: "Le Pigeon",
    vintage: 2024,
    color: "red",
    photo: "lepigeon.jpg",
    grapes: ["Marquette", "Pinot noir", "Frontenac noir", "Petite Perle"],
    body: 3,
    sweetness: 1,
    roundness: 3,
    temperature: "14–16 °C",
    decant: false,
    style: "Rouge d'assemblage",
    oneLiner: "Un assemblage rouge qui rassemble plusieurs cépages du vignoble dans une même bouteille.",
    oneLinerEn: "A red blend bringing together several of the vineyard's grape varieties in one bottle.",
    keywords: ["assemblage", "rouge québécois", "terroir"],
    keywordsEn: ["blend", "Québec red", "terroir"],
    perfect: ["Découvrir Pigeon Hill", "Un repas entre amis", "Explorer les assemblages québécois"],
    perfectEn: ["Discovering Pigeon Hill", "Dinner with friends", "Exploring Québec blends"],
    why: "On l'a choisi pour sa place dans l'identité du vignoble. Son assemblage réunit des cépages adaptés au Québec et reflète la volonté de Pigeon Hill de travailler avec ce que chaque saison lui offre.",
    whyEn: "We selected it for its place in the vineyard's identity. Its blend brings together grapes suited to Québec and reflects Pigeon Hill's commitment to working with each season.",
  },
  {
    code: "clos-rousseau-marquette-2024",
    name: "Clos Rousseau Marquette",
    vintage: 2024,
    color: "red",
    photo: "closrousseau.jpg",
    grapes: ["Marquette"],
    body: 4,
    sweetness: 1,
    roundness: 3,
    temperature: "15–17 °C",
    decant: false,
    style: "Rouge de Marquette",
    oneLiner: "Le Marquette à l'honneur, dans une cuvée qui met le cépage et son origine au premier plan.",
    oneLinerEn: "Marquette takes centre stage in a cuvée focused on the grape and its origins.",
    keywords: ["Marquette", "rouge", "terroir"],
    keywordsEn: ["Marquette", "red wine", "terroir"],
    perfect: ["Découvrir le Marquette", "Un repas réconfortant", "Explorer les rouges du Québec"],
    perfectEn: ["Discovering Marquette", "Comfort food", "Exploring Québec reds"],
    why: "On le recommande pour découvrir le Marquette sans l'influence d'un assemblage. Une cuvée intéressante pour comprendre la place de ce cépage dans la viticulture québécoise.",
    whyEn: "We recommend it for exploring Marquette on its own. An interesting cuvée for understanding this grape's role in Québec winemaking.",
  },
];

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

const producers = await client.fetch(`
  *[_type == "producer" &&
    (slug.current == "vignoble-pigeon-hill" ||
     slug.current == "pigeon-hill" ||
     name match "*Pigeon Hill*")
  ]{
    _id,
    name,
    "slug": slug.current
  }
`);

if (producers.length !== 1) {
  throw new Error(
    "Producteur Pigeon Hill introuvable ou ambigu : " +
    JSON.stringify(producers)
  );
}

const producer = producers[0];

const grapeDocs = await client.fetch(`
  *[_type == "grape"]{
    _id,
    name,
    "slug": slug.current
  }
`);

function grapeRefs(names) {
  return names.map((name) => {
    const grape = grapeDocs.find(
      (g) => normalize(g.name) === normalize(name)
    );

    if (!grape) {
      console.log("⚠ Cépage non trouvé :", name);
      return null;
    }

    return {
      _key: normalize(name),
      _type: "reference",
      _ref: grape._id,
    };
  }).filter(Boolean);
}

const existingWines = await client.fetch(`
  *[_type == "wine" && producer._ref == $producerId]{
    _id,
    name,
    "slug": slug.current
  }
`, { producerId: producer._id });

console.log("\n===== PIGEON HILL — 5 FICHES =====");
console.log("Producteur :", producer.name, "|", producer._id);
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

const plans = [];

for (const w of wines) {
  const file = path.join(FOLDER, w.photo);

  if (!fs.existsSync(file)) {
    throw new Error("Photo introuvable : " + file);
  }

  const id = `wine-pigeon-hill-${w.code}`;
  const slug = `pigeon-hill-${w.code}`;

  const duplicate = existingWines.find(
    (x) => x._id === id || x.slug === slug ||
      (normalize(x.name) === normalize(w.name))
  );

  const existing = await client.getDocument(id);

  console.log(`\n${w.name} (${w.vintage})`);
  console.log("ID :", id);
  console.log("Photo :", w.photo);
  console.log("Cépages :", w.grapes.join(", "));
  console.log("Doublon :", duplicate ? duplicate._id : "aucun");

  if (duplicate && duplicate._id !== id) {
    throw new Error(
      `Doublon possible pour ${w.name} : ${duplicate._id}`
    );
  }

  if (existing && existing._type !== "wine") {
    throw new Error("ID déjà utilisé par un autre type : " + id);
  }

  plans.push({ w, id, slug, existing });
}

if (!WRITE) {
  console.log("\n✓ SIMULATION TERMINÉE — aucune modification");
  console.log("Pour créer : node scripts/lpv-create-pigeon-hill.mjs --write");
  process.exit(0);
}

if (!client.config().token) {
  throw new Error("Token Sanity absent.");
}

for (const { w, id, slug, existing } of plans) {
  const file = path.join(FOLDER, w.photo);

  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(file),
    {
      filename: `lpv-pigeon-hill-${w.photo}`,
      contentType: "image/jpeg",
    }
  );

  const editorialImage = {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
    alt: `${w.name} · Vignoble Pigeon Hill`,
    credit: "Vignoble Pigeon Hill",
  };

  const fields = {
    name: w.name,
    slug: {
      _type: "slug",
      current: slug,
    },
    producer: {
      _type: "reference",
      _ref: producer._id,
    },
    beverageType: "wine",
    alcoholFree: false,
    color: w.color,
    vintage: w.vintage,
    bottleSize: "750 ml",
    published: true,

    editorialImage,
    bottleImage: editorialImage,

    grapes: grapeRefs(w.grapes),

    oneLiner: w.oneLiner,
    oneLinerEn: w.oneLinerEn,
    tastingKeywords: w.keywords,
    tastingKeywordsEn: w.keywordsEn,
    perfectFor: w.perfect,
    perfectForEn: w.perfectEn,
    whyWeRecommend: w.why,
    whyWeRecommendEn: w.whyEn,

    body: w.body,
    sweetness: w.sweetness,
    roundness: w.roundness,
    servingTemperature: w.temperature,
    decant: w.decant,
    style: w.style,

    purchaseChannel: "producer",
    purchaseUrl: "https://vignoblepigeonhill.com/nos-vins/",
    purchaseLastChecked: "2026-10-14",
    experienceLevel: "beginner",

    ...(w.alcohol !== undefined
      ? { alcohol: w.alcohol }
      : {}),
  };

  if (existing) {
    await client.patch(id).set(fields).commit();
    console.log("✓ Mis à jour :", w.name);
  } else {
    await client.create({
      _id: id,
      _type: "wine",
      ...fields,
    });
    console.log("✓ Créé :", w.name);
  }
}

console.log("\n✓ LES 5 FICHES PIGEON HILL SONT CRÉÉES");
console.log("✓ Photos éditoriales installées");
console.log("✓ Nouveau display FR/EN activé");
