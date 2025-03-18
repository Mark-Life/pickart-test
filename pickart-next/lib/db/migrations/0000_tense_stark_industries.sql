-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."artist_type" AS ENUM('artist', 'agent');--> statement-breakpoint
CREATE TYPE "public"."artwork_status" AS ENUM('draft', 'pending_approval', 'ready_for_allocation', 'allocated', 'delivered', 'live', 'sold');--> statement-breakpoint
CREATE TYPE "public"."delivery_option" AS ENUM('pickup', 'delivery');--> statement-breakpoint
CREATE TYPE "public"."fixture_method" AS ENUM('wall_mount', 'pedestal', 'ceiling_hang', 'easel', 'shelf', 'floor_stand', 'other');--> statement-breakpoint
CREATE TYPE "public"."host_type" AS ENUM('host', 'owner');--> statement-breakpoint
CREATE TYPE "public"."spot_status" AS ENUM('draft', 'pending_approval', 'ready_for_allocation', 'allocated', 'live');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'artist', 'host');--> statement-breakpoint
CREATE TABLE "countries" (
	"code" char(2) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_types" (
	"name" text PRIMARY KEY NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"country_code" char(2),
	"role" "user_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artists" (
	"id" uuid PRIMARY KEY NOT NULL,
	"artist_type" "artist_type" NOT NULL,
	"display_name" text NOT NULL,
	"bank_account_id" uuid,
	"contract_signed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artists" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "hosts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"host_type" "host_type" NOT NULL,
	"business_name" text,
	"bank_account_id" uuid,
	"contract_signed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hosts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"account_name" text NOT NULL,
	"account_address" text NOT NULL,
	"account_number" text NOT NULL,
	"country_code" char(2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bank_accounts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"property_id" text NOT NULL,
	"property_name" text NOT NULL,
	"street_address" text NOT NULL,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"postcode" text NOT NULL,
	"country_code" char(2) NOT NULL,
	"property_type" text NOT NULL,
	"size_sqm" numeric(10, 2),
	"total_floors" integer,
	"total_rooms" integer,
	"owner_id" uuid,
	"contact_phone" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_property_id_key" UNIQUE("property_id")
);
--> statement-breakpoint
ALTER TABLE "properties" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "property_photos" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"property_id" uuid NOT NULL,
	"storage_path" text NOT NULL,
	"folder_path" text DEFAULT 'properties' NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "property_photos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "spots" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"spot_id" text NOT NULL,
	"property_id" uuid NOT NULL,
	"floor_number" integer,
	"room_name" text,
	"position_description" text,
	"preferred_style" text,
	"color_scheme" text,
	"fixture_method" "fixture_method" NOT NULL,
	"max_weight_kg" numeric(10, 2) NOT NULL,
	"max_width_cm" numeric(10, 2) NOT NULL,
	"max_height_cm" numeric(10, 2) NOT NULL,
	"max_depth_cm" numeric(10, 2),
	"preferred_price_range_min" numeric(10, 2),
	"preferred_price_range_max" numeric(10, 2),
	"status" "spot_status" DEFAULT 'draft' NOT NULL,
	"current_artwork_id" uuid,
	"qr_code_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "spots_spot_id_key" UNIQUE("spot_id")
);
--> statement-breakpoint
ALTER TABLE "spots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "spot_photos" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"spot_id" uuid NOT NULL,
	"storage_path" text NOT NULL,
	"folder_path" text DEFAULT 'spots' NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "spot_photos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artworks" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"artwork_id" text NOT NULL,
	"artist_id" uuid NOT NULL,
	"title" text NOT NULL,
	"year" integer NOT NULL,
	"place" text,
	"description" text,
	"style" text,
	"medium" text NOT NULL,
	"is_unique" boolean NOT NULL,
	"edition_number" integer,
	"edition_total" integer,
	"width_cm" numeric(10, 2) NOT NULL,
	"height_cm" numeric(10, 2) NOT NULL,
	"depth_cm" numeric(10, 2),
	"weight_kg" numeric(10, 2) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"status" "artwork_status" DEFAULT 'draft' NOT NULL,
	"current_spot_id" uuid,
	"qr_code_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "artworks_artwork_id_key" UNIQUE("artwork_id"),
	CONSTRAINT "edition_check" CHECK (((is_unique = true) AND (edition_number IS NULL) AND (edition_total IS NULL)) OR ((is_unique = false) AND (edition_number IS NOT NULL) AND (edition_total IS NOT NULL)))
);
--> statement-breakpoint
ALTER TABLE "artworks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artwork_photos" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"storage_path" text NOT NULL,
	"folder_path" text DEFAULT 'artworks' NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artwork_photos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artwork_spot_allocations" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"artwork_id" uuid NOT NULL,
	"spot_id" uuid NOT NULL,
	"allocated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"allocated_by" uuid NOT NULL,
	"delivered_at" timestamp with time zone,
	"live_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"end_reason" text
);
--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "registration_approvals" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"approved_by" uuid,
	"status" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "registration_approvals_status_check" CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))
);
--> statement-breakpoint
ALTER TABLE "registration_approvals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "property_admins" (
	"property_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "property_admins_pkey" PRIMARY KEY("property_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "property_admins" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."hosts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_property_type_fkey" FOREIGN KEY ("property_type") REFERENCES "public"."property_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_photos" ADD CONSTRAINT "property_photos_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spot_photos" ADD CONSTRAINT "spot_photos_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "public"."spots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "fk_spot" FOREIGN KEY ("current_spot_id") REFERENCES "public"."spots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_photos" ADD CONSTRAINT "artwork_photos_artwork_id_fkey" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ADD CONSTRAINT "artwork_spot_allocations_allocated_by_fkey" FOREIGN KEY ("allocated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ADD CONSTRAINT "artwork_spot_allocations_artwork_id_fkey" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ADD CONSTRAINT "artwork_spot_allocations_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "public"."spots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_approvals" ADD CONSTRAINT "registration_approvals_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_approvals" ADD CONSTRAINT "registration_approvals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_admins" ADD CONSTRAINT "property_admins_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_admins" ADD CONSTRAINT "property_admins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."hosts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "public"."artwork_details" AS (SELECT a.id, a.artwork_id, a.artist_id, a.title, a.year, a.place, a.description, a.style, a.medium, a.is_unique, a.edition_number, a.edition_total, a.width_cm, a.height_cm, a.depth_cm, a.weight_kg, a.price, a.status, a.current_spot_id, a.qr_code_url, a.created_at, a.updated_at, u.first_name AS artist_first_name, u.last_name AS artist_last_name, ar.display_name AS artist_display_name, ( SELECT get_storage_url(artwork_photos.folder_path, artwork_photos.storage_path) AS get_storage_url FROM artwork_photos WHERE artwork_photos.artwork_id = a.id AND artwork_photos.is_primary = true LIMIT 1) AS primary_photo_url, s.spot_id AS spot_identifier, p.property_name AS current_property_name, p.city AS current_property_city FROM artworks a LEFT JOIN artists ar ON a.artist_id = ar.id LEFT JOIN users u ON ar.id = u.id LEFT JOIN spots s ON a.current_spot_id = s.id LEFT JOIN properties p ON s.property_id = p.id);--> statement-breakpoint
CREATE VIEW "public"."spot_details" AS (SELECT s.id, s.spot_id, s.property_id, s.floor_number, s.room_name, s.position_description, s.preferred_style, s.color_scheme, s.fixture_method, s.max_weight_kg, s.max_width_cm, s.max_height_cm, s.max_depth_cm, s.preferred_price_range_min, s.preferred_price_range_max, s.status, s.current_artwork_id, s.qr_code_url, s.created_at, s.updated_at, p.property_name, p.property_type, p.street_address, p.city, p.state, c.name AS country, a.artwork_id AS artwork_identifier, a.title AS current_artwork_title, ar.display_name AS current_artwork_artist FROM spots s LEFT JOIN properties p ON s.property_id = p.id LEFT JOIN countries c ON p.country_code = c.code LEFT JOIN artworks a ON s.current_artwork_id = a.id LEFT JOIN artists ar ON a.artist_id = ar.id);--> statement-breakpoint
CREATE POLICY "admin_all" ON "users" AS PERMISSIVE FOR ALL TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM users users_1
  WHERE ((users_1.id = auth.uid()) AND (users_1.role = 'admin'::user_role)))));--> statement-breakpoint
