"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function buildPageList(currentPage: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) pages.push("…");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < totalPages - 1) pages.push("…");

  pages.push(totalPages);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-between gap-3"
    >
      <button
        type="button"
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        disabled={!canPrev}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        ← Prev
      </button>

      <ul className="flex items-center gap-1">
        {pages.map((p, idx) =>
          p === "…" ? (
            <li
              key={`gap-${idx}`}
              className="px-2 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              …
            </li>
          ) : (
            <li key={p}>
              <button
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={p === currentPage ? "page" : undefined}
                className={`min-w-[2rem] rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
                  p === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-surface-muted"
                }`}
              >
                {p}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={() => canNext && onPageChange(currentPage + 1)}
        disabled={!canNext}
        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next →
      </button>
    </nav>
  );
}
