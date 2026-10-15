import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import { PERVENCHES } from "./pervenches-catalog-data.mjs";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const WRITE = process.argv.includes("--write");
if (WRITE && !client.config().token) throw new Error("Token Sanity absent.");

const ref = (_ref, _key) => ({
  _type: "reference",
  _ref,
  ...(_key ? {_key} : {}),
});

const slugify = (s = "") =>
  s.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const block = (text, key) => [{
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
}];

const EDITORIAL = {
  "bubulles-2022": {
    one: "Un Chardonnay effervescent Brut Nature, fin et salin, entre pêche blanche, pain frais, frangipane et agrumes.",
    oneEn: "A fine, saline Brut Nature Chardonnay sparkling wine with white peach, fresh bread, frangipane and citrus.",
    why: "On le recommande pour découvrir jusqu’où peut aller un effervescent québécois travaillé en méthode traditionnelle : précis, sec, long et construit autour de la fraîcheur plutôt que du dosage.",
    whyEn: "We recommend it as a compelling example of how far Québec traditional-method sparkling wine can go: precise, dry, long and driven by freshness rather than dosage.",
    keywords: ["pêche blanche","brioche","frangipane","agrumes","salin"],
    keywordsEn: ["white peach","brioche","frangipane","citrus","saline"],
    perfect: ["Huîtres","Crabe","Apéritif"],
    perfectEn: ["Oysters","Crab","Aperitif"],
    foods: ["food-huitres","food-crabe","food-poisson-fruits-de-mer"],
    dna: [3,5,2,4,5,3],
    body: 3, sweetness: 1, roundness: 3, acidity: 5, tannins: 1,
    service: "7–9 °C", level: "intermediate",
  },

  "companeros-2024": {
    one: "Un rosé de macération foncé et solaire, très fruité, avec pomelo, petits fruits et une trame tannique légère.",
    oneEn: "A deep-coloured, sunny macerated rosé with pomelo, generous fruit and a gentle tannic frame.",
    why: "On le recommande parce qu’il brouille volontairement la frontière entre rosé et rouge léger. C’est une bouteille particulièrement parlante pour découvrir les vins de macération sans aller vers un profil extrême.",
    whyEn: "We recommend it because it deliberately blurs the line between rosé and light red. It is an approachable way to discover macerated wines without moving into an extreme style.",
    keywords: ["pomelo","fruité","solaire","tannique"],
    keywordsEn: ["pomelo","fruity","sunny","tannic"],
    perfect: ["Charcuteries","Cuisine épicée","Apéro"],
    perfectEn: ["Charcuterie","Spicy food","Aperitif"],
    foods: ["food-planche-charcuteries","food-cuisine-epicee","food-tacos"],
    dna: [5,2,2,4,3,2],
    body: 3, sweetness: 1, roundness: 3, acidity: 4, tannins: 3,
    service: "11–13 °C", level: "intermediate",
  },

  "companeros-2025": {
    one: "Un rosé de macération souple et digeste, fruité mais structuré par un grain de tanin bien présent.",
    oneEn: "A supple, highly drinkable macerated rosé, fruit-driven yet structured by a distinct fine tannic grip.",
    why: "On le recommande pour son équilibre entre buvabilité et caractère. Le Pinot gris remplace ici le Gewurztraminer du millésime précédent et donne une autre lecture de cette cuvée évolutive.",
    whyEn: "We recommend it for its balance of drinkability and character. Pinot Gris replaces the previous vintage's Gewurztraminer, offering a different expression of this evolving cuvée.",
    keywords: ["cerise","petits fruits","souple","tannique"],
    keywordsEn: ["cherry","red berries","supple","tannic"],
    perfect: ["Charcuteries","Pizza","Cuisine épicée"],
    perfectEn: ["Charcuterie","Pizza","Spicy food"],
    foods: ["food-planche-charcuteries","food-pizza","food-cuisine-epicee"],
    dna: [4,2,2,3,3,2],
    body: 3, sweetness: 1, roundness: 3, acidity: 4, tannins: 3,
    service: "11–13 °C", level: "intermediate",
  },

  "le-couchant-2024": {
    one: "Un Chardonnay québécois complexe et salin, entre fleurs, cire d’abeille, noisette grillée et viennoiserie.",
    oneEn: "A complex, saline Québec Chardonnay with flowers, beeswax, toasted hazelnut and buttery pastry notes.",
    why: "On le recommande comme l’une des bouteilles qui permettent de mesurer le sérieux atteint par le Chardonnay québécois : profondeur, élevage, texture et minéralité sans perdre la fraîcheur.",
    whyEn: "We recommend it as a bottle that shows the level Québec Chardonnay can reach: depth, ageing, texture and minerality without sacrificing freshness.",
    keywords: ["salin","noisette","cire d’abeille","viennoiserie","minéral"],
    keywordsEn: ["saline","hazelnut","beeswax","pastry","mineral"],
    perfect: ["Homard","Pétoncles","Risotto"],
    perfectEn: ["Lobster","Scallops","Risotto"],
    foods: ["food-homard","food-petoncles","food-risotto"],
    dna: [3,5,3,4,5,4],
    body: 4, sweetness: 1, roundness: 4, acidity: 4, tannins: 1,
    service: "10–12 °C", level: "advanced",
  },

  "le-feu-2024": {
    one: "Un Chardonnay tendu et texturé, entre citron confit, poire, clémentine, minéralité et finale salivante.",
    oneEn: "A taut, textured Chardonnay with preserved lemon, pear, clementine, minerality and a mouth-watering finish.",
    why: "On le recommande pour son équilibre entre matière et tension. Il offre la texture d’un Chardonnay élevé en fût tout en conservant une énergie citronnée très nette.",
    whyEn: "We recommend it for the balance between texture and tension. It has the substance of barrel-aged Chardonnay while retaining clear citrus energy.",
    keywords: ["citron confit","poire","minéral","texturé","salivant"],
    keywordsEn: ["preserved lemon","pear","mineral","textured","mouth-watering"],
    perfect: ["Poisson grillé","Pétoncles","Poulet rôti"],
    perfectEn: ["Grilled fish","Scallops","Roast chicken"],
    foods: ["food-poisson-grille","food-petoncles","food-poulet-roti"],
    dna: [4,4,2,4,4,3],
    body: 3, sweetness: 1, roundness: 3, acidity: 5, tannins: 1,
    service: "10–12 °C", level: "intermediate",
  },

  "les-rosiers-2024": {
    one: "Un Chardonnay généreux et texturé, entre camomille, abricot, poire, cantaloup et brioche.",
    oneEn: "A generous, textured Chardonnay with chamomile, apricot, pear, cantaloupe and brioche.",
    why: "On le recommande pour sa personnalité très différente des Chardonnay plus droits du domaine. La macération apporte ici de la texture et une dimension aromatique particulièrement expressive.",
    whyEn: "We recommend it for a personality quite different from the estate's more linear Chardonnays. Skin contact adds texture and a particularly expressive aromatic dimension.",
    keywords: ["camomille","abricot","poire","brioche","texturé"],
    keywordsEn: ["chamomile","apricot","pear","brioche","textured"],
    perfect: ["Volaille","Curry","Fromages"],
    perfectEn: ["Poultry","Curry","Cheese"],
    foods: ["food-poulet-roti","food-curry","food-fromages"],
    dna: [5,2,2,4,4,3],
    body: 4, sweetness: 1, roundness: 4, acidity: 4, tannins: 2,
    service: "10–12 °C", level: "intermediate",
  },

  "lesperance-2025": {
    one: "Un Gewurztraminer sec, éclatant et exotique, ample sans lourdeur et porté par une fraîcheur distinctive.",
    oneEn: "A dry, vibrant and exotic Gewurztraminer, broad without heaviness and carried by distinctive freshness.",
    why: "On le recommande parce qu’il montre un Gewurztraminer aromatique sans tomber dans la lourdeur. L’élevage sur lies apporte de la matière tandis que la fraîcheur garde le vin très vivant.",
    whyEn: "We recommend it because it shows an aromatic Gewurztraminer without becoming heavy. Lees ageing adds texture while freshness keeps the wine lively.",
    keywords: ["exotique","floral","épicé","ample","frais"],
    keywordsEn: ["exotic","floral","spicy","broad","fresh"],
    perfect: ["Cuisine asiatique","Curry","Fromage"],
    perfectEn: ["Asian food","Curry","Cheese"],
    foods: ["food-cuisine-asiatique-sucree-salee","food-curry","food-fromages"],
    dna: [5,2,2,4,4,2],
    body: 4, sweetness: 1, roundness: 4, acidity: 4, tannins: 1,
    service: "9–11 °C", level: "intermediate",
  },

  "macpel-pgg-2024": {
    one: "Un blanc de macération charmeur et juteux, entre mangue, noyau de pêche, lavande, amertume et tanins.",
    oneEn: "A charming, juicy skin-contact white with mango, peach stone, lavender, bitterness and tannic grip.",
    why: "On le recommande comme porte d’entrée vers les blancs de macération : suffisamment texturé pour être distinctif, mais avec assez de fruit et de jus pour rester immédiatement séduisant.",
    whyEn: "We recommend it as an entry point to skin-contact whites: textured enough to be distinctive, yet fruity and juicy enough to remain immediately appealing.",
    keywords: ["mangue","lavande","juteux","amer","tannique"],
    keywordsEn: ["mango","lavender","juicy","bitter","tannic"],
    perfect: ["Cuisine épicée","Fromages","Cuisine végétarienne"],
    perfectEn: ["Spicy food","Cheese","Vegetarian food"],
    foods: ["food-cuisine-epicee","food-fromages","food-cuisine-vegetarienne"],
    dna: [5,2,3,4,4,3],
    body: 4, sweetness: 1, roundness: 4, acidity: 3, tannins: 3,
    service: "11–13 °C", level: "advanced",
  },

  "pinot-zweigelt-2025": {
    one: "Un rouge léger et sapide, entre cerise, framboise, violette et olive noire, avec des tanins fins.",
    oneEn: "A light, savoury red with cherry, raspberry, violet and black olive, framed by fine tannins.",
    why: "On le recommande pour ceux qui aiment les rouges légers mais pas simplistes. Le fruit du Pinot rencontre ici le côté plus épicé et sapide du Zweigelt dans un ensemble très digeste.",
    whyEn: "We recommend it for drinkers who enjoy light reds without sacrificing character. Pinot's fruit meets Zweigelt's spicier, savoury side in a highly drinkable wine.",
    keywords: ["cerise","framboise","violette","olive noire","sapide"],
    keywordsEn: ["cherry","raspberry","violet","black olive","savoury"],
    perfect: ["Canard","Champignons","Charcuteries"],
    perfectEn: ["Duck","Mushrooms","Charcuterie"],
    foods: ["food-canard","food-champignons","food-planche-charcuteries"],
    dna: [4,2,4,3,4,2],
    body: 2, sweetness: 1, roundness: 3, acidity: 4, tannins: 3,
    service: "14–15 °C", level: "intermediate",
  },

  "pur-pinot-2024": {
    one: "Un Pinot noir souple et soyeux, entre pain d’épices, cassis, canneberge et cerise.",
    oneEn: "A supple, silky Pinot Noir with gingerbread, blackcurrant, cranberry and cherry.",
    why: "On le recommande pour sa lecture libre mais précise du Pinot noir québécois. Le fruit reste au premier plan, accompagné d’épices et d’une texture particulièrement douce.",
    whyEn: "We recommend it for its free yet precise interpretation of Québec Pinot Noir. Fruit remains at the forefront, supported by spice and a particularly smooth texture.",
    keywords: ["cerise","canneberge","cassis","épices","soyeux"],
    keywordsEn: ["cherry","cranberry","blackcurrant","spice","silky"],
    perfect: ["Canard","Champignons","Saumon"],
    perfectEn: ["Duck","Mushrooms","Salmon"],
    foods: ["food-canard","food-champignons","food-saumon"],
    dna: [4,2,3,3,4,2],
    body: 3, sweetness: 1, roundness: 4, acidity: 4, tannins: 3,
    service: "14–15 °C", level: "intermediate",
  },

  "pur-pinot-2025": {
    one: "Un Pinot noir québécois souple et épicé, porté par la cerise, la canneberge et le cassis.",
    oneEn: "A supple, spicy Québec Pinot Noir driven by cherry, cranberry and blackcurrant.",
    why: "On le recommande pour découvrir le Pinot noir des Pervenches dans une expression pure et peu interventionniste, avec du fruit, une texture souple et des tanins intégrés.",
    whyEn: "We recommend it to discover Les Pervenches' Pinot Noir in a pure, low-intervention expression, with fruit, supple texture and integrated tannins.",
    keywords: ["cerise","canneberge","cassis","épicé","souple"],
    keywordsEn: ["cherry","cranberry","blackcurrant","spicy","supple"],
    perfect: ["Canard","Champignons","Saumon"],
    perfectEn: ["Duck","Mushrooms","Salmon"],
    foods: ["food-canard","food-champignons","food-saumon"],
    dna: [4,2,3,3,4,2],
    body: 3, sweetness: 1, roundness: 4, acidity: 4, tannins: 3,
    service: "14–15 °C", level: "intermediate",
  },

  "seyval-chardo-2025": {
    one: "Un blanc québécois mûr et tendu, entre ananas, mangue, poire épicée, agrumes et finale salivante.",
    oneEn: "A ripe yet taut Québec white with pineapple, mango, spiced pear, citrus and a mouth-watering finish.",
    why: "On le recommande pour l’équilibre entre maturité du fruit et tension. L’assemblage Seyval–Chardonnay donne une lecture particulièrement complète du blanc québécois contemporain.",
    whyEn: "We recommend it for the balance between ripe fruit and tension. The Seyval–Chardonnay blend offers a particularly complete expression of contemporary Québec white wine.",
    keywords: ["ananas","mangue","poire","agrumes","tendu"],
    keywordsEn: ["pineapple","mango","pear","citrus","taut"],
    perfect: ["Poisson grillé","Sushis","Poulet rôti"],
    perfectEn: ["Grilled fish","Sushi","Roast chicken"],
    foods: ["food-poisson-grille","food-sushis","food-poulet-roti"],
    dna: [5,3,2,4,4,3],
    body: 3, sweetness: 1, roundness: 3, acidity: 5, tannins: 1,
    service: "9–11 °C", level: "beginner",
  },
};

