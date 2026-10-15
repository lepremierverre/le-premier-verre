import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const id = "producer-maison-agricole-joy-hill";

const heroPath = "public/images/lpv/producteurs/joyhill2.webp";
const secondaryPath = "public/images/lpv/producteurs/joyhill1.png";

const ref = (_ref, _key) => ({
  _type: "reference",
  _ref,
  _key,
});

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN manquant");
  }

  for (const path of [heroPath, secondaryPath]) {
    if (!fs.existsSync(path)) {
      throw new Error(`Photo introuvable : ${path}`);
    }
  }

  const existing = await client.getDocument(id);

  if (!existing) {
    throw new Error("Document Joy Hill introuvable");
  }

  const example = await client.fetch(`
    *[_type == "producer" && slug.current == "ferme-cidricole-equinoxe"][0]{
      approach,
      approachEn,
      bio,
      bioEn
    }
  `);

  console.log("Structure éditoriale existante");
  console.dir(example, { depth: 5 });

  if (
    !Array.isArray(example?.approach) ||
    !example.approach.length ||
    !Array.isArray(example?.bio)
  ) {
    throw new Error(
      "Structure des textes non confirmée. Aucun changement effectué."
    );
  }

  const approachExample = example.approach[0];

  const titleField =
    "title" in approachExample ? "title" :
    "heading" in approachExample ? "heading" :
    null;

  const bodyField =
    "text" in approachExample ? "text" :
    "body" in approachExample ? "body" :
    "description" in approachExample ? "description" :
    null;

  if (!titleField || !bodyField) {
    throw new Error(
      "Structure des cartes inconnue. Aucun changement effectué."
    );
  }

  const makeApproach = (entries, prefix) =>
    entries.map(([title, body], i) => ({
      _type: approachExample._type,
      _key: `${prefix}-${i + 1}`,
      [titleField]: title,
      [bodyField]: body,
    }));

  const frApproach = makeApproach([
    [
      "Des cépages européens au Québec",
      "Joy Hill cultive notamment du gamay, du riesling et du grüner veltliner. Le domaine a choisi des variétés qu’il aime boire et qu’il souhaite voir s’exprimer sur les hauteurs de Frelighsburg.",
    ],
    [
      "Tout en haut de la côte",
      "Le vignoble se trouve à environ 300 mètres d’altitude, sur un terrain orienté plein sud. Son sol caillouteux assure un bon drainage et se réchauffe rapidement.",
    ],
    [
      "Des vins peu interventionnistes",
      "Au chai, Joy Hill privilégie les fermentations naturelles et limite les intrants. Les rouges passent notamment par des macérations carboniques ou semi-carboniques.",
    ],
  ], "joy-fr");

  const enApproach = makeApproach([
    [
      "European grape varieties in Quebec",
      "Joy Hill grows Gamay, Riesling and Grüner Veltliner, among other varieties. The team chose grapes they love drinking and wanted to see thrive on the hills of Frelighsburg.",
    ],
    [
      "At the top of the hill",
      "The vineyard sits around 300 metres above sea level on a south-facing slope. Its rocky soil drains well and warms up quickly.",
    ],
    [
      "A low-intervention approach",
      "In the cellar, Joy Hill favours natural fermentations and minimal additives. Red wines are often made using carbonic or semi-carbonic maceration.",
    ],
  ], "joy-en");

  const grapeNames = [
    "Chardonnay",
    "Gamay",
    "Grüner Veltliner",
    "Melon de Bourgogne",
    "Pinot blanc",
    "Riesling",
  ];

  const grapes = await client.fetch(`
    *[_type == "grape" && name in $names]{
      _id,
      name
    }
  `, { names: grapeNames });

  if (grapes.length !== grapeNames.length) {
    throw new Error(
      "Références de cépages incomplètes. Aucun changement effectué."
    );
  }

  const hero = await client.assets.upload(
    "image",
    fs.createReadStream(heroPath),
    { filename: "joy-hill-hero.webp" }
  );

  const secondary = await client.assets.upload(
    "image",
    fs.createReadStream(secondaryPath),
    { filename: "joy-hill-secondary.png" }
  );

  const patch = {
    name: "Maison agricole Joy Hill",
    slug: {
      _type: "slug",
      current: "maison-agricole-joy-hill",
    },
    published: true,
    lpvPartner: true,
    producerType: "winery",
    municipality: "Frelighsburg",
    address: "85, chemin Richford, Frelighsburg, Québec",
    foundedYear: 2017,
    website: "https://maisonjoyhill.com/",
    country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
    region: ref("55a9fe9a-b3fe-41d6-8145-6adca1a818a8"),

    openToVisitors: true,
    reservationRequired: false,

    oneLiner:
      "À Frelighsburg, Justine et Julien cultivent des cépages européens sur les hauteurs de Joy Hill et produisent des vins naturels bien ancrés dans leur coin de pays.",

    oneLinerEn:
      "In Frelighsburg, Justine and Julien grow European grape varieties on the slopes of Joy Hill, making natural wines rooted in their corner of Quebec.",

    bio: [
      "Tout en haut de la côte Joy Hill, Justine Therrien et Julien Niquet ont planté leurs premières vignes en 2017. Entre 2017 et 2019, ils ont mis en terre 37 000 ceps sur un terrain exposé plein sud, à environ 300 mètres d’altitude.",
      "Leur choix s’est porté sur des cépages européens comme le gamay, le chardonnay, le riesling et le blaufränkisch. Au chai, ils privilégient les fermentations naturelles et les interventions limitées pour laisser le raisin et le millésime s’exprimer.",
    ],

    bioEn: [
      "At the top of Joy Hill, Justine Therrien and Julien Niquet planted their first vines in 2017. Between 2017 and 2019, they planted 37,000 vines on a south-facing site roughly 300 metres above sea level.",
      "They chose European varieties such as Gamay, Chardonnay, Riesling and Blaufränkisch. In the cellar, they favour natural fermentations and minimal intervention, allowing the grapes and each vintage to speak for themselves.",
    ],

    approach: frApproach,
    approachEn: enApproach,

    whyWeFollow:
      "Parce que Joy Hill montre une autre facette du vin québécois. Justine et Julien ont choisi de travailler avec des cépages européens et de les laisser s’exprimer dans les conditions bien particulières de Frelighsburg. On a envie de suivre leur évolution d’un millésime à l’autre.",

    whyWeFollowEn:
      "Because Joy Hill offers another perspective on Quebec wine. Justine and Julien chose European varieties and let them express themselves in the distinctive conditions of Frelighsburg. We look forward to seeing how their wines evolve from one vintage to the next.",

    visitDetails:
      "Joy Hill accueille les visiteurs à sa boutique et sur sa terrasse pendant la saison d’ouverture. On peut y découvrir les cuvées du moment, participer à une dégustation ou simplement prendre un verre sur place. La boutique et la terrasse sont actuellement fermées pour la saison 2026, avec un retour annoncé au printemps 2027. Les groupes de plus de dix personnes sont invités à réserver.",

    visitDetailsEn:
      "Joy Hill welcomes visitors to its shop and terrace during the opening season. Guests can discover current releases, enjoy a tasting or simply have a glass on site. The shop and terrace are currently closed for the 2026 season, with reopening planned for spring 2027. Groups of more than ten should book ahead.",

    signatureGrapes: grapes.map((grape, i) =>
      ref(grape._id, `joy-grape-${i}`)
    ),

    heroImage: {
      _type: "image",
      asset: ref(hero._id),
    },

    secondaryImage: {
      _type: "image",
      asset: ref(secondary._id),
    },

    mediaCredit: "Maison agricole Joy Hill",
    secondaryImageCredit: "Maison agricole Joy Hill",

    seoTitle: "Maison agricole Joy Hill | Le Premier Verre",
    seoTitleEn: "Maison agricole Joy Hill | Le Premier Verre",

    seoDescription:
      "Découvrir Maison agricole Joy Hill à Frelighsburg, ses cépages européens, ses vins naturels et son vignoble perché sur les hauteurs des Cantons-de-l’Est.",

    seoDescriptionEn:
      "Discover Maison agricole Joy Hill in Frelighsburg, its European grape varieties, natural wines and hillside vineyard in Quebec’s Eastern Townships.",
  };

  await client.patch(id).set(patch).commit();

  const result = await client.getDocument(id);

  console.log("\n===== JOY HILL ENREGISTRÉ =====");
  console.log({
    id: result._id,
    name: result.name,
    published: result.published,
    municipality: result.municipality,
    hero: Boolean(result.heroImage),
    secondary: Boolean(result.secondaryImage),
    frenchBio: result.bio?.length,
    englishBio: result.bioEn?.length,
    grapes: result.signatureGrapes?.length,
    mediaPermissionStatus: result.mediaPermissionStatus ?? null,
  });

  console.log(
    "\nPhotos et textes enregistrés. Vérifier l'autorisation des visuels avant leur affichage public."
  );
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
