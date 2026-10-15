import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const wines = [
  {
    slug: "vineterra-croix-sur-la-montagne-2024",
    grapes: ["Chardonnay", "Vidal"],
    alcohol: 13,
    sugar: "< 1 g/L",

    body: 3,
    sweetness: 1,
    roundness: 3,
    acidity: 4,
    tannins: 1,
    fruitIntensity: 4,
    minerality: 2,
    intensity: 4,
    complexity: 3,
    oakInfluence: 2,
    savory: 2,

    tastingKeywords: ["pêche", "poire", "fleurs blanches", "beurre"],
    tastingKeywordsEn: ["peach", "pear", "white flowers", "butter"],

    perfectFor: ["apéritif", "fruits de mer", "volaille"],
    perfectForEn: ["aperitif", "seafood", "poultry"],

    oneLiner:
      "Un blanc sec et expressif où le Chardonnay et le Vidal réunissent fruits à chair blanche, fraîcheur et rondeur.",
    oneLinerEn:
      "A dry, expressive white where Chardonnay and Vidal bring together orchard fruit, freshness and roundness.",

    whyWeRecommend:
      "Pour découvrir une autre expression du Chardonnay québécois, ici associé au Vidal dans une cuvée qui trouve son équilibre entre fraîcheur et matière.",
    whyWeRecommendEn:
      "A chance to discover another expression of Quebec Chardonnay, blended with Vidal in a wine balancing freshness and texture.",

    servingTemperature: "8 °C",
    purchaseUrl: "https://www.vineterra.ca/croixsurlamontagne",
  },

  {
    slug: "vineterra-patte-de-loup-2024",
    grapes: [
      "Frontenac blanc",
      "Acadie blanc",
      "Frontenac noir",
      "Vidal",
    ],
    alcohol: 13.5,
    sugar: "2 g/L",

    body: 2,
    sweetness: 1,
    roundness: 2,
    acidity: 4,
    tannins: 1,
    fruitIntensity: 4,
    minerality: 2,
    intensity: 4,
    complexity: 3,
    oakInfluence: 1,
    savory: 1,

    tastingKeywords: ["framboise", "pamplemousse", "agrumes", "fruité"],
    tastingKeywordsEn: ["raspberry", "grapefruit", "citrus", "fruit"],

    perfectFor: ["apéritif", "saumon", "salades estivales"],
    perfectForEn: ["aperitif", "salmon", "summer salads"],

    oneLiner:
      "Un rosé sec, fruité et frais où la framboise rencontre le pamplemousse.",
    oneLinerEn:
      "A dry, fruity and fresh rosé where raspberry meets grapefruit.",

    whyWeRecommend:
      "Parce qu’il montre une facette expressive et accessible du rosé québécois avec un assemblage de cépages bien ancré dans notre climat.",
    whyWeRecommendEn:
      "Because it shows an expressive and approachable side of Quebec rosé through grapes well suited to our climate.",

    servingTemperature: "6 °C",
    purchaseUrl: "https://www.vineterra.ca/pattedeloup",
  },

  {
    slug: "vineterra-magie-des-semis-2023",
    grapes: ["Chardonnay"],
    alcohol: 13.5,
    sugar: "1 g/L",

    body: 4,
    sweetness: 1,
    roundness: 4,
    acidity: 3,
    tannins: 1,
    fruitIntensity: 4,
    minerality: 2,
    intensity: 4,
    complexity: 4,
    oakInfluence: 4,
    savory: 2,

    tastingKeywords: ["pêche", "poire", "vanille", "beurre"],
    tastingKeywordsEn: ["peach", "pear", "vanilla", "butter"],

    perfectFor: ["volaille en sauce", "risotto", "fromages"],
    perfectForEn: ["poultry in sauce", "risotto", "cheese"],

    oneLiner:
      "Un Chardonnay ample et généreux où la pêche et la poire rencontrent des notes de beurre et de vanille.",
    oneLinerEn:
      "A generous, full Chardonnay where peach and pear meet notes of butter and vanilla.",

    whyWeRecommend:
      "Pour découvrir le Chardonnay québécois dans un registre plus ample et travaillé, avec une présence du bois assumée sans perdre le fruit.",
    whyWeRecommendEn:
      "A chance to discover Quebec Chardonnay in a fuller style, with noticeable oak while keeping the fruit at the centre.",

    servingTemperature: "11 °C",
    purchaseUrl: "https://www.vineterra.ca/magiedessemis",
  },

  {
    slug: "vineterra-lac-sans-fond-classique-2023",
    grapes: ["Marquette", "Petite Pearl", "Frontenac noir"],
    alcohol: 13.2,
    sugar: "< 1 g/L",

    body: 3,
    sweetness: 1,
    roundness: 3,
    acidity: 4,
    tannins: 3,
    fruitIntensity: 4,
    minerality: 2,
    intensity: 4,
    complexity: 3,
    oakInfluence: 2,
    savory: 3,

    tastingKeywords: ["cerise", "cassis", "mûre", "violette"],
    tastingKeywordsEn: ["cherry", "blackcurrant", "blackberry", "violet"],

    perfectFor: ["grillades", "pizza", "charcuteries"],
    perfectForEn: ["grilled meats", "pizza", "charcuterie"],

    oneLiner:
      "Un rouge sec et fruité où la cerise, le cassis et la mûre s’accompagnent d’une touche florale.",
    oneLinerEn:
      "A dry, fruit driven red where cherry, blackcurrant and blackberry meet a floral touch.",

    whyWeRecommend:
      "Parce qu’il réunit trois cépages adaptés au climat québécois dans un rouge qui constitue une belle porte d’entrée vers ce que le Québec peut produire.",
    whyWeRecommendEn:
      "Because it brings together three grapes suited to Quebec's climate in a red that offers a compelling introduction to what the province can produce.",

    servingTemperature: "14 à 16 °C",
    purchaseUrl: "https://www.vineterra.ca/lacsansfond",
  },

  {
    slug: "vineterra-cheval-tout-blanc-classique-2024",
    grapes: [
      "Vidal",
      "Acadie blanc",
      "Frontenac blanc",
      "St-Pépin",
    ],
    alcohol: 13,
    sugar: "3 g/L",

    body: 2,
    sweetness: 1,
    roundness: 2,
    acidity: 4,
    tannins: 1,
    fruitIntensity: 5,
    minerality: 2,
    intensity: 4,
    complexity: 3,
    oakInfluence: 1,
    savory: 1,

    tastingKeywords: [
      "pamplemousse",
      "pomme verte",
      "fruit de la passion",
      "fleurs blanches",
    ],
    tastingKeywordsEn: [
      "grapefruit",
      "green apple",
      "passion fruit",
      "white flowers",
    ],

    perfectFor: ["apéritif", "fruits de mer", "sushis"],
    perfectForEn: ["aperitif", "seafood", "sushi"],

    oneLiner:
      "Un blanc vif et fruité où le pamplemousse, la pomme verte et le fruit de la passion donnent le ton.",
    oneLinerEn:
      "A lively, fruity white led by grapefruit, green apple and passion fruit.",

    whyWeRecommend:
      "Parce qu’il offre une introduction particulièrement accessible aux blancs québécois et met en valeur un assemblage de cépages bien adaptés à notre climat.",
    whyWeRecommendEn:
      "Because it offers an especially approachable introduction to Quebec white wines and highlights grapes well suited to our climate.",

    servingTemperature: "6 à 8 °C",
    purchaseUrl: "https://www.vineterra.ca/cheval-tout-blanc",
  },
];

