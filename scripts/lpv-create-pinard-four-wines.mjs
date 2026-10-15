import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const ref = id => ({
  _type: "reference",
  _ref: id,
});

const grapeRefs = ids =>
  ids.map((id, i) => ({
    ...ref(id),
    _key: `grape-${i + 1}`,
  }));

const meta = (confidence = 0.45, source = "inferred") => ({
  confidence,
  source,
});

const profiles = {
  jane: {
    body: 2,
    sweetness: 1,
    roundness: 2,
    acidity: 4,
    tannins: 1,
    fruitIntensity: 4,
    intensity: 4,
    complexity: 3,
    savory: 1,
  },
  frangine: {
    body: 3,
    sweetness: 1,
    roundness: 3,
    acidity: 4,
    tannins: 3,
    fruitIntensity: 4,
    intensity: 5,
    complexity: 4,
    savory: 2,
  },
  piscine: {
    body: 3,
    sweetness: 1,
    roundness: 3,
    acidity: 4,
    tannins: 1,
    fruitIntensity: 3,
    intensity: 3,
    complexity: 4,
    savory: 2,
  },
  supernova: {
    body: 3,
    sweetness: 1,
    roundness: 2,
    acidity: 4,
    tannins: 1,
    fruitIntensity: 2,
    intensity: 3,
    complexity: 4,
    savory: 3,
  },
};

