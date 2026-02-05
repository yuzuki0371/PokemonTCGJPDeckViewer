import type { DeckData } from './deck';

// モーダル関連の型定義

export interface ModalImage {
  url: string;
  deckCode: string;
  playerName?: string;
  deckName?: string;
  index: number;
}

export interface ModalState {
  enlargedImage: ModalImage | null;
}

export interface ModalActions {
  openModal: (deck: DeckData, index: number) => void;
  closeModal: () => void;
  navigateModal: (direction: "prev" | "next") => void;
}