import type { Progress, Rating, Word, WordState } from '../types'

const DAY = 24 * 60 * 60 * 1000

const startOfDayAfter = (from: number, days: number): number => {
  const d = new Date(from)
  d.setHours(0, 0, 0, 0)
  return d.getTime() + days * DAY
}

export const initialState = (wordId: string): WordState => ({
  wordId,
  lastRating: null,
  nextReviewAt: null,
  isWeak: false,
  consecutiveCorrect: 0,
  isSaved: false,
  lastStudiedAt: null,
})

export const stateFor = (progress: Progress, wordId: string): WordState =>
  progress[wordId] ?? initialState(wordId)

const nextReviewAt = (rating: Rating, now: number): number => {
  switch (rating) {
    // Due again today. Within a session the re-insert queue brings it back sooner.
    case 'bad':
      return now
    case 'ok':
      return startOfDayAfter(now, 1)
    case 'good':
      return startOfDayAfter(now, 3)
  }
}

export const applyRating = (prev: WordState, rating: Rating, now: number): WordState => {
  const consecutiveCorrect = rating === 'good' ? prev.consecutiveCorrect + 1 : 0
  const isWeak = rating === 'good' ? prev.isWeak && consecutiveCorrect < 2 : true

  return {
    ...prev,
    lastRating: rating,
    nextReviewAt: nextReviewAt(rating, now),
    isWeak,
    consecutiveCorrect,
    lastStudiedAt: now,
  }
}

export const isDue = (state: WordState, now: number): boolean =>
  state.nextReviewAt !== null && state.nextReviewAt <= now

export const poolFor = (
  mode: 'random' | 'review' | 'weak' | 'saved',
  words: Word[],
  progress: Progress,
  now: number,
): Word[] => {
  switch (mode) {
    case 'random':
      return words
    case 'review':
      return words.filter((w) => isDue(stateFor(progress, w.id), now))
    case 'weak':
      return words.filter((w) => stateFor(progress, w.id).isWeak)
    case 'saved':
      return words.filter((w) => stateFor(progress, w.id).isSaved)
  }
}

/** Keeps the same word from reappearing back-to-back in a long random session. */
export const pickNext = (pool: Word[], recentIds: string[]): Word | null => {
  if (pool.length === 0) return null

  const avoidCount = Math.min(5, pool.length - 1)
  const avoid = avoidCount > 0 ? recentIds.slice(-avoidCount) : []
  const candidates = pool.filter((w) => !avoid.includes(w.id))
  const from = candidates.length > 0 ? candidates : pool

  return from[Math.floor(Math.random() * from.length)]
}
