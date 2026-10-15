import { prisma } from "../lib/prisma";

async function main() {
  const clientEventId = "lpv-idem-1791665698-31555";

  const rows = await prisma.analyticsEvent.findMany({
    where: { clientEventId },
    select: {
      id: true,
      clientEventId: true,
      eventName: true,
      isReportable: true,
      qualityReason: true,
    },
  });

  console.log("\n===== VÉRIFICATION EN BASE =====");
  console.dir(rows, { depth: null });
  console.log("Nombre d'enregistrements :", rows.length);

  if (rows.length !== 1) {
    throw new Error(`ÉCHEC : attendu 1 enregistrement, trouvé ${rows.length}.`);
  }

  console.log("✅ TEST D'IDEMPOTENCE RÉUSSI");
}

main()
  .catch((error) => {
    console.error("❌ TEST ÉCHOUÉ", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