const existing = await client.fetch(
  `*[_type=="wine" && producer._ref==$producer]{
    _id,name,"slug":slug.current,bottleImage,labelImage
  }`,
  {producer:PERVENCHES.producerId}
);

const byId = new Map(existing.map(x => [x._id,x]));
const bySlug = new Map(existing.map(x => [x.slug,x]));

function makeWine(w) {
  const e = EDITORIAL[w.key];
  if (!e) throw new Error(`${w.key}: éditorial absent`);

  const slug = `les-pervenches-${w.key}`;
  const prior =
    (w.existingId && byId.get(w.existingId)) ||
    bySlug.get(slug);

  const id = prior?._id || w.existingId || `wine-${slug}`;
  const [fruitIntensity,minerality,savory,intensity,complexity,oakInfluence] = e.dna;

  const doc = {
    _id:id,
    _type:"wine",
    beverageType:"wine",
    alcoholFree:false,
    name:w.name,
    slug:{_type:"slug",current:slug},
    vintage:w.vintage,

    producer:ref(PERVENCHES.producerId),
    country:ref(PERVENCHES.country),
    region:ref(PERVENCHES.region),
    color:w.color,

    approxPrice:w.price,
    purchaseChannel:"producer",
    purchaseChannelDetails:"Disponible directement auprès du Vignoble Les Pervenches — disponibilité à vérifier.",
    purchaseChannelDetailsEn:"Available directly from Vignoble Les Pervenches — availability should be checked.",
    purchaseUrl:w.purchaseUrl,
    purchaseLastChecked:PERVENCHES.checked,

    oneLiner:e.one,
    oneLinerEn:e.oneEn,
    tastingKeywords:e.keywords,
    tastingKeywordsEn:e.keywordsEn,
    perfectFor:e.perfect,
    perfectForEn:e.perfectEn,
    whyWeRecommend:e.why,
    whyWeRecommendEn:e.whyEn,

    body:e.body,
    sweetness:e.sweetness,
    roundness:e.roundness,
    servingTemperature:e.service,
    decant:false,

    grapes:w.grapes.map((x,i)=>ref(x,`${slugify(x)}-${i}`)),
    foodPairings:e.foods.map((x,i)=>ref(x,`${slugify(x)}-${i}`)),

    style:w.style,
    alcohol:w.alcohol,
    acidity:e.acidity,
    tannins:e.tannins,

    organic:true,
    biodynamic:/biodynamique/i.test(w.culture),

    aromas:w.aromas,
    flavors:w.aromas,

    texture:
      e.roundness >= 4
        ? "Ample et texturée."
        : e.tannins >= 3
          ? "Souple avec une trame tannique présente."
          : "Fraîche et équilibrée.",

    finish:w.officialProfile,

    fruitIntensity,
    minerality,
    savory,
    intensity,
    complexity,
    oakInfluence,

    dnaMetadata:{
      fruitIntensity:{confidence:0.8,source:"editorial"},
      minerality:{confidence:0.8,source:"editorial"},
      savory:{confidence:0.8,source:"editorial"},
    },

    vinification:block(w.vinification,`${w.key}-vinification`),
    aging:w.aging,
    soil:w.soil,
    harvestMethod:w.harvest,

    tastingNotes:block(w.officialProfile,`${w.key}-tasting-fr`),
    tastingNotesEn:block(e.oneEn,`${w.key}-tasting-en`),
    editorialNote:block(e.why,`${w.key}-editorial-fr`),
    editorialNoteEn:block(e.whyEn,`${w.key}-editorial-en`),

    experienceLevel:e.level,

    aiSummary:e.one,
    seoTitle:`${w.name} — Les Pervenches | Le Premier Verre`,
    seoTitleEn:`${w.name} — Les Pervenches | Le Premier Verre`,
    seoDescription:`${e.one} Découvre cette cuvée du Vignoble Les Pervenches.`,
    seoDescriptionEn:`${e.oneEn} Discover this wine from Vignoble Les Pervenches.`,

    translationSourceHash:crypto
      .createHash("sha256")
      .update(JSON.stringify({
        oneLiner:e.one,
        tastingKeywords:e.keywords,
        perfectFor:e.perfect,
        whyWeRecommend:e.why,
      }))
      .digest("hex"),

    published:true,
  };

  if (prior?.bottleImage) doc.bottleImage=prior.bottleImage;
  if (prior?.labelImage) doc.labelImage=prior.labelImage;

  return {doc,prior};
}

