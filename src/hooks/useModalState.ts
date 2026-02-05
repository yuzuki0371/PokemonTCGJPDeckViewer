import { useState, useEffect, useCallback } from "react";
import type { DeckData, ModalState, ModalActions, ModalImage } from "../types";

export const useModalState = (
  deckList: DeckData[]
): [ModalState, ModalActions] => {
  const [modalState, setModalState] = useState<ModalState>({
    enlargedImage: null,
  });

  const openModal = (deck: DeckData, index: number) => {
    setModalState({
      enlargedImage: {
        deckId: deck.id,
        url: deck.imageUrl,
        deckCode: deck.code,
        playerName: deck.playerName,
        deckName: deck.deckName,
        index,
      },
    });
  };

  const closeModal = () => {
    setModalState({
      enlargedImage: null,
    });
  };

  const navigateModal = useCallback(
    (direction: "prev" | "next") => {
      if (!modalState.enlargedImage || deckList.length === 0) return;

      const currentIndex = modalState.enlargedImage.index;
      let newIndex: number;

      if (direction === "prev") {
        newIndex = currentIndex > 0 ? currentIndex - 1 : deckList.length - 1;
      } else {
        newIndex = currentIndex < deckList.length - 1 ? currentIndex + 1 : 0;
      }

      const newDeck = deckList[newIndex];
      setModalState({
        enlargedImage: {
          deckId: newDeck.id,
          url: newDeck.imageUrl,
          deckCode: newDeck.code,
          playerName: newDeck.playerName,
          deckName: newDeck.deckName,
          index: newIndex,
        },
      });
    },
    [modalState.enlargedImage, deckList]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!modalState.enlargedImage) return;

      // 入力フィールドにフォーカス中はモーダルのキーボードショートカットを無効化
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowUp":
          e.preventDefault();
          navigateModal("prev");
          break;
        case "ArrowDown":
          e.preventDefault();
          navigateModal("next");
          break;
        case "ArrowLeft":
          e.preventDefault();
          navigateModal("prev");
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateModal("next");
          break;
      }
    },
    [modalState.enlargedImage, navigateModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const updateModalImage = useCallback(
    (updates: Partial<Pick<ModalImage, 'playerName' | 'deckName'>>) => {
      setModalState((prev) => {
        if (!prev.enlargedImage) return prev;
        return {
          enlargedImage: { ...prev.enlargedImage, ...updates },
        };
      });
    },
    []
  );

  const actions: ModalActions = {
    openModal,
    closeModal,
    navigateModal,
    updateModalImage,
  };

  return [modalState, actions];
};
