import { useState } from 'react'
import type { Progress, StudyMode } from '../types'
import { WORDS } from '../data/words'
import { poolFor } from '../lib/review'

type Props = {
  progress: Progress
  onStart: (mode: StudyMode) => void
  onOpenList: (mode: 'weak' | 'saved') => void
}

export const Home = ({ progress, onStart, onOpenList }: Props) => {
  // Snapshot taken per visit: the screen remounts every time the user comes back.
  const [now] = useState(() => Date.now())
  const reviewCount = poolFor('review', WORDS, progress, now).length
  const weakCount = poolFor('weak', WORDS, progress, now).length
  const savedCount = poolFor('saved', WORDS, progress, now).length

  return (
    <div className="screen home">
      <header className="home__header">
        <h1 className="home__title">見た瞬間、英語が出てくる。</h1>
        <p className="home__subtitle">画像と状況から、日本語を介さず英単語を思い出す。</p>
      </header>

      <button className="button button--primary button--hero" onClick={() => onStart('random')}>
        ランダム学習
        <span className="button__note">{WORDS.length}語から出題</span>
      </button>

      <div className="home__menu">
        <button className="menu-item" onClick={() => onStart('review')} disabled={reviewCount === 0}>
          <span className="menu-item__label">復習</span>
          <span className="menu-item__count">{reviewCount}</span>
        </button>
        <button className="menu-item" onClick={() => onOpenList('weak')}>
          <span className="menu-item__label">苦手</span>
          <span className="menu-item__count">{weakCount}</span>
        </button>
        <button className="menu-item" onClick={() => onOpenList('saved')}>
          <span className="menu-item__label">自分の単語帳</span>
          <span className="menu-item__count">{savedCount}</span>
        </button>
      </div>
    </div>
  )
}
