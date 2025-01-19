create or replace function fulltext_search(
    search_term text
) returns setof items_tb as $$
begin
    -- Convert search term to lexemes and make it more flexible with :*
    -- This allows partial matches and different word forms
    return query
    select *
    from items_tb
    where to_tsvector('english',
        coalesce(device_id, '') || ' ' ||
        coalesce(model, '') || ' ' ||
        coalesce(type, '') || ' ' ||
        coalesce(status, '') || ' ' ||
        coalesce(brand, '') || ' ' ||
        coalesce(description, '') || ' ' ||
        coalesce(department_id::text, '') || ' ' ||
        coalesce(category_id::text, '')
    ) @@ to_tsquery('english', search_term || ':*');
end;
$$ language plpgsql;

-- Update the index to include all searchable columns
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