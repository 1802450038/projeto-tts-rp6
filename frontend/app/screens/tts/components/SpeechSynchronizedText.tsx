import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { PageLayout } from '~/app/components/PageLayout'
import { useSettingsFontDrawerStore } from '~/app/stores/useFontSettingsDrawerStore'
import { cn } from '~/lib/utils'
import { FontSettingsDrawer } from '../components/FontSettingsDrawer'
import { OpenSettings } from '../components/OpenSettings'
import { Playback } from '../components/Playback'
import { type SpeechMark, useTextToSpeech } from '../hooks/useTextToSpeech'
import { PageSelector } from './PageSelector'

interface Sentence {
  time: number
  value: string
}

type SpeechSynchronizedTextProps = {
  uri: string | null
  speechMarks: SpeechMark[]
  pageNumber: number
  currentParagraph?: number
  documentId: string
  voiceId: VoiceId
  languageCode: LanguageCode
  currentPage: number
}

const SpeechSynchronizedText = ({
  uri,
  speechMarks,
  currentParagraph,
  documentId,
  voiceId,
  languageCode,
  currentPage
}: SpeechSynchronizedTextProps) => {
  const flatListRef = useRef<FlatList<Sentence>>(null)
  const { playback, controls, marks } = useTextToSpeech({
    speechMarks,
    uri,
    currentParagraph
  })
  const { sentences } = marks
  const router = useRouter()

  const selectedFont = useSettingsFontDrawerStore((state) => state.selectedFont)
  const currentFontSize = useSettingsFontDrawerStore(
    (state) => state.currentFontSize
  )

  const getCurrentParagraphIndex = useCallback((): number => {
    return sentences.findIndex((item, index) => {
      const nextTime = sentences[index + 1]?.time || playback.durationMillis
      return (
        playback.positionMillis >= item.time &&
        playback.positionMillis < nextTime
      )
    })
  }, [sentences, playback.positionMillis, playback.durationMillis])

  useEffect(() => {
    const currentIndex = getCurrentParagraphIndex()
    if (currentIndex !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.5
      })
    }
  }, [getCurrentParagraphIndex])

  const onScrollToIndexFailed = useCallback(
    (info: {
      index: number
      averageItemLength: number
      highestMeasuredFrameIndex: number
    }) => {
      const wait = new Promise((resolve) => setTimeout(resolve, 500))
      wait.then(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: info.index,
            animated: true,
            viewPosition: 0.5
          })
        }
      })
    },
    []
  )

  const renderItem = useCallback(
    ({
      item,
      index
    }: {
      item: Sentence
      index: number
    }) => {
      const isActive =
        playback.positionMillis >= item.time &&
        playback.positionMillis <
          (sentences[index + 1]?.time || playback.durationMillis)

      return (
        <Text
          key={`sentence-${index}`}
          onPress={() => controls.seek(item.time)}
          style={{
            fontSize: currentFontSize,
            lineHeight: currentFontSize * 1.25,
            fontFamily: selectedFont
          }}
          className={cn(
            'px-3.5 py-2.5 text-base leading-6',
            isActive ? 'bg-[#18181B] text-[#29c97e] rounded-xl' : 'text-black'
          )}
        >
          {item.value}
        </Text>
      )
    },
    [
      controls,
      playback.positionMillis,
      playback.durationMillis,
      sentences,
      currentFontSize,
      selectedFont
    ]
  )

  return (
    <PageLayout>
      <View className="flex-1 mx-3 mb-16">
        <View className="bg-white rounded-xl shadow-sm py-6">
          <View className="flex flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex flex-row items-center gap-4">
              <Pressable onPress={() => router.back()}>
                <ArrowLeft size={24} color="#29c97e" />
              </Pressable>
              <PageSelector
                documentId={documentId}
                voiceId={voiceId}
                languageCode={languageCode}
                defaultPageNumber={currentPage}
              />
            </View>
            <OpenSettings />
          </View>
          {!speechMarks.length && (
            <Text className="text-center text-xl text-red-500 mt-4">
              Nenhuma transcrição encontrada
            </Text>
          )}
          <FlatList
            ref={flatListRef}
            data={sentences}
            className="p-2"
            keyExtractor={(_, index) => `sentence-${index}`}
            renderItem={renderItem}
            onScrollToIndexFailed={onScrollToIndexFailed}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
          />
        </View>
        <FontSettingsDrawer />
      </View>
      <Playback playback={playback} controls={controls} />
    </PageLayout>
  )
}

export { SpeechSynchronizedText }
