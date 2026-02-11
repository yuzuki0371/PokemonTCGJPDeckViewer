import { useState, useEffect, useCallback } from 'react'
import type {
  ViewSettings,
  ViewSettingsActions,
  ViewMode,
  CardSize,
  TabMode,
} from '../types'
import { DEFAULT_VIEW_SETTINGS, VIEW_SETTINGS_STORAGE_KEY } from '../constants'

// localStorageから設定を読み込む関数
const loadSettingsFromStorage = (): ViewSettings => {
  try {
    const stored = localStorage.getItem(VIEW_SETTINGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ViewSettings>
      return {
        viewMode: parsed.viewMode || DEFAULT_VIEW_SETTINGS.viewMode,
        cardSize: parsed.cardSize || DEFAULT_VIEW_SETTINGS.cardSize,
        activeTab: parsed.activeTab || DEFAULT_VIEW_SETTINGS.activeTab,
      }
    }
  } catch (error) {
    console.error('Failed to load view settings:', error)
  }
  return DEFAULT_VIEW_SETTINGS
}

export const useViewSettings = (): [ViewSettings, ViewSettingsActions] => {
  const [settings, setSettings] = useState<ViewSettings>(
    loadSettingsFromStorage
  )

  // 設定変更時にlocalStorageに保存
  useEffect(() => {
    try {
      localStorage.setItem(VIEW_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    } catch (error) {
      console.error('Failed to save view settings:', error)
    }
  }, [settings])

  const setViewMode = useCallback((mode: ViewMode) => {
    setSettings((prev) => ({ ...prev, viewMode: mode }))
  }, [])

  const setCardSize = useCallback((size: CardSize) => {
    setSettings((prev) => ({ ...prev, cardSize: size }))
  }, [])

  const setActiveTab = useCallback((tab: TabMode) => {
    setSettings((prev) => ({ ...prev, activeTab: tab }))
  }, [])

  const actions: ViewSettingsActions = {
    setViewMode,
    setCardSize,
    setActiveTab,
  }

  return [settings, actions]
}
