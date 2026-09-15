import { useState } from 'react'
import type { StudyMode } from './types'
import { useProgress } from './hooks/useProgress'
import { Home } from './components/Home'
import { StudyScreen } from './components/StudyScreen'
import { WordListScreen } from './components/WordListScreen'

type View =
  | { name: 'home' }
  | { name: 'study'; mode: StudyMode }
  | { name: 'list'; mode: 'weak' | 'saved' }

const App = () => {
  const { progress, rate, toggleSaved } = useProgress()
  const [view, setView] = useState<View>({ name: 'home' })

  const goHome = () => setView({ name: 'home' })

  if (view.name === 'study') {
    return (
      <StudyScreen
        key={view.mode}
        mode={view.mode}
        progress={progress}
        onRate={rate}
        onToggleSaved={toggleSaved}
        onExit={goHome}
      />
    )
  }

  if (view.name === 'list') {
    return (
      <WordListScreen
        mode={view.mode}
        progress={progress}
        onStart={() => setView({ name: 'study', mode: view.mode })}
        onToggleSaved={toggleSaved}
        onExit={goHome}
      />
    )
  }

  return (
    <Home
      progress={progress}
      onStart={(mode) => setView({ name: 'study', mode })}
      onOpenList={(mode) => setView({ name: 'list', mode })}
    />
  )
}

export default App
