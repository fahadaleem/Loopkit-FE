export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3008";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch<T>(
  path: string,
  { body, headers, ...rest }: RequestOptions = {},
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: Record<string, string> = { ...(headers as Record<string, string> | undefined) };
  if (!isFormData && body !== undefined && finalHeaders["Content-Type"] === undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const finalBody =
    body === undefined
      ? undefined
      : isFormData
        ? (body as FormData)
        : JSON.stringify(body);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: finalHeaders,
    body: finalBody,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message?: unknown }).message)
        : null) ?? `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export async function apiFetchBlob(
  path: string,
  { headers, ...rest }: Omit<RequestInit, "body"> = {},
): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: { ...(headers as Record<string, string> | undefined) },
  });

  if (!res.ok) {
    let message: string | null = null;
    try {
      const data = await res.json();
      if (data && typeof data === "object" && "message" in data) {
        message = String((data as { message?: unknown }).message);
      }
    } catch {
      // ignore — server didn't return JSON on the error path
    }
    throw new ApiError(
      message ?? `Request failed with status ${res.status}`,
      res.status,
    );
  }

  return await res.blob();
}
