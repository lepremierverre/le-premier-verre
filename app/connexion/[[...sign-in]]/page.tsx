"use client";

import { SignIn, useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function ConnexionPage() {
  const { signOut } = useClerk();

  useEffect(() => {
    // Si Safari tente de charger avec un cookie de session corrompu/expiré (HTTP 400),
    // on intercepte l'erreur dans la console pour forcer un rafraîchissement propre
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.status === 400 || event.reason?.message?.includes("400")) {
        console.warn("Session Clerk corrompue détectée, réinitialisation automatique...");
        signOut().then(() => {
          window.location.reload();
        });
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  }, [signOut]);

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-none border-0 bg-transparent",
          },
        }}
      />
    </main>
  );
}
