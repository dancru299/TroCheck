import type { MetadataRoute } from "next";

const routes = ["/", "/gia-dien-phong-tro-hcm", "/cach-tinh-dien-evn"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://trocheck.vn${route}`,
    lastModified: new Date("2026-05-11"),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8
  }));
}
