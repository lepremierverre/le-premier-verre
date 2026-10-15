import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const countryId = "d9fc0ce6-5f30-4e00-8bc5-63146a0a6407";
const regionId = "region-monteregie";

const block = (key, text) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [
    {
      _key: `${key}-span`,
      _type: "span",
      marks: [],
      text,
    },
  ],
});

const doc = {
  _id: "producer-cidrerie-du-minot",
  _type: "producer",

  name: "Cidrerie du Minot",
  slug: {
    _type: "slug",
    current: "cidrerie-du-minot",
  },

  producerType: "cidery",
  municipality: "Hemmingford",

  country: {
    _type: "reference",
    _ref: countryId,
  },

  region: {
    _type: "reference",
    _ref: regionId,
  },

  mediaPermissionStatus: "none",

  oneLiner:
    "Une maison pionnière du cidre québécois, où la pomme est travaillée avec la précision et les réflexes du monde du vin.",

  oneLinerEn:
    "A pioneering Quebec cider house where apples are approached with the precision and know-how of the wine world.",

  bio: [
    block(
      "bio-1",
      "Installés à Hemmingford après avoir quitté leur Bretagne natale à la fin des années 1970, Robert et Joëlle Demoy ont fondé la Cidrerie du Minot avec l’idée de pousser le cidre québécois plus loin. Œnologue diplômé de l’Université de Bordeaux, Robert transpose au travail de la pomme une approche issue du vin. En 1988, la maison produit sa première cuvée de Crémant de Pomme, devenue son produit phare. Aujourd’hui, la relève familiale est assurée par leurs enfants Audrenne et Alan Demoy. La cidrerie explore plusieurs expressions de la pomme, des cidres pétillants aux cidres tranquilles et de glace."
    ),
  ],

  bioEn: [
    block(
      "bio-en-1",
      "After leaving their native Brittany in the late 1970s, Robert and Joëlle Demoy settled in Hemmingford and founded Cidrerie du Minot with the ambition of taking Quebec cider further. A trained oenologist and graduate of the University of Bordeaux, Robert brought a wine-inspired approach to cider making. In 1988, the house produced its first Crémant de Pomme, which became its flagship cuvée. Today, the family tradition continues with their children Audrenne and Alan Demoy. The cider house explores several expressions of apples, from sparkling and still ciders to ice cider."
    ),
  ],

  approach: [
    {
      _key: "approach-1",
      _type: "producerApproachItem",
      title: "La pomme d’abord",
      text: "Une gamme construite autour de différentes expressions de la pomme, du cidre frais et léger jusqu’aux cuvées de glace plus concentrées.",
    },
    {
      _key: "approach-2",
      _type: "producerApproachItem",
      title: "Des bulles naturelles",
      text: "Les cidres pétillants de la maison sont élaborés avec une prise de mousse naturelle pendant la fermentation, selon la méthode Charmat.",
    },
    {
      _key: "approach-3",
      _type: "producerApproachItem",
      title: "Une histoire familiale",
      text: "Fondée par Robert et Joëlle Demoy, la cidrerie poursuit aujourd’hui son travail avec la deuxième génération, Audrenne et Alan.",
    },
  ],

  approachEn: [
    {
      _key: "approach-en-1",
      _type: "producerApproachItemEn",
      title: "Apple first",
      text: "A range built around different expressions of apples, from fresh, light ciders to richer and more concentrated ice ciders.",
    },
    {
      _key: "approach-en-2",
      _type: "producerApproachItemEn",
      title: "Naturally created bubbles",
      text: "The house's sparkling ciders develop their effervescence naturally during fermentation using the Charmat method.",
    },
    {
      _key: "approach-en-3",
      _type: "producerApproachItemEn",
      title: "A family story",
      text: "Founded by Robert and Joëlle Demoy, the cider house is now carried forward by the second generation, Audrenne and Alan.",
    },
  ],

  signatureAppleVarieties: [
    "McIntosh",
    "Lobo",
    "Cortland",
    "Empire",
  ],

  whyWeFollow:
    "Parce que Du Minot permet de comprendre jusqu’où peut aller le cidre québécois. Une maison historique, mais surtout une gamme assez large pour découvrir la pomme sous des formes très différentes.",

  whyWeFollowEn:
    "Because Du Minot shows just how far Quebec cider can go. It is a historic house with a broad enough range to explore apples through remarkably different styles.",

  lpvPartner: false,

  openToVisitors: true,
  visitDetails:
    "Boutique à la cidrerie. Vérifier les heures d’ouverture directement auprès du producteur avant de se déplacer.",
  visitDetailsEn:
    "Cider house shop. Check current opening hours directly with the producer before visiting.",

  address: "376, chemin Covey Hill, Hemmingford (Québec)",
  website: "https://www.duminot.com/",

  foundedYear: 1988,
  founder: "Robert et Joëlle Demoy",
  currentOwner: "Audrenne et Alan Demoy",

  signatureStyles: [
    "Cidres pétillants",
    "Cidres tranquilles",
    "Cidres de glace",
  ],

  published: true,

  seoTitle: "Cidrerie du Minot | Producteur de cidre québécois",
  seoDescription:
    "Découvrez la Cidrerie du Minot à Hemmingford, maison pionnière du cidre québécois et productrice du Crémant de Pomme.",
};

const existing = await client.fetch(
  `*[_type == "producer" && (name == $name || slug.current == $slug)][0]{_id,name}`,
  { name: doc.name, slug: doc.slug.current }
);

if (existing) {
  console.log("⛔ Producteur déjà existant :", existing);
  process.exit(0);
}

const result = await client.create(doc);

console.log("✅ Producteur créé :", result._id);
console.log("   Cidrerie du Minot — Hemmingford, Montérégie");
console.log("   Type : cidery");
console.log("   Partenaire LPV : non");
console.log("   Droits médias : none");
