import { prisma } from "../lib/prisma";

async function main() {
  const rows = await prisma.analyticsEvent.findMany({
    where: {
      eventName: "recommendation_impression",
      pagePath: "/accords/agneau",
    },
    orderBy: {
      receivedAt: "desc",
    },
    take: 12,
    select: {
      id: true,
      clientEventId: true,
      receivedAt: true,
      sessionId: true,
      recommendationId: true,
      contentSlug: true,
      producerSlug: true,
      sourceType: true,
      sourceId: true,
      sourceSlug: true,
      price: true,
      priceBand: true,
      metadata: true,
      isReportable: true,
      qualityReason: true,
      duplicateOfId: true,
    },
  });

  console.log("\n===== DERNIÈRES IMPRESSIONS /accords/agneau =====");

  for (const row of rows) {
    console.dir(row, { depth: null });
  }

  console.log("\nNombre affiché :", rows.length);
}

main()
  .catch((error) => {
    console.error("❌ LECTURE ÉCHOUÉE");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
