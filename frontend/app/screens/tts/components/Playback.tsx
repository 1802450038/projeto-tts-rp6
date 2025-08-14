import {
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Pause,
  Play
} from 'lucide-react-native'
import React, { useState } from 'react'
import { Image, Pressable, View } from 'react-native'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'
import type {
  AudioControlsProps,
  PlayBackProps
} from '../hooks/useTextToSpeech'

import { useLocalSearchParams } from 'expo-router'
import { LanguageDrawer } from './LanguageDrawer'
import { PlaybackTimer } from './PlaybackTimer'

type PlaybackProps = {
  playback: PlayBackProps
  controls: AudioControlsProps
}

type Params = {
  documentId: string
}

export const Playback = ({ playback, controls }: PlaybackProps) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [selectedLanguage, setSelectedLanguage] = useState('pt-BR')
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const params = useLocalSearchParams<Params>()

  const handleSpeedChange = () => {
    const speeds = [1.0, 1.5, 2.0, 0.5]
    const currentIndex = speeds.indexOf(playbackSpeed)
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length]
    setPlaybackSpeed(nextSpeed)
    controls.setPlaybackSpeed(nextSpeed as any)
  }

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language)
  }

  return (
    <View className="w-full flex gap-5 pb-7 pt-2.5 bg-primary/10 px-4">
      <PlaybackTimer playback={playback} controls={controls} />
      <View className="flex-row items-center justify-between w-full">
        <Pressable
          className="items-center"
          onPress={() => setIsDrawerVisible((prev) => !prev)}
        >
          <View className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 overflow-hidden">
            <Image
              source={require('../../../../assets/images/brazil.png')}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </Pressable>

        <View className="flex-row items-center gap-4">
          <Button
            variant="outline"
            className="rounded-full w-12 h-12"
            onPress={controls.stepBackward}
          >
            <ChevronsLeft size={24} color="#29c97e" />
          </Button>

          <Button
            className="rounded-full w-12 items-center justify-center"
            onPress={controls.play}
          >
            {playback.isLoading ? (
              <View className="animate-spin">
                <Loader2 size={24} color="#29c97e" />
              </View>
            ) : playback.isPlaying ? (
              <Pause size={24} color="#29c97e" />
            ) : (
              <Play size={24} color="#29c97e" />
            )}
          </Button>

          <Button
            variant="outline"
            className="rounded-full w-12 h-12"
            onPress={controls.stepForward}
          >
            <ChevronsRight size={24} color="#29c97e" />
          </Button>
        </View>

        <Pressable className="items-center" onPress={handleSpeedChange}>
          <View className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 items-center justify-center">
            <Text className="text-gray-600 text-lg font-medium">
              {playbackSpeed.toFixed(1)}x
            </Text>
          </View>
        </Pressable>
      </View>
      <LanguageDrawer
        documentId={params?.documentId}
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        onSelectLanguage={handleLanguageSelect}
        selectedLanguage={selectedLanguage}
      />
    </View>
  )
}
