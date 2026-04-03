const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, token, ...rest } = options;
  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") || "";
  const responseData = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof responseData === "object" &&
      responseData !== null &&
      "message" in responseData
        ? String(responseData.message)
        : "Greška pri komunikaciji sa serverom.";

    throw new Error(message);
  }

  return responseData as T;
}

export const adminHttp = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "GET", token }),

  post: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body, token }),

  put: <T>(path: string, body?: unknown, token?: string | null) =>
    request<T>(path, { method: "PUT", body, token }),

  delete: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "DELETE", token }),
};