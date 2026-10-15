import fs from "node:fs";
import { createClient } from "@sanity/client";
import { normalizeBottleImage } from "./lib/normalize-bottle-image.mjs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

if (!process.env.SANITY_API_WRITE_TOKEN) {
  throw new Error("SANITY_API_WRITE_TOKEN manquant");
}

const folder = "public/images/lpv/photos bouteilles";
const finalFolder = `${folder}/pinard-final`;

fs.mkdirSync(finalFolder, { recursive: true });

const ref = (id, key) => ({
  _type: "reference",
  _ref: id,
  ...(key ? { _key: key } : {}),
});

const metadata = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([field, value]) => [
      field,
      {
        confidence: value === null ? 0 : 0.9,
        source: value === null ? "inferred" : "tasting",
      },
    ])
  );

async function ensureGrape(id, name) {
  await client.createIfNotExists({
    _id: id,
    _type: "grape",
    name,
    slug: {
      _type: "slug",
      current: id.replace(/^grape-/, ""),
    },
  });
}

async function uploadNormalized(source, filename) {
  if (!fs.existsSync(source)) {
    throw new Error(`Image introuvable : ${source}`);
  }

  const normalized = await normalizeBottleImage(
    fs.readFileSync(source)
  );

  const output = `${finalFolder}/${filename}`;
  fs.writeFileSync(output, normalized.buffer);

  const asset = await client.assets.upload(
    "image",
    normalized.buffer,
    {
      filename,
      contentType: "image/png",
    }
  );

  console.log(
    `✓ Image ${filename} | ${normalized.width} × ${normalized.height}`
  );

  return {
    _type: "image",
    asset: ref(asset._id),
  };
}

function cleanDocument(doc) {
  return Object.fromEntries(
    Object.entries(doc).filter(
      ([key]) => !key.startsWith("_") || key === "_type"
    )
  );
}

async function publishWine(id, data) {
  const draftId = `drafts.${id}`;

  const [published, draft] = await Promise.all([
    client.getDocument(id),
    client.getDocument(draftId),
  ]);

  const base = draft || published || {};

  const document = {
    ...cleanDocument(base),
    ...data,
    _id: id,
    _type: "wine",
  };

  await client.createOrReplace(document);

  if (draft) {
    await client.delete(draftId);
  }

  console.log(`✓ Publié : ${data.name} ${data.vintage}`);
}

