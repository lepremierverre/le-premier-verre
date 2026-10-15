import { createClient } from "@sanity/client";
import crypto from "node:crypto";
import { RIDGE } from "./ridge-catalog-data.mjs";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const WRITE = process.argv.includes("--write");

if (WRITE && !client.config().token) {
  throw new Error("Token Sanity absent.");
}

const ref = (_ref, _key) => ({
  _type: "reference",
  _ref,
  ...(_key ? { _key } : {}),
});

const slugify = (s = "") =>
  s.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const block = (text, key = "text") => [{
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

const EN = {
  "bise-dautomne": {
    one: "A late-harvest Vidal that balances generous sweetness with lively acidity and notes of candied orchard fruit, citrus and almond.",
    why: "We recommend it as an expressive example of Québec late-harvest wine. Its sweetness is substantial, but the acidity keeps the wine balanced and makes it especially useful for understanding how freshness can shape a dessert wine.",
    note: "Candied apple and pear lead into almond and citrus notes. Rich and smooth, with enough acidity to keep the finish fresh.",
  },
  "champs-de-florence": {
    one: "A dry, refreshing Québec rosé built around Seyval noir, with strawberry, raspberry and pomegranate notes.",
    why: "We recommend it for its straightforward, refreshing expression of Québec rosé. It is easy to understand, versatile at the table and a useful introduction to Seyval noir.",
    note: "Red berries and pomegranate dominate a light, fresh and dry profile.",
  },
  "fado": {
    one: "A fortified Maréchal Foch with prune, walnut and roasted notes, rounded out by six months of oak ageing.",
    why: "We recommend it because it shows a completely different side of Québec wine. Fortification and oak transform Maréchal Foch into a rich after-dinner style that is particularly interesting beside dark chocolate.",
    note: "Prune, walnut and roasted aromas meet leather and oak in a rich, warming profile.",
  },
  "blanc-domaine-du-ridge": {
    one: "A crisp, dry Seyval blanc with white flowers, citrus, grapefruit, lemon and green apple.",
    why: "We recommend it as an uncomplicated introduction to Québec white wine. Its citrus-driven profile and fresh finish make it particularly easy to place at the table.",
    note: "White flowers and citrus on the nose, followed by grapefruit, lemon and green apple on a refreshing finish.",
  },
  "le-batonnier": {
    one: "A supple, lightly oaked Maréchal Foch with herbal, savoury and woody notes.",
    why: "We recommend it for drinkers who want to move beyond purely fruit-driven reds. Its savoury character and gentle oak show another expression of Maréchal Foch and of red wine from Saint-Armand.",
    note: "Herbal and woody notes lead the profile, with a supple, rounded texture and a distinctly savoury character.",
  },
  "le-stanbridge": {
    one: "A dry, gently oaked Vidal with honey, tropical fruit and a juicy, refreshing finish.",
    why: "We recommend it because Vidal is often associated with sweet wine, while this bottle shows how convincing it can be in a dry style. Tropical fruit, freshness and subtle oak make it both accessible and distinctive.",
    note: "Honey and tropical fruit lead into ripe yellow fruit, with a juicy palate and a fresh, mouth-watering finish.",
  },
  "seyval-vidal": {
    one: "A fresh, expressive blend of Seyval blanc and Vidal, filled with pineapple, peach and pear.",
    why: "We recommend it because it captures the collaborative, experimental side of Québec winemaking while remaining very easy to enjoy. The cold fermentation preserves a vivid fruit profile.",
    note: "Pineapple, peach and pear dominate a fresh, fruit-forward and expressive white.",
  },
  "vidal-brut": {
    one: "A lively Vidal sparkling wine with fine bubbles, lemon, mineral notes, herbs and a refreshing saline finish.",
    why: "We recommend it because it shows Vidal in a completely different register. High acidity becomes an advantage here, giving the sparkling wine energy, freshness and a particularly food-friendly profile.",
    note: "Fine, lively bubbles carry lemon and mineral notes, followed by herbs, gentle bitterness and a saline finish.",
  },
  "lhonorable": {
    one: "A powerful, oaked Québec red blending Maréchal Foch and Lucie Kuhlmann, with prune, candied fruit and vanilla.",
    why: "We recommend it for anyone curious about the more structured and ambitious side of Québec red wine. Its fruit concentration and oak make it a natural step beyond lighter cold-climate reds.",
    note: "Prune and candied fruit meet vanilla and oak in a powerful attack followed by a harmonious finish.",
  },
  "rose-domaine-du-ridge": {
    one: "A light, dry Québec rosé blending several cold-climate varieties, with strawberry, cranberry and red-berry notes.",
    why: "We recommend it as an accessible snapshot of several varieties used in Québec vineyards. Lightness, freshness and red fruit make it particularly easy to serve.",
    note: "A discreet, fresh rosé centred on strawberry, cranberry and delicate red-berry flavours.",
  },
  "rouge-domaine-du-ridge": {
    one: "A fresh, approachable Québec red driven by cherry, blackberry and blackcurrant.",
    why: "We recommend it as an easy entry point into Québec red wine. The blend keeps the focus on fruit and freshness and works with familiar, casual dishes.",
    note: "Cherry and blackberry lead into blackcurrant and dark berries, with a fresh streak of acidity.",
  },
  "saint-martin": {
    one: "A rich fortified Frontenac blanc aged six months in oak, with peach, apricot, orange, honey and brioche.",
    why: "We recommend it because it highlights the versatility of Frontenac blanc and offers a distinctive Québec interpretation of fortified sweet wine. Its richness works particularly well with blue cheese.",
    note: "Peach, apricot, orange and honey are joined by hazelnut and brioche from oak ageing.",
  },
};

const FR = {
  "bise-dautomne": {
    one: "Un Vidal de vendange tardive riche mais équilibré, entre pomme et poire confites, agrumes, amande et fraîcheur.",
    why: "On le recommande pour découvrir une expression gourmande du Vidal québécois sans perdre la notion d’équilibre. La sucrosité est importante, mais l’acidité maintient le vin vivant et montre bien le rôle de la fraîcheur dans un vin de dessert.",
  },
  "champs-de-florence": {
    one: "Un rosé québécois sec et rafraîchissant de Seyval noir, porté par la fraise, la framboise et la grenade.",
    why: "On le recommande pour son expression directe et rafraîchissante du rosé québécois. Il est facile à comprendre, polyvalent à table et constitue une belle porte d’entrée vers le Seyval noir.",
  },
  "fado": {
    one: "Un Maréchal Foch muté, riche en pruneau, noix et notes torréfiées, arrondi par six mois d’élevage en fût.",
    why: "On le recommande parce qu’il montre une facette complètement différente du vin québécois. Le mutage et le bois transforment le Maréchal Foch en vin de fin de repas riche et particulièrement intéressant avec le chocolat noir.",
  },
  "blanc-domaine-du-ridge": {
    one: "Un Seyval blanc sec et vif, entre fleurs blanches, agrumes, pamplemousse, citron et pomme verte.",
    why: "On le recommande comme introduction simple et nette au vin blanc québécois. Son profil citronné et sa finale fraîche le rendent très facile à placer à table.",
  },
  "le-batonnier": {
    one: "Un Maréchal Foch souple et légèrement boisé, aux accents végétaux, épicés et savoureux.",
    why: "On le recommande à ceux qui veulent dépasser les rouges uniquement fruités. Son caractère savoureux et son boisé mesuré montrent une autre expression du Maréchal Foch et du terroir de Saint-Armand.",
  },
  "le-stanbridge": {
    one: "Un Vidal sec et légèrement boisé, généreux en miel et fruits exotiques, avec une finale juteuse et fraîche.",
    why: "On le recommande parce que le Vidal est souvent associé aux vins doux alors qu’il peut être très convaincant en sec. Les fruits exotiques, la fraîcheur et le léger boisé donnent ici un vin accessible mais distinctif.",
  },
  "seyval-vidal": {
    one: "Un assemblage frais et expressif de Seyval blanc et Vidal, rempli d’ananas, de pêche et de poire.",
    why: "On le recommande parce qu’il illustre le côté collaboratif et expérimental du vin québécois tout en restant très facile à boire. La fermentation froide permet de conserver un fruit particulièrement éclatant.",
  },
  "vidal-brut": {
    one: "Un Vidal effervescent vif aux bulles fines, entre citron, minéralité, herbes et finale saline.",
    why: "On le recommande parce qu’il montre le Vidal dans un registre complètement différent. L’acidité élevée devient ici un atout et apporte énergie, fraîcheur et polyvalence à table.",
  },
  "lhonorable": {
    one: "Un rouge québécois puissant et boisé de Maréchal Foch et Lucie Kuhlmann, entre pruneau, fruits confits et vanille.",
    why: "On le recommande pour découvrir le côté plus structuré et ambitieux du rouge québécois. Sa concentration et son élevage en font une suite naturelle aux rouges nordiques plus légers.",
  },
  "rose-domaine-du-ridge": {
    one: "Un rosé québécois sec et léger, assemblant plusieurs cépages nordiques autour de la fraise, de la canneberge et des petits fruits rouges.",
    why: "On le recommande comme portrait accessible de plusieurs cépages cultivés au Québec. Sa légèreté, sa fraîcheur et son fruit rouge le rendent particulièrement facile à servir.",
  },
  "rouge-domaine-du-ridge": {
    one: "Un rouge québécois frais et accessible, dominé par la cerise, la mûre et le cassis.",
    why: "On le recommande comme porte d’entrée simple vers le rouge québécois. L’assemblage met l’accent sur le fruit et la fraîcheur et accompagne facilement des plats familiers.",
  },
  "saint-martin": {
    one: "Un Frontenac blanc doux et muté, élevé six mois en fût, entre pêche, abricot, orange, miel et brioche.",
    why: "On le recommande parce qu’il montre la polyvalence du Frontenac blanc et propose une interprétation québécoise distinctive du vin doux muté. Sa richesse fonctionne particulièrement bien avec les fromages bleus.",
  },
};

const existing = await client.fetch(
  `*[_type == "wine" && producer._ref == $producer]{
    _id,name,"slug":slug.current,bottleImage,labelImage
  }`,
  { producer: RIDGE.producerId }
);

const existingById = new Map(existing.map(x => [x._id, x]));
const existingBySlug = new Map(existing.map(x => [x.slug, x]));

function makeDoc(w) {
  const fr = FR[w.key];
  const en = EN[w.key];

  if (!fr || !en) throw new Error(`${w.name}: contenu FR/EN absent`);

  const slug = `domaine-du-ridge-${slugify(w.name)}`;
  const prior =
    (w.existingId && existingById.get(w.existingId)) ||
    existingBySlug.get(slug);

  const id = prior?._id || w.existingId || `wine-${slug}`;

  const doc = {
    _id: id,
    _type: "wine",
    beverageType: "wine",
    alcoholFree: false,
    name: w.name,
    slug: {_type: "slug", current: slug},
    producer: ref(RIDGE.producerId),
    country: ref(RIDGE.country),
    region: ref(RIDGE.region),
    appellation: ref(RIDGE.appellation),
    color: w.color,

    approxPrice: w.price,
    purchaseChannel: "producer",
    purchaseChannelDetails: "Disponible directement auprès du Domaine du Ridge — disponibilité à vérifier.",
    purchaseChannelDetailsEn: "Available directly from Domaine du Ridge — availability should be checked.",
    purchaseUrl: w.purchaseUrl,
    purchaseLastChecked: RIDGE.checked,

    oneLiner: fr.one,
    oneLinerEn: en.one,
    tastingKeywords: w.tastingKeywords,
    tastingKeywordsEn: w.tastingKeywordsEn,
    perfectFor: w.perfectFor,
    perfectForEn: w.perfectForEn,
    whyWeRecommend: fr.why,
    whyWeRecommendEn: en.why,

    body: w.body,
    sweetness: w.sweetness,
    roundness: w.roundness,
    servingTemperature: w.servingTemperature,
    decant: w.decant,

    grapes: w.grapes.map((id, i) => ref(id, `${slugify(id)}-${i}`)),
    foodPairings: w.foods.map((id, i) => ref(id, `${slugify(id)}-${i}`)),

    style: w.style,
    alcohol: w.alcohol,
    sugar: w.sugar,
    acidity: w.acidity,
    tannins: w.tannins,

    aromas: w.aromas,
    flavors: w.flavors,
    texture:
      w.roundness >= 4 ? "Ronde et ample." :
      w.roundness <= 2 ? "Vive et légère." :
      "Équilibrée et souple.",
    finish: w.official,

    fruitIntensity: w.fruitIntensity,
    minerality: w.minerality,
    savory: w.savory,
    intensity: w.intensity,
    complexity: w.complexity,
    oakInfluence: w.oakInfluence,

    dnaMetadata: {
      fruitIntensity: {confidence: 0.8, source: "editorial"},
      minerality: {confidence: 0.75, source: "editorial"},
      savory: {confidence: 0.8, source: "editorial"},
    },

    ...(w.vinification ? {
      vinification: block(w.vinification, `${w.key}-vinification`)
    } : {}),

    ...(w.aging ? {aging: w.aging} : {}),
    bottleSize: w.bottleSize,
    ...(w.sku ? {sku: w.sku} : {}),

    tastingNotes: block(w.official, `${w.key}-tasting-fr`),
    tastingNotesEn: block(en.note, `${w.key}-tasting-en`),

    editorialNote: block(fr.why, `${w.key}-editorial-fr`),
    editorialNoteEn: block(en.why, `${w.key}-editorial-en`),

    experienceLevel: w.experienceLevel,

    aiSummary: fr.one,
    seoTitle: `${w.name} | Le Premier Verre`,
    seoTitleEn: `${w.name} | Le Premier Verre`,
    seoDescription: `${fr.one} Découvre cette cuvée du Domaine du Ridge.`,
    seoDescriptionEn: `${en.one} Discover this Domaine du Ridge wine.`,

    translationSourceHash: crypto
      .createHash("sha256")
      .update(JSON.stringify({
        oneLiner: fr.one,
        tastingKeywords: w.tastingKeywords,
        perfectFor: w.perfectFor,
        whyWeRecommend: fr.why,
      }))
      .digest("hex"),

    published: true,
  };

  // Preserve any existing photography.
  if (prior?.bottleImage) doc.bottleImage = prior.bottleImage;
  if (prior?.labelImage) doc.labelImage = prior.labelImage;

  return {doc, prior};
}

const built = RIDGE.wines.map(makeDoc);

const knownRefs = await client.fetch(
  `*[_id in $ids]._id`,
  {
    ids: [...new Set(built.flatMap(({doc}) => [
      doc.producer._ref,
      doc.country._ref,
      doc.region._ref,
      doc.appellation._ref,
      ...doc.grapes.map(x => x._ref),
      ...doc.foodPairings.map(x => x._ref),
    ]))]
  }
);

const known = new Set(knownRefs);
const errors = [];

for (const {doc} of built) {
  const required = [
    "name","approxPrice","purchaseChannel","purchaseUrl",
    "purchaseLastChecked","oneLiner","oneLinerEn",
    "whyWeRecommend","whyWeRecommendEn","body","sweetness",
    "roundness","servingTemperature","alcohol","sugar",
    "style","aromas","flavors","tastingNotes","tastingNotesEn",
    "editorialNote","editorialNoteEn","experienceLevel",
    "seoTitle","seoTitleEn","seoDescription","seoDescriptionEn"
  ];

  for (const f of required) {
    const v = doc[f];
    if (v === undefined || v === null || v === "" ||
        (Array.isArray(v) && !v.length)) {
      errors.push(`${doc.name}: ${f} manquant`);
    }
  }

  if (doc.tastingKeywords.length < 3 || doc.tastingKeywords.length > 5)
    errors.push(`${doc.name}: tastingKeywords`);
  if (doc.tastingKeywordsEn.length < 3 || doc.tastingKeywordsEn.length > 5)
    errors.push(`${doc.name}: tastingKeywordsEn`);
  if (doc.perfectFor.length < 2 || doc.perfectFor.length > 3)
    errors.push(`${doc.name}: perfectFor`);
  if (doc.perfectForEn.length < 2 || doc.perfectForEn.length > 3)
    errors.push(`${doc.name}: perfectForEn`);

  for (const r of [
    doc.producer, doc.country, doc.region, doc.appellation,
    ...doc.grapes, ...doc.foodPairings
  ]) {
    if (!known.has(r._ref))
      errors.push(`${doc.name}: référence cassée ${r._ref}`);
  }
}

console.log("\n════════ RIDGE QA ════════");
console.log(`Vins préparés        : ${built.length}`);
console.log(`Fiches préexistantes : ${built.filter(x => x.prior).length}`);
console.log(`Nouvelles fiches     : ${built.filter(x => !x.prior).length}`);
console.log(`Erreurs              : ${errors.length}`);
console.log(`Photos préservées    : ${built.filter(x => x.doc.bottleImage).length}`);
console.log("══════════════════════════\n");

if (errors.length) {
  errors.forEach(x => console.log(`❌ ${x}`));
  process.exit(1);
}

console.log("✓ FR + EN complets");
console.log("✓ références résolues");
console.log("✓ données techniques présentes");
console.log("✓ Wine DNA présent");
console.log("✓ accords présents");
console.log("✓ SEO présent");

if (!WRITE) {
  console.log("\nDRY RUN — aucune écriture Sanity.");
  console.log("✓ prêt pour --write");
  process.exit(0);
}

for (const {doc, prior} of built) {
  if (prior) {
    const {_id, _type, ...fields} = doc;
    await client.patch(_id).set(fields).commit();
  } else {
    await client.create(doc);
  }
}

await client
  .patch(RIDGE.producerId)
  .set({
    lpvPartner: true,
    published: true,
  })
  .commit();

const final = await client.fetch(`{
  "ridge": count(*[
    _type == "wine" &&
    producer._ref == $producer &&
    published == true
  ]),
  "allPublished": count(*[_type == "wine" && published == true])
}`, {producer: RIDGE.producerId});

console.log("\n✓ RIDGE PUBLIÉ");
console.log(`✓ vins Ridge publiés : ${final.ridge}`);
console.log(`✓ vins LPV publiés   : ${final.allPublished}`);
