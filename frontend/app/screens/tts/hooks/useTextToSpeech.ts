import { Audio } from 'expo-av'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert } from 'react-native'

export type PlayBackProps = {
  isLoaded: boolean
  isPlaying: boolean
  positionMillis: number
  durationMillis: number
  isLoading: boolean
}

export type AudioControlsProps = {
  play: () => Promise<void>
  pause: () => Promise<void>
  stop: () => Promise<void>
  stepForward: () => Promise<void>
  stepBackward: () => Promise<void>
  seek: (positionMillis: number) => Promise<void>
  setPlaybackSpeed: (
    speed: 0.25 | 0.5 | 1 | 1.25 | 1.5 | 2 | 3
  ) => Promise<void>
}

const DEFAULT_PLAYBACK_PROPS: PlayBackProps = {
  isLoaded: false,
  isPlaying: false,
  positionMillis: 0,
  durationMillis: 0,
  isLoading: false
}

export type SpeechMark = {
  time: number
  type: 'sentence' | 'word'
  start: number
  end: number
  value: string
}

type UseTextToSpeechProps = {
  speechMarks?: SpeechMark[]
  uri?: string | null
  currentParagraph?: number
}

export const useTextToSpeech = ({
  speechMarks,
  uri: fileUri,
  currentParagraph
}: UseTextToSpeechProps = {}) => {
  const [uri, setUri] = useState<string | null>(fileUri || null)
  const [isLoading, setLoading] = useState(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [playback, setPlayback] = useState<PlayBackProps>(
    DEFAULT_PLAYBACK_PROPS
  )

  useEffect(() => {
    if (uri && !sound) {
      const loadSound = async () => {
        setLoading(true)

        try {
          const create = await Audio.Sound.createAsync(
            { uri },
            {
              progressUpdateIntervalMillis: 500,
              shouldPlay: false,
              positionMillis: speechMarks?.[currentParagraph ?? 0]?.time
            }
          )

          if (create.status.isLoaded) {
            create.sound.setOnPlaybackStatusUpdate((props) =>
              setPlayback(props as PlayBackProps)
            )
          }
        } finally {
          setLoading(false)
        }
      }

      loadSound()
    }
  }, [uri, sound, speechMarks, currentParagraph])

  const marks = useMemo(() => {
    if (!speechMarks) {
      return {
        sentences: [],
        wordsBySentence: {}
      }
    }

    return speechMarks.reduce<{
      sentences: SpeechMark[]
      wordsBySentence: Record<number, SpeechMark[]>
    }>(
      (acc, mark) => {
        if (mark.type === 'sentence') {
          acc.sentences.push(mark)
          acc.wordsBySentence[mark.start] = []
        }

        if (mark.type === 'word') {
          const currentSentence = acc.sentences[acc.sentences.length - 1]

          if (
            currentSentence &&
            mark.start >= currentSentence.start &&
            mark.end <= currentSentence.end
          ) {
            acc.wordsBySentence[currentSentence.start].push(mark)
          }
        }

        return acc
      },
      {
        sentences: [],
        wordsBySentence: {}
      }
    )
  }, [speechMarks])

  const play = useCallback(async () => {
    if (!uri) {
      Alert.alert('Alerta', 'Nenhuma URI encontrado')
      return
    }
    setLoading(true)

    try {
      if (!sound) {
        const create = await Audio.Sound.createAsync(
          { uri },
          {
            progressUpdateIntervalMillis: 500,
            shouldPlay: false,
            positionMillis: speechMarks?.[currentParagraph ?? 0]?.time
          }
        )

        if (create.status.isLoaded) {
          create.sound.setOnPlaybackStatusUpdate((props) =>
            setPlayback(props as PlayBackProps)
          )
          await create.sound.playAsync()
          setSound(create.sound)
        }
        return
      }

      const status = await sound.getStatusAsync()

      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync()
        return
      }

      await sound.playAsync()
    } catch {
      setSound(null)
    } finally {
      setLoading(false)
    }
  }, [uri, sound, speechMarks, currentParagraph])

  const stop = useCallback(async () => {
    await sound?.stopAsync()
  }, [sound])

  const pause = useCallback(async () => {
    await sound?.pauseAsync()
  }, [sound])

  const stepForward = useCallback(async () => {
    await sound?.setPositionAsync(playback.positionMillis + 5000)
  }, [sound, playback])

  const stepBackward = useCallback(async () => {
    await sound?.setPositionAsync(playback.positionMillis - 5000)
  }, [sound, playback])

  const seek = useCallback(
    async (positionMillis: number) => {
      await sound?.setPositionAsync(positionMillis)
    },
    [sound]
  )

  const setPlaybackSpeed = useCallback(
    async (speed: number) => {
      await sound?.setRateAsync(speed, true)
    },
    [sound]
  )

  useEffect(() => {
    return () => {
      sound?.unloadAsync()
    }
  }, [sound])

  return {
    playback: {
      ...playback,
      isLoading
    },
    audio: {
      setUri
    },
    marks,
    controls: {
      play,
      pause,
      stop,
      stepForward,
      stepBackward,
      seek,
      setPlaybackSpeed,
      marks
    }
  }
}