const built=PERVENCHES.wines.map(makeWine);

const ids=[...new Set(built.flatMap(({doc})=>[
  doc.producer._ref,
  doc.country._ref,
  doc.region._ref,
  ...doc.grapes.map(x=>x._ref),
  ...doc.foodPairings.map(x=>x._ref),
]))];

const found=new Set(
  await client.fetch(`*[_id in $ids]._id`,{ids})
);

const errors=[];

for (const {doc} of built) {
  for (const field of [
    "name","vintage","approxPrice","purchaseUrl",
    "oneLiner","oneLinerEn","whyWeRecommend","whyWeRecommendEn",
    "body","sweetness","roundness","servingTemperature",
    "style","alcohol","soil","vinification","aging",
    "tastingNotes","tastingNotesEn",
    "editorialNote","editorialNoteEn",
    "seoTitle","seoTitleEn","seoDescription","seoDescriptionEn"
  ]) {
    const v=doc[field];
    if (
      v===undefined || v===null || v==="" ||
      (Array.isArray(v) && !v.length)
    ) errors.push(`${doc.name}: ${field} manquant`);
  }

  if (doc.tastingKeywords.length<3 || doc.tastingKeywords.length>5)
    errors.push(`${doc.name}: tastingKeywords`);
  if (doc.tastingKeywordsEn.length<3 || doc.tastingKeywordsEn.length>5)
    errors.push(`${doc.name}: tastingKeywordsEn`);
  if (doc.perfectFor.length<2 || doc.perfectFor.length>3)
    errors.push(`${doc.name}: perfectFor`);
  if (doc.perfectForEn.length<2 || doc.perfectForEn.length>3)
    errors.push(`${doc.name}: perfectForEn`);

  for (const r of [
    doc.producer,doc.country,doc.region,
    ...doc.grapes,...doc.foodPairings
  ]) {
    if (!found.has(r._ref))
      errors.push(`${doc.name}: référence cassée ${r._ref}`);
  }
}

