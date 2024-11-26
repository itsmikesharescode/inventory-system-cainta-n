<script lang="ts">
  const { data } = $props();

  const teacherRef = $derived(data.specificTeacher.data?.user_meta_data);
</script>

{#if teacherRef}
  <div class="flex max-w-lg flex-col gap-2.5 p-5 pt-0">
    <p class="text-lg font-semibold">View Teacher</p>
    <div class="">
      <p class="">Teacher ID</p>
      <p class="text-muted-foreground">{teacherRef.teacher_real_id}</p>
    </div>

    <div class="">
      <p class="">Full name</p>
      <p class="text-muted-foreground">
        {teacherRef.lastname}, {teacherRef.firstname}
        {teacherRef.middlename}
      </p>
    </div>

    <div class="">
      <p class="">Department</p>
      <p class="text-muted-foreground">{teacherRef.department}</p>
    </div>

    <div class="">
      <p class="">Email</p>
      <p class="text-muted-foreground">{teacherRef.email}</p>
    </div>

    <div class="">
      <p class="">Phone</p>
      <p class="text-muted-foreground">{teacherRef.phonenumber}</p>
    </div>
  </div>
{/if}
