create or replace function is_teacher() returns boolean as $$
begin
    return exists(select 1 from roles_tb where role = 'teacher' and user_id = auth.uid());
end;
$$ language plpgsql;