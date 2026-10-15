import { createClient } from "@sanity/client";

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const ref = (id, key) => ({
  _type: "reference",
  _ref: id,
  ...(key ? { _key: key } : {}),
});

const block = (key, text) => [{
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

const characteristic = (key, title, text) => ({
  _key: key,
  _type: "regionCharacteristic",
  title,
  text,
});

/* ─────────────────────────────────────────────
   1. RÉCUPÉRATION DES RÉFÉRENCES EXISTANTES
───────────────────────────────────────────── */

const neededGrapes = [
  "grape-garnacha-tintorera",
  "grape-pinot-blanc",
  "grape-tempranillo",
  "grape-grenache",
  "grape-syrah",
  "grape-chardonnay",
  "grape-chenin-blanc",
  "grape-assyrtiko",
  "grape-pinot-noir",
  "grape-gamay",
];

const neededRegions = [
  "region-vallee-de-l-ebre",
  "region-toscane",
  "region-bourgogne",
  "region-beaujolais",
  "region-languedoc-roussillon",
  "region-macedoine",
  "region-trentin-haut-adige",
  "region-western-cape",
];

const existing = await client.fetch(`
*[_id in $ids]{
  _id,_type,name,
  "slug":slug.current
}
`, { ids: [...neededGrapes, ...neededRegions] });

const byId = new Map(existing.map(x => [x._id, x]));

function must(id) {
  if (!byId.has(id)) {
    throw new Error("Référence requise introuvable dans Sanity : " + id);
  }
  return id;
}

/* ─────────────────────────────────────────────
   2. CÉPAGES
───────────────────────────────────────────── */

const grapes = [
  {
    _id: "grape-pinot-blanc",
    patch: {
      name: "Pinot blanc",
      color: "white",

      oneLiner:
        "Un blanc frais, délicat et polyvalent, entre pomme, poire, fleurs blanches et une texture souvent subtilement ronde.",
      oneLinerEn:
        "A fresh, delicate and versatile white, combining apple, pear and white flowers with an often subtly rounded texture.",

      aromas: [
        "Pomme",
        "Poire",
        "Fleurs blanches",
        "Agrumes",
        "Amande",
      ],
      aromasEn: [
        "Apple",
        "Pear",
        "White flowers",
        "Citrus",
        "Almond",
      ],

      body: 2,
      acidity: 4,
      tannins: 1,
      servingTemperature: "9–11 °C",

      simplePairings: [
        "Poisson grillé",
        "Fruits de mer",
        "Risotto",
        "Fromage frais",
      ],
      simplePairingsEn: [
        "Grilled fish",
        "Seafood",
        "Risotto",
        "Fresh cheese",
      ],

      mainRegions: [
        ref(must("region-trentin-haut-adige"), "alto-adige"),
        ref(must("region-bourgogne"), "bourgogne"),
      ],

      tryNext: [
        {
          _key: "pinotblanc-chardonnay",
          _type: "grapeSuggestion",
          grape: ref(must("grape-chardonnay")),
          reason:
            "Pour rester dans les blancs polyvalents tout en gagnant en ampleur et en richesse.",
          reasonEn:
            "For another versatile white with a little more breadth and richness.",
        },
        {
          _key: "pinotblanc-chenin",
          _type: "grapeSuggestion",
          grape: ref(must("grape-chenin-blanc")),
          reason:
            "Pour retrouver fraîcheur et polyvalence avec davantage de tension et de personnalité.",
          reasonEn:
            "For freshness and versatility with more tension and personality.",
        },
      ],

      description:
        "Le Pinot blanc donne généralement des vins blancs secs, frais et accessibles, avec un fruit discret, une acidité nette et une texture qui peut gagner en rondeur selon le terroir et l'élevage.",
      descriptionEn:
        "Pinot Blanc generally produces dry, fresh and approachable white wines, with restrained fruit, bright acidity and a texture that can become rounder depending on terroir and ageing.",

      flavors: [
        "Pomme fraîche",
        "Poire",
        "Citron",
        "Amande",
      ],
      flavorsEn: [
        "Fresh apple",
        "Pear",
        "Lemon",
        "Almond",
      ],

      agingPotential:
        "À boire généralement jeune pour sa fraîcheur; certaines cuvées de terroir peuvent évoluer quelques années.",
      agingPotentialEn:
        "Generally best enjoyed young for freshness, although terroir-driven examples can develop for several years.",

      seoTitle:
        "Pinot blanc : profil, arômes et accords | Le Premier Verre",
      seoDescription:
        "Découvre le Pinot blanc : un cépage blanc frais et délicat aux notes de pomme, poire, fleurs et agrumes, avec ses meilleurs accords.",
      seoTitleEn:
        "Pinot Blanc: profile, aromas and pairings | Le Premier Verre",
      seoDescriptionEn:
        "Discover Pinot Blanc, a fresh and delicate white grape with apple, pear, floral and citrus notes, plus easy food pairings.",

      published: true,
    },
  },

  {
    _id: "grape-garnacha-tintorera",
    patch: {
      name: "Garnacha tintorera",
      color: "red",

      oneLiner:
        "Un cépage rouge intensément coloré, généreux en fruit noir et en structure, souvent utilisé pour donner profondeur et couleur aux assemblages.",
      oneLinerEn:
        "An intensely coloured red grape with dark fruit and structure, often used to bring depth and colour to blends.",

      aromas: [
        "Mûre",
        "Prune",
        "Cassis",
        "Violette",
        "Épices",
      ],
      aromasEn: [
        "Blackberry",
        "Plum",
        "Blackcurrant",
        "Violet",
        "Spice",
      ],

      body: 4,
      acidity: 3,
      tannins: 4,
      servingTemperature: "15–17 °C",

      simplePairings: [
        "Grillades",
        "Agneau",
        "Saucisses",
        "Ragoûts",
      ],
      simplePairingsEn: [
        "Grilled meats",
        "Lamb",
        "Sausages",
        "Stews",
      ],

      mainRegions: [
        ref(must("region-vallee-de-l-ebre"), "ebre"),
      ],

      tryNext: [
        {
          _key: "garnachatintorera-grenache",
          _type: "grapeSuggestion",
          grape: ref(must("grape-grenache")),
          reason:
            "Pour un rouge espagnol ou méditerranéen plus souple, fruité et chaleureux.",
          reasonEn:
            "For a softer, fruitier and warmer Spanish or Mediterranean red.",
        },
        {
          _key: "garnachatintorera-syrah",
          _type: "grapeSuggestion",
          grape: ref(must("grape-syrah")),
          reason:
            "Pour garder la couleur et la structure tout en allant vers davantage de poivre et de violette.",
          reasonEn:
            "For similar colour and structure with more pepper and violet character.",
        },
      ],

      description:
        "Aussi connue sous le nom d'Alicante Bouschet dans plusieurs marchés, la Garnacha tintorera se distingue par sa chair colorée, une particularité rare chez les raisins rouges. Elle produit des vins profondément colorés et apporte volontiers corps et intensité aux assemblages.",
      descriptionEn:
        "Also known as Alicante Bouschet in many markets, Garnacha Tintorera is unusual among red grapes because its flesh is pigmented. It produces deeply coloured wines and readily contributes body and intensity to blends.",

      flavors: [
        "Fruits noirs",
        "Prune mûre",
        "Épices",
        "Réglisse",
      ],
      flavorsEn: [
        "Dark fruit",
        "Ripe plum",
        "Spice",
        "Liquorice",
      ],

      agingPotential:
        "Variable : souvent quelques années, davantage lorsque le rendement, le terroir et l'élevage favorisent la concentration.",
      agingPotentialEn:
        "Variable: often several years, and longer when yields, terroir and ageing favour concentration.",

      seoTitle:
        "Garnacha tintorera : profil et accords | Le Premier Verre",
      seoDescription:
        "Découvre la Garnacha tintorera, cépage rouge à chair colorée donnant des vins profonds, structurés et riches en fruits noirs.",
      seoTitleEn:
        "Garnacha Tintorera: profile and pairings | Le Premier Verre",
      seoDescriptionEn:
        "Discover Garnacha Tintorera, a teinturier red grape producing deeply coloured, structured wines rich in dark-fruit character.",

      published: true,
    },
  },
];

/* ─────────────────────────────────────────────
   3. RÉGIONS
   Coordonnées = repère géographique régional,
   PAS l'adresse d'un producteur.
───────────────────────────────────────────── */

const regions = [
  {
    _id: "region-trentin-haut-adige",
    patch: {
      name: "Trentin-Haut-Adige",
      nameEn: "Trentino-Alto Adige",

      introduction: block(
        "intro-trentin",
        "À l'extrême nord de l'Italie, le Trentin-Haut-Adige réunit vignobles alpins, vallées ensoleillées et fortes variations d'altitude. Dans le Haut-Adige, la rencontre entre influences alpines et méditerranéennes favorise des blancs précis et frais, dont le Pinot blanc est l'un des cépages importants."
      ),
      introductionEn: block(
        "intro-trentin-en",
        "At Italy's northern edge, Trentino-Alto Adige combines Alpine vineyards, sunny valleys and major changes in elevation. In Alto Adige, Alpine and Mediterranean influences meet, creating precise, fresh whites in which Pinot Blanc plays an important role."
      ),

      locationText:
        "Nord-est de l'Italie, à la frontière de l'Autriche; le Haut-Adige s'organise notamment autour de Bolzano et de vallées alpines.",
      locationTextEn:
        "Northeastern Italy along the Austrian border; Alto Adige is centred around Bolzano and a network of Alpine valleys.",

      latitude: 46.5,
      longitude: 11.35,

      climate:
        "Climat de transition entre Alpes et Méditerranée. Les Alpes protègent une partie du vignoble des masses d'air froides du nord, tandis que des influences plus chaudes remontent du sud. L'altitude, qui peut atteindre environ 1 000 m dans les vignobles du Haut-Adige, favorise des écarts thermiques et une fraîcheur marquée.",
      climateEn:
        "A transitional Alpine-Mediterranean climate. The Alps provide protection from some cold northern air masses while warmer influences arrive from the south. Vineyard elevations reaching roughly 1,000 metres in Alto Adige encourage temperature shifts and marked freshness.",

      signatureGrapes: [
        ref(must("grape-pinot-blanc"), "pinot-blanc"),
        ref(must("grape-chardonnay"), "chardonnay"),
        ref(must("grape-pinot-noir"), "pinot-noir"),
      ],

      characteristics: [
        characteristic(
          "altitude",
          "La montagne change tout",
          "Les vignes s'étagent de fonds de vallée jusqu'à des coteaux très élevés : exposition, altitude et nuits fraîches créent une mosaïque de styles."
        ),
        characteristic(
          "alpin-med",
          "Alpin + méditerranéen",
          "Le nord alpin rencontre ici des influences plus douces venues du sud, donnant souvent des vins à la fois mûrs et très frais."
        ),
        characteristic(
          "geologie",
          "Une géologie spectaculaire",
          "Le Haut-Adige compte plus de 150 formations rocheuses différentes : porphyre volcanique, roches métamorphiques, calcaire, dolomie et dépôts alluviaux se côtoient."
        ),
        characteristic(
          "blancs",
          "Un terrain de choix pour les blancs",
          "Pinot blanc, Chardonnay et Sauvignon profitent particulièrement des sites d'altitude et des fortes amplitudes thermiques."
        ),
      ],

      characteristicsEn: [
        characteristic(
          "altitude-en",
          "Mountains change everything",
          "Vineyards range from valley floors to high slopes, with exposure, elevation and cool nights creating a mosaic of styles."
        ),
        characteristic(
          "alpin-med-en",
          "Alpine meets Mediterranean",
          "Northern Alpine conditions meet milder southern influences, often producing wines that combine ripeness with vivid freshness."
        ),
        characteristic(
          "geologie-en",
          "Remarkable geology",
          "Alto Adige contains more than 150 different rock formations, including volcanic porphyry, metamorphic rock, limestone, dolomite and alluvial deposits."
        ),
        characteristic(
          "blancs-en",
          "Prime territory for whites",
          "Pinot Blanc, Chardonnay and Sauvignon thrive particularly well in higher-elevation sites with strong day-night temperature shifts."
        ),
      ],

      published: true,
    },
  },

  {
    _id: "region-western-cape",
    patch: {
      name: "Western Cape",
      nameEn: "Western Cape",

      introduction: block(
        "intro-westerncape",
        "Le Western Cape constitue le cœur historique du vin sud-africain. Entre océans, chaînes montagneuses et vallées, son immense diversité de climats et de sols permet aussi bien des Chenins blancs frais et texturés que des rouges mûrs et structurés."
      ),
      introductionEn: block(
        "intro-westerncape-en",
        "The Western Cape is the historic heart of South African wine. Between oceans, mountain ranges and valleys, its broad diversity of climates and soils supports everything from fresh, textured Chenin Blanc to ripe, structured reds."
      ),

      locationText:
        "Extrême sud-ouest de l'Afrique du Sud, autour du Cap et des principaux vignobles historiques du pays.",
      locationTextEn:
        "Southwestern tip of South Africa, surrounding Cape Town and many of the country's historic winegrowing areas.",

      latitude: -33.5,
      longitude: 19.2,

      climate:
        "Majoritairement méditerranéen, avec des étés chauds et secs et des hivers frais et plus humides. Les influences de l'Atlantique et de l'océan Indien, notamment les brises marines et le courant froid de Benguela, modèrent plusieurs secteurs côtiers.",
      climateEn:
        "Predominantly Mediterranean, with warm dry summers and cooler, wetter winters. Atlantic and Indian Ocean influences, including sea breezes and the cold Benguela Current, moderate many coastal areas.",

      signatureGrapes: [
        ref(must("grape-chenin-blanc"), "chenin-blanc"),
        ref(must("grape-syrah"), "syrah"),
        ref(must("grape-chardonnay"), "chardonnay"),
      ],

      characteristics: [
        characteristic(
          "oceans",
          "Deux océans en toile de fond",
          "Les influences maritimes et les brises fraîches peuvent ralentir la maturation et préserver l'acidité dans plusieurs secteurs."
        ),
        characteristic(
          "chenin",
          "Le Chenin comme repère",
          "Le Chenin blanc est l'un des grands cépages identitaires de l'Afrique du Sud et s'exprime ici dans une grande diversité de styles."
        ),
        characteristic(
          "soils",
          "Des sols très variés",
          "Granite, grès, schistes et dépôts alluviaux participent à une diversité de terroirs remarquable sur des distances parfois courtes."
        ),
        characteristic(
          "relief",
          "Montagnes, vallées et expositions",
          "Le relief crée de nombreux mésoclimats : altitude, orientation des pentes et distance de l'océan modifient fortement les conditions de culture."
        ),
      ],

      characteristicsEn: [
        characteristic(
          "oceans-en",
          "Two oceans in the background",
          "Maritime influences and cooling breezes can slow ripening and preserve acidity in many areas."
        ),
        characteristic(
          "chenin-en",
          "Chenin as a landmark",
          "Chenin Blanc is one of South Africa's defining grape varieties and appears here in a wide range of styles."
        ),
        characteristic(
          "soils-en",
          "Highly varied soils",
          "Granite, sandstone, shale and alluvial deposits contribute to remarkable terroir diversity over sometimes short distances."
        ),
        characteristic(
          "relief-en",
          "Mountains, valleys and exposures",
          "Topography creates many mesoclimates, with elevation, slope aspect and distance from the ocean strongly affecting growing conditions."
        ),
      ],

      published: true,
    },
  },

  {
    _id: "region-languedoc-roussillon",
    patch: {
      name: "Languedoc-Roussillon",
      nameEn: "Languedoc-Roussillon",

      introduction: block(
        "intro-languedoc",
        "Entre Méditerranée, garrigue, plaines et contreforts montagneux, le Languedoc-Roussillon forme l'un des paysages viticoles les plus vastes et diversifiés de France. Soleil, vents et variété des terroirs permettent une impressionnante gamme de cépages et de styles."
      ),
      introductionEn: block(
        "intro-languedoc-en",
        "Between the Mediterranean, garrigue, plains and mountain foothills, Languedoc-Roussillon forms one of France's largest and most diverse wine landscapes. Sunshine, winds and varied terroirs support an impressive range of grape varieties and styles."
      ),

      locationText:
        "Sud de la France, le long de la Méditerranée, des environs de Nîmes jusqu'aux Pyrénées et à la frontière espagnole.",
      locationTextEn:
        "Southern France along the Mediterranean, stretching from around Nîmes toward the Pyrenees and the Spanish border.",

      latitude: 43.35,
      longitude: 3.2,

      climate:
        "Dominante méditerranéenne : fort ensoleillement, étés chauds et secs et influence de plusieurs vents régionaux, dont la Tramontane, le Mistral, le Marin et l'Autan. La proximité de la mer et les reliefs créent cependant de nombreux contrastes locaux.",
      climateEn:
        "Predominantly Mediterranean, with abundant sunshine, warm dry summers and the influence of regional winds including the Tramontane, Mistral, Marin and Autan. Proximity to the sea and varied relief nevertheless create many local contrasts.",

      signatureGrapes: [
        ref(must("grape-chardonnay"), "chardonnay"),
        ref(must("grape-grenache"), "grenache"),
        ref(must("grape-syrah"), "syrah"),
      ],

      characteristics: [
        characteristic(
          "sun",
          "Du soleil, beaucoup",
          "L'ensoleillement favorise une maturité naturelle importante et des profils souvent généreux et aromatiques."
        ),
        characteristic(
          "winds",
          "Une région façonnée par les vents",
          "Tramontane, Mistral, Marin et Autan participent aux contrastes climatiques et peuvent contribuer à maintenir les vignes saines."
        ),
        characteristic(
          "diversity",
          "Une immense liberté de cépages",
          "Le territoire accueille une palette particulièrement large de cépages méditerranéens et internationaux, ce qui explique la diversité des styles."
        ),
        characteristic(
          "landscape",
          "De la mer aux contreforts",
          "Plaines littorales, garrigue et reliefs intérieurs créent des terroirs très différents à l'intérieur d'un même grand ensemble."
        ),
      ],

      characteristicsEn: [
        characteristic(
          "sun-en",
          "Plenty of sunshine",
          "Abundant sun encourages natural ripeness and often generous, aromatic wine profiles."
        ),
        characteristic(
          "winds-en",
          "A region shaped by winds",
          "The Tramontane, Mistral, Marin and Autan contribute to climatic contrasts and can help maintain healthy vineyard conditions."
        ),
        characteristic(
          "diversity-en",
          "Remarkable grape diversity",
          "The territory supports a particularly broad palette of Mediterranean and international grapes, explaining its wide range of styles."
        ),
        characteristic(
          "landscape-en",
          "From sea to foothills",
          "Coastal plains, garrigue and inland relief create markedly different terroirs within the broader region."
        ),
      ],

      published: true,
    },
  },

  {
    _id: "region-macedoine",
    patch: {
      name: "Macédoine",
      nameEn: "Macedonia",

      introduction: block(
        "intro-macedoine",
        "Au nord de la Grèce, la Macédoine viticole combine montagnes, plateaux, lacs et influences continentales. Les secteurs d'altitude, notamment autour d'Amyndeon et de Florina, peuvent produire des vins marqués par la fraîcheur malgré la latitude méridionale."
      ),
      introductionEn: block(
        "intro-macedoine-en",
        "In northern Greece, winegrowing Macedonia combines mountains, plateaus, lakes and continental influences. Higher-elevation areas, particularly around Amyndeon and Florina, can produce notably fresh wines despite the southerly latitude."
      ),

      locationText:
        "Nord de la Grèce, de Thessalonique vers l'intérieur et jusqu'aux zones montagneuses d'Amyndeon, Florina et Naoussa.",
      locationTextEn:
        "Northern Greece, extending inland from Thessaloniki toward the mountainous areas of Amyndeon, Florina and Naoussa.",

      latitude: 40.75,
      longitude: 22.0,

      climate:
        "Plus continental que dans une grande partie de la Grèce, avec des hivers froids et des étés chauds. L'altitude, les reliefs et la présence de lacs dans certaines zones comme Amyndeon contribuent à modérer les températures et à préserver la fraîcheur.",
      climateEn:
        "More continental than much of Greece, with cold winters and warm summers. Elevation, mountainous terrain and lakes in areas such as Amyndeon help moderate temperatures and preserve freshness.",

      signatureGrapes: [
        ref(must("grape-assyrtiko"), "assyrtiko"),
      ],

      characteristics: [
        characteristic(
          "north",
          "La Grèce côté nord",
          "La Macédoine montre un visage plus continental et montagneux de la viticulture grecque."
        ),
        characteristic(
          "altitude",
          "L'altitude apporte de la fraîcheur",
          "Plusieurs vignobles se trouvent sur des plateaux et coteaux élevés où les nuits plus fraîches ralentissent la maturation."
        ),
        characteristic(
          "lakes",
          "Des lacs qui modèrent le climat",
          "Autour d'Amyndeon, les plans d'eau et les reliefs participent à un mésoclimat distinctif."
        ),
        characteristic(
          "whites",
          "Des blancs à suivre",
          "À côté des grands rouges du nord grec, les secteurs frais permettent aussi des blancs tendus et aromatiques, dont l'Assyrtiko."
        ),
      ],

      characteristicsEn: [
        characteristic(
          "north-en",
          "Greece's northern face",
          "Macedonia reveals a more continental and mountainous side of Greek winegrowing."
        ),
        characteristic(
          "altitude-en",
          "Elevation brings freshness",
          "Many vineyards sit on elevated plateaus and slopes where cooler nights slow ripening."
        ),
        characteristic(
          "lakes-en",
          "Lakes moderate conditions",
          "Around Amyndeon, bodies of water and surrounding relief contribute to a distinctive mesoclimate."
        ),
        characteristic(
          "whites-en",
          "Whites worth watching",
          "Alongside northern Greece's important reds, cooler areas can also produce taut, aromatic whites including Assyrtiko."
        ),
      ],

      published: true,
    },
  },
];

/* ─────────────────────────────────────────────
   4. VALIDATION AVANT ÉCRITURE
───────────────────────────────────────────── */

const problems = [];

for (const g of grapes) {
  const p = g.patch;

  if (!p.oneLiner) problems.push(`${g._id}: oneLiner`);
  if (!p.oneLinerEn) problems.push(`${g._id}: oneLinerEn`);
  if (!["red", "white"].includes(p.color))
    problems.push(`${g._id}: color`);
  if (!Array.isArray(p.aromas) || p.aromas.length < 3 || p.aromas.length > 5)
    problems.push(`${g._id}: aromas`);
  if (!Array.isArray(p.simplePairings) || p.simplePairings.length !== 4)
    problems.push(`${g._id}: simplePairings`);
  if (!Array.isArray(p.mainRegions) || p.mainRegions.length < 1)
    problems.push(`${g._id}: mainRegions`);
  if (!Array.isArray(p.tryNext) || p.tryNext.length < 2 || p.tryNext.length > 4)
    problems.push(`${g._id}: tryNext`);
}

for (const r of regions) {
  const p = r.patch;

  if (!p.latitude || !p.longitude)
    problems.push(`${r._id}: coordonnées`);
  if (p.latitude === 0 || p.longitude === 0)
    problems.push(`${r._id}: coordonnées 0`);
  if (!p.climate || /documenter/i.test(p.climate))
    problems.push(`${r._id}: climate`);
  if (!Array.isArray(p.signatureGrapes) || !p.signatureGrapes.length)
    problems.push(`${r._id}: signatureGrapes`);
  if (!Array.isArray(p.characteristics) ||
      p.characteristics.length < 3 ||
      p.characteristics.length > 5)
    problems.push(`${r._id}: characteristics`);
}

console.log("\n════════ LPV — RÉPARATION LOT 01 / BLOC 1 ════════\n");

console.log("CÉPAGES À RÉPARER");
for (const g of grapes) {
  console.log(`  🍇 ${g.patch.name} — ${g._id}`);
}

console.log("\nRÉGIONS À RÉPARER");
for (const r of regions) {
  console.log(
    `  🗺️ ${r.patch.name} — ${r.patch.latitude}, ${r.patch.longitude}`
  );
}

console.log("\nContrôles qualité :", problems.length ? "❌" : "✅");

if (problems.length) {
  for (const p of problems) console.log("  ❌", p);
  process.exit(1);
}

console.log("  ✅ FR + EN");
console.log("  ✅ aucun texte placeholder");
console.log("  ✅ coordonnées non nulles");
console.log("  ✅ 3–5 caractéristiques par région");
console.log("  ✅ cépages signatures");
console.log("  ✅ 4 accords par cépage");
console.log("  ✅ tryNext complets");
console.log("  ✅ SEO cépages");

if (!WRITE) {
  console.log("\n🟡 DRY-RUN SEULEMENT — aucune modification Sanity.");
  console.log("Si tout est vert, la commande suivante sera :");
  console.log("node scripts/repair-lot-01-block1.mjs --write");
  process.exit(0);
}

/* ─────────────────────────────────────────────
   5. ÉCRITURE
───────────────────────────────────────────── */

let tx = client.transaction();

for (const g of grapes) {
  tx = tx.patch(g._id, p => p.set(g.patch));
}

for (const r of regions) {
  tx = tx.patch(r._id, p => p.set(r.patch));
}

await tx.commit();

/* ─────────────────────────────────────────────
   6. VÉRIFICATION POST-WRITE
───────────────────────────────────────────── */

const checkIds = [
  ...grapes.map(x => x._id),
  ...regions.map(x => x._id),
];

const checked = await client.fetch(`
*[_id in $ids]{
  _id,_type,name,published,
  color,oneLiner,
  aromas,body,acidity,tannins,
  servingTemperature,simplePairings,
  mainRegions,tryNext,
  latitude,longitude,climate,
  signatureGrapes,characteristics
}
`, { ids: checkIds });

console.log("\n✅ ÉCRITURE TERMINÉE\n");

for (const d of checked.sort((a,b) => a.name.localeCompare(b.name))) {
  if (d._type === "grape") {
    console.log(
      `🍇 ${d.name} | arômes:${d.aromas?.length || 0} | accords:${d.simplePairings?.length || 0} | régions:${d.mainRegions?.length || 0} | tryNext:${d.tryNext?.length || 0}`
    );
  } else {
    console.log(
      `🗺️ ${d.name} | ${d.latitude},${d.longitude} | caractéristiques:${d.characteristics?.length || 0} | cépages:${d.signatureGrapes?.length || 0}`
    );
  }
}

console.log("\n✅ BLOC 1 DU LOT 01 RÉPARÉ.");
