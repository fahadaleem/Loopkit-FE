import { apiFetch, apiFetchBlob } from "@/lib/api";

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

  downloadAtsResume(id: string) {
    return apiFetchBlob(`/api/interview/${encodeURIComponent(id)}/pdf`, {
      method: "GET",
    });
  },
};
