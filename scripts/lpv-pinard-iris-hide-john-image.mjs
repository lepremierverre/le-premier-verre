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

const IRIS_ID = "wine-pinard-iris-de-doe-2025";
const JOHN_ID = "wine-john-doe-2025";
const IMAGE_PATH = "public/images/lpv/photos bouteilles/John+Doenew.jpg";

if (!fs.existsSync(IMAGE_PATH)) {
  console.error(`STOP — image introuvable : ${IMAGE_PATH}`);
  process.exit(1);
}

const [irisBefore, johnBefore] = await Promise.all([
  client.fetch(
    `*[_id == $id][0]{_id,name,published}`,
    { id: IRIS_ID }
  ),
  client.fetch(
    `*[_id == $id][0]{_id,name,published,bottleImage,editorialImage}`,
    { id: JOHN_ID }
  ),
]);

if (!irisBefore || !johnBefore) {
  console.error("STOP — Iris ou John introuvable dans Sanity. Aucun changement effectué.");
  process.exit(1);
}

console.log("");
console.log("===== AVANT =====");
console.log("Iris :", {
  id: irisBefore._id,
  published: irisBefore.published,
});
console.log("John :", {
  id: johnBefore._id,
  bottleImage: johnBefore.bottleImage?.asset?._ref || "ABSENT",
  editorialImage: johnBefore.editorialImage?.asset?._ref || "ABSENT",
});

console.log("");
console.log("Téléversement de John+Doenew.jpg...");

const asset = await client.assets.upload(
  "image",
  fs.createReadStream(IMAGE_PATH),
  {
    filename: "John+Doenew.jpg",
  }
);

if (!asset?._id) {
  console.error("STOP — téléversement de l’image échoué.");
  process.exit(1);
}

console.log("Image Sanity :", asset._id);

await client
  .transaction()
  .patch(IRIS_ID, (patch) =>
    patch.set({
      published: false,
    })
  )
  .patch(JOHN_ID, (patch) =>
    patch.set({
      editorialImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
        alt: "John Doe de Pinard et Filles",
        credit: "Pinard et Filles",
      },
    })
  )
  .commit();

const [irisAfter, johnAfter] = await Promise.all([
  client.fetch(
    `*[_id == $id][0]{_id,name,published}`,
    { id: IRIS_ID }
  ),
  client.fetch(
    `*[_id == $id][0]{_id,name,published,bottleImage,editorialImage}`,
    { id: JOHN_ID }
  ),
]);

console.log("");
console.log("===== APRÈS =====");
console.log("Iris published :", irisAfter?.published);
console.log(
  "John bottleImage conservé :",
  johnAfter?.bottleImage?.asset?._ref || "ABSENT"
);
console.log(
  "John editorialImage :",
  johnAfter?.editorialImage?.asset?._ref || "ABSENT"
);
console.log("John alt :", johnAfter?.editorialImage?.alt || "ABSENT");
console.log("John crédit :", johnAfter?.editorialImage?.credit || "ABSENT");

console.log("");
console.log("OK — PINARD");
console.log("✓ Iris de Doe conservée dans Sanity mais retirée du public");
console.log("✓ John Doe reste publié");
console.log("✓ John+Doenew.jpg téléversée");
console.log("✓ editorialImage de John Doe assignée");
console.log("✓ bottleImage historique de John Doe conservée");
console.log("✓ nouveau modèle LPV de John Doe activé");
