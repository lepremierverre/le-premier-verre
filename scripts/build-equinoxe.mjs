import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "producer-ferme-cidricole-equinoxe";

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

const approach = (key, title, text) => ({
  _key: key,
  _type: "producerApproachItem",
  title,
  text,
});

async function upload(path, filename) {
  return client.assets.upload(
    "image",
    fs.createReadStream(path),
    { filename }
  );
}

const hero = await upload(
  process.env.EQ1,
  "ferme-cidricole-equinoxe-hero.jpeg"
);

const secondary = await upload(
  process.env.EQ2,
  "ferme-cidricole-equinoxe-secondary.jpeg"
);

await client
  .patch(id)
  .set({
    published: true,
    lpvPartner: true,
    producerType: "cidery",

    municipality: "Farnham",
    address: "2015, route 104, Farnham, Québec",
    website: "https://www.fermecidricoleequinoxe.com/",

    heroImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: hero._id,
      },
    },

    secondaryImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: secondary._id,
      },
    },

    mediaCredit: "Ferme cidricole Équinoxe",
    secondaryImageCredit: "Ferme cidricole Équinoxe",
    mediaPermissionStatus: "provided_by_producer",

    oneLiner:
      "À Farnham, Équinoxe cultive ses fruits et ses raisins en bio pour créer des cidres et des vins qui sortent des sentiers battus.",

    oneLinerEn:
      "In Farnham, Équinoxe organically grows fruit and grapes to create ciders and wines that take a different path.",

    bio: [
      block(
        "À Farnham, Équinoxe réunit un verger, un vignoble et une ferme biologique où l’on cultive bien plus que des pommes. Les fruits récoltés sur place deviennent des cidres, des vins et d’autres produits qui reflètent la diversité de la ferme.",
        "bio-1"
      ),
      block(
        "Le projet a été pensé comme un lieu où l’agriculture, la transformation et le plaisir de recevoir se rencontrent. Aujourd’hui, on peut autant y découvrir une bouteille qu’y prendre un verre ou profiter du bistro champêtre.",
        "bio-2"
      ),
    ],

    bioEn: [
      block(
        "In Farnham, Équinoxe brings together an orchard, a vineyard and an organic farm where much more than apples are grown. Fruit harvested on the farm becomes cider, wine and other products that reflect its diversity.",
        "bio-1"
      ),
      block(
        "The project was designed as a place where farming, transformation and hospitality come together. Today, visitors can discover a bottle, enjoy a glass or spend some time at the farm bistro.",
        "bio-2"
      ),
    ],

    approach: [
      approach(
        "approach-farm",
        "Tout commence à la ferme",
        "Équinoxe cultive une grande diversité de fruits et transforme une partie de ses récoltes sur place. Les pommes, les raisins et les autres fruits donnent naissance à des boissons qui évoluent au rythme des saisons."
      ),
      approach(
        "approach-wine-cider",
        "Le vin et le cidre se rencontrent",
        "Équinoxe explore autant le raisin que la pomme et n’hésite pas à faire dialoguer les deux univers. Cette liberté donne naissance à des cuvées qui ne se rangent pas toujours dans une seule catégorie."
      ),
      approach(
        "approach-organic",
        "La ferme mise sur le bio",
        "L’agriculture biologique occupe une place importante dans le projet. Le verger, le vignoble et les autres cultures sont pensés comme les différentes parties d’une même ferme."
      ),
    ],

    approachEn: [
      approach(
        "approach-farm",
        "It all starts on the farm",
        "Équinoxe grows a wide variety of fruit and transforms part of its harvest on site. Apples, grapes and other fruit become drinks that evolve with the seasons."
      ),
      approach(
        "approach-wine-cider",
        "Wine and cider meet",
        "Équinoxe works with both grapes and apples and is not afraid to bring the two worlds together. That freedom leads to cuvées that do not always fit neatly into a single category."
      ),
      approach(
        "approach-organic",
        "The farm focuses on organic growing",
        "Organic farming plays an important role in the project. The orchard, vineyard and other crops are approached as different parts of the same farm."
      ),
    ],

    whyWeFollow:
      "Parce qu’Équinoxe montre qu’il n’est pas nécessaire de choisir entre le vin et le cidre. En travaillant avec les fruits de la ferme, l’équipe crée des cuvées originales qui donnent envie de découvrir tout ce que le Québec peut produire.",

    whyWeFollowEn:
      "Because Équinoxe shows that there is no need to choose between wine and cider. By working with fruit grown on the farm, the team creates original cuvées that invite us to discover just how much Quebec can produce.",

    visitDetails:
      "On peut découvrir les produits de la ferme sur place et profiter du bistro champêtre pendant la saison d’accueil. Les jours et heures d’ouverture peuvent varier, mieux vaut les vérifier auprès d’Équinoxe avant de se déplacer.",

    visitDetailsEn:
      "Visitors can discover the farm’s products on site and enjoy the farm bistro during the visiting season. Opening days and hours can vary, so it is best to check with Équinoxe before visiting.",

    seoTitle:
      "Ferme cidricole Équinoxe | Le Premier Verre",

    seoTitleEn:
      "Équinoxe Cider Farm | Le Premier Verre",

    seoDescription:
      "Découvrir la Ferme cidricole Équinoxe à Farnham. Une ferme biologique où le cidre, le vin et les fruits du Québec se rencontrent.",

    seoDescriptionEn:
      "Discover Équinoxe Cider Farm in Farnham. An organic farm where cider, wine and Quebec grown fruit come together.",
  })
  .commit();

const check = await client.fetch(
  `*[_id == $id][0]{
    name,
    "slug": slug.current,
    published,
    municipality,
    address,
    website,
    oneLiner,
    mediaCredit,
    secondaryImageCredit,
    "hero": heroImage.asset->originalFilename,
    "secondary": secondaryImage.asset->originalFilename
  }`,
  { id }
);

console.log("\n===== ÉQUINOXE =====");
console.dir(check, { depth: 5 });
console.log("\n✓ Fiche Équinoxe montée");
