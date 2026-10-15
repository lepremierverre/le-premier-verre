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
  _id: "producer-cidrerie-michel-jodoin",
  _type: "producer",

  name: "Cidrerie Michel Jodoin",
  slug: {
    _type: "slug",
    current: "cidrerie-michel-jodoin",
  },

  producerType: "cidery",
  municipality: "Rougemont",

  country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
  region: ref("region-monteregie"),

  mediaPermissionStatus: "none",
  lpvPartner: false,

  oneLiner:
    "Une maison pionnière de Rougemont qui explore le cidre québécois depuis 1988, avec un travail emblématique autour de la pomme Geneva.",
  oneLinerEn:
    "A pioneering Rougemont cider house exploring Québec cider since 1988, with signature work around the red-fleshed Geneva apple.",

  bio: [
    block(
      "L’histoire de la famille Jodoin à Rougemont commence en 1901, lorsque Jean-Baptiste Jodoin achète un verger d’une centaine de pommiers. Quatrième génération de pomiculteurs, Michel Jodoin apprend la cidriculture auprès de son père Jean et de son grand-père Ernest, puis perfectionne ses connaissances en Europe, notamment en Champagne. La Cidrerie Michel Jodoin ouvre ses portes en 1988 et devient l’une des maisons pionnières du cidre québécois de méthode traditionnelle. Au fil des décennies, elle développe une gamme étendue de cidres et se distingue particulièrement par son travail avec la Geneva, une pomme à chair rouge.",
      "bio-fr-1"
    ),
  ],

  bioEn: [
    block(
      "The Jodoin family's story in Rougemont began in 1901, when Jean-Baptiste Jodoin purchased an orchard of about one hundred apple trees. A fourth-generation apple grower, Michel Jodoin learned cider making from his father Jean and grandfather Ernest before further developing his knowledge in Europe, including training in Champagne. Cidrerie Michel Jodoin opened in 1988 and became one of Québec's pioneering traditional-method cider houses. Over the decades, it has developed a broad range of ciders and become particularly associated with the red-fleshed Geneva apple.",
      "bio-en-1"
    ),
  ],

  approach: [
    {
      _key: "verger",
      _type: "object",
      title: "Un héritage de pomiculteurs",
      text:
        "La famille Jodoin cultive des pommes à Rougemont depuis 1901, avec plusieurs générations directement liées au verger et à la transformation.",
    },
    {
      _key: "geneva",
      _type: "object",
      title: "La Geneva comme signature",
      text:
        "La cidrerie s’est particulièrement distinguée par son travail avec la Geneva, une pomme à chair rouge qui apporte couleur, fruit et personnalité à plusieurs cuvées.",
    },
    {
      _key: "diversite",
      _type: "object",
      title: "Explorer plusieurs expressions du cidre",
      text:
        "Méthode traditionnelle, cidres tranquilles, pétillants, cidres de glace et spiritueux permettent à la maison d’explorer plusieurs visages de la pomme québécoise.",
    },
  ],

  approachEn: [
    {
      _key: "orchard",
      _type: "object",
      title: "An apple-growing heritage",
      text:
        "The Jodoin family has grown apples in Rougemont since 1901, with several generations directly involved in the orchard and its transformation.",
    },
    {
      _key: "geneva",
      _type: "object",
      title: "Geneva as a signature",
      text:
        "The cider house is particularly associated with Geneva, a red-fleshed apple that brings colour, fruit and personality to several of its ciders.",
    },
    {
      _key: "diversity",
      _type: "object",
      title: "Exploring many expressions of cider",
      text:
        "Traditional-method, still, sparkling and ice ciders, along with spirits, allow the house to explore many expressions of Québec apples.",
    },
  ],

  signatureAppleVarieties: [
    "Geneva",
    "McIntosh",
  ],

  whyWeFollow:
    "Parce que Michel Jodoin fait partie des producteurs qui permettent de comprendre l’évolution du cidre québécois. Son histoire relie directement le verger familial, les débuts du cidre artisanal moderne et une recherche constante de nouvelles expressions de la pomme. Son travail avec la Geneva donne aussi à la maison une identité immédiatement reconnaissable.",
  whyWeFollowEn:
    "Because Michel Jodoin is one of the producers through whom the evolution of Québec cider can be understood. Its story connects the family orchard, the beginnings of modern craft cider and a continuing exploration of new expressions of the apple. Its work with Geneva also gives the house an immediately recognizable identity.",

  openToVisitors: true,

  visitDetails:
    "Boutique à Rougemont, dégustations sous certaines conditions, visites et activités sur le site. Vérifier les horaires et modalités avant de se déplacer.",
  visitDetailsEn:
    "Rougemont boutique, tastings under certain conditions, tours and on-site activities. Check current hours and arrangements before visiting.",

  website: "https://www.micheljodoin.ca/",

  foundedYear: 1988,
  founder: "Michel Jodoin",
  currentOwner:
    "Michel Jodoin, David Jodoin, Philippe Jodoin et Jean-Philippe Lachapelle",

  signatureStyles: [
    "Cidres de méthode traditionnelle",
    "Cidres pétillants",
    "Cidres tranquilles",
    "Cidres de glace",
  ],

  aiSummary:
    "Cidrerie pionnière de Rougemont fondée en 1988 par Michel Jodoin, quatrième génération d’une famille de pomiculteurs établie dans la région depuis 1901 et particulièrement reconnue pour son travail avec la pomme Geneva.",

  seoTitle:
    "Cidrerie Michel Jodoin — Rougemont | Le Premier Verre",

  seoDescription:
    "Découvrez la Cidrerie Michel Jodoin à Rougemont, pionnière du cidre québécois depuis 1988 et reconnue notamment pour son travail avec la pomme Geneva.",

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
console.log(`   ${producer.name} — Rougemont, Montérégie`);
console.log(`   Type : ${producer.producerType}`);
console.log(`   Partenaire LPV : non`);
console.log(`   Droits médias : none`);