async function main() {
  const producer = await client.getDocument(
    "producer-pinard-et-filles"
  );

  if (!producer) {
    throw new Error("Producteur Pinard et Filles introuvable");
  }

  const john = await client.getDocument(
    "wine-john-doe-2025"
  );

  if (!john?.bottleImage?.asset?._ref) {
    throw new Error(
      "John Doe doit conserver son image existante"
    );
  }

  const country = ref(
    "d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"
  );

  const appellation = ref(
    "2acd9265-a02e-4b7c-a803-e702742f10cc"
  );

  const producerRef = ref("producer-pinard-et-filles");

  const janeImage = await uploadNormalized(
    `${folder}/janedoeSAQ.png`,
    "pinard-jane-doe-2024.png"
  );

  const irisImage = await uploadNormalized(
    `${folder}/irisSAQ.png`,
    "pinard-iris-de-doe-2025.png"
  );

  await ensureGrape("grape-siegerrebe", "Siegerrebe");

  const janeProfile = {
    body: 2,
    sweetness: 1,
    roundness: 2,
    acidity: 4,
    tannins: 1,
    fruitIntensity: 4,
    minerality: null,
    intensity: 3,
    complexity: 3,
    oakInfluence: 1,
    savory: 1,
  };

  const irisProfile = {
    body: 2,
    sweetness: 1,
    roundness: 3,
    acidity: 4,
    tannins: 1,
    fruitIntensity: 4,
    minerality: null,
    intensity: 3,
    complexity: 2,
    oakInfluence: 1,
    savory: 1,
  };

  await publishWine("wine-pinard-jane-doe-2024", {
    name: "Jane Doe",
    slug: {
      _type: "slug",
      current: "pinard-jane-doe-2024",
    },
    vintage: 2024,
    beverageType: "wine",
    color: "white",
    published: true,
    producer: producerRef,
    country,
    region: ref("region-lanaudiere"),
    appellation,
    grapes: [
      ref("grape-la-crescent", "la-crescent"),
      ref("grape-itasca", "itasca"),
      ref("grape-frontenac-gris", "frontenac-gris"),
      ref("grape-siegerrebe", "siegerrebe"),
    ],
    bottleImage: janeImage,
    bottleSize: "750 ml",
    alcohol: 11.5,
    sugar: "<1,2 g/L",
    isNatural: true,
    approxPrice: 31.25,
    purchaseChannel: "saq",
    purchaseUrl: "https://www.saq.com/fr/15568328",
    purchaseLastChecked: "2026-10-14",
    purchaseDetails:
      "SAQ. Disponibilité variable selon les succursales et les arrivages.",
    servingTemperature: "6–8 °C",
    decant: false,

    oneLiner:
      "Un blanc québécois vif et lumineux, entre fruits à chair jaune, fleurs blanches et fraîcheur.",
    oneLinerEn:
      "A bright, lively Quebec white with yellow fruit, white flowers and refreshing acidity.",

    tastingKeywords: [
      "ananas",
      "pêche",
      "miel",
      "fleurs blanches",
    ],
    tastingKeywordsEn: [
      "pineapple",
      "peach",
      "honey",
      "white flowers",
    ],

    perfectFor: [
      "apéro",
      "fruits de mer",
      "fromages",
      "repas entre amis",
    ],
    perfectForEn: [
      "aperitif",
      "seafood",
      "cheese",
      "dinner with friends",
    ],

    whyWeRecommend:
      "Jane Doe montre une autre facette des cépages nordiques. Son fruit généreux et sa fraîcheur vive donnent un blanc expressif qui garde beaucoup d’élan en bouche.",
    whyWeRecommendEn:
      "Jane Doe reveals another side of northern grape varieties. Generous fruit and vibrant acidity make for an expressive white with plenty of energy.",

    ...janeProfile,
    dnaMetadata: metadata(janeProfile),
  });

  await publishWine("wine-pinard-iris-de-doe-2025", {
    name: "Iris de Doe",
    slug: {
      _type: "slug",
      current: "pinard-iris-de-doe-2025",
    },
    vintage: 2025,
    beverageType: "wine",
    color: "rose",
    published: true,
    producer: producerRef,
    country,
    region: ref(
      "55a9fe9a-b3fe-41d6-8145-6adca1a818a8"
    ),
    appellation,
    grapes: [
      ref("grape-frontenac-gris", "frontenac-gris"),
      ref("grape-itasca", "itasca"),
      ref("grape-la-crescent", "la-crescent"),
    ],
    bottleImage: irisImage,
    bottleSize: "750 ml",
    alcohol: 12,
    sugar: "1,5 g/L",
    approxPrice: 31.75,
    purchaseChannel: "saq",
    purchaseUrl: "https://www.saq.com/fr/15656125",
    purchaseLastChecked: "2026-10-14",
    purchaseDetails:
      "SAQ. Disponibilité variable selon les succursales et les arrivages.",
    servingTemperature: "6–8 °C",
    decant: false,

    oneLiner:
      "Un rosé québécois sec et éclatant, porté par la fraise, la cerise et une acidité vive.",
    oneLinerEn:
      "A vibrant, dry Quebec rosé with strawberry, cherry and lively acidity.",

    tastingKeywords: [
      "fraise",
      "cerise",
      "canneberge",
      "pivoine",
    ],
    tastingKeywordsEn: [
      "strawberry",
      "cherry",
      "cranberry",
      "peony",
    ],

    perfectFor: [
      "apéro",
      "poisson grillé",
      "salade estivale",
      "table entre amis",
    ],
    perfectForEn: [
      "aperitif",
      "grilled fish",
      "summer salad",
      "gathering with friends",
    ],

    whyWeRecommend:
      "Iris de Doe rappelle qu’un rosé peut être léger sans manquer de caractère. Les petits fruits rouges, la fraîcheur et la bouche généreuse en font une cuvée particulièrement conviviale.",
    whyWeRecommendEn:
      "Iris de Doe shows that a rosé can be light without losing character. Red berries, freshness and a generous palate make it an especially welcoming wine.",

    ...irisProfile,
    dnaMetadata: metadata(irisProfile),
  });

  await client.patch("wine-john-doe-2025").set({
    beverageType: "wine",
    whyWeRecommend:
      john.whyWeRecommend?.replaceAll(
        "Pinardet Filles",
        "Pinard et Filles"
      ),
  }).commit();

  console.log("✓ John Doe conservé et vérifié");

  const result = await client.fetch(`
    *[
      _type == "wine" &&
      producer._ref == "producer-pinard-et-filles" &&
      published == true
    ] | order(name asc) {
      _id,
      name,
      vintage,
      published,
      "hasImage": defined(bottleImage.asset._ref),
      "hasPurchaseUrl": defined(purchaseUrl),
      "hasProfile": defined(body) && defined(acidity)
    }
  `);

  console.log("\n=== VINS PINARD PUBLIÉS ===");
  console.table(result);

  if (result.length !== 3) {
    console.warn(
      `Attention : ${result.length} vins publiés trouvés, 3 attendus.`
    );
  }

  console.log("\n✓ Autres cuvées laissées en brouillon");
}

main().catch((error) => {
  console.error("\nERREUR :", error);
  process.exitCode = 1;
});
