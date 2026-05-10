"use client";

import { useRef, useState, type DragEvent } from "react";

type ResumeDropzoneProps = {
  file: File | null;
  onChange: (file: File | null) => void;
  maxSizeBytes?: number;
};

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function ResumeDropzone({
  file,
  onChange,
  maxSizeBytes = DEFAULT_MAX_SIZE,
}: ResumeDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validate = (candidate: File) => {
    if (candidate.type !== "application/pdf") {
      return "Resume must be a PDF file.";
    }
    if (candidate.size > maxSizeBytes) {
      return `File is too large. Max size is ${formatSize(maxSizeBytes)}.`;
    }
    return null;
  };

  const handleFile = (candidate: File | undefined | null) => {
    if (!candidate) return;
    const err = validate(candidate);
    if (err) {
      setValidationError(err);
      onChange(null);
      return;
    }
    setValidationError(null);
    onChange(candidate);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const openPicker = () => inputRef.current?.click();

  const removeFile = () => {
    onChange(null);
    setValidationError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {file ? (
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-semibold">
              PDF
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatSize(file.size)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="ml-3 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onClick={openPicker}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-border bg-surface hover:border-primary/40 hover:bg-surface-muted/50"
          }`}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </span>
          <p className="text-sm font-medium text-foreground">
            Drag your resume here, or{" "}
            <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">
            PDF only · max {formatSize(maxSizeBytes)}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {validationError ? (
        <p
          role="alert"
          className="mt-2 text-xs text-danger"
        >
          {validationError}
        </p>
      ) : null}
    </div>
  );
}
