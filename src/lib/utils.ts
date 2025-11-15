import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getConvexSiteUrl() {
  const explicitSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;
  if (typeof explicitSiteUrl === "string" && explicitSiteUrl.length > 0) {
    return explicitSiteUrl.replace(/\/$/, "");
  }

  const clientUrl = import.meta.env.VITE_CONVEX_URL;
  if (typeof clientUrl === "string" && clientUrl.length > 0) {
    return clientUrl.replace(/\/$/, "").replace(".cloud", ".site");
  }

  throw new Error(
    "Missing Convex site URL. Set VITE_CONVEX_SITE_URL in your environment.",
  );
}
