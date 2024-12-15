import { getContext, setContext } from 'svelte';
import type { BorrowedItemsPageTable } from './data/schemas';

class TableState {
  #activeRow = $state<BorrowedItemsPageTable | null>(null);

  setActiveRow(row: BorrowedItemsPageTable | null) {
    this.#activeRow = row;
  }

  getActiveRow() {
    return this.#activeRow;
  }

  #showMoveToReturnee = $state(false);

  setShowMoveToReturnee(show: boolean) {
    this.#showMoveToReturnee = show;
  }

  getShowMoveToReturnee() {
    return this.#showMoveToReturnee;
  }

  #showUpdate = $state(false);

  setShowUpdate(show: boolean) {
    this.#showUpdate = show;
  }

  getShowUpdate() {
    return this.#showUpdate;
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
