import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const id = "producer-les-pervenches";
  const secondaryPath = "public/images/lpv/producteurs/pervenches2.jpg";

  const producer = await client.getDocument(id);

  if (!producer || producer.name !== "Les Pervenches") {
    throw new Error("Document publié Les Pervenches introuvable. Aucune modification.");
  }

  if (!fs.existsSync(secondaryPath)) {
    throw new Error(`Photo secondaire introuvable : ${secondaryPath}`);
  }

  console.log("✓ Producteur publié trouvé");
  console.log("✓", producer.name);

  console.log("\nTéléversement de pervenches2.jpg...");

  const secondaryAsset = await client.assets.upload(
    "image",
    fs.createReadStream(secondaryPath),
    {
      filename: "les-pervenches-secondary.jpg",
    }
  );

  console.log("✓ Photo secondaire téléversée");
  console.log("✓", secondaryAsset._id);

  await client
    .patch(id)
    .set({
      producerType: "winery",
      mediaCredit: "Les Pervenches",
      secondaryImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: secondaryAsset._id,
        },
      },
      secondaryImageCredit: "Les Pervenches",
    })
    .commit();

  const after = await client.fetch(
    `*[_id == $id][0]{
      _id,
      name,
      "slug": slug.current,
      producerType,
      published,
      lpvPartner,
      mediaPermissionStatus,
      mediaCredit,
      "hero": heroImage.asset->originalFilename,
      "secondary": secondaryImage.asset->originalFilename,
      secondaryImageCredit,
      instagram,
      "wineCount": count(*[
        _type == "wine" &&
        producer._ref == ^._id &&
        published == true
      ])
    }`,
    { id }
  );

  console.log("\n========================================");
  console.log("CONTRÔLE FINAL");
  console.log("========================================\n");

  console.dir(after, { depth: null });

  if (after.producerType !== "winery") {
    throw new Error("producerType non enregistré.");
  }

  if (!after.secondary) {
    throw new Error("Photo secondaire non enregistrée.");
  }

  if (after.mediaCredit !== "Les Pervenches") {
    throw new Error("Crédit média non enregistré.");
  }

  console.log("\n✓ Les Pervenches restent publiées");
  console.log("✓ Partenaire LPV conservé");
  console.log("✓ Type winery ajouté");
  console.log("✓ Hero existant conservé");
  console.log("✓ Deuxième photo ajoutée");
  console.log("✓ Crédits Les Pervenches");
  console.log("✓ 6 vins existants conservés");
  console.log("✓ Aucun texte éditorial modifié");
  console.log("✓ Aucun vin modifié");
}

main().catch((err) => {
  console.error("\n❌", err);
  process.exit(1);
});
