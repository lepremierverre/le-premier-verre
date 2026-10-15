import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR, enUS } from "@clerk/localizations";

interface ClerkLocaleProviderProps {
  children: React.ReactNode;
  lang?: string;
}

export default function ClerkLocaleProvider({ children, lang = "fr" }: ClerkLocaleProviderProps) {
  return (
    <ClerkProvider localization={lang === "en" ? enUS : frFR}>
      {children}
    </ClerkProvider>
  );
}
