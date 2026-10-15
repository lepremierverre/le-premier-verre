import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  useCdn: false,
});

const ids = [
  "producer-vignoble-pigeon-hill",
  "drafts.producer-vignoble-pigeon-hill",
];

const result = await client.fetch(`
  *[
    _id in $ids ||
    name == "Vignoble Pigeon Hill" ||
    name == "Pigeon Hill"
  ]{
    ...,
    "slugValue": slug.current,
    "heroInfo": heroImage.asset->{
      _id,
      originalFilename,
      url,
      metadata { dimensions }
    },
    "photoInfo": photo.asset->{
      _id,
      originalFilename,
      url,
      metadata { dimensions }
    },
    "secondaryInfo": secondaryImage.asset->{
      _id,
      originalFilename,
      url,
      metadata { dimensions }
    },
    "signatureGrapesResolved": signatureGrapes[]->{
      _id,
      name
    }
  }
`, { ids });

console.dir(result, { depth: null });
