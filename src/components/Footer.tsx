import { memo } from 'react'

const FooterComponent = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl py-3">
        <div className="text-left">
          <p className="text-sm text-gray-600">
            © 2025 yuzuki0371. All rights reserved.
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            本ウェブサイトに掲載されているポケモントカードゲームに関する画像情報の著作権は、（株）クリーチャーズ、（株）ポケモンに帰属します。
            <br />
            本ウェブサイトは、（株）クリーチャーズ、（株）ポケモンによって制作、推奨、支援、または関連付けられたものではありません。
          </p>
        </div>
      </div>
    </footer>
  )
}

// 静的コンテンツなのでmemo化して最適化
export const Footer = memo(FooterComponent)