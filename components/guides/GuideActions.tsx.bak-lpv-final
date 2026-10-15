"use client";

import { useState } from "react";

type GuideActionsProps = {
  locale: "fr" | "en";
  title: string;
};

export default function GuideActions({
  locale,
  title,
}: GuideActionsProps) {
  const [copied, setCopied] = useState(false);
  const isEnglish = locale === "en";

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.prompt(
        isEnglish ? "Copy this link:" : "Copiez ce lien :",
        url
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="guide-actions border-b border-[var(--lpv-line)] py-10 md:py-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="lpv-kicker text-[var(--lpv-cocoa)]">
            {isEnglish ? "Keep this guide" : "Garder ce guide"}
          </p>

          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--lpv-muted)]">
            {isEnglish
              ? "Share it or keep a paper copy close at hand."
              : "Partagez-le ou gardez une copie papier à portée de main."}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleShare}
            className="lpv-text-link"
          >
            {copied
              ? isEnglish
                ? "Link copied ✓"
                : "Lien copié ✓"
              : isEnglish
                ? "Share ↗"
                : "Partager ↗"}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="lpv-text-link"
          >
            {isEnglish ? "Print ↗" : "Imprimer ↗"}
          </button>
        </div>
      </div>
    </section>
  );
}
