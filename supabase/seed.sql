

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."admin_add_borrower"("user_id_param" "uuid", "item_id_param" bigint, "date_param" "date", "time_param" time without time zone, "reference_id_param" character varying, "room_id_param" bigint, "quantity_param" bigint) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."admin_add_borrower"("user_id_param" "uuid", "item_id_param" bigint, "date_param" "date", "time_param" time without time zone, "reference_id_param" character varying, "room_id_param" bigint, "quantity_param" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_add_returnee"("user_id_param" "uuid", "item_id_param" bigint, "item_name_param" "text", "quantity_param" bigint, "reference_id_param" "text", "room_name_param" "text", "remarks_param" "text", "borrowed_date_param" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
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

    insert into borrowed_logs_tb (user_id, item_id, direction)
    values(user_id_param, item_id_param, 'returned');

end;
$$;


ALTER FUNCTION "public"."admin_add_returnee"("user_id_param" "uuid", "item_id_param" bigint, "item_name_param" "text", "quantity_param" bigint, "reference_id_param" "text", "room_name_param" "text", "remarks_param" "text", "borrowed_date_param" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_dashboard_counters"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'pendings', (select count(*) from reservations_tb where status = 'pending'),
    'approved', (select count(*) from reservations_tb where status = 'approved'),
    'rejected', (select count(*) from reservations_tb where status = 'rejected'),
    'accounts', (select count(*) from teachers_tb)
  ) into result;
  
  return result;
end;
$$;


ALTER FUNCTION "public"."admin_dashboard_counters"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_dashboard_counts"() RETURNS "jsonb"
    LANGUAGE "plpgsql"
    AS $$
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
$$;


ALTER FUNCTION "public"."admin_dashboard_counts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."general_update_reservation_status"("reservation_id_client" bigint, "item_id_param_client" bigint, "status_client" character varying, "user_id_client" "uuid", "date_client" "date", "time_client" time without time zone, "reference_id_client" character varying, "room_id_client" bigint, "quantity_client" bigint) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $_$
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
$_$;


ALTER FUNCTION "public"."general_update_reservation_status"("reservation_id_client" bigint, "item_id_param_client" bigint, "status_client" character varying, "user_id_client" "uuid", "date_client" "date", "time_client" time without time zone, "reference_id_client" character varying, "room_id_client" bigint, "quantity_client" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
    return exists(
        select 1 from roles_tb where user_id = auth.uid() and role = 'admin'
    )
    return;
end;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_teacher"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin 
    return exists(
        select 1 from roles_tb where user_id = auth.uid() and role = 'teacher'
    )
    return;
end;
$$;


ALTER FUNCTION "public"."is_teacher"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_auth_user_created"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  role text;
begin
  role = new.raw_user_meta_data ->> 'role'; 

  insert into public.users_tb (user_id, user_meta_data) values(new.id, new.raw_user_meta_data);
  
  insert into public.roles_tb (user_id, role) values(new.id, role);

  insert into public.teachers_tb (user_id, user_meta_data)
  values (
    new.id,
    new.raw_user_meta_data
  );
  return new;

end;
$$;


ALTER FUNCTION "public"."on_auth_user_created"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."on_auth_user_updated"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin

  update public.users_tb
  set user_meta_data = new.raw_user_meta_data
  where user_id = new.id;

  update public.teachers_tb
  set user_meta_data = new.raw_user_meta_data
  where user_id = new.id;

  update public.roles_tb
  set role = new.raw_user_meta_data ->> 'role'
  where user_id = new.id;
  return new;

end;
$$;


ALTER FUNCTION "public"."on_auth_user_updated"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."borrowed_items_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "item_id" bigint NOT NULL,
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "reference_id" character varying NOT NULL,
    "room_id" bigint NOT NULL,
    "quantity" numeric NOT NULL
);


ALTER TABLE "public"."borrowed_items_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."borrowed_items_tb" IS 'list of borrowed items';



ALTER TABLE "public"."borrowed_items_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."borrowed_items_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."borrowed_logs_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "direction" character varying NOT NULL,
    "item_id" bigint NOT NULL
);


ALTER TABLE "public"."borrowed_logs_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."borrowed_logs_tb" IS 'tracking of borrowed items';



CREATE TABLE IF NOT EXISTS "public"."departments_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "code" "text" NOT NULL
);


ALTER TABLE "public"."departments_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."departments_tb" IS 'list of departments';



ALTER TABLE "public"."departments_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."departments_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."items_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "device_id" "text" NOT NULL,
    "model" "text" NOT NULL,
    "category" "text" NOT NULL,
    "type" "text" NOT NULL,
    "status" "text" NOT NULL,
    "mr" "text" NOT NULL,
    "brand" "text" NOT NULL,
    "quantity" numeric NOT NULL,
    "description" "text" NOT NULL,
    "department" character varying NOT NULL
);


