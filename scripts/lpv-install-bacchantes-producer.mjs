import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const PRODUCER_ID = "producer-les-bacchantes";

const folder = "public/images/lpv/photos bouteilles";

const heroPath = path.resolve(folder, "bacchantes1.jpg");
const secondaryPath = path.resolve(folder, "bacchantes2.jpg");

function paragraph(text, index) {
  return {
    _type: "block",
    _key: `bacchantes-${index}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `span-${index}`,
        marks: [],
        text,
      },
    ],
  };
}

function approach(items, prefix) {
  return items.map(([title, text], index) => ({
    _key: `${prefix}-${index + 1}`,
    title,
    text,
  }));
}

async function main() {
  console.log("\n===== LES BACCHANTES · INSTALLATION =====");

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("Token Sanity absent.");
  }

  for (const file of [heroPath, secondaryPath]) {
    if (!fs.existsSync(file)) {
      throw new Error(`Photo introuvable : ${file}`);
    }
  }

  console.log("✓ Deux photos trouvées");

  const existing = await client.getDocument(PRODUCER_ID);

  if (!existing) {
    throw new Error(
      "Document producer-les-bacchantes introuvable."
    );
  }

  if (existing.name !== "Les Bacchantes") {
    throw new Error(
      `Identité inattendue : ${existing.name}`
    );
  }

  const countries = await client.fetch(`
    *[_type == "country" && name match "Canada"]{
      _id,
      name
    }
  `);

  const regions = await client.fetch(`
    *[_type == "region" && name match "Montérégie"]{
      _id,
      name
    }
  `);

  const grapes = await client.fetch(`
    *[
      _type == "grape" &&
      name in [
        "Seyval blanc",
        "Seyval Blanc",
        "Vidal",
        "Marquette",
        "Pinot noir",
        "Pinot Noir"
      ]
    ]{
      _id,
      name
    }
  `);

  const canada = countries.find(
    (item) => item.name === "Canada"
  );

  const monteregie = regions.find(
    (item) => item.name === "Montérégie"
  );

  if (!canada || !monteregie) {
    throw new Error(
      "Référence Canada ou Montérégie introuvable. Aucune modification."
    );
  }

  const grapeNames = [
    ["Seyval blanc", "Seyval Blanc"],
    ["Vidal"],
    ["Marquette"],
    ["Pinot noir", "Pinot Noir"],
  ];

  const selectedGrapes = grapeNames.map((names) =>
    grapes.find((grape) => names.includes(grape.name))
  );

  if (selectedGrapes.some((grape) => !grape)) {
    console.log("Cépages disponibles :", grapes);
    throw new Error(
      "Un cépage manque dans Sanity. Aucune modification."
    );
  }

  console.log("✓ Canada");
  console.log("✓ Montérégie");
  console.log(
    "✓ Cépages :",
    selectedGrapes.map((grape) => grape.name).join(", ")
  );

  const bioFr = [
    "Les Bacchantes est né d’un projet familial porté par Sébastien Daoust et son père Jacques. Issus du monde des affaires, ils ont choisi de se lancer dans la viticulture avec une approche qui leur ressemble. Méthodique, réfléchie et attentive aux détails.",

    "À Hemmingford, cette rigueur se retrouve autant dans les vignes qu’au chai. Mais derrière les calculs et les décisions techniques, l’idée demeure profondément humaine. Créer des vins qui accompagnent les moments qu’on partage, sans compliquer le plaisir de les ouvrir.",
  ];

  const bioEn = [
    "Les Bacchantes began as a family project led by Sébastien Daoust and his father, Jacques. Coming from business backgrounds, they approached winemaking with a mindset that felt natural to them. Methodical, thoughtful and attentive to detail.",

    "In Hemmingford, that precision shapes the work both in the vineyard and in the cellar. Yet behind the planning and technical decisions lies a deeply human idea. Making wines that belong at the moments we share, without making the pleasure of opening a bottle complicated.",
  ];

  const approachFr = [
    [
      "Une histoire de famille",
      "Sébastien et Jacques Daoust ont imaginé le vignoble comme un projet commun. Aujourd’hui, Sébastien poursuit cette aventure familiale à Hemmingford.",
    ],
    [
      "Le goût de la précision",
      "Ici, les décisions se prennent avec méthode. De l’aménagement des vignes au travail au chai, chaque étape est pensée avec soin.",
    ],
    [
      "Des cuvées qui évoluent",
      "B1, B2, R1 ou M1. Les lettres et les chiffres racontent une gamme qui évolue, avec une attention constante portée à chaque vin.",
    ],
  ];

  const approachEn = [
    [
      "A family story",
      "Sébastien and Jacques Daoust envisioned the vineyard as a shared project. Today, Sébastien continues that family journey in Hemmingford.",
    ],
    [
      "A taste for precision",
      "Decisions here are made with care. From vineyard planning to cellar work, each step follows a thoughtful approach.",
    ],
    [
      "Wines that evolve",
      "B1, B2, R1 or M1. Letters and numbers reflect an evolving range and the attention given to every wine.",
    ],
  ];

  console.log("\n===== TÉLÉVERSEMENT PHOTOS =====");

  const heroAsset = await client.assets.upload(
    "image",
    fs.createReadStream(heroPath),
    {
      filename: "bacchantes-lpv-hero.jpg",
      contentType: "image/jpeg",
    }
  );

  console.log("✓ Photo principale :", heroAsset._id);

  const secondaryAsset = await client.assets.upload(
    "image",
    fs.createReadStream(secondaryPath),
    {
      filename: "bacchantes-lpv-secondary.jpg",
      contentType: "image/jpeg",
    }
  );

  console.log("✓ Deuxième photo :", secondaryAsset._id);

  const fields = {
    name: "Les Bacchantes",

    slug: {
      _type: "slug",
      current: "les-bacchantes",
    },

    municipality: "Hemmingford",

    address:
      "653, chemin Brownlee, Hemmingford, Québec J0L 1H0",

    phone: "514-652-2776",

    email: "info@lesbacchantes.com",

    website: "https://www.lesbacchantes.com/",

    country: {
      _type: "reference",
      _ref: canada._id,
    },

    region: {
      _type: "reference",
      _ref: monteregie._id,
    },

    lpvPartner: true,
    published: true,

    openToVisitors: true,
    reservationRequired: false,

    oneLiner:
      "À Hemmingford, un vignoble familial où chaque détail est réfléchi pour que le plaisir du vin, lui, reste simple.",

    oneLinerEn:
      "In Hemmingford, a family vineyard where every detail is carefully considered so that enjoying wine can remain beautifully simple.",

    shortBio:
      "Les Bacchantes est un vignoble familial de Hemmingford porté par Sébastien Daoust, où la précision et le plaisir du vin vont de pair.",

    shortBioEn:
      "Les Bacchantes is a family vineyard in Hemmingford led by Sébastien Daoust, where precision and the pleasure of wine go hand in hand.",

    bio: bioFr.map(paragraph),

    bioEn: bioEn.map(paragraph),

    approach: approach(approachFr, "bacchantes-fr"),

    approachEn: approach(approachEn, "bacchantes-en"),

    whyWeFollow:
      "Parce qu’on aime cette idée de mettre autant de réflexion dans la fabrication d’un vin que de simplicité dans le plaisir de le boire. Les Bacchantes cultivent une approche précise, mais leur véritable point de départ reste le moment où l’on ouvre la bouteille.",

    whyWeFollowEn:
      "Because we appreciate the idea of putting so much thought into making wine while keeping the pleasure of drinking it uncomplicated. Les Bacchantes takes a precise approach, but the real starting point is always the moment the bottle is opened.",

    visitDetails:
      "Le vignoble accueille les visiteurs à Hemmingford. Pour connaître les heures d’ouverture, organiser une dégustation privée ou planifier une visite, mieux vaut communiquer directement avec le domaine avant de se déplacer.",

    visitDetailsEn:
      "The vineyard welcomes visitors in Hemmingford. Check current opening hours or contact the estate directly to arrange a private tasting or plan your visit.",

    signatureGrapes: selectedGrapes.map((grape, index) => ({
      _key: `bacchantes-grape-${index + 1}`,
      _type: "reference",
      _ref: grape._id,
    })),

    heroImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: heroAsset._id,
      },
    },

    secondaryImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: secondaryAsset._id,
      },
    },

    mediaPermissionStatus: "provided_by_producer",

    mediaCredit: "Les Bacchantes",

    secondaryImageCredit: "Les Bacchantes",
  };

  console.log("\n===== ENREGISTREMENT =====");

  await client
    .patch(PRODUCER_ID)
    .set(fields)
    .commit();

  console.log("✓ Producteur mis à jour");

  console.log("\n===== CONTRÔLE FINAL =====");

  const result = await client.fetch(
    `*[_id == $id][0]{
      _id,
      name,
      "slug": slug.current,
      municipality,
      "country": country->name,
      "region": region->name,
      lpvPartner,
      published,

      oneLiner,
      oneLinerEn,

      "bioFrCount": count(bio),
      "bioEnCount": count(bioEn),

      "approachFrCount": count(approach),
      "approachEnCount": count(approachEn),

      "grapes": signatureGrapes[]->name,

      "hero": heroImage.asset._ref,
      "secondary": secondaryImage.asset._ref,

      mediaCredit,
      secondaryImageCredit,
      mediaPermissionStatus
    }`,
    { id: PRODUCER_ID }
  );

  console.log(JSON.stringify(result, null, 2));

  const valid =
    result?.published === true &&
    result?.lpvPartner === true &&
    result?.bioFrCount === 2 &&
    result?.bioEnCount === 2 &&
    result?.approachFrCount === 3 &&
    result?.approachEnCount === 3 &&
    result?.grapes?.length === 4 &&
    result?.hero === heroAsset._id &&
    result?.secondary === secondaryAsset._id;

  if (!valid) {
    throw new Error(
      "Contrôle incomplet. Vérifier la sortie avant de continuer."
    );
  }

  console.log("\n✓ LES BACCHANTES PUBLIÉ");
  console.log("✓ Français et anglais complets");
  console.log("✓ Deux photos installées dans le bon ordre");
  console.log("✓ Crédits Les Bacchantes");
  console.log("✓ Références géographiques et cépages");
  console.log("✓ Aucun template modifié");
  console.log("✓ Aucun autre producteur modifié");
  console.log("✓ Vins à ajouter ensuite");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
