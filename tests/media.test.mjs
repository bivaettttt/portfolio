import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";
const categories = ["personal", "academic", "practice"];
const projects = categories.flatMap((c) =>
  readdirSync("src/content/projects/" + c).map((f) =>
    JSON.parse(readFileSync("src/content/projects/" + c + "/" + f)),
  ),
);
test("original media hashes, dimensions and lossless presentation match the evidence", async () => {
  let originals = 0;
  for (const p of projects)
    for (const s of p.screens) {
      for (const v of s.variants ?? []) {
        const m = await sharp("dist/" + v.path).metadata();
        assert.equal(m.width, v.width, v.path);
        assert.ok(m.width <= s.originalWidth, v.path);
      }
      if (!s.originalSha256) continue;
      const bytes = readFileSync("dist/" + s.original);
      assert.equal(
        createHash("sha256").update(bytes).digest("hex"),
        s.originalSha256,
        s.original,
      );
      const original = await sharp(bytes).metadata();
      assert.equal(original.width, s.originalWidth);
      assert.equal(original.height, s.originalHeight);
      if (p.category === "personal") {
        originals++;
        const webp = await sharp("dist/" + s.path).metadata();
        assert.equal(webp.width, original.width);
        assert.equal(webp.height, original.height);
        const a = await sharp(bytes).removeAlpha().raw().toBuffer();
        const b = await sharp("dist/" + s.path)
          .removeAlpha()
          .raw()
          .toBuffer();
        assert.ok(a.equals(b), s.path + " is pixel-identical to original");
      }
    }
  assert.equal(originals, 30);
});
test("inspection details are native crops and identity has actual small-size assets", async () => {
  for (const p of projects.filter((p) => p.detail)) {
    const m = await sharp("dist/" + p.detail.path).metadata();
    assert.equal(m.width, p.detail.width);
    assert.equal(m.height, p.detail.height);
    assert.match(p.detail.caption.ru, /фрагмент|Фрагмент/);
  }
  for (const size of [16, 32, 48, 180]) {
    const m = await sharp("dist/identity/mark-" + size + ".png").metadata();
    assert.equal(m.width, size);
    assert.equal(m.height, size);
  }
});
