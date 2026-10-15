const TODAY = "2026-09-28";

const common = {
  producer: "producer-vignoble-pigeon-hill",
  country: "Canada",
  region: "55a9fe9a-b3fe-41d6-8145-6adca1a818a8",
  appellation: "appellation-igp-vin-du-quebec",
  beverageType: "wine",
  alcoholFree: false,
  purchaseChannel: "Au domaine / détaillants spécialisés",
  purchaseUrl: "https://vignoblepigeonhill.com/nos-vins/",
  purchaseLastChecked: TODAY,
  bottleSize: "750 ml",
  isOrganic: true,
  isNatural: true,
  isBiodynamic: false,
  harvestMethod: "manual",
  certifications: ["Biologique"],
  published: true,
};

const technicalDNA = (overrides = {}) => ({
  fruitIntensity: { confidence: 0.9, source: "tasting" },
  minerality: { confidence: 0.75, source: "tasting" },
  savory: { confidence: 0.75, source: "tasting" },
  ...overrides,
});

const inferredDNA = () => ({
  fruitIntensity: { confidence: 0.55, source: "inferred" },
  minerality: { confidence: 0.45, source: "inferred" },
  savory: { confidence: 0.45, source: "inferred" },
});

const block = (text, key) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{
    _key: `${key}-span`,
    _type: "span",
    marks: [],
    text
  }]
});

