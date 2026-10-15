import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "czq6bjyu",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: WRITE ? process.env.SANITY_API_WRITE_TOKEN : undefined,
});

const portableText = (text) => [{
  _type: "block",
  _key: randomUUID().slice(0, 12),
  style: "normal",
  markDefs: [],
  children: [{
    _type: "span",
    _key: randomUUID().slice(0, 12),
    text,
    marks: [],
  }],
}];

const normalize = (s = "") =>
  s.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const grapes = await client.fetch(`
  *[_type == "grape"]{
    _id,
    name,
    "slug": slug.current
  }
`);

function grapeRef(...possibleNames) {
  const wanted = possibleNames.map(normalize);

  const found = grapes.find((g) =>
    wanted.includes(normalize(g.name)) ||
    wanted.includes(normalize(g.slug))
  );

  return found
    ? { _type: "reference", _key: randomUUID().slice(0, 12), _ref: found._id }
    : null;
}

const fiches = [
  {
    id: "wine-bauge-la-renversante",
    vintage: 2023,
    alcohol: 11,
    sugar: "1,2 g/L",
    grapes: [
      ["La Crescent", "LaCrescent"],
      ["Frontenac blanc"],
    ],

    oneLiner:
      "Un blanc de macération hautement aromatique, texturé et vibrant, qui porte parfaitement son nom.",
    oneLinerEn:
      "A highly aromatic, textured and vibrant skin-contact white that lives up to its name.",

    tastingKeywords: [
      "Aromatique",
      "Texture",
      "Vivacité",
      "Agrumes",
    ],
    tastingKeywordsEn: [
      "Aromatic",
      "Texture",
      "Freshness",
      "Citrus",
    ],

    perfectFor: [
      "Découvrir les vins de macération",
      "Un apéro qui sort de l’ordinaire",
      "Des plats épicés",
    ],
    perfectForEn: [
      "Discovering skin-contact wines",
      "An unconventional aperitif",
      "Spicy dishes",
    ],

    whyWeRecommend:
      "Parce qu’elle montre à quel point un vin québécois peut sortir des cases. La macération apporte de la texture et du caractère, mais l’ensemble conserve une belle tension. Une bouteille parfaite pour ceux qui veulent découvrir le vin orange sans tomber dans quelque chose de trop lourd.",
    whyWeRecommendEn:
      "It shows how confidently Québec wine can step outside the usual categories. Skin contact brings texture and character while preserving freshness and tension.",

    body: 3,
    sweetness: 1,
    roundness: 3,
    servingTemperature: "10–12 °C",
    decant: false,
    intensity: 4,
    complexity: 4,
    oakInfluence: 1,

    style: "Blanc sec de macération, texturé et aromatique",
    aging: "Cuve inox et barrique neutre",
    harvestMethod: "manual",

    vinification:
      "Millésime 2023. Assemblage de 75 % La Crescent et 25 % Frontenac blanc. Le La Crescent est égrappé, foulé puis macéré avec ses peaux pendant quatre jours avant pressurage et fermentation avec levures naturelles en cuve inox. Le Frontenac blanc est macéré avec ses peaux pendant trois semaines avant l’assemblage. Élevage en inox et barrique neutre. Mise en bouteille par gravité, sans filtration ni collage.",

    tastingNotes:
      "Une cuvée déliée, texturée et hautement aromatique. La macération apporte de la structure tandis que le Frontenac blanc contribue à la tension, à la vivacité et au caractère tonique du vin.",
  },

  {
    id: "wine-bauge-trois-frontenacs",
    vintage: 2023,
    alcohol: 12.5,
    sugar: "1,6 g/L",
    grapes: [
      ["Frontenac blanc"],
      ["Frontenac noir", "Frontenac"],
      ["Frontenac gris"],
    ],

    oneLiner:
      "Trois Frontenacs réunis dans un rouge énergique, salivant et étonnamment polyvalent à table.",
    oneLinerEn:
      "Three Frontenac varieties come together in an energetic, savoury red built for the table.",

    tastingKeywords: [
      "Éclatant",
      "Salin",
      "Acidulé",
      "Fruits noirs",
    ],
    tastingKeywordsEn: [
      "Bright",
      "Saline",
      "Tangy",
      "Dark fruit",
    ],

    perfectFor: [
      "Une grande tablée",
      "Des plats grillés",
      "Découvrir les Frontenacs",
    ],
    perfectForEn: [
      "A dinner party",
      "Grilled dishes",
      "Discovering Frontenac",
    ],

    whyWeRecommend:
      "Parce qu’ici, les trois Frontenacs jouent chacun leur rôle. Le blanc et le gris apportent de l’ampleur et de l’aromatique; le noir donne l’énergie et la couleur. Le résultat est un rouge québécois singulier, vivant et particulièrement intéressant à table.",
    whyWeRecommendEn:
      "Each Frontenac plays a role here: white and grey bring breadth and aromatics while black Frontenac contributes energy and colour. The result is a distinctive Québec red made for the table.",

    body: 3,
    sweetness: 1,
    roundness: 2,
    servingTemperature: "14–16 °C",
    decant: false,
    intensity: 4,
    complexity: 4,
    oakInfluence: 1,

    style: "Rouge sec, énergique et salivant",
    aging: "10 mois sur lies fines en cuve inox",
    harvestMethod: "manual",

    vinification:
      "Millésime 2023. Frontenac blanc, Frontenac gris et Frontenac noir vendangés à la main le 29 septembre. Les trois variétés sont placées dans une même cuve en couches successives, puis la cuve est saturée de gaz carbonique. Macération de cinq jours sous gaz, pressurage, puis fin de fermentation avec levures indigènes en cuve. Élevage sur lies fines pendant dix mois. Mise en bouteille par gravité, sans pompage, filtration, collage ni sulfite.",

    tastingNotes:
      "Le Frontenac blanc et le Frontenac gris apportent une bouche nourrie et enveloppante ainsi qu’un profil aromatique éclatant. Le Frontenac noir apporte énergie et couleur. Une subtile astringence accompagne un profil salin et acidulé.",
  },

  {
    id: "wine-bauge-les-beaux-jus-le-blanc",
    vintage: 2023,
    alcohol: 13,
    sugar: "1,6 g/L",
    grapes: [
      ["Frontenac blanc"],
    ],

    oneLiner:
      "Un Frontenac blanc pur, lumineux et salivant, avec juste assez de matière pour ne jamais tomber dans la simplicité.",
    oneLinerEn:
      "Pure Frontenac Blanc: bright, mouthwatering and textured without losing its freshness.",

    tastingKeywords: [
      "Lumineux",
      "Salivant",
      "Frais",
      "Texturé",
    ],
    tastingKeywordsEn: [
      "Bright",
      "Mouthwatering",
      "Fresh",
      "Textured",
    ],

    perfectFor: [
      "L’apéro",
      "Les poissons et fruits de mer",
      "Une bouteille à partager",
    ],
    perfectForEn: [
      "Aperitif",
      "Fish and seafood",
      "A bottle to share",
    ],

    whyWeRecommend:
      "Parce que c’est une très belle façon de découvrir le Frontenac blanc seul. La macération carbonique lui donne de l’expression, tandis que le passage en béton et l’élevage sur lies apportent de la matière sans enlever son éclat.",
    whyWeRecommendEn:
      "It is a compelling way to discover Frontenac Blanc on its own. Carbonic maceration adds expression while concrete and lees ageing bring texture without sacrificing brightness.",

    body: 3,
    sweetness: 1,
    roundness: 3,
    servingTemperature: "9–11 °C",
    decant: false,
    intensity: 4,
    complexity: 4,
    oakInfluence: 1,

    style: "Blanc sec, lumineux et texturé",
    aging:
      "1,5 mois en cuve ovoïde de béton, puis 6 mois sur lies fines",
    harvestMethod: "manual",

    vinification:
      "Millésime 2023. 100 % Frontenac blanc vendangé manuellement les 3, 4 et 5 octobre. Les grappes entières subissent une macération carbonique de neuf jours, suivie d’un pressurage et d’une fermentation avec levures indigènes en cuve inox. Le vin poursuit ensuite son élevage pendant un mois et demi dans des cuves ovoïdes en béton de 2 000 L, puis six mois sur lies fines. Transformation malolactique et effet de bâtonnage. Mise en bouteille par gravité, sans pompage, filtration ni collage.",

    tastingNotes:
      "Un blanc pur et éclatant au profil salivant. L’élevage et le travail sur lies apportent une sensation plus veloutée tout en préservant la luminosité et la fraîcheur du Frontenac blanc.",
  },

  {
    id: "wine-bauge-les-beaux-jus-le-rouge",
    vintage: 2022,
    alcohol: 11,
    sugar: "1,6 g/L",
    grapes: [
      ["Frontenac noir", "Frontenac"],
    ],

    oneLiner:
      "Un Frontenac noir souple et éclatant, avec de petits tannins fins et beaucoup plus de fraîcheur que sa couleur ne le laisse croire.",
    oneLinerEn:
      "A supple, bright Frontenac Noir with fine tannins and far more freshness than its deep colour suggests.",

    tastingKeywords: [
      "Fruits noirs",
      "Souple",
      "Tannins fins",
      "Fraîcheur",
    ],
    tastingKeywordsEn: [
      "Dark fruit",
      "Supple",
      "Fine tannins",
      "Freshness",
    ],

    perfectFor: [
      "Une pizza",
      "Des grillades",
      "Un rouge légèrement rafraîchi",
    ],
    perfectForEn: [
      "Pizza",
      "Grilled food",
      "A lightly chilled red",
    ],

    whyWeRecommend:
      "Parce qu’il joue avec les attentes. Sa robe foncée pourrait faire croire à un rouge massif, mais on trouve plutôt un vin souple, frais et porté par de petits tannins fins. Un rouge nature facile à mettre sur la table.",
    whyWeRecommendEn:
      "It plays with expectations. Its dark colour suggests power, yet the wine is supple, fresh and carried by fine tannins. An easy natural red to bring to the table.",

    body: 3,
    sweetness: 1,
    roundness: 3,
    servingTemperature: "14–16 °C",
    decant: false,
    intensity: 3,
    complexity: 3,
    oakInfluence: 1,

    style: "Rouge sec, souple et fruité",
    aging: "10 mois en cuve inox",
    harvestMethod: "manual",

    vinification:
      "Millésime 2022. 100 % Frontenac noir vendangé à la main le 30 septembre. Les grappes entières sont placées sous gaz carbonique pendant cinq jours. Le jus est ensuite fermenté en cuve inox avec ses levures naturelles. Élevage total de dix mois en cuve inox. Mise en bouteille par gravité, sans pompage, filtration, collage, sulfite ni autres intrants.",

    tastingNotes:
      "Un rouge souple aux petits tannins fins. Malgré sa couleur soutenue, le profil demeure éclatant et frais, avec une expression généreuse du Frontenac noir.",
  },

  {
    id: "wine-bauge-vidal-sassume",
    vintage: 2023,
    alcohol: 11,
    grapes: [
      ["Vidal"],
      ["Savagnin"],
    ],

    oneLiner:
      "Un Vidal sec, vif et texturé, relevé par une petite touche de Savagnin.",
    oneLinerEn:
      "A dry, lively and textured Vidal lifted by a small touch of Savagnin.",

    tastingKeywords: [
      "Agrumes",
      "Fraîcheur",
      "Texture",
      "Minéral",
    ],
    tastingKeywordsEn: [
      "Citrus",
      "Freshness",
      "Texture",
      "Mineral",
    ],

    perfectFor: [
      "L’apéro",
      "Les fruits de mer",
      "Un repas en terrasse",
    ],
    perfectForEn: [
      "Aperitif",
      "Seafood",
      "Dinner on the terrace",
    ],

    whyWeRecommend:
      "Parce que le Vidal mérite mieux que d’être considéré comme un simple cépage passe-partout. Ici, il est placé au premier plan et le Savagnin vient ajouter une petite dimension supplémentaire. Un blanc québécois franc, sec et assumé.",
    whyWeRecommendEn:
      "Vidal deserves more than being treated as an all-purpose grape. Here it takes centre stage, with Savagnin adding another dimension to a dry and confident Québec white.",

    body: 3,
    sweetness: 1,
    roundness: 2,
    servingTemperature: "8–10 °C",
    decant: false,
    intensity: 3,
    complexity: 3,
    oakInfluence: 1,

    style: "Blanc sec, vif et texturé",
    aging: "8 mois en cuve inox",
    harvestMethod: "manual",

    vinification:
      "Millésime 2023. Assemblage de 93 % Vidal et 7 % Savagnin. Les raisins sont récoltés le même jour et pressés directement en grappes entières. Fermentation avec levures indigènes et élevage de huit mois en cuve inox. Mise en bouteille par gravité, sans filtration ni collage.",

    tastingNotes:
      "Un blanc sec qui met le Vidal au premier plan, avec une expression vive et texturée et une touche de Savagnin qui ajoute de la personnalité.",
  },
];

