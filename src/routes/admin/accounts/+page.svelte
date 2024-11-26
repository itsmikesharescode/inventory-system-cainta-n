<script lang="ts">
  import GradualSpacing from '$lib/components/gen/GradualSpacing.svelte';
  import * as Table from '$lib/components/ui/table';
  import AddTeacherModal from './_components/AddTeacher/AddTeacherModal.svelte';
  import TeacherMenu from './_components/TeacherMenu.svelte';

  const { data } = $props();
</script>

<div class="flex flex-col gap-5">
  <div class="flex items-center justify-between">
    <GradualSpacing
      class="font-display text-left text-4xl font-bold tracking-[-0.1em]  text-black   md:leading-[5rem]"
      words="Accounts"
    />

    <AddTeacherModal addTeacherForm={data.addTeacherForm} />
  </div>

  <Table.Root>
    {#if !data.adminLayout.data?.teachers.length}
      <Table.Caption>No data available in the table</Table.Caption>
    {/if}
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]"></Table.Head>
        <Table.Head>Teacher ID</Table.Head>
        <Table.Head>Full name</Table.Head>
        <Table.Head>Department</Table.Head>
        <Table.Head>Email</Table.Head>
        <Table.Head>Phone</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each data.adminLayout.data?.teachers ?? [] as teacher}
        <Table.Row>
          <Table.Cell>
            <TeacherMenu {teacher} updateTeacherForm={data.updateTeacherForm} />
          </Table.Cell>
          <Table.Cell>{teacher.user_meta_data.teacher_real_id}</Table.Cell>
          <Table.Cell
            >{teacher.user_meta_data.lastname}, {teacher.user_meta_data.firstname}
            {teacher.user_meta_data.middlename}</Table.Cell
          >
          <Table.Cell>{teacher.user_meta_data.department}</Table.Cell>
          <Table.Cell>{teacher.user_meta_data.email}</Table.Cell>
          <Table.Cell>{teacher.user_meta_data.phonenumber}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