ALTER TABLE "public"."items_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."items_tb" IS 'list of items';



ALTER TABLE "public"."items_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."items_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."login_logs_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "direction" character varying NOT NULL
);


ALTER TABLE "public"."login_logs_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."login_logs_tb" IS 'logs of users login';



ALTER TABLE "public"."login_logs_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."login_logs_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."borrowed_logs_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."ranking_borrowed_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."reservations_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "item_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" character varying DEFAULT 'pending'::character varying NOT NULL,
    "quantity" numeric NOT NULL,
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "reference_id" character varying NOT NULL,
    "room_id" bigint NOT NULL
);


ALTER TABLE "public"."reservations_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."reservations_tb" IS 'list of reservations';



ALTER TABLE "public"."reservations_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."reservations_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."returned_items_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "item_name" "text" NOT NULL,
    "quantity" numeric NOT NULL,
    "reference_id" character varying NOT NULL,
    "room_name" "text" NOT NULL,
    "remarks" "text" NOT NULL,
    "borrowed_date" "text" NOT NULL
);


ALTER TABLE "public"."returned_items_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."returned_items_tb" IS 'list of returned items';



ALTER TABLE "public"."returned_items_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."returned_items_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."roles_tb" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role" character varying NOT NULL
);


ALTER TABLE "public"."roles_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."roles_tb" IS 'list of roles';



CREATE TABLE IF NOT EXISTS "public"."rooms_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "number" numeric NOT NULL
);


ALTER TABLE "public"."rooms_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."rooms_tb" IS 'list of room';



ALTER TABLE "public"."rooms_tb" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."rooms_tb_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."teachers_tb" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_meta_data" "jsonb" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."teachers_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."teachers_tb" IS 'list of teachers';



CREATE TABLE IF NOT EXISTS "public"."users_tb" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_meta_data" "jsonb" NOT NULL
);


ALTER TABLE "public"."users_tb" OWNER TO "postgres";


COMMENT ON TABLE "public"."users_tb" IS 'public copy of all users';



ALTER TABLE ONLY "public"."borrowed_items_tb"
    ADD CONSTRAINT "borrowed_items_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."departments_tb"
    ADD CONSTRAINT "departments_tb_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."departments_tb"
    ADD CONSTRAINT "departments_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."items_tb"
    ADD CONSTRAINT "items_tb_device_id_key" UNIQUE ("device_id");



ALTER TABLE ONLY "public"."items_tb"
    ADD CONSTRAINT "items_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."login_logs_tb"
    ADD CONSTRAINT "login_logs_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."borrowed_logs_tb"
    ADD CONSTRAINT "ranking_borrowed_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reservations_tb"
    ADD CONSTRAINT "reservations_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."returned_items_tb"
    ADD CONSTRAINT "returned_items_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles_tb"
    ADD CONSTRAINT "roles_tb_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."rooms_tb"
    ADD CONSTRAINT "rooms_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teachers_tb"
    ADD CONSTRAINT "teachers_tb_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."borrowed_items_tb"
    ADD CONSTRAINT "borrowed_items_tb_items_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."borrowed_items_tb"
    ADD CONSTRAINT "borrowed_items_tb_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."borrowed_items_tb"
    ADD CONSTRAINT "borrowed_items_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."teachers_tb"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."borrowed_logs_tb"
    ADD CONSTRAINT "borrowed_logs_tb_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reservations_tb"
    ADD CONSTRAINT "reservations_tb_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reservations_tb"
    ADD CONSTRAINT "reservations_tb_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reservations_tb"
    ADD CONSTRAINT "reservations_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."teachers_tb"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."returned_items_tb"
    ADD CONSTRAINT "returned_items_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."teachers_tb"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."roles_tb"
    ADD CONSTRAINT "roles_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teachers_tb"
    ADD CONSTRAINT "teachers_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_tb"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow all for admin" ON "public"."items_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."borrowed_items_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."borrowed_logs_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."departments_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."reservations_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."returned_items_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."rooms_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow delete if teacher and exist" ON "public"."reservations_tb" FOR DELETE TO "authenticated" USING (("public"."is_teacher"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow insert if authenticated" ON "public"."login_logs_tb" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow insert if teacher" ON "public"."borrowed_items_tb" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_teacher"());



CREATE POLICY "Allow select for all" ON "public"."departments_tb" FOR SELECT USING (true);



CREATE POLICY "Allow select for all" ON "public"."rooms_tb" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow select if teacher" ON "public"."items_tb" FOR SELECT TO "authenticated" USING ("public"."is_teacher"());



