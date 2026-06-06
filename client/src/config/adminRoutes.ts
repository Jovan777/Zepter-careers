const configuredAdminLoginPath = import.meta.env.VITE_ADMIN_LOGIN_PATH;

export const ADMIN_LOGIN_PATH = configuredAdminLoginPath
  ? `/${configuredAdminLoginPath.replace(/^\/+/, "")}`
  : "/admin-login";
