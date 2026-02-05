import { useState } from "react";
import type { FormState, FormActions } from "../types";

const initialFormState: FormState = {
  singleMode: {
    deckCode: "",
    playerName: "",
    deckName: "",
  },
  bulkMode: {
    input: "",
  },
  isBulkMode: false,
};

export const useFormState = (): [FormState, FormActions] => {
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const updateSingleForm = (
    field: "deckCode" | "playerName" | "deckName",
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
        deckName: "",
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

