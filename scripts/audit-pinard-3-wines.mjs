import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

const data = await client.fetch(`
  *[
    _type == "wine" &&
    (
      producer->slug.current == "pinard-et-filles" ||
      lower(name) match "*iris*" ||
      lower(name) match "*jane doe*" ||
      lower(name) match "*john doe*"
    )
  ] | order(name asc) {
    _id,
    name,
    vintage,
    published,
    beverageType,
    color,
    approxPrice,
    alcohol,
    sugar,
    bottleSize,
    servingTemperature,
    purchaseChannel,
    purchaseUrl,
    purchaseLastChecked,
    oneLiner,
    oneLinerEn,
    tastingKeywords,
    tastingKeywordsEn,
    perfectFor,
    perfectForEn,
    whyWeRecommend,
    whyWeRecommendEn,
    body,
    sweetness,
    roundness,
    acidity,
    tannins,
    fruitIntensity,
    minerality,
    intensity,
    complexity,
    oakInfluence,
    savory,
    dnaMetadata,
    "producer": producer->name,
    "producerId": producer->_id,
    "country": country->name,
    "countryId": country->_id,
    "region": region->name,
    "regionId": region->_id,
    "appellation": appellation->name,
    "appellationId": appellation->_id,
    "grapes": grapes[]->{_id,name},
    "image": bottleImage.asset->{
      _id,
      url,
      metadata { dimensions }
    }
  }
`);

console.dir(data, { depth: null });
