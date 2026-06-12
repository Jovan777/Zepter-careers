const normalizePublicBasePath = (value?: string) => {
  const rawValue = value?.trim() || "/";

  if (rawValue === "/") {
    return "/";
  }

  const path = rawValue.replace(/^\/+/, "").replace(/\/+$/, "");

  return path ? `/${path}/` : "/";
};

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const isAbsoluteUrl = (value: string) =>
  /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(value) ||
  /^(?:data|mailto|tel):/i.test(value);

const normalizeExplicitApiBaseUrl = (value?: string) => {
  const rawValue = value?.trim() || "";

  if (!rawValue) {
    return "";
  }

  if (isAbsoluteUrl(rawValue)) {
    return stripTrailingSlash(rawValue);
  }

  const path = rawValue.replace(/^\/+/, "").replace(/\/+$/, "");

  return path ? `/${path}` : "";
};

const deriveApiBaseUrl = (basePath: string) => {
  if (basePath === "/") {
    return "/api";
  }

  return `${stripTrailingSlash(basePath)}/api`;
};

const getApiOrigin = (apiBaseUrl: string) => {
  if (apiBaseUrl.endsWith("/api")) {
    return apiBaseUrl.slice(0, -4);
  }

  return "";
};

export const PUBLIC_BASE_PATH = normalizePublicBasePath(import.meta.env.BASE_URL);
export const ROUTER_BASENAME =
  PUBLIC_BASE_PATH === "/" ? undefined : stripTrailingSlash(PUBLIC_BASE_PATH);

const explicitApiBaseUrl = normalizeExplicitApiBaseUrl(
  import.meta.env.VITE_API_BASE_URL
);

export const API_BASE_URL =
  explicitApiBaseUrl || deriveApiBaseUrl(PUBLIC_BASE_PATH);

export const API_ORIGIN = getApiOrigin(API_BASE_URL);

export const withPublicBasePath = (path: string) => {
  if (!path || isAbsoluteUrl(path)) {
    return path;
  }

  const normalizedPath = `/${path.replace(/^\/+/, "")}`;

  if (PUBLIC_BASE_PATH === "/") {
    return normalizedPath;
  }

  const basePath = stripTrailingSlash(PUBLIC_BASE_PATH);

  if (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }

  return `${basePath}${normalizedPath}`;
};

export const resolveUploadUrl = (fileUrl: string) => {
  if (!fileUrl || isAbsoluteUrl(fileUrl)) {
    return fileUrl;
  }

  const normalizedPath = `/${fileUrl.replace(/^\/+/, "")}`;

  if (explicitApiBaseUrl && API_ORIGIN) {
    return `${API_ORIGIN}${normalizedPath}`;
  }

  return withPublicBasePath(normalizedPath);
};

export const publicAssetUrl = withPublicBasePath;
