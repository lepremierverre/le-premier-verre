import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const id = "producer-vignoble-de-la-bauge";

const ref = (_ref, _key) => ({
  _type: "reference",
  _ref,
  ...(_key ? { _key } : {}),
});

function block(text, key) {
  return {
    _type: "block",
    _key: key,
    style: "normal",
    markDefs: [],
    children: [{
      _type: "span",
      _key: `${key}-span`,
      marks: [],
      text,
    }],
  };
}

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("Token Sanity manquant");
  }

  const heroPath = "public/images/lpv/producteurs/bauge1.jpg";
  const secondaryPath = "public/images/lpv/producteurs/bauge2.jpg";

  for (const path of [heroPath, secondaryPath]) {
    if (!fs.existsSync(path)) {
      throw new Error(`Photo introuvable : ${path}`);
    }
  }

  const existing = await client.fetch(
    `*[_type == "producer" && (
      _id == $id ||
      slug.current == "vignoble-de-la-bauge" ||
      name match "*Bauge*"
    )]{_id,name,"slug":slug.current}`,
    { id }
  );

  if (existing.length) {
    console.log("Fiche existante détectée", existing);
    throw new Error("STOP pour éviter un doublon");
  }

  const example = await client.fetch(`
    *[_type == "producer" && slug.current == "ferme-cidricole-equinoxe"][0]{
      approach,
      approachEn
    }
  `);

  const sample = example?.approach?.[0];

  if (!sample) {
    throw new Error("Structure éditoriale de référence introuvable");
  }

  const titleField =
    "title" in sample ? "title" :
    "heading" in sample ? "heading" : null;

  const bodyField =
    "text" in sample ? "text" :
    "body" in sample ? "body" :
    "description" in sample ? "description" : null;

  if (!titleField || !bodyField) {
    console.dir(sample);
    throw new Error("Structure des cartes non reconnue");
  }

  function cards(entries, prefix) {
    return entries.map(([title, body], index) => ({
      _type: sample._type,
      _key: `${prefix}-${index}`,
      [titleField]: title,
      [bodyField]: body,
    }));
  }

  const hero = await client.assets.upload(
    "image",
    fs.createReadStream(heroPath),
    { filename: "vignoble-la-bauge-hero.jpg" }
  );

  const secondary = await client.assets.upload(
    "image",
    fs.createReadStream(secondaryPath),
    { filename: "vignoble-la-bauge-secondary.jpg" }
  );

  const grapeNames = [
    "Frontenac",
    "Frontenac noir",
    "Frontenac blanc",
    "Frontenac gris",
  ];

  const grapes = await client.fetch(`
    *[_type == "grape" && name in $names]{
      _id,name
    }
  `, { names: grapeNames });

  const document = {
    _id: id,
    _type: "producer",

    name: "Vignoble de la Bauge",
    slug: {
      _type: "slug",
      current: "vignoble-de-la-bauge",
    },

    published: true,
    lpvPartner: true,
    producerType: "winery",

    municipality: "Brigham",
    address: "155, avenue des Érables, Brigham, Québec, J2K 4E1",
    foundedYear: 1986,

    country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
    region: ref("55a9fe9a-b3fe-41d6-8145-6adca1a818a8"),

    website: "https://labauge.com/",
    instagram: "https://www.instagram.com/vignobledelabauge/",

    openToVisitors: true,
    reservationRequired: false,

    oneLiner:
      "À Brigham, Simon Naud fait vivre un vignoble familial où les moutons, la biodiversité et le vin naturel font partie de la même histoire.",

    oneLinerEn:
      "In Brigham, Simon Naud carries on a family vineyard where sheep, biodiversity and natural wine are all part of the same story.",

    bio: [
      block(
        "L’histoire de La Bauge commence en 1986, lorsque les parents de Simon Naud décident de transformer leur ferme de Brigham en vignoble. Simon grandit avec les vignes, apprend le métier et reprend finalement le domaine familial. Près de quarante ans plus tard, il continue de faire évoluer ce projet avec la même curiosité.",
        "bauge-fr-1"
      ),
      block(
        "Aujourd’hui, La Bauge est un vignoble biologique où les moutons circulent entre les rangs et où la biodiversité occupe une vraie place. Simon cherche constamment de nouvelles façons de cultiver en prenant soin des sols. Au chai, cette philosophie se poursuit avec des vins naturels qui laissent parler le raisin et le millésime.",
        "bauge-fr-2"
      ),
    ],

    bioEn: [
      block(
        "La Bauge’s story began in 1986, when Simon Naud’s parents decided to turn their Brigham farm into a vineyard. Simon grew up among the vines, learned the trade and eventually took over the family estate. Nearly forty years later, he continues to develop the project with the same curiosity.",
        "bauge-en-1"
      ),
      block(
        "Today, La Bauge is an organic vineyard where sheep roam between the rows and biodiversity has a genuine place. Simon keeps exploring new ways to farm while caring for the soil. In the cellar, that philosophy continues through natural wines that allow the grapes and each vintage to express themselves.",
        "bauge-en-2"
      ),
    ],

    approach: cards([
      [
        "Des moutons dans les vignes",
        "À La Bauge, les moutons participent à l’entretien du vignoble en broutant la végétation entre les rangs. Leur présence permet de limiter certains passages de machinerie et fait partie d’une approche agricole plus large.",
      ],
      [
        "Un domaine qui évolue depuis 1986",
        "Fondé par Alcide et Ghislaine Naud, le vignoble est aujourd’hui dirigé par leur fils Simon. Au fil des années, la famille a fait évoluer ses méthodes tout en conservant un lien fort avec la terre.",
      ],
      [
        "Le goût d’expérimenter",
        "Simon explore l’agriculture régénératrice et cherche à favoriser la vie des sols. Cette curiosité se retrouve aussi dans les cuvées du domaine, notamment ses vins naturels.",
      ],
    ], "bauge-fr"),

    approachEn: cards([
      [
        "Sheep among the vines",
        "At La Bauge, sheep help maintain the vineyard by grazing between the rows. Their presence reduces some machinery work and forms part of a broader farming approach.",
      ],
      [
        "A family estate since 1986",
        "Founded by Alcide and Ghislaine Naud, the vineyard is now run by their son Simon. Over the years, the family has continued to evolve its methods while staying closely connected to the land.",
      ],
      [
        "A spirit of experimentation",
        "Simon explores regenerative agriculture and ways to encourage healthier soils. That curiosity also carries into the cellar, particularly through the estate’s natural wines.",
      ],
    ], "bauge-en"),

    whyWeFollow:
      "Parce que Simon Naud ne se contente pas de faire du vin depuis des décennies. Il continue de remettre ses méthodes en question et de chercher comment mieux cultiver. À La Bauge, les moutons ne sont pas là pour la photo. Ils font partie d’une façon bien réelle de repenser le vignoble.",

    whyWeFollowEn:
      "Because Simon Naud does more than draw on decades of winemaking experience. He keeps questioning his methods and looking for better ways to farm. At La Bauge, the sheep are not just there for the pictures. They are part of a genuine effort to rethink how a vineyard works.",

    visitDetails:
      "Le vignoble accueille les visiteurs à Brigham pendant sa saison d’ouverture. On peut y découvrir les vins du domaine et profiter du cadre champêtre. Les activités et les horaires peuvent varier selon la saison, mieux vaut consulter le site officiel avant de se déplacer.",

    visitDetailsEn:
      "The vineyard welcomes visitors to Brigham during its opening season. Guests can discover the estate’s wines and enjoy the countryside setting. Activities and opening hours vary by season, so check the official website before visiting.",

    signatureGrapes: grapes.map((grape, index) =>
      ref(grape._id, `bauge-grape-${index}`)
    ),

    certifications: ["Viticulture biologique"],

    farmingPractices: [
      "Viticulture biologique",
      "Agriculture régénératrice",
      "Pâturage des moutons dans les vignes",
      "Biodiversité",
    ],

    signatureStyles: [
      "Vins naturels",
      "Vinification peu interventionniste",
    ],

    heroImage: {
      _type: "image",
      asset: ref(hero._id),
    },

    secondaryImage: {
      _type: "image",
      asset: ref(secondary._id),
    },

    mediaCredit: "Vignoble de la Bauge",
    secondaryImageCredit: "Vignoble de la Bauge",

    seoTitle: "Vignoble de la Bauge | Le Premier Verre",
    seoTitleEn: "Vignoble de la Bauge | Le Premier Verre",

    seoDescription:
      "Découvrir le Vignoble de la Bauge à Brigham, son histoire familiale, ses vins naturels et son approche de l’agriculture régénératrice.",

    seoDescriptionEn:
      "Discover Vignoble de la Bauge in Brigham, its family history, natural wines and regenerative farming approach.",
  };

  await client.create(document);

  console.log("\n✓ Vignoble de la Bauge créé");
  console.log("✓ Textes français et anglais");
  console.log("✓ Deux photos importées");
  console.log("✓ Instagram et informations de visite");
  console.log("✓ Cépages trouvés :", grapes.map(g => g.name).join(", "));
  console.log("✓ SEO enregistré");
  console.log("\nStatut des droits photo à confirmer avant affichage.");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
