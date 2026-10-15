import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR, enUS } from "@clerk/localizations";

import { clerkAppearance } from "@/lib/clerk-theme";

interface ClerkLocaleProviderProps {
  children: React.ReactNode;
  lang?: string;
}

export function ClerkLocaleProvider({
  children,
  lang = "fr",
}: ClerkLocaleProviderProps) {
  const localization = lang === "en" ? enUS : frFR;

  return (
    <ClerkProvider
      localization={localization}
      appearance={clerkAppearance}
    >
      {children}
    </ClerkProvider>
  );
}

export default ClerkLocaleProvider;
