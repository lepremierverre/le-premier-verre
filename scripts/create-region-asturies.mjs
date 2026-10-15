import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const region = {
  _id: "region-asturies",
  _type: "region",

  name: "Asturies",

  slug: {
    _type: "slug",
    current: "asturies",
  },

  country: {
    _type: "reference",
    _ref: "country-espagne",
  },

  latitude: 43.3614,
  longitude: -5.8593,
};

const duplicate = await client.fetch(
  `*[_type == "region" && (
    _id == $id ||
    slug.current == $slug ||
    name == $name
  )][0]{_id,name,slug}`,
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
console.log(`   ${region.name} — Espagne`);
console.log(`   Coordonnées : ${region.latitude}, ${region.longitude}`);
