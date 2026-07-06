const runtimeHost =
  typeof window !== "undefined" ? window.location.hostname : "localhost";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || `http://${runtimeHost}:4000/api`;

export async function requestJson(path, { method = "GET", body, token } = {}) {
  const isFormData =
    typeof FormData !== "undefined" &&
    (body instanceof FormData || (body && typeof body.append === "function"));

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body:
      body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}
