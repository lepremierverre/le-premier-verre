import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const folder = "public/images/lpv/photos bouteilles";
const producerId = "producer-maison-agricole-joy-hill";

const wines = [
  {
    id: "wine-joyhill-rayon-2025",
    name: "Rayon 2025",
    slug: "joyhill-rayon-2025",
    file: "rayon.jpg",
    type: "rose",
    alcohol: 12.5,
    grapes: ["Blaufränkisch", "Grüner Veltliner"],
    oneLiner: "Un rosé lumineux, entre fruit croquant et touche épicée.",
    oneLinerEn: "A vibrant rosé balancing crisp fruit and a spicy edge.",
    keywords: ["Fraise", "Pêche", "Poivre noir", "Fraîcheur"],
    keywordsEn: ["Strawberry", "Peach", "Black pepper", "Freshness"],
    perfect: ["Un apéro au soleil", "Un repas sur la terrasse"],
    perfectEn: ["A sunny aperitif", "Dinner on the patio"],
    why: "Rayon montre qu'un rosé peut être à la fois spontané, précis et plein de personnalité.",
    whyEn: "Rayon shows how rosé can feel effortless while remaining precise and full of character.",
    vinification: "Assemblage de 71 % Blaufränkisch et 29 % Grüner Veltliner. Élevage de quatre mois en béton.",
    tasting: "Notes de fraise, de pêche et de poivre noir.",
  },
  {
    id: "wine-joyhill-raisin-brin-2025",
    name: "Raisin Brin 2025",
    slug: "joyhill-raisin-brin-2025",
    file: "raisinbrin.jpg",
    type: "red",
    alcohol: 11,
    grapes: ["Gamay", "Blaufränkisch", "Chardonnay"],
    oneLiner: "Un rouge léger qui mise sur le fruit et le plaisir.",
    oneLinerEn: "A light red built around bright fruit and pure enjoyment.",
    keywords: ["Fruits rouges", "Épices", "Légèreté", "Vivacité"],
    keywordsEn: ["Red berries", "Spice", "Lightness", "Liveliness"],
    perfect: ["Un souper improvisé", "Un rouge légèrement rafraîchi"],
    perfectEn: ["An impromptu dinner", "A lightly chilled red"],
    why: "Un rouge sans cérémonie, avec assez de caractère pour retenir l'attention.",
    whyEn: "An approachable red with enough character to keep things interesting.",
    vinification: "Assemblage de 67 % Gamay, 21 % Blaufränkisch et 12 % Chardonnay. Élevage de cinq mois en béton et en inox.",
    tasting: "Petits fruits acidulés et notes épicées.",
  },
  {
    id: "wine-joyhill-pastoral-avant-les-lumieres-2025",
    name: "Pastoral – Avant les lumières 2025",
    slug: "pastoral-avant-les-lumieres-2025",
    file: "pastoral.jpg",
    type: "white",
    alcohol: 10.2,
    grapes: ["Seyval blanc", "Louise Swenson", "Saint-Pépin", "Vidal"],
    oneLiner: "Un blanc léger qui fait entrer les agrumes et les tropiques à table.",
    oneLinerEn: "A light white bringing citrus and tropical notes to the table.",
    keywords: ["Agrumes", "Fruits tropicaux", "Légèreté", "Fraîcheur"],
    keywordsEn: ["Citrus", "Tropical fruit", "Lightness", "Freshness"],
    perfect: ["Un premier verre à l'apéro", "Une soirée sans prétention"],
    perfectEn: ["A first glass before dinner", "An easygoing evening"],
    why: "Une belle porte d'entrée vers les assemblages blancs québécois, dans un registre accessible et rafraîchissant.",
    whyEn: "An inviting introduction to Québec white blends, approachable and refreshing.",
    vinification: "Assemblage de 51 % Seyval blanc, 28 % Louise Swenson, 11 % Saint-Pépin et 10 % Vidal. Pressurage direct, fermentation indigène sur marcs de vinifera Joy Hill et élevage de cinq mois en inox.",
    tasting: "Vin blanc léger aux notes de fruits tropicaux et d'agrumes.",
  },
  {
    id: "wine-joyhill-la-butte-2024",
    name: "La Butte 2024",
    slug: "joyhill-la-butte-2024",
    file: "labutte.jpg",
    type: "red",
    alcohol: 12,
    grapes: ["Blaufränkisch"],
    oneLiner: "Un rouge de caractère, entre fruits noirs et épices douces.",
    oneLinerEn: "A characterful red with dark fruit and gentle spice.",
    keywords: ["Cassis", "Bleuet", "Muscade", "Structure"],
    keywordsEn: ["Blackcurrant", "Blueberry", "Nutmeg", "Structure"],
    perfect: ["Un repas qui s'étire", "Une soirée autour de la table"],
    perfectEn: ["A lingering dinner", "An evening around the table"],
    why: "La Butte propose une expression plus profonde et structurée de l'univers Joy Hill.",
    whyEn: "La Butte offers a deeper, more structured expression of Joy Hill.",
    vinification: "100 % Blaufränkisch. Élevage de dix mois sous bois.",
    tasting: "Notes de cassis, de bleuets compotés et de muscade.",
  },
  {
    id: "wine-joyhill-le-gosier-2025",
    name: "Le Gosier 2025",
    slug: "joyhill-le-gosier-2025",
    file: "gosier.jpg",
    type: "sparkling",
    alcohol: 12,
    grapes: ["Chardonnay", "Gamay"],
    oneLiner: "Des bulles rosées, de la fraise et une touche pâtissière.",
    oneLinerEn: "Pink bubbles, strawberry notes and a pastry-like touch.",
    keywords: ["Bulles", "Fraise", "Notes pâtissières", "Festif"],
    keywordsEn: ["Bubbles", "Strawberry", "Pastry notes", "Festive"],
    perfect: ["Un toast spontané", "Un apéro qui devient une fête"],
    perfectEn: ["A spontaneous toast", "An aperitif that turns into a celebration"],
    why: "Un mousseux rosé qui donne envie de célébrer sans attendre une occasion spéciale.",
    whyEn: "A sparkling rosé that makes any moment worth celebrating.",
    vinification: "Assemblage de 76 % Chardonnay et 24 % Gamay. Élevage de cinq mois en inox.",
    tasting: "Notes pâtissières et fraises des champs.",
  },
];