const producer=await client.fetch(
  `*[_id==$id][0]{
    _id,name,heroImage,
    mediaPermissionStatus,
    website,instagram,
    municipality,
    foundedYear,
    contactEmail,
    visitAddress,
    visitHours,
    appointmentRequired
  }`,
  {id:PERVENCHES.producerId}
);

if (!producer) errors.push("Producteur Les Pervenches absent");

const producerPatch = {
  name:"Les Pervenches",
  slug:{_type:"slug",current:"les-pervenches"},
  municipality:"Farnham",
  country:ref(PERVENCHES.country),
  region:ref(PERVENCHES.region),

  oneLiner:
    "À Farnham, Les Pervenches cultivent un peu plus de quatre hectares en bio et biodynamie et signent des vins précis, vivants et profondément liés à leurs parcelles.",
  oneLinerEn:
    "In Farnham, Les Pervenches farm just over four hectares organically and biodynamically, producing precise, vibrant wines closely tied to their individual parcels.",

  bio:block(
    "Fondé en 1991, le vignoble est repris en 2000 par Véronique Hupin et Michael Marler. À Farnham, ils travaillent un peu plus de quatre hectares de vignes et ont contribué à faire de la biodynamie une référence importante dans le paysage viticole québécois. Leur approche privilégie les vendanges manuelles, les fermentations spontanées et des élevages patients, avec très peu d’intervention à la cave.",
    "pervenches-bio-fr"
  ),

  bioEn:block(
    "Founded in 1991, the vineyard was taken over in 2000 by Véronique Hupin and Michael Marler. In Farnham, they farm just over four hectares of vines and have helped establish biodynamic viticulture as an important reference in Québec wine. Their approach favours hand harvesting, spontaneous fermentation and patient ageing, with very little intervention in the cellar.",
    "pervenches-bio-en"
  ),

  approach:[
    {
      _key:"pervenches-terroir",
      _type:"producerApproach",
      title:"Parcelles et sols",
      text:"Chaque cuvée part d’une lecture précise de la parcelle, de l’âge des vignes et des sols, avec plusieurs vinifications permettant de préserver leurs différences."
    },
    {
      _key:"pervenches-biodynamie",
      _type:"producerApproach",
      title:"Bio et biodynamie",
      text:"Le domaine travaille en agriculture biologique et biodynamique, avec une attention particulière portée à la vie des sols et à l’équilibre de la vigne."
    },
    {
      _key:"pervenches-cave",
      _type:"producerApproach",
      title:"Peu d’intervention",
      text:"Vendanges manuelles, levures spontanées, élevages sur lies et mises sans filtration ou sans sulfite ajouté sur plusieurs cuvées définissent une approche peu interventionniste."
    }
  ],

  approachEn:[
    {
      _key:"pervenches-terroir-en",
      _type:"producerApproach",
      title:"Parcels and soils",
      text:"Each wine begins with a close reading of its parcel, vine age and soils, with separate vinifications used to preserve those differences."
    },
    {
      _key:"pervenches-biodynamie-en",
      _type:"producerApproach",
      title:"Organic and biodynamic farming",
      text:"The estate farms organically and biodynamically, with particular attention to soil life and vine balance."
    },
    {
      _key:"pervenches-cave-en",
      _type:"producerApproach",
      title:"Low intervention",
      text:"Hand harvesting, spontaneous fermentation, lees ageing and bottling without filtration or added sulphur on several wines define a low-intervention approach."
    }
  ],

  signatureGrapes:[
    ref("grape-chardonnay","perv-chardonnay"),
    ref("grape-pinot-noir","perv-pinot"),
    ref("grape-seyval","perv-seyval"),
    ref("grape-gewurztraminer","perv-gewurz")
  ],

  whyWeFollow:
    "Parce que Les Pervenches font partie des domaines qui permettent de comprendre le changement de niveau du vin québécois : travail parcellaire, viticulture exigeante, vinifications précises et identité forte sans chercher à imiter ailleurs.",
  whyWeFollowEn:
    "Because Les Pervenches are among the estates that help explain the evolution of Québec wine: parcel-focused farming, demanding viticulture, precise winemaking and a strong identity without trying to imitate another region.",

  website:"https://lespervenches.com/",
  lpvPartner:true,
  published:true,
};

