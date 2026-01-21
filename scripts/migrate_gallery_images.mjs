import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_BUCKET = process.env.PROJECT_BUCKET || 'project-assets';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const galleryItems = [
  { src: '/images/about-story.jpg', alt: 'Pedernales Project', size: 'normal' },
  { src: '/images/richmond-project.jpg', alt: 'Richmond Bathroom', size: 'tall' },
  { src: '/images/project-image.jpg', alt: 'Modern Kitchen', size: 'wide' },
  { src: '/images/gallery-1.jpg', alt: 'East 10th Street Project', size: 'tall' },
  { src: '/images/gallery-2.jpg', alt: 'DFD Project 28', size: 'normal' },
  { src: '/images/gallery-3.jpg', alt: 'DFD Project 5', size: 'wide' },
  { src: '/images/gallery-4.jpg', alt: 'DFD Project 18', size: 'tall' },
  { src: '/images/gallery-5.jpg', alt: 'DFD Project 6', size: 'normal' },
  { src: '/images/gallery-7.jpg', alt: 'Mansel Project 9', size: 'tall' },
  { src: '/images/gallery-8.jpg', alt: 'Mansel Project 36', size: 'wide' },
  { src: '/images/gallery-9.jpg', alt: 'Mansel Project 12', size: 'normal' },
  { src: '/images/gallery-10.jpg', alt: 'Mansel Project 15', size: 'tall' },
  { src: '/images/gallery-11.jpg', alt: 'Mansel Project 7', size: 'wide' },
  { src: '/images/gallery-12.jpg', alt: 'Garland Avenue Project 19', size: 'normal' },
  { src: '/images/gallery-13.jpg', alt: 'Garland Avenue Project 30', size: 'tall' },
  { src: '/images/gallery-14.jpg', alt: 'Garland Avenue Project 34', size: 'wide' },
  { src: '/images/gallery-15.jpg', alt: 'Garland Avenue Project 7', size: 'normal' },
  { src: '/images/gallery-17.jpg', alt: 'Glissman Project 31', size: 'tall' },
  { src: '/images/gallery-18.jpg', alt: 'DFD Project 33', size: 'wide' },
  { src: '/images/gallery-19.jpg', alt: 'DFD Project 2', size: 'normal' },
  { src: '/images/gallery-20.jpg', alt: 'DFD Project 5', size: 'tall' },
  { src: '/images/gallery-21.jpg', alt: 'DFD Project 15', size: 'wide' },
  { src: '/images/gallery-22.jpg', alt: 'DFD Project 10', size: 'normal' },
  { src: '/images/gallery-23.jpg', alt: 'East 10th Street Project 9', size: 'tall' },
  { src: '/images/gallery-24.jpg', alt: 'East 10th Street Project 15', size: 'wide' },
  { src: '/images/gallery-25.jpg', alt: 'East 10th Street Project 17', size: 'normal' },
  { src: '/images/gallery-26.jpg', alt: 'East 10th Street Project 23', size: 'tall' },
  { src: '/images/gallery-27.jpg', alt: 'East 10th Street Project 7', size: 'wide' },
  { src: '/images/gallery-28.jpg', alt: 'East 10th Street Project 28', size: 'normal' },
  { src: '/images/gallery-29.jpg', alt: 'East 10th Street Project 27', size: 'tall' },
  { src: '/images/gallery-30.jpg', alt: 'East 10th Street Project 26', size: 'wide' },
  { src: '/images/gallery-31.jpg', alt: 'East 10th Street Project 13', size: 'normal' },
  { src: '/images/gallery-32.jpg', alt: 'East 10th Street Project 3', size: 'tall' },
  { src: '/images/gallery-33.jpg', alt: 'Mansel Project 1', size: 'wide' },
  { src: '/images/gallery-34.jpg', alt: 'Mansel Project 13', size: 'normal' },
  { src: '/images/gallery-35.jpg', alt: 'Mansel Project 14', size: 'tall' },
  { src: '/images/gallery-36.jpg', alt: 'East 10th Street Unit 2 Project 3', size: 'wide' },
  { src: '/images/gallery-37.jpg', alt: 'East 10th Street Unit 2 Project 10', size: 'normal' },
  { src: '/images/gallery-38.jpg', alt: 'East 10th Street Unit 2 Project 21', size: 'tall' },
  { src: '/images/gallery-39.jpg', alt: 'East 10th Street Unit 2 Project 32', size: 'wide' },
  { src: '/images/gallery-40.jpg', alt: 'East 10th Street Unit 2 Project 39', size: 'normal' },
  { src: '/images/gallery-41.jpg', alt: 'Richmond Project 1', size: 'tall' },
  { src: '/images/gallery-42.jpg', alt: 'Richmond Project 11', size: 'wide' },
  { src: '/images/gallery-43.jpg', alt: 'Richmond Project 18', size: 'normal' },
  { src: '/images/gallery-44.jpg', alt: 'Pedernales Project 19', size: 'tall' },
  { src: '/images/gallery-45.jpg', alt: 'DFD Project 2', size: 'wide' },
  { src: '/images/gallery-46.jpg', alt: 'East 10th Street Primary Project 10', size: 'normal' },
  { src: '/images/gallery-47.jpg', alt: 'East 10th Street Primary Project 22', size: 'tall' },
  { src: '/images/gallery-48.jpg', alt: 'East 10th Street Project 5', size: 'wide' },
  { src: '/images/gallery-49.jpg', alt: 'Richmond Project 19', size: 'normal' },
  { src: '/images/gallery-50.jpg', alt: 'Pedernales Project 2', size: 'tall' },
  { src: '/images/gallery-51.jpg', alt: 'Pedernales Project 22', size: 'wide' },
  { src: '/images/gallery-52.jpg', alt: 'Richmond Project 25', size: 'normal' },
  { src: '/images/gallery-53.jpg', alt: 'Richmond Project 3', size: 'tall' },
  { src: '/images/gallery-54.jpg', alt: 'Pedernales Project 32', size: 'wide' },
  { src: '/images/gallery-55.jpg', alt: 'Pedernales Project 4', size: 'normal' },
  { src: '/images/gallery-56.jpg', alt: 'Richmond Project 41', size: 'tall' },
  { src: '/images/gallery-57.jpg', alt: 'Pedernales Project 6', size: 'wide' },
  { src: '/images/gallery-58.jpg', alt: 'Mansel Project 7', size: 'normal' },
  { src: '/images/gallery-59.jpg', alt: 'Mansel Project 9', size: 'tall' },
  { src: '/images/gallery-60.jpg', alt: 'Balcony Project', size: 'wide' },
  { src: '/images/gallery-61.jpg', alt: 'Pedernales Front 1', size: 'normal' },
  { src: '/images/gallery-62.jpg', alt: 'Glissman Project 40', size: 'tall' },
  { src: '/images/gallery-63.jpg', alt: 'Glissman Project 31', size: 'wide' },
  { src: '/images/gallery-64.jpg', alt: 'Glissman Project 4', size: 'normal' },
  { src: '/images/gallery-65.jpg', alt: 'Glissman Project 10', size: 'tall' },
  { src: '/images/gallery-66.jpg', alt: 'Glissman Project 23', size: 'wide' },
  { src: '/images/gallery-67.jpg', alt: 'DFD Project 2 (2025)', size: 'normal' },
  { src: '/images/gallery-68.jpg', alt: 'DFD Project 5 (2025)', size: 'tall' },
];

