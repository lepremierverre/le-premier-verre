"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { enUS, frFR } from "@clerk/localizations";
import { usePathname } from "next/navigation";

import { clerkAppearance } from "@/lib/clerk-theme";

export default function ClerkLocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEn = pathname?.startsWith("/en") ?? false;

  return (
    <ClerkProvider
      localization={isEn ? enUS : frFR}
      appearance={clerkAppearance}
      proxyUrl="/__clerk"
    >
      {children}
    </ClerkProvider>
  );
}
