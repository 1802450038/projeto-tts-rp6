import Slider from '@react-native-community/slider'
import ms from 'pretty-ms'
import { Platform, View } from 'react-native'
import { Text } from '~/components/ui/text'
import type {
  AudioControlsProps,
  PlayBackProps
} from '../hooks/useTextToSpeech'

type PlaybackTimerProps = {
  playback: PlayBackProps
  controls: AudioControlsProps
}

export const PlaybackTimer = ({ playback, controls }: PlaybackTimerProps) => {
  const format = (milliseconds: number) =>
    ms(milliseconds, {
      colonNotation: true,
      secondsDecimalDigits: 0,
      unitCount: 2
    })

  return (
    <View className="flex flex-col">
      <Slider
        minimumValue={0}
        value={playback.positionMillis}
        maximumValue={playback.durationMillis}
        onSlidingComplete={controls.seek}
        style={{
          marginLeft: Platform.select({ ios: 0, android: -10 }),
          marginRight: Platform.select({ ios: 0, android: -15 })
        }}
        step={1000}
      />
      <View className="flex flex-row justify-between gap-0.5">
        <Text>{format(playback.positionMillis ?? 0)}</Text>
        <Text>{format(playback.durationMillis ?? 0)}</Text>
      </View>
    </View>
  )
}