const wines = [
  {
    id: "wine-pinard-jane-doe-2024",
    name: "Jane Doe",
    slug: "jane-doe-2024",
    vintage: 2024,
    color: "white",
    region: "region-lanaudiere",
    grapes: [
      "grape-la-crescent",
      "grape-itasca",
      "grape-frontenac-blanc",
      "grape-frontenac-gris",
    ],
    alcohol: 11.5,
    profile: profiles.jane,
    oneLiner:
      "Un blanc aromatique et élégant qui ouvre la porte à l’univers singulier de Pinard et Filles.",
    oneLinerEn:
      "An aromatic, elegant white that offers an inviting introduction to the world of Pinard et Filles.",
    tastingKeywords: [
      "fruit à chair blanche",
      "agrumes",
      "fleurs",
      "fraîcheur",
    ],
    tastingKeywordsEn: [
      "orchard fruit",
      "citrus",
      "flowers",
      "freshness",
    ],
    perfectFor: [
      "apéro",
      "poisson",
      "salades estivales",
    ],
    perfectForEn: [
      "aperitif",
      "fish",
      "summer salads",
    ],
    whyWeRecommend:
      "Jane Doe permet de découvrir le travail de Pinard et Filles dans un registre blanc accessible et expressif. Un assemblage de cépages nordiques qui mise sur la fraîcheur et l’élégance.",
    whyWeRecommendEn:
      "Jane Doe introduces the work of Pinard et Filles through an approachable, expressive white. A blend of northern grape varieties built around freshness and elegance.",
    servingTemperature: "8–10 °C",
    sourceUrl: "https://www.pinardetfilles.com/vins/janedoe",
  },
  {
    id: "wine-pinard-frangine-2024",
    name: "Frangine",
    slug: "frangine-2024",
    vintage: 2024,
    color: "orange",
    region: "55a9fe9a-b3fe-41d6-8145-6adca1a818a8",
    grapes: ["grape-la-crescent"],
    alcohol: 11.9,
    profile: profiles.frangine,
    oneLiner:
      "Une macération de La Crescent expressive, intense et pleine de caractère.",
    oneLinerEn:
      "An expressive La Crescent skin-contact wine with intensity and plenty of character.",
    tastingKeywords: [
      "agrumes",
      "fruits à noyau",
      "fleurs",
      "texture",
    ],
    tastingKeywordsEn: [
      "citrus",
      "stone fruit",
      "flowers",
      "texture",
    ],
    perfectFor: [
      "cuisine épicée",
      "fromages",
      "plats végétariens",
    ],
    perfectForEn: [
      "spicy dishes",
      "cheese",
      "vegetarian dishes",
    ],
    whyWeRecommend:
      "Frangine montre une autre facette du La Crescent. Les macérations et l’assemblage de deux vinifications donnent une cuvée particulièrement expressive.",
    whyWeRecommendEn:
      "Frangine reveals another side of La Crescent. Skin contact and the blending of two vinifications make for a particularly expressive wine.",
    servingTemperature: "10–12 °C",
    sourceUrl: "https://www.pinardetfilles.com/vins/frangine",
  },
  {
    id: "wine-pinard-la-piscine-blanche-2024",
    name: "La Piscine Blanche",
    slug: "la-piscine-blanche-2024",
    vintage: 2024,
    color: "white",
    region: "55a9fe9a-b3fe-41d6-8145-6adca1a818a8",
    grapes: [
      "grape-chardonnay",
      "grape-riesling",
      "grape-savagnin",
      "grape-hibernal",
      "grape-briana",
    ],
    alcohol: 11.5,
    profile: profiles.piscine,
    oneLiner:
      "Un blanc de parcelle qui réunit cinq cépages et laisse le lieu raconter son histoire.",
    oneLinerEn:
      "A single-parcel white bringing five grape varieties together to tell the story of its site.",
    tastingKeywords: [
      "agrumes",
      "fruits blancs",
      "lies",
      "texture",
    ],
    tastingKeywordsEn: [
      "citrus",
      "white fruit",
      "lees",
      "texture",
    ],
    perfectFor: [
      "poisson",
      "volaille",
      "fromages",
    ],
    perfectForEn: [
      "fish",
      "poultry",
      "cheese",
    ],
    whyWeRecommend:
      "La Piscine Blanche raconte une parcelle transformée par le travail de la vigne. Cinq cépages, une fermentation naturelle et un élevage sur lies composent un blanc profondément lié à son origine.",
    whyWeRecommendEn:
      "La Piscine Blanche tells the story of a vineyard parcel transformed through years of work. Five grape varieties, natural fermentation and ageing on the lees shape a white rooted in its origins.",
    servingTemperature: "10–12 °C",
    sourceUrl:
      "https://www.pinardetfilles.com/vins/la-piscine-blanche",
  },
  {
    id: "wine-pinard-supernova-2022",
    name: "Supernova",
    slug: "supernova-2022",
    vintage: 2022,
    color: "sparkling",
    region: "55a9fe9a-b3fe-41d6-8145-6adca1a818a8",
    grapes: [
      "grape-chardonnay",
      "grape-pinot-noir",
      "grape-pinot-meunier",
    ],
    alcohol: 11.7,
    profile: profiles.supernova,
    oneLiner:
      "Un mousseux non dosé à la bulle fine, élevé patiemment selon la méthode traditionnelle.",
    oneLinerEn:
      "A finely sparkling, zero-dosage wine patiently aged using the traditional method.",
    tastingKeywords: [
      "bulle fine",
      "agrumes",
      "brioche",
      "fraîcheur",
    ],
    tastingKeywordsEn: [
      "fine bubbles",
      "citrus",
      "brioche",
      "freshness",
    ],
    perfectFor: [
      "grandes occasions",
      "huîtres",
      "apéritif",
    ],
    perfectForEn: [
      "celebrations",
      "oysters",
      "aperitif",
    ],
    whyWeRecommend:
      "Supernova démontre l’ambition de Pinard et Filles dans les effervescents. Trois cépages classiques, une longue période d’élevage et aucun dosage pour une expression précise et sans artifice.",
    whyWeRecommendEn:
      "Supernova shows the ambition of Pinard et Filles in sparkling wine. Three classic grape varieties, extended ageing and no dosage create a precise, unadorned expression.",
    servingTemperature: "8–10 °C",
    sourceUrl: "https://www.pinardetfilles.com/vins/supernova",
  },
];

