import { mkdir } from "node:fs/promises";
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
const { width } = await source.metadata();
await source
  .clone()
  .resize({ width: 1440, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(target);
if (width > 650) {
  await source
    .clone()
    .resize({ width: 640 })
    .webp({ quality: 75 })
    .toFile(target.replace(/\.webp$/, "-640.webp"));
}
