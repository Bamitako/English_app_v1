import { useState } from 'react'
import type { Progress, Rating, StudyMode, Word } from '../types'
import { WORDS, getHint } from '../data/words'
import { applyRating, pickNext, poolFor, stateFor } from '../lib/review'
import { speak } from '../lib/speech'
import { WordImage } from './WordImage'

/** How many questions later a × comes back around within the session. */
const REINSERT_AFTER = 3

type Pending = { wordId: string; countdown: number }

const EMPTY_MESSAGE: Record<StudyMode, string> = {
  random: '単語がありません。',
  review: '今日の復習はすべて終わりました。',
  weak: '苦手な単語はありません。',
  saved: '単語帳はまだ空です。学習中に☆を押すと追加できます。',
}

const MODE_TITLE: Record<StudyMode, string> = {
  random: 'ランダム学習',
  review: '復習',
  weak: '苦手',
  saved: '自分の単語帳',
}

type Props = {
  mode: StudyMode
  progress: Progress
  onRate: (wordId: string, rating: Rating) => void
  onToggleSaved: (wordId: string) => void
  onExit: () => void
}

export const StudyScreen = ({ mode, progress, onRate, onToggleSaved, onExit }: Props) => {
  // A null `current` means the pool is exhausted, which is also how a session ends.
  const [current, setCurrent] = useState<Word | null>(() =>
    pickNext(poolFor(mode, WORDS, progress, Date.now()), []),
  )
  const [revealed, setRevealed] = useState(false)
  const [hintShown, setHintShown] = useState(false)
  const [recentIds, setRecentIds] = useState<string[]>([])
  const [pending, setPending] = useState<Pending[]>([])
  const [answered, setAnswered] = useState(0)

  const handleReveal = () => {
    if (!current) return
    setRevealed(true)
    speak(current.word)
  }

  const handleRate = (rating: Rating) => {
    if (!current) return
    const now = Date.now()

    onRate(current.id, rating)

    // The pool has to be read against the rating just given, which `progress`
    // does not carry yet on this render.
    const projected: Progress = {
      ...progress,
      [current.id]: applyRating(stateFor(progress, current.id), rating, now),
    }

    const ticked = pending.map((p) => ({ ...p, countdown: p.countdown - 1 }))
    const queue =
      rating === 'bad' ? [...ticked, { wordId: current.id, countdown: REINSERT_AFTER }] : ticked

    const due = queue.find((p) => p.countdown <= 0)
    const dueWord = due ? WORDS.find((w) => w.id === due.wordId) : undefined

    const nextRecent = [...recentIds, current.id].slice(-10)

    setPending(dueWord ? queue.filter((p) => p !== due) : queue)
    setCurrent(dueWord ?? pickNext(poolFor(mode, WORDS, projected, now), nextRecent))
    setRecentIds(nextRecent)
    setAnswered((n) => n + 1)
    setRevealed(false)
    setHintShown(false)
  }

  if (!current) {
    return (
      <div className="screen screen--center">
        <p className="empty-message">{EMPTY_MESSAGE[mode]}</p>
        {answered > 0 && <p className="empty-count">{answered}問 学習しました</p>}
        <button className="button button--primary" onClick={onExit}>
          ホームに戻る
        </button>
      </div>
    )
  }

  const state = stateFor(progress, current.id)

  return (
    <div className="screen study">
      <header className="study__header">
        <button className="link-button" onClick={onExit}>
          ← やめる
        </button>
        <span className="study__mode">{MODE_TITLE[mode]}</span>
        <span className="study__count">{answered}問</span>
      </header>

      <WordImage word={current} />

      {revealed ? (
        <section className="answer">
          <div className="answer__row">
            <h2 className="answer__word">{current.word}</h2>
            <button
              className="icon-button"
              onClick={() => speak(current.word)}
              aria-label="発音を再生"
            >
              🔊
            </button>
          </div>
          <p className="answer__meaning">{current.meaning}</p>
          {current.acceptableAnswers && (
            <p className="answer__alts">ほかに: {current.acceptableAnswers.join(' / ')}</p>
          )}

          <div className="rating">
            <button className="rating__button rating__button--bad" onClick={() => handleRate('bad')}>
              ×
            </button>
            <button className="rating__button rating__button--ok" onClick={() => handleRate('ok')}>
              △
            </button>
            <button
              className="rating__button rating__button--good"
              onClick={() => handleRate('good')}
            >
              ○
            </button>
          </div>
        </section>
      ) : (
        <section className="prompt">
          {hintShown ? (
            <p className="prompt__hint">
              最初の1文字: <strong>{getHint(current)}</strong>
            </p>
          ) : (
            <button className="button button--ghost" onClick={() => setHintShown(true)}>
              ヒント
            </button>
          )}
          <button className="button button--primary" onClick={handleReveal}>
            答えを見る
          </button>
        </section>
      )}

      <button
        className={`star ${state.isSaved ? 'star--on' : ''}`}
        onClick={() => onToggleSaved(current.id)}
        aria-pressed={state.isSaved}
      >
        {state.isSaved ? '★' : '☆'} 単語帳に追加
      </button>
    </div>
  )
}
