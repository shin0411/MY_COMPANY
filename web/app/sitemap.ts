import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://shin0411.github.io/MY_COMPANY";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "shiwake", "shotoku", "checklist", "qa"];
  return routes.map((r) => ({
    url: r === "" ? `${SITE_URL}/` : `${SITE_URL}/${r}/`,
    lastModified: now,
    priority: r === "" ? 1 : 0.8,
  }));
}
