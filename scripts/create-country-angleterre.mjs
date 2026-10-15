import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const country = {
  _id: "country-angleterre",
  _type: "country",

  name: "Angleterre",

  slug: {
    _type: "slug",
    current: "angleterre",
  },

  nameEn: "England",
};

const duplicate = await client.fetch(
  `*[_type == "country" && (
    _id == $id ||
    slug.current == $slug ||
    name == $name
  )][0]{_id,name}`,
  {
    id: country._id,
    slug: country.slug.current,
    name: country.name,
  }
);

if (duplicate) {
  console.error(`❌ Doublon détecté : ${duplicate._id} — ${duplicate.name}`);
  process.exit(1);
}

await client.create(country);

console.log(`✅ Pays créé : ${country._id}`);
console.log(`   FR : ${country.name}`);
console.log(`   EN : ${country.nameEn}`);
console.log(`   Slug : ${country.slug.current}`);
