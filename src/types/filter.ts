export interface FilterState {
  filterText: string;
  exactMatch: boolean;
}

export interface FilterActions {
  setFilterText: (text: string) => void;
  clearFilter: () => void;
  toggleExactMatch: () => void;
}
