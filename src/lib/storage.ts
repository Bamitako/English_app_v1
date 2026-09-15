import type { Progress } from '../types'

const KEY = 'english-app-v1:progress'

export const loadProgress = (): Progress => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return {}
    return parsed as Progress
  } catch {
    return {}
  }
}

export const saveProgress = (progress: Progress): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // Private-mode or quota failures must not break the study loop.
  }
}
