<script lang="ts">
  import Table from './components/table/components/table.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { columns } from './components/table/components/columns';
  import { initTableState } from './components/table/tableState.svelte';
  import UpdateAccount from './components/update-account/update-account.svelte';
  import DeleteAccount from './components/delete-account/delete-account.svelte';
  import { fly } from 'svelte/transition';
  import { useBreadCrumpRunes } from '$lib/components/general/bread-crump/state.svelte';
  const { data } = $props();
  const breadRunes = useBreadCrumpRunes();

  breadRunes.setBread([
    {
      name: 'Dashboard',
      url: '/admin',
      childLinks: [
        {
          name: 'Accounts',
          url: '/admin/accounts'
        }
      ]
    }
  ]);
  initTableState();
</script>

<main class="container mt-10 flex flex-col gap-5" in:fly={{ x: -1000, duration: 300, delay: 100 }}>
  <span class="text-4xl font-semibold">Accounts</span>
  {#await data.getTeachers}
    <section class="flex flex-col gap-2.5">
      <div class="flex items-center justify-between gap-2.5">
        <Skeleton class="h-[40px] w-[100px] rounded-lg" />
        <div class="flex items-center gap-2.5">
          <Skeleton class="h-[40px] w-[250px] rounded-lg" />
          <Skeleton class="h-[40px] w-[100px] rounded-lg" />
        </div>
      </div>

      <Skeleton class="h-[40px] w-full rounded-lg" />
    </section>
  {:then teachers}
    <Table
      addAccountForm={data.addAccountForm}
      data={teachers?.map((teacher) => ({
        fullname: `${teacher.user_meta_data.lastname}, ${teacher.user_meta_data.firstname} ${teacher.user_meta_data.middlename}`,
        user_id: teacher.user_id,
        created_at: teacher.created_at,
        teacher_id: teacher.user_meta_data.teacher_id,
        firstname: teacher.user_meta_data.firstname,
        middlename: teacher.user_meta_data.middlename,
        lastname: teacher.user_meta_data.lastname,
        email: teacher.user_meta_data.email,
        phone: teacher.user_meta_data.phone,
        department: teacher.user_meta_data.department
      })) ?? []}
      {columns}
    />
  {/await}
</main>

<UpdateAccount updateAccountForm={data.updateAccountForm} />
<DeleteAccount deleteAccountForm={data.deleteAccountForm} />
