import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const region = {
  _id: "region-pays-de-la-loire",
  _type: "region",
  name: "Pays de la Loire",
  slug: {
    _type: "slug",
    current: "pays-de-la-loire",
  },
  country: {
    _type: "reference",
    _ref: "country-france",
  },
  latitude: 47.7633,
  longitude: -0.3299,
};

const duplicate = await client.fetch(
  `*[_type == "region" && (
    _id == $id ||
    slug.current == $slug ||
    name == $name
  )][0]{_id,name}`,
  {
    id: region._id,
    slug: region.slug.current,
    name: region.name,
  }
);

if (duplicate) {
  console.error(`❌ Doublon détecté : ${duplicate._id} — ${duplicate.name}`);
  process.exit(1);
}

await client.create(region);

console.log(`✅ Région créée : ${region._id}`);
console.log(`   ${region.name} — France`);
console.log(`   Coordonnées : ${region.latitude}, ${region.longitude}`);
