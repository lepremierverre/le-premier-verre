"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useSearch } from "@/hooks/useSearch";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "fr";
  const isEn = locale === "en";

  const { data } = useSearch(query, locale);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    function openSearch() {
      setOpen(true);
    }

    window.addEventListener("keydown", handleKeyboard);
    window.addEventListener("open-search", openSearch as EventListener);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
      window.removeEventListener("open-search", openSearch as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const hasQuery = query.trim().length >= 2;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[10000] bg-[var(--lpv-ink)]/35 backdrop-blur-[3px]" />

        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[14vh] z-[10001] max-h-[72vh] w-[calc(100vw-32px)] max-w-[820px] -translate-x-1/2 overflow-y-auto bg-[var(--lpv-paper)] text-[var(--lpv-ink)] shadow-[0_24px_70px_rgba(33,29,26,0.14)] md:w-[calc(100vw-80px)]"
        >
          <Dialog.Title className="sr-only">
            {isEn ? "Search Le Premier Verre" : "Rechercher sur Le Premier Verre"}
          </Dialog.Title>

          <div className="flex items-center justify-between border-b border-[var(--lpv-line)] px-6 py-4 md:px-8">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em]">
              {isEn ? "Search" : "Recherche"}
            </p>

            <Dialog.Close
              aria-label={isEn ? "Close" : "Fermer"}
              className="text-xl font-light leading-none transition-opacity hover:opacity-50"
            >
              ×
            </Dialog.Close>
          </div>

          <SearchInput value={query} onChange={setQuery} locale={locale} />

          {hasQuery ? (
            <div className="border-t border-[var(--lpv-line)]">
              <SearchResults
                results={data}
                onNavigate={() => setOpen(false)}
                locale={locale}
              />
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
