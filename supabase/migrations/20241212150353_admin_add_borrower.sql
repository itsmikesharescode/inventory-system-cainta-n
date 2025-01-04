create or replace function admin_add_borrower(
    user_id_param uuid,
    item_id_param int8,
    date_param date,
    time_param time,
    reference_id_param varchar,
    room_id_param int8,
    quantity_param int8
) returns void as $$
declare
    available_quantity numeric;
begin
    -- Get the available quantity from items_tb
    select quantity into available_quantity
    from items_tb
    where id = item_id_param;

    -- Check if item exists
    if not found then
        raise exception 'Item not found with ID: %', item_id_param;
        return;
    end if;

    -- Check if we have enough quantity based on quantity_param
    if available_quantity < quantity_param then
        raise exception 'Insufficient quantity. Available: %, Requested: %', available_quantity, quantity_param;
        return;
    end if;

    -- Update the items_tb quantity using quantity_param
    update items_tb
    set quantity = quantity - quantity_param
    where id = item_id_param;

    -- Insert the new borrowed item record
    insert into borrowed_items_tb (
        user_id,
        item_id,
        date,
        time,
        reference_id,
        room_id,
        quantity
    ) values (
        user_id_param,
        item_id_param,
        date_param,
        time_param,
        reference_id_param,
        room_id_param,
        quantity_param
    );

    insert into borrowed_logs_tb (user_id, item_id, direction)
    values(user_id_param, item_id_param, 'borrowed');

end;
$$ language  plpgsql security definer;