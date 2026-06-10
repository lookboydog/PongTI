/**
 * 将 PNG 中接近纯黑的像素转为透明，恢复真正的 alpha 通道。
 * 用法（项目根目录）: node scripts/knockout-black-bg.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.resolve(__dirname, '../public/theme-bg-circle.png');
const outputPath = inputPath;

/** 低于此 RGB 值的像素视为背景黑，转为透明 */
const THRESHOLD = 24;

const buffer = fs.readFileSync(inputPath);
const png = PNG.sync.read(buffer);

for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];

    if (r <= THRESHOLD && g <= THRESHOLD && b <= THRESHOLD) {
      png.data[idx + 3] = 0;
    }
  }
}

fs.writeFileSync(outputPath, PNG.sync.write(png));
console.log(`Processed: ${outputPath}`);
