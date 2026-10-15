import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const id = "producer-domaine-bergeville";

const bioEn = [
  {
    _key: "bio-en-1",
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: "bio-en-1-span",
        _type: "span",
        marks: [],
        text:
          "Located in the Eastern Townships, in the heart of the Massawippi Valley, Domaine Bergeville makes wine with a distinctly Quebec character. Winters are cold, summers are short and the grape varieties are chosen for their ability to thrive in this climate.",
      },
    ],
  },
  {
    _key: "bio-en-2",
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [
      {
        _key: "bio-en-2-span",
        _type: "span",
        marks: [],
        text:
          "The estate follows organic and biodynamic farming practices, paying close attention to the soil and the life surrounding its vines. Bergeville has become particularly known for its sparkling wines, which play a central role in the estate's identity.",
      },
    ],
  },
];

const approachEn = [
  {
    _key: "approach-nordicite-en",
    _type: "producerApproachItem",
    title: "Working with the climate",
    text:
      "Quebec's cold winters and short growing seasons are part of everyday life for winemakers. Bergeville embraces these conditions and grows grape varieties suited to the local climate.",
  },
  {
    _key: "approach-vivant-en",
    _type: "producerApproachItem",
    title: "A living vineyard",
    text:
      "The vines are grown using organic and biodynamic practices. The estate focuses on healthy soils, biodiversity and maintaining a balanced vineyard.",
  },
  {
    _key: "approach-bulles-en",
    _type: "producerApproachItem",
    title: "Quebec with bubbles",
    text:
      "Sparkling wines are a big part of what Bergeville does. The estate takes its time crafting wines that are fresh, delicate and simply enjoyable to drink.",
  },
];

const whyWeFollowEn =
  "Bergeville isn't trying to make Quebec wine taste like wine from somewhere else. The estate works with its climate, grape varieties and land to create something distinctly its own. That approach is especially convincing when it comes to sparkling wine.";

const visitDetailsEn =
  "The estate offers tastings, tours and workshops during its visitor season. Check current experiences and opening hours directly with the estate before visiting.";

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("SANITY_API_WRITE_TOKEN missing");
  }

  const before = await client.getDocument(id);

  if (!before) {
    throw new Error("Domaine Bergeville not found");
  }

  await client
    .patch(id)
    .set({
      bioEn,
      approachEn,
      whyWeFollowEn,
      visitDetailsEn,
    })
    .commit();

  const after = await client.fetch(
    `*[_id == $id][0]{
      _id,
      name,
      bioEn,
      approachEn,
      whyWeFollowEn,
      visitDetailsEn
    }`,
    { id }
  );

  console.log(JSON.stringify(after, null, 2));
  console.log("");
  console.log("✓ BERGEVILLE EN CONTENT SAVED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
