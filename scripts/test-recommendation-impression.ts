import { randomUUID } from "node:crypto";

import { POST } from "../app/api/analytics/route";
import { prisma } from "../lib/prisma";
import { getPairingRecommendations } from "../lib/recommendations/pairing-recommendations";

async function main() {
  const pairingSlug = "agneau";
  const alcoholChoice = "with" as const;

  const canonical = await getPairingRecommendations(
    pairingSlug,
    alcoholChoice
  );

  if (!canonical.food) {
    throw new Error("Accord agneau introuvable.");
  }

  const candidate = canonical.candidates[0];

  if (!candidate) {
    throw new Error("Aucune recommandation canonique.");
  }

  const clientEventId = randomUUID();
  const sessionId = randomUUID();

  console.log("Recommandation canonique testée :", {
    id: candidate.wine._id,
    name: candidate.wine.name,
    rank: candidate.recommendationRank,
    score: candidate.recommendationScore,
  });

  const request = new Request("http://localhost/api/analytics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventName: "recommendation_impression",
      clientEventId,
      sessionId,
      occurredAt: new Date().toISOString(),
      pagePath: "/accords/agneau",

      recommendationId: candidate.wine._id,
      sourceType: "pairing_detail_fr",
      sourceSlug: pairingSlug,

      metadata: {
        alcoholChoice,

        // Valeurs volontairement mensongères :
        // le serveur ne doit PAS les conserver.
        rank: 999,
        score: 999,
      },

      // Autres valeurs mensongères :
      contentType: "fake",
      price: 99999,
      priceBand: "fake",
      sourceId: "fake-source",
      recommendationReason: "fake-reason",
    }),
  });

  const response = await POST(request);
  const responseBody = await response.text();

  console.log("HTTP STATUS :", response.status);
  console.log("RÉPONSE :", responseBody);

  const row = await prisma.analyticsEvent.findUnique({
    where: {
      clientEventId,
    },
  });

  console.log("\n===== LIGNE DB =====");
  console.dir(row, { depth: null });

  if (response.status !== 201) {
    throw new Error(
      `L'impression valide aurait dû être acceptée, reçu ${response.status}.`
    );
  }

  if (!row) {
    throw new Error("Aucune ligne analytics créée.");
  }

  if (row.eventName !== "recommendation_impression") {
    throw new Error("Mauvais eventName.");
  }

  if (row.recommendationId !== candidate.wine._id) {
    throw new Error("recommendationId non canonique.");
  }

  if (row.sourceId !== canonical.food._id) {
    throw new Error("sourceId non canonique.");
  }

  if (row.sourceSlug !== canonical.food.slug) {
    throw new Error("sourceSlug non canonique.");
  }

  if (row.contentType !== "product") {
    throw new Error("contentType non canonique.");
  }

  if (row.recommendationReason !== null) {
    throw new Error("recommendationReason devrait être null.");
  }

  const metadata = row.metadata as {
    pairingId?: string;
    pairingSlug?: string;
    alcoholChoice?: string;
    rank?: number;
    score?: number;
  } | null;

  if (
    metadata?.pairingId !== canonical.food._id ||
    metadata?.pairingSlug !== canonical.food.slug ||
    metadata?.alcoholChoice !== alcoholChoice ||
    metadata?.rank !== candidate.recommendationRank ||
    metadata?.score !== candidate.recommendationScore
  ) {
    throw new Error("Metadata non canonique.");
  }

  if (row.price === 99999 || row.priceBand === "fake") {
    throw new Error("Le serveur a accepté un faux prix.");
  }

  console.log(
    "\n✅ SUCCÈS : recommendation_impression est recalculée et canonisée par le serveur."
  );
}

main()
  .catch((error) => {
    console.error("\n❌ TEST ÉCHOUÉ");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
