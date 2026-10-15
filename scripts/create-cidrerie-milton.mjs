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
  _id: "producer-cidrerie-milton",
  _type: "producer",

  name: "Cidrerie Milton",
  slug: { _type: "slug", current: "cidrerie-milton" },

  producerType: "cidery",
  municipality: "Sainte-Cécile-de-Milton",

  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-quebec"),

  mediaPermissionStatus: "none",
  lpvPartner: false,

  oneLiner:
    "Une cidrerie familiale de Sainte-Cécile-de-Milton qui conjugue un vaste verger, une grande diversité de pommes et une approche résolument contemporaine du cidre québécois.",

  oneLinerEn:
    "A family cider house in Sainte-Cécile-de-Milton combining extensive orchards, remarkable apple diversity and a decidedly contemporary approach to Québec cider.",

  bio: [
    block(
      "La Cidrerie Milton est profondément enracinée à Sainte-Cécile-de-Milton, où la famille Lasnier est établie depuis plusieurs générations. Aujourd’hui président-propriétaire, Marc-Antoine Lasnier représente la septième génération de la famille dans la région. Après des générations consacrées à la pomme, il poursuit l’histoire familiale en plaçant le cidre au centre de son projet. La cidrerie exploite aujourd’hui plus de 30 000 pommiers et cultive 51 variétés, une diversité qui nourrit une gamme allant des cidres classiques aux cuvées nature et aux expressions plus expérimentales.",
      "bio-fr-1"
    ),
  ],

  bioEn: [
    block(
      "Cidrerie Milton is deeply rooted in Sainte-Cécile-de-Milton, where the Lasnier family has lived for generations. Owner and president Marc-Antoine Lasnier now represents the family's seventh generation in the area. After generations centred on apples, he continues the family story with cider at the heart of the project. The cidery now tends more than 30,000 apple trees and grows 51 varieties, supporting a range that stretches from approachable classics to natural and more exploratory ciders.",
      "bio-en-1"
    ),
  ],

  approach: [
    {
      _key: "diversite",
      _type: "object",
      title: "51 variétés de pommes",
      text:
        "La diversité du verger permet à Milton de travailler autant avec des variétés québécoises familières qu’avec des pommes choisies pour des profils cidricoles plus particuliers.",
    },
    {
      _key: "exploration",
      _type: "object",
      title: "Le cidre comme terrain d’exploration",
      text:
        "La gamme va des cidres classiques très accessibles aux cuvées nature et aux expressions plus singulières, avec une volonté assumée d’explorer de nouveaux profils.",
    },
    {
      _key: "savoir-faire",
      _type: "object",
      title: "Verger et production réunis",
      text:
        "Le travail commence au verger et se poursuit à la cidrerie, où techniques artisanales et procédés modernes sont utilisés pour transformer les différentes variétés de pommes.",
    },
  ],

  approachEn: [
    {
      _key: "diversity",
      _type: "object",
      title: "51 apple varieties",
      text:
        "The diversity of the orchard allows Milton to work with familiar Québec apples as well as varieties selected for more distinctive cider profiles.",
    },
    {
      _key: "exploration",
      _type: "object",
      title: "Cider as a field of exploration",
      text:
        "The range stretches from highly approachable classics to natural and more distinctive ciders, with a clear desire to explore new flavour profiles.",
    },
    {
      _key: "craft",
      _type: "object",
      title: "Orchard and production together",
      text:
        "The work begins in the orchard and continues in the cidery, where artisanal techniques and modern processes transform a broad diversity of apples.",
    },
  ],

  signatureAppleVarieties: [
    "McIntosh",
    "Spartan",
    "Cortland",
    "Golden Russet",
    "Geneva",
  ],

  whyWeFollow:
    "Parce que Milton montre à quel point le cidre québécois peut couvrir un large spectre sans perdre son lien avec la pomme. La taille et surtout la diversité du verger donnent à la cidrerie une matière première particulièrement intéressante, tandis que sa gamme permet de passer d’un cidre d’initiation à des cuvées beaucoup plus exploratoires.",
  
  whyWeFollowEn:
    "Because Milton shows how broad the spectrum of Québec cider can be without losing its connection to the apple. The scale and especially the diversity of its orchards provide particularly interesting raw material, while the range makes it possible to move from introductory ciders to much more exploratory bottles.",

  openToVisitors: true,

  visitDetails:
    "Cidrerie, verger, dégustation et activités à Sainte-Cécile-de-Milton. Vérifier les heures et les activités offertes avant le déplacement.",

  visitDetailsEn:
    "Cidery, orchard, tastings and activities in Sainte-Cécile-de-Milton. Check current hours and available activities before visiting.",

  address:
    "5, route 137, Sainte-Cécile-de-Milton (Québec) J0E 2C0",

  website: "https://cidreriemilton.com/",

  currentOwner: "Marc-Antoine Lasnier",

  signatureStyles: [
    "Cidres classiques",
    "Cidres nature",
    "Cidres pétillants",
    "Cidres de glace",
  ],

  aiSummary:
    "Cidrerie familiale de Sainte-Cécile-de-Milton dirigée par Marc-Antoine Lasnier, septième génération de sa famille dans la région. Ses vergers comptent plus de 30 000 pommiers et 51 variétés.",

  seoTitle:
    "Cidrerie Milton — Sainte-Cécile-de-Milton | Le Premier Verre",

  seoDescription:
    "Découvrez la Cidrerie Milton, ses 51 variétés de pommes et sa gamme de cidres québécois classiques, nature et exploratoires.",

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
console.log(`   ${producer.name} — Sainte-Cécile-de-Milton`);
console.log(`   Type : ${producer.producerType}`);
console.log("   Partenaire LPV : non");
console.log("   Droits médias : none");
