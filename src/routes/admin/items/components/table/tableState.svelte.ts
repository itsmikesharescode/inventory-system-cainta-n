import { getContext, setContext } from 'svelte';
import type { AccountPageTable } from './data/schemas';

class TableState {
  #activeRow = $state<AccountPageTable | null>(null);

  setActiveRow(row: AccountPageTable | null) {
    this.#activeRow = row;
  }

  getActiveRow() {
    return this.#activeRow;
  }

  #showUpdateStatus = $state(false);

  setShowUpdateStatus(show: boolean) {
    this.#showUpdateStatus = show;
  }

  getShowUpdateStatus() {
    return this.#showUpdateStatus;
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

const TableKey = Symbol('TableState');

export const initTableState = () => {
  return setContext(TableKey, new TableState());
};

export const useTableState = () => {
  return getContext<ReturnType<typeof initTableState>>(TableKey);
};
