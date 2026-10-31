import test from "node:test";
import assert from "node:assert/strict";
import { publicHomepage, homepageMetadata, homepageStructuredData } from "../lib/seo.ts";
import sitemapModule from "../app/sitemap.ts";
const sitemap = typeof sitemapModule === "function" ? sitemapModule : sitemapModule.default;

test("SEO accepts an explicit public page URL without guessing a domain", () => {
  assert.equal(publicHomepage("") , undefined);
  assert.equal(publicHomepage("https://example.com/prometheus").href, "https://example.com/prometheus");
  for (const url of ["http://example.com", "https://localhost/prometheus", "https://example.com/?preview=1", "https://user:pass@example.com/"]) {
    assert.throws(() => publicHomepage(url));
  }
});

test("indexing and sitemap use only the configured homepage", () => {
  const url = publicHomepage();
  assert.equal(homepageMetadata.robots.index, Boolean(url));
  assert.deepEqual(sitemap(), url ? [{ url: url.href }] : []);
  assert.equal(homepageMetadata.alternates?.canonical, url?.href);
  const graph = JSON.parse(JSON.stringify(homepageStructuredData))["@graph"];
  assert.equal(graph[0].email, "prometheus.exps@gmail.com");
  assert.equal(graph[0].hasOfferCatalog.itemListElement.length, 4);
  assert.equal(graph.some(item => item.aggregateRating), false);
});