console.log("\n===== VIGNOBLE DE LA BAUGE — FINAL 5/5 =====");
console.log("Mode :", WRITE ? "ÉCRITURE" : "SIMULATION");

let tx = client.transaction();
let ready = true;

for (const fiche of fiches) {
  const wine = await client.getDocument(fiche.id);

  if (!wine) {
    console.log(`\n✗ FICHE INTROUVABLE : ${fiche.id}`);
    ready = false;
    continue;
  }

  console.log(`\n${wine.name}`);

  const refs = [];

  for (const alternatives of fiche.grapes) {
    const ref = grapeRef(...alternatives);

    if (!ref) {
      console.log(`✗ Cépage introuvable : ${alternatives.join(" / ")}`);
      ready = false;
    } else {
      const grape = grapes.find(g => g._id === ref._ref);
      console.log(`✓ Cépage : ${grape?.name}`);
      refs.push(ref);
    }
  }

  const patch = {
    beverageType: "wine",
    alcoholFree: false,
    vintage: fiche.vintage,
    alcohol: fiche.alcohol,
    grapes: refs,

    oneLiner: fiche.oneLiner,
    oneLinerEn: fiche.oneLinerEn,
    tastingKeywords: fiche.tastingKeywords,
    tastingKeywordsEn: fiche.tastingKeywordsEn,
    perfectFor: fiche.perfectFor,
    perfectForEn: fiche.perfectForEn,
    whyWeRecommend: fiche.whyWeRecommend,
    whyWeRecommendEn: fiche.whyWeRecommendEn,

    body: fiche.body,
    sweetness: fiche.sweetness,
    roundness: fiche.roundness,

    servingTemperature: fiche.servingTemperature,
    decant: fiche.decant,

    style: fiche.style,
    alcohol: fiche.alcohol,
    intensity: fiche.intensity,
    complexity: fiche.complexity,
    oakInfluence: fiche.oakInfluence,

    aging: fiche.aging,
    harvestMethod: fiche.harvestMethod,
    bottleSize: "750 ml",

    vinification: portableText(fiche.vinification),
    tastingNotes: portableText(fiche.tastingNotes),
  };

  if (fiche.sugar) patch.sugar = fiche.sugar;

  console.log(`✓ Millésime : ${fiche.vintage}`);
  console.log(`✓ Alcool : ${fiche.alcohol}%`);
  if (fiche.sugar) console.log(`✓ Sucre : ${fiche.sugar}`);
  console.log(`✓ Nouveau contenu LPV prêt`);
  console.log(`✓ Images conservées`);

  if (WRITE && refs.length === fiche.grapes.length) {
    tx = tx.patch(fiche.id, { set: patch });
  }
}

if (!ready) {
  console.log("\n⚠️ SIMULATION NON VALIDÉE");
  console.log("Il manque au moins un cépage ou une fiche.");
  console.log("Aucune écriture ne doit être lancée.");
  process.exit(1);
}

if (WRITE) {
  await tx.commit();
  console.log("\n======================================");
  console.log("✓ LA BAUGE — 5/5 FICHES COMPLÉTÉES");
  console.log("✓ DONNÉES TECHNIQUES INTÉGRÉES");
  console.log("✓ CONTENU LPV INTÉGRÉ");
  console.log("✓ IMAGES EXISTANTES CONSERVÉES");
  console.log("======================================");
} else {
  console.log("\n======================================");
  console.log("✓ SIMULATION VALIDÉE");
  console.log("✓ 5/5 FICHES PRÊTES");
  console.log("✓ AUCUNE MODIFICATION EFFECTUÉE");
  console.log("======================================");
  console.log("\nPour appliquer :");
  console.log("node scripts/lpv-complete-bauge-final.mjs --write");
}
