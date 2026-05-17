import { apiFetch, API_BASE_URL, ApiError } from "@/lib/api";

export type SkillSeverity = "low" | "medium" | "high";

export type ReportStatus = "pending" | "processing" | "completed" | "failed";

export type TechnicalQuestion = {
  question: string;
  intention: string;
  answer: string;
};

export type BehavioralQuestion = {
  question: string;
  intention: string;
  answer: string;
};

export type SkillGap = {
  skill: string;
  severity: SkillSeverity;
};

export type PreparationDay = {
  day: number;
  focus: string;
  tasks: string[];
};

export type AtsResumeSummary = {
  contentType: string;
  sizeBytes: number;
  generatedAt: string;
};

export type InterviewReport = {
  id: string;
  title?: string;
  matchScore?: number;
  jobDescription: string;
  selfDescription?: string;
  resume?: string;
  technicalQuestions?: TechnicalQuestion[];
  behavioralQuestions?: BehavioralQuestion[];
  skillGaps?: SkillGap[];
  preparationPlan?: PreparationDay[];
  user: string;
  createdAt?: string;
  updatedAt?: string;
  atsResume?: AtsResumeSummary | null;
  status: ReportStatus;
  error?: string | null;
};

export type QueuedReport = {
  id: string;
  status: ReportStatus;
};

export type InterviewReportSummary = {
  id: string;
  title: string;
  matchScore: number;
  createdAt?: string;
};

export type ReportsPagination = {
  totalReports: number;
  totalPages: number;
  currentPage: number;
  limit: number;
};

type GenerateReportResponse = {
  message: string;
  interviewReport: QueuedReport;
};

type GetReportResponse = {
  message?: string;
  interviewReport: InterviewReport;
};

type GetReportsResponse = {
  message?: string;
  reports: InterviewReportSummary[];
  pagination: ReportsPagination;
};

export type GetReportsParams = {
  page?: number;
  limit?: number;
};

export type GenerateReportInput = {
  resume: File;
  jobDescription: string;
  selfDescription: string;
};

export type AtsResumeFetchResult =
  | { status: "ready"; blob: Blob }
  | { status: "queued"; message: string };

export const interviewService = {
  generateReport({ resume, jobDescription, selfDescription }: GenerateReportInput) {
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    return apiFetch<GenerateReportResponse>("/api/interview/generate-report", {
      method: "POST",
      body: formData,
    });
  },

  getReport(id: string) {
    return apiFetch<GetReportResponse>(`/api/interview/${encodeURIComponent(id)}`, {
      method: "GET",
    });
  },

  getReports({ page, limit }: GetReportsParams = {}) {
    const search = new URLSearchParams();
    if (page !== undefined) search.set("page", String(page));
    if (limit !== undefined) search.set("limit", String(limit));
    const qs = search.toString();
    return apiFetch<GetReportsResponse>(
      `/api/interview/reports${qs ? `?${qs}` : ""}`,
      { method: "GET" },
    );
  },

  deleteReport(id: string) {
    return apiFetch<{ message?: string }>(
      `/api/interview/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  },

  async downloadAtsResume(id: string): Promise<AtsResumeFetchResult> {
    const res = await fetch(
      `${API_BASE_URL}/api/interview/${encodeURIComponent(id)}/pdf`,
      { method: "GET", credentials: "include" },
    );

    const contentType = res.headers.get("Content-Type") ?? "";

    if (!res.ok) {
      let message: string | null = null;
      if (contentType.includes("application/json")) {
        try {
          const data = (await res.json()) as { message?: unknown };
          if (data && typeof data.message === "string") message = data.message;
        } catch {
          // ignore — server didn't return JSON on the error path
        }
      }
      throw new ApiError(
        message ?? `Request failed with status ${res.status}`,
        res.status,
      );
    }

    // Cold path: the controller enqueued a worker job and returned JSON.
    if (contentType.includes("application/json")) {
      const data = (await res.json()) as { message?: string };
      return {
        status: "queued",
        message: data.message ?? "Resume is being generated",
      };
    }

    // Cached path: PDF binary.
    return { status: "ready", blob: await res.blob() };
  },
};
