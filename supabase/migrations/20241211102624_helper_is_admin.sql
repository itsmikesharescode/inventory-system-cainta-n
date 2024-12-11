create or replace function is_admin() returns boolean as $$
begin
    return exists(
        select 1 from roles_tb where user_id = auth.uid() and role = 'admin'
    )
    return;
end;
$$ language plpgsql security definer;