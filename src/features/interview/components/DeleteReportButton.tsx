"use client";

import { useEffect, useRef, useState } from "react";
import { useDeleteReport } from "@/features/interview/hooks/useDeleteReport";

type DeleteReportButtonProps = {
  reportId: string;
  reportTitle?: string;
  onDeleted?: (id: string) => void;
  variant?: "icon" | "button";
};

export function DeleteReportButton({
  reportId,
  reportTitle,
  onDeleted,
  variant = "icon",
}: DeleteReportButtonProps) {
  const [open, setOpen] = useState(false);
  const { deleteReport, isDeleting, error, reset } = useDeleteReport();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isDeleting]);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    reset();
    setOpen(true);
  };

  const handleClose = () => {
    if (isDeleting) return;
    setOpen(false);
    reset();
  };

  const handleConfirm = async () => {
    const ok = await deleteReport(reportId);
    if (ok) {
      setOpen(false);
      onDeleted?.(reportId);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={handleOpen}
          aria-label={`Delete ${reportTitle ?? "report"}`}
          title="Delete report"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-danger/10 hover:text-danger"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/5 px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Delete report
        </button>
      )}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-report-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            aria-hidden="true"
            onClick={handleClose}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl">
            <h2
              id="delete-report-title"
              className="text-base font-semibold text-foreground"
            >
              Delete this report?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {reportTitle ? (
                <>
                  This will permanently delete{" "}
                  <span className="font-medium text-foreground">
                    {reportTitle}
                  </span>
                  . This action can't be undone.
                </>
              ) : (
                "This will permanently delete the report. This action can't be undone."
              )}
            </p>

            {error ? (
              <p
                role="alert"
                className="mt-3 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
              >
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <button
                ref={cancelRef}
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-muted disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="rounded-lg bg-danger px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
