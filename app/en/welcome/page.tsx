import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import LanguageOnboarding from "@/components/onboarding/LanguageOnboarding";

export default async function WelcomePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/en/sign-up");
  }

  return <LanguageOnboarding locale="en" />;
}
