import { useCallback, useEffect, useState } from 'react'
import type { Progress, Rating } from '../types'
import { loadProgress, saveProgress } from '../lib/storage'
import { applyRating, stateFor } from '../lib/review'

export const useProgress = () => {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const rate = useCallback((wordId: string, rating: Rating) => {
    setProgress((prev) => ({
      ...prev,
      [wordId]: applyRating(stateFor(prev, wordId), rating, Date.now()),
    }))
  }, [])

  const toggleSaved = useCallback((wordId: string) => {
    setProgress((prev) => {
      const current = stateFor(prev, wordId)
      return { ...prev, [wordId]: { ...current, isSaved: !current.isSaved } }
    })
  }, [])

  return { progress, rate, toggleSaved }
}
