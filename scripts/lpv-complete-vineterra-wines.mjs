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
    sugar: "<1 g/L",
    aromas: ["pêche", "fleurs blanches", "poire", "beurre", "anis étoilé"],
    tastingKeywords: ["pêche", "poire", "fleurs blanches", "beurre"],
    tastingKeywordsEn: ["peach", "pear", "white flowers", "butter"],
    perfectFor: ["fruits de mer", "poulet grillé", "fromages à pâte molle"],
    perfectForEn: ["seafood", "grilled chicken", "soft cheeses"],
    oneLiner: "Un blanc de Chardonnay et de Vidal où les fruits à chair blanche rencontrent une touche beurrée et une délicate note anisée.",
    oneLinerEn: "A Chardonnay and Vidal white combining orchard fruit, a buttery touch and a delicate hint of star anise.",
    whyWeRecommend: "Pour découvrir une autre expression du Chardonnay québécois, ici associé au Vidal dans une cuvée qui mise sur la matière autant que sur les arômes.",
    whyWeRecommendEn: "An opportunity to discover another expression of Quebec Chardonnay, blended here with Vidal in a wine that values texture as much as aroma.",
    servingTemperature: "8 °C",
    purchaseUrl: "https://www.vineterra.ca/croixsurlamontagne",
  },
  {
    slug: "vineterra-patte-de-loup-2024",
    grapes: ["Frontenac blanc", "Acadie blanc", "Frontenac noir", "Vidal"],
    alcohol: 13.5,
    sugar: "2 g/L",
    aromas: ["framboise", "pamplemousse", "caramel"],
    tastingKeywords: ["framboise", "pamplemousse", "caramel"],
    tastingKeywordsEn: ["raspberry", "grapefruit", "caramel"],
    perfectFor: ["apéritif", "saumon", "salade thaïe"],
    perfectForEn: ["aperitif", "salmon", "Thai salad"],
    oneLiner: "Un rosé québécois aux accents de framboise et de pamplemousse, avec une touche de caramel qui le distingue.",
    oneLinerEn: "A Quebec rosé with raspberry and grapefruit notes and a distinctive touch of caramel.",
    whyWeRecommend: "Parce qu’il montre qu’un rosé d’ici peut avoir une personnalité bien à lui, au-delà du simple vin d’apéritif.",
    whyWeRecommendEn: "Because it shows that a Quebec rosé can have a personality of its own, beyond being simply an aperitif wine.",
    servingTemperature: "6 °C",
    purchaseUrl: "https://www.vineterra.ca/pattedeloup",
  },
  {
    slug: "vineterra-magie-des-semis-2023",
    grapes: ["Chardonnay"],
    alcohol: 13.5,
    sugar: "1 g/L",
    aromas: ["bois", "vanille", "beurre", "pêche", "poire"],
    tastingKeywords: ["vanille", "beurre", "pêche", "poire"],
    tastingKeywordsEn: ["vanilla", "butter", "peach", "pear"],
    perfectFor: ["risotto aux champignons", "poulet à la crème", "fromages"],
    perfectForEn: ["mushroom risotto", "creamy chicken", "cheese"],
    oneLiner: "Un Chardonnay québécois généreux, aux notes de pêche, de poire, de vanille et de beurre.",
    oneLinerEn: "A generous Quebec Chardonnay with notes of peach, pear, vanilla and butter.",
    whyWeRecommend: "Pour les amateurs de Chardonnay qui aiment la rondeur et les notes beurrées. Une belle occasion de découvrir ce style élaboré à Mont-Saint-Hilaire.",
    whyWeRecommendEn: "For Chardonnay lovers who appreciate roundness and buttery notes. A chance to explore this style from Mont-Saint-Hilaire.",
    servingTemperature: "11 °C",
    purchaseUrl: "https://www.vineterra.ca/magiedessemis",
  },
  {
    slug: "vineterra-lac-sans-fond-classique-2023",
    grapes: ["Marquette", "Petite Pearl", "Frontenac noir"],
    alcohol: 13.2,
    sugar: "<1 g/L",
    aromas: ["cerise", "cassis", "mûre", "violette"],
    tastingKeywords: ["cerise", "cassis", "mûre", "violette"],
    tastingKeywordsEn: ["cherry", "blackcurrant", "blackberry", "violet"],
    perfectFor: ["pizza", "charcuteries", "plats à la tomate"],
    perfectForEn: ["pizza", "charcuterie", "tomato-based dishes"],
    oneLiner: "Un rouge québécois aux arômes de cerise, de cassis, de mûre et de violette, pensé pour accompagner la table.",
    oneLinerEn: "A Quebec red with cherry, blackcurrant, blackberry and violet notes, made for the table.",
    whyWeRecommend: "Parce qu’il réunit trois cépages bien adaptés à notre climat et propose une porte d’entrée intéressante vers les rouges québécois.",
    whyWeRecommendEn: "Because it brings together three grapes suited to our climate and offers an interesting introduction to Quebec red wines.",
    servingTemperature: "14 à 16 °C",
    purchaseUrl: "https://www.vineterra.ca/lacsansfond",
  },
  {
    slug: "vineterra-cheval-tout-blanc-classique-2024",
    grapes: ["Vidal", "Acadie blanc", "Frontenac blanc", "St-Pépin"],
    alcohol: 13,
    sugar: "3 g/L",
    aromas: ["pamplemousse rose", "pomme verte", "fruit de la passion", "fleurs blanches"],
    tastingKeywords: ["pamplemousse", "pomme verte", "passion", "fleurs blanches"],
    tastingKeywordsEn: ["grapefruit", "green apple", "passion fruit", "white flowers"],
    perfectFor: ["fruits de mer", "sushis", "poisson blanc"],
    perfectForEn: ["seafood", "sushi", "white fish"],
    oneLiner: "Un blanc vif et fruité où le pamplemousse rose, la pomme verte et les fruits exotiques donnent envie de passer à table.",
    oneLinerEn: "A lively, fruity white with pink grapefruit, green apple and tropical fruit notes.",
    whyWeRecommend: "Parce qu’il illustre bien le potentiel des assemblages de cépages cultivés au Québec et constitue une introduction accessible aux blancs du domaine.",
    whyWeRecommendEn: "Because it highlights the potential of grapes grown in Quebec and offers an approachable introduction to the estate's white wines.",
    servingTemperature: "6 à 8 °C",
    purchaseUrl: "https://www.vineterra.ca/cheval-tout-blanc",
  },
];

