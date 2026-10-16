"use client";

import { useState } from "react";

type PartnerShareButtonProps = {
  name: string;
  imageUrl?: string | null;
  locale: "fr" | "en";
  profileUrl: string;
  kind: "producer" | "place";
};

export default function PartnerShareButton({
  name,
  imageUrl,
  locale,
  profileUrl,
}: PartnerShareButtonProps) {
  const [sharing, setSharing] = useState(false);

  const label =
    locale === "fr" ? "Partager cette fiche" : "Share this profile";

  const sharingLabel =
    locale === "fr" ? "Partage…" : "Sharing…";

  async function shareUrl(url: string, text: string) {
    await navigator.share({
      title: `${name} — Le Premier Verre`,
      text,
      url,
    });
  }

  async function handleShare() {
    if (sharing) return;

    const url = new URL(profileUrl, window.location.origin).toString();

    const text =
      locale === "fr"
        ? `Découvre ${name} sur Le Premier Verre.`
        : `Discover ${name} on Le Premier Verre.`;

    setSharing(true);

    try {
      if (navigator.share && imageUrl) {
        try {
          const absoluteImageUrl = new URL(
            imageUrl,
            window.location.origin
          ).toString();

          const response = await fetch(absoluteImageUrl);

          if (response.ok) {
            const blob = await response.blob();

            const extension =
              blob.type === "image/png" ? "png" : "jpg";

            const file = new File(
              [blob],
              `le-premier-verre-${name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")}.${extension}`,
              {
                type: blob.type || "image/jpeg",
              }
            );

            if (
              navigator.canShare &&
              navigator.canShare({ files: [file] })
            ) {
              await navigator.share({
                title: `${name} — Le Premier Verre`,
                text: `${text}\n${url}`,
                files: [file],
              });

              return;
            }
          }
        } catch (mediaError) {
          console.warn(
            "Media share unavailable, falling back to URL share:",
            mediaError
          );
        }
      }

      await shareUrl(url, text);
      return;

      await navigator.clipboard.writeText(url);

      window.alert(
        locale === "fr" ? "Lien copié." : "Link copied."
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
          locale === "fr" ? "Lien copié." : "Link copied."
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
        onClick={() => {
          window.location.href = "instagram-stories://share";
        }}
        className="mb-2 rounded-full border border-[var(--lpv-line)] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-[var(--lpv-ink)]"
      >
        Tester Story Instagram
      </button>

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