console.log("\n════════ PERVENCHES QA ════════");
console.log(`Cuvées préparées      : ${built.length}`);
console.log(`Fiches préexistantes  : ${built.filter(x=>x.prior).length}`);
console.log(`Nouvelles fiches      : ${built.filter(x=>!x.prior).length}`);
console.log(`Références vérifiées  : ${found.size}`);
console.log(`Erreurs               : ${errors.length}`);
console.log(`Photos préservées     : ${built.filter(x=>x.doc.bottleImage).length}`);
console.log("═══════════════════════════════\n");

if(errors.length){
  errors.forEach(x=>console.log(`❌ ${x}`));
  process.exit(1);
}

console.log("✓ 12 fiches factuelles");
console.log("✓ FR + EN");
console.log("✓ producteur FR + EN");
console.log("✓ cépages résolus");
console.log("✓ accords résolus");
console.log("✓ viticulture/vinification/élevage");
console.log("✓ Wine DNA");
console.log("✓ SEO");
console.log("✓ aucune référence cassée");

if(!WRITE){
  console.log("\nDRY RUN — aucune écriture Sanity.");
  console.log("✓ prêt pour --write");
  process.exit(0);
}

for(const {doc,prior} of built){
  if(prior){
    const {_id,_type,...fields}=doc;
    await client.patch(_id).set(fields).commit();
  }else{
    await client.create(doc);
  }
}

await client.patch(PERVENCHES.producerId).set(producerPatch).commit();

const final=await client.fetch(`{
  "pervenches":count(*[
    _type=="wine" &&
    producer._ref==$producer &&
    published==true
  ]),
  "allPublished":count(*[_type=="wine" && published==true]),
  "producer":*[_id==$producer][0]{name,published,lpvPartner}
}`,{producer:PERVENCHES.producerId});

console.log("\n✓ PERVENCHES PUBLIÉ");
console.log(`✓ vins Pervenches publiés : ${final.pervenches}`);
console.log(`✓ vins LPV publiés        : ${final.allPublished}`);
console.log(`✓ producteur publié       : ${final.producer?.published===true}`);
console.log(`✓ partenaire LPV          : ${final.producer?.lpvPartner===true}`);
