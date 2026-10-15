import { prisma } from "@/lib/prisma";

export async function getCellarByUser(userId: string) {
  return prisma.cellarBottle.findMany({
    where: {
      userId,
    },
    include: {
      wine: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function addBottleToCellar(
  userId: string,
  wineId: string,
  quantity = 1
) {
  return prisma.cellarBottle.create({
    data: {
      userId,
      wineId,
      quantity,
    },
    include: {
      wine: true,
    },
  });
}
export async function createCellarBottle(
  userId: string,
  data: {
    wineId: string;
    quantity: number;
    purchasePrice: number | null;
    purchaseDate: Date | null;
    location: string | null;
    drinkingWindow: string | null;
    personalNote: string | null;
    rating: number | null;
  }
) {
  return prisma.cellarBottle.create({
    data: {
      userId,
      ...data,
    },
    include: {
      wine: true,
    },
  });
}
