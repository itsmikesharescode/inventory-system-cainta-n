import { getContext, setContext } from 'svelte';
import type { ReturneePageTable } from './data/schemas';

class TableState {
  #activeRow = $state<ReturneePageTable | null>(null);

  setActiveRow(row: ReturneePageTable | null) {
    this.#activeRow = row;
  }

  getActiveRow() {
    return this.#activeRow;
  }

  #showDispose = $state(false);

  setShowDispose(show: boolean) {
    this.#showDispose = show;
  }

  getShowDispose() {
    return this.#showDispose;
  }

  #showDelete = $state(false);

  setShowDelete(show: boolean) {
    this.#showDelete = show;
  }

  getShowDelete() {
    return this.#showDelete;
  }
}

const TableKey = Symbol('ItemsTableState');

export const initTableState = () => {
  return setContext(TableKey, new TableState());
};

export const useTableState = () => {
  return getContext<ReturnType<typeof initTableState>>(TableKey);
};
