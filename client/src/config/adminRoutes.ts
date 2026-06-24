export const DEFAULT_ADMIN_LOGIN_PATH = "/secure-zc-panel-8f4k/login";

const configuredAdminLoginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH;

export const ADMIN_LOGIN_PATH = configuredAdminLoginPath
  ? `/${configuredAdminLoginPath.replace(/^\/+/, "")}`
  : DEFAULT_ADMIN_LOGIN_PATH;
