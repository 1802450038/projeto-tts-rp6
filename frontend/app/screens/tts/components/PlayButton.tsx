import { Asset } from 'expo-asset'
import { Audio } from 'expo-av'
import { Loader2, Pause, Play } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'

type AudioPlayButtonProps = {
  audioPath: string
}

export const AudioPlayButton = ({ audioPath }: AudioPlayButtonProps) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [sound])

  const loadAndPlaySound = async () => {
    try {
      setIsLoading(true)

      if (sound) {
        await sound.unloadAsync()
      }

      const asset = Asset.fromModule(audioPath)
      await asset.downloadAsync()

      const { sound: newSound } = await Audio.Sound.createAsync(
        asset,
        { shouldPlay: true },
        onPlaybackStatusUpdate
      )

      setSound(newSound)
      setIsPlaying(true)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading sound:', error)
      setIsLoading(false)
    }
  }

  const onPlaybackStatusUpdate = async (status: any) => {
    if (status.didJustFinish) {
      setIsPlaying(false)
      if (sound) {
        await sound.setPositionAsync(0)
      }
    }
  }

  const handlePlayPause = async () => {
    try {
      if (!sound) {
        await loadAndPlaySound()
        return
      }

      const status = await sound.getStatusAsync()

      if (isPlaying) {
        await sound.pauseAsync()
        setIsPlaying(false)
      } else {
        if (
          status.isLoaded &&
          status.positionMillis === status.durationMillis
        ) {
          await sound.setPositionAsync(0)
        }
        await sound.playAsync()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error('Error handling play/pause:', error)
      await loadAndPlaySound()
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePlayPause}
      className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center"
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 size={20} color="#fff" className="animate-spin" />
      ) : isPlaying ? (
        <Pause size={20} color="#fff" />
      ) : (
        <Play size={20} color="#fff" />
      )}
    </TouchableOpacity>
  )
}
