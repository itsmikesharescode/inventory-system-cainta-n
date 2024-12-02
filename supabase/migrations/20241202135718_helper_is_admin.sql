create or replace function is_admin() returns boolean as $$
begin 
    return exists(select 1 from roles_tb where role = 'admin' and user_id = auth.uid());
end;
$$ language plpgsql security definer;