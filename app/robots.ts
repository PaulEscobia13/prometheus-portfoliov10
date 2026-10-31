import type { MetadataRoute } from "next";
import { homepageUrl } from "../lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Let crawlers read the route's noindex directive on preview deployments.
    rules: { userAgent: "*", allow: "/" },
    ...(homepageUrl ? { sitemap: new URL("/sitemap.xml", homepageUrl).href } : {}),
  };
}
