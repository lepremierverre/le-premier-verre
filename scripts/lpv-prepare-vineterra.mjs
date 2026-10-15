import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const id = "producer-vineterra";

  const before = await client.getDocument(id);

  if (!before || before._type !== "producer") {
    throw new Error("Document Vineterra introuvable.");
  }

  if (before.slug?.current !== "vineterra") {
    throw new Error("Slug inattendu. Modification annulée.");
  }

  const result = await client
    .patch(id)
    .set({
      name: "Domaine Vineterra",
      municipality: "Mont-Saint-Hilaire",
      address:
        "815, chemin Pion, Mont-Saint-Hilaire, Québec J3H 0L4",
      phone: "450 584-3788",
      email: "info@vineterra.ca",
      website: "https://www.vineterra.ca/",
      lpvPartner: true,
      published: true,
      openToVisitors: true,
      mediaPermissionStatus: "provided_by_producer",
      mediaCredit: "Domaine Vineterra",
    })
    .commit();

  console.log("✓ Vineterra mis à jour dans Sanity");
  console.log("ID :", result._id);
  console.log("Statut partenaire : OUI");
  console.log("Publication : OUI");
  console.log("Crédit photo : Domaine Vineterra");
}

main().catch((error) => {
  console.error("ERREUR :", error);
  process.exit(1);
});
