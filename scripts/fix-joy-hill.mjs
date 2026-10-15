import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-15",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const id = "producer-maison-agricole-joy-hill";

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("Token Sanity manquant");
  }

  const before = await client.getDocument(id);

  if (!before) {
    throw new Error("Joy Hill introuvable");
  }

  await client.patch(id).set({
    instagram: "https://www.instagram.com/maisonagricolejoyhill/",
    mediaPermissionStatus: "authorized_by_producer",
    mediaPermissionNote:
      "Le producteur a autorisé Le Premier Verre à utiliser des photos provenant de son site web.",
    mediaCredit: "Maison agricole Joy Hill",
    secondaryImageCredit: "Maison agricole Joy Hill",
  }).commit();

  const result = await client.getDocument(id);

  console.log("\n===== JOY HILL =====");

  console.log({
    published: result.published,
    instagram: result.instagram,
    mediaPermissionStatus: result.mediaPermissionStatus,
    heroImage: Boolean(result.heroImage),
    photo: Boolean(result.photo),
    secondaryImage: Boolean(result.secondaryImage),
    bio: result.bio,
    bioEn: result.bioEn,
  });
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
