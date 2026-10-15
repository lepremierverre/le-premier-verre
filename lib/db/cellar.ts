import { prisma } from "@/lib/prisma";
import { client } from "@/sanity/lib/client";

type CellarContent = {
  _id: string;
  name: string;
  slug: string | null;
  beverageType: string | null;
  alcoholFree: boolean;
  vintage: number | null;
  color: string | null;
  approxPrice: number | null;
  producer: {
    name: string | null;
    slug: string | null;
  } | null;
  country: {
    name: string | null;
  } | null;
  region: {
    name: string | null;
  } | null;
};

async function getSanityContent(contentIds: string[]) {
  if (!contentIds.length) return new Map<string, CellarContent>();

  const products = await client.fetch<CellarContent[]>(
    `*[_type == "wine" && _id in $contentIds]{
      _id,
      name,
      "slug": slug.current,
      beverageType,
      "alcoholFree": coalesce(alcoholFree, false),
      vintage,
      color,
      approxPrice,
      "producer": producer->{
        name,
        "slug": slug.current
      },
      "country": country->{
        name
      },
      "region": region->{
        name
      }
    }`,
    { contentIds }
  );

  return new Map(products.map((product) => [product._id, product]));
}

export async function getCellarByUser(userId: string) {
  const items = await prisma.cellarBottle.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const contentById = await getSanityContent(
    [...new Set(items.map((item) => item.contentId))]
  );

  return items.map((item) => ({
    ...item,
    wine: contentById.get(item.contentId) ?? null,
  }));
}

export async function createCellarBottle(
  userId: string,
  data: {
    contentId: string;
    contentType: string;
    quantity: number;
    purchasePrice: number | null;
    purchaseDate: Date | null;
    location: string | null;
    drinkingWindow: string | null;
    personalNote: string | null;
    rating: number | null;
  }
) {
  const item = await prisma.cellarBottle.create({
    data: {
      userId,
      ...data,
    },
  });

  const contentById = await getSanityContent([item.contentId]);

  return {
    ...item,
    wine: contentById.get(item.contentId) ?? null,
  };
}
