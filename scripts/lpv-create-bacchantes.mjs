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
    code: "b1",
    name: "B1",
    color: "white",
    photo: "b1.jpg",
    grapes: ["Seyval blanc", "Vidal"],
    alcohol: 12.5,
    sugar: "Moins de 2 g/L",
    body: 2,
    sweetness: 1,
    roundness: 2,
    servingTemperature: "8–10 °C",
    decant: false,
    style: "Blanc sec, léger et fruité",
    oneLiner:
      "Un blanc délicat, sec et fruité, pensé pour les rencontres qui s’improvisent.",
    oneLinerEn:
      "A delicate, dry and fruity white made for spontaneous get-togethers.",
    tastingKeywords: ["délicat", "fruité", "léger", "sec"],
    tastingKeywordsEn: ["delicate", "fruity", "light", "dry"],
    perfectFor: ["L’apéro improvisé", "Les repas légers", "Les retrouvailles"],
    perfectForEn: ["Spontaneous aperitifs", "Light meals", "Catching up with friends"],
    whyWeRecommend:
      "On aime son approche simple et accueillante. Un blanc québécois qui mise sur la légèreté et le plaisir de partager, sans compliquer le moment.",
    whyWeRecommendEn:
      "We love its easygoing character. A Québec white that celebrates lightness and sharing without overcomplicating the moment.",
    source: "https://www.lesbacchantes.com/nos-produits/b1/",
  },
  {
    code: "b4",
    name: "B4",
    color: "white",
    photo: "b4.jpg",
    grapes: ["Vidal", "Seyval blanc"],
    alcohol: 12.5,
    sugar: "Moins de 1 g/L",
    approxPrice: 26,
    body: 2,
    sweetness: 1,
    roundness: 2,
    servingTemperature: "8–10 °C",
    decant: false,
    style: "Blanc sec, floral et minéral",
    oneLiner:
      "Un blanc sec aux accents minéraux et floraux, aussi élégant que facile à inviter à table.",
    oneLinerEn:
      "A dry white with mineral and floral notes, elegant yet easy to bring to the table.",
    tastingKeywords: ["minéral", "fleurs blanches", "sec", "frais"],
    tastingKeywordsEn: ["mineral", "white flowers", "dry", "fresh"],
    perfectFor: ["Un souper improvisé", "Les légumes de saison", "L’apéro"],
    perfectForEn: ["An improvised dinner", "Seasonal vegetables", "Aperitifs"],
    whyWeRecommend:
      "On le recommande pour son profil précis et sa polyvalence. Ses notes de fleurs blanches et sa minéralité lui donnent une personnalité distincte du B1.",
    whyWeRecommendEn:
      "We recommend it for its focused character and versatility. White floral notes and minerality give it a personality distinct from B1.",
    source: "https://www.lesbacchantes.com/nos-produits/b4/",
  },
  {
    code: "r2",
    name: "R2 – Enfin Pinot Noir",
    color: "red",
    photo: "r2.jpg",
    grapes: ["Pinot noir"],
    body: 2,
    sweetness: 1,
    roundness: 2,
    servingTemperature: "14–16 °C",
    decant: false,
    style: "Rouge sec, fruité et délicat",
    oneLiner:
      "Un pinot noir québécois qui privilégie la finesse, la vivacité et le fruit rouge.",
    oneLinerEn:
      "A Québec Pinot Noir that favours finesse, liveliness and red fruit.",
    tastingKeywords: ["cerise rouge", "fruité", "vif", "sec"],
    tastingKeywordsEn: ["red cherry", "fruity", "lively", "dry"],
    perfectFor: ["Un repas de semaine", "Une planche de fromages", "Un rouge léger"],
    perfectForEn: ["Weeknight dinners", "Cheese boards", "A lighter red"],
    whyWeRecommend:
      "On aime cette expression du pinot noir pour son côté accessible et sa fraîcheur. Une belle porte d’entrée vers les rouges québécois plus délicats.",
    whyWeRecommendEn:
      "We love this Pinot Noir for its approachable character and freshness. A lovely introduction to the more delicate side of Québec reds.",
    source: "https://www.lesbacchantes.com/nos-produits/",
  },
  {
    code: "r3",
    name: "R3",
    color: "red",
    photo: "r3.jpg",
    grapes: ["Marquette"],
    body: 3,
    sweetness: 1,
    roundness: 3,
    servingTemperature: "14–16 °C",
    decant: false,
    style: "Rouge de Marquette",
    oneLiner:
      "Une cuvée de Marquette qui permet de découvrir un cépage emblématique des rouges québécois.",
    oneLinerEn:
      "A Marquette cuvée showcasing one of Québec's signature red wine grapes.",
    tastingKeywords: ["Marquette", "rouge québécois"],
    tastingKeywordsEn: ["Marquette", "Québec red"],
    perfectFor: ["Découvrir le Marquette", "Un repas entre amis"],
    perfectForEn: ["Discovering Marquette", "Dinner with friends"],
    whyWeRecommend:
      "On l’a choisi pour présenter le Marquette, un cépage important dans le paysage viticole québécois, aux côtés du pinot noir R2.",
    whyWeRecommendEn:
      "We selected it to showcase Marquette, an important grape in Québec winemaking, alongside the R2 Pinot Noir.",
    source: "https://www.lesbacchantes.com/nos-produits/",
  },
  {
    code: "m1",
    name: "M1",
    color: "white",
    photo: "m1.jpg",
    grapes: ["Vidal"],
    alcohol: 11.5,
    sugar: "Moins de 3 g/L",
    approxPrice: 40,
    body: 2,
    sweetness: 1,
    roundness: 2,
    servingTemperature: "6–8 °C",
    decant: false,
    style: "Mousseux brut de Vidal",
    oneLiner:
      "Des bulles fines et sèches pour célébrer aussi bien les grandes occasions que les petits vendredis.",
    oneLinerEn:
      "Fine, dry bubbles for celebrating big milestones and ordinary Fridays alike.",
    tastingKeywords: ["bulles fines", "sec", "mousseux", "frais"],
    tastingKeywordsEn: ["fine bubbles", "dry", "sparkling", "fresh"],
    perfectFor: ["Un brunch", "Une célébration", "Le premier verre de la soirée"],
    perfectForEn: ["Brunch", "Celebrations", "The first glass of the evening"],
    whyWeRecommend:
      "Parce qu’il n’y a pas besoin d’attendre une grande occasion pour ouvrir des bulles. Ce mousseux de Vidal, élevé 18 mois sur lattes selon le producteur, incarne parfaitement cet esprit.",
    whyWeRecommendEn:
      "Because sparkling wine doesn't need a special occasion. This Vidal sparkling wine, aged 18 months on lees according to the producer, captures that spirit beautifully.",
    source: "https://www.lesbacchantes.com/nos-produits/m1/",
  },
];

