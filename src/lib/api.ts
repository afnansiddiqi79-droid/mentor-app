export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export const AUTH_BASE_URL = (
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:5000"
)
  .replace(/\/$/, "")
  .replace(/\/api\/auth$/, "");

export class ApiClientError extends Error {
  status: number;
  details?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    status: number,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.details = details;
  }
}

type TokenCache = { token: string | null; expiresAt: number };

const tokenCache: TokenCache = { token: null, expiresAt: 0 };

/** Fetches a short-lived Better Auth JWT using the session cookie. */
async function getJwtToken(force = false): Promise<string | null> {
  if (!force && tokenCache.token && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  try {
    const response = await fetch(`${AUTH_BASE_URL}/api/auth/token`, {
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { token?: string };
    if (!payload.token) return null;
    tokenCache.token = payload.token;
    tokenCache.expiresAt = Date.now() + 4 * 60 * 1000;
    return payload.token;
  } catch {
    return null;
  }
}

export function clearTokenCache() {
  tokenCache.token = null;
  tokenCache.expiresAt = 0;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiClientError(
      payload?.message || `Request failed with status ${response.status}`,
      response.status,
      payload?.errors
    );
  }

  return payload as T;
}

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
};

async function requestEnvelope<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiEnvelope<T>> {
  const { body, auth = true, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const doFetch = async (withToken: boolean) => {
    const requestHeaders = new Headers(headers);
    if (body !== undefined && !isFormData) {
      requestHeaders.set("Content-Type", "application/json");
    }
    if (withToken) {
      const token = await getJwtToken();
      if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    return fetch(`${API_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
      credentials: "include",
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  };

  let response = await doFetch(auth);

  // An expired JWT should not break an otherwise valid cookie session.
  if (response.status === 401 && auth) {
    clearTokenCache();
    response = await doFetch(false);
  }

  return parseResponse<ApiEnvelope<T>>(response);
}

/** Returns the `data` payload from the standard `{ success, data, meta }` envelope. */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const payload = await requestEnvelope<T>(path, options);
  return payload.data;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  /** Keeps pagination `meta` alongside the list payload. */
  getWithMeta: <T>(path: string, options?: RequestOptions) =>
    requestEnvelope<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

/** Public endpoints used by server components. */
export async function fetchPublic<T>(
  path: string
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new ApiClientError(
      `Public API request failed (${response.status})`,
      response.status
    );
  }
  return response.json();
}

/** Uploads an image through the backend (ImgBB key stays server-side). */
export function uploadImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; displayUrl: string; thumbnailUrl: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/api/uploads/image`);
    xhr.withCredentials = true;

    getJwtToken().then((token) => {
      if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        try {
          const payload = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(payload.data);
          } else {
            reject(
              new ApiClientError(
                payload.message || "Image upload failed",
                xhr.status
              )
            );
          }
        } catch {
          reject(new ApiClientError("Image upload failed", xhr.status));
        }
      };

      xhr.onerror = () =>
        reject(new ApiClientError("Could not reach the upload service", 0));
      const formData = new FormData();
      formData.append("image", file);
      xhr.send(formData);
    });
  });
}
