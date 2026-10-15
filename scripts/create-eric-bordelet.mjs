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
  _id: "producer-eric-bordelet",
  _type: "producer",

  name: "Éric Bordelet",
  slug: {
    _type: "slug",
    current: "eric-bordelet",
  },

  producerType: "cidery",
  municipality: "Charchigné",

  country: ref("country-france"),
  region: ref("region-normandie"),

  mediaPermissionStatus: "none",
  lpvPartner: false,

  oneLiner:
    "Ancien sommelier devenu cidriculteur, Éric Bordelet aborde pommes et poires avec une précision inspirée du vin et une attention particulière aux variétés, aux sols et aux équilibres.",

  oneLinerEn:
    "A former sommelier turned cider maker, Éric Bordelet approaches apples and pears with wine-inspired precision and close attention to varieties, soils and balance.",

  bio: [
    block(
      "Ancien sommelier, Éric Bordelet reprend le domaine familial en 1992 à Charchigné, dans le nord de la Mayenne, aux portes de la Normandie. Son travail repose sur des vergers de pommes, de poires et de cormes comprenant une grande diversité de variétés. Sa démarche transpose au cidre une lecture proche de celle du vin : attention portée au fruit, au sol, au millésime, aux assemblages et à l’équilibre final.",
      "bio-fr-1"
    ),
  ],

  bioEn: [
    block(
      "A former sommelier, Éric Bordelet returned to the family estate in 1992 in Charchigné, in northern Mayenne near Normandy. His orchards include apples, pears and service-tree fruit across a broad diversity of varieties. His approach brings a wine-like perspective to cider, with close attention to fruit, soil, vintage, blending and overall balance.",
      "bio-en-1"
    ),
  ],

  approach: [
    {
      _key: "varietes",
      _type: "object",
      title: "La diversité variétale",
      text:
        "Le domaine travaille un grand nombre de variétés de pommes et de poires afin de construire ses cuvées à partir d’équilibres entre douceur, acidité, amertume, tanins et expression aromatique.",
    },
    {
      _key: "terroir",
      _type: "object",
      title: "Une lecture de terroir",
      text:
        "Éric Bordelet aborde ses vergers avec une sensibilité proche de celle du monde du vin, en accordant une place importante aux sols, au fruit et aux caractéristiques de chaque récolte.",
    },
    {
      _key: "bio",
      _type: "object",
      title: "Des vergers conduits en bio",
      text:
        "Les vergers sont travaillés selon des principes d’agriculture biologique, avec une approche qui s’inscrit également dans une logique biodynamique.",
    },
  ],

  approachEn: [
    {
      _key: "varieties",
      _type: "object",
      title: "Varietal diversity",
      text:
        "The estate works with a broad range of apple and pear varieties to build its cuvées around balances of sweetness, acidity, bitterness, tannin and aromatic expression.",
    },
    {
      _key: "terroir",
      _type: "object",
      title: "A terroir-driven perspective",
      text:
        "Éric Bordelet approaches his orchards with a sensitivity close to that of the wine world, giving particular attention to soils, fruit and the characteristics of each harvest.",
    },
    {
      _key: "organic",
      _type: "object",
      title: "Organically farmed orchards",
      text:
        "The orchards are farmed according to organic principles, within an approach that also draws on biodynamic practices.",
    },
  ],

  signatureAppleVarieties: [],

  whyWeFollow:
    "Parce qu’Éric Bordelet est une référence essentielle pour comprendre jusqu’où peut aller le cidre lorsqu’il est pensé avec la même exigence qu’un vin. Son travail met la variété des fruits, le terroir et l’équilibre au premier plan et permet de sortir définitivement le cidre de l’image d’une simple boisson fruitée.",

  whyWeFollowEn:
    "Because Éric Bordelet is an essential reference for understanding how far cider can go when approached with the same level of intent as wine. His work places fruit diversity, terroir and balance at the forefront and moves cider well beyond the idea of a simple fruity drink.",

  openToVisitors: false,

  website: "https://ericbordelet.com/",

  foundedYear: 1992,
  founder: "Éric Bordelet",
  currentOwner: "Éric Bordelet",

  signatureStyles: [
    "Cidres de pommes",
    "Poirés",
    "Cidres de terroir",
    "Cidres gastronomiques",
  ],

  aiSummary:
    "Ancien sommelier installé à Charchigné, Éric Bordelet reprend le domaine familial en 1992 et produit des cidres et poirés de terroir à partir d’une grande diversité de variétés, avec une approche biologique et inspirée du monde du vin.",

  seoTitle:
    "Éric Bordelet — Cidres et poirés de terroir | Le Premier Verre",

  seoDescription:
    "Découvrez Éric Bordelet, ancien sommelier devenu cidriculteur, référence française des cidres et poirés de terroir depuis 1992.",

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
console.log(`   ${producer.name} — Charchigné`);
console.log("   Région LPV : Normandie");
console.log(`   Reprise du domaine : ${producer.foundedYear}`);
console.log(`   Type : ${producer.producerType}`);
console.log("   Partenaire LPV : non");
console.log("   Droits médias : none");
