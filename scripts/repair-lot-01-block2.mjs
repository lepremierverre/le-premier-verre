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

const ids = await client.fetch(`{
  "grapes": *[_type=="grape"]{_id,name},
  "countries": *[_type=="country"]{_id,name},
  "regions": *[_type=="region"]{_id,name},
  "apps": *[_type=="appellation"]{_id,name}
}`);

const norm = s => (s || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const indexes = {};
for (const [type, docs] of Object.entries(ids)) {
  indexes[type] = new Map(docs.map(d => [norm(d.name), d._id]));
}

function find(type, ...names) {
  for (const name of names) {
    const id = indexes[type].get(norm(name));
    if (id) return id;
  }
  throw new Error(`Référence introuvable : ${type} → ${names.join(" / ")}`);
}

const grape = (...n) => find("grapes", ...n);
const country = (...n) => find("countries", ...n);
const region = (...n) => find("regions", ...n);
const app = (...n) => find("apps", ...n);

/* ═══════════════════════════════════════════════
   PAYS
═══════════════════════════════════════════════ */

const countries = [
  {
    _id: country("Chili"),
    patch: {
      name: "Chili",
      nameEn: "Chile",
      nativeName: "Chile",
      isoCode: "CL",
      flagEmoji: "🇨🇱",

      description:
        "Un pays viticole long et étroit, encadré par le Pacifique et les Andes, où altitude, latitude et influence maritime créent une remarquable diversité de climats.",
      descriptionEn:
        "A long, narrow wine country framed by the Pacific and the Andes, where altitude, latitude and maritime influence create remarkable climatic diversity.",

      wineHistory: block(
        "chile-history",
        "La vigne accompagne l'histoire du Chili depuis l'époque coloniale. Le pays a ensuite développé une viticulture moderne fortement tournée vers l'exportation, tout en redécouvrant de vieux vignobles, des cépages historiques et des terroirs plus frais ou plus extrêmes."
      ),
      wineHistoryEn: block(
        "chile-history-en",
        "Vines have been part of Chilean history since the colonial period. The country later developed a modern, export-oriented wine industry while increasingly rediscovering old vineyards, historic varieties and cooler or more extreme terroirs."
      ),

      climate:
        "Le Chili viticole traverse plusieurs zones climatiques. Le Pacifique et le courant de Humboldt rafraîchissent les secteurs côtiers, les Andes apportent altitude et amplitudes thermiques, tandis que les vallées intérieures peuvent être plus chaudes et sèches.",
      climateEn:
        "Winegrowing Chile crosses several climatic zones. The Pacific and Humboldt Current cool coastal areas, the Andes provide elevation and day-night temperature shifts, while inland valleys can be warmer and drier.",

      mainWineStyles: [
        "Cabernet Sauvignon structuré",
        "Carménère fruité et épicé",
        "Sauvignon blanc frais",
        "Chardonnay",
        "Pinot noir de climat frais",
      ],
      mainWineStylesEn: [
        "Structured Cabernet Sauvignon",
        "Fruity, spicy Carménère",
        "Fresh Sauvignon Blanc",
        "Chardonnay",
        "Cool-climate Pinot Noir",
      ],

      signatureGrapes: [
        ref(grape("Cabernet Sauvignon"), "cabernet-sauvignon"),
      ],

      seoTitle: "Vins du Chili : régions, cépages et styles | Le Premier Verre",
      seoDescription:
        "Découvre le vin chilien, ses grandes vallées, l'influence du Pacifique et des Andes et ses cépages emblématiques.",
      seoTitleEn: "Chilean wine: regions, grapes and styles | Le Premier Verre",
      seoDescriptionEn:
        "Discover Chilean wine, its major valleys, Pacific and Andean influences, and signature grape varieties.",
    }
  },

  {
    _id: country("Espagne"),
    patch: {
      name: "Espagne",
      nameEn: "Spain",
      nativeName: "España",
      isoCode: "ES",
      flagEmoji: "🇪🇸",

      description:
        "Un géant du vin européen où plateaux continentaux, façades atlantiques, littoral méditerranéen et vignobles d'altitude produisent des styles extrêmement variés.",
      descriptionEn:
        "A European wine powerhouse where continental plateaus, Atlantic coasts, the Mediterranean and high-elevation vineyards produce an exceptionally broad range of styles.",

      wineHistory: block(
        "spain-history",
        "La viticulture espagnole possède des racines anciennes et une forte tradition régionale. Rioja, Jerez, Ribera del Duero, Rías Baixas, Priorat et de nombreuses autres zones montrent aujourd'hui une Espagne du vin à la fois historique et très dynamique."
      ),
      wineHistoryEn: block(
        "spain-history-en",
        "Spanish winegrowing has ancient roots and a strong regional tradition. Rioja, Jerez, Ribera del Duero, Rías Baixas, Priorat and many other areas now reveal a wine culture that is both historic and highly dynamic."
      ),

      climate:
        "Très variable : influence atlantique au nord-ouest, Méditerranée à l'est, conditions continentales souvent chaudes et sèches sur le plateau central et nombreux vignobles d'altitude.",
      climateEn:
        "Highly varied: Atlantic influence in the northwest, Mediterranean conditions in the east, often hot and dry continental conditions on the central plateau, and many high-elevation vineyards.",

      mainWineStyles: [
        "Rouges à base de Tempranillo",
        "Rouges méditerranéens",
        "Blancs atlantiques",
        "Cava",
        "Vins fortifiés",
      ],
      mainWineStylesEn: [
        "Tempranillo-based reds",
        "Mediterranean reds",
        "Atlantic whites",
        "Cava",
        "Fortified wines",
      ],

      signatureGrapes: [
        ref(grape("Tempranillo"), "tempranillo"),
        ref(grape("Grenache", "Garnacha"), "grenache"),
      ],

      seoTitle: "Vins d'Espagne : régions, cépages et styles | Le Premier Verre",
      seoDescription:
        "Comprendre le vin espagnol : Tempranillo, Garnacha, Rioja et une mosaïque de régions entre Atlantique et Méditerranée.",
      seoTitleEn: "Spanish wine: regions, grapes and styles | Le Premier Verre",
      seoDescriptionEn:
        "Understand Spanish wine through Tempranillo, Garnacha, Rioja and a mosaic of regions between Atlantic and Mediterranean influences.",
    }
  },

  {
    _id: country("Grèce"),
    patch: {
      name: "Grèce",
      nameEn: "Greece",
      nativeName: "Ελλάδα",
      isoCode: "GR",
      flagEmoji: "🇬🇷",

      description:
        "Une très ancienne culture du vin portée aujourd'hui par une nouvelle génération de producteurs et une impressionnante collection de cépages autochtones.",
      descriptionEn:
        "An ancient wine culture now driven by a new generation of producers and an impressive collection of indigenous grape varieties.",

      wineHistory: block(
        "greece-history",
        "Le vin fait partie de la culture grecque depuis l'Antiquité. La viticulture contemporaine s'appuie sur cet héritage tout en valorisant de plus en plus les cépages indigènes, les vignobles d'altitude et les identités régionales."
      ),
      wineHistoryEn: block(
        "greece-history-en",
        "Wine has been part of Greek culture since antiquity. Contemporary Greek wine builds on that heritage while increasingly highlighting indigenous grapes, high-elevation vineyards and regional identities."
      ),

      climate:
        "Majoritairement méditerranéen, mais fortement modulé par l'altitude, les montagnes, les vents et la proximité de la mer. Le nord, notamment la Macédoine, peut montrer une influence nettement plus continentale.",
      climateEn:
        "Predominantly Mediterranean, but strongly shaped by elevation, mountains, winds and proximity to the sea. Northern Greece, particularly Macedonia, can show a distinctly more continental influence.",

      mainWineStyles: [
        "Blancs secs minéraux",
        "Rouges méditerranéens",
        "Rouges d'altitude",
        "Vins de cépages autochtones",
      ],
      mainWineStylesEn: [
        "Mineral dry whites",
        "Mediterranean reds",
        "High-elevation reds",
        "Indigenous-variety wines",
      ],

      signatureGrapes: [
        ref(grape("Assyrtiko"), "assyrtiko"),
      ],

      seoTitle: "Vins de Grèce : régions, cépages et styles | Le Premier Verre",
      seoDescription:
        "Découvre les vins grecs, de l'Assyrtiko aux vignobles montagneux de Macédoine, et une riche diversité de cépages indigènes.",
      seoTitleEn: "Greek wine: regions, grapes and styles | Le Premier Verre",
      seoDescriptionEn:
        "Discover Greek wine, from Assyrtiko to Macedonia's mountain vineyards and the country's rich diversity of indigenous grapes.",
    }
  },
];

/* ═══════════════════════════════════════════════
   APPELLATIONS
═══════════════════════════════════════════════ */

const appellations = [
  {
    _id: app("Alto Adige/Südtirol"),
    patch: {
      classification: "DOC",
      country: ref(country("Italie")),
      region: ref(region("Trentin-Haut-Adige", "Trentin Haut-Adige")),

      description: block(
        "alto-desc",
        "L'Alto Adige DOC couvre l'un des vignobles les plus septentrionaux d'Italie. La rencontre entre influences alpines et méditerranéennes, les fortes variations d'altitude et la diversité géologique donnent des vins particulièrement précis et frais."
      ),
      descriptionEn: block(
        "alto-desc-en",
        "Alto Adige DOC covers one of Italy's northernmost wine regions. Alpine and Mediterranean influences, major elevation changes and geological diversity produce particularly precise, fresh wines."
      ),

      climate:
        "Alpin-méditerranéen, avec journées ensoleillées, nuits fraîches et vignobles situés approximativement entre 200 et 1 000 mètres d'altitude.",
      climateEn:
        "Alpine-Mediterranean, with sunny days, cool nights and vineyards ranging roughly from 200 to 1,000 metres in elevation.",

      soilTypes: [
        "Porphyre volcanique",
        "Calcaire",
        "Dolomie",
        "Sols alluviaux",
        "Roches métamorphiques",
      ],
      soilTypesEn: [
        "Volcanic porphyry",
        "Limestone",
        "Dolomite",
        "Alluvial soils",
        "Metamorphic rock",
      ],

      grapes: [
        ref(grape("Pinot blanc"), "pinot-blanc"),
        ref(grape("Chardonnay"), "chardonnay"),
        ref(grape("Pinot noir"), "pinot-noir"),
      ],

      authorizedWineStyles: ["Blanc", "Rouge", "Rosé", "Effervescent"],
      authorizedWineStylesEn: ["White", "Red", "Rosé", "Sparkling"],

      productionRules: block(
        "alto-rules",
        "La DOC Alto Adige encadre notamment l'origine, les cépages autorisés et les rendements. Plus de vingt cépages sont cultivés dans la région et plusieurs sous-zones peuvent compléter la dénomination."
      ),
      productionRulesEn: block(
        "alto-rules-en",
        "Alto Adige DOC regulates origin, permitted varieties and yields. More than twenty grape varieties are grown in the region, and several subzones may accompany the designation."
      ),

      foodPairingNotes:
        "Les blancs frais de la région fonctionnent particulièrement bien avec poissons, fruits de mer, risottos et cuisine alpine délicate.",
      foodPairingNotesEn:
        "The region's fresh whites work particularly well with fish, seafood, risotto and delicate Alpine dishes.",

      latitude: 46.5,
      longitude: 11.35,

      seoTitle: "Alto Adige DOC : vins, cépages et terroir | Le Premier Verre",
      seoDescription:
        "Découvre l'Alto Adige DOC, ses vignobles alpins, son climat frais et ses cépages comme le Pinot blanc.",
      seoTitleEn: "Alto Adige DOC: wines, grapes and terroir | Le Premier Verre",
      seoDescriptionEn:
        "Discover Alto Adige DOC, its Alpine vineyards, fresh climate and grapes including Pinot Blanc.",
    }
  },

  {
    _id: app("Beaujolais Villages", "Beaujolais-Villages"),
    patch: {
      classification: "AOC",
      country: ref(country("France")),
      region: ref(region("Beaujolais")),

      description: block(
        "bv-desc",
        "Beaujolais-Villages s'étend sur 38 communes de la partie nord du vignoble. Ses coteaux, souvent escarpés et situés entre environ 200 et 500 mètres, donnent au Gamay des expressions fruitées qui gagnent en structure selon les secteurs."
      ),
      descriptionEn: block(
        "bv-desc-en",
        "Beaujolais-Villages extends across 38 communes in the northern part of the vineyard. Its often steep slopes, roughly 200 to 500 metres high, give Gamay fruit-driven expressions that gain structure depending on the sector."
      ),

      climate:
        "Climat tempéré avec influences continentales, bénéficiant d'expositions de coteaux et d'altitudes qui contribuent à la fraîcheur.",
      climateEn:
        "Temperate climate with continental influences, with hillside exposures and elevation helping preserve freshness.",

      soilTypes: ["Granite", "Gneiss", "Schistes", "Grès", "Pierres bleues"],
      soilTypesEn: ["Granite", "Gneiss", "Schist", "Sandstone", "Blue stone"],

      grapes: [
        ref(grape("Gamay"), "gamay"),
        ref(grape("Chardonnay"), "chardonnay"),
      ],

      authorizedWineStyles: ["Rouge", "Rosé", "Blanc"],
      authorizedWineStylesEn: ["Red", "Rosé", "White"],

      productionRules: block(
        "bv-rules",
        "L'appellation est répartie sur 38 communes. Le Gamay noir à jus blanc domine très largement les rouges et rosés; le Chardonnay permet également la production confidentielle de blancs."
      ),
      productionRulesEn: block(
        "bv-rules-en",
        "The appellation extends across 38 communes. Gamay noir à jus blanc overwhelmingly dominates red and rosé wines, while Chardonnay also permits limited white production."
      ),

      foodPairingNotes:
        "Les rouges fruités et souples aiment charcuteries, poulet rôti, burgers, saucisses et plats simples à partager.",
      foodPairingNotesEn:
        "Fruity, supple reds work well with charcuterie, roast chicken, burgers, sausages and casual sharing dishes.",

      latitude: 46.15,
      longitude: 4.65,

      seoTitle: "Beaujolais-Villages : Gamay, terroirs et accords | Le Premier Verre",
      seoDescription:
        "Découvre Beaujolais-Villages, ses 38 communes, ses coteaux granitiques et ses Gamays fruités et frais.",
      seoTitleEn: "Beaujolais-Villages: Gamay, terroir and pairings | Le Premier Verre",
      seoDescriptionEn:
        "Discover Beaujolais-Villages, its 38 communes, granitic slopes and fresh, fruit-driven Gamay wines.",
    }
  },

  {
    _id: app("Coastal Region"),
    patch: {
      classification: "WO",
      country: ref(country("Afrique du Sud")),
      region: ref(region("Western Cape")),

      description: block(
        "coastal-desc",
        "Coastal Region est une région officiellement délimitée du système sud-africain Wine of Origin. Elle réunit plusieurs districts importants du Cap afin de permettre des vins issus de différents terroirs partageant une influence maritime."
      ),
      descriptionEn: block(
        "coastal-desc-en",
        "Coastal Region is an officially demarcated region within South Africa's Wine of Origin system. It combines several major Cape districts, allowing wines from different terroirs sharing maritime influence to carry one origin."
      ),

      climate:
        "Principalement méditerranéen, avec étés secs et influence rafraîchissante de l'Atlantique dans plusieurs secteurs. Relief, distance de l'océan et exposition créent de nombreux mésoclimats.",
      climateEn:
        "Predominantly Mediterranean, with dry summers and cooling Atlantic influence in many areas. Topography, distance from the ocean and exposure create numerous mesoclimates.",

      soilTypes: ["Granite", "Schiste", "Grès", "Sols alluviaux"],
      soilTypesEn: ["Granite", "Shale", "Sandstone", "Alluvial soils"],

      grapes: [
        ref(grape("Chenin blanc"), "chenin-blanc"),
        ref(grape("Syrah"), "syrah"),
        ref(grape("Chardonnay"), "chardonnay"),
      ],

      authorizedWineStyles: ["Blanc", "Rouge", "Rosé", "Effervescent"],
      authorizedWineStylesEn: ["White", "Red", "Rosé", "Sparkling"],

      productionRules: block(
        "coastal-rules",
        "Dans le système Wine of Origin, la mention Coastal Region garantit que les raisins proviennent de cette aire officiellement délimitée. Elle comprend plusieurs districts, dont Stellenbosch, Paarl, Swartland, Wellington, Franschhoek, Darling et Cape Town."
      ),
      productionRulesEn: block(
        "coastal-rules-en",
        "Under the Wine of Origin system, Coastal Region on the label guarantees that the grapes come from this officially demarcated area. It includes districts such as Stellenbosch, Paarl, Swartland, Wellington, Franschhoek, Darling and Cape Town."
      ),

      foodPairingNotes:
        "La diversité est grande : Chenin blanc avec poissons, currys doux et cuisine asiatique; rouges avec grillades et viandes rôties.",
      foodPairingNotesEn:
        "Styles vary widely: Chenin Blanc suits fish, mild curries and Asian dishes, while reds pair naturally with grilled and roasted meats.",

      latitude: -33.6,
      longitude: 18.8,

      seoTitle: "Coastal Region : vins d'Afrique du Sud | Le Premier Verre",
      seoDescription:
        "Comprendre Coastal Region, grande origine viticole du Western Cape réunissant plusieurs districts historiques.",
      seoTitleEn: "Coastal Region: South African wine origin | Le Premier Verre",
      seoDescriptionEn:
        "Understand Coastal Region, a major Western Cape wine origin combining several historic districts.",
    }
  },

  {
    _id: app("Crémant de Bourgogne"),
    patch: {
      classification: "AOC",
      country: ref(country("France")),
      region: ref(region("Bourgogne")),

      description: block(
        "cremant-desc",
        "Crémant de Bourgogne est l'appellation effervescente de Bourgogne élaborée selon la méthode traditionnelle. Son aire traverse plusieurs vignobles bourguignons et permet une large palette d'assemblages."
      ),
      descriptionEn: block(
        "cremant-desc-en",
        "Crémant de Bourgogne is Burgundy's traditional-method sparkling appellation. Its production area crosses several Burgundian vineyards and supports a broad palette of blends."
      ),

      climate:
        "Variable du nord au sud de la Bourgogne, avec une recherche de parcelles permettant de conserver fraîcheur, acidité et maturité équilibrée pour les vins effervescents.",
      climateEn:
        "Varies from north to south across Burgundy, with sites selected to preserve freshness, acidity and balanced ripeness for sparkling wine.",

      soilTypes: [
        "Marnes calcaires",
        "Argilo-calcaire",
        "Granite",
        "Sols siliceux",
      ],
      soilTypesEn: [
        "Calcareous marl",
        "Clay-limestone",
        "Granite",
        "Siliceous soils",
      ],

      grapes: [
        ref(grape("Chardonnay"), "chardonnay"),
        ref(grape("Pinot noir"), "pinot-noir"),
        ref(grape("Gamay"), "gamay"),
        ref(grape("Aligoté", "Aligote"), "aligote"),
      ],

      authorizedWineStyles: [
        "Blanc effervescent",
        "Rosé effervescent",
        "Blanc de blancs",
        "Blanc de noirs",
      ],
      authorizedWineStylesEn: [
        "Sparkling white",
        "Sparkling rosé",
        "Blanc de blancs",
        "Blanc de noirs",
      ],

      productionRules: block(
        "cremant-rules",
        "Les raisins destinés au Crémant de Bourgogne sont récoltés manuellement afin de préserver les grappes entières. Chardonnay et Pinot noir sont centraux, complétés notamment par Aligoté et Gamay, ainsi que quelques cépages plus confidentiels."
      ),
      productionRulesEn: block(
        "cremant-rules-en",
        "Grapes destined for Crémant de Bourgogne are harvested by hand to preserve whole bunches. Chardonnay and Pinot Noir are central, joined notably by Aligoté and Gamay along with several less common varieties."
      ),

      foodPairingNotes:
        "Très polyvalent : huîtres, fruits de mer, tartares, fritures légères, apéritif et fromages délicats.",
      foodPairingNotesEn:
        "Highly versatile with oysters, seafood, tartare, light fried foods, aperitifs and delicate cheeses.",

      latitude: 47.05,
      longitude: 4.83,

      seoTitle: "Crémant de Bourgogne : cépages et accords | Le Premier Verre",
      seoDescription:
        "Découvre le Crémant de Bourgogne, effervescent traditionnel à base notamment de Chardonnay, Pinot noir, Gamay et Aligoté.",
      seoTitleEn: "Crémant de Bourgogne: grapes and pairings | Le Premier Verre",
      seoDescriptionEn:
        "Discover Crémant de Bourgogne, a traditional-method sparkling wine based notably on Chardonnay, Pinot Noir, Gamay and Aligoté.",
    }
  },

  {
    _id: app("Lirac"),
    patch: {
      classification: "AOC",
      country: ref(country("France")),
      region: ref(region("Vallée du Rhône")),

      description: block(
        "lirac-desc",
        "Sur la rive droite du Rhône, face à Châteauneuf-du-Pape, Lirac est un cru méridional historique produisant rouge, blanc et rosé. Garrigue, terrasses et coteaux composent son paysage viticole."
      ),
      descriptionEn: block(
        "lirac-desc-en",
        "On the Rhône's right bank opposite Châteauneuf-du-Pape, Lirac is a historic southern cru producing red, white and rosé wines among garrigue, terraces and slopes."
      ),

      climate:
        "Méditerranéen, chaud et ensoleillé, marqué par le Mistral et par des nuits qui peuvent apporter un contraste thermique utile à la maturation.",
      climateEn:
        "Mediterranean, warm and sunny, shaped by the Mistral and by nights that can provide useful temperature contrast during ripening.",

      soilTypes: [
        "Galets roulés",
        "Argiles rouges",
        "Calcaire",
        "Sables",
      ],
      soilTypesEn: [
        "Rounded pebbles",
        "Red clay",
        "Limestone",
        "Sand",
      ],

      grapes: [
        ref(grape("Grenache"), "grenache"),
        ref(grape("Syrah"), "syrah"),
        ref(grape("Mourvèdre"), "mourvedre"),
      ],

      authorizedWineStyles: ["Rouge", "Rosé", "Blanc"],
      authorizedWineStylesEn: ["Red", "Rosé", "White"],

      productionRules: block(
        "lirac-rules",
        "Lirac couvre quatre communes de la rive droite du Rhône : Lirac, Roquemaure, Saint-Laurent-des-Arbres et Saint-Geniès-de-Comolas. L'appellation est historiquement reconnue pour produire les trois couleurs."
      ),
      productionRulesEn: block(
        "lirac-rules-en",
        "Lirac covers four communes on the Rhône's right bank: Lirac, Roquemaure, Saint-Laurent-des-Arbres and Saint-Geniès-de-Comolas. The appellation is historically recognised for producing all three colours."
      ),

      foodPairingNotes:
        "Les rouges appellent agneau, grillades, saucisses et légumes rôtis; les blancs fonctionnent avec poissons et cuisine méditerranéenne.",
      foodPairingNotesEn:
        "Reds suit lamb, grilled meats, sausages and roasted vegetables, while whites work with fish and Mediterranean dishes.",

      latitude: 44.04,
      longitude: 4.69,

      seoTitle: "Lirac AOC : vins et terroir du Rhône | Le Premier Verre",
      seoDescription:
        "Découvre Lirac, cru de la rive droite du Rhône produisant rouges, blancs et rosés entre galets, garrigue et climat méditerranéen.",
      seoTitleEn: "Lirac AOC: Rhône wines and terroir | Le Premier Verre",
      seoDescriptionEn:
        "Discover Lirac, a right-bank Rhône cru producing red, white and rosé wines in a Mediterranean landscape.",
    }
  },

  {
    _id: app("Pays d'Oc IGP", "Pays d’Oc IGP"),
    patch: {
      classification: "IGP",
      country: ref(country("France")),
      region: ref(region("Languedoc-Roussillon")),

      description: block(
        "paysdoc-desc",
        "Pays d'Oc IGP couvre un vaste territoire méditerranéen du sud de la France, des Pyrénées vers la Camargue. Sa signature est la liberté variétale : une très grande diversité de cépages permet des vins accessibles dans presque tous les styles."
      ),
      descriptionEn: block(
        "paysdoc-desc-en",
        "Pays d'Oc IGP covers a broad Mediterranean territory in southern France, from the Pyrenees toward the Camargue. Its hallmark is varietal freedom, with a very large range of grapes supporting almost every style of wine."
      ),

      climate:
        "Principalement méditerranéen, avec fort ensoleillement, étés secs, influence de la mer, vents régionaux et contrastes créés par les collines et contreforts montagneux.",
      climateEn:
        "Predominantly Mediterranean, with abundant sunshine, dry summers, maritime influence, regional winds and contrasts created by hills and mountain foothills.",

      soilTypes: [
        "Calcaire",
        "Argile",
        "Schiste",
        "Sable",
        "Graviers",
      ],
      soilTypesEn: [
        "Limestone",
        "Clay",
        "Schist",
        "Sand",
        "Gravel",
      ],

      grapes: [
        ref(grape("Chardonnay"), "chardonnay"),
        ref(grape("Syrah"), "syrah"),
        ref(grape("Grenache"), "grenache"),
      ],

      authorizedWineStyles: ["Blanc", "Rouge", "Rosé"],
      authorizedWineStylesEn: ["White", "Red", "Rosé"],

      productionRules: block(
        "paysdoc-rules",
        "Pays d'Oc IGP repose notamment sur une très large palette de cépages autorisés et sur la possibilité de mettre le cépage en avant, ce qui en fait une origine particulièrement associée aux vins de cépage."
      ),
      productionRulesEn: block(
        "paysdoc-rules-en",
        "Pays d'Oc IGP is built around a very broad palette of permitted grape varieties and the ability to feature varietal identity prominently, making it particularly associated with varietal wines."
      ),

      foodPairingNotes:
        "Les accords dépendent surtout du cépage : Chardonnay avec poisson et pâtes crémeuses; Syrah et Grenache avec grillades et cuisine méditerranéenne.",
      foodPairingNotesEn:
        "Pairings depend largely on the grape: Chardonnay with fish and creamy pasta, Syrah and Grenache with grilled meats and Mediterranean dishes.",

      latitude: 43.35,
      longitude: 3.2,

      seoTitle: "Pays d'Oc IGP : cépages et vins du Sud | Le Premier Verre",
      seoDescription:
        "Découvre Pays d'Oc IGP, vaste origine méditerranéenne reconnue pour sa diversité de cépages et de styles.",
      seoTitleEn: "Pays d'Oc IGP: grapes and southern French wine | Le Premier Verre",
      seoDescriptionEn:
        "Discover Pays d'Oc IGP, a broad Mediterranean origin known for its diversity of grape varieties and wine styles.",
    }
  },

  {
    _id: app("Rioja"),
    patch: {
      classification: "DOCa",
      country: ref(country("Espagne")),
      region: ref(region("Vallée de l'Ebre", "Vallée de l’Ebre")),

      description: block(
        "rioja-desc",
        "Rioja est l'une des grandes références du vin espagnol. Le Tempranillo y occupe une place centrale, accompagné notamment de Garnacha, Graciano et Mazuelo, dans des vins allant du fruit immédiat aux longues élevages."
      ),
      descriptionEn: block(
        "rioja-desc-en",
        "Rioja is one of Spain's benchmark wine regions. Tempranillo plays the central role, joined notably by Garnacha, Graciano and Mazuelo in wines ranging from fruit-driven styles to long-aged bottlings."
      ),

      climate:
        "Zone de transition où se rencontrent influences atlantiques, continentales et méditerranéennes, avec des différences importantes selon l'altitude et le secteur.",
      climateEn:
        "A transition zone where Atlantic, continental and Mediterranean influences meet, with important differences according to elevation and subarea.",

      soilTypes: [
        "Argilo-calcaire",
        "Argilo-ferreux",
        "Sols alluviaux",
      ],
      soilTypesEn: [
        "Clay-limestone",
        "Iron-rich clay",
        "Alluvial soils",
      ],

      grapes: [
        ref(grape("Tempranillo"), "tempranillo"),
        ref(grape("Grenache", "Garnacha"), "garnacha"),
      ],

      authorizedWineStyles: ["Rouge", "Blanc", "Rosé", "Effervescent"],
      authorizedWineStylesEn: ["Red", "White", "Rosé", "Sparkling"],

      productionRules: block(
        "rioja-rules",
        "La DOCa Rioja autorise actuellement 14 cépages rouges et blancs. Le Tempranillo domine les plantations rouges, aux côtés notamment de Garnacha, Graciano, Mazuelo et Maturana tinta."
      ),
      productionRulesEn: block(
        "rioja-rules-en",
        "DOCa Rioja currently permits 14 red and white grape varieties. Tempranillo dominates red plantings, joined notably by Garnacha, Graciano, Mazuelo and Maturana Tinta."
      ),

      foodPairingNotes:
        "Les rouges à base de Tempranillo aiment agneau, charcuteries, poulet rôti, champignons, fromages et plats mijotés.",
      foodPairingNotesEn:
        "Tempranillo-based reds pair naturally with lamb, charcuterie, roast chicken, mushrooms, cheese and slow-cooked dishes.",

      latitude: 42.3,
      longitude: -2.5,

      seoTitle: "Rioja DOCa : Tempranillo, styles et terroirs | Le Premier Verre",
      seoDescription:
        "Découvre Rioja DOCa, ses Tempranillos, ses terroirs et les principaux styles de cette grande région espagnole.",
      seoTitleEn: "Rioja DOCa: Tempranillo, styles and terroir | Le Premier Verre",
      seoDescriptionEn:
        "Discover DOCa Rioja, its Tempranillo wines, terroirs and the major styles of this benchmark Spanish region.",
    }
  },

  {
    _id: app("Florina IGP"),
    patch: {
      classification: "IGP",
      country: ref(country("Grèce")),
      region: ref(region("Macédoine")),

      description: block(
        "florina-desc",
        "Florina se situe dans le nord montagneux de la Grèce, en Macédoine occidentale. L'altitude et le caractère continental du secteur permettent des vins qui conservent une fraîcheur marquée malgré le soleil grec."
      ),
      descriptionEn: block(
        "florina-desc-en",
        "Florina lies in mountainous northern Greece, in Western Macedonia. Elevation and the area's continental character allow wines to retain marked freshness despite the Greek sunshine."
      ),

      climate:
        "Continental et relativement frais pour la Grèce, avec hivers froids, vignobles d'altitude et amplitudes thermiques importantes.",
      climateEn:
        "Continental and relatively cool for Greece, with cold winters, high-elevation vineyards and significant day-night temperature shifts.",

      soilTypes: ["Sols sableux", "Argile", "Calcaire"],
      soilTypesEn: ["Sandy soils", "Clay", "Limestone"],

      grapes: [
        ref(grape("Assyrtiko"), "assyrtiko"),
      ],

      authorizedWineStyles: ["Blanc", "Rouge", "Rosé"],
      authorizedWineStylesEn: ["White", "Red", "Rosé"],

      productionRules: block(
        "florina-rules",
        "L'IGP Florina identifie des vins provenant du secteur de Florina en Macédoine occidentale. La fiche LPV met l'accent sur le caractère frais et d'altitude de cette origine plutôt que sur une seule variété."
      ),
      productionRulesEn: block(
        "florina-rules-en",
        "PGI Florina identifies wines originating in the Florina area of Western Macedonia. The LPV profile emphasizes the area's cool, high-elevation character rather than a single grape variety."
      ),

      foodPairingNotes:
        "Les blancs frais du secteur conviennent bien aux poissons, fruits de mer, salades, fromages frais et cuisine grecque aux herbes.",
      foodPairingNotesEn:
        "Fresh whites from the area suit fish, seafood, salads, fresh cheeses and herb-driven Greek dishes.",

      latitude: 40.78,
      longitude: 21.4,

      seoTitle: "Florina IGP : vins de Macédoine grecque | Le Premier Verre",
      seoDescription:
        "Découvre Florina IGP, origine d'altitude du nord de la Grèce marquée par un climat plus continental et une belle fraîcheur.",
      seoTitleEn: "Florina PGI: wines of Greek Macedonia | Le Premier Verre",
      seoDescriptionEn:
        "Discover Florina PGI, a high-elevation northern Greek origin shaped by a more continental climate and vivid freshness.",
    }
  },

  {
    _id: app("Valle del Maipo"),
    patch: {
      classification: "DO",
      country: ref(country("Chili")),
      region: ref(region("Valle Central")),

      description: block(
        "maipo-desc",
        "La vallée du Maipo, autour et au sud de Santiago, est l'un des grands berceaux du Cabernet Sauvignon chilien. Les secteurs proches des Andes se distinguent notamment par l'altitude, les sols alluviaux et les écarts de température entre jour et nuit."
      ),
      descriptionEn: block(
        "maipo-desc-en",
        "The Maipo Valley, around and south of Santiago, is one of the historic homes of Chilean Cabernet Sauvignon. Areas close to the Andes are particularly shaped by elevation, alluvial soils and strong day-night temperature shifts."
      ),

      climate:
        "Méditerranéen sec, avec étés chauds et ensoleillés. L'influence des Andes, l'altitude et les vents descendant des montagnes rafraîchissent plusieurs secteurs.",
      climateEn:
        "Dry Mediterranean, with warm sunny summers. Andean influence, elevation and mountain air cool several sectors.",

      soilTypes: [
        "Sols alluviaux",
        "Graviers",
        "Argile",
        "Sables",
      ],
      soilTypesEn: [
        "Alluvial soils",
        "Gravel",
        "Clay",
        "Sand",
      ],

      grapes: [
        ref(grape("Cabernet Sauvignon"), "cabernet-sauvignon"),
      ],

      authorizedWineStyles: ["Rouge", "Blanc"],
      authorizedWineStylesEn: ["Red", "White"],

      productionRules: block(
        "maipo-rules",
        "La dénomination Valle del Maipo appartient au système chilien d'indications géographiques. La vallée est particulièrement associée aux rouges de Cabernet Sauvignon, même si d'autres cépages y sont cultivés."
      ),
      productionRulesEn: block(
        "maipo-rules-en",
        "Valle del Maipo belongs to Chile's geographical indication system. The valley is particularly associated with Cabernet Sauvignon reds, although other grape varieties are also grown."
      ),

      foodPairingNotes:
        "Cabernet Sauvignon du Maipo : steak, agneau, veau, grillades et fromages à pâte ferme.",
      foodPairingNotesEn:
        "Maipo Cabernet Sauvignon suits steak, lamb, veal, grilled meats and firm cheeses.",

      latitude: -33.7,
      longitude: -70.65,

      seoTitle: "Valle del Maipo : Cabernet Sauvignon chilien | Le Premier Verre",
      seoDescription:
        "Découvre la vallée du Maipo, grande origine chilienne du Cabernet Sauvignon entre climat méditerranéen et influence des Andes.",
      seoTitleEn: "Maipo Valley: Chilean Cabernet Sauvignon | Le Premier Verre",
      seoDescriptionEn:
        "Discover Maipo Valley, a major Chilean Cabernet Sauvignon origin shaped by Mediterranean conditions and the Andes.",
    }
  },
];

/* ═══════════════════════════════════════════════
   VALIDATION
═══════════════════════════════════════════════ */

const problems = [];

for (const c of countries) {
  const p = c.patch;
  if (!p.nameEn) problems.push(`${p.name}: nameEn`);
  if (!p.isoCode) problems.push(`${p.name}: isoCode`);
  if (!p.description || !p.descriptionEn) problems.push(`${p.name}: description FR/EN`);
  if (!p.wineHistory?.length || !p.wineHistoryEn?.length) problems.push(`${p.name}: history FR/EN`);
  if (!p.climate || !p.climateEn) problems.push(`${p.name}: climate FR/EN`);
  if (!p.mainWineStyles?.length || !p.mainWineStylesEn?.length) problems.push(`${p.name}: styles FR/EN`);
  if (!p.signatureGrapes?.length) problems.push(`${p.name}: signatureGrapes`);
}

for (const a of appellations) {
  const p = a.patch;
  if (!p.classification) problems.push(`${a._id}: classification`);
  if (!p.country?._ref) problems.push(`${a._id}: country`);
  if (!p.region?._ref) problems.push(`${a._id}: region`);
  if (!p.description?.length || !p.descriptionEn?.length) problems.push(`${a._id}: description FR/EN`);
  if (!p.climate || !p.climateEn) problems.push(`${a._id}: climate FR/EN`);
  if (!p.soilTypes?.length || !p.soilTypesEn?.length) problems.push(`${a._id}: soils FR/EN`);
  if (!p.grapes?.length) problems.push(`${a._id}: grapes`);
  if (!p.authorizedWineStyles?.length || !p.authorizedWineStylesEn?.length)
    problems.push(`${a._id}: styles FR/EN`);
  if (!p.productionRules?.length || !p.productionRulesEn?.length)
    problems.push(`${a._id}: productionRules FR/EN`);
  if (!p.foodPairingNotes || !p.foodPairingNotesEn)
    problems.push(`${a._id}: pairings FR/EN`);
  if (!p.latitude || !p.longitude) problems.push(`${a._id}: coordinates`);
  if (!p.seoTitle || !p.seoDescription || !p.seoTitleEn || !p.seoDescriptionEn)
    problems.push(`${a._id}: SEO`);
}

console.log("\n════════ LPV — RÉPARATION LOT 01 / BLOC 2 ════════\n");

console.log("PAYS");
for (const c of countries)
  console.log(`  🌍 ${c.patch.name} | styles:${c.patch.mainWineStyles.length} | cépages:${c.patch.signatureGrapes.length}`);

console.log("\nAPPELLATIONS");
for (const a of appellations)
  console.log(`  🍷 ${a._id} | ${a.patch.classification} | cépages:${a.patch.grapes.length}`);

console.log("\nContrôles qualité :", problems.length ? "❌" : "✅");

if (problems.length) {
  for (const p of problems) console.log("  ❌", p);
  process.exit(1);
}

console.log("  ✅ 3 pays enrichis");
console.log("  ✅ 9 appellations enrichies");
console.log("  ✅ descriptions FR + EN");
console.log("  ✅ climats FR + EN");
console.log("  ✅ sols FR + EN");
console.log("  ✅ cépages reliés");
console.log("  ✅ styles FR + EN");
console.log("  ✅ règles de production FR + EN");
console.log("  ✅ accords FR + EN");
console.log("  ✅ coordonnées cartographiques");
console.log("  ✅ SEO FR + EN");

if (!WRITE) {
  console.log("\n🟡 DRY-RUN SEULEMENT — aucune modification Sanity.");
  console.log("Si tout est vert : node scripts/repair-lot-01-block2.mjs --write");
  process.exit(0);
}

/* ═══════════════════════════════════════════════
   ÉCRITURE
═══════════════════════════════════════════════ */

let tx = client.transaction();

for (const c of countries)
  tx = tx.patch(c._id, p => p.set(c.patch));

for (const a of appellations)
  tx = tx.patch(a._id, p => p.set(a.patch));

await tx.commit();

/* ═══════════════════════════════════════════════
   CONTRÔLE POST-WRITE
═══════════════════════════════════════════════ */

const checkIds = [
  ...countries.map(x => x._id),
  ...appellations.map(x => x._id),
];

const checked = await client.fetch(`
*[_id in $ids]{
  _id,_type,name,nameEn,classification,
  description,descriptionEn,
  climate,climateEn,
  soilTypes,soilTypesEn,
  grapes,signatureGrapes,
  authorizedWineStyles,authorizedWineStylesEn,
  productionRules,productionRulesEn,
  foodPairingNotes,foodPairingNotesEn,
  latitude,longitude,
  mainWineStyles,
  seoTitle,seoDescription,seoTitleEn,seoDescriptionEn
}
`, {ids: checkIds});

console.log("\n✅ ÉCRITURE TERMINÉE\n");

for (const d of checked.sort((a,b) => (a.name || "").localeCompare(b.name || ""))) {
  if (d._type === "country") {
    console.log(
      `🌍 ${d.name} | styles:${d.mainWineStyles?.length || 0} | cépages:${d.signatureGrapes?.length || 0} | SEO:${d.seoTitle ? "✓" : "✗"}`
    );
  } else {
    console.log(
      `🍷 ${d.name} | ${d.classification || "—"} | cépages:${d.grapes?.length || 0} | sols:${d.soilTypes?.length || 0} | carte:${d.latitude},${d.longitude}`
    );
  }
}

console.log("\n✅ BLOC 2 DU LOT 01 RÉPARÉ.");
