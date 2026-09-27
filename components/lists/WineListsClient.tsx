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
      <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-8 sm:px-8 md:px-12 md:pb-24 md:pt-10 lg:px-16">
        {/* MA CAVE */}
        <header>
          <div className="grid gap-6 py-1 md:grid-cols-[1fr_0.42fr] md:items-end md:gap-12 md:py-4">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                {isEn ? "My cellar" : "Ma cave"}
              </p>

              <h1 className="lpv-display mt-4 text-[clamp(3.2rem,13vw,4.2rem)] leading-[0.86] md:mt-5 md:text-[clamp(4rem,7vw,6.5rem)] md:leading-[0.84]">
                {isEn ? "My lists." : "Mes listes."}
              </h1>
            </div>

            <div className="border-t border-[var(--lpv-line)] pt-5 md:border-t-0 md:pb-1">
              <p className="max-w-sm text-[0.95rem] leading-7 text-[var(--lpv-muted)] md:text-base md:leading-8">
                {isEn
                  ? "Keep bottles together by occasion, mood or simply so you don’t forget them."
                  : "Garde certaines bouteilles ensemble selon l’occasion, l’envie ou simplement pour ne pas les oublier."}
              </p>
            </div>
          </div>
        </header>

        <CaveNav />

        <section className="border-b border-[var(--lpv-line)] py-7 md:py-10">
          <div className="grid gap-5 md:grid-cols-[1fr_0.42fr] md:items-end md:gap-12">
            <div>
              <p className="lpv-kicker text-[var(--lpv-cocoa)]">
                {isEn ? "Collections" : "Collections"}
              </p>

              <h2 className="lpv-display mt-3 text-[2.8rem] leading-[0.9] md:mt-4 md:text-6xl">
                {isEn ? "Put them together." : "À rassembler."}
              </h2>
            </div>

            <form
              onSubmit={createList}
              className="border-t border-[var(--lpv-line)] pt-5"
            >
              <label
                htmlFor="list-name"
                className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-[var(--lpv-muted)]"
              >
                {isEn ? "New list" : "Nouvelle liste"}
              </label>

              <div className="mt-3 flex border-b border-[var(--lpv-ink)]">
                <input
                  id="list-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={80}
                  placeholder={isEn ? "E.g. To try" : "Ex. À essayer"}
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-[var(--lpv-muted)] md:py-3 md:text-lg"
                />

                <button
                  type="submit"
                  disabled={!name.trim() || pending}
                  className="px-3 text-[0.6rem] font-medium uppercase tracking-[0.16em] transition disabled:opacity-35"
                >
                  {pending
                    ? isEn
                      ? "Creating…"
                      : "Création…"
                    : isEn
                      ? "Create →"
                      : "Créer →"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {error ? (
          <p className="border-b border-[var(--lpv-line)] py-5 text-sm">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="py-10 text-sm uppercase tracking-[0.18em] text-[var(--lpv-muted)] md:py-16">
            {isEn ? "Loading…" : "Chargement…"}
          </p>
        ) : lists.length === 0 ? (
          <section className="py-12 md:py-28">
            <p className="lpv-display max-w-3xl text-[2.8rem] leading-[0.92] tracking-[-0.05em] md:text-7xl md:leading-[0.9]">
              {isEn ? "Your first list starts with a bottle." : "Ta première liste commence par une bouteille."}
            </p>

            <Link
              href={isEn ? "/en/wines" : "/vins"}
              className="mt-7 inline-flex border-b border-[var(--lpv-ink)] pb-1 text-xs uppercase tracking-[0.22em] md:mt-10"
            >
              {isEn ? "Explore bottles →" : "Explorer les bouteilles →"}
            </Link>
          </section>
        ) : (
          <div>
            {lists.map((list, index) => {
              const wines = list.wines ?? [];

              return (
                <section
                  key={list._id}
                  className="grid gap-5 border-b border-[var(--lpv-line)] py-8 md:grid-cols-[0.28fr_0.72fr] md:gap-8 md:py-16"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--lpv-muted)]">
                      {isEn ? "List" : "Liste"} {String(index + 1).padStart(2, "0")}
                    </p>

                    <h2 className="lpv-display mt-3 text-[2.6rem] leading-[0.9] tracking-[-0.05em] md:mt-4 md:text-6xl">
                      {list.name}
                    </h2>

                    <p className="mt-3 text-sm text-[var(--lpv-muted)] md:mt-5">
                      {wines.length} {isEn ? `bottle${wines.length === 1 ? "" : "s"}` : `bouteille${wines.length === 1 ? "" : "s"}`}
                    </p>

                    <button
                      type="button"
                      onClick={() => deleteList(list._id)}
                      className="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--lpv-muted)] transition hover:text-[var(--lpv-ink)] md:mt-8"
                    >
                      {isEn ? "Delete list" : "Supprimer la liste"}
                    </button>
                  </div>

                  <div>
                    {wines.length === 0 ? (
                      <div className="border-t border-[var(--lpv-line)] py-5 md:py-6">
                        <p className="text-sm leading-7 text-[var(--lpv-muted)]">
                          {isEn ? "No bottles in this list yet." : "Aucune bouteille dans cette liste pour le moment."}
                        </p>

                        <Link
                          href={isEn ? "/en/wines" : "/vins"}
                          className="mt-4 inline-flex border-b border-[var(--lpv-ink)] pb-1 text-xs uppercase tracking-[0.2em] md:mt-5"
                        >
                          {isEn ? "Add a bottle →" : "Ajouter une bouteille →"}
                        </Link>
                      </div>
                    ) : (
                      <div className="border-t border-[var(--lpv-line)]">
                        {wines.map((wine) => (
                          <div
                            key={wine._id}
                            className="flex items-center justify-between gap-4 border-b border-[var(--lpv-line)] py-4 md:gap-6 md:py-6"
                          >
                            <Link
                              href={
                                wine.slug
                                  ? `${isEn ? "/en/wines" : "/vins"}/${wine.slug}`
                                  : isEn ? "/en/wines" : "/vins"
                              }
                              className="group min-w-0"
                            >
                              <p className="text-xs uppercase tracking-[0.18em] text-[var(--lpv-muted)]">
                                {wine.producer?.name ?? (isEn ? "Producer" : "Producteur")}
                              </p>

                              <p className="mt-1.5 text-lg leading-6 transition group-hover:opacity-60 md:mt-2 md:text-xl">
                                {wine.name}
                                {wine.vintage ? ` · ${wine.vintage}` : ""}
                              </p>
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                removeWine(list._id, wine._id)
                              }
                              className="shrink-0 text-xs uppercase tracking-[0.18em] text-[var(--lpv-muted)] transition hover:text-[var(--lpv-ink)]"
                            >
                              {isEn ? "Remove" : "Retirer"}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
