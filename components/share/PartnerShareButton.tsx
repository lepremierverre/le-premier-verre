"use client";

import { useState } from "react";

type PartnerShareButtonProps = {
  name: string;
  imageUrl?: string;
  location?: string;
  locale: "fr" | "en";
  profileUrl: string;
  kind: "producer" | "place";
};

export default function PartnerShareButton({
  name,
  locale,
  profileUrl,
}: PartnerShareButtonProps) {
  const [sharing, setSharing] = useState(false);

  const label =
    locale === "fr" ? "Partager cette fiche" : "Share this profile";

  const sharingLabel =
    locale === "fr" ? "Partage…" : "Sharing…";

  async function handleShare() {
    if (sharing) return;

    const url = new URL(profileUrl, window.location.origin).toString();

    const text =
      locale === "fr"
        ? `Découvre ${name} sur Le Premier Verre.`
        : `Discover ${name} on Le Premier Verre.`;

    setSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name} — Le Premier Verre`,
          text,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      window.alert(
        locale === "fr"
          ? "Lien copié."
          : "Link copied."
      );
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error("Partner share failed:", error);

      try {
        await navigator.clipboard.writeText(url);

        window.alert(
          locale === "fr"
            ? "Lien copié."
            : "Link copied."
        );
      } catch {
        window.location.href = url;
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={handleShare}
        disabled={sharing}
        aria-label={sharing ? sharingLabel : label}
        title={label}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--lpv-line)] text-[var(--lpv-ink)] transition-opacity hover:opacity-55 disabled:opacity-45"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 15V3" />
          <path d="m8 7 4-4 4 4" />
          <path d="M5 12v7h14v-7" />
        </svg>
      </button>
    </div>
  );
}
