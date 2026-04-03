const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
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
        : "Došlo je do greške pri komunikaciji sa serverom.";

    throw new Error(message);
  }

  return responseData as T;
}

export const http = {
  get: <T>(path: string) =>
    request<T>(path, {
      method: "GET",
    }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body,
    }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body,
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};

export { API_BASE_URL };