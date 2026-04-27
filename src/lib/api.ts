const DEFAULT_API_BASE_URL = "http://localhost:8000";

const STORAGE_KEY = "phi_ai_api_base_url";

function normalizeBaseUrl(input: string) {
  const trimmed = input.trim().replace(/\/+$/, "");
  return trimmed || DEFAULT_API_BASE_URL;
}

export function getApiBaseUrl() {
  const fromStorage = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (fromStorage) return normalizeBaseUrl(fromStorage);

  const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
  if (fromEnv) return normalizeBaseUrl(fromEnv);

  return DEFAULT_API_BASE_URL;
}

export function setApiBaseUrl(nextBaseUrl: string) {
  const normalized = normalizeBaseUrl(nextBaseUrl);
  window.localStorage.setItem(STORAGE_KEY, normalized);
  return normalized;
}

export function clearApiBaseUrlOverride() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function buildApiUrl(pathOrUrl: string) {
  const raw = (pathOrUrl || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  const base = getApiBaseUrl();
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
}

export function resolveVideoUrl(videoUrlOrPath: string) {
  const raw = (videoUrlOrPath || "").trim();
  if (!raw) return "";

  // Most correct: backend returns "/videos/<file>.mp4" or a full URL.
  if (/^https?:\/\//i.test(raw) || raw.startsWith("/")) return buildApiUrl(raw);

  // Backend sometimes returns a local filesystem path (VPS HDD), which the browser can’t access.
  // Map it to the public static route your backend should expose, i.e. "/videos/<basename>".
  const basename = raw.split(/[\\/]/).filter(Boolean).pop();
  if (basename && /\.mp4($|\?)/i.test(basename)) {
    return buildApiUrl(`/videos/${basename}`);
  }

  // Fallback: best-effort.
  return buildApiUrl(raw);
}

