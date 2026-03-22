#!/usr/bin/env node
/**
 * Image optimization script for ViláGomba Fesztivál website.
 *
 * Converts and compresses images to WebP format for faster loading.
 * Run after adding new images to the public/ directories:
 *
 *   npm run optimize-images
 *
 * What it does:
 * - Compresses page_images/ (hero, logos) in-place as WebP
 * - Converts gallery images in index_pictures/ and index_pictures2/ to WebP
 * - Updates images.json and images2.json with the new WebP filenames
 * - Removes original JPG/PNG files after conversion
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

async function convertToWebP(inputPath, outputPath, options = {}) {
  const { maxWidth = 1920, quality = 82 } = options;

  const meta = await sharp(inputPath).metadata();
  let pipeline = sharp(inputPath);

  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, { withoutEnlargement: true });
  }

  await pipeline.webp({ quality, effort: 4 }).toFile(outputPath);

  const before = fs.statSync(inputPath).size;
  const after = fs.statSync(outputPath).size;
  return { before, after };
}

async function processGalleryFolder(folderName, jsonFile, options = {}) {
  const folderPath = path.join(publicDir, folderName);
  const jsonPath = path.join(publicDir, jsonFile);

  if (!fs.existsSync(folderPath)) {
    console.log(`Skipping ${folderName}: folder not found`);
    return;
  }

  const files = fs.readdirSync(folderPath);
  const sourceFiles = files.filter((f) =>
    IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()),
  );

  if (sourceFiles.length === 0) {
    console.log(`No new images to convert in ${folderName}`);
    return;
  }

  console.log(`\nConverting ${sourceFiles.length} images in ${folderName}...`);

  let totalBefore = 0;
  let totalAfter = 0;
  const webpNames = [];

  for (const file of sourceFiles) {
    const name = path.basename(file, path.extname(file));
    const src = path.join(folderPath, file);
    const dst = path.join(folderPath, name + '.webp');

    const { before, after } = await convertToWebP(src, dst, options);
    totalBefore += before;
    totalAfter += after;
    webpNames.push(name + '.webp');

    fs.unlinkSync(src);
  }

  // Also include already-converted WebP files not just created
  const existingWebPs = fs
    .readdirSync(folderPath)
    .filter((f) => f.endsWith('.webp') && !webpNames.includes(f));
  const allWebPs = [...webpNames, ...existingWebPs].sort();

  fs.writeFileSync(jsonPath, JSON.stringify(allWebPs, null, 2) + '\n');

  const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
  const pct = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0);
  console.log(
    `  ${folderName}: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ` +
      `${(totalAfter / 1024 / 1024).toFixed(1)} MB (saved ${savedMB} MB / ${pct}%)`,
  );
  console.log(`  Updated ${jsonFile} with ${allWebPs.length} files`);
}

async function processPageImages() {
  const pageDir = path.join(publicDir, 'page_images');
  console.log('\nProcessing page_images...');

  // Images to convert/compress. Add entries here when new page images are added.
  // Use `dst` with a .webp extension to convert, or same extension to compress in-place.
  const targets = [
    // Hero background – resize to max 1920 px wide (expects a JPG/PNG source named IMG_1367.jpg/png)
    {
      src: 'IMG_1367.jpg',
      dst: 'IMG_1367.webp',
      opts: { maxWidth: 1920, quality: 82 },
    },
    // Social / document icons – resize to max 300 px
    {
      src: 'facebook.png',
      dst: 'facebook.webp',
      opts: { maxWidth: 300, quality: 85 },
    },
    {
      src: 'document.png',
      dst: 'document.webp',
      opts: { maxWidth: 120, quality: 85 },
    },
    // Schedule images
    {
      src: 'pentek.jpg',
      dst: 'pentek.webp',
      opts: { maxWidth: 1080, quality: 83 },
    },
    {
      src: 'szombat.jpg',
      dst: 'szombat.webp',
      opts: { maxWidth: 1080, quality: 83 },
    },
    {
      src: 'vasarnap.jpg',
      dst: 'vasarnap.webp',
      opts: { maxWidth: 1080, quality: 83 },
    },
  ];

  for (const { src, dst, opts } of targets) {
    const srcPath = path.join(pageDir, src);
    const dstPath = path.join(pageDir, dst);
    if (!fs.existsSync(srcPath)) continue;

    const { before, after } = await convertToWebP(srcPath, dstPath, opts);
    const pct = (((before - after) / before) * 100).toFixed(0);
    console.log(
      `  ${src} → ${dst}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (${pct}% saved)`,
    );

    // Remove the original if it was converted to a different filename
    if (src !== dst && fs.existsSync(srcPath)) {
      fs.unlinkSync(srcPath);
    }
  }
}

async function main() {
  console.log('=== ViláGomba Fesztivál Image Optimizer ===\n');

  await processPageImages();

  await processGalleryFolder('index_pictures', 'images.json', {
    maxWidth: 1200,
    quality: 82,
  });

  await processGalleryFolder('index_pictures2', 'images2.json', {
    maxWidth: 1200,
    quality: 82,
  });

  console.log('\nDone! Rebuild the site to apply changes.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