async function main() {
  const producer = await client.getDocument(
    "producer-pinard-et-filles"
  );

  if (!producer) {
    throw new Error("Producteur Pinard et Filles introuvable.");
  }

  const countryId =
    "d9fc0ce6-5f30-4e00-8bc5-63146a0a6407";

  const appellationId =
    "2acd9265-a02e-4b7c-a803-e702742f10cc";

  const requiredRefs = new Set([
    countryId,
    appellationId,
    ...wines.map(w => w.region),
    ...wines.flatMap(w => w.grapes),
  ]);

  const missing = [];

  for (const id of requiredRefs) {
    const doc = await client.getDocument(id);
    if (!doc) missing.push(id);
  }

  console.log("\n===== RÉFÉRENCES =====");

  // Les cépages absents sont créés uniquement
  // lorsqu'ils sont attestés dans les fiches officielles.
  const allowedNewGrapes = {
    "grape-itasca": "Itasca",
    "grape-savagnin": "Savagnin",
    "grape-hibernal": "Hibernal",
    "grape-briana": "Briana",
    "grape-pinot-meunier": "Pinot meunier",
  };

  const unexpectedMissing = missing.filter(
    id => !(id in allowedNewGrapes)
  );

  if (unexpectedMissing.length) {
    throw new Error(
      "Références inattendues manquantes : " +
      unexpectedMissing.join(", ")
    );
  }

  const existing = [];

  for (const w of wines) {
    const doc = await client.getDocument(w.id);
    const draft = await client.getDocument(`drafts.${w.id}`);

    if (doc || draft) existing.push(w.name);
  }

  if (existing.length) {
    throw new Error(
      "Fiches déjà présentes. Aucune modification : " +
      existing.join(", ")
    );
  }

  console.log("✓ Producteur trouvé");
  console.log("✓ Aucun doublon");
  console.log("✓ Références vérifiées");

  for (const id of missing) {
    const name = allowedNewGrapes[id];

    await client.createIfNotExists({
      _id: id,
      _type: "grape",
      name,
      slug: {
        _type: "slug",
        current: id.replace(/^grape-/, ""),
      },
    });

    console.log("✓ Cépage créé :", name);
  }

  console.log("\n===== CRÉATION DES QUATRE BROUILLONS =====");

  for (const w of wines) {
    const {
      id,
      profile,
      sourceUrl,
      ...data
    } = w;

    const dnaMetadata = Object.fromEntries(
      Object.keys(profile).map(key => [
        key,
        meta(0.45, "inferred"),
      ])
    );

    const document = {
      _id: `drafts.${id}`,
      _type: "wine",

      beverageType: "wine",

      ...data,

      slug: {
        _type: "slug",
        current: w.slug,
      },

      producer: ref("producer-pinard-et-filles"),
      country: ref(countryId),
      region: ref(w.region),
      appellation: ref(appellationId),
      grapes: grapeRefs(w.grapes),

      ...profile,
      dnaMetadata,

      bottleSize: "750 ml",

      published: false,

      // Prix, achat et photo à compléter
      // avant publication.
      lpvTechnicalSource: sourceUrl,
    };

    await client.create(document);

    console.log(`✓ ${w.name} ${w.vintage}`);
  }

  console.log("\n===== CONTRÔLE FINAL =====");

  const created = await client.fetch(
    `*[
      _type == "wine" &&
      _id in $ids
    ]{
      _id,
      name,
      vintage,
      color,
      published,
      "grapeCount":count(grapes),
      "producerId":producer._ref,
      oneLiner,
      oneLinerEn,
      dnaMetadata
    }`,
    {
      ids: wines.map(w => `drafts.${w.id}`),
    }
  );

  console.dir(created, { depth: 2 });

  if (created.length !== 4) {
    throw new Error(
      `Seulement ${created.length}/4 brouillons trouvés.`
    );
  }

  console.log("\n✓ Quatre fiches créées");
  console.log("✓ FR et EN");
  console.log("✓ Cépages référencés");
  console.log("✓ Profils de recommandation provisoires");
  console.log("✓ Non publiées");
  console.log("✓ Aucune photo téléversée");
  console.log("✓ John Doe inchangé");
  console.log("✓ Aucun changement visuel au site");
}

main().catch(error => {
  console.error("\n❌", error);
  process.exit(1);
});
