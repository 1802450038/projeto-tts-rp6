import { Text } from 'react-native'
import { cn } from '~/lib/utils'
import type { PlayBackProps, SpeechMark } from '../hooks/useTextToSpeech'

type WordProps = {
  sentenceIndex: number
  sentence: SpeechMark
  wordIndex: number
  word: SpeechMark
  playback: PlayBackProps
  wordsBySentence: Record<number, SpeechMark[]>
  sentences: SpeechMark[]
}

export const Word = ({
  sentenceIndex,
  sentence,
  word,
  wordIndex,
  wordsBySentence,
  sentences,
  playback
}: WordProps) => {
  return (
    <Text
      key={`word-${wordIndex}`}
      className={cn(
        playback.positionMillis >= word.time &&
          playback.positionMillis <
            (wordsBySentence[sentence.start][wordIndex + 1]?.time ||
              sentences[sentenceIndex + 1]?.time ||
              playback.durationMillis) &&
          'bg-yellow-300'
      )}
      style={{ fontSize: 19, lineHeight: 30, borderRadius: 10 }}
    >
      {word.value.concat(' ')}
    </Text>
  )
}
