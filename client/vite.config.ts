import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const normalizeBasePath = (value?: string) => {
  if (value === undefined) {
    return "/";
  }

  const rawValue = value.trim();

  if (!rawValue || rawValue === "." || rawValue === "./" || rawValue === "relative") {
    return "";
  }

  if (rawValue === "/") {
    return "/";
  }

  const path = rawValue.replace(/^\/+/, "").replace(/\/+$/, "");

  return path ? `/${path}/` : "/";
};

// https://vite.dev/config/
export default defineConfig({
  base: normalizeBasePath(process.env.VITE_PUBLIC_BASE_PATH),
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
      "/uploads": "http://localhost:5000",
    },
  },
})
