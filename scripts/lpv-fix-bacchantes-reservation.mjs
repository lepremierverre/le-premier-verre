import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const id = "producer-les-bacchantes";

  await client
    .patch(id)
    .set({
      reservationRequired: true,
    })
    .commit();

  const result = await client.fetch(
    `*[_id == $id][0]{
      name,
      published,
      producerType,
      reservationRequired,
      instagram
    }`,
    { id }
  );

  console.log(JSON.stringify(result, null, 2));

  if (result?.reservationRequired !== true) {
    throw new Error("reservationRequired non enregistré.");
  }

  console.log("");
  console.log("✓ Visites affichées Sur réservation");
  console.log("✓ Producteur toujours intact");
}

main().catch((error) => {
  console.error("ERREUR :", error.message);
  process.exit(1);
});
