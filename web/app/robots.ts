import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://scolaritate.ro";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/disclaimer"],
      disallow: ["/api/", "/login"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
