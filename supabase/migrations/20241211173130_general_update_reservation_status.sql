create or replace function general_update_reservation_status(
    reservation_id int8,
    item_id_param int8,
    status varchar
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
    where r.id = reservation_id;

    -- Check if reservation exists
    if not found then
        raise exception 'Reservation not found with ID: %', reservation_id;
        return;
    end if;

    -- Check if trying to approve an already approved reservation
    if status = 'approved' and current_status = 'approved' then
        raise exception 'Cannot approve: Reservation is already approved';
        return;
    end if;

    -- Verify the item_id matches
    if actual_item_id != item_id_param then
        raise exception 'Item ID mismatch. Expected: %, Got: %', 
            actual_item_id, item_id_param;
        return;
    end if;

    -- Only proceed with quantity checks if status is being updated to 'approve'
    if status = 'approved' then
        -- Get the available quantity from items_tb
        select quantity into available_quantity
        from items_tb
        where id = item_id_param;

        -- Check if item exists
        if not found then
            raise exception 'Item not found with ID: %', item_id_param;
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
        where id = item_id_param;
    end if;

    -- Update the reservation status (now works for all status values)
    update reservations_tb
    set status = $3  -- Using the parameter position instead of name
    where id = reservation_id;

end;
$$ language plpgsql;