CREATE POLICY "user_select_own" ON "users" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "user_update_own" ON "users" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "bank_account_select" ON "bank_accounts" AS PERMISSIVE FOR SELECT TO public USING (((EXISTS ( SELECT 1
   FROM artists a
  WHERE ((a.bank_account_id = bank_accounts.id) AND (a.id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM hosts h
  WHERE ((h.bank_account_id = bank_accounts.id) AND (h.id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role))))));--> statement-breakpoint
CREATE POLICY "host_property_select" ON "properties" AS PERMISSIVE FOR SELECT TO public USING (((owner_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM property_admins
  WHERE ((property_admins.property_id = properties.id) AND (property_admins.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role))))));--> statement-breakpoint
CREATE POLICY "host_spot_select" ON "spots" AS PERMISSIVE FOR SELECT TO public USING (((EXISTS ( SELECT 1
   FROM properties
  WHERE ((properties.id = spots.property_id) AND ((properties.owner_id = auth.uid()) OR (EXISTS ( SELECT 1
           FROM property_admins
          WHERE ((property_admins.property_id = properties.id) AND (property_admins.user_id = auth.uid())))))))) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role))))));--> statement-breakpoint
CREATE POLICY "artist_artwork_insert" ON "artworks" AS PERMISSIVE FOR INSERT TO public WITH CHECK (((artist_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role))))));--> statement-breakpoint
CREATE POLICY "artist_artwork_select" ON "artworks" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "artist_artwork_update" ON "artworks" AS PERMISSIVE FOR UPDATE TO public;
*/