const normalize = (s = "") =>
  s.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const aliases = {
  "petitepearl": ["petiteperle", "petitepearl"],
  "stpepin": ["saintpepin", "stpepin"],
};

async function main() {
  const grapeDocs = await client.fetch(`
    *[_type == "grape"]{
      _id,
      name,
      "slug": slug.current
    }
  `);

  const patches = [];

  for (const wine of wines) {
    const id = `drafts.wine-${wine.slug}`;
    const existing = await client.getDocument(id);

    if (!existing) {
      throw new Error(`Brouillon introuvable : ${wine.slug}`);
    }

    if (!existing.bottleImage?.asset?._ref) {
      throw new Error(`Photo manquante : ${wine.slug}`);
    }

    const refs = [];

    for (const grape of wine.grapes) {
      const key = normalize(grape);
      const accepted = aliases[key] || [key];

      const found = grapeDocs.find((g) =>
        accepted.includes(normalize(g.name)) ||
        accepted.includes(normalize(g.slug))
      );

      if (!found) {
        throw new Error(
          `Cépage introuvable : ${grape} pour ${wine.slug}. ` +
          `Aucune fiche ne sera modifiée.`
        );
      }

      refs.push({
        _type: "reference",
        _key: found._id.replace(/[^a-zA-Z0-9_-]/g, "-"),
        _ref: found._id,
      });
    }

    patches.push({
      id,
      wine,
      refs,
    });
  }

  console.log("✓ Cinq brouillons et toutes les références vérifiés");

  const transaction = client.transaction();

  for (const { id, wine, refs } of patches) {
    const {
      slug,
      grapes,
      purchaseUrl,
      ...content
    } = wine;

    transaction.patch(id, {
      set: {
        ...content,
        grapes: refs,
        purchaseChannel: "producer",
        purchaseChannelDetails: "Consulter le domaine pour les modalités d'achat.",
        purchaseChannelDetailsEn: "Contact the estate for purchasing details.",
        // Lien vers la fiche officielle, pas une promesse de stock.
        purchaseUrl,
        published: false,
      },
    });
  }

  await transaction.commit();

  console.log("\n===== VALIDATION =====");

  const result = await client.fetch(`
    *[
      _type == "wine" &&
      _id in $ids
    ]{
      _id,
      name,
      published,
      alcohol,
      sugar,
      "grapes": grapes[]->name,
      "hasImage": defined(bottleImage.asset._ref),
      "hasEnglish": defined(oneLinerEn) && defined(whyWeRecommendEn),
      "hasEditorial": defined(oneLiner) && defined(whyWeRecommend)
    } | order(name asc)
  `, {
    ids: patches.map((p) => p.id),
  });

  console.log(JSON.stringify(result, null, 2));
  console.log("\n✓ CINQ FICHES ENRICHIES");
  console.log("✓ FR et EN");
  console.log("✓ Cépages et données techniques");
  console.log("✓ Photos conservées");
  console.log("✓ Toujours en brouillon");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
