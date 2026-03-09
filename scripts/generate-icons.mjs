import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import sharp from "sharp";

const svg = readFileSync("src/app/icon.svg");
const bg = "#09090b";

const targets = [
  { path: "public/logos/icon-192.png", size: 192 },
  { path: "public/logos/icon-512.png", size: 512 },
  { path: "src/app/apple-icon.png", size: 180 },
];

for (const { path, size } of targets) {
  mkdirSync(dirname(path), { recursive: true });
  const padding = Math.round(size * 0.15);
  const iconSize = size - padding * 2;

  const icon = await sharp(svg).resize(iconSize, iconSize).png().toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: icon, top: padding, left: padding }])
    .png()
    .toFile(path);

  console.log(`✓ ${path} (${size}x${size})`);
}
