

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


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin 
    return exists(select 1 from roles_tb where role = 'admin' and user_id = auth.uid());
end;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_teacher"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
    return exists(select 1 from roles_tb where role = 'teacher' and user_id = auth.uid());
end;
$$;


ALTER FUNCTION "public"."is_teacher"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."borrowed_items_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "item_id" bigint NOT NULL,
    "room" character varying NOT NULL,
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "reference_id" character varying NOT NULL
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
    "price" numeric NOT NULL,
    "description" "text" NOT NULL
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



CREATE TABLE IF NOT EXISTS "public"."reservations_tb" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "item_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "room" "text" NOT NULL,
    "status" character varying DEFAULT 'pending'::character varying NOT NULL,
    "quantity" numeric NOT NULL,
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "reference_id" character varying NOT NULL
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
    "returned_date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "borrowed_item_id" bigint NOT NULL
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
    "code" "text" NOT NULL
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
    ADD CONSTRAINT "departments_tb_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."items_tb"
    ADD CONSTRAINT "items_tb_device_id_key" UNIQUE ("device_id");



ALTER TABLE ONLY "public"."items_tb"
    ADD CONSTRAINT "items_tb_pkey" PRIMARY KEY ("id");



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
    ADD CONSTRAINT "borrowed_items_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."teachers_tb"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reservations_tb"
    ADD CONSTRAINT "reservations_tb_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."items_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reservations_tb"
    ADD CONSTRAINT "reservations_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."teachers_tb"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."returned_items_tb"
    ADD CONSTRAINT "returned_items_tb_borrowed_item_id_fkey" FOREIGN KEY ("borrowed_item_id") REFERENCES "public"."borrowed_items_tb"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."roles_tb"
    ADD CONSTRAINT "roles_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."teachers_tb"
    ADD CONSTRAINT "teachers_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users_tb"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users_tb"
    ADD CONSTRAINT "users_tb_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Allow all for admin" ON "public"."items_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all for admin" ON "public"."returned_items_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."borrowed_items_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."departments_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."reservations_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow all if admin" ON "public"."rooms_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Allow delete if teacher and exist" ON "public"."reservations_tb" FOR DELETE TO "authenticated" USING (("public"."is_teacher"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow select for all" ON "public"."departments_tb" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow select for all" ON "public"."rooms_tb" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow select if teacher" ON "public"."items_tb" FOR SELECT TO "authenticated" USING ("public"."is_teacher"());



CREATE POLICY "Allow select if teacher and exist" ON "public"."reservations_tb" FOR SELECT TO "authenticated" USING (("public"."is_teacher"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "Allow update if teacher and exist" ON "public"."reservations_tb" FOR UPDATE TO "authenticated" USING (("public"."is_teacher"() AND ("auth"."uid"() = "user_id"))) WITH CHECK (("public"."is_teacher"() AND ("auth"."uid"() = "user_id")));



CREATE POLICY "allow all if admin" ON "public"."teachers_tb" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "allow insert if teacher" ON "public"."reservations_tb" FOR INSERT TO "authenticated" WITH CHECK ("public"."is_teacher"());



ALTER TABLE "public"."borrowed_items_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."departments_tb" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."items_tb" ENABLE ROW LEVEL SECURITY;


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


























































































































































































GRANT ALL ON FUNCTION "public"."admin_dashboard_counters"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_dashboard_counters"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_dashboard_counters"() TO "service_role";



GRANT ALL ON FUNCTION "public"."admin_dashboard_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."admin_dashboard_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_dashboard_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_teacher"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_teacher"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_teacher"() TO "service_role";


















GRANT ALL ON TABLE "public"."borrowed_items_tb" TO "anon";
GRANT ALL ON TABLE "public"."borrowed_items_tb" TO "authenticated";
GRANT ALL ON TABLE "public"."borrowed_items_tb" TO "service_role";



GRANT ALL ON SEQUENCE "public"."borrowed_items_tb_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."borrowed_items_tb_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."borrowed_items_tb_id_seq" TO "service_role";



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
