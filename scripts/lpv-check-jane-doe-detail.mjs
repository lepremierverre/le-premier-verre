import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const wine = await client.fetch(`
  *[_type == "wine" && (
    name == "Jane Doe" ||
    slug.current == "jane-doe-2024" ||
    slug.current == "pinard-jane-doe-2024"
  )][0]{
    _id,
    name,
    "slug": slug.current,
    vintage,
    beverageType,
    alcoholFree,
    color,
    style,
    "producer": producer->{name, "slug": slug.current},
    "country": country->{name},
    "region": region->{name},
    "appellation": appellation->{name},
    "grapes": grapes[]->{name, "slug": slug.current},
    approxPrice,
    purchaseChannel,
    purchaseChannelDetails,
    purchaseUrl,
    purchaseLastChecked,
    oneLiner,
    tastingKeywords,
    perfectFor,
    whyWeRecommend,
    body,
    sweetness,
    roundness,
    servingTemperature,
    decant,
    "foodPairings": foodPairings[]->{name, "slug": slug.current},
    tastingNotes,
    bottleImage
  }
`);

console.dir(wine, { depth: null });
