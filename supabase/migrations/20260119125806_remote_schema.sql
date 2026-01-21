


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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."photo_role" AS ENUM (
    'hero',
    'gallery',
    'progress',
    'floorplan',
    'misc'
);


ALTER TYPE "public"."photo_role" OWNER TO "postgres";


CREATE TYPE "public"."project_status" AS ENUM (
    'coming_soon',
    'completed'
);


ALTER TYPE "public"."project_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE OR REPLACE VIEW "public"."project_with_units" AS
SELECT
    NULL::"uuid" AS "id",
    NULL::"text" AS "slug",
    NULL::"text" AS "name",
    NULL::"public"."project_status" AS "status",
    NULL::boolean AS "is_public",
    NULL::"text" AS "address_line1",
    NULL::"text" AS "address_line2",
    NULL::"text" AS "city",
    NULL::"text" AS "state",
    NULL::"text" AS "postal_code",
    NULL::"text" AS "country",
    NULL::"date" AS "estimated_completion",
    NULL::"date" AS "actual_completion",
    NULL::integer AS "total_units",
    NULL::"text" AS "short_description",
    NULL::"text" AS "long_description",
    NULL::"text" AS "hero_image_url",
    NULL::boolean AS "featured",
    NULL::integer AS "sort_order",
    NULL::"jsonb" AS "metadata",
    NULL::timestamp with time zone AS "created_at",
    NULL::timestamp with time zone AS "updated_at",
    NULL::"jsonb" AS "units";


ALTER VIEW "public"."project_with_units" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "status" "public"."project_status" DEFAULT 'coming_soon'::"public"."project_status" NOT NULL,
    "is_public" boolean DEFAULT false NOT NULL,
    "address_line1" "text" NOT NULL,
    "address_line2" "text",
    "city" "text",
    "state" "text",
    "postal_code" "text",
    "country" "text" DEFAULT 'USA'::"text",
    "estimated_completion" "date",
    "actual_completion" "date",
    "total_units" integer,
    "short_description" "text",
    "long_description" "text",
    "hero_image_url" "text",
    "featured" boolean DEFAULT false NOT NULL,
    "sort_order" integer DEFAULT 0,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "projects_total_units_check" CHECK (("total_units" >= 0))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."unit_photos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "unit_id" "uuid" NOT NULL,
    "storage_path" "text" NOT NULL,
    "alt_text" "text",
    "caption" "text",
    "sort_order" integer DEFAULT 0,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."unit_photos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."units" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "unit_code" "text",
    "bedrooms" numeric(4,2),
    "bathrooms" numeric(4,2),
    "square_feet" integer,
    "description" "text",
    "floorplan_url" "text",
    "availability_status" "text",
    "sort_order" integer DEFAULT 0,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "units_bathrooms_check" CHECK (("bathrooms" >= (0)::numeric)),
    CONSTRAINT "units_bedrooms_check" CHECK (("bedrooms" >= (0)::numeric)),
    CONSTRAINT "units_square_feet_check" CHECK (("square_feet" >= 0))
);


ALTER TABLE "public"."units" OWNER TO "postgres";


ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."unit_photos"
    ADD CONSTRAINT "unit_photos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."units"
    ADD CONSTRAINT "units_pkey" PRIMARY KEY ("id");



CREATE INDEX "projects_featured_idx" ON "public"."projects" USING "btree" ("featured") WHERE ("featured" IS TRUE);



CREATE UNIQUE INDEX "projects_slug_idx" ON "public"."projects" USING "btree" ("slug");



CREATE INDEX "projects_status_idx" ON "public"."projects" USING "btree" ("status");



CREATE INDEX "unit_photos_unit_idx" ON "public"."unit_photos" USING "btree" ("unit_id");



CREATE INDEX "units_project_idx" ON "public"."units" USING "btree" ("project_id");



CREATE INDEX "units_sort_idx" ON "public"."units" USING "btree" ("project_id", "sort_order");



CREATE OR REPLACE VIEW "public"."project_with_units" AS
 SELECT "p"."id",
    "p"."slug",
    "p"."name",
    "p"."status",
    "p"."is_public",
    "p"."address_line1",
    "p"."address_line2",
    "p"."city",
    "p"."state",
    "p"."postal_code",
    "p"."country",
    "p"."estimated_completion",
    "p"."actual_completion",
    "p"."total_units",
    "p"."short_description",
    "p"."long_description",
    "p"."hero_image_url",
    "p"."featured",
    "p"."sort_order",
    "p"."metadata",
    "p"."created_at",
    "p"."updated_at",
    COALESCE("jsonb_agg"("jsonb_build_object"('id', "u"."id", 'name', "u"."name", 'unit_code', "u"."unit_code", 'bedrooms', "u"."bedrooms", 'bathrooms', "u"."bathrooms", 'square_feet', "u"."square_feet", 'description', "u"."description", 'floorplan_url', "u"."floorplan_url", 'availability_status', "u"."availability_status", 'sort_order', "u"."sort_order") ORDER BY "u"."sort_order", "u"."created_at") FILTER (WHERE ("u"."id" IS NOT NULL)), '[]'::"jsonb") AS "units"
   FROM ("public"."projects" "p"
     LEFT JOIN "public"."units" "u" ON (("u"."project_id" = "p"."id")))
  GROUP BY "p"."id";



CREATE OR REPLACE TRIGGER "set_projects_updated_at" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_units_updated_at" BEFORE UPDATE ON "public"."units" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."unit_photos"
    ADD CONSTRAINT "unit_photos_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."units"
    ADD CONSTRAINT "units_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "projects_public_read" ON "public"."projects" FOR SELECT USING ("is_public");



CREATE POLICY "projects_service_role_full" ON "public"."projects" USING (("auth"."role"() = 'service_role'::"text")) WITH CHECK (("auth"."role"() = 'service_role'::"text"));



ALTER TABLE "public"."unit_photos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "unit_photos_public_read" ON "public"."unit_photos" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."units" "u"
     JOIN "public"."projects" "p" ON (("p"."id" = "u"."project_id")))
  WHERE (("u"."id" = "unit_photos"."unit_id") AND "p"."is_public"))));



CREATE POLICY "unit_photos_service_role_full" ON "public"."unit_photos" USING (("auth"."role"() = 'service_role'::"text")) WITH CHECK (("auth"."role"() = 'service_role'::"text"));



ALTER TABLE "public"."units" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "units_public_read" ON "public"."units" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."projects" "p"
  WHERE (("p"."id" = "units"."project_id") AND "p"."is_public"))));



CREATE POLICY "units_service_role_full" ON "public"."units" USING (("auth"."role"() = 'service_role'::"text")) WITH CHECK (("auth"."role"() = 'service_role'::"text"));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."project_with_units" TO "anon";
GRANT ALL ON TABLE "public"."project_with_units" TO "authenticated";
GRANT ALL ON TABLE "public"."project_with_units" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."unit_photos" TO "anon";
GRANT ALL ON TABLE "public"."unit_photos" TO "authenticated";
GRANT ALL ON TABLE "public"."unit_photos" TO "service_role";



GRANT ALL ON TABLE "public"."units" TO "anon";
GRANT ALL ON TABLE "public"."units" TO "authenticated";
GRANT ALL ON TABLE "public"."units" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


  create policy "Public read project assets"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'project-assets'::text));



  create policy "Service role full access project assets"
  on "storage"."objects"
  as permissive
  for all
  to public
using (((bucket_id = 'project-assets'::text) AND (auth.role() = 'service_role'::text)))
with check (((bucket_id = 'project-assets'::text) AND (auth.role() = 'service_role'::text)));



