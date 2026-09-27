import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import LanguageOnboarding from "@/components/onboarding/LanguageOnboarding";

export default async function BienvenuePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/inscription");
  }

  return <LanguageOnboarding locale="fr" />;
}