const producer = await client.fetch(
  `*[_id == "producer-les-bacchantes"][0]{_id,name}`
);

if (!producer) throw new Error("Producteur Les Bacchantes introuvable.");

const grapeDocs = await client.fetch(`
  *[_type == "grape"]{
    _id,
    name,
    "slug": slug.current
  }
`);

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function grapeRefs(names) {
  return names.map((name) => {
    const grape = grapeDocs.find(
      (g) => normalize(g.name) === normalize(name)
    );

    if (!grape) {
      console.log(`⚠ Cépage à associer plus tard : ${name}`);
      return null;
    }

    return {
      _key: normalize(name),
      _type: "reference",
      _ref: grape._id,
    };
  }).filter(Boolean);
}

console.log("\n===== LES BACCHANTES — 5 FICHES =====");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

for (const w of wines) {
  const file = path.join(FOLDER, w.photo);
  if (!fs.existsSync(file)) {
    throw new Error(`Photo introuvable : ${file}`);
  }

  const id = `wine-les-bacchantes-${w.code}`;
  const existing = await client.getDocument(id);

  console.log(`\n${existing ? "↻" : "+"} ${w.name}`);
  console.log("Photo éditoriale :", w.photo);
  console.log("Cépages :", w.grapes.join(", "));

  if (!WRITE) continue;

  if (!client.config().token) {
    throw new Error("Token Sanity absent.");
  }

  const image = await client.assets.upload(
    "image",
    fs.createReadStream(file),
    {
      filename: `lpv-bacchantes-${w.photo}`,
      contentType: "image/jpeg",
    }
  );

  const imageField = {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: image._id,
    },
    alt: `${w.name} · Les Bacchantes`,
    credit: "Les Bacchantes",
  };

  const doc = {
    _id: id,
    _type: "wine",
    name: w.name,
    slug: {
      _type: "slug",
      current: `les-bacchantes-${w.code}`,
    },
    producer: {
      _type: "reference",
      _ref: producer._id,
    },
    beverageType: "wine",
    alcoholFree: false,
    color: w.color,
    bottleSize: "750 ml",
    published: true,

    editorialImage: imageField,
    bottleImage: imageField,

    grapes: grapeRefs(w.grapes),

    oneLiner: w.oneLiner,
    oneLinerEn: w.oneLinerEn,
    tastingKeywords: w.tastingKeywords,
    tastingKeywordsEn: w.tastingKeywordsEn,
    perfectFor: w.perfectFor,
    perfectForEn: w.perfectForEn,
    whyWeRecommend: w.whyWeRecommend,
    whyWeRecommendEn: w.whyWeRecommendEn,

    body: w.body,
    sweetness: w.sweetness,
    roundness: w.roundness,
    servingTemperature: w.servingTemperature,
    decant: w.decant,

    style: w.style,
    purchaseChannel: "producer",
    purchaseUrl: w.source,
    purchaseLastChecked: "2026-10-14",
    experienceLevel: "beginner",

    ...(w.alcohol !== undefined ? { alcohol: w.alcohol } : {}),
    ...(w.sugar !== undefined ? { sugar: w.sugar } : {}),
    ...(w.approxPrice !== undefined ? { approxPrice: w.approxPrice } : {}),
  };

  if (existing) {
    const { _id, _type, ...fields } = doc;
    await client.patch(id).set(fields).commit();
  } else {
    await client.create(doc);
  }

  console.log("✓ Créé dans Sanity");
}

console.log(
  WRITE
    ? "\n✓ LES 5 FICHES BACCHANTES SONT CRÉÉES"
    : "\n✓ SIMULATION TERMINÉE — aucune modification"
);
