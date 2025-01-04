create or replace function general_update_reservation_status(
    reservation_id_client int8,
    item_id_param_client int8,
    status_client varchar,
    user_id_client uuid,
    date_client date,
    time_client time,
    reference_id_client varchar,
    room_id_client int8,
    quantity_client int8
)
returns void as $$
declare
    available_quantity numeric;
    reservation_quantity numeric;
    actual_item_id int8;
    current_status varchar;
begin
    -- Get the reservation details and verify item_id matches
    select r.quantity, r.item_id, r.status into reservation_quantity, actual_item_id, current_status
    from reservations_tb r
    where r.id = reservation_id_client;

    -- Check if reservation exists
    if not found then
        raise exception 'Reservation not found with ID: %', reservation_id_client;
        return;
    end if;

    -- Check if trying to approve an already approved reservation
    if status_client = 'approved' and current_status = 'approved' then
        raise exception 'Cannot approve: Reservation is already approved';
        return;
    end if;

    -- Verify the item_id matches
    if actual_item_id != item_id_param_client then
        raise exception 'Item ID mismatch. Expected: %, Got: %', 
            actual_item_id, item_id_param_client;
        return;
    end if;

    -- Only proceed with quantity checks if status is being updated to 'approve'
    if status_client = 'approved' then
        -- Get the available quantity from items_tb
        select quantity into available_quantity
        from items_tb
        where id = item_id_param_client;

        -- Check if item exists
        if not found then
            raise exception 'Item not found with ID: %', item_id_param_client;
            return;
        end if;

        -- Check if we have enough quantity
        if available_quantity < reservation_quantity then
            raise exception 'Insufficient quantity. Available: %, Requested: %', 
                available_quantity, reservation_quantity;
            return;
        end if;

        -- Update the items_tb quantity
        update items_tb
        set quantity = quantity - reservation_quantity
        where id = item_id_param_client;
    end if;

    
    update reservations_tb
    set status = $3  
    where id = reservation_id_client;

    insert into borrowed_items_tb (user_id, item_id, date, time, reference_id, room_id, quantity)
    values (user_id_client, item_id_param_client, date_client, time_client, reference_id_client, room_id_client, quantity_client);

    insert into borrowed_logs_tb (user_id, item_id, direction)
    values(user_id_client, item_id_param_client, 'reservation-to-borrow');
end;
$$ language plpgsql;
