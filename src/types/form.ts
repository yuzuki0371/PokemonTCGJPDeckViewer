// フォーム関連の型定義

export interface FormState {
  singleMode: {
    deckCode: string;
    playerName: string;
  };
  bulkMode: {
    input: string;
  };
  isBulkMode: boolean;
}

export interface FormActions {
  updateSingleForm: (field: "deckCode" | "playerName", value: string) => void;
  updateBulkInput: (value: string) => void;
  toggleMode: () => void;
  setSingleMode: () => void;
  setBulkMode: () => void;
  resetForm: () => void;
  resetSingleForm: () => void;
  resetBulkForm: () => void;
}