import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function upload(path, filename) {
  if (!fs.existsSync(path)) {
    throw new Error(`Image introuvable : ${path}`);
  }

  return client.assets.upload(
    "image",
    fs.createReadStream(path),
    { filename }
  );
}

async function main() {
  const id = "producer-pinard-et-filles";

  const heroPath =
    "public/images/lpv/producteurs/pinard1.jpg";

  const secondaryPath =
    "public/images/lpv/producteurs/pinard2.jpg";

  const producer = await client.getDocument(id);

  if (!producer || producer.name !== "Pinard et Filles") {
    throw new Error(
      "Document Pinard et Filles introuvable. Aucune modification."
    );
  }

  console.log("✓ Pinard et Filles trouvé");
  console.log("✓ Publication :", producer.published);
  console.log("✓ Partenaire LPV :", producer.lpvPartner);

  console.log("\nTéléversement pinard1...");
  const hero = await upload(
    heroPath,
    "pinard-et-filles-hero.jpg"
  );
  console.log("✓", hero._id);

  console.log("\nTéléversement pinard2...");
  const secondary = await upload(
    secondaryPath,
    "pinard-et-filles-secondary.jpg"
  );
  console.log("✓", secondary._id);

  await client
    .patch(id)
    .set({
      producerType: "winery",

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

      mediaPermissionStatus: "provided_by_producer",
      mediaCredit: "Pinard et Filles",
      secondaryImageCredit: "Pinard et Filles",
    })
    .commit();

  const after = await client.fetch(
    `*[_id == $id][0]{
      _id,
      name,
      "slug":slug.current,
      producerType,
      published,
      lpvPartner,

      mediaPermissionStatus,
      mediaCredit,

      "hero":heroImage.asset->{
        _id,
        originalFilename,
        metadata{dimensions}
      },

      "secondary":secondaryImage.asset->{
        _id,
        originalFilename,
        metadata{dimensions}
      },

      secondaryImageCredit,

      "wineCount":count(*[
        _type == "wine" &&
        producer._ref == ^._id
      ])
    }`,
    { id }
  );

  console.log("\n========================================");
  console.log("CONTRÔLE FINAL");
  console.log("========================================\n");

  console.dir(after, { depth: null });

  if (
    after.producerType !== "winery" ||
    !after.hero ||
    !after.secondary ||
    after.mediaCredit !== "Pinard et Filles" ||
    after.secondaryImageCredit !== "Pinard et Filles"
  ) {
    throw new Error("Contrôle final échoué.");
  }

  console.log("\n✓ pinard1 installé en hero");
  console.log("✓ pinard2 installé en deuxième photo");
  console.log("✓ Crédit Pinard et Filles");
  console.log("✓ Type winery");
  console.log("✓ Publication conservée");
  console.log("✓ Partenaire LPV conservé");
  console.log("✓ Aucun texte modifié");
  console.log("✓ Aucun vin modifié");

  console.log("\nÀ regarder maintenant");
  console.log(
    "http://localhost:3000/producteurs/pinard-et-filles"
  );
}

main().catch((err) => {
  console.error("\n❌", err.message);
  process.exit(1);
});
