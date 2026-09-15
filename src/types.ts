export type Rating = 'good' | 'ok' | 'bad'

export type PartOfSpeech = 'verb' | 'adjective' | 'noun' | 'adverb'

export type Word = {
  id: string
  word: string
  meaning: string
  pos: PartOfSpeech
  /** Situation text shown with the image to narrow down an otherwise ambiguous picture. */
  context: string
  emoji: string
  /** Overrides the derived first-letter hint when a word needs something different. */
  hint?: string
  acceptableAnswers?: string[]
}

/** Null rating/schedule means the word was starred but never studied. */
export type WordState = {
  wordId: string
  lastRating: Rating | null
  nextReviewAt: number | null
  isWeak: boolean
  consecutiveCorrect: number
  isSaved: boolean
  lastStudiedAt: number | null
}

export type Progress = Record<string, WordState>

export type StudyMode = 'random' | 'review' | 'weak' | 'saved'
