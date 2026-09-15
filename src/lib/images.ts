/**
 * Word photos are matched by filename: `src/images/borrow.jpg` becomes the picture
 * for the word whose id is `borrow`. Dropping a file in is the only step — Vite
 * resolves and fingerprints it here, and words with no file fall back to the emoji.
 */
const files = import.meta.glob('../images/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const byId: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.split('/').pop()!.replace(/\.[^.]+$/, ''),
    url,
  ]),
)

export const imageFor = (wordId: string): string | undefined => byId[wordId]
