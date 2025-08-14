import { create } from 'zustand'
import type { LocalFonts } from '../hooks/useLocalFonts'

type FontSettingsDrawerStoreProps = {
  isFontDrawerVisible: boolean
  setFontDrawerVisible: (visible: boolean) => void
  isFontSelectorVisible: boolean
  setFontSelectorVisible: (visible: boolean) => void
  selectedFont: LocalFonts
  setSelectedFont: (font: LocalFonts) => void
  currentFontSize: number
  setCurrentFontSize: (size: number) => void
}

export const useSettingsFontDrawerStore = create<FontSettingsDrawerStoreProps>(
  (set) => ({
    isFontDrawerVisible: false,
    setFontDrawerVisible: (visible: boolean) =>
      set({ isFontDrawerVisible: visible }),
    isFontSelectorVisible: false,
    setFontSelectorVisible: (visible: boolean) =>
      set({ isFontSelectorVisible: visible }),
    selectedFont: 'Roboto',
    setSelectedFont: (font: LocalFonts) => set({ selectedFont: font }),
    currentFontSize: 20,
    setCurrentFontSize: (size: number) => set({ currentFontSize: size })
  })
)

export const SettingsDrawerStore = {
  isFontDrawerVisible: false,
  setFontDrawerVisible: (visible: boolean) =>
    useSettingsFontDrawerStore.setState({ isFontDrawerVisible: visible }),
  isFontSelectorVisible: false,
  setFontSelectorVisible: (visible: boolean) =>
    useSettingsFontDrawerStore.setState({ isFontSelectorVisible: visible }),
  selectedFont: 'Roboto',
  setSelectedFont: (font: LocalFonts) =>
    useSettingsFontDrawerStore.setState({ selectedFont: font }),
  currentFontSize: 20,
  setCurrentFontSize: (size: number) =>
    useSettingsFontDrawerStore.setState({ currentFontSize: size })
}
