import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { addCategorySchema } from './components/add-category/schema';
import { updateCategorySchema } from './components/update-category/schema';
import { deleteCategorySchema } from './components/delete-category/schema';

export const load: PageServerLoad = async () => {
  return {
    addCategoryForm: await superValidate(zod(addCategorySchema)),
    updateCategoryForm: await superValidate(zod(updateCategorySchema)),
    deleteCategoryForm: await superValidate(zod(deleteCategorySchema))
  };
};

export const actions: Actions = {
  addCategoryEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(addCategorySchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('entries_categories_tb').insert({
      name: form.data.name
    });

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Category added successfully' };
  },
  updateCategoryEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(updateCategorySchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase
      .from('entries_categories_tb')
      .update({
        name: form.data.name
      })
      .eq('id', form.data.id);

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Category updated successfully' };
  },
  removeCategoryEvent: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteCategorySchema));
    if (!form.valid) {
      return fail(400, { form });
    }

    const { error } = await supabase.from('entries_categories_tb').delete().eq('id', form.data.id);

    if (error) {
      return fail(401, { form, msg: error.message });
    }

    return { form, msg: 'Category removed successfully' };
  }
};
