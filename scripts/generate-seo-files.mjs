/**
 * Writes robots.txt and sitemap.xml into dist/.
 *
 * Both are generated from `src/v3/site.json` and `src/v3/route-data.json` so the
 * canonical origin is declared once. They previously lived in public/ as
 * hand-maintained copies of a URL that was also hardcoded in two modules.
 */
import { join } from "node:path";
import { readJson, writeFileEnsured } from "./load-content.mjs";

const dist = join(process.cwd(), "dist");

const { siteUrl } = await readJson("src/v3/site.json");
const routes = await readJson("src/v3/route-data.json");

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  "",
].join("\n");

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((route) => `  <url><loc>${siteUrl}${route.path}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

await writeFileEnsured("dist/robots.txt", robots);
await writeFileEnsured("dist/sitemap.xml", sitemap);
