import { prisma } from "../lib/prisma";

async function main() {
  const event = await prisma.analyticsEvent.findFirst({
    where: {
      eventName: "recommendation_clicked",
    },
    orderBy: {
      receivedAt: "desc",
    },
    select: {
      id: true,
      clientEventId: true,
      eventName: true,
      eventVersion: true,
      occurredAt: true,
      receivedAt: true,
      environment: true,
      isReportable: true,
      qualityReason: true,
      sessionId: true,
      pagePath: true,

      contentId: true,
      contentType: true,
      contentSlug: true,

      producerId: true,
      producerSlug: true,

      beverageType: true,
      isAlcoholFree: true,
      country: true,
      region: true,
      isQuebec: true,
      price: true,
      priceBand: true,

      sourceType: true,
      sourceId: true,
      sourceSlug: true,

      recommendationId: true,
      recommendationReason: true,

      destinationType: true,
      destinationId: true,
      destinationUrl: true,

      metadata: true,
    },
  });

  console.dir(event, {
    depth: null,
    colors: false,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
