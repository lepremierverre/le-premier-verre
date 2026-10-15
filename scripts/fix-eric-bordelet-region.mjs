import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

const id = "producer-eric-bordelet";

const producer = await client.fetch(
  `*[_id == $id][0]{
    _id,
    name,
    region->{_id,name}
  }`,
  { id }
);

if (!producer) {
  console.error("❌ Éric Bordelet introuvable.");
  process.exit(1);
}

console.log(
  `Région actuelle : ${producer.region?.name || "aucune"} (${producer.region?._id || "—"})`
);

await client
  .patch(id)
  .set({
    region: {
      _type: "reference",
      _ref: "region-pays-de-la-loire",
    },
  })
  .commit();

const updated = await client.fetch(
  `*[_id == $id][0]{
    _id,
    name,
    municipality,
    country->{name},
    region->{_id,name}
  }`,
  { id }
);

console.log("✅ Région corrigée");
console.log(`   ${updated.name} — ${updated.municipality}`);
console.log(`   Pays : ${updated.country?.name}`);
console.log(`   Région : ${updated.region?.name} (${updated.region?._id})`);
