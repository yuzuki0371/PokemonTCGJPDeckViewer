export interface FilterState {
  filterText: string;
  exactMatch: boolean;
}

export interface FilterActions {
  setFilterText: (text: string) => void;
  setExactMatch: (value: boolean) => void;
  clearFilter: () => void;
  toggleExactMatch: () => void;
}
