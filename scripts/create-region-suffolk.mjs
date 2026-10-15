import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const region = {
  _id: "region-suffolk",
  _type: "region",

  name: "Suffolk",

  slug: {
    _type: "slug",
    current: "suffolk",
  },

  country: {
    _type: "reference",
    _ref: "country-angleterre",
  },

  latitude: 52.1872,
  longitude: 0.9708,
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

const country = await client.fetch(
  `*[_id == "country-angleterre"][0]{_id,name}`
);

if (!country) {
  console.error("❌ country-angleterre n'existe pas. Aucun document créé.");
  process.exit(1);
}

await client.create(region);

console.log(`✅ Région créée : ${region._id}`);
console.log(`   ${region.name} — ${country.name}`);
console.log(`   Coordonnées : ${region.latitude}, ${region.longitude}`);
