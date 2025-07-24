import { useState } from 'react'
import type { DeckData } from '../hooks/useAppState'
import { generateDeckUrls } from '../constants'

interface DeckCardProps {
  deck: DeckData
  onImageClick: (deck: DeckData) => void
  onRemove: (id: string) => void
}

export const DeckCard = ({ deck, onImageClick, onRemove }: DeckCardProps) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageClick = () => {
    onImageClick(deck)
  }

  const handleRemoveClick = () => {
    onRemove(deck.id)
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative">
        {!imageError ? (
          <img
            src={deck.imageUrl}
            alt={`デッキコード: ${deck.code}`}
            className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
            onClick={handleImageClick}
            onError={handleImageError}
          />
        ) : (
          <div 
            className="p-4 bg-gray-100 text-center text-gray-500 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ minHeight: '150px' }}
            onClick={handleImageClick}
          >
            <div className="flex items-center justify-center h-full">
              <div>
                <svg 
                  className="mx-auto h-8 w-8 text-gray-400 mb-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="text-sm">画像を読み込めませんでした</p>
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={handleRemoveClick}
          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-md"
          title="削除"
        >
          <svg 
            className="w-3 h-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
      
      <div className="p-3">
        {deck.playerName && (
          <div 
            className="text-sm font-semibold text-gray-800 mb-1 truncate" 
            title={deck.playerName}
          >
            {deck.playerName}
          </div>
        )}
        <div className="text-xs text-gray-600 mb-1">
          <p className="truncate" title={deck.code}>
            コード:{' '}
            <a
              href={generateDeckUrls(deck.code).confirm}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {deck.code}
            </a>
          </p>
        </div>
        <div className="text-xs text-gray-400">
          {deck.addedAt.toLocaleDateString('ja-JP')}
        </div>
      </div>
    </div>
  )
}