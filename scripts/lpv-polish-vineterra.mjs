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

  const producer = await client.getDocument(id);

  if (!producer || producer.slug?.current !== "vineterra") {
    throw new Error("Vineterra introuvable.");
  }

  // Trouver les références cépages déjà présentes dans Sanity.
  const wanted = [
    "Chardonnay",
    "Riesling",
    "Pinot noir",
    "Gamay",
    "Vidal",
    "Acadie blanc",
  ];

  const grapes = await client.fetch(`
    *[_type == "grape"]{
      _id,
      name,
      "slug": slug.current
    }
  `);

  const normalize = (value = "") =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const selected = wanted.map((name) => {
    const found = grapes.find(
      (g) => normalize(g.name) === normalize(name)
    );

    return {
      requested: name,
      found,
    };
  });

  console.log("\n===== CÉPAGES =====");

  selected.forEach(({ requested, found }) => {
    console.log(
      found
        ? `✓ ${requested} -> ${found.name}`
        : `⚠ ${requested} introuvable`
    );
  });

  const foundGrapes = selected
    .filter((item) => item.found)
    .map((item) => ({
      _type: "reference",
      _key: item.found._id.replace(/[^a-zA-Z0-9_-]/g, "-"),
      _ref: item.found._id,
    }));

  if (foundGrapes.length < 4) {
    throw new Error(
      `Seulement ${foundGrapes.length} cépages trouvés. Aucun patch effectué.`
    );
  }

  await client
    .patch(id)
    .set({
      signatureGrapes: foundGrapes,

      instagram: "https://www.instagram.com/domainevineterra/",
    })
    .commit();

  const check = await client.fetch(`
    *[_id == $id][0]{
      name,
      instagram,
      signatureGrapes[]->{
        _id,
        name,
        "slug": slug.current
      }
    }
  `, { id });

  console.log("\n===== APRÈS PATCH =====");
  console.log(JSON.stringify(check, null, 2));

  console.log("\n✓ Cépages reliés");
  console.log("✓ Instagram ajouté");
}

main().catch((error) => {
  console.error("\nERREUR :", error.message);
  process.exit(1);
});
