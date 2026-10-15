import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function main() {
  const wines = await client.fetch(`
    *[
      _type == "wine" &&
      published == true &&
      defined(producer) &&
      defined(bottleImage)
    ][0...3]{
      ...,
      producer->{_id, name, "slug": slug.current},
      country->{_id, name, "slug": slug.current},
      region->{_id, name, "slug": slug.current},
      grapes[]->{_id, name, "slug": slug.current}
    }
  `);

  console.log(JSON.stringify(wines, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
