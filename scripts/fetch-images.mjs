/**
 * Downloads one stock photo per word from Pexels into src/images/.
 *
 *   PEXELS_API_KEY=xxx npm run fetch-images
 *
 * Words that already have a file are skipped, so re-runs are cheap and never
 * overwrite a picture you picked by hand. To redo specific words:
 *
 *   PEXELS_API_KEY=xxx npm run fetch-images -- --force sour barely
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { WORDS } from '../src/data/words.ts'

const IMAGES_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'images')
const API = 'https://api.pexels.com/v1/search'

const key = process.env.PEXELS_API_KEY
if (!key) {
  console.error('PEXELS_API_KEY が未設定です。https://www.pexels.com/api/ で無料キーを取得してください。')
  process.exit(1)
}

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.filter((a) => !a.startsWith('--'))

await mkdir(IMAGES_DIR, { recursive: true })
const existing = new Set(
  (await readdir(IMAGES_DIR))
    .filter((f) => !f.endsWith('.md'))
    .map((f) => f.replace(/\.[^.]+$/, '')),
)

const targets = WORDS.filter((w) => {
  // No query means no photo can carry this word — it stays on the emoji.
  if (!w.query) return false
  if (only.length > 0) return only.includes(w.id)
  return force || !existing.has(w.id)
})

if (targets.length === 0) {
  console.log('取得対象がありません。すべて揃っています。')
  process.exit(0)
}

console.log(`${targets.length}語ぶん取得します\n`)

const failures = []

for (const [i, word] of targets.entries()) {
  const url = `${API}?query=${encodeURIComponent(word.query)}&per_page=1&orientation=landscape&size=medium`

  try {
    const res = await fetch(url, { headers: { Authorization: key } })
    if (!res.ok) throw new Error(`Pexels ${res.status} ${res.statusText}`)

    const { photos } = await res.json()
    const photo = photos?.[0]
    if (!photo) throw new Error('検索結果が0件')

    const image = await fetch(photo.src.large)
    if (!image.ok) throw new Error(`画像取得に失敗 ${image.status}`)

    await writeFile(join(IMAGES_DIR, `${word.id}.jpg`), Buffer.from(await image.arrayBuffer()))
    console.log(
      `[${i + 1}/${targets.length}] ${word.id.padEnd(16)} "${word.query}"\n` +
        `                  ${photo.photographer} — ${photo.url}`,
    )
  } catch (error) {
    failures.push({ id: word.id, query: word.query, reason: error.message })
    console.log(`[${i + 1}/${targets.length}] ${word.id.padEnd(16)} 失敗: ${error.message}`)
  }

  // Pexels の無料枠は 200 req/hour。連打しない。
  await new Promise((r) => setTimeout(r, 300))
}

console.log(`\n完了: ${targets.length - failures.length}/${targets.length}`)

if (failures.length > 0) {
  console.log('\n取得できなかった単語:')
  for (const f of failures) console.log(`  ${f.id.padEnd(16)} "${f.query}" — ${f.reason}`)
  console.log('\nsrc/data/words.ts の query を書き換えて、--force で再取得してください。')
}

console.log('\n画像を確認して、意図と違うものは src/images/<単語id>.jpg を直接差し替えてください。')
