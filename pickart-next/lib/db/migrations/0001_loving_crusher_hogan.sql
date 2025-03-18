CREATE TYPE "public"."registration_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "artists" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "artwork_photos" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "artworks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bank_accounts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "hosts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "properties" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "property_admins" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "property_photos" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "registration_approvals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "spot_photos" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "spots" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP VIEW "public"."artwork_details";--> statement-breakpoint
DROP VIEW "public"."spot_details";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_key";--> statement-breakpoint
ALTER TABLE "properties" DROP CONSTRAINT "properties_property_id_key";--> statement-breakpoint
ALTER TABLE "spots" DROP CONSTRAINT "spots_spot_id_key";--> statement-breakpoint
ALTER TABLE "artworks" DROP CONSTRAINT "artworks_artwork_id_key";--> statement-breakpoint
ALTER TABLE "artworks" DROP CONSTRAINT "edition_check";--> statement-breakpoint
ALTER TABLE "registration_approvals" DROP CONSTRAINT "registration_approvals_status_check";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_country_code_fkey";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_id_fkey";
--> statement-breakpoint
ALTER TABLE "artists" DROP CONSTRAINT "artists_bank_account_id_fkey";
--> statement-breakpoint
ALTER TABLE "artists" DROP CONSTRAINT "artists_id_fkey";
--> statement-breakpoint
ALTER TABLE "hosts" DROP CONSTRAINT "hosts_bank_account_id_fkey";
--> statement-breakpoint
ALTER TABLE "hosts" DROP CONSTRAINT "hosts_id_fkey";
--> statement-breakpoint
ALTER TABLE "bank_accounts" DROP CONSTRAINT "bank_accounts_country_code_fkey";
--> statement-breakpoint
ALTER TABLE "properties" DROP CONSTRAINT "properties_country_code_fkey";
--> statement-breakpoint
ALTER TABLE "properties" DROP CONSTRAINT "properties_owner_id_fkey";
--> statement-breakpoint
ALTER TABLE "properties" DROP CONSTRAINT "properties_property_type_fkey";
--> statement-breakpoint
ALTER TABLE "property_photos" DROP CONSTRAINT "property_photos_property_id_fkey";
--> statement-breakpoint
ALTER TABLE "spots" DROP CONSTRAINT "spots_property_id_fkey";
--> statement-breakpoint
ALTER TABLE "spot_photos" DROP CONSTRAINT "spot_photos_spot_id_fkey";
--> statement-breakpoint
ALTER TABLE "artworks" DROP CONSTRAINT "artworks_artist_id_fkey";
--> statement-breakpoint
ALTER TABLE "artworks" DROP CONSTRAINT "fk_spot";
--> statement-breakpoint
ALTER TABLE "artwork_photos" DROP CONSTRAINT "artwork_photos_artwork_id_fkey";
--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" DROP CONSTRAINT "artwork_spot_allocations_allocated_by_fkey";
--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" DROP CONSTRAINT "artwork_spot_allocations_artwork_id_fkey";
--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" DROP CONSTRAINT "artwork_spot_allocations_spot_id_fkey";
--> statement-breakpoint
ALTER TABLE "registration_approvals" DROP CONSTRAINT "registration_approvals_approved_by_fkey";
--> statement-breakpoint
ALTER TABLE "registration_approvals" DROP CONSTRAINT "registration_approvals_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "property_admins" DROP CONSTRAINT "property_admins_property_id_fkey";
--> statement-breakpoint
ALTER TABLE "property_admins" DROP CONSTRAINT "property_admins_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "property_admins" DROP CONSTRAINT "property_admins_pkey";--> statement-breakpoint
ALTER TABLE "countries" ALTER COLUMN "code" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "countries" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "property_types" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "country_code" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "artists" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "hosts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "hosts" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "hosts" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "bank_accounts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "bank_accounts" ALTER COLUMN "country_code" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bank_accounts" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "bank_accounts" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "country_code" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "property_photos" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "property_photos" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "spots" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "spot_photos" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "spot_photos" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "artworks" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "artworks" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "artworks" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "artwork_photos" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "artwork_photos" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ALTER COLUMN "allocated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ALTER COLUMN "delivered_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ALTER COLUMN "live_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ALTER COLUMN "ended_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "registration_approvals" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "registration_approvals" ALTER COLUMN "status" SET DATA TYPE registration_status;--> statement-breakpoint
ALTER TABLE "registration_approvals" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "registration_approvals" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "property_admins" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "property_admins" ADD CONSTRAINT "property_admins_property_id_user_id_pk" PRIMARY KEY("property_id","user_id");--> statement-breakpoint
ALTER TABLE "artists" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "hosts" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_bank_account_id_bank_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_bank_account_id_bank_accounts_id_fk" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_country_code_countries_code_fk" FOREIGN KEY ("country_code") REFERENCES "public"."countries"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_property_type_property_types_name_fk" FOREIGN KEY ("property_type") REFERENCES "public"."property_types"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_owner_id_hosts_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."hosts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_photos" ADD CONSTRAINT "property_photos_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spot_photos" ADD CONSTRAINT "spot_photos_spot_id_spots_id_fk" FOREIGN KEY ("spot_id") REFERENCES "public"."spots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_photos" ADD CONSTRAINT "artwork_photos_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ADD CONSTRAINT "artwork_spot_allocations_artwork_id_artworks_id_fk" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ADD CONSTRAINT "artwork_spot_allocations_spot_id_spots_id_fk" FOREIGN KEY ("spot_id") REFERENCES "public"."spots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artwork_spot_allocations" ADD CONSTRAINT "artwork_spot_allocations_allocated_by_users_id_fk" FOREIGN KEY ("allocated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_approvals" ADD CONSTRAINT "registration_approvals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registration_approvals" ADD CONSTRAINT "registration_approvals_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_admins" ADD CONSTRAINT "property_admins_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_admins" ADD CONSTRAINT "property_admins_user_id_hosts_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."hosts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_property_id_unique" UNIQUE("property_id");--> statement-breakpoint
ALTER TABLE "spots" ADD CONSTRAINT "spots_spot_id_unique" UNIQUE("spot_id");--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_artwork_id_unique" UNIQUE("artwork_id");--> statement-breakpoint
DROP POLICY "admin_all" ON "users" CASCADE;--> statement-breakpoint
DROP POLICY "user_select_own" ON "users" CASCADE;--> statement-breakpoint
DROP POLICY "user_update_own" ON "users" CASCADE;--> statement-breakpoint
DROP POLICY "bank_account_select" ON "bank_accounts" CASCADE;--> statement-breakpoint
DROP POLICY "host_property_select" ON "properties" CASCADE;--> statement-breakpoint
DROP POLICY "host_spot_select" ON "spots" CASCADE;--> statement-breakpoint
DROP POLICY "artist_artwork_insert" ON "artworks" CASCADE;--> statement-breakpoint
DROP POLICY "artist_artwork_select" ON "artworks" CASCADE;--> statement-breakpoint
DROP POLICY "artist_artwork_update" ON "artworks" CASCADE;