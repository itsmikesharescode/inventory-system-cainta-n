import { getContext, setContext } from 'svelte';

export type BreadCrump = {
  name: string;
  url: string | null;
  childLinks:
    | [
        {
          name: string;
          url: string;
        }
      ]
    | null;
};

class BreadCrumpState {
  #breads = $state<BreadCrump[]>([]);

  setBread(breads: BreadCrump[]) {
    this.#breads = breads;
  }

  getBread() {
    return this.#breads;
  }
}

const breadKey = Symbol('breadKey');

export const initBreadCrumpState = () => {
  return setContext(breadKey, new BreadCrumpState());
};

export const useBreadCrumpRunes = () => {
  return getContext<ReturnType<typeof initBreadCrumpState>>(breadKey);
};