export const pigeonHillBatch = {
  name: "Vignoble Pigeon Hill — inventaire complet 2026",
  wines: [

    {
      ...common,
      name: "Champs Fleuris",
      vintage: 2025,
      color: "red",
      grapes: [
        "Frontenac gris",
        "Saint-Pépin",
        "La Crescent",
        "Petite Perle",
        "Marquette",
        "Pinot noir"
      ],
      approxPrice: 34.5,

      oneLiner:
        "Un assemblage de champ rouge et blanc, juteux et vibrant, pensé comme un vin de soif mais avec une vraie signature de terroir.",
      oneLinerEn:
        "A vibrant red-and-white field blend, juicy and highly drinkable while still carrying a clear sense of place.",

      tastingKeywords: ["Fraise", "Framboise", "Orange", "Épices", "Pamplemousse"],
      tastingKeywordsEn: ["Strawberry", "Raspberry", "Orange peel", "Spice", "Grapefruit"],

      perfectFor: ["Apéro", "Table conviviale", "Cuisine simple"],
      perfectForEn: ["Aperitif", "Casual dinners", "Simple food"],

      whyWeRecommend:
        "Parce qu’il montre parfaitement ce que peut être un vin québécois libre et précis : beaucoup de fruit, de fraîcheur et aucune lourdeur. Une excellente porte d’entrée vers les assemblages nordiques.",
      whyWeRecommendEn:
        "Because it captures what a free-spirited yet precise Quebec wine can be: plenty of fruit, freshness and no heaviness. An excellent introduction to northern field blends.",

      body: 2,
      sweetness: 1,
      roundness: 3,
      servingTemperature: "12–14 °C",
      decant: false,

      alcohol: 12.5,
      sugar: "< 1,2 g/L",
      acidity: 4,
      tannins: 2,

      style: "Assemblage de champ frais et juteux",
      cellaringPotential: "À boire jeune pour son fruit et sa fraîcheur.",

      aromas: ["Fraise confite", "Framboise", "Pelure d’orange", "Épices"],
      flavors: ["Fruits des champs", "Agrumes", "Pamplemousse"],
      texture: "Légèrement ronde et juteuse",
      finish: "Persistante, marquée par le pamplemousse",

      fruitIntensity: 4,
      minerality: 2,
      savory: 2,
      intensity: 4,
      complexity: 3,
      oakInfluence: 1,
      dnaMetadata: technicalDNA(),

      vinification: [
        block(
          "Vendanges manuelles et tri des raisins. Pressurage direct de tous les cépages sauf le Frontenac gris, macéré cinq jours. Cofermentation du Saint-Pépin et du La Crescent, puis de la Petite Perle et de la Marquette; assemblage avec le Pinot noir. Fermentation naturelle, sans filtration ni collage.",
          "vinif-champs"
        )
      ],
      aging: "Cuves inox sur lies fines; fermentation malolactique complétée. Embouteillé en août 2026.",
      soil: "Terroir de Saint-Armand; approche régénératrice fondée sur l’agroécologie et l’agropastoralisme.",

      tastingNotes:
        "Arômes de fraise et de framboise confites, pelure d’orange et épices. Bouche légèrement ronde sur les fruits des champs, avec une finale persistante de pamplemousse.",
      tastingNotesEn:
        "Candied strawberry and raspberry aromas with orange peel and spice. Slightly round on the palate, with wild berry flavours and a persistent grapefruit finish.",

      experienceLevel: "beginner"
    },

    {
      ...common,
      name: "Le Pigeon",
      vintage: 2024,
      color: "red",
      grapes: ["Marquette"],
      approxPrice: 34,

      oneLiner:
        "Une cuvée rouge de Pigeon Hill centrée sur le fruit, la fraîcheur et l’expression sans artifice de Saint-Armand.",
      oneLinerEn:
        "A Pigeon Hill red centred on fruit, freshness and an unforced expression of Saint-Armand.",

      tastingKeywords: ["Fruits rouges", "Frais", "Juteux"],
      tastingKeywordsEn: ["Red fruit", "Fresh", "Juicy"],

      perfectFor: ["Souper décontracté", "Viandes grillées"],
      perfectForEn: ["Casual dinner", "Grilled meats"],

      whyWeRecommend:
        "Une cuvée à découvrir pour comprendre l’approche de Pigeon Hill : agriculture biologique régénératrice et vinification à intervention minimale.",
      whyWeRecommendEn:
        "A useful bottle for understanding Pigeon Hill's approach: regenerative organic farming and minimal-intervention winemaking.",

      body: 3,
      sweetness: 1,
      roundness: 3,
      servingTemperature: "13–15 °C",
      decant: false,

      style: "Rouge nordique frais",
      fruitIntensity: 4,
      minerality: 2,
      savory: 2,
      intensity: 3,
      complexity: 3,
      oakInfluence: 1,
      dnaMetadata: inferredDNA(),

      experienceLevel: "intermediate"
    },

    {
      ...common,
      name: "Soir d’Été",
      vintage: 2025,
      color: "white",
      grapes: ["Saint-Pépin", "Louise Swenson", "Frontenac gris", "La Crescent"],
      approxPrice: 28.19,

      oneLiner:
        "Un blanc nordique vif et convivial où poire, agrumes, fleurs et légère minéralité se rencontrent.",
      oneLinerEn:
        "A lively, easygoing northern white bringing together pear, citrus, floral notes and a light mineral edge.",

      tastingKeywords: ["Poire", "Citron", "Floral", "Miel", "Minéral"],
      tastingKeywordsEn: ["Pear", "Lemon", "Floral", "Honey", "Mineral"],

      perfectFor: ["Apéro", "Poisson", "Terrasse"],
      perfectForEn: ["Aperitif", "Fish", "Patio"],

      whyWeRecommend:
        "Un assemblage qui montre très bien la complémentarité des cépages blancs nordiques. Frais, aromatique et facile à mettre à table.",
      whyWeRecommendEn:
        "A blend that clearly shows how complementary northern white varieties can be. Fresh, aromatic and easy to bring to the table.",

      body: 2,
      sweetness: 1,
      roundness: 2,
      servingTemperature: "8–10 °C",
      decant: false,

      alcohol: 12.3,
      sugar: "< 1,2 g/L",
      acidity: 4,
      tannins: 1,

      style: "Blanc frais et aromatique",
      cellaringPotential: "À boire jeune pour préserver son éclat aromatique.",

      aromas: ["Poire", "Agrumes", "Fleurs", "Miel"],
      flavors: ["Poire", "Citron"],
      texture: "Vive et fruitée",
      finish: "Légèrement minérale et persistante",

      fruitIntensity: 4,
      minerality: 3,
      savory: 1,
      intensity: 3,
      complexity: 3,
      oakInfluence: 1,
      dnaMetadata: technicalDNA(),

      vinification: [
        block(
          "Pressurage direct du Frontenac gris, du La Crescent et du Louise Swenson. Un tiers du Saint-Pépin macéré cinq jours, le reste pressé après récolte. Fermentation naturelle de 14 jours, sans filtration ni collage.",
          "vinif-soir"
        )
      ],
      aging: "Cuves inox sur lies fines; fermentation malolactique complétée. Embouteillé en août 2026.",
      soil: "Terroir de Saint-Armand; viticulture biologique et régénératrice.",

      tastingNotes:
        "Poire et agrumes avec des notes florales et mielleuses. Bouche fruitée et vive sur la poire et le citron, finale légèrement minérale.",
      tastingNotesEn:
        "Pear and citrus with floral and honeyed notes. Fruity and lively on the palate, with pear and lemon leading to a lightly mineral finish.",

      experienceLevel: "beginner"
    },

    {
      ...common,
      name: "Le Rosé",
      vintage: 2025,
      color: "rose",
      grapes: ["Marquette"],
      approxPrice: 28.99,

      oneLiner:
        "Un rosé de Marquette coloré, gourmand et frais, assez simple pour l’apéro mais structuré pour passer à table.",
      oneLinerEn:
        "A deeply coloured Marquette rosé that is juicy and fresh, easy enough for aperitif yet structured enough for the table.",

      tastingKeywords: ["Fraise", "Framboise", "Canneberge", "Floral", "Frais"],
      tastingKeywordsEn: ["Strawberry", "Raspberry", "Cranberry", "Floral", "Fresh"],

      perfectFor: ["Terrasse", "Apéro", "Repas d’été"],
      perfectForEn: ["Patio", "Aperitif", "Summer meals"],

      whyWeRecommend:
        "Parce qu’il sort du rosé anonyme : le Marquette lui donne du fruit, de la couleur et juste assez de structure pour être polyvalent à table.",
      whyWeRecommendEn:
        "Because it moves beyond anonymous rosé: Marquette gives it fruit, colour and just enough structure to make it versatile at the table.",

      body: 2,
      sweetness: 1,
      roundness: 2,
      servingTemperature: "9–11 °C",
      decant: false,

      alcohol: 12.3,
      sugar: "< 1,2 g/L",
      acidity: 4,
      tannins: 1,

      style: "Rosé sec, fruité et structuré",
      cellaringPotential: "À boire jeune.",

      aromas: ["Fraise des champs", "Framboise", "Canneberge", "Fleurs sauvages"],
      flavors: ["Petits fruits rouges", "Canneberge"],
      texture: "Fraîche avec une légère structure",
      finish: "Désaltérante",

      fruitIntensity: 4,
      minerality: 2,
      savory: 1,
      intensity: 3,
      complexity: 2,
      oakInfluence: 1,
      dnaMetadata: technicalDNA(),

      vinification: [
        block(
          "Marquette délicatement égrappé puis légèrement pressé pour obtenir le jus de goutte. Fermentation naturelle de 12 jours, suivie d’un soutirage. Sans filtration ni collage.",
          "vinif-rose"
        )
      ],
      aging: "Cuves inox sur lies fines; fermentation malolactique complétée. Embouteillé en avril 2026.",
      soil: "Terroir de Saint-Armand; viticulture biologique et régénératrice.",

      tastingNotes:
        "Fraise des champs, framboise, canneberge et fleurs sauvages. Bouche fraîche et fruitée avec une légère structure et une finale désaltérante.",
      tastingNotesEn:
        "Wild strawberry, raspberry, cranberry and wildflowers. Fresh and fruity on the palate with subtle structure and a refreshing finish.",

      experienceLevel: "beginner"
    },

    {
      ...common,
      name: "Terroir de Saint-Armand – Harris",
      vintage: 2024,
      color: "red",
      grapes: ["Marquette", "Pinot noir"],
      approxPrice: 39,

      oneLiner:
        "Une collaboration de Saint-Armand qui réunit Marquette et Pinot noir dans un rouge vivant, juteux et légèrement poivré.",
      oneLinerEn:
        "A Saint-Armand collaboration bringing Marquette and Pinot Noir together in a lively, juicy and lightly peppery red.",

      tastingKeywords: ["Cerise", "Framboise", "Poivre", "Juteux", "Souple"],
      tastingKeywordsEn: ["Cherry", "Raspberry", "Pepper", "Juicy", "Supple"],

      perfectFor: ["Canard", "Porc", "Souper d’automne"],
      perfectForEn: ["Duck", "Pork", "Autumn dinner"],

      whyWeRecommend:
        "La rencontre du Marquette et du Pinot noir donne ici un rouge accessible mais nuancé, avec un élevage en fût qui reste au service du fruit.",
      whyWeRecommendEn:
        "Marquette and Pinot Noir meet in an approachable yet nuanced red, with barrel ageing that remains in service of the fruit.",

      body: 3,
      sweetness: 1,
      roundness: 4,
      servingTemperature: "14–16 °C",
      decant: true,

      alcohol: 11.8,
      sugar: "< 1,2 g/L",
      acidity: 3,
      tannins: 2,

      style: "Rouge souple et juteux",
      cellaringPotential: "À boire maintenant ou à laisser évoluer en cave.",

      aromas: ["Cerise", "Framboise rouge", "Framboise noire", "Poivre"],
      flavors: ["Fruits rouges confits", "Cerise", "Framboise"],
      texture: "Juteuse et ronde",
      finish: "Persistante",

      fruitIntensity: 4,
      minerality: 2,
      savory: 3,
      intensity: 3,
      complexity: 4,
      oakInfluence: 3,
      dnaMetadata: technicalDNA(),

      vinification: [
        block(
          "Vendanges manuelles. Saignée du Marquette puis macération sur peaux; Pinot noir cofermenté en grappes entières. Fermentation spontanée et fermentation malolactique complétée.",
          "vinif-harris"
        )
      ],
      aging: "12 mois en fûts de chêne usagés. Embouteillé en novembre 2025.",
      soil: "Terres alluviales de Saint-Armand.",

      tastingNotes:
        "Cerise, framboise rouge et noire et touche poivrée. Bouche juteuse et ronde, tanins souples, acidité subtile et finale persistante.",
      tastingNotesEn:
        "Cherry, red and black raspberry with a light peppery note. Juicy and round, with supple tannins, subtle acidity and a lingering finish.",

      experienceLevel: "intermediate"
    },

    {
      ...common,
      name: "Les Marguerites Saint-Pépin",
      vintage: 2025,
      color: "white",
      grapes: ["Saint-Pépin"],
      approxPrice: 29.39,

      oneLiner:
        "Une cuvée parcellaire de Saint-Pépin qui met en avant l’un des cépages blancs emblématiques du vignoble.",
      oneLinerEn:
        "A Saint-Pépin cuvée highlighting one of the vineyard's signature northern white varieties.",

      tastingKeywords: ["Frais", "Floral", "Fruit blanc"],
      tastingKeywordsEn: ["Fresh", "Floral", "White fruit"],

      perfectFor: ["Apéro", "Poisson"],
      perfectForEn: ["Aperitif", "Fish"],

      whyWeRecommend:
        "Une bonne façon de goûter le Saint-Pépin seul et de comprendre sa place dans le vignoble québécois.",
      whyWeRecommendEn:
        "A useful way to taste Saint-Pépin on its own and understand its place in Quebec vineyards.",

      body: 2,
      sweetness: 1,
      roundness: 2,
      servingTemperature: "8–10 °C",
      decant: false,

      style: "Blanc nordique frais",
      fruitIntensity: 3,
      minerality: 3,
      savory: 1,
      intensity: 3,
      complexity: 3,
      oakInfluence: 1,
      dnaMetadata: inferredDNA(),

      experienceLevel: "intermediate"
    },

    {
      ...common,
      name: "Clos Rousseau Marquette",
      vintage: 2024,
      color: "red",
      grapes: ["Marquette"],
      approxPrice: 29,

      oneLiner:
        "Un Marquette parcellaire sec et précis, élevé onze mois en fût, où fruits rouges, épices et tabac se répondent.",
      oneLinerEn:
        "A dry, precise single-parcel Marquette aged eleven months in barrel, combining red fruit, spice and tobacco.",

      tastingKeywords: ["Framboise", "Cerise", "Épices", "Tabac", "Sec"],
      tastingKeywordsEn: ["Raspberry", "Cherry", "Spice", "Tobacco", "Dry"],

      perfectFor: ["Canard", "Porc rôti", "Champignons"],
      perfectForEn: ["Duck", "Roast pork", "Mushrooms"],

      whyWeRecommend:
        "Une expression plus sérieuse du Marquette, avec dix-huit ans de vigne et un élevage en fût qui apporte de la profondeur sans masquer le fruit.",
      whyWeRecommendEn:
        "A more serious expression of Marquette, from eighteen-year-old vines with barrel ageing that adds depth without hiding the fruit.",

      body: 3,
      sweetness: 1,
      roundness: 3,
      servingTemperature: "14–16 °C",
      decant: true,

      alcohol: 12,
      sugar: "< 1,2 g/L",
      acidity: 4,
      tannins: 2,

      style: "Rouge sec, fruité et épicé",
      cellaringPotential: "Jusqu’à 10 ans selon le producteur.",

      aromas: ["Mûre", "Framboise", "Cerise", "Épices", "Tabac"],
      flavors: ["Framboise", "Cerise", "Épices"],
      texture: "Ronde, sèche et légèrement tannique",
      finish: "Persistante",

      fruitIntensity: 4,
      minerality: 2,
      savory: 4,
      intensity: 4,
      complexity: 4,
      oakInfluence: 3,
      dnaMetadata: technicalDNA(),

      vinification: [
        block(
          "Vendanges manuelles le 14 septembre après vendanges vertes et tri au champ. Saignée de Marquette puis fermentation sur peaux après éraflage et foulage; pigeage manuel deux fois par jour avant pressurage.",
          "vinif-clos"
        )
      ],
      aging: "11 mois en fûts de chêne. Embouteillé en septembre 2025.",
      soil: "Parcelle Clos Rousseau; biodiversité et vie microbienne du vignoble au cœur de l’approche du producteur.",

      tastingNotes:
        "Mûre, framboise et cerise avec des notes d’épices et de tabac. Bouche fruitée, ronde, acidulée et sèche, avec des tanins légers et une finale persistante.",
      tastingNotesEn:
        "Blackberry, raspberry and cherry with spice and tobacco notes. Fruity, round, tangy and dry on the palate, with light tannins and a persistent finish.",

      experienceLevel: "intermediate"
    },

    {
      ...common,
      name: "Waltz",
      vintage: 2024,
      color: "white",
      grapes: ["Frontenac gris", "Louise Swenson"],
      approxPrice: 33.59,

      oneLiner:
        "Un blanc nordique d’assemblage qui explore une expression aromatique et fraîche des cépages adaptés au climat québécois.",
      oneLinerEn:
        "A northern white blend exploring the aromatic, fresh side of varieties adapted to Quebec's climate.",

      tastingKeywords: ["Agrumes", "Floral", "Frais"],
      tastingKeywordsEn: ["Citrus", "Floral", "Fresh"],

      perfectFor: ["Apéro", "Poisson"],
      perfectForEn: ["Aperitif", "Fish"],

      whyWeRecommend:
        "Une cuvée intéressante pour découvrir une autre facette des hybrides blancs nordiques et du travail minimaliste de Pigeon Hill.",
      whyWeRecommendEn:
        "An interesting bottle for discovering another side of northern white hybrids and Pigeon Hill's minimal-intervention approach.",

      body: 2,
      sweetness: 1,
      roundness: 2,
      servingTemperature: "8–10 °C",
      decant: false,

      style: "Blanc nordique aromatique",
      fruitIntensity: 3,
      minerality: 3,
      savory: 1,
      intensity: 3,
      complexity: 3,
      oakInfluence: 1,
      dnaMetadata: inferredDNA(),

      experienceLevel: "intermediate"
    }
  ]
};

export default pigeonHillBatch;
