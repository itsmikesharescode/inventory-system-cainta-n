create or replace function admin_dashboard_counters() returns jsonb as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'pendings', (select count(*) from reservations_tb where status = 'pending'),
    'approved', (select count(*) from reservations_tb where status = 'approved'),
    'rejected', (select count(*) from reservations_tb where status = 'rejected'),
    'accounts', (select count(*) from teachers_tb)
  ) into result;
  
  return result;
end;
$$ language plpgsql;


