"use client";

import { useDownloadAtsResume } from "@/features/interview/hooks/useDownloadAtsResume";
import type { AtsResumeSummary } from "@/features/interview/services/interview.service";
import {
  formatAbsoluteDate,
  formatBytes,
  formatRelativeDate,
} from "@/lib/formatDate";

type DownloadAtsResumeCardProps = {
  reportId: string;
  reportTitle?: string;
  atsResume?: AtsResumeSummary | null;
  onDownloaded?: () => void;
  className?: string;
};

export function DownloadAtsResumeCard({
  reportId,
  reportTitle,
  atsResume,
  onDownloaded,
  className = "",
}: DownloadAtsResumeCardProps) {
  const { download, isLoading, isSuccess, error } = useDownloadAtsResume();
  const isCached = !!atsResume;

  const onClick = () => {
    if (isLoading) return;
    download({
      id: reportId,
      title: reportTitle,
      onSuccess: onDownloaded,
    });
  };

  return (
    <div
      className={`rounded-xl border p-4 ${isCached ? "border-border bg-surface" : "border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"} ${className}`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ${isCached ? "bg-surface-muted text-muted-foreground" : "bg-primary/15 text-primary"}`}
        >
          {isCached ? <DocumentIcon /> : <SparkleIcon />}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            {isCached ? "ATS resume" : "ATS-friendly resume"}
          </h3>
          {isCached && atsResume ? (
            <p
              className="mt-0.5 text-xs text-muted-foreground"
              title={formatAbsoluteDate(atsResume.generatedAt)}
            >
              Generated {formatRelativeDate(atsResume.generatedAt)} ·{" "}
              {formatBytes(atsResume.sizeBytes)}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Generate a tailored, ATS-optimized PDF of your resume for this
              job.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className="mt-3 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>{isCached ? "Downloading…" : "Generating…"}</span>
          </>
        ) : isSuccess ? (
          <>
            <CheckIcon />
            <span>Downloaded</span>
          </>
        ) : isCached ? (
          <>
            <DownloadIcon />
            <span>Download</span>
          </>
        ) : (
          <>
            <SparkleIcon />
            <span>Generate ATS resume</span>
          </>
        )}
      </button>

      {error ? (
        <p role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SparkleIcon() {
  return (
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
      <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
      <path d="M19 14l.8 1.9 1.9.8-1.9.8L19 19.4l-.8-1.9-1.9-.8 1.9-.8L19 14z" />
      <path d="M5 16l.6 1.4L7 18l-1.4.6L5 20l-.6-1.4L3 18l1.4-.6L5 16z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function DownloadIcon() {
  return (
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function Spinner() {
  return (
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
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.55" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
