import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const producerId = "producer-vignoble-de-la-bauge";
const photoFolder = "public/images/lpv/photos bouteilles";

const ref = (id, key) => ({
  _type: "reference",
  _ref: id,
  ...(key ? { _key: key } : {}),
});

const block = (text, key) => ({
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
});

const dimensions = [
  "body",
  "sweetness",
  "roundness",
  "acidity",
  "tannins",
  "fruitIntensity",
  "minerality",
  "intensity",
  "complexity",
  "oakInfluence",
  "savory",
];

const wines = [
  {
    id: "wine-bauge-les-beaux-jus-le-blanc",
    name: "Les Beaux Jus Le Blanc",
    slug: "vignoble-de-la-bauge-les-beaux-jus-le-blanc",
    file: "le-blanc-bauge.jpg",
    color: "white",
    grapes: [],
    style: "Blanc nature, frais et expressif",
    description:
      "Un blanc de la gamme Les Beaux Jus qui reflète l’approche naturelle du Vignoble de la Bauge.",
    descriptionEn:
      "A white wine from the Les Beaux Jus range, reflecting Vignoble de la Bauge’s natural winemaking approach.",
    profile: [2,1,2,4,1,3,3,3,3,1,2],
  },
  {
    id: "wine-bauge-les-beaux-jus-le-rouge",
    name: "Les Beaux Jus Le Rouge",
    slug: "vignoble-de-la-bauge-les-beaux-jus-le-rouge",
    file: "le-rouge-bauge.jpg",
    color: "red",
    grapes: [],
    style: "Rouge nature, fruité et vivant",
    description:
      "Un rouge de la gamme Les Beaux Jus qui permet de découvrir l’expression du vignoble.",
    descriptionEn:
      "A red wine from the Les Beaux Jus range, offering an introduction to the vineyard’s style.",
    profile: [3,1,3,4,2,4,2,3,3,1,2],
  },
  {
    id: "wine-bauge-la-renversante",
    name: "La Renversante",
    slug: "vignoble-de-la-bauge-la-renversante",
    file: "la-renversante-1-bauge.jpg",
    color: "orange",
    grapes: [
      "grape-frontenac-blanc",
      "grape-frontenac-gris",
    ],
    style: "Vin orange de macération",
    description:
      "Une cuvée de macération qui montre le côté explorateur de La Bauge.",
    descriptionEn:
      "A skin-contact wine highlighting La Bauge’s experimental spirit.",
    profile: [3,1,3,4,2,4,2,4,4,1,3],
  },
  {
    id: "wine-bauge-trois-frontenacs",
    name: "Les Beaux Jus 3 Frontenacs",
    slug: "vignoble-de-la-bauge-trois-frontenacs",
    file: "3-frontenacs-1-bauge.jpg",
    color: "red",
    grapes: [
      "grape-frontenac-blanc",
      "grape-frontenac-gris",
      "grape-frontenac-noir",
    ],
    style: "Rouge nature issu de trois Frontenacs",
    description:
      "Une cuvée qui réunit trois expressions du Frontenac, cépage emblématique de la viticulture nordique.",
    descriptionEn:
      "A wine bringing together three expressions of Frontenac, a signature grape of northern viticulture.",
    profile: [3,1,3,4,2,4,2,4,3,1,3],
  },
  {
    id: "wine-bauge-vidal-sassume",
    name: "Vidal s’assume !",
    slug: "vignoble-de-la-bauge-vidal-sassume",
    file: "vidal-sassume-1-bauge.jpg",
    color: "white",
    grapes: [
      "grape-vidal",
      "grape-savagnin",
    ],
    style: "Blanc sec, vif et texturé",
    description:
      "Un blanc qui explore le potentiel du Vidal, avec une touche de Savagnin dans le millésime 2023 documenté par le producteur.",
    descriptionEn:
      "A dry white exploring Vidal’s potential, with a touch of Savagnin in the producer’s documented 2023 vintage.",
    profile: [2,1,2,4,1,3,3,3,3,1,2],
  },
];

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN manquant");
  }

  const producer = await client.getDocument(producerId);

  if (!producer) {
    throw new Error("Producteur La Bauge introuvable");
  }

  const files = wines.map(w => `${photoFolder}/${w.file}`);

  for (const file of files) {
    if (!fs.existsSync(file)) {
      throw new Error(`Photo manquante : ${file}`);
    }
  }

  const existing = await client.fetch(
    `*[_type == "wine" && (
      _id in $ids ||
      slug.current in $slugs
    )]{_id,name,"slug":slug.current}`,
    {
      ids: wines.map(w => w.id),
      slugs: wines.map(w => w.slug),
    }
  );

  const unexpected = existing.filter(
    w => !wines.some(item => item.id === w._id)
  );

  if (unexpected.length) {
    console.dir(unexpected);
    throw new Error("STOP : des fiches existantes pourraient créer des doublons");
  }

  const grapeIds = [...new Set(wines.flatMap(w => w.grapes))];

  const availableGrapes = await client.fetch(
    `*[_type == "grape" && _id in $ids]._id`,
    { ids: grapeIds }
  );

  for (const id of grapeIds) {
    if (!availableGrapes.includes(id)) {
      throw new Error(`Cépage absent de Sanity : ${id}`);
    }
  }

  for (const wine of wines) {
    const existingWine = await client.getDocument(wine.id);

    const asset = await client.assets.upload(
      "image",
      fs.createReadStream(`${photoFolder}/${wine.file}`),
      { filename: `lpv-${wine.slug}.jpg` }
    );

    const profile = Object.fromEntries(
      dimensions.map((dimension, index) => [
        dimension,
        wine.profile[index],
      ])
    );

    const dnaMetadata = Object.fromEntries(
      dimensions.map(dimension => [
        dimension,
        {
          confidence: 0.45,
          source: "inferred",
        },
      ])
    );

    const document = {
      _id: wine.id,
      _type: "wine",
      name: wine.name,
      slug: {
        _type: "slug",
        current: wine.slug,
      },
      producer: ref(producerId),
      country: ref("d9fc0ce6-5f30-4e00-8bc5-63146a0a6407"),
      region: ref("55a9fe9a-b3fe-41d6-8145-6adca1a818a8"),
      color: wine.color,
      style: wine.style,
      description: wine.description,
      descriptionEn: wine.descriptionEn,
      bottleImage: {
        _type: "image",
        asset: ref(asset._id),
      },
      grapes: wine.grapes.map((id, index) =>
        ref(id, `bauge-${index}`)
      ),
      ...profile,
      dnaMetadata,
      published: true,
    };

    if (existingWine) {
      await client.patch(wine.id).set(document).commit();
      console.log(`✓ Vin mis à jour : ${wine.name}`);
    } else {
      await client.create(document);
      console.log(`✓ Vin créé : ${wine.name}`);
    }
  }

  await client.patch(producerId).set({
    foundedYear: 1986,
    mediaPermissionStatus: "authorized_by_producer",
    mediaCredit: "Vignoble de la Bauge",
    secondaryImageCredit: "Vignoble de la Bauge",

    bio: [
      block(
        "La Bauge fait partie des pionniers du vin québécois. En 1986, Alcide et Ghislaine Naud fondent leur vignoble à Brigham, dans les Cantons-de-l’Est. Leur fils Simon reprend le domaine en 1996. Depuis, il n’a jamais cessé de faire évoluer cette histoire familiale.",
        "bauge-bio-fr-1"
      ),
      block(
        "Sur les 8,5 hectares du domaine, les vignes côtoient les animaux et une foule d’autres formes de vie. Certifié biologique depuis 2019, La Bauge est devenu en 2024 le premier vignoble canadien à obtenir la certification Regenerative Organic Certified. Simon poursuit cette démarche jusque dans ses vins nature, avec l’envie de laisser le raisin s’exprimer le plus librement possible.",
        "bauge-bio-fr-2"
      ),
    ],

    bioEn: [
      block(
        "La Bauge is one of Quebec’s wine pioneers. In 1986, Alcide and Ghislaine Naud founded their vineyard in Brigham, in the Eastern Townships. Their son Simon took over in 1996 and has continued to shape the family estate ever since.",
        "bauge-bio-en-1"
      ),
      block(
        "Across the estate’s 8.5 hectares, vines share the land with animals and a thriving ecosystem. Certified organic since 2019, La Bauge became Canada’s first vineyard to earn Regenerative Organic Certified status in 2024. Simon carries that philosophy into the cellar through natural wines that aim to express the grapes as freely as possible.",
        "bauge-bio-en-2"
      ),
    ],

    oneLiner:
      "À Brigham, Simon Naud fait évoluer le vignoble familial depuis 1996, avec une conviction profonde que le vin commence par la santé de la terre.",

    oneLinerEn:
      "In Brigham, Simon Naud has been shaping his family’s vineyard since 1996, guided by the belief that great wine begins with healthy soil.",
  }).commit();

  console.log("\n✓ Fiche producteur enrichie");
  console.log("✓ Photos producteur autorisées");
  console.log("✓ Cinq vins liés au producteur");
  console.log("✓ Profils DATA LPV provisoires enregistrés");
  console.log("\nÀ vérifier visuellement : détourage des bouteilles et rendu des fiches.");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
