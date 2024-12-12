create or replace function admin_add_returnee(
  user_id_param uuid,
  item_id_param bigint,
  item_name_param text,
  quantity_param bigint,
  reference_id_param text,
  room_name_param text,
  remarks_param text,
  borrowed_date_param text
) returns void as $$
declare
    borrowed_item_id int8;
begin
    -- Get the borrowed_item_id first
    select id into borrowed_item_id
    from borrowed_items_tb
    where reference_id = reference_id_param;

    -- Check if borrowed item exists
    if not found then
        raise exception 'Borrowed item not found with reference ID: %', reference_id_param;
        return;
    end if;

    -- Update the items_tb quantity by adding back the returned quantity
    update items_tb
    set quantity = quantity + quantity_param
    where id = item_id_param;

    -- Insert into returned_items_tb
    insert into returned_items_tb (
        user_id, item_name, quantity, reference_id, room_name, remarks, borrowed_date
    ) values (
        user_id_param, item_name_param, quantity_param, reference_id_param, room_name_param, remarks_param, borrowed_date_param
    );

    -- Delete from borrowed_items_tb
    delete from borrowed_items_tb
    where id = borrowed_item_id;

end;
$$ language plpgsql;
