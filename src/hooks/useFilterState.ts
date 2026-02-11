import { useState, useCallback } from 'react'
import type { FilterState, FilterActions } from '../types'

export const useFilterState = (): [FilterState, FilterActions] => {
  const [filterText, setFilterTextState] = useState('')

  const setFilterText = useCallback((text: string) => {
    setFilterTextState(text)
  }, [])

  const clearFilter = useCallback(() => {
    setFilterTextState('')
  }, [])

  const state: FilterState = { filterText }
  const actions: FilterActions = { setFilterText, clearFilter }

  return [state, actions]
}
