import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { client } from "@/sanity/lib/client";

type PreferredLanguage = "fr" | "en";

export const dynamic = "force-dynamic";

export default async function AfterSignInPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/connexion");
  }

  const preferences = await client.fetch<{
    communicationLanguage?: PreferredLanguage;
  } | null>(
    `*[
      _type == "userPreferences" &&
      userId == $userId
    ][0]{
      communicationLanguage
    }`,
    { userId },
    { cache: "no-store" }
  );

  if (preferences?.communicationLanguage === "en") {
    redirect("/en/notebook");
  }

  redirect("/mon-carnet");
}
