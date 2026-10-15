"use client";

import { useEffect, useMemo, useState } from "react";
import { trackAnalyticsEvent } from "@/components/analytics/trackAnalyticsEvent";

type FavoriteButtonProps = {
  wineId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "detail" | "bare";
  locale?: "fr" | "en";
};

const buttonSizes: Record<NonNullable<FavoriteButtonProps["size"]>, string> = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

const iconSizes: Record<NonNullable<FavoriteButtonProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-5 w-5",
};

function HeartIcon({
  className = "",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19.25 5.15 12.75C3.75 11.42 3 10.15 3 8.72 3 6.45 4.72 4.9 6.92 4.9 9.02 4.9 10.48 6.18 12 7.92 13.52 6.18 14.98 4.9 17.08 4.9 19.28 4.9 21 6.45 21 8.72 21 10.15 20.25 11.42 18.85 12.75L12 19.25Z" />
    </svg>
  );
}

export default function FavoriteButton({
  wineId,
  className = "",
  size = "md",
  variant = "icon",
  locale = "fr",
}: FavoriteButtonProps) {
  const [active, setActive] = useState(false);

  const labels =
    locale === "en"
      ? {
          add: "Add to favourites",
          remove: "Remove from favourites",
          short: "Favourites",
          active: "Favourites",
        }
      : {
          add: "Ajouter aux favoris",
          remove: "Retirer des favoris",
          short: "Favoris",
          active: "Favoris",
        };
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadFavoriteState() {
      try {
        const response = await fetch(
          `/api/favorites/${encodeURIComponent(wineId)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          if (!cancelled) setLoading(false);
          return;
        }

        if (!response.ok) {
          if (!cancelled) setLoading(false);
          return;
        }

        const data = (await response.json()) as {
          favorite?: boolean;
        };

        if (!cancelled) {
          setActive(Boolean(data.favorite));
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFavoriteState();

    return () => {
      cancelled = true;
    };
  }, [wineId]);

  async function toggleFavorite() {
    if (pending) return;

    const previous = active;
    setPending(true);
    setActive(!previous);

    try {
      const response = await fetch(
        `/api/favorites/${encodeURIComponent(wineId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            favorite: !previous,
          }),
        }
      );

      if (response.status === 401) {
        setActive(previous);
        setPending(false);
        window.location.href = "/connexion";
        return;
      }

      if (!response.ok) {
        setActive(previous);
        setPending(false);
        return;
      }

      const data = (await response.json()) as {
        favorite?: boolean;
      };

      const confirmedFavorite = Boolean(data.favorite);

      setActive(confirmedFavorite);
      setPending(false);

      // Track only a confirmed transition from not-favorite to favorite.
      if (!previous && confirmedFavorite) {
        trackAnalyticsEvent("favorite_added", {
          contentId: wineId,
          contentType: "product",
        });
      }
    } catch {
      setActive(previous);
      setPending(false);
    }
  }

  const disabled = useMemo(() => loading || pending, [loading, pending]);

  if (variant === "bare") {
    return (
      <button
        type="button"
        aria-label={active ? labels.remove : labels.add}
        aria-pressed={active}
        disabled={disabled}
        onClick={toggleFavorite}
        className={[
          "group inline-flex items-center justify-center text-[var(--lpv-ink)]",
          "transition-opacity duration-300 hover:opacity-55",
          disabled ? "opacity-40" : "",
          className,
        ].join(" ")}
      >
        <HeartIcon
          filled={active}
          className={[
            "h-[14px] w-[14px] transition-all duration-300",
            active ? "scale-[0.94] text-[#7A263A]" : "",
          ].join(" ")}
        />
      </button>
    );
  }

  if (variant === "detail") {
    return (
      <button
        type="button"
        aria-label={active ? labels.remove : labels.add}
        aria-pressed={active}
        disabled={disabled}
        onClick={toggleFavorite}
        className={[
          "inline-flex h-5 w-5 items-center justify-center",
          "transition-opacity duration-300 hover:opacity-50",
          disabled ? "opacity-40" : "",
          className,
        ].join(" ")}
      >
        <HeartIcon
          filled={active}
          className={[
            "h-[12px] w-[12px]",
            active ? "text-[#7A263A]" : "text-[var(--lpv-muted)]",
          ].join(" ")}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={active ? labels.remove : labels.add}
      aria-pressed={active}
      disabled={disabled}
      onClick={toggleFavorite}
      className={[
        "inline-flex items-center justify-center rounded-full border transition-all duration-300",
        "border-[var(--lpv-line)] bg-[var(--lpv-paper-light)]/90 text-[var(--lpv-ink)]",
        "hover:border-[var(--lpv-ink)] hover:bg-[var(--lpv-paper-light)]",
        buttonSizes[size],
        active ? "border-[var(--lpv-ink)]" : "",
        disabled ? "opacity-60" : "",
        className,
      ].join(" ")}
    >
      <HeartIcon
        filled={active}
        className={[
          "transition-all duration-300",
          active ? "scale-[0.92]" : "",
          iconSizes[size],
        ].join(" ")}
      />
    </button>
  );
}
