import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return ["", "/discover", "/feed", "/about", "/privacy", "/terms"].map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: path === "" ? "daily" : "weekly", priority: path === "" ? 1 : 0.7 }));
}
