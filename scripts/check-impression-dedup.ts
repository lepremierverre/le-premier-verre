import { prisma } from "../lib/prisma";

const SESSION_ID =
  "dedup-impression-session-1791664203-27535";

async function main() {
  const rows = await prisma.analyticsEvent.findMany({
    where: {
      eventName: "recommendation_impression",
      sessionId: SESSION_ID,
    },
    orderBy: {
      receivedAt: "asc",
    },
    select: {
      id: true,
      clientEventId: true,
      receivedAt: true,
      sessionId: true,
      recommendationId: true,
      sourceId: true,
      sourceSlug: true,
      metadata: true,
      isReportable: true,
      qualityReason: true,
      duplicateOfId: true,
    },
  });

  console.log("\n===== TEST DÉDUPLICATION =====");

  for (const row of rows) {
    console.dir(row, { depth: null });
  }

  console.log("\n===== VALIDATION =====");

  if (rows.length !== 2) {
    console.log(`❌ Attendu 2 lignes, trouvé ${rows.length}.`);
    return;
  }

  const original = rows.find(
    (row) => row.isReportable === true
  );

  const duplicate = rows.find(
    (row) =>
      row.isReportable === false &&
      row.qualityReason === "rapid_duplicate"
  );

  if (!original) {
    console.log("❌ Aucune impression reportable trouvée.");
    return;
  }

  if (!duplicate) {
    console.log("❌ Aucun doublon rapid_duplicate trouvé.");
    return;
  }

  if (duplicate.duplicateOfId !== original.id) {
    console.log(
      "❌ duplicateOfId ne pointe pas vers l'impression originale."
    );
    return;
  }

  console.log("✅ 2 événements bruts conservés");
  console.log("✅ 1 seule impression reportable");
  console.log("✅ doublon marqué rapid_duplicate");
  console.log("✅ duplicateOfId pointe vers l'original");
  console.log("✅ anti-gonflement recommendation_impression opérationnel");
}

main()
  .catch((error) => {
    console.error("❌ TEST ÉCHOUÉ");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
