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

const data = await client.fetch(`{
  "producers": *[_type=="producer"]{_id,name},
  "grapes": *[_type=="grape"]{_id,name},
  "countries": *[_type=="country"]{_id,name},
  "regions": *[_type=="region"]{_id,name},
  "apps": *[_type=="appellation"]{_id,name},
  "wines": *[_type=="wine" && sku in [
    "11768795","12057004","15526996","11293970","212993",
    "15460261","884379","15224277","13990592","15045130"
  ]]{
    _id,name,sku,
    "producerName":producer->name
  }
}`);

const norm = s => (s || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

function index(docs) {
  return new Map(docs.map(d => [norm(d.name), d._id]));
}

const I = {
  producer: index(data.producers),
  grape: index(data.grapes),
  country: index(data.countries),
  region: index(data.regions),
  app: index(data.apps),
};

function get(type, ...names) {
  for (const n of names) {
    const id = I[type].get(norm(n));
    if (id) return id;
  }
  throw new Error(`Référence introuvable : ${type} → ${names.join(" / ")}`);
}

const g = (...x) => get("grape", ...x);
const c = (...x) => get("country", ...x);
const r = (...x) => get("region", ...x);
const a = (...x) => get("app", ...x);
const p = (...x) => get("producer", ...x);

const approach = (key, title, text) => ({
  _key: key,
  _type: "producerApproachItem",
  title,
  text,
});

const approachEn = (key, title, text) => ({
  _key: key,
  _type: "producerApproachItemEn",
  title,
  text,
});

/* ═══════════════════════════════════════════
   PRODUCTEURS
═══════════════════════════════════════════ */

const producers = [
  {
    _id: p("Abeille - Fabre - SA Château Mont-Redon"),
    patch: {
      municipality: "Châteauneuf-du-Pape",
      country: ref(c("France")),
      region: ref(r("Vallée du Rhône")),

      oneLiner:
        "Une maison familiale historique de Châteauneuf-du-Pape qui travaille aussi Lirac, avec une lecture classique et précise du Rhône méridional.",
      oneLinerEn:
        "A historic family estate in Châteauneuf-du-Pape that also works in Lirac, with a classic and precise interpretation of the southern Rhône.",

      bio: block("montredon-bio",
        "Château Mont-Redon appartient aux héritiers de la famille Plantin, la famille Abeille-Fabre, aujourd'hui à la quatrième génération. Le domaine s'est développé à Châteauneuf-du-Pape avant d'élargir son travail à la rive droite du Rhône. En 1980, la famille acquiert 15 hectares en Côtes-du-Rhône, puis 35 hectares en Lirac en 1997, deux vignobles adjacents situés à Roquemaure. Cette présence permet à Mont-Redon de décliner son approche rhodanienne sur plusieurs terroirs tout en conservant une identité familiale forte."
      ),
      bioEn: block("montredon-bio-en",
        "Château Mont-Redon belongs to the Plantin family heirs, the Abeille-Fabre family, now in its fourth generation. The estate developed in Châteauneuf-du-Pape before expanding to the Rhône's right bank. In 1980 the family acquired 15 hectares in Côtes-du-Rhône, followed by 35 hectares in Lirac in 1997, two adjoining vineyards in Roquemaure. This presence allows Mont-Redon to interpret several Rhône terroirs while maintaining a strong family identity."
      ),

      approach: [
        approach("mr-terroir","Plusieurs terroirs du Rhône",
          "La famille travaille Châteauneuf-du-Pape mais aussi des vignobles de Côtes-du-Rhône et de Lirac, permettant plusieurs lectures du Rhône méridional."),
        approach("mr-lirac","Un vrai ancrage à Lirac",
          "Le vignoble de Lirac, acquis en 1997, compte 35 hectares à Roquemaure et fait partie intégrante de l'histoire récente du domaine."),
        approach("mr-family","Continuité familiale",
          "La quatrième génération Abeille-Fabre poursuit aujourd'hui le développement d'une propriété dont l'histoire s'est construite sur plusieurs générations.")
      ],

      approachEn: [
        approachEn("mr-terroir-en","Several Rhône terroirs",
          "The family works in Châteauneuf-du-Pape as well as Côtes-du-Rhône and Lirac, offering several interpretations of the southern Rhône."),
        approachEn("mr-lirac-en","A genuine Lirac presence",
          "The 35-hectare Lirac vineyard acquired in 1997 in Roquemaure is an integral part of the estate's recent history."),
        approachEn("mr-family-en","Family continuity",
          "The fourth Abeille-Fabre generation continues the development of an estate built over several generations.")
      ],

      signatureGrapes: [
        ref(g("Grenache"),"grenache"),
        ref(g("Syrah"),"syrah"),
        ref(g("Mourvèdre"),"mourvedre"),
      ],

      whyWeFollow:
        "Parce que Mont-Redon permet de comprendre le Rhône méridional au-delà d'une seule appellation. Leur Lirac offre un point d'entrée particulièrement intéressant vers les assemblages de Grenache, Syrah et Mourvèdre.",
      whyWeFollowEn:
        "Because Mont-Redon helps explain the southern Rhône beyond a single appellation. Their Lirac is a particularly useful introduction to Grenache, Syrah and Mourvèdre blends.",

      website: "https://www.chateaumontredon.com/",
      openToVisitors: false,
      foundedYear: 1923,
      currentOwner: "Famille Abeille-Fabre",
      appellation: ref(a("Lirac")),
      signatureStyles: ["Rouges du Rhône méridional","Assemblages méditerranéens"],
      seoTitle: "Château Mont-Redon | Producteur | Le Premier Verre",
      seoDescription:
        "Découvre Château Mont-Redon, domaine familial historique de Châteauneuf-du-Pape également implanté à Lirac.",
      published: true,
    }
  },

  {
    _id: p("Alois Lageder SPA"),
    patch: {
      municipality: "Magrè",
      country: ref(c("Italie")),
      region: ref(r("Trentin-Haut-Adige","Trentin Haut-Adige")),

      oneLiner:
        "Une référence familiale du Haut-Adige qui conjugue diversité alpine, biodynamie et recherche constante autour du vignoble.",
      oneLinerEn:
        "A benchmark family estate in Alto Adige combining Alpine diversity, biodynamics and constant vineyard experimentation.",

      bio: block("lageder-bio",
        "L'histoire d'Alois Lageder commence en 1823 lorsque Johann Lageder se lance dans le commerce du vin. Six générations plus tard, la famille poursuit son travail à Magrè, dans le Haut-Adige. L'acquisition du domaine Löwengang en 1934 marque une étape importante de cette histoire. La maison s'est ensuite distinguée par son engagement envers une viticulture durable et la biodynamie. Aujourd'hui, Alois Clemens, Helena et Anna Lageder représentent la sixième génération et travaillent avec une grande diversité de cépages afin d'explorer les multiples conditions alpines de la région."
      ),
      bioEn: block("lageder-bio-en",
        "Alois Lageder's story began in 1823 when Johann Lageder entered the wine trade. Six generations later, the family continues its work in Magrè, Alto Adige. The acquisition of the Löwengang estate in 1934 was a major milestone. The winery later became known for its commitment to sustainable viticulture and biodynamic farming. Today Alois Clemens, Helena and Anna Lageder represent the sixth generation, working with a broad diversity of grape varieties to explore the region's many Alpine growing conditions."
      ),

      approach: [
        approach("lag-bio","Biodynamie",
          "Les vignobles familiaux sont cultivés en biodynamie dans une recherche d'équilibre entre sols, plantes, animaux et activité humaine."),
        approach("lag-div","Diversité",
          "La maison travaille une trentaine de cépages, y compris certaines variétés expérimentales, pour explorer la diversité du Haut-Adige."),
        approach("lag-alt","Lecture alpine",
          "Altitude, exposition et différences de sols sont au cœur d'une gamme qui cherche à exprimer les multiples visages du Haut-Adige.")
      ],
      approachEn: [
        approachEn("lag-bio-en","Biodynamics",
          "The family vineyards are farmed biodynamically, seeking balance among soils, plants, animals and human activity."),
        approachEn("lag-div-en","Diversity",
          "The winery works with around thirty grape varieties, including experimental ones, to explore Alto Adige's diversity."),
        approachEn("lag-alt-en","An Alpine perspective",
          "Elevation, exposure and soil differences are central to a range designed to express Alto Adige's many faces.")
      ],

      signatureGrapes: [
        ref(g("Pinot blanc"),"pinot-blanc"),
        ref(g("Chardonnay"),"chardonnay"),
        ref(g("Pinot noir"),"pinot-noir"),
      ],

      whyWeFollow:
        "Parce que Lageder rend le Haut-Adige facile à comprendre sans le simplifier. Le domaine relie cépages familiers, altitude, biodiversité et pratiques biodynamiques dans des vins particulièrement lisibles.",
      whyWeFollowEn:
        "Because Lageder makes Alto Adige understandable without oversimplifying it. The estate connects familiar grapes, elevation, biodiversity and biodynamic farming in especially clear wines.",

      website: "https://aloislageder.eu/",
      openToVisitors: true,
      visitDetails:
        "Le domaine accueille les visiteurs à Magrè; vérifier les modalités et réservations directement auprès du domaine avant la visite.",
      visitDetailsEn:
        "The estate welcomes visitors in Magrè; check current arrangements and reservation requirements directly with the winery before visiting.",
      address: "Vicolo dei Conti 9, 39040 Magrè, Italie",
      latitude: 46.288268,
      longitude: 11.209931,
      foundedYear: 1823,
      founder: "Johann Lageder",
      currentOwner: "Famille Lageder",
      farmingPractices: ["Biodynamie","Viticulture durable"],
      signatureStyles: ["Blancs alpins","Vins de cépage","Vins de terroir"],
      seoTitle: "Alois Lageder | Producteur du Haut-Adige | Le Premier Verre",
      seoDescription:
        "Découvre Alois Lageder, domaine familial du Haut-Adige fondé en 1823 et engagé en biodynamie.",
      published: true,
    }
  },

  {
    _id: p("Boland Cellar"),
    patch: {
      municipality: "Paarl",
      country: ref(c("Afrique du Sud")),
      region: ref(r("Western Cape")),

      oneLiner:
        "Une maison historique de Paarl construite autour de la collaboration entre viticulteurs et de la diversité des terroirs du Western Cape.",
      oneLinerEn:
        "A historic Paarl winery built around grower collaboration and the diversity of Western Cape terroirs.",

      bio: block("boland-bio",
        "Boland Cellar est née à Paarl en 1941 lorsque neuf viticulteurs ont décidé d'unir leurs forces pour produire de meilleurs vins et partager leurs pratiques. Cette logique collective demeure au cœur de la maison. Les raisins proviennent aujourd'hui de plusieurs secteurs du Western Cape, de Stellenbosch et Paarl jusqu'à Paardeberg, Swartland et Darling. Cette diversité de provenance permet à l'équipe de travailler une large palette de profils et de cépages tout en conservant Paarl comme point d'ancrage historique."
      ),
      bioEn: block("boland-bio-en",
        "Boland Cellar was founded in Paarl in 1941 when nine growers decided to work together to make better wine and share farming knowledge. That collaborative idea remains central today. Grapes are sourced from several Western Cape areas, from Stellenbosch and Paarl to Paardeberg, Swartland and Darling. This range of origins gives the winemaking team a broad palette of sites and varieties while Paarl remains the winery's historic anchor."
      ),

      approach: [
        approach("bol-collab","La force du collectif",
          "Boland est née de neuf viticulteurs qui ont choisi de partager connaissances et ressources plutôt que de travailler isolément."),
        approach("bol-sites","Plusieurs terroirs",
          "La maison assemble le travail de vignobles provenant de différents secteurs du Western Cape."),
        approach("bol-style","Accessibilité",
          "La gamme cherche à rendre les grands cépages sud-africains lisibles et accessibles, du Chenin blanc aux rouges plus structurés.")
      ],
      approachEn: [
        approachEn("bol-collab-en","Strength in collaboration",
          "Boland began with nine growers choosing to share knowledge and resources rather than work in isolation."),
        approachEn("bol-sites-en","Multiple terroirs",
          "The winery works with vineyards from several different parts of the Western Cape."),
        approachEn("bol-style-en","Accessibility",
          "The range aims to make major South African varieties approachable, from Chenin Blanc to more structured reds.")
      ],

      signatureGrapes: [
        ref(g("Chenin blanc"),"chenin-blanc"),
        ref(g("Chardonnay"),"chardonnay"),
        ref(g("Syrah"),"syrah"),
      ],

      whyWeFollow:
        "Parce que Boland Cellar donne un accès simple à la diversité du Western Cape. Leur Chenin blanc est exactement le genre de bouteille qui permet de découvrir un cépage et un pays sans devoir commencer par une cuvée intimidante.",
      whyWeFollowEn:
        "Because Boland Cellar offers an accessible way into the diversity of the Western Cape. Their Chenin Blanc is exactly the kind of bottle that introduces a grape and a country without being intimidating.",

      website: "https://www.bolandcellar.co.za/",
      openToVisitors: false,
      foundedYear: 1941,
      signatureStyles: ["Chenin blanc","Vins du Western Cape"],
      seoTitle: "Boland Cellar | Producteur sud-africain | Le Premier Verre",
      seoDescription:
        "Découvre Boland Cellar, maison de Paarl fondée en 1941 et issue de la collaboration entre viticulteurs du Western Cape.",
      published: true,
    }
  },

  {
    _id: p("EARL Gelin"),
    patch: {
      municipality: "Lancié",
      country: ref(c("France")),
      region: ref(r("Beaujolais")),

      oneLiner:
        "Un domaine familial de Lancié qui décline le Gamay du Beaujolais avec fruit, fraîcheur et une vraie diversité de cuvées.",
      oneLinerEn:
        "A family estate in Lancié exploring Beaujolais Gamay through fruit, freshness and a genuinely diverse range of wines.",

      bio: block("nugues-bio",
        "Le Domaine des Nugues est une exploitation viticole familiale située à Lancié, au cœur du Beaujolais. Magali et Gilles Gelin y produisent notamment Beaujolais, Beaujolais-Villages, Fleurie, Morgon et Moulin-à-Vent, ainsi que des cuvées plus originales. Le domaine est certifié HVE et accueille également les visiteurs pour découvrir les vignes et la cave. Cette diversité permet d'observer plusieurs expressions du Gamay, depuis les rouges souples et immédiats jusqu'aux appellations plus structurées."
      ),
      bioEn: block("nugues-bio-en",
        "Domaine des Nugues is a family wine estate in Lancié, in the heart of Beaujolais. Magali and Gilles Gelin produce Beaujolais, Beaujolais-Villages, Fleurie, Morgon and Moulin-à-Vent, along with more unusual cuvées. The estate holds HVE environmental certification and welcomes visitors to discover the vineyards and cellar. Its range offers several expressions of Gamay, from supple, immediate reds to more structured appellations."
      ),

      approach: [
        approach("nug-family","Domaine familial",
          "Magali et Gilles Gelin portent une exploitation familiale profondément ancrée à Lancié."),
        approach("nug-gamay","Plusieurs visages du Gamay",
          "Beaujolais-Villages, Fleurie, Morgon et Moulin-à-Vent permettent au domaine d'explorer différentes expressions du cépage."),
        approach("nug-hve","Viticulture HVE",
          "Le domaine est engagé dans une démarche environnementale certifiée Haute Valeur Environnementale.")
      ],
      approachEn: [
        approachEn("nug-family-en","Family estate",
          "Magali and Gilles Gelin run a family estate deeply rooted in Lancié."),
        approachEn("nug-gamay-en","Many faces of Gamay",
          "Beaujolais-Villages, Fleurie, Morgon and Moulin-à-Vent allow the estate to explore different expressions of the grape."),
        approachEn("nug-hve-en","HVE viticulture",
          "The estate follows an environmental approach certified Haute Valeur Environnementale.")
      ],

      signatureGrapes: [
        ref(g("Gamay"),"gamay"),
        ref(g("Chardonnay"),"chardonnay"),
      ],

      whyWeFollow:
        "Parce que c'est une excellente porte d'entrée pour comprendre le Gamay sans réduire le Beaujolais au vin nouveau. Une même maison permet de passer du Beaujolais-Villages à plusieurs crus.",
      whyWeFollowEn:
        "Because it is an excellent way to understand Gamay without reducing Beaujolais to nouveau. One estate lets you move from Beaujolais-Villages into several crus.",

      openToVisitors: true,
      visitDetails:
        "Dégustation au domaine et visites commentées des vignes et de la cave sur rendez-vous; vérifier les horaires avant le déplacement.",
      visitDetailsEn:
        "Estate tastings and guided vineyard and cellar visits are available by appointment; check current hours before travelling.",
      address: "40 rue de la Serve, 69220 Lancié, France",
      reservationRequired: true,
      farmingPractices: ["Haute Valeur Environnementale"],
      certifications: ["HVE"],
      signatureStyles: ["Gamay du Beaujolais","Beaujolais-Villages","Crus du Beaujolais"],
      seoTitle: "Domaine des Nugues | Beaujolais | Le Premier Verre",
      seoDescription:
        "Découvre le Domaine des Nugues à Lancié, domaine familial HVE de Magali et Gilles Gelin.",
      published: true,
    }
  },

  {
    _id: p("Gérard Bertrand"),
    patch: {
      municipality: "Narbonne",
      country: ref(c("France")),
      region: ref(r("Languedoc-Roussillon")),

      oneLiner:
        "Une figure majeure du Languedoc qui relie grands terroirs méditerranéens, biodiversité et déploiement ambitieux de la biodynamie.",
      oneLinerEn:
        "A major Languedoc figure connecting Mediterranean terroirs, biodiversity and an ambitious commitment to biodynamic farming.",

      bio: block("gb-bio",
        "Gérard Bertrand découvre la vendange en 1975 au Château de Villemajou, dans les Corbières, puis travaille pendant douze ans aux côtés de son père Georges. Il reprend le domaine familial en 1987 et crée cinq ans plus tard la société Gérard Bertrand. L'acquisition du Château l'Hospitalet en 2002 accompagne une nouvelle phase de développement et les premiers pas de la maison en biodynamie. Le groupe réunit aujourd'hui de nombreux domaines du Sud de la France et place la biodiversité et la biodynamie au centre de son projet viticole."
      ),
      bioEn: block("gb-bio-en",
        "Gérard Bertrand experienced his first harvest in 1975 at Château de Villemajou in the Corbières, then worked for twelve years alongside his father Georges. He took over the family estate in 1987 and founded the Gérard Bertrand wine company five years later. The acquisition of Château l'Hospitalet in 2002 marked a new stage of development and the beginning of the group's biodynamic journey. Today the company brings together numerous southern French estates with biodiversity and biodynamics at the centre of its winegrowing project."
      ),

      approach: [
        approach("gb-biodyn","Biodynamie à grande échelle",
          "La conversion vers la biodynamie débute en 2002 à Cigalus avant de devenir un axe majeur de l'ensemble du groupe."),
        approach("gb-terroirs","Une collection de terroirs",
          "La maison travaille plusieurs domaines et appellations emblématiques du Languedoc et du Sud de la France."),
        approach("gb-biodiv","Biodiversité",
          "Le projet met fortement l'accent sur la vie des sols, la biodiversité et une vision durable de la viticulture.")
      ],
      approachEn: [
        approachEn("gb-biodyn-en","Biodynamics at scale",
          "The move toward biodynamics began at Cigalus in 2002 before becoming a major focus across the group."),
        approachEn("gb-terroirs-en","A collection of terroirs",
          "The company works with several emblematic estates and appellations across Languedoc and southern France."),
        approachEn("gb-biodiv-en","Biodiversity",
          "The project places strong emphasis on living soils, biodiversity and a sustainable vision of viticulture.")
      ],

      signatureGrapes: [
        ref(g("Chardonnay"),"chardonnay"),
        ref(g("Grenache"),"grenache"),
        ref(g("Syrah"),"syrah"),
      ],

      whyWeFollow:
        "Parce que Gérard Bertrand permet d'explorer le Languedoc sous plusieurs angles, du vin de cépage accessible aux cuvées de terroir. La gamme Naturae est aussi un bon point de départ pour parler de vins biologiques et sans sulfites ajoutés.",
      whyWeFollowEn:
        "Because Gérard Bertrand offers several ways into Languedoc, from approachable varietal wines to terroir-driven cuvées. The Naturae range is also a useful starting point for discussing organic wines and wines made without added sulphites.",

      website: "https://www.gerard-bertrand.com/",
      openToVisitors: false,
      founder: "Gérard Bertrand",
      farmingPractices: ["Biodynamie","Agriculture biologique","Biodiversité"],
      certifications: ["Demeter sur une partie importante des vignobles"],
      signatureStyles: ["Vins du Languedoc","Vins biologiques","Vins biodynamiques"],
      seoTitle: "Gérard Bertrand | Producteur du Languedoc | Le Premier Verre",
      seoDescription:
        "Découvre Gérard Bertrand, producteur majeur du Languedoc engagé dans la biodynamie et la biodiversité.",
      published: true,
    }
  },

  {
    _id: p("Gestioni Piccini Srl"),
    patch: {
      municipality: "Castellina in Chianti",
      country: ref(c("Italie")),
      region: ref(r("Toscane")),

      oneLiner:
        "Cinq générations de famille toscane, avec le Chianti comme point de départ et une volonté de raconter plusieurs grands terroirs italiens.",
      oneLinerEn:
        "Five generations of a Tuscan wine family, beginning with Chianti and expanding to tell the story of several major Italian terroirs.",

      bio: block("piccini-bio",
        "Piccini naît en 1882 lorsque Angiolo Piccini fonde une petite maison de vin à Poggibonsi, au cœur de la Toscane. Cinq générations se succèdent ensuite à la tête de l'entreprise. Sous Pierangiolo, la maison s'installe à Castellina in Chianti et investit notamment dans Fattoria di Valiano, en Chianti Classico, ainsi que dans la Maremme. La famille a depuis élargi son horizon à d'autres régions italiennes, mais le Sangiovese et le paysage du Chianti restent au cœur de son identité historique."
      ),
      bioEn: block("piccini-bio-en",
        "Piccini began in 1882 when Angiolo Piccini founded a small winery in Poggibonsi, in the heart of Tuscany. Five generations have since led the company. Under Pierangiolo, the winery moved to Castellina in Chianti and invested notably in Fattoria di Valiano in Chianti Classico and in the Maremma. The family later expanded into other Italian regions, but Sangiovese and the Chianti landscape remain central to its historic identity."
      ),

      approach: [
        approach("pic-family","Cinq générations",
          "Depuis Angiolo Piccini en 1882, la maison s'est transmise au sein de la famille sur cinq générations."),
        approach("pic-tuscany","Racines toscanes",
          "Chianti, Chianti Classico et Maremme forment les racines historiques d'un projet aujourd'hui étendu à d'autres régions italiennes."),
        approach("pic-sangio","Le Sangiovese comme fil conducteur",
          "Le cépage emblématique de Toscane demeure l'un des meilleurs repères pour comprendre l'identité historique de la maison.")
      ],
      approachEn: [
        approachEn("pic-family-en","Five generations",
          "Since Angiolo Piccini in 1882, the winery has passed through five generations of the family."),
        approachEn("pic-tuscany-en","Tuscan roots",
          "Chianti, Chianti Classico and Maremma form the historic roots of a project now extended to other Italian regions."),
        approachEn("pic-sangio-en","Sangiovese as a thread",
          "Tuscany's emblematic grape remains one of the clearest ways to understand the winery's historic identity.")
      ],

      signatureGrapes: [ref(g("Sangiovese"),"sangiovese")],

      whyWeFollow:
        "Parce que Piccini offre une porte d'entrée très accessible vers le Sangiovese et le Chianti. C'est utile pour montrer qu'un grand nom historique peut aussi servir de premier repère avant d'explorer des producteurs plus pointus.",
      whyWeFollowEn:
        "Because Piccini offers a very approachable introduction to Sangiovese and Chianti. It shows how a historic name can provide a useful first reference point before exploring more specialized producers.",

      website: "https://www.piccini1882.it/",
      openToVisitors: false,
      foundedYear: 1882,
      founder: "Angiolo Piccini",
      currentOwner: "Famille Piccini",
      appellation: ref(a("Chianti Classico")),
      signatureStyles: ["Chianti","Chianti Classico","Sangiovese"],
      seoTitle: "Piccini 1882 | Producteur toscan | Le Premier Verre",
      seoDescription:
        "Découvre Piccini 1882, maison familiale toscane née dans le Chianti et transmise sur cinq générations.",
      published: true,
    }
  },

  {
    _id: p("Kir-Yianni SA"),
    patch: {
      municipality: "Naoussa",
      country: ref(c("Grèce")),
      region: ref(r("Macédoine")),

      oneLiner:
        "Une maison phare du nord de la Grèce qui relie tradition macédonienne, vignobles d'altitude et recherche contemporaine.",
      oneLinerEn:
        "A leading northern Greek estate connecting Macedonian tradition, high-elevation vineyards and contemporary experimentation.",

      bio: block("kir-bio",
        "Kir-Yianni est fondé en 1997 par Yiannis Boutaris après son départ du groupe familial Boutari. Le projet s'appuie toutefois sur un travail viticole commencé bien plus tôt : dès 1970, Yiannis Boutaris plante du Xinomavro sur les contreforts du mont Vermion près de Naoussa, puis développe à partir de 1985 des vignobles de cépages blancs dans les hauteurs d'Amyndeon. Aujourd'hui, Stellios Boutaris, cinquième génération de vignerons, dirige la maison avec une philosophie fondée sur l'innovation, le respect de la tradition et la connaissance du vignoble."
      ),
      bioEn: block("kir-bio-en",
        "Kir-Yianni was founded in 1997 by Yiannis Boutaris after he left the family Boutari Wine Group. Its vineyard story began much earlier: in 1970 Yiannis planted Xinomavro on the eastern foothills of Mount Vermion near Naoussa, followed in 1985 by white varieties in the highlands of Amyndeon. Today Stellios Boutaris, a fifth-generation winemaker, leads the estate with a philosophy based on innovation, respect for tradition and deep vineyard knowledge."
      ),

      approach: [
        approach("kir-alt","Vignobles d'altitude",
          "Naoussa et Amyndeon permettent à la maison de travailler des secteurs frais et montagneux du nord de la Grèce."),
        approach("kir-innov","Innovation + tradition",
          "Kir-Yianni revendique explicitement une approche qui associe innovation, respect de la tradition et connaissance du vin."),
        approach("kir-north","Le nord grec",
          "La maison constitue un excellent repère pour comprendre une Grèce viticole plus continentale et montagneuse.")
      ],
      approachEn: [
        approachEn("kir-alt-en","High-elevation vineyards",
          "Naoussa and Amyndeon allow the estate to work with cool, mountainous sites in northern Greece."),
        approachEn("kir-innov-en","Innovation + tradition",
          "Kir-Yianni explicitly combines innovation, respect for tradition and deep wine knowledge."),
        approachEn("kir-north-en","Northern Greece",
          "The estate is an excellent reference point for understanding the more continental, mountainous face of Greek wine.")
      ],

      signatureGrapes: [ref(g("Assyrtiko"),"assyrtiko")],

      whyWeFollow:
        "Parce que Kir-Yianni aide à sortir des raccourcis sur le vin grec. Ici, on découvre la Macédoine, l'altitude et une viticulture du nord qui offre un tout autre contexte à l'Assyrtiko.",
      whyWeFollowEn:
        "Because Kir-Yianni helps move beyond shortcuts about Greek wine. It introduces Macedonia, elevation and a northern wine culture that gives Assyrtiko an entirely different context.",

      website: "https://kiryianni.gr/",
      openToVisitors: false,
      foundedYear: 1997,
      founder: "Yiannis Boutaris",
      currentOwner: "Famille Boutaris",
      signatureStyles: ["Vins de Macédoine","Vins d'altitude"],
      seoTitle: "Kir-Yianni | Producteur de Macédoine grecque | Le Premier Verre",
      seoDescription:
        "Découvre Kir-Yianni, domaine fondé par Yiannis Boutaris et aujourd'hui dirigé par la cinquième génération.",
      published: true,
    }
  },

  {
    _id: p("Louis Bouillot"),
    patch: {
      municipality: "Nuits-Saint-Georges",
      country: ref(c("France")),
      region: ref(r("Bourgogne")),

      oneLiner:
        "Une maison historique de Nuits-Saint-Georges spécialisée dans les bulles bourguignonnes bien avant la naissance officielle du Crémant de Bourgogne.",
      oneLinerEn:
        "A historic Nuits-Saint-Georges house specializing in Burgundy sparkling wine long before Crémant de Bourgogne officially existed.",

      bio: block("lb-bio",
        "L'histoire de Louis Bouillot est intimement liée aux vins effervescents de Bourgogne. Jean Bouillot s'installe face à la gare de Nuits-Saint-Georges en 1877 et développe le commerce de vins mousseux. Louis et son frère Adrien poursuivent ensuite cette spécialisation. Lorsque l'AOC Crémant de Bourgogne est reconnue en 1975, la maison possède donc déjà près d'un siècle d'expérience dans les bulles bourguignonnes. Aujourd'hui, Louis Bouillot travaille un vaste vignoble consacré au Crémant de Bourgogne et poursuit son exploration des cépages et terroirs de la région."
      ),
      bioEn: block("lb-bio-en",
        "Louis Bouillot's history is closely tied to Burgundy sparkling wine. Jean Bouillot established himself opposite the Nuits-Saint-Georges railway station in 1877 and developed a trade in sparkling wines. Louis and his brother Adrien continued that specialization. By the time the Crémant de Bourgogne AOC was officially recognized in 1975, the house already had nearly a century of sparkling-wine experience. Today Louis Bouillot works a substantial vineyard dedicated to Crémant de Bourgogne and continues exploring the region's grapes and terroirs."
      ),

      approach: [
        approach("lb-spark","Spécialiste des bulles",
          "La maison travaille les vins effervescents de Bourgogne depuis 1877, bien avant la reconnaissance de l'AOC Crémant de Bourgogne."),
        approach("lb-terroir","Du nord au sud de la Bourgogne",
          "Les vignobles dédiés au Crémant permettent d'explorer plusieurs secteurs et terroirs bourguignons."),
        approach("lb-varieties","Plusieurs cépages",
          "Pinot noir, Chardonnay, Gamay et Aligoté permettent une grande variété d'assemblages et de styles effervescents.")
      ],
      approachEn: [
        approachEn("lb-spark-en","Sparkling specialist",
          "The house has worked with Burgundy sparkling wines since 1877, long before the Crémant de Bourgogne AOC was created."),
        approachEn("lb-terroir-en","Across Burgundy",
          "Vineyards dedicated to Crémant allow the house to explore several Burgundian areas and terroirs."),
        approachEn("lb-varieties-en","Several grape varieties",
          "Pinot Noir, Chardonnay, Gamay and Aligoté provide a broad palette for blends and sparkling styles.")
      ],

      signatureGrapes: [
        ref(g("Pinot noir"),"pinot-noir"),
        ref(g("Chardonnay"),"chardonnay"),
        ref(g("Gamay"),"gamay"),
        ref(g("Aligoté","Aligote"),"aligote"),
      ],

      whyWeFollow:
        "Parce que Louis Bouillot permet d'aborder le Crémant de Bourgogne comme un vrai vin de terroir, et pas simplement comme une alternative moins chère au Champagne.",
      whyWeFollowEn:
        "Because Louis Bouillot makes it possible to approach Crémant de Bourgogne as a genuine terroir wine rather than simply a cheaper alternative to Champagne.",

      website: "https://www.louis-bouillot.com/",
      openToVisitors: true,
      visitDetails:
        "La Verrière à Nuits-Saint-Georges propose un parcours consacré au Crémant de Bourgogne et des dégustations; vérifier les horaires et réservations avant la visite.",
      visitDetailsEn:
        "La Verrière in Nuits-Saint-Georges offers a Crémant de Bourgogne visitor experience and tastings; check current hours and reservation arrangements before visiting.",
      address: "2 rue de la Berchère, 21700 Nuits-Saint-Georges, France",
      foundedYear: 1877,
      appellation: ref(a("Crémant de Bourgogne")),
      signatureStyles: ["Crémant de Bourgogne","Blanc de blancs","Blanc de noirs"],
      seoTitle: "Louis Bouillot | Crémant de Bourgogne | Le Premier Verre",
      seoDescription:
        "Découvre Louis Bouillot, maison de Nuits-Saint-Georges spécialisée dans les vins effervescents de Bourgogne depuis 1877.",
      published: true,
    }
  },

  {
    _id: p("Vina Cousino Macul SA","Viña Cousiño Macul SA"),
    patch: {
      municipality: "Santiago",
      country: ref(c("Chili")),
      region: ref(r("Valle Central")),

      oneLiner:
        "Une maison historique du Maipo fondée en 1856 et toujours liée à la famille fondatrice, avec le Cabernet Sauvignon comme grand repère.",
      oneLinerEn:
        "A historic Maipo winery founded in 1856 and still tied to its founding family, with Cabernet Sauvignon as a key reference.",

      bio: block("cm-bio",
        "Cousiño-Macul fait partie des maisons historiques du vin chilien. Matías Cousiño acquiert la Hacienda Macul en 1856, au pied des Andes, et l'entreprise familiale se développe ensuite avec Luis Cousiño et Isidora Goyenechea. Plus de 160 ans plus tard, la maison souligne qu'elle demeure entièrement entre les mains de la famille fondatrice. Son identité est fortement liée à la vallée du Maipo et à des vins chiliens classiques, notamment le Cabernet Sauvignon."
      ),
      bioEn: block("cm-bio-en",
        "Cousiño-Macul is one of Chile's historic wine estates. Matías Cousiño acquired Hacienda Macul in 1856 at the foot of the Andes, and the family wine business later developed under Luis Cousiño and Isidora Goyenechea. More than 160 years later, the winery states that it remains fully owned by the founding family. Its identity is closely connected to the Maipo Valley and classic Chilean wines, particularly Cabernet Sauvignon."
      ),

      approach: [
        approach("cm-family","Continuité familiale",
          "Fondée au XIXe siècle, la maison demeure liée à la famille fondatrice après plus de 160 ans."),
        approach("cm-maipo","Identité Maipo",
          "Le projet historique de Cousiño-Macul est profondément associé aux contreforts andins et à la vallée du Maipo."),
        approach("cm-classic","Un style chilien classique",
          "Cabernet Sauvignon et grands rouges structurés constituent des repères importants de l'identité de la maison.")
      ],
      approachEn: [
        approachEn("cm-family-en","Family continuity",
          "Founded in the nineteenth century, the winery remains connected to its founding family more than 160 years later."),
        approachEn("cm-maipo-en","Maipo identity",
          "Cousiño-Macul's historic project is deeply associated with the Andean foothills and Maipo Valley."),
        approachEn("cm-classic-en","Classic Chilean style",
          "Cabernet Sauvignon and structured reds are important reference points in the winery's identity.")
      ],

      signatureGrapes: [ref(g("Cabernet Sauvignon"),"cabernet-sauvignon")],

      whyWeFollow:
        "Parce que Cousiño-Macul donne un excellent repère pour comprendre le Cabernet Sauvignon chilien classique et l'importance historique de la vallée du Maipo.",
      whyWeFollowEn:
        "Because Cousiño-Macul is an excellent reference point for understanding classic Chilean Cabernet Sauvignon and the historic importance of the Maipo Valley.",

      website: "https://cousinomacul.com/",
      openToVisitors: false,
      foundedYear: 1856,
      founder: "Famille Cousiño",
      currentOwner: "Famille Cousiño",
      appellation: ref(a("Valle del Maipo")),
      signatureStyles: ["Cabernet Sauvignon du Maipo","Rouges chiliens classiques"],
      seoTitle: "Cousiño-Macul | Producteur du Maipo | Le Premier Verre",
      seoDescription:
        "Découvre Cousiño-Macul, maison familiale chilienne fondée en 1856 et référence historique de la vallée du Maipo.",
      published: true,
    }
  },
];

/*
 * Deux producteurs demandent une prudence supplémentaire :
 * Luis Gurpegui Muga et le nom juridique utilisé pour certains vins.
 * On leur donne une fiche éditoriale solide sans inventer d'historique précis
 * non confirmé.
 */

producers.push(
  {
    _id: p("Bodegas Luis Gurpegui Muga S.A"),
    patch: {
      municipality: "San Adrián",
      country: ref(c("Espagne")),
      region: ref(r("Vallée de l'Ebre","Vallée de l’Ebre")),

      oneLiner:
        "Une maison espagnole tournée vers des vins accessibles de Rioja, avec le Tempranillo comme principal point de repère.",
      oneLinerEn:
        "A Spanish producer focused on approachable Rioja wines, with Tempranillo as the main reference point.",

      bio: block("gur-bio",
        "Bodegas Luis Gurpegui Muga élabore des vins espagnols dont plusieurs cuvées liées à Rioja. Pour Le Premier Verre, la maison est surtout intéressante comme point d'entrée vers le Tempranillo : un cépage capable de donner des rouges fruités, structurés et faciles à associer à table. La fiche demeure volontairement centrée sur les éléments utiles au lecteur et sur la bouteille sélectionnée, plutôt que d'ajouter des détails historiques ou techniques qui ne sont pas suffisamment documentés."
      ),
      bioEn: block("gur-bio-en",
        "Bodegas Luis Gurpegui Muga produces Spanish wines including several Rioja-linked bottlings. For Le Premier Verre, the winery is most useful as an introduction to Tempranillo, a grape capable of producing fruity, structured and food-friendly reds. This profile deliberately focuses on information useful to the reader and on the selected bottle rather than adding historical or technical details that are not sufficiently documented."
      ),

      approach: [
        approach("gur-rioja","Rioja comme repère",
          "La cuvée sélectionnée permet d'aborder Rioja dans un registre accessible et immédiatement compréhensible."),
        approach("gur-temp","Tempranillo",
          "Le Tempranillo constitue le fil conducteur idéal pour comprendre le style de la bouteille retenue par Le Premier Verre.")
      ],
      approachEn: [
        approachEn("gur-rioja-en","Rioja as a reference",
          "The selected wine offers an approachable and immediately understandable introduction to Rioja."),
        approachEn("gur-temp-en","Tempranillo",
          "Tempranillo provides the clearest thread for understanding the bottle selected by Le Premier Verre.")
      ],

      signatureGrapes: [
        ref(g("Tempranillo"),"tempranillo"),
        ref(g("Garnacha tintorera"),"garnacha-tintorera"),
      ],

      whyWeFollow:
        "Parce que la cuvée 111 permet de parler de Rioja sans commencer par une bouteille coûteuse ou très évoluée. C'est un repère simple pour découvrir le Tempranillo.",
      whyWeFollowEn:
        "Because the 111 cuvée makes it possible to discuss Rioja without starting with an expensive or heavily aged bottle. It is a simple introduction to Tempranillo.",

      openToVisitors: false,
      appellation: ref(a("Rioja")),
      signatureStyles: ["Rouges de Rioja","Tempranillo"],
      seoTitle: "Luis Gurpegui Muga | Rioja | Le Premier Verre",
      seoDescription:
        "Découvre Bodegas Luis Gurpegui Muga et une porte d'entrée accessible vers le Tempranillo de Rioja.",
      published: true,
    }
  }
);

/* ═══════════════════════════════════════════
   VALIDATION PRODUCTEURS
═══════════════════════════════════════════ */

const problems = [];

for (const x of producers) {
  const q = x.patch;

  if (!q.municipality) problems.push(`${x._id}: municipality`);
  if (!q.country?._ref) problems.push(`${x._id}: country`);
  if (!q.region?._ref) problems.push(`${x._id}: region`);
  if (!q.oneLiner || q.oneLiner.length > 220)
    problems.push(`${x._id}: oneLiner`);
  if (!q.oneLinerEn)
    problems.push(`${x._id}: oneLinerEn`);
  if (!q.bio?.length || !q.bioEn?.length)
    problems.push(`${x._id}: bio FR/EN`);
  if (!q.approach?.length || q.approach.length > 3)
    problems.push(`${x._id}: approach`);
  if (!q.approachEn?.length)
    problems.push(`${x._id}: approachEn`);
  if (!q.signatureGrapes?.length)
    problems.push(`${x._id}: signatureGrapes`);
  if (!q.whyWeFollow || !q.whyWeFollowEn)
    problems.push(`${x._id}: whyWeFollow FR/EN`);
}

/* ═══════════════════════════════════════════
   CORRECTION RELATION PERLE RARE
═══════════════════════════════════════════ */

const perle = data.wines.find(w => w.sku === "884379");

if (!perle)
  problems.push("Vin Perle Rare SKU 884379 introuvable");

const perleGrapes = [
  ref(g("Pinot noir"),"pinot-noir"),
  ref(g("Chardonnay"),"chardonnay"),
  ref(g("Aligoté","Aligote"),"aligote"),
  ref(g("Gamay"),"gamay"),
];

/* ═══════════════════════════════════════════
   CONTRÔLE DES 10 VINS
═══════════════════════════════════════════ */

if (data.wines.length !== 10)
  problems.push(`Lot 01 : ${data.wines.length}/10 vins retrouvés par SKU`);

console.log("\n════════ LPV — RÉPARATION LOT 01 / BLOC 3 ════════\n");

console.log("PRODUCTEURS");
for (const x of producers) {
  console.log(
    `  🏡 ${x._id} | ${x.patch.municipality} | approche:${x.patch.approach.length} | cépages:${x.patch.signatureGrapes.length}`
  );
}

console.log("\nRELATIONS");
console.log(
  `  🥂 Perle Rare → Pinot noir + Chardonnay + Aligoté + Gamay`
);

console.log("\nVINS LOT 01 RETROUVÉS");
for (const w of data.wines.sort((x,y) => x.name.localeCompare(y.name)))
  console.log(`  🍷 ${w.sku} — ${w.name}`);

console.log("\nContrôles qualité :", problems.length ? "❌" : "✅");

if (problems.length) {
  for (const e of problems) console.log("  ❌", e);
  process.exit(1);
}

console.log("  ✅ 10 producteurs");
console.log("  ✅ identité + municipalité + pays + région");
console.log("  ✅ oneLiner FR + EN");
console.log("  ✅ bio FR + EN");
console.log("  ✅ approche FR + EN");
console.log("  ✅ cépages signatures");
console.log("  ✅ pourquoi on les suit FR + EN");
console.log("  ✅ aucun statut LPV Partner modifié");
console.log("  ✅ aucun droit photo modifié");
console.log("  ✅ Perle Rare corrigé à 4 cépages");
console.log("  ✅ 10/10 vins du lot retrouvés");

if (!WRITE) {
  console.log("\n🟡 DRY-RUN SEULEMENT — aucune modification Sanity.");
  console.log("Si tout est vert : node scripts/repair-lot-01-block3.mjs --write");
  process.exit(0);
}

/* ═══════════════════════════════════════════
   ÉCRITURE
═══════════════════════════════════════════ */

let tx = client.transaction();

for (const x of producers)
  tx = tx.patch(x._id, patch => patch.set(x.patch));

tx = tx.patch(perle._id, patch => patch.set({
  grapes: perleGrapes
}));

await tx.commit();

/* ═══════════════════════════════════════════
   AUDIT POST-WRITE
═══════════════════════════════════════════ */

const audit = await client.fetch(`{
  "producers": *[_id in $producerIds]{
    _id,name,municipality,
    "country":country->name,
    "region":region->name,
    oneLiner,oneLinerEn,
    bio,bioEn,
    approach,approachEn,
    signatureGrapes,
    whyWeFollow,whyWeFollowEn,
    lpvPartner,
    mediaPermissionStatus,
    published
  },
  "wines": *[_type=="wine" && sku in [
    "11768795","12057004","15526996","11293970","212993",
    "15460261","884379","15224277","13990592","15045130"
  ]]{
    _id,name,sku,
    "producer":producer->name,
    "country":country->name,
    "region":region->name,
    "appellation":appellation->name,
    "grapes":grapes[]->name,
    foodPairings,
    oneLiner,oneLinerEn,
    tastingKeywords,tastingKeywordsEn,
    perfectFor,perfectForEn,
    whyWeRecommend,whyWeRecommendEn,
    body,sweetness,roundness,
    servingTemperature,
    published
  }
}`, {
  producerIds: producers.map(x => x._id)
});

console.log("\n✅ ÉCRITURE TERMINÉE\n");

for (const x of audit.producers.sort((a,b) => a.name.localeCompare(b.name))) {
  console.log(
    `🏡 ${x.name} | ${x.municipality} | bio:${x.bio?.length ? "✓":"✗"} | approche:${x.approach?.length || 0} | cépages:${x.signatureGrapes?.length || 0}`
  );
}

console.log("\nAUDIT DES 10 VINS");

let wineErrors = 0;

for (const w of audit.wines.sort((a,b) => a.name.localeCompare(b.name))) {
  const errors = [];

  if (!w.producer) errors.push("producteur");
  if (!w.country) errors.push("pays");
  if (!w.region) errors.push("région");
  if (!w.appellation) errors.push("appellation");
  if (!w.grapes?.length) errors.push("cépages");
  if ((w.foodPairings?.length || 0) < 4) errors.push("accords");
  if (!w.oneLiner || !w.oneLinerEn) errors.push("oneLiner");
  if (!w.tastingKeywords?.length || !w.tastingKeywordsEn?.length)
    errors.push("keywords");
  if (!w.perfectFor?.length || !w.perfectForEn?.length)
    errors.push("perfectFor");
  if (!w.whyWeRecommend || !w.whyWeRecommendEn)
    errors.push("why");
  if (!w.body || !w.sweetness || !w.roundness)
    errors.push("profil");
  if (!w.servingTemperature)
    errors.push("service");

  if (errors.length) wineErrors++;

  console.log(
    `${errors.length ? "❌":"✅"} ${w.name} | ` +
    `cépages:${w.grapes?.length || 0} | accords:${w.foodPairings?.length || 0}` +
    (errors.length ? ` | MANQUE: ${errors.join(", ")}` : "")
  );
}

console.log(
  `\n${wineErrors ? "❌":"✅"} AUDIT FINAL : ${10 - wineErrors}/10 vins conformes au socle LPV.`
);

if (wineErrors)
  process.exit(1);

console.log("\n🍷 LOT 01 — STRUCTURE ET RÉFÉRENCES RÉPARÉES.");
