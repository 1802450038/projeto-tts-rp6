import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'
import { Loading } from '~/app/components/LoadingComponents'
import { SpeechSynchronizedText } from './components/SpeechSynchronizedText'
import { useFetchTextToSpeech } from './hooks/useFetchTextToSpeech'

export default function TextToSpeech() {
  const { params, isLoading, fileUri, speechMarks } = useFetchTextToSpeech()

  if (isLoading) {
    return <Loading />
  }

  return (
    <SpeechSynchronizedText
      uri={fileUri}
      speechMarks={speechMarks}
      pageNumber={+params.currentPage}
      currentParagraph={params.currentParagraph ? +params.currentParagraph : 0}
      currentPage={+params.currentPage}
      documentId={params.documentId}
      voiceId={params.voiceId as VoiceId}
      languageCode={params.languageCode as LanguageCode}
    />
  )
}
