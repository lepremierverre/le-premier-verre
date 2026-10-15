import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const wines = await client.fetch(`
  *[
    _type == "wine" &&
    (
      references("producer-vineterra") ||
      lower(name) match "*cheval*" ||
      lower(name) match "*magie*" ||
      lower(name) match "*lac sans fond*" ||
      lower(name) match "*apasciaro*"
    )
  ]{
    _id,
    name,
    "slug": slug.current,
    published,
    vintage,
    color,
    producer->{_id, name},
    bottleImage
  }
`);

console.log(JSON.stringify(wines, null, 2));
