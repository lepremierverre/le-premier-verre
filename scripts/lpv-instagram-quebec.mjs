import { createClient } from "@sanity/client";
import fs from "node:fs";

const env = fs.readFileSync(".env.local", "utf8");

for (const line of env.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] =
      match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_API_TOKEN ||
  process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.log("STOP — token Sanity absent");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const accounts = {
  "cidrerie-michel-jodoin": "cidreriemicheljodoin",
  "cidrerie-milton": "cidreriemilton",
  "domaine-lafrance": "domainelafrance",
  "domaine-des-cotes-d-ardoise": "vignoblecotesdardoise",
  "val-caudalies": "valcaudalies",
  "vignoble-de-l-orpailleur": "vignobledelorpailleur",
};

console.log("\n===== INSTAGRAM QUÉBEC =====");

for (const [slug, handle] of Object.entries(accounts)) {
  const producer = await client.fetch(
    `*[_type == "producer" && slug.current == $slug][0]{
      _id,
      name,
      lpvPartner,
      instagram
    }`,
    { slug }
  );

  if (!producer) {
    console.log("INTROUVABLE :", slug);
    continue;
  }

  if (producer.lpvPartner === true) {
    console.log("PARTENAIRE PROTÉGÉ :", producer.name);
    continue;
  }

  if (producer.instagram) {
    console.log("DÉJÀ PRÉSENT :", producer.name);
    continue;
  }

  await client
    .patch(producer._id)
    .set({
      instagram: `https://www.instagram.com/${handle}/`,
    })
    .commit();

  console.log("AJOUTÉ :", producer.name, `@${handle}`);
}

console.log("\n===== TERMINÉ =====");
