import type { APIRoute } from "astro";
import { categories, entries, projectRoute, url } from "../lib/site";
export const GET: APIRoute = ({ site }) => {
  const routes = [
    "",
    "projects",
    "profile",
    "contact",
    ...Object.keys(categories).map((c) => "projects/" + c),
    ...entries.filter((p) => !p.archived).map(projectRoute),
  ];
  const links = routes.flatMap((path) =>
    (["ru", "en"] as const).map(
      (lang) => "<url><loc>" + new URL(url(path, lang), site) + "</loc></url>",
    ),
  );
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      links.join("") +
      "</urlset>",
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
