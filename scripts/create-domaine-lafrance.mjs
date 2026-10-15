import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const ref = (_ref) => ({ _type: "reference", _ref });

const block = (text, key) => ({
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
});

const producer = {
  _id: "producer-domaine-lafrance",
  _type: "producer",

  name: "Domaine Lafrance",
  slug: { _type: "slug", current: "domaine-lafrance" },

  producerType: "cidery",
  municipality: "Saint-Joseph-du-Lac",

  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-quebec"),

  mediaPermissionStatus: "none",
  lpvPartner: false,

  oneLiner:
    "Un domaine familial de Saint-Joseph-du-Lac qui fait évoluer la pomme québécoise du verger à une gamme particulièrement diversifiée de cidres et de spiritueux.",
  oneLinerEn:
    "A family estate in Saint-Joseph-du-Lac taking Québec apples from orchard to a particularly diverse range of ciders and spirits.",

  bio: [
    block(
      "L’histoire du Domaine Lafrance remonte à 1925, lorsque Georges-Étienne Lafrance et son père Wilfrid commencent à livrer leurs pommes à Montréal. Au fil des générations, les vergers prennent de l’ampleur et l’entreprise se diversifie. Le permis de fabrication artisanale de cidre est obtenu en 1997. En 2000, Éric Lafrance et Julie Hubert reprennent l’entreprise familiale et investissent dans la cidrerie, les installations de production et la mise en marché des cidres. Aujourd’hui, le Domaine Lafrance demeure étroitement lié à ses vergers de Saint-Joseph-du-Lac et produit plusieurs expressions du cidre québécois.",
      "bio-fr-1"
    ),
  ],

  bioEn: [
    block(
      "Domaine Lafrance traces its history to 1925, when Georges-Étienne Lafrance and his father Wilfrid began delivering their apples to Montreal. Over the generations, the orchards expanded and the family business diversified. An artisanal cider production permit was obtained in 1997. In 2000, Éric Lafrance and Julie Hubert took over the family business and invested in the cidery, production facilities and cider distribution. Today, Domaine Lafrance remains closely connected to its Saint-Joseph-du-Lac orchards and produces many expressions of Québec cider.",
      "bio-en-1"
    ),
  ],

  approach: [
    {
      _key: "verger",
      _type: "object",
      title: "Du verger à la bouteille",
      text:
        "Les pommes utilisées pour les cidres proviennent des vergers du domaine, maintenant développés sur plusieurs générations à Saint-Joseph-du-Lac.",
    },
    {
      _key: "diversite",
      _type: "object",
      title: "Une grande diversité de styles",
      text:
        "Cidres pétillants, tranquilles, naturels, mousseux et de glace permettent au domaine d’explorer plusieurs expressions de la pomme québécoise.",
    },
    {
      _key: "innovation",
      _type: "object",
      title: "Tradition et innovation",
      text:
        "Le domaine combine son héritage de pomiculteur à une recherche constante de nouvelles techniques, de nouveaux produits et de nouvelles façons de mettre en valeur son terroir.",
    },
  ],

  approachEn: [
    {
      _key: "orchard",
      _type: "object",
      title: "From orchard to bottle",
      text:
        "The apples used for the ciders come from the estate's orchards, developed over several generations in Saint-Joseph-du-Lac.",
    },
    {
      _key: "diversity",
      _type: "object",
      title: "A wide range of styles",
      text:
        "Sparkling, still, natural, traditional sparkling and ice ciders allow the estate to explore many expressions of Québec apples.",
    },
    {
      _key: "innovation",
      _type: "object",
      title: "Tradition and innovation",
      text:
        "The estate combines its apple-growing heritage with an ongoing exploration of new techniques, products and ways of expressing its terroir.",
    },
  ],

  signatureAppleVarieties: [],

  whyWeFollow:
    "Parce que le Domaine Lafrance permet de voir jusqu’où peut aller la pomme québécoise. Sa gamme passe du cidre de glace aux pétillants naturels et aux cidres tranquilles, tout en restant directement liée au verger familial. C’est précisément cette diversité qui en fait un producteur intéressant pour comprendre le cidre d’ici au-delà d’un seul style.",
  whyWeFollowEn:
    "Because Domaine Lafrance shows just how far Québec apples can go. Its range stretches from ice cider to natural sparkling and still ciders while remaining directly connected to the family orchard. That diversity makes it especially useful for understanding Québec cider beyond a single style.",

  openToVisitors: true,

  visitDetails:
    "Domaine, boutique et activités agrotouristiques au 1473, chemin Principal à Saint-Joseph-du-Lac. Le site est ouvert à l’année; vérifier les horaires avant le déplacement.",
  visitDetailsEn:
    "Estate, boutique and agritourism activities at 1473 Chemin Principal in Saint-Joseph-du-Lac. The site is open year-round; check current hours before visiting.",

  address: "1473, chemin Principal, Saint-Joseph-du-Lac (Québec) J0N 1M0",
  website: "https://domainelafrance.com/",

  foundedYear: 1925,
  founder: "Georges-Étienne Lafrance et Wilfrid Lafrance",
  currentOwner: "Éric Lafrance et Julie Hubert",

  signatureStyles: [
    "Cidres pétillants naturels",
    "Cidres tranquilles",
    "Cidres mousseux",
    "Cidres de glace",
  ],

  aiSummary:
    "Domaine familial de Saint-Joseph-du-Lac dont l’histoire remonte à 1925. Producteur de cidres depuis les années 1990, Domaine Lafrance élabore aujourd’hui une gamme diversifiée à partir des pommes de ses propres vergers.",

  seoTitle:
    "Domaine Lafrance — Saint-Joseph-du-Lac | Le Premier Verre",

  seoDescription:
    "Découvrez Domaine Lafrance à Saint-Joseph-du-Lac, domaine familial québécois produisant cidres pétillants, naturels, tranquilles et cidres de glace.",

  published: true,
};

const duplicate = await client.fetch(
  `*[_type == "producer" && (
    _id == $id ||
    name == $name ||
    slug.current == $slug
  )][0]{_id,name}`,
  {
    id: producer._id,
    name: producer.name,
    slug: producer.slug.current,
  }
);

if (duplicate) {
  console.error(`❌ Doublon détecté : ${duplicate._id} — ${duplicate.name}`);
  process.exit(1);
}

await client.create(producer);

console.log(`✅ Producteur créé : ${producer._id}`);
console.log(`   ${producer.name} — Saint-Joseph-du-Lac`);
console.log(`   Type : ${producer.producerType}`);
console.log("   Partenaire LPV : non");
console.log("   Droits médias : none");
