import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local" });

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error("STOP — aucun token Sanity d’écriture trouvé. Aucun changement effectué.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const JANE_ID = "wine-pinard-jane-doe-2024";
const IMAGE_PATH = "public/images/lpv/photos bouteilles/Jane+Doenew.jpg";

if (!fs.existsSync(IMAGE_PATH)) {
  console.error(`STOP — image introuvable : ${IMAGE_PATH}`);
  process.exit(1);
}

const janeBefore = await client.fetch(
  `*[_id == $id][0]{
    _id,
    name,
    published,
    bottleImage,
    editorialImage
  }`,
  { id: JANE_ID }
);

if (!janeBefore) {
  console.error("STOP — Jane Doe introuvable dans Sanity. Aucun changement effectué.");
  process.exit(1);
}

console.log("");
console.log("===== AVANT =====");
console.log("Jane :", janeBefore.name);
console.log("Published :", janeBefore.published);
console.log(
  "bottleImage :",
  janeBefore.bottleImage?.asset?._ref || "ABSENT"
);
console.log(
  "editorialImage :",
  janeBefore.editorialImage?.asset?._ref || "ABSENT"
);

console.log("");
console.log("Téléversement de Jane+Doenew.jpg...");

const asset = await client.assets.upload(
  "image",
  fs.createReadStream(IMAGE_PATH),
  {
    filename: "Jane+Doenew.jpg",
  }
);

if (!asset?._id) {
  console.error("STOP — téléversement de l’image échoué.");
  process.exit(1);
}

console.log("Image Sanity :", asset._id);

await client
  .patch(JANE_ID)
  .set({
    editorialImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      alt: "Jane Doe de Pinard et Filles",
      credit: "Pinard et Filles",
    },
  })
  .commit();

const janeAfter = await client.fetch(
  `*[_id == $id][0]{
    _id,
    name,
    published,
    bottleImage,
    editorialImage
  }`,
  { id: JANE_ID }
);

console.log("");
console.log("===== APRÈS =====");
console.log("Jane published :", janeAfter?.published);
console.log(
  "bottleImage conservé :",
  janeAfter?.bottleImage?.asset?._ref || "ABSENT"
);
console.log(
  "editorialImage :",
  janeAfter?.editorialImage?.asset?._ref || "ABSENT"
);
console.log("Alt :", janeAfter?.editorialImage?.alt || "ABSENT");
console.log("Crédit :", janeAfter?.editorialImage?.credit || "ABSENT");

console.log("");
console.log("OK — JANE DOE");
console.log("✓ Jane+Doenew.jpg téléversée");
console.log("✓ nouvelle editorialImage assignée");
console.log("✓ bottleImage historique conservée");
console.log("✓ contenu FR + EN inchangé");
console.log("✓ modèle LPV générique conservé");
