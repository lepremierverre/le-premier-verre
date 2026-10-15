import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-08-15",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

if (!client.config().token) {
  throw new Error("SANITY_API_WRITE_TOKEN ou SANITY_API_TOKEN est requis.");
}

const partners = [
  {
    id: "bb61af16-e4c6-42ad-968c-edd0752d054c",
    name: "Domaine du Ridge",
  },
  {
    id: "producer-les-pervenches",
    name: "Les Pervenches",
  },
];

for (const partner of partners) {
  const existing = await client.fetch(
    `*[_id == $id][0]{_id,name,lpvPartner}`,
    { id: partner.id }
  );

  if (!existing) {
    throw new Error(`Producteur introuvable : ${partner.name}`);
  }

  await client.patch(partner.id).set({ lpvPartner: true }).commit();

  console.log(`✓ ${partner.name} → partenaire LPV`);
}

console.log("Terminé.");
