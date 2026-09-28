type GuideTableColumn = {
  _key?: string;
  label?: string;
  labelEn?: string;
};

type GuideTableCell = {
  _key?: string;
  text?: string;
  textEn?: string;
};

type GuideTableRow = {
  _key?: string;
  cells?: GuideTableCell[];
};

export type GuideTableValue = {
  _type: "guideTable";
  _key?: string;
  title?: string;
  titleEn?: string;
  columns?: GuideTableColumn[];
  rows?: GuideTableRow[];
};

type GuideTableProps = {
  value: GuideTableValue;
  locale: "fr" | "en";
};

export default function GuideTable({
  value,
  locale,
}: GuideTableProps) {
  const isEnglish = locale === "en";

  const title = isEnglish
    ? value.titleEn || value.title
    : value.title;

  const columns = value.columns || [];
  const rows = value.rows || [];

  const columnLabel = (column?: GuideTableColumn) =>
    isEnglish
      ? column?.labelEn || column?.label || ""
      : column?.label || "";

  const cellText = (cell?: GuideTableCell) =>
    isEnglish
      ? cell?.textEn || cell?.text || ""
      : cell?.text || "";

  if (!columns.length || !rows.length) return null;

  return (
    <div className="not-prose my-10 md:my-14">
      {title ? (
        <p className="mb-5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--lpv-cocoa)]">
          {title}
        </p>
      ) : null}

      <div className="hidden overflow-hidden border-y border-[var(--lpv-line)] md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--lpv-line)]">
              {columns.map((column, index) => (
                <th
                  key={column._key || `${columnLabel(column)}-${index}`}
                  className="px-4 py-4 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[var(--lpv-muted)] first:pl-0 last:pr-0"
                >
                  {columnLabel(column)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row._key || rowIndex}
                className="border-b border-[var(--lpv-line)] last:border-b-0"
              >
                {columns.map((column, columnIndex) => {
                  const cell = row.cells?.[columnIndex];

                  return (
                    <td
                      key={`${row._key || rowIndex}-${column._key || columnIndex}`}
                      className={[
                        "px-4 py-5 align-top text-sm leading-6 first:pl-0 last:pr-0",
                        columnIndex === 0
                          ? "font-medium text-[var(--lpv-ink)]"
                          : "text-[var(--lpv-muted)]",
                      ].join(" ")}
                    >
                      {cellText(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[var(--lpv-line)] md:hidden">
        {rows.map((row, rowIndex) => (
          <div
            key={row._key || rowIndex}
            className="border-b border-[var(--lpv-line)] py-6"
          >
            {columns.map((column, columnIndex) => {
              const text = cellText(row.cells?.[columnIndex]);

              if (!text) return null;

              return (
                <div
                  key={`${row._key || rowIndex}-${column._key || columnIndex}`}
                  className={columnIndex === 0 ? "" : "mt-4"}
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--lpv-muted)]">
                    {columnLabel(column)}
                  </p>

                  <p
                    className={[
                      "mt-1 text-sm leading-6",
                      columnIndex === 0
                        ? "font-medium text-[var(--lpv-ink)]"
                        : "text-[var(--lpv-muted)]",
                    ].join(" ")}
                  >
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
