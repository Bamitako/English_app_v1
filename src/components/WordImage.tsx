import type { Word } from '../types'

/**
 * Photo when one has been dropped into /public/images, otherwise the emoji stands
 * in so the picture-first loop still works. The situation text is always shown:
 * it is what narrows an ambiguous picture down to one intended word.
 */
export const WordImage = ({ word }: { word: Word }) => (
  <figure className="word-image">
    {word.image ? (
      <img src={word.image} alt="" />
    ) : (
      <div className="word-image__emoji" aria-hidden="true">
        {word.emoji}
      </div>
    )}
    <figcaption>{word.context}</figcaption>
  </figure>
)
