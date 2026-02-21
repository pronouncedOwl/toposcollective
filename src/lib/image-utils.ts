/**
 * Utility functions for image handling
 * This file must not import any server-only code to be usable in client components
 */

export const getRandomStrip = (images: { url: string; alt: string }[], max: number) => {
  const unique = Array.from(new Map(images.map((image) => [image.url, image])).values());
  if (unique.length <= max) return unique;
  const shuffled = [...unique];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, max);
};
