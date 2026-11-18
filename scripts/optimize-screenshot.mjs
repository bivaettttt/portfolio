import { copyFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";

const [original, target] = process.argv.slice(2);
if (!original || !target?.endsWith(".webp")) {
  throw new Error(
    "Usage: npm run media -- original.png public/media/project/scene.webp",
  );
}
await mkdir(dirname(target), { recursive: true });
const source = sharp(original);
const { width, format } = await source.metadata();
if (!width || format !== "png") throw new Error("A PNG original is required");
const maximum = Math.min(width, 1600);
await source
  .clone()
  .resize({ width: maximum })
  .webp({ lossless: true })
  .toFile(target);
await copyFile(original, target.replace(/\.webp$/, ".png"));
for (const size of [640, 960, 1280]) {
  if (size >= maximum) continue;
  await source
    .clone()
    .resize({ width: size })
    .webp({ lossless: true })
    .toFile(target.replace(/\.webp$/, "-" + size + ".webp"));
}
