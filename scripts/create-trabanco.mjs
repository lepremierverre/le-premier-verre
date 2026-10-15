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
  _id: "producer-trabanco",
  _type: "producer",

  name: "Trabanco",
  slug: {
    _type: "slug",
    current: "trabanco",
  },

  producerType: "cidery",
  municipality: "Lavandera, Gijón",

  country: ref("country-espagne"),
  region: ref("region-asturies"),

  mediaPermissionStatus: "none",
  lpvPartner: false,

  oneLiner:
    "Une maison familiale emblématique des Asturies qui perpétue depuis 1925 la tradition de la sidra natural, notamment par des fermentations en grands fûts de châtaignier.",

  oneLinerEn:
    "An emblematic family cider house from Asturias, carrying on the tradition of natural cider since 1925, notably through fermentation in large chestnut barrels.",

  bio: [
    block(
      "L’histoire de Trabanco commence en 1925 avec Emilio Trabanco, qui produit alors du cidre pour sa famille et ses proches à Lavandera, dans les Asturies. La maison familiale s’est développée autour de la sidra natural asturienne et de méthodes traditionnelles transmises au fil des générations. Trabanco demeure aujourd’hui étroitement associé à cette culture du cidre, où la sélection des pommes, la fermentation naturelle et l’élevage en grands contenants traditionnels occupent une place centrale.",
      "bio-fr-1"
    ),
  ],

  bioEn: [
    block(
      "Trabanco's story begins in 1925 with Emilio Trabanco, who made cider for his family and friends in Lavandera, Asturias. The family house developed around traditional Asturian natural cider and methods passed down through generations. Trabanco remains closely associated with this cider culture, where apple selection, natural fermentation and traditional large-format vessels play a central role.",
      "bio-en-1"
    ),
  ],

  approach: [
    {
      _key: "tradition",
      _type: "object",
      title: "La sidra natural asturienne",
      text:
        "Trabanco travaille dans la tradition du cidre naturel des Asturies, avec un style sec et une expression directe de la pomme.",
    },
    {
      _key: "chataignier",
      _type: "object",
      title: "Les fûts de châtaignier",
      text:
        "Les grands contenants traditionnels en bois de châtaignier font partie du savoir-faire historique de la maison et sont notamment utilisés pour la fermentation de sa sidra natural traditionnelle.",
    },
    {
      _key: "pommes",
      _type: "object",
      title: "Des pommes destinées au cidre",
      text:
        "La maison travaille différentes catégories de pommes à cidre afin de rechercher l’équilibre entre acidité, amertume, structure et expression aromatique.",
    },
  ],

  approachEn: [
    {
      _key: "tradition",
      _type: "object",
      title: "Asturian natural cider",
      text:
        "Trabanco works within the tradition of Asturian natural cider, emphasizing a dry style and direct apple expression.",
    },
    {
      _key: "chestnut",
      _type: "object",
      title: "Chestnut barrels",
      text:
        "Large traditional chestnut-wood vessels are part of the house's historic know-how and are notably used in the fermentation of its traditional natural cider.",
    },
    {
      _key: "apples",
      _type: "object",
      title: "Cider apples",
      text:
        "The house works with different categories of cider apples to balance acidity, bitterness, structure and aromatic expression.",
    },
  ],

  signatureAppleVarieties: [],

  whyWeFollow:
    "Parce que Trabanco permet de comprendre le cidre dans un contexte culturel complètement différent du Québec. Ici, la sidra n’est pas une alternative au vin : elle appartient depuis longtemps à la table, aux cidreries et aux rituels des Asturies. C’est une référence essentielle pour montrer que le monde du cidre possède lui aussi ses traditions, ses terroirs et ses styles régionaux.",

  whyWeFollowEn:
    "Because Trabanco offers a completely different cultural perspective on cider from Québec. Here, cider is not an alternative to wine: it has long belonged at the table, in cider houses and within the rituals of Asturias. It is an essential reference for showing that cider also has its own traditions, terroirs and regional styles.",

  openToVisitors: true,

  visitDetails:
    "Trabanco propose des expériences liées à sa cidrerie dans les Asturies. Vérifier les visites et horaires directement auprès de la maison avant le déplacement.",

  visitDetailsEn:
    "Trabanco offers cider-house experiences in Asturias. Check current tours and opening hours directly with the producer before visiting.",

  website: "https://www.sidratrabanco.com/",

  foundedYear: 1925,
  founder: "Emilio Trabanco",

  signatureStyles: [
    "Sidra natural",
    "Cidres traditionnels asturiens",
    "Cidres fermentés en bois de châtaignier",
  ],

  aiSummary:
    "Maison familiale asturienne fondée en 1925 par Emilio Trabanco à Lavandera, Gijón. Trabanco est une référence de la sidra natural et perpétue notamment l’usage traditionnel de grands fûts de châtaignier.",

  seoTitle:
    "Trabanco — Sidra des Asturies | Le Premier Verre",

  seoDescription:
    "Découvrez Trabanco, maison familiale des Asturies fondée en 1925 et référence historique de la sidra natural asturienne.",

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
console.log(`   ${producer.name} — Lavandera, Gijón, Asturies`);
console.log(`   Fondation : ${producer.foundedYear}`);
console.log(`   Type : ${producer.producerType}`);
console.log("   Partenaire LPV : non");
console.log("   Droits médias : none");
