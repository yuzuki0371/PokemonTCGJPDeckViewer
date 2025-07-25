// Pokemon Card 公式サイトのURL定数
export const POKEMON_CARD_URLS = {
  DECK_VIEW: 'https://www.pokemon-card.com/deck/deckView.php/deckID/',
  DECK_CONFIRM: 'https://www.pokemon-card.com/deck/confirm.html/deckID/'
} as const;

// localStorage のキー定数
export const STORAGE_KEYS = {
  DECK_LIST: 'pokemonTcgDeckList'
} as const;

// URL生成ヘルパー関数
export const generateDeckUrls = (deckCode: string) => ({
  view: `${POKEMON_CARD_URLS.DECK_VIEW}${deckCode}`,
  confirm: `${POKEMON_CARD_URLS.DECK_CONFIRM}${deckCode}`
});

// メッセージ定数のre-export
export { ERROR_MESSAGES, SUCCESS_MESSAGES, UI_MESSAGES } from './messages';