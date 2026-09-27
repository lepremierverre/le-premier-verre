"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Locale = "fr" | "en";

export default function LanguageOnboarding({
  locale,
}: {
  locale: Locale;
}) {
  const router = useRouter();
  const isEn = locale === "en";

  const [language, setLanguage] = useState<Locale>(locale);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");

    try {
      const currentResponse = await fetch("/api/preferences", {
        cache: "no-store",
      });

      if (!currentResponse.ok) {
        throw new Error("preferences");
      }

      const data = await currentResponse.json();
      const existing = data.preferences;

      /*
       * Nouveau compte :
       * les 5 préférences vin ne sont pas encore remplies.
       *
       * On ne force donc PAS de fausses réponses ici.
       * La langue sera enregistrée séparément par l'API onboarding.
       */
      const response = await fetch("/api/preferences/language", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          communicationLanguage: language,
        }),
      });

      if (!response.ok) {
        throw new Error("language");
      }

      router.push(isEn ? "/en/notebook" : "/mon-carnet");
      router.refresh();
    } catch (err) {
      console.error("Language onboarding error:", err);
      setError(
        isEn
          ? "Unable to save your choice. Please try again."
          : "Impossible d’enregistrer ton choix. Réessaie."
      );
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container flex min-h-[calc(100vh-78px)] items-center py-16">
        <div className="w-full border-y border-[var(--lpv-line)] py-16 md:py-24">
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            {isEn ? "One last thing" : "Une dernière chose"}
          </p>

          <h1 className="lpv-display mt-7 max-w-5xl text-[clamp(4rem,9vw,8.5rem)] leading-[0.84]">
            {isEn ? (
              <>
                Your language
                <br />
                of communication.
              </>
            ) : (
              <>
                Ta langue
                <br />
                de communication.
              </>
            )}
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--lpv-muted)]">
            {isEn
              ? "Choose the language you prefer for communications from Le Premier Verre. You can change it at any time."
              : "Choisis la langue dans laquelle tu préfères recevoir les communications du Premier Verre. Tu pourras la modifier en tout temps."}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              { value: "fr" as const, label: "Français" },
              { value: "en" as const, label: "English" },
            ].map((option) => {
              const active = language === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLanguage(option.value)}
                  className={
                    active
                      ? "lpv-button lpv-button-dark"
                      : "lpv-button"
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="lpv-button lpv-button-dark mt-10 disabled:opacity-50"
          >
            {saving
              ? isEn
                ? "Saving…"
                : "Enregistrement…"
              : isEn
                ? "Continue →"
                : "Continuer →"}
          </button>

          {error && (
            <p className="mt-5 text-sm text-[#7a3e32]">
              {error}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
