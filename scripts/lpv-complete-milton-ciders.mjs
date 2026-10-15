import dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID;

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  "production";

const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  throw new Error(
    "Configuration manquante : projectId ou SANITY_API_WRITE_TOKEN."
  );
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const updates = [
  {
    id: "wine-cidrerie-milton-ami-imaginaire",
    fields: {
      oneLiner:
        "Un cidre tranquille, sec et minéral, aux notes de poire verte, à la fraîcheur vive et à l'acidité franche. Une bouteille gastronomique qui trouve naturellement sa place à table.",
      oneLinerEn:
        "A still, dry and mineral cider with green pear notes, lively freshness and bright acidity. A gastronomic bottle that feels right at the table.",
      tastingKeywords: [
        "poire verte",
        "minéralité",
        "fraîcheur",
        "acidité",
      ],
      tastingKeywordsEn: [
        "green pear",
        "minerality",
        "freshness",
        "acidity",
      ],
      perfectFor: [
        "apéritif",
        "fruits de mer",
        "repas gastronomique",
      ],
      perfectForEn: [
        "aperitif",
        "seafood",
        "gastronomic meals",
      ],
      body: 3,
      sweetness: 1,
      roundness: 2,
    },
  },
  {
    id: "wine-cidrerie-milton-coccinelle-pomme",
    fields: {
      oneLiner:
        "Un moût de pomme pétillant sans alcool, élaboré à partir de jus de pomme pur à 100 %. Une option fraîche et festive pour célébrer la pomme à l'apéritif ou dans un mocktail.",
      oneLinerEn:
        "A sparkling, alcohol-free apple beverage made from 100% pure apple juice. A fresh, festive option to enjoy as an aperitif or in a mocktail.",
      tastingKeywords: [
        "pomme",
        "fraîcheur",
        "bulles",
      ],
      tastingKeywordsEn: [
        "apple",
        "freshness",
        "bubbles",
      ],
      perfectFor: [
        "apéritif sans alcool",
        "célébrations",
        "mocktails",
      ],
      perfectForEn: [
        "alcohol-free aperitifs",
        "celebrations",
        "mocktails",
      ],
    },
  },
];

for (const item of updates) {
  const existing = await client.fetch(
    `*[_type == "wine" && _id == $id][0]{
      _id, name, beverageType, alcoholFree, published
    }`,
    { id: item.id }
  );

  if (!existing) {
    throw new Error(`Fiche introuvable : ${item.id}`);
  }

  if (
    existing.beverageType !== "cider" ||
    existing.published !== true
  ) {
    throw new Error(
      `Vérification échouée pour ${existing.name} : type ou publication inattendu.`
    );
  }

  if (
    item.id === "wine-cidrerie-milton-coccinelle-pomme" &&
    existing.alcoholFree !== true
  ) {
    throw new Error("Coccinelle Pomme doit rester sans alcool.");
  }
}

const transaction = client.transaction();

for (const item of updates) {
  transaction.patch(item.id, (patch) =>
    patch.set(item.fields)
  );
}

await transaction.commit();

console.log("\n===== FICHES MILTON COMPLÉTÉES =====");

for (const item of updates) {
  const result = await client.fetch(
    `*[_type == "wine" && _id == $id][0]{
      name, beverageType, alcoholFree,
      oneLiner, oneLinerEn,
      tastingKeywords, tastingKeywordsEn,
      perfectFor, perfectForEn
    }`,
    { id: item.id }
  );

  console.log(`\n${result.name}`);
  console.log(JSON.stringify(result, null, 2));
}

console.log("\n✓ Descriptions FR + EN enregistrées.");
console.log("✓ Photos et prix laissés intacts.");
console.log("✓ Aucune fiche supprimée.");