CREATE POLICY "Allow select if teacher and exist" ON "public"."borrowed_items_tb" FOR SELECT TO "authenticated" USING (("public"."is_teacher"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow select if teacher and exist" ON "public"."reservations_tb" FOR SELECT TO "authenticated" USING (("public"."is_teacher"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow update if teacher and exist" ON "public"."reservations_tb" FOR UPDATE TO "authenticated" USING (("public"."is_teacher"() AND ("auth"."uid"() = "user_id"))) WITH CHECK (("public"."is_teacher"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "allow all if admin" ON "public"."login_logs_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "allow all if admin" ON "public"."teachers_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "allow insert if teacher" ON "public"."reservations_tb" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_teacher"());



ALTER TABLE "public"."borrowed_items_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."borrowed_logs_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."departments_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."items_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."login_logs_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reservations_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."returned_items_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rooms_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."teachers_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users_tb" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."admin_add_borrower"("user_id_param" "uuid", "item_id_param" bigint, "date_param" "date", "time_param" time without time zone, "reference_id_param" character varying, "room_id_param" bigint, "quantity_param" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."admin_add_borrower"("user_id_param" "uuid", "item_id_param" bigint, "date_param" "date", "time_param" time without time zone, "reference_id_param" character varying, "room_id_param" bigint, "quantity_param" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_add_borrower"("user_id_param" "uuid", "item_id_param" bigint, "date_param" "date", "time_param" time without time zone, "reference_id_param" character varying, "room_id_param" bigint, "quantity_param" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_add_returnee"("user_id_param" "uuid", "item_id_param" bigint, "item_name_param" "text", "quantity_param" bigint, "reference_id_param" "text", "room_name_param" "text", "remarks_param" "text", "borrowed_date_param" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."admin_add_returnee"("user_id_param" "uuid", "item_id_param" bigint, "item_name_param" "text", "quantity_param" bigint, "reference_id_param" "text", "room_name_param" "text", "remarks_param" "text", "borrowed_date_param" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_add_returnee"("user_id_param" "uuid", "item_id_param" bigint, "item_name_param" "text", "quantity_param" bigint, "reference_id_param" "text", "room_name_param" "text", "remarks_param" "text", "borrowed_date_param" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_dashboard_counters"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_dashboard_counters"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_dashboard_counters"() TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_dashboard_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_dashboard_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_dashboard_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."general_update_reservation_status"("reservation_id_client" bigint, "item_id_param_client" bigint, "status_client" character varying, "user_id_client" "uuid", "date_client" "date", "time_client" time without time zone, "reference_id_client" character varying, "room_id_client" bigint, "quantity_client" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."general_update_reservation_status"("reservation_id_client" bigint, "item_id_param_client" bigint, "status_client" character varying, "user_id_client" "uuid", "date_client" "date", "time_client" time without time zone, "reference_id_client" character varying, "room_id_client" bigint, "quantity_client" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."general_update_reservation_status"("reservation_id_client" bigint, "item_id_param_client" bigint, "status_client" character varying, "user_id_client" "uuid", "date_client" "date", "time_client" time without time zone, "reference_id_client" character varying, "room_id_client" bigint, "quantity_client" bigint) TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_teacher"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_teacher"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_teacher"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_auth_user_created"() TO "service_role";



GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "anon";
GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."on_auth_user_updated"() TO "service_role";


















GRANT ALL ON TABLE "public"."borrowed_items_tb" TO "anon";
GRANT ALL ON TABLE "public"."borrowed_items_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."borrowed_items_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."borrowed_items_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."borrowed_items_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."borrowed_items_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."borrowed_logs_tb" TO "anon";
GRANT ALL ON TABLE "public"."borrowed_logs_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."borrowed_logs_tb" TO "service_role";



GRANT ALL ON TABLE "public"."departments_tb" TO "anon";
GRANT ALL ON TABLE "public"."departments_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."departments_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."departments_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."departments_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."departments_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."items_tb" TO "anon";
GRANT ALL ON TABLE "public"."items_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."items_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."items_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."items_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."items_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."login_logs_tb" TO "anon";
GRANT ALL ON TABLE "public"."login_logs_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."login_logs_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."login_logs_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."login_logs_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."login_logs_tb_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ranking_borrowed_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ranking_borrowed_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ranking_borrowed_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."reservations_tb" TO "anon";
GRANT ALL ON TABLE "public"."reservations_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."reservations_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."reservations_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reservations_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reservations_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."returned_items_tb" TO "anon";
GRANT ALL ON TABLE "public"."returned_items_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."returned_items_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."returned_items_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."returned_items_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."returned_items_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."roles_tb" TO "anon";
GRANT ALL ON TABLE "public"."roles_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."roles_tb" TO "service_role";



GRANT ALL ON TABLE "public"."rooms_tb" TO "anon";
GRANT ALL ON TABLE "public"."rooms_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."rooms_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."rooms_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."rooms_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."rooms_tb_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."teachers_tb" TO "anon";
GRANT ALL ON TABLE "public"."teachers_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."teachers_tb" TO "service_role";



GRANT ALL ON TABLE "public"."users_tb" TO "anon";
GRANT ALL ON TABLE "public"."users_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."users_tb" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