const parseArgs = (argv) => {
  const args = new Set(argv);
  return {
    dryRun: args.has('--dry-run'),
    skipExisting: !args.has('--no-skip-existing'),
    bucket: (() => {
      const bucketArg = argv.find((item) => item.startsWith('--bucket='));
      return bucketArg ? bucketArg.split('=')[1] : DEFAULT_BUCKET;
    })(),
  };
};

const toLocalPath = (src) => {
  const rel = src.replace(/^\/+/, '');
  return path.join(ROOT, 'public', rel);
};

const toBucketPath = (src) => {
  const filename = path.basename(src);
  return `gallery/${filename}`;
};

const requireEnv = (value, name) => {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

const main = async () => {
  const { dryRun, skipExisting, bucket } = parseArgs(process.argv.slice(2));
  requireEnv(SUPABASE_URL, 'SUPABASE_URL');
  requireEnv(SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  console.log(`Found ${galleryItems.length} gallery items.`);
  console.log(`Bucket: ${bucket}`);
  if (dryRun) {
    console.log('Running in dry-run mode; no uploads or inserts will happen.');
  }

  for (let index = 0; index < galleryItems.length; index += 1) {
    const item = galleryItems[index];
    const localPath = toLocalPath(item.src);
    const bucketPath = toBucketPath(item.src);

    try {
      await fs.access(localPath);
    } catch {
      console.warn(`[SKIP] Missing file: ${localPath}`);
      continue;
    }

    if (dryRun) {
      console.log(`[DRY RUN] ${bucketPath} <- ${localPath}`);
      continue;
    }

    if (skipExisting) {
      const { data: existing } = await supabase
        .from('gallery_photos')
        .select('id')
        .eq('storage_path', bucketPath)
        .maybeSingle();

      if (existing?.id) {
        console.log(`[SKIP] DB row exists for ${bucketPath}`);
        continue;
      }
    }

    const file = await fs.readFile(localPath);
    const ext = path.extname(localPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(bucketPath, file, { contentType, upsert: true });

    if (uploadError) {
      console.error(`[ERROR] Upload failed for ${bucketPath}: ${uploadError.message}`);
      continue;
    }

    const { data: existingRow } = await supabase
      .from('gallery_photos')
      .select('id')
      .eq('storage_path', bucketPath)
      .maybeSingle();

    if (existingRow?.id) {
      const { error: updateError } = await supabase
        .from('gallery_photos')
        .update({
          alt_text: item.alt,
          size: item.size,
          sort_order: index,
        })
        .eq('id', existingRow.id);

      if (updateError) {
        console.error(`[ERROR] Update failed for ${bucketPath}: ${updateError.message}`);
      } else {
        console.log(`[OK] Updated ${bucketPath}`);
      }
      continue;
    }

    const { error: insertError } = await supabase.from('gallery_photos').insert([
      {
        storage_path: bucketPath,
        alt_text: item.alt,
        size: item.size,
        sort_order: index,
      },
    ]);

    if (insertError) {
      console.error(`[ERROR] Insert failed for ${bucketPath}: ${insertError.message}`);
    } else {
      console.log(`[OK] Inserted ${bucketPath}`);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
