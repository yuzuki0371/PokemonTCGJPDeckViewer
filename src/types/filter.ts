export interface FilterState {
  filterText: string;
}

export interface FilterActions {
  setFilterText: (text: string) => void;
  clearFilter: () => void;
}
