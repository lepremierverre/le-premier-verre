import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "producer-domaine-bergeville";

const bio = [
  {
    _key: "bio-1",
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: "bio-1-span",
        _type: "span",
        marks: [],
        text: "Installé dans les Cantons-de-l’Est, au cœur de la vallée du Massawippi, Domaine Bergeville fait du vin avec une réalité bien québécoise. Ici, les hivers sont froids, les étés sont courts et les cépages sont choisis parce qu’ils sont bien adaptés à notre climat.",
      },
    ],
  },
  {
    _key: "bio-2",
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: "bio-2-span",
        _type: "span",
        marks: [],
        text: "Le domaine travaille en agriculture biologique et biodynamique, avec beaucoup d’attention portée aux sols et à ce qui pousse autour des vignes. Bergeville s’est surtout fait connaître pour ses vins effervescents. Des bulles fraîches et précises qui occupent une place importante dans l’identité du domaine.",
      },
    ],
  },
];

const approach = [
  {
    _key: "approach-nordicite",
    _type: "producerApproachItem",
    title: "Cultiver la nordicité",
    text: "Au Québec, le froid et les saisons courtes font partie du quotidien des vignerons. Bergeville travaille avec cette réalité et choisit des cépages capables de bien s’adapter à notre climat.",
  },
  {
    _key: "approach-vivant",
    _type: "producerApproachItem",
    title: "Un vignoble vivant",
    text: "Les vignes sont cultivées en agriculture biologique et biodynamique. Concrètement, le domaine porte une grande attention à la santé des sols, à la biodiversité et à l’équilibre du vignoble.",
  },
  {
    _key: "approach-bulles",
    _type: "producerApproachItem",
    title: "Le Québec en bulles",
    text: "Les bulles occupent une grande place chez Bergeville. Le domaine prend le temps de les élaborer pour créer des vins frais, fins et agréables à boire.",
  },
];

const whyWeFollow =
  "Parce que Bergeville ne cherche pas à faire du vin québécois comme ailleurs. Le domaine travaille avec son climat, ses cépages et son territoire pour construire une identité propre. C’est particulièrement convaincant lorsqu’elle prend la forme de bulles.";

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN manquant");
  }

  const before = await client.getDocument(id);

  if (!before) {
    throw new Error("Document Bergeville introuvable");
  }

  console.log("✓ Bergeville trouvé");

  await client
    .patch(id)
    .set({
      bio,
      approach,
      whyWeFollow,
    })
    .commit();

  const after = await client.fetch(
    `*[_id == $id][0]{
      _id,
      name,
      bio,
      approach,
      whyWeFollow
    }`,
    { id }
  );

  console.log("");
  console.log("===== CONTENU FR ENREGISTRÉ =====");
  console.log(JSON.stringify(after, null, 2));
  console.log("");
  console.log("✓ BERGEVILLE FR FINALISÉ DANS SANITY");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
