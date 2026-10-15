import fs from "node:fs";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const producerId = "producer-vignoble-pigeon-hill";
const imagePath = "public/images/lpv/producteurs/pigeonhill2.png";

if (!fs.existsSync(imagePath)) {
  throw new Error(`Image introuvable : ${imagePath}`);
}

const asset = await client.assets.upload(
  "image",
  fs.createReadStream(imagePath),
  {
    filename: "pigeonhill2.png",
    contentType: "image/png",
  }
);

await client
  .patch(producerId)
  .set({
    secondaryImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    },
    secondaryImageCredit: "Vignoble Pigeon Hill",
  })
  .commit();

const check = await client.fetch(
  `*[_id == $id][0]{
    name,
    "secondaryImage": secondaryImage.asset->{
      _id,
      originalFilename,
      url,
      metadata{dimensions}
    },
    secondaryImageCredit
  }`,
  { id: producerId }
);

console.log("\n✓ Deuxième photo ajoutée à Pigeon Hill");
console.dir(check, { depth: null });
