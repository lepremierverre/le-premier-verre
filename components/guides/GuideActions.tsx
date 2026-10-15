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
          <p className="text-sm font-semibold text-[var(--lpv-ink)]">
            {isEnglish ? "Keep this guide" : "Garder ce guide"}
          </p>

          <p className="mt-2 text-sm font-normal leading-6 text-[var(--lpv-ink)]">
            {isEnglish
              ? "Share it or keep a paper copy close at hand."
              : "Partagez-le ou gardez une copie papier à portée de main."}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-3 py-2.5 !text-[0.68rem] !font-medium uppercase !tracking-[0.16em] text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
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
            className="inline-flex items-center gap-3 py-2.5 !text-[0.68rem] !font-medium uppercase !tracking-[0.16em] text-[var(--lpv-ink)] transition-opacity hover:opacity-50"
          >
            {isEnglish ? "Print" : "Imprimer"}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}
