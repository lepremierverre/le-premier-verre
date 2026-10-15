"use client";

import Link from "next/link";
import CaveNav from "@/components/cave/CaveNav";
import { FormEvent, useCallback, useEffect, useState } from "react";

type ListWine = {
  _id: string;
  name?: string;
  slug?: string;
  vintage?: number;
  approxPrice?: number;
  producer?: {
    name?: string;
  };
};

type WineList = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  wines?: ListWine[];
};

export default function WineListsClient({
  locale = "fr",
}: {
  locale?: "fr" | "en";
}) {
  const isEn = locale === "en";
  const [lists, setLists] = useState<WineList[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const loadLists = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/lists", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(isEn ? "Unable to load your lists." : "Impossible de charger les listes.");
      }

      const data = await response.json();
      setLists(Array.isArray(data.lists) ? data.lists : []);
    } catch {
      setError(isEn ? "Unable to load your lists right now." : "Impossible de charger tes listes pour le moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  async function createList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName || pending) return;

    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (!response.ok) {
        throw new Error(isEn ? "Unable to create the list." : "Impossible de créer la liste.");
      }

      setName("");
      await loadLists();
    } catch {
      setError(isEn ? "Unable to create this list." : "Impossible de créer cette liste.");
    } finally {
      setPending(false);
    }
  }

  async function deleteList(listId: string) {
    const confirmed = window.confirm(
      isEn ? "Delete this list? The bottles will remain in your account." : "Supprimer cette liste? Les bouteilles ne seront pas supprimées de ton compte."
    );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(
        `/api/lists/${encodeURIComponent(listId)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(isEn ? "Unable to delete the list." : "Impossible de supprimer la liste.");
      }

      setLists((current) =>
        current.filter((list) => list._id !== listId)
      );
    } catch {
      setError(isEn ? "Unable to delete this list." : "Impossible de supprimer cette liste.");
    }
  }

  async function removeWine(listId: string, wineId: string) {
    setError("");

    try {
      const response = await fetch(
        `/api/lists/${encodeURIComponent(listId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "remove",
            wineId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(isEn ? "Unable to remove the bottle." : "Impossible de retirer le vin.");
      }

      setLists((current) =>
        current.map((list) =>
          list._id === listId
            ? {
                ...list,
                wines: (list.wines ?? []).filter(
                  (wine) => wine._id !== wineId
                ),
              }
            : list
        )
      );
    } catch {
      setError(isEn ? "Unable to remove this bottle from the list." : "Impossible de retirer cette bouteille de la liste.");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--lpv-paper)] text-[var(--lpv-ink)]">
      <section className="lpv-container pt-10 md:pt-16">
        <h1 className="lpv-display text-[clamp(3.6rem,8vw,7rem)] leading-[0.88] tracking-[-0.045em]">
          {isEn ? "Lists." : "Listes."}
        </h1>

        <p className="mt-6 max-w-xl text-[0.95rem] leading-7 md:text-base">
          {isEn
            ? "Your selections, for an occasion or for later."
            : "Tes sélections, pour une occasion ou pour plus tard."}
        </p>
      </section>

      <div className="mt-14 md:mt-20">
        <CaveNav />
      </div>

      <section className="lpv-container">
        <form
          onSubmit={createList}
          className="flex flex-col gap-3 border-b border-[var(--lpv-line)] py-6 sm:flex-row sm:items-end sm:gap-6"
        >
          <div className="min-w-0 flex-1">
            <label
              htmlFor="list-name"
              className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-muted)]"
            >
              {isEn ? "New list" : "Nouvelle liste"}
            </label>

            <input
              id="list-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              placeholder={isEn ? "E.g. To try" : "Ex. À essayer"}
              className="mt-2 block w-full border-0 bg-transparent py-1 text-[1.15rem] outline-none placeholder:text-[var(--lpv-muted)] sm:text-[1.3rem]"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || pending}
            className="inline-flex w-fit shrink-0 items-center border-b border-[var(--lpv-ink)] pb-1 text-[0.72rem] font-medium transition-opacity hover:opacity-50 disabled:opacity-30"
          >
            {pending
              ? isEn
                ? "Creating…"
                : "Création…"
              : isEn
                ? "Create →"
                : "Créer →"}
          </button>
        </form>

        {error ? (
          <p className="border-b border-[var(--lpv-line)] py-5 text-sm">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="py-12 text-sm text-[var(--lpv-muted)]">
            {isEn ? "Loading…" : "Chargement…"}
          </p>
        ) : lists.length === 0 ? (
          <div className="py-14 md:py-20">
            <p className="text-base">
              {isEn
                ? "No lists yet."
                : "Aucune liste pour le moment."}
            </p>

            <Link
              href={isEn ? "/en/wines" : "/vins"}
              className="mt-6 inline-flex items-center gap-3 text-sm font-medium transition-opacity hover:opacity-50"
            >
              {isEn ? "View wines" : "Voir les vins"} <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="pb-14 md:pb-20">
            {lists.map((list) => {
              const wines = list.wines ?? [];

              return (
                <section
                  key={list._id}
                  className="border-b border-[var(--lpv-line)] py-9 md:py-12"
                >
                  <div className="flex items-end justify-between gap-6 pb-6 md:pb-8">
                    <div className="flex min-w-0 items-baseline gap-4 md:gap-6">
                      <h2 className="lpv-display truncate text-[2.8rem] leading-[0.9] tracking-[-0.035em] md:text-[4.2rem]">
                        {list.name}
                      </h2>

                      <span className="shrink-0 text-[12px] text-[var(--lpv-muted)]">
                        {wines.length}{" "}
                        {isEn
                          ? `bottle${wines.length === 1 ? "" : "s"}`
                          : `bouteille${wines.length === 1 ? "" : "s"}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteList(list._id)}
                      className="shrink-0 pb-1 text-[12px] text-[var(--lpv-muted)] transition-opacity hover:opacity-50"
                    >
                      {isEn ? "Delete" : "Supprimer"}
                    </button>
                  </div>

                  {wines.length === 0 ? (
                    <div className="border-t border-[var(--lpv-line)] py-6">
                      <p className="text-[14px] text-[var(--lpv-muted)]">
                        {isEn
                          ? "No bottles in this list yet."
                          : "Aucune bouteille dans cette liste pour le moment."}
                      </p>

                      <Link
                        href={isEn ? "/en/wines" : "/vins"}
                        className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-50"
                      >
                        {isEn ? "Add a bottle" : "Ajouter une bouteille"} <span>→</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="border-t border-[var(--lpv-line)]">
                      {wines.map((wine) => (
                        <div
                          key={wine._id}
                          className="flex items-center justify-between gap-6 border-b border-[var(--lpv-line)] py-5 md:py-6"
                        >
                          <Link
                            href={
                              wine.slug
                                ? `${isEn ? "/en/wines" : "/vins"}/${wine.slug}`
                                : isEn
                                  ? "/en/wines"
                                  : "/vins"
                            }
                            className="group min-w-0"
                          >
                            <p className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-muted)]">
                              {wine.producer?.name ??
                                (isEn ? "Producer" : "Producteur")}
                            </p>

                            <p className="mt-2 text-[1.05rem] leading-6 transition-opacity group-hover:opacity-55 md:text-[1.2rem]">
                              {wine.name}
                              {wine.vintage ? ` · ${wine.vintage}` : ""}
                            </p>
                          </Link>

                          <button
                            type="button"
                            onClick={() => removeWine(list._id, wine._id)}
                            className="shrink-0 text-[12px] text-[var(--lpv-muted)] transition-opacity hover:opacity-50"
                          >
                            {isEn ? "Remove" : "Retirer"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
