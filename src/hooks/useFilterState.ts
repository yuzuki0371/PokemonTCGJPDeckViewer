import { useState, useCallback } from "react";
import type { FilterState, FilterActions } from "../types";

export const useFilterState = (): [FilterState, FilterActions] => {
  const [filterText, setFilterTextState] = useState("");
  const [exactMatch, setExactMatch] = useState(false);

  const setFilterText = useCallback((text: string) => {
    setFilterTextState(text);
  }, []);

  const clearFilter = useCallback(() => {
    setFilterTextState("");
  }, []);

  const toggleExactMatch = useCallback(() => {
    setExactMatch(prev => !prev);
  }, []);

  const state: FilterState = { filterText, exactMatch };
  const actions: FilterActions = { setFilterText, clearFilter, toggleExactMatch };

  return [state, actions];
};