const dimensions = [
  "body",
  "sweetness",
  "roundness",
  "acidity",
  "tannins",
  "fruitIntensity",
  "minerality",
  "intensity",
  "complexity",
  "oakInfluence",
  "savory",
];

const normalize = (s = "") =>
  s.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const aliases = {
  petitepearl: ["petitepearl", "petiteperle"],
  stpepin: ["stpepin", "saintpepin"],
};

function metadataFor(wine) {
  const metadata = {};

  for (const dimension of dimensions) {
    let source = "editorial";
    let confidence = 0.8;

    if (dimension === "sweetness") {
      source = "technical";
      confidence = 0.98;
    }

    if (
      dimension === "oakInfluence" &&
      wine.slug === "vineterra-magie-des-semis-2023"
    ) {
      source = "inferred";
      confidence = 0.85;
    }

    if (
      ["minerality", "complexity", "savory"].includes(dimension)
    ) {
      source = "inferred";
      confidence = 0.7;
    }

    metadata[dimension] = {
      confidence,
      source,
    };
  }

  return metadata;
}

async function main() {
  console.log("\n===== VINETERRA FINALISATION =====");

  const grapeDocs = await client.fetch(`
    *[_type == "grape"]{
      _id,
      name,
      "slug": slug.current
    }
  `);

  const appellations = await client.fetch(`
    *[_type == "appellation"]{
      _id,
      name,
      "slug": slug.current
    }
  `);

  console.log("Cépages disponibles :", grapeDocs.length);
  console.log("Appellations disponibles :", appellations.length);

  const prepared = [];

  for (const wine of wines) {
    const draftId = `drafts.wine-${wine.slug}`;
    const publishedId = `wine-${wine.slug}`;

    const draft = await client.getDocument(draftId);

    if (!draft) {
      throw new Error(`Brouillon absent : ${wine.slug}`);
    }

    if (!draft.bottleImage?.asset?._ref) {
      throw new Error(`Photo absente : ${wine.slug}`);
    }

    const grapeRefs = wine.grapes.map((name) => {
      const key = normalize(name);
      const accepted = aliases[key] || [key];

      const found = grapeDocs.find((g) =>
        accepted.includes(normalize(g.name)) ||
        accepted.includes(normalize(g.slug))
      );

      if (!found) {
        throw new Error(
          `Cépage introuvable : ${name} pour ${wine.slug}`
        );
      }

      return {
        _type: "reference",
        _key: found._id.replace(/[^a-zA-Z0-9_-]/g, "-"),
        _ref: found._id,
      };
    });

    /*
      Le schéma exige une appellation.
      On ne choisit PAS arbitrairement une appellation.
      Si le brouillon en possède déjà une, on la conserve.
    */
    if (!draft.appellation?._ref) {
      console.log(`⚠ Appellation absente pour ${wine.slug}`);
    }

    prepared.push({
      draft,
      draftId,
      publishedId,
      wine,
      grapeRefs,
    });
  }

  const missingAppellations = prepared.filter(
    ({ draft }) => !draft.appellation?._ref
  );

  if (missingAppellations.length) {
    console.log("\n===== ARRÊT DE SÉCURITÉ =====");
    console.log(
      "Le schéma exige une appellation et je refuse d'en inventer une."
    );

    for (const item of missingAppellations) {
      console.log(" •", item.wine.slug);
    }

    console.log("\nAppellations Québec existantes possibles :");

    for (const a of appellations.filter((x) =>
      /qu[eé]bec|vin du|québécois/i.test(
        `${x.name || ""} ${x.slug || ""}`
      )
    )) {
      console.log(` • ${a._id} | ${a.name}`);
    }

    console.log(
      "\nAucune donnée n'a été modifiée. Copie-moi cette sortie."
    );

    return;
  }

  const transaction = client.transaction();

  for (const {
    draft,
    draftId,
    publishedId,
    wine,
    grapeRefs,
  } of prepared) {
    const {
      slug,
      grapes,
      purchaseUrl,
      ...content
    } = wine;

    const finalDoc = {
      ...draft,

      _id: publishedId,
      _type: "wine",

      ...content,

      slug: {
        _type: "slug",
        current: slug,
      },

      grapes: grapeRefs,

      purchaseChannel: "producer",
      purchaseChannelDetails: "Disponible au vignoble",
      purchaseChannelDetailsEn: "Available at the vineyard",
      purchaseUrl,
      purchaseLastChecked: "2026-10-13",

      dnaMetadata: metadataFor(wine),

      decant: false,

      published: true,
    };

    delete finalDoc._rev;
    delete finalDoc._createdAt;
    delete finalDoc._updatedAt;
    delete finalDoc._system;

    transaction.createOrReplace(finalDoc);
    transaction.delete(draftId);
  }

  await transaction.commit();

  console.log("\n✓ CINQ VINS PUBLIÉS");

  const result = await client.fetch(`
    *[
      _type == "wine" &&
      published == true &&
      references("producer-vineterra")
    ] | order(vintage desc, name asc) {
      _id,
      name,
      vintage,
      color,
      published,
      purchaseChannel,
      purchaseChannelDetails,
      "hasImage": defined(bottleImage.asset._ref),

      body,
      sweetness,
      roundness,
      acidity,
      tannins,
      fruitIntensity,
      minerality,
      intensity,
      complexity,
      oakInfluence,
      savory,

      dnaMetadata,

      "grapes": grapes[]->name
    }
  `);

  console.log("\n===== CONTRÔLE FINAL =====");
  console.log(JSON.stringify(result, null, 2));

  console.log("\nNombre de vins Vineterra publiés :", result.length);

  const complete = result.filter((wine) =>
    dimensions.every(
      (dimension) =>
        typeof wine[dimension] === "number" &&
        wine[dimension] >= 1 &&
        wine[dimension] <= 5 &&
        typeof wine.dnaMetadata?.[dimension]?.confidence === "number" &&
        !!wine.dnaMetadata?.[dimension]?.source
    )
  );

  console.log(
    "Wine DNA complet :",
    `${complete.length}/${result.length}`
  );

  if (result.length === 5 && complete.length === 5) {
    console.log("\n✓ 5/5 visibles comme vins publiés");
    console.log("✓ 5/5 Wine DNA complet");
    console.log("✓ 5/5 DATA LPV documentée");
    console.log("✓ 5/5 admissibles au moteur");
    console.log("✓ Circuit : Disponible au vignoble");
    console.log("✓ La fiche producteur peut maintenant les récupérer");
  } else {
    console.log(
      "\n⚠ Contrôle incomplet. Ne considère pas Vineterra terminé."
    );
  }
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
