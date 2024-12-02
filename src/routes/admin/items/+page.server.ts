import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { addItemSchema } from './components/add-item/schema';

export const load: PageServerLoad = async () => {
  return {
    addItemForm: await superValidate(zod(addItemSchema))
  };
};

export const actions: Actions = {
  addItemEvent: async ({ request, locals: { supabase } }) => {},
  updateItemEvent: async ({ request, locals: { supabase } }) => {},
  removeItemEvent: async ({ request, locals: { supabase } }) => {}
};
