import { useState, useRef, useEffect, useCallback } from 'react'
import { generateDeckUrls } from '../constants'
import type { ModalState, ModalActions, AppActions } from '../types'

type EditableFieldName = 'playerName' | 'deckName'

interface ImageModalProps {
  // モーダル状態
  modalState: ModalState
  modalActions: ModalActions
  onUpdateDeck: AppActions['updateDeck']

  // ナビゲーション制御
  hasMultipleDecks: boolean
  totalDecks: number
}

export const ImageModal = ({
  modalState,
  modalActions,
  onUpdateDeck,
  hasMultipleDecks,
  totalDecks,
}: ImageModalProps) => {
  const [imageError, setImageError] = useState(false)
  const [editingField, setEditingField] = useState<EditableFieldName | null>(
    null
  )
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const prevDeckIdRef = useRef<string | undefined>(undefined)
  const currentDeckId = modalState.enlargedImage?.deckId
  if (currentDeckId !== prevDeckIdRef.current) {
    prevDeckIdRef.current = currentDeckId
    if (editingField !== null) {
      setEditingField(null)
    }
  }

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingField])

  // バックドロップクリックハンドラー
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        modalActions.closeModal()
      }
    },
    [modalActions]
  )

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  const handlePrevClick = useCallback(() => {
    modalActions.navigateModal('prev')
    setImageError(false)
  }, [modalActions])

  const handleNextClick = useCallback(() => {
    modalActions.navigateModal('next')
    setImageError(false)
  }, [modalActions])

  const startEditing = useCallback(
    (field: EditableFieldName) => {
      if (!modalState.enlargedImage) return
      setEditingField(field)
      setEditValue(modalState.enlargedImage[field] || '')
    },
    [modalState.enlargedImage]
  )

  // Enterキーでデッキ名編集を開始
  useEffect(() => {
    const handleEnterKey = (e: KeyboardEvent) => {
      if (!modalState.enlargedImage) return
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (e.key === 'Enter') {
        startEditing('deckName')
      }
    }
    document.addEventListener('keydown', handleEnterKey)
    return () => document.removeEventListener('keydown', handleEnterKey)
  }, [modalState.enlargedImage, startEditing])

  const saveEdit = useCallback(() => {
    if (editingField && modalState.enlargedImage) {
      const trimmed = editValue.trim()
      onUpdateDeck(modalState.enlargedImage.deckId, {
        [editingField]: trimmed || undefined,
      })
      modalActions.updateModalImage({ [editingField]: trimmed || undefined })
      setEditingField(null)
    }
  }, [
    editingField,
    editValue,
    modalState.enlargedImage,
    onUpdateDeck,
    modalActions,
  ])

  const cancelEdit = useCallback(() => {
    setEditingField(null)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        saveEdit()
      } else if (e.key === 'Escape') {
        cancelEdit()
      }
    },
    [saveEdit, cancelEdit]
  )

  const renderEditableField = (
    field: EditableFieldName,
    value: string | undefined,
    placeholder: string,
    textClass: string,
    containerClass: string
  ) => {
    if (editingField === field) {
      return (
        <div className={containerClass}>
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${textClass} bg-white/20 border border-white/40 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-300 text-white placeholder-gray-400 w-64 max-w-full`}
          />
        </div>
      )
    }

    if (value) {
      return (
        <div
          className={`${containerClass} cursor-pointer hover:bg-white/10 rounded px-2 py-0.5 transition-colors`}
          onClick={() => startEditing(field)}
          title="クリックして編集"
        >
          <span className={textClass}>{value}</span>
        </div>
      )
    }

    return (
      <div
        className={`${containerClass} cursor-pointer hover:bg-white/10 rounded px-2 py-0.5 transition-colors`}
        onClick={() => startEditing(field)}
      >
        <span className={`${textClass} text-gray-400 italic`}>
          {placeholder}
        </span>
      </div>
    )
  }

  if (!modalState.enlargedImage) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative flex flex-col max-w-4xl max-h-full">
        {/* 閉じるボタン */}
        <button
          onClick={modalActions.closeModal}
          className="absolute top-2 right-2 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
          title="閉じる (ESC)"
        >
          <svg
            className="w-6 h-6"
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

        {/* 前の画像ボタン */}
        {hasMultipleDecks && (
          <button
            onClick={handlePrevClick}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
            title="前の画像 (↑ / ←)"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* 次の画像ボタン */}
        {hasMultipleDecks && (
          <button
            onClick={handleNextClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
            title="次の画像 (↓ / →)"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}

        {/* 画像表示 */}
        {!imageError ? (
          <img
            src={modalState.enlargedImage.url}
            alt={`デッキコード: ${modalState.enlargedImage.deckCode}`}
            className="max-w-full object-contain rounded-t-lg shadow-2xl min-h-0 flex-shrink"
            onError={handleImageError}
          />
        ) : (
          <div
            className="p-8 bg-gray-200 text-center text-gray-600 rounded-t-lg"
            style={{ minHeight: '300px' }}
          >
            <div className="flex items-center justify-center h-full">
              <div>
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
                <p className="text-lg">画像を読み込めませんでした</p>
              </div>
            </div>
          </div>
        )}

        {/* 情報表示エリア */}
        <div className="bg-gray-900 text-white p-4 rounded-b-lg flex-shrink-0">
          <div className="text-center">
            {/* 現在位置表示 */}
            {hasMultipleDecks && (
              <div className="text-xs text-gray-300 mb-2">
                {modalState.enlargedImage.index + 1} / {totalDecks}
              </div>
            )}

            {/* プレイヤー名 */}
            {renderEditableField(
              'playerName',
              modalState.enlargedImage.playerName,
              'プレイヤー名を追加',
              'text-lg font-semibold',
              'mb-1'
            )}

            {/* デッキ名 */}
            {renderEditableField(
              'deckName',
              modalState.enlargedImage.deckName,
              'デッキ名を追加',
              'text-sm text-gray-200',
              'mb-1'
            )}

            {/* デッキコード */}
            <div className="text-sm">
              デッキコード:{' '}
              <a
                href={
                  generateDeckUrls(modalState.enlargedImage.deckCode).confirm
                }
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-300 hover:text-blue-100 hover:underline"
              >
                {modalState.enlargedImage.deckCode}
              </a>
            </div>

            {/* キーボードショートカット表示 */}
            {hasMultipleDecks && (
              <div className="text-xs text-gray-400 mt-2">
                ↑↓ または ←→ で画像切替、Enter でデッキ名編集、ESC で閉じる
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
