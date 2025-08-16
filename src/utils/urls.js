const BASE = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
export const canonicalUrlForPath = (path = "/") =>
  (BASE.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "")).replace(/\/+$/, "/");
