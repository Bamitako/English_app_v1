import type { Word } from '../types'
import { imageFor } from '../lib/images'

/**
 * The situation text is always shown: it is what narrows an ambiguous picture
 * down to the one intended word.
 */
export const WordImage = ({ word }: { word: Word }) => {
  const image = imageFor(word.id)

  return (
    <figure className="word-image">
      {image ? (
        <img src={image} alt="" />
      ) : (
        <div className="word-image__emoji" aria-hidden="true">
          {word.emoji}
        </div>
      )}
      <figcaption>{word.context}</figcaption>
    </figure>
  )
}
