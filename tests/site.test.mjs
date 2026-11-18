import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}
const all = files("dist");
const html = all.filter((path) => path.endsWith(".html"));
const projects = files("src/content/projects").map((path) =>
  JSON.parse(readFileSync(path, "utf8")),
);
const content = (path) => readFileSync(path, "utf8");

test("each content source has a route in both languages and links to shipped evidence", () => {
  assert.equal(projects.filter((p) => p.category === "personal").length, 9);
  assert.deepEqual(
    projects
      .filter((p) => p.featured)
      .map((p) => p.id)
      .sort(),
    ["flowent", "nexora", "traceon"],
  );
  assert.equal(new Set(projects.map((p) => p.id)).size, projects.length);
  for (const p of projects) {
    assert.equal(
      p.category === "personal" ? p.screens.length >= 3 : true,
      true,
      p.id,
    );
    assert.ok(
      !p.sha || p.screens.every((screen) => screen.source.includes(p.sha)),
      p.id,
    );
    for (const screen of p.screens) {
      assert.ok(existsSync(join("dist", screen.path)), screen.path);
      if (screen.preview)
        assert.ok(existsSync(join("dist", screen.preview)), screen.preview);
    }
    if (p.video) assert.ok(existsSync(join("dist", p.video)), p.video);
    for (const lang of ["ru", "en"]) {
      const page = join(
        "dist",
        lang === "en" ? "en" : "",
        "projects",
        p.category,
        p.id,
        "index.html",
      );
      assert.ok(content(page).includes('lang="' + lang + '"'), page);
      assert.ok(content(page).includes('id="analysis"'), page);
      assert.ok(content(page).includes('id="showcase"'), page);
    }
  }
});

test("all generated internal links, sources, and legacy redirects resolve from the Pages base", () => {
  assert.ok(html.length >= 70, String(html.length));
  for (const file of html) {
    const page = content(file);
    const attributes = [...page.matchAll(/(?:href|src|poster)="([^"]+)"/g)].map(
      (m) => m[1].replaceAll("&amp;", "&"),
    );
    for (const set of page.matchAll(/srcset="([^"]+)"/g)) {
      attributes.push(
        ...set[1].split(",").map((v) => v.trim().split(/\s+/)[0]),
      );
    }
    const redirect = page.match(/url=(\/portfolio\/[^"<> ]+)/i);
    if (redirect) attributes.push(redirect[1]);
    for (const value of attributes) {
      if (!value.startsWith("/") || value.startsWith("//")) continue;
      assert.ok(value.startsWith("/portfolio/"), file + " " + value);
      const url = new URL(value, "https://bivaettttt.github.io");
      const path = decodeURIComponent(url.pathname.slice("/portfolio/".length));
      const target = join(
        "dist",
        path,
        url.pathname.endsWith("/") ? "index.html" : "",
      );
      assert.ok(existsSync(target), relative(".", file) + " -> " + target);
    }
  }
});

test("the two homepage routes position the author without case cards", () => {
  for (const file of ["dist/index.html", "dist/en/index.html"]) {
    const page = content(file);
    assert.match(page, /Junior/i);
    assert.doesNotMatch(page, /class="(?:feature|project-row|folder)\b/);
    assert.match(page, /hreflang="en"/);
  }
});

test("the public build excludes private/export artifacts and common secret patterns", () => {
  const testSecret =
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[0-9A-Za-z]{32,}|AKIA[0-9A-Z]{16}/;
  for (const path of all) {
    assert.doesNotMatch(path, /\.(?:docx|pdf|e365|sql|sqlite|pem|env)$/i);
    if (/\.(?:html|js|css|json|yaml|svg|xml)$/i.test(path))
      assert.doesNotMatch(content(path), testSecret, path);
  }
});
