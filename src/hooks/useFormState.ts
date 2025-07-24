import { useState } from "react";

interface FormState {
  singleMode: {
    deckCode: string;
    playerName: string;
  };
  bulkMode: {
    input: string;
  };
  isBulkMode: boolean;
}

interface FormActions {
  updateSingleForm: (field: "deckCode" | "playerName", value: string) => void;
  updateBulkInput: (value: string) => void;
  toggleMode: () => void;
  setSingleMode: () => void;
  setBulkMode: () => void;
  resetForm: () => void;
  resetSingleForm: () => void;
  resetBulkForm: () => void;
}

const initialFormState: FormState = {
  singleMode: {
    deckCode: "",
    playerName: "",
  },
  bulkMode: {
    input: "",
  },
  isBulkMode: false,
};

export const useFormState = (): [FormState, FormActions] => {
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const updateSingleForm = (
    field: "deckCode" | "playerName",
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      singleMode: {
        ...prev.singleMode,
        [field]: value,
      },
    }));
  };

  const updateBulkInput = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      bulkMode: {
        input: value,
      },
    }));
  };

  const toggleMode = () => {
    setFormState((prev) => ({
      ...prev,
      isBulkMode: !prev.isBulkMode,
    }));
  };

  const setSingleMode = () => {
    setFormState((prev) => ({
      ...prev,
      isBulkMode: false,
    }));
  };

  const setBulkMode = () => {
    setFormState((prev) => ({
      ...prev,
      isBulkMode: true,
    }));
  };

  const resetSingleForm = () => {
    setFormState((prev) => ({
      ...prev,
      singleMode: {
        deckCode: "",
        playerName: "",
      },
    }));
  };

  const resetBulkForm = () => {
    setFormState((prev) => ({
      ...prev,
      bulkMode: {
        input: "",
      },
    }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const actions: FormActions = {
    updateSingleForm,
    updateBulkInput,
    toggleMode,
    setSingleMode,
    setBulkMode,
    resetForm,
    resetSingleForm,
    resetBulkForm,
  };

  return [formState, actions];
};

export type { FormState, FormActions };
