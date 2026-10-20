import { auth } from "@clerk/nextjs/server";

import { writeClient } from "@/sanity/lib/write-client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Non authentifié." },
        { status: 401 }
      );
    }

    const entries = await writeClient.fetch(
      `*[
        _type == "wineJournalEntry" &&
        userId == $userId
      ] | order(tastedAt desc, createdAt desc) {
        _id,
        tastedAt,
        appreciation,
        note,
        buyAgain,
        wine->{
          _id,
          name,
          "slug": slug.current,
          vintage,
          beverageType,
          alcoholFree,
          color,
          bottleImage,
          editorialImage,
          producer->{name}
        }
      }`,
      { userId }
    );

    return Response.json({ entries });
  } catch (error) {
    console.error("GET /api/journal failed:", error);

    return Response.json(
      { error: "Impossible de charger le carnet." },
      { status: 500 }
    );
  }
}
