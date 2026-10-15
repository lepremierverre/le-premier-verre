import { createClient } from "@sanity/client";
import fs from "node:fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const upload = (path, filename) =>
  client.assets.upload(
    "image",
    fs.createReadStream(path),
    { filename }
  );

const hero = await upload(
  process.env.EQ2,
  "ferme-cidricole-equinoxe-hero-2.jpeg"
);

const secondary = await upload(
  process.env.EQ3,
  "ferme-cidricole-equinoxe-secondary-3.jpeg"
);

await client
  .patch("producer-ferme-cidricole-equinoxe")
  .set({
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
  })
  .commit();

const check = await client.fetch(`
  *[_id == "producer-ferme-cidricole-equinoxe"][0]{
    name,
    "hero": heroImage.asset->originalFilename,
    "secondary": secondaryImage.asset->originalFilename
  }
`);

console.log("\n✓ Photos remplacées");
console.dir(check);
