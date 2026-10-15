import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "czq6bjyu",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const place = await client.fetch(`
  *[
    _type == "place" &&
    (
      lower(name) match "*saucette*" ||
      slug.current match "*saucette*"
    )
  ][0]
`);

console.log("\n===== SAUCETTE =====");
console.log("Nom :", place?.name);
console.log("Slug :", place?.slug?.current);
console.log("coverImage :", place?.coverImage?.asset?._ref || "ABSENT");
console.log("heroImage :", place?.heroImage?.asset?._ref || "ABSENT");
console.log("editorialImage :", place?.editorialImage?.asset?._ref || "ABSENT");
console.log("image :", place?.image?.asset?._ref || "ABSENT");
console.log("photo :", place?.photo?.asset?._ref || "ABSENT");
console.log("gallery :", JSON.stringify(place?.gallery ?? null, null, 2));
console.log("images :", JSON.stringify(place?.images ?? null, null, 2));

console.log("\n===== CHAMPS DU DOCUMENT =====");
console.log(Object.keys(place || {}).sort().join("\n"));
