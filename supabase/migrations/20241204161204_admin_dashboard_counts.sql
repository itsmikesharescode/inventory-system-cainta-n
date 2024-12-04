create or replace function admin_dashboard_counts() returns jsonb as $$
declare
    result jsonb;
begin
    select jsonb_build_object(
        'pendings', (
            select jsonb_agg(
                jsonb_build_object(
                    'date', to_char(day_date, 'YYYY-MM-DD'),
                    'count', COALESCE(pending_count, 0)
                )
            )
            from (
                select 
                    date_trunc('day', created_at) as day_date,
                    count(*) filter (where status = 'pending') as pending_count
                from reservations_tb
                group by date_trunc('day', created_at)
                order by day_date desc
            ) pending_counts
        ),
        'approved', (
            select jsonb_agg(
                jsonb_build_object(
                    'date', to_char(day_date, 'YYYY-MM-DD'),
                    'count', COALESCE(approved_count, 0)
                )
            )
            from (
                select 
                    date_trunc('day', created_at) as day_date,
                    count(*) filter (where status = 'approved') as approved_count
                from reservations_tb
                group by date_trunc('day', created_at)
                order by day_date desc
            ) approved_counts
        ),
        'rejected', (
            select jsonb_agg(
                jsonb_build_object(
                    'date', to_char(day_date, 'YYYY-MM-DD'),
                    'count', COALESCE(rejected_count, 0)
                )
            )
            from (
                select 
                    date_trunc('day', created_at) as day_date,
                    count(*) filter (where status = 'rejected') as rejected_count
                from reservations_tb
                group by date_trunc('day', created_at)
                order by day_date desc
            ) rejected_counts
        ),
        'reservations', (
            select jsonb_agg(
                jsonb_build_object(
                    'date', to_char(day_date, 'YYYY-MM-DD'),
                    'count', COALESCE(total_count, 0)
                )
            )
            from (
                select 
                    date_trunc('day', created_at) as day_date,
                    count(*) as total_count
                from reservations_tb
                group by date_trunc('day', created_at)
                order by day_date desc
            ) total_counts
        )
    ) into result;

    return result;
end;
$$ language plpgsql;

