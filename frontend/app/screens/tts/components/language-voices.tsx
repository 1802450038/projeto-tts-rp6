import type { LanguageCode, VoiceId } from '@aws-sdk/client-polly'

export type VoiceActor = {
  id: string
  voiceId: VoiceId
  languageCode: LanguageCode
  country: string
  gender: 'Feminino' | 'Masculino'
  engine?: 'neural' | 'standard'
  isPremium: boolean
  audioPath: string
  imagePath: string
}

export type Language = {
  code: string
  name: string
  voices: VoiceActor[]
}

export const languages: Language[] = [
  {
    code: 'pt',
    name: 'Português',
    voices: [
      {
        id: '1',
        voiceId: 'Camila',
        languageCode: 'pt-BR',
        country: 'Português (Brasil)',
        gender: 'Feminino',
        audioPath: require('../../../../assets/audios/pt-BR/camila.mp3'),
        isPremium: false,
        imagePath:
          'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTkbyFUTrAlmc8_MjE18s4UpTMmPx3q2t6OZEcgVkg4ffb4Ta6s'
      },
      {
        id: '2',
        voiceId: 'Thiago',
        languageCode: 'pt-BR',
        country: 'Português (Brasil)',
        gender: 'Masculino',
        audioPath: require('../../../../assets/audios/pt-BR/thiago.mp3'),
        isPremium: false,
        imagePath: 'https://cdn-icons-png.flaticon.com/512/4202/4202841.png'
      },
      {
        id: '3',
        voiceId: 'Vitoria',
        languageCode: 'pt-BR',
        country: 'Português (Brasil)',
        gender: 'Feminino',
        audioPath: require('../../../../assets/audios/pt-BR/vitoria.mp3'),
        isPremium: false,
        imagePath:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS37SVHntKnK8ijwqw5I7sQcZlOh_KRT_7ZHiTh0hGU4z30G7sv'
      },
      {
        id: '4',
        voiceId: 'Ricardo',
        languageCode: 'pt-BR',
        country: 'Português (Brasil)',
        engine: 'standard',
        gender: 'Masculino',
        audioPath: require('../../../../assets/audios/pt-BR/ricardo.mp3'),
        isPremium: false,
        imagePath:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwR3i3fLT4CP1e8C8IwH3OUyse9dkjZehwkN2WZmL4hJJBDcFn'
      }
    ]
  },
  {
    code: 'en',
    name: 'English',
    voices: [
      {
        id: '5',
        voiceId: 'Danielle',
        languageCode: 'en-US',
        country: 'English (USA)',
        gender: 'Feminino',
        audioPath: require('../../../../assets/audios/en-US/danielle.mp3'),
        isPremium: false,
        imagePath:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLMei5-gLEuOdttW3O3MgWYuPpmheiyosIvOrI_3Ng5E33_Ul'
      },
      {
        id: '6',
        voiceId: 'Gregory',
        languageCode: 'en-US',
        country: 'English (USA)',
        gender: 'Masculino',
        audioPath: require('../../../../assets/audios/en-US/gregory.mp3'),
        isPremium: false,
        imagePath:
          'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSsG7H3duOaYrxQsFCcfndmHZEUAGs4xfQ0hyFwyr4rq0jwTJFy'
      }
    ]
  },
  {
    code: 'gr',
    name: 'Deutsch',
    voices: [
      {
        id: '7',
        voiceId: 'Daniel',
        languageCode: 'de-DE',
        country: 'German (Deutschland)',
        gender: 'Masculino',
        audioPath: require('../../../../assets/audios/de-DE/daniel.mp3'),
        isPremium: false,
        imagePath: 'https://cdn-icons-png.flaticon.com/512/2118/2118603.png'
      },
      {
        id: '8',
        voiceId: 'Hannah',
        languageCode: 'de-AT',
        country: 'German (Austria)',
        gender: 'Feminino',
        audioPath: require('../../../../assets/audios/de-AT/hannah.mp3'),
        isPremium: false,
        imagePath:
          'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSry8Sb4t4uPiVIKz8uDh3nk8TZ7d2JBnUdK7JNLL0LewKJERZy'
      },
      {
        id: '9',
        voiceId: 'Vicki',
        languageCode: 'de-DE',
        country: 'German (Deutschland)',
        gender: 'Feminino',
        audioPath: require('../../../../assets/audios/de-DE/vicki.mp3'),
        isPremium: false,
        imagePath:
          'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSry8Sb4t4uPiVIKz8uDh3nk8TZ7d2JBnUdK7JNLL0LewKJERZy'
      }
    ]
  }
]