const block = (text) => [{
  _type: "block",
  _key: Math.random().toString(36).slice(2, 10),
  style: "normal",
  markDefs: [],
  children: [{
    _type: "span",
    _key: Math.random().toString(36).slice(2, 10),
    text,
    marks: [],
  }],
}];

console.log("\n===== JOY HILL — 5 FICHES LPV =====");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

const producer = await client.getDocument(producerId);
if (!producer) throw new Error("Producteur Joy Hill introuvable dans Sanity.");

for (const wine of wines) {
  const filePath = path.join(folder, wine.file);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Photo introuvable : ${filePath}`);
  }

  const existing = await client.getDocument(wine.id);

  console.log(`\n${wine.name}`);
  console.log("✓ Photo :", wine.file);
  console.log("✓ Cépages :", wine.grapes.join(", "));
  console.log("✓ Alcool :", wine.alcohol + " %");
  console.log(existing ? "↻ Fiche existante" : "+ Nouvelle fiche");

  if (!WRITE) continue;

  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(filePath),
    { filename: wine.file }
  );

  const grapeDocs = await client.fetch(
    `*[_type == "grape"]{_id, name}`
  );

  const refs = wine.grapes.flatMap((name, index) => {
    const normalize = (value) =>
      String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

    const found = grapeDocs.find(
      (grape) => normalize(grape.name) === normalize(name)
    );

    if (!found) {
      console.log(`  ℹ Cépage non référencé dans Sanity : ${name}`);
      return [];
    }

    return [{
      _type: "reference",
      _key: `grape${index}`,
      _ref: found._id,
    }];
  });

  const image = {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };

  const data = {
    name: wine.name,
    slug: { _type: "slug", current: wine.slug },
    producer: { _type: "reference", _ref: producerId },
    published: true,
    beverageType: "wine",
    alcoholFree: false,
    editorialImage: image,
    bottleImage: image,
    oneLiner: wine.oneLiner,
    oneLinerEn: wine.oneLinerEn,
    tastingKeywords: wine.keywords,
    tastingKeywordsEn: wine.keywordsEn,
    perfectFor: wine.perfect,
    perfectForEn: wine.perfectEn,
    whyWeRecommend: wine.why,
    whyWeRecommendEn: wine.whyEn,
    alcohol: wine.alcohol,
    vinification: block(wine.vinification),
    tastingNotes: block(wine.tasting),
    bottleSize: 750,
  };


  // Données complémentaires LPV — technique confirmée et recommandations éditoriales.
  const details = {
    "wine-joyhill-rayon-2025": {
      approxPrice: 26.02,
      purchaseUrl: "https://maisonjoyhill.com/collections/joyhill",
      servingTemperature: "6 à 8 °C",
      decant: "Non nécessaire",
      foodPairings: ["Saumon grillé", "Salade estivale", "Fromage de chèvre"],
      body: 2,
      sweetness: 1,
      roundness: 2,
      intensity: 2,
      complexity: 2,
      oakInfluence: 1,
      cellaringPotential: "À boire jeune, pour sa fraîcheur.",
      aging: "4 mois en cuve de béton.",
      tastingNotes: block("Rosé frais aux notes de fraise, de pêche et de poivre noir. Les accords et le profil LPV sont des suggestions éditoriales."),
      vinification: block("Assemblage de 71 % Blaufränkisch et 29 % Grüner Veltliner. Élevage de quatre mois en béton."),
    },
    "wine-joyhill-raisin-brin-2025": {
      approxPrice: 26.02,
      purchaseUrl: "https://maisonjoyhill.com/products/caisse-de-raisin-brin-2025",
      servingTemperature: "12 à 14 °C",
      decant: "Non nécessaire",
      foodPairings: ["Pizza aux champignons", "Poulet rôti", "Charcuteries"],
      body: 2,
      sweetness: 1,
      roundness: 2,
      intensity: 2,
      complexity: 2,
      oakInfluence: 1,
      cellaringPotential: "À privilégier dans sa jeunesse.",
      aging: "5 mois en cuves de béton et d’inox.",
      tastingNotes: block("Rouge léger aux arômes d’épices et de petits fruits acidulés. À servir légèrement rafraîchi."),
      vinification: block("67 % Gamay, 21 % Blaufränkisch et 12 % Chardonnay. Vinification indépendante des trois cépages en macération semi-carbonique avec levures indigènes. Élevage de cinq mois en béton et en inox."),
    },
    "wine-joyhill-pastoral-avant-les-lumieres-2025": {
      approxPrice: 24.32,
      purchaseUrl: "https://maisonjoyhill.com/products/caisse-pastoral-avant-les-lumieres-2024",
      servingTemperature: "8 à 10 °C",
      decant: "Non nécessaire",
      foodPairings: ["Crevettes", "Salade d’agrumes", "Poisson blanc"],
      body: 2,
      sweetness: 1,
      roundness: 2,
      intensity: 2,
      complexity: 2,
      oakInfluence: 1,
      cellaringPotential: "À apprécier jeune.",
      aging: "5 mois en cuve d’inox.",
      tastingNotes: block("Blanc léger aux notes de fruits tropicaux et d’agrumes."),
      vinification: block("Assemblage de 51 % Seyval blanc, 28 % Louise Swenson, 11 % Saint-Pépin et 10 % Vidal. Pressurage direct et fermentation indigène sur marcs de vinifera Joy Hill. Élevage de cinq mois en inox."),
    },
    "wine-joyhill-la-butte-2024": {
      approxPrice: 31,
      purchaseUrl: "https://maisonjoyhill.com/collections/joyhill",
      servingTemperature: "14 à 16 °C",
      decant: "Aération facultative",
      foodPairings: ["Canard rôti", "Champignons grillés", "Pâtes aux tomates confites"],
      body: 3,
      sweetness: 1,
      roundness: 3,
      intensity: 3,
      complexity: 3,
      oakInfluence: 2,
      cellaringPotential: "À boire maintenant ou après une courte garde.",
      aging: "10 mois sous bois.",
      tastingNotes: block("Rouge aux notes de cassis, de bleuets compotés et de muscade."),
      vinification: block("100 % Blaufränkisch. Élevage de dix mois sous bois."),
    },
    "wine-joyhill-le-gosier-2025": {
      approxPrice: 26.02,
      purchaseUrl: "https://maisonjoyhill.com/collections/joyhill",
      servingTemperature: "6 à 8 °C",
      decant: "Non",
      foodPairings: ["Huîtres", "Bouchées apéritives", "Tarte aux fraises peu sucrée"],
      body: 2,
      sweetness: 1,
      roundness: 2,
      intensity: 3,
      complexity: 2,
      oakInfluence: 1,
      cellaringPotential: "À privilégier jeune.",
      aging: "5 mois en inox.",
      tastingNotes: block("Mousseux rosé aux notes de fraises des champs et aux nuances pâtissières."),
      vinification: block("Assemblage de 76 % Chardonnay et 24 % Gamay. Élevage de cinq mois en inox."),
    },
  };

  Object.assign(data, details[wine.id] || {});

  if (refs.length) data.grapes = refs;

  if (existing) {
    // Conserver les autres champs déjà renseignés.
    await client.patch(wine.id).set(data).commit();
  } else {
    await client.create({
      _id: wine.id,
      _type: "wine",
      ...data,
    });
  }

  console.log("✓ Enregistrée dans Sanity");
}

console.log(
  WRITE
    ? "\n✓ JOY HILL — TRAITEMENT TERMINÉ"
    : "\n✓ SIMULATION TERMINÉE — aucune modification"
);
