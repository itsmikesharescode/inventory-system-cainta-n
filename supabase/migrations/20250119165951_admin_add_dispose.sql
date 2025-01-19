create or replace function dispose_returnee(
    id_input bigint,
    user_id_input uuid,
    item_id_input bigint,
    room_id_input bigint,
    reference_id_input text,
    quantity_input bigint,
    remarks_input text,
    borrowed_date_input text
) returns void as $$
begin
    -- Check if the item quantity is already 0
    if (select quantity from items_tb where id = item_id_input) <= 0 then
        raise exception 'Item quantity is already 0, cannot dispose.';
    end if;

    -- Reduce the quantity in items_tb
    update items_tb set quantity = quantity - quantity_input where id = item_id_input;

    -- Delete the row in transaction_returned_items_tb using id
    delete from transaction_returned_items_tb where id = id_input;

    -- Insert a new row in transaction_dispose_tb using the given parameters
    insert into transaction_dispose_tb (user_id, item_id, room_id, reference_id, quantity, remarks, borrowed_date)
    values (user_id_input, item_id_input, room_id_input, reference_id_input, quantity_input, remarks_input, borrowed_date_input);
end;
$$ language plpgsql;