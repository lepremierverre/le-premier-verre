"use client";

import { useState } from "react";

type GuideChecklistItem = {
  _key?: string;
  text?: string;
  textEn?: string;
};

type GuideChecklistGroup = {
  _key?: string;
  label?: string;
  labelEn?: string;
  items?: GuideChecklistItem[];
};

export type GuideChecklistValue = {
  _type: "guideChecklist";
  _key?: string;
  title?: string;
  titleEn?: string;
  groups?: GuideChecklistGroup[];
};

type GuideChecklistProps = {
  value: GuideChecklistValue;
  locale: "fr" | "en";
  mode?: "screen" | "print" | "both";
};

export default function GuideChecklist({
  value,
  locale,
  mode = "both",
}: GuideChecklistProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const isEnglish = locale === "en";

  const title = isEnglish
    ? value.titleEn || value.title
    : value.title;

  const groups = value.groups || [];

  const groupLabel = (group: GuideChecklistGroup) =>
    isEnglish
      ? group.labelEn || group.label || ""
      : group.label || "";

  const itemText = (item: GuideChecklistItem) =>
    isEnglish
      ? item.textEn || item.text || ""
      : item.text || "";

  const toggle = (id: string) => {
    setChecked((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  if (!groups.length) return null;

  return (
    <>
      {mode !== "print" ? (
      <div className="guide-checklist-screen not-prose mb-14 mt-8 overflow-hidden border border-[var(--lpv-cocoa)]/25 bg-[var(--lpv-cocoa)]/[0.06] px-6 py-7 md:mb-18 md:mt-10 md:px-9 md:py-9">
        {title ? (
          <div className="border-b border-[var(--lpv-cocoa)]/20 pb-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--lpv-cocoa)]">
              {title}
            </p>
          </div>
        ) : null}

        <div className="grid gap-x-10 md:grid-cols-3">
          {groups.map((group, groupIndex) => (
            <section
              key={group._key || groupIndex}
              className="py-5 md:py-6"
            >
              <p className="text-[0.66rem] font-medium uppercase tracking-[0.17em] text-[var(--lpv-cocoa)]">
                {groupLabel(group)}
              </p>

              <div className="mt-4 space-y-0.5">
                {(group.items || []).map((item, itemIndex) => {
                  const text = itemText(item);
                  const id = `${value._key || "checklist"}-${group._key || groupIndex}-${item._key || itemIndex}`;
                  const isChecked = Boolean(checked[id]);

                  if (!text) return null;

                  return (
                    <button
                      key={item._key || itemIndex}
                      type="button"
                      onClick={() => toggle(id)}
                      aria-pressed={isChecked}
                      className="group flex w-full items-start gap-3 py-1.5 text-left md:pr-4"
                    >
                      <span
                        aria-hidden="true"
                        className={[
                          "mt-[0.24rem] flex h-[0.9rem] w-[0.9rem] shrink-0 items-center justify-center border transition-all duration-200",
                          isChecked
                            ? "border-[var(--lpv-cocoa)] bg-[var(--lpv-cocoa)] text-[var(--lpv-paper)]"
                            : "border-[var(--lpv-cocoa)] bg-transparent",
                        ].join(" ")}
                      >
                        {isChecked ? (
                          <span className="text-[0.58rem] leading-none">✓</span>
                        ) : null}
                      </span>

                      <span
                        className={[
                          "text-sm leading-6 transition-all duration-200",
                          isChecked
                            ? "text-[var(--lpv-muted)] line-through decoration-[var(--lpv-line)]"
                            : "text-[var(--lpv-ink)]",
                        ].join(" ")}
                      >
                        {text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
      ) : null}

      {mode !== "screen" ? (
      <section className="guide-checklist-print">
        <div className="guide-checklist-print-heading">
          <p className="guide-checklist-print-kicker">
            {isEnglish ? "Practical appendix" : "Annexe pratique"}
          </p>

          <h2>
            {isEnglish
              ? "Checklist — keep it close."
              : "Checklist — à garder sous la main."}
          </h2>

          <p>
            {isEnglish
              ? "Print this page on its own and check things off as you get ready."
              : "Imprimez cette page seule et cochez au fur et à mesure de vos préparatifs."}
          </p>
        </div>

        <div className="guide-checklist-print-groups">
          {groups.map((group, groupIndex) => (
            <div
              key={`print-${group._key || groupIndex}`}
              className="guide-checklist-print-group"
            >
              <h3>{groupLabel(group)}</h3>

              <div>
                {(group.items || []).map((item, itemIndex) => {
                  const text = itemText(item);
                  if (!text) return null;

                  return (
                    <div
                      key={`print-${item._key || itemIndex}`}
                      className="guide-checklist-print-item"
                    >
                      <span aria-hidden="true" />
                      <p>{text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <footer className="guide-checklist-print-footer">
          LE PREMIER VERRE · GUIDE 01 · 2026
        </footer>
      </section>
      ) : null}
    </>
  );
}
