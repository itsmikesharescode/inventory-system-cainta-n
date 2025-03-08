create or replace function fulltext_search(
    search_term text
) returns jsonb as $$
begin
    return (
        select 
            jsonb_agg(
                jsonb_build_object(
                    'id', i.id,
                    'created_at', i.created_at,
                    'device_id', i.device_id,
                    'model', i.model,
                    'type', i.type,
                    'status', i.status,
                    'brand', i.brand,
                    'quantity', i.quantity,
                    'description', i.description,
                    'department_id', i.department_id,
                    'category_id', i.category_id,
                    'entries_categories_tb', jsonb_build_object(
                        'id', c.id,
                        'created_at', c.created_at,
                        'name', c.name
                    ),
                    'entries_departments_tb', jsonb_build_object(
                        'id', d.id,
                        'created_at', d.created_at,
                        'name', d.name,
                        'code', d.code
                    )
                )
            )
        from items_tb i
        left join entries_categories_tb c on i.category_id = c.id
        left join entries_departments_tb d on i.department_id = d.id
        where to_tsvector('english',
            coalesce(i.device_id, '') || ' ' ||
            coalesce(i.model, '') || ' ' ||
            coalesce(i.type, '') || ' ' ||
            coalesce(i.status, '') || ' ' ||
            coalesce(i.brand, '') || ' ' ||
            coalesce(i.description, '') || ' ' ||
            coalesce(i.department_id::text, '') || ' ' ||
            coalesce(i.category_id::text, '') || ' ' ||
            coalesce(c.name, '') || ' ' ||
            coalesce(d.name, '') || ' ' ||
            coalesce(d.code, '')
        ) @@ to_tsquery('english', search_term || ':*')
    );
end;
$$ language plpgsql;

-- The index creation is moved to seed.sql which runs after tables are created
-- Commented out to avoid the error
/*
create index if not exists items_tb_fts_idx on items_tb using gin (
    to_tsvector('english',
        coalesce(device_id, '') || ' ' ||
        coalesce(model, '') || ' ' ||
        coalesce(type, '') || ' ' ||
        coalesce(status, '') || ' ' ||
        coalesce(brand, '') || ' ' ||
        coalesce(description, '') || ' ' ||
        coalesce(department_id::text, '') || ' ' ||
        coalesce(category_id::text, '')
    )
);
*/