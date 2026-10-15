import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const producer = {
  _id: "producer-aspall",
  _type: "producer",

  name: "Aspall",
  slug: {
    _type: "slug",
    current: "aspall",
  },

  producerType: "cidery",
  municipality: "Debenham",

  country: {
    _type: "reference",
    _ref: "country-angleterre",
  },

  region: {
    _type: "reference",
    _ref: "region-suffolk",
  },

  mediaPermissionStatus: "none",

  oneLiner:
    "Une maison historique du Suffolk qui produit du cidre à Aspall Hall depuis 1728.",

  oneLinerEn:
    "A historic Suffolk house producing cider at Aspall Hall since 1728.",

  bio: [
    {
      _key: "bio-1",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{
        _key: "bio-1-span",
        _type: "span",
        marks: [],
        text:
          "L’histoire d’Aspall commence en 1728, lorsque Clement Chevallier plante des vergers à Aspall Hall, dans le Suffolk, et entreprend d’y produire du cidre. La maison s’est développée autour d’une approche résolument anglaise du cyder, avec des cuvées sèches et structurées pensées autant pour être bues seules qu’à table.",
      }],
    },
  ],

  bioEn: [
    {
      _key: "bio-en-1",
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{
        _key: "bio-en-1-span",
        _type: "span",
        marks: [],
        text:
          "Aspall's story began in 1728, when Clement Chevallier planted orchards at Aspall Hall in Suffolk and began making cider. The house developed a distinctly English approach to cyder, producing dry, structured styles designed both for drinking on their own and at the table.",
      }],
    },
  ],

  approach: [
    {
      _key: "approach-1",
      _type: "object",
      title: "Tradition du Suffolk",
      text:
        "Une longue tradition de production de cyder anglais à Aspall Hall, dans le Suffolk.",
    },
    {
      _key: "approach-2",
      _type: "object",
      title: "Style sec",
      text:
        "La maison est particulièrement associée à des cidres secs, nets et structurés.",
    },
  ],

  whyWeFollow:
    "Parce qu’Aspall permet d’ajouter au répertoire LPV une référence historique du cidre anglais et de montrer un style très différent des cidres québécois, français et asturiens déjà présents.",

  whyWeFollowEn:
    "Because Aspall adds a historic English cider reference to the LPV directory and illustrates a style that differs markedly from the Québec, French and Asturian ciders already represented.",

  signatureAppleVarieties: [],

  lpvPartner: false,
  openToVisitors: false,

  website: "https://www.aspall.co.uk/",

  foundedYear: 1728,
  founder: "Clement Chevallier",

  published: true,
};

const duplicate = await client.fetch(
  `*[_type == "producer" && (
    _id == $id ||
    slug.current == $slug ||
    name == $name
  )][0]{_id,name}`,
  {
    id: producer._id,
    slug: producer.slug.current,
    name: producer.name,
  }
);

if (duplicate) {
  console.error(`❌ Doublon détecté : ${duplicate._id} — ${duplicate.name}`);
  process.exit(1);
}

await client.create(producer);

console.log(`✅ Producteur créé : ${producer._id}`);
console.log(`   ${producer.name} — ${producer.municipality}, Suffolk`);
console.log(`   Fondation : ${producer.foundedYear}`);
console.log(`   Fondateur : ${producer.founder}`);
console.log(`   Type : ${producer.producerType}`);
console.log("   Partenaire LPV : non");
console.log("   Droits médias : none");
