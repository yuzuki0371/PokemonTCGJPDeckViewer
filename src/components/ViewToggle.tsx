import { memo } from 'react'
import type { ViewSettings, ViewSettingsActions, CardSize } from '../types'

interface ViewToggleProps {
  settings: ViewSettings
  actions: ViewSettingsActions
}

const sizeLabels: Record<CardSize, string> = {
  small: '小',
  medium: '中',
  large: '大',
}

const ViewToggleComponent = ({ settings, actions }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-3">
      {/* グリッド/リスト切り替えボタン */}
      <div className="flex rounded-lg border border-gray-300 overflow-hidden">
        <button
          onClick={() => actions.setViewMode('grid')}
          className={`p-2 transition-colors ${
            settings.viewMode === 'grid'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          title="グリッド表示"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </button>
        <button
          onClick={() => actions.setViewMode('list')}
          className={`p-2 transition-colors ${
            settings.viewMode === 'list'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          title="リスト表示"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* サイズ切り替え（グリッド表示時のみ） */}
      {settings.viewMode === 'grid' && (
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => actions.setCardSize(size)}
              className={`px-3 py-1.5 text-sm transition-colors ${
                settings.cardSize === size
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
              title={`${sizeLabels[size]}サイズ`}
            >
              {sizeLabels[size]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const ViewToggle = memo(ViewToggleComponent)
