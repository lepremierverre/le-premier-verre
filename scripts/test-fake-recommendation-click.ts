import { randomUUID } from "node:crypto";

import { client } from "../sanity/lib/client";
import { getPairingRecommendations } from "../lib/recommendations/pairing-recommendations";

async function main() {
  const pairingSlug = "agneau";

  const canonical = await getPairingRecommendations(
    pairingSlug,
    "with"
  );

  if (!canonical.food) {
    throw new Error("Accord agneau introuvable.");
  }

  const top4Ids = canonical.candidates
    .slice(0, 4)
    .map((candidate) => candidate.wine._id);

  const fakeWine = await client.fetch<{
    _id: string;
    name: string;
  } | null>(
    `*[
      _type == "wine" &&
      published == true &&
      !(_id in path("drafts.**")) &&
      !(_id in $top4Ids) &&
      coalesce(alcoholFree, false) != true
    ][0]{
      _id,
      name
    }`,
    { top4Ids }
  );

  if (!fakeWine) {
    throw new Error(
      "Aucune bouteille publiée hors top 4 trouvée."
    );
  }

  console.log("Top 4 canonique :", top4Ids);
  console.log(
    "Bouteille valide utilisée pour le faux clic :",
    fakeWine
  );

  const response = await fetch(
    "http://localhost:3000/api/analytics",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName: "recommendation_clicked",
        clientEventId: randomUUID(),
        sessionId: `hostile-test-${randomUUID()}`,
        occurredAt: new Date().toISOString(),
        pagePath: "/accords/agneau",

        recommendationId: fakeWine._id,

        sourceType: "pairing_detail_fr",
        sourceSlug: pairingSlug,

        metadata: {
          alcoholChoice: "with",

          // Mensonges volontaires :
          rank: 1,
          score: 100,
        },
      }),
    }
  );

  console.log("HTTP STATUS :", response.status);
  console.log("RÉPONSE :", await response.text());

  if (response.status !== 400) {
    throw new Error(
      `❌ ÉCHEC : le faux clic aurait dû être rejeté en 400, reçu ${response.status}.`
    );
  }

  console.log(
    "✅ SUCCÈS : une vraie bouteille publiée hors top 4 a été rejetée."
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
