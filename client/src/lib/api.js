const runtimeHost =
  typeof window !== "undefined" ? window.location.hostname : "localhost";
const runtimeIsLocal =
  runtimeHost === "localhost" ||
  runtimeHost === "127.0.0.1" ||
  runtimeHost === "[::1]";

function normalizeApiBase(value) {
  let base = String(value || "")
    .trim()
    .replace(/\/$/, "");
  if (!base) return "";
  if (/localhost|127\.0\.0\.1|\[::1\]/i.test(base)) return "";
  if (!base.endsWith("/api")) {
    base += "/api";
  }
  return base;
}

const envApiBase = normalizeApiBase(import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL);
const defaultApiBase = runtimeIsLocal
  ? `http://${runtimeHost}:4000/api`
  : "https://greenrut-fswe.onrender.com/api";

const API_BASE_URL = envApiBase || defaultApiBase;

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
