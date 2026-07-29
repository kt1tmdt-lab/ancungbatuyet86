type AdminRequestOptions = RequestInit & {
  token?: string | null;
};

type ApiErrorPayload = {
  error?: string;
  message?: string;
};

export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

export async function adminRequest<T>(
  input: RequestInfo | URL,
  { token, headers, ...options }: AdminRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, {
    ...options,
    headers: requestHeaders,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? ((await res.json().catch(() => null)) as ApiErrorPayload | T | null)
    : null;

  if (!res.ok) {
    const errorPayload = payload as ApiErrorPayload | null;
    throw new AdminApiError(
      errorPayload?.error || errorPayload?.message || "Yêu cầu không thể hoàn tất.",
      res.status,
    );
  }

  return payload as T;
}

export function getAdminErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
