let cached: SpeechSynthesisVoice | null = null

const pickVoice = (): SpeechSynthesisVoice | null => {
  if (cached) return cached
  const voices = speechSynthesis.getVoices()
  if (voices.length === 0) return null

  cached =
    voices.find((v) => v.lang === 'en-GB') ??
    voices.find((v) => v.lang === 'en-US') ??
    voices.find((v) => v.lang.startsWith('en')) ??
    null

  return cached
}

export const speak = (text: string): void => {
  if (!('speechSynthesis' in window)) return

  speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice()
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? 'en-GB'
  utterance.rate = 0.9
  speechSynthesis.speak(utterance)
}
