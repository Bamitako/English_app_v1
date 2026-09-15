import { useState } from 'react'
import type { Progress, Rating } from '../types'
import { WORDS } from '../data/words'
import { poolFor, stateFor } from '../lib/review'

const RATING_LABEL: Record<Rating, string> = { good: '○', ok: '△', bad: '×' }

const TITLE = { weak: '苦手', saved: '自分の単語帳' } as const
const EMPTY = {
  weak: '苦手な単語はありません。',
  saved: '☆を押した単語がここに並びます。',
} as const

type Props = {
  mode: 'weak' | 'saved'
  progress: Progress
  onStart: () => void
  onToggleSaved: (wordId: string) => void
  onExit: () => void
}

export const WordListScreen = ({ mode, progress, onStart, onToggleSaved, onExit }: Props) => {
  const [now] = useState(() => Date.now())
  const words = poolFor(mode, WORDS, progress, now)

  return (
    <div className="screen list">
      <header className="list__header">
        <button className="link-button" onClick={onExit}>
          ← ホーム
        </button>
        <h2 className="list__title">
          {TITLE[mode]}
          <span className="list__count">{words.length}</span>
        </h2>
      </header>

      {words.length === 0 ? (
        <p className="empty-message">{EMPTY[mode]}</p>
      ) : (
        <>
          <button className="button button--primary" onClick={onStart}>
            {TITLE[mode]}だけ学習
          </button>
          <ul className="word-list">
            {words.map((word) => {
              const state = stateFor(progress, word.id)
              return (
                <li key={word.id} className="word-list__item">
                  <span className="word-list__emoji" aria-hidden="true">
                    {word.emoji}
                  </span>
                  <span className="word-list__text">
                    <strong>{word.word}</strong>
                    <small>{word.meaning}</small>
                  </span>
                  {state.lastRating && (
                    <span className={`word-list__rating word-list__rating--${state.lastRating}`}>
                      {RATING_LABEL[state.lastRating]}
                    </span>
                  )}
                  <button
                    className={`icon-button ${state.isSaved ? 'star--on' : ''}`}
                    onClick={() => onToggleSaved(word.id)}
                    aria-label={state.isSaved ? '単語帳から外す' : '単語帳に追加'}
                    aria-pressed={state.isSaved}
                  >
                    {state.isSaved ? '★' : '☆'}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
