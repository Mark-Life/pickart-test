import { pgTable, char, text, timestamp, foreignKey, pgPolicy, uuid, boolean, unique, numeric, integer, check, primaryKey, pgView, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const artistType = pgEnum("artist_type", ['artist', 'agent'])
export const artworkStatus = pgEnum("artwork_status", ['draft', 'pending_approval', 'ready_for_allocation', 'allocated', 'delivered', 'live', 'sold'])
export const deliveryOption = pgEnum("delivery_option", ['pickup', 'delivery'])
export const fixtureMethod = pgEnum("fixture_method", ['wall_mount', 'pedestal', 'ceiling_hang', 'easel', 'shelf', 'floor_stand', 'other'])
export const hostType = pgEnum("host_type", ['host', 'owner'])
export const spotStatus = pgEnum("spot_status", ['draft', 'pending_approval', 'ready_for_allocation', 'allocated', 'live'])
export const userRole = pgEnum("user_role", ['admin', 'artist', 'host'])


export const countries = pgTable("countries", {
	code: char({ length: 2 }).primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const propertyTypes = pgTable("property_types", {
	name: text().primaryKey().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const artists = pgTable("artists", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	artistType: artistType("artist_type").notNull(),
	displayName: text("display_name").notNull(),
	bankAccountId: uuid("bank_account_id"),
	contractSigned: boolean("contract_signed").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.bankAccountId],
			foreignColumns: [bankAccounts.id],
			name: "artists_bank_account_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "artists_user_id_fkey"
		}),
	pgPolicy("artist_select_own", { as: "permissive", for: "select", to: ["public"], using: sql`((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role)))))` }),
	pgPolicy("artist_update_own", { as: "permissive", for: "update", to: ["public"] }),
]);

export const hosts = pgTable("hosts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	hostType: hostType("host_type").notNull(),
	businessName: text("business_name"),
	bankAccountId: uuid("bank_account_id"),
	contractSigned: boolean("contract_signed").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id"),
}, (table) => [
	foreignKey({
			columns: [table.bankAccountId],
			foreignColumns: [bankAccounts.id],
			name: "hosts_bank_account_id_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "hosts_user_id_fkey"
		}),
	pgPolicy("host_select_own", { as: "permissive", for: "select", to: ["public"], using: sql`((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role)))))` }),
	pgPolicy("host_update_own", { as: "permissive", for: "update", to: ["public"] }),
]);

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	phone: text(),
	address: text(),
	countryCode: char("country_code", { length: 2 }),
	role: userRole().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.countryCode],
			foreignColumns: [countries.code],
			name: "users_country_code_fkey"
		}),
	unique("users_email_key").on(table.email),
	pgPolicy("admin_all", { as: "permissive", for: "all", to: ["authenticated"], using: sql`(EXISTS ( SELECT 1
   FROM users users_1
  WHERE ((users_1.id = auth.uid()) AND (users_1.role = 'admin'::user_role))))` }),
	pgPolicy("user_select_own", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("user_update_own", { as: "permissive", for: "update", to: ["public"] }),
]);

export const bankAccounts = pgTable("bank_accounts", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	accountName: text("account_name").notNull(),
	accountAddress: text("account_address").notNull(),
	accountNumber: text("account_number").notNull(),
	countryCode: char("country_code", { length: 2 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.countryCode],
			foreignColumns: [countries.code],
			name: "bank_accounts_country_code_fkey"
		}),
	pgPolicy("bank_account_select", { as: "permissive", for: "select", to: ["public"], using: sql`((EXISTS ( SELECT 1
   FROM artists a
  WHERE ((a.bank_account_id = bank_accounts.id) AND (a.id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM hosts h
  WHERE ((h.bank_account_id = bank_accounts.id) AND (h.id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role)))))` }),
]);

export const properties = pgTable("properties", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	propertyId: text("property_id").notNull(),
	propertyName: text("property_name").notNull(),
	streetAddress: text("street_address").notNull(),
	city: text().notNull(),
	state: text().notNull(),
	postcode: text().notNull(),
	countryCode: char("country_code", { length: 2 }).notNull(),
	propertyType: text("property_type").notNull(),
	sizeSqm: numeric("size_sqm", { precision: 10, scale:  2 }),
	totalFloors: integer("total_floors"),
	totalRooms: integer("total_rooms"),
	ownerId: uuid("owner_id"),
	contactPhone: text("contact_phone").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.countryCode],
			foreignColumns: [countries.code],
			name: "properties_country_code_fkey"
		}),
	foreignKey({
			columns: [table.ownerId],
			foreignColumns: [hosts.id],
			name: "properties_owner_id_fkey"
		}),
	foreignKey({
			columns: [table.propertyType],
			foreignColumns: [propertyTypes.name],
			name: "properties_property_type_fkey"
		}),
	unique("properties_property_id_key").on(table.propertyId),
	pgPolicy("host_property_select", { as: "permissive", for: "select", to: ["public"], using: sql`((EXISTS ( SELECT 1
   FROM hosts h
  WHERE ((h.id = properties.owner_id) AND (h.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM (property_admins pa
     JOIN hosts h ON ((h.id = pa.user_id)))
  WHERE ((pa.property_id = properties.id) AND (h.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role)))))` }),
]);

export const propertyPhotos = pgTable("property_photos", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	propertyId: uuid("property_id").notNull(),
	storagePath: text("storage_path").notNull(),
	folderPath: text("folder_path").default('properties').notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_photos_property_id_fkey"
		}).onDelete("cascade"),
]);

export const spots = pgTable("spots", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	spotId: text("spot_id").notNull(),
	propertyId: uuid("property_id").notNull(),
	floorNumber: integer("floor_number"),
	roomName: text("room_name"),
	positionDescription: text("position_description"),
	preferredStyle: text("preferred_style"),
	colorScheme: text("color_scheme"),
	fixtureMethod: fixtureMethod("fixture_method").notNull(),
	maxWeightKg: numeric("max_weight_kg", { precision: 10, scale:  2 }).notNull(),
	maxWidthCm: numeric("max_width_cm", { precision: 10, scale:  2 }).notNull(),
	maxHeightCm: numeric("max_height_cm", { precision: 10, scale:  2 }).notNull(),
	maxDepthCm: numeric("max_depth_cm", { precision: 10, scale:  2 }),
	preferredPriceRangeMin: numeric("preferred_price_range_min", { precision: 10, scale:  2 }),
	preferredPriceRangeMax: numeric("preferred_price_range_max", { precision: 10, scale:  2 }),
	status: spotStatus().default('draft').notNull(),
	currentArtworkId: uuid("current_artwork_id"),
	qrCodeUrl: text("qr_code_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "spots_property_id_fkey"
		}).onDelete("cascade"),
	unique("spots_spot_id_key").on(table.spotId),
	pgPolicy("host_spot_select", { as: "permissive", for: "select", to: ["public"], using: sql`((EXISTS ( SELECT 1
   FROM (properties p
     JOIN hosts h ON ((h.id = p.owner_id)))
  WHERE ((p.id = spots.property_id) AND ((h.user_id = auth.uid()) OR (EXISTS ( SELECT 1
           FROM (property_admins pa
             JOIN hosts h2 ON ((h2.id = pa.user_id)))
          WHERE ((pa.property_id = p.id) AND (h2.user_id = auth.uid())))))))) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role)))))` }),
]);

export const spotPhotos = pgTable("spot_photos", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	spotId: uuid("spot_id").notNull(),
	storagePath: text("storage_path").notNull(),
	folderPath: text("folder_path").default('spots').notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.spotId],
			foreignColumns: [spots.id],
			name: "spot_photos_spot_id_fkey"
		}).onDelete("cascade"),
]);

export const artworks = pgTable("artworks", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	artworkId: text("artwork_id").notNull(),
	artistId: uuid("artist_id").notNull(),
	title: text().notNull(),
	year: integer().notNull(),
	place: text(),
	description: text(),
	style: text(),
	medium: text().notNull(),
	isUnique: boolean("is_unique").notNull(),
	editionNumber: integer("edition_number"),
	editionTotal: integer("edition_total"),
	widthCm: numeric("width_cm", { precision: 10, scale:  2 }).notNull(),
	heightCm: numeric("height_cm", { precision: 10, scale:  2 }).notNull(),
	depthCm: numeric("depth_cm", { precision: 10, scale:  2 }),
	weightKg: numeric("weight_kg", { precision: 10, scale:  2 }).notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	status: artworkStatus().default('draft').notNull(),
	currentSpotId: uuid("current_spot_id"),
	qrCodeUrl: text("qr_code_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.artistId],
			foreignColumns: [artists.id],
			name: "artworks_artist_id_fkey"
		}),
	foreignKey({
			columns: [table.currentSpotId],
			foreignColumns: [spots.id],
			name: "fk_spot"
		}),
	unique("artworks_artwork_id_key").on(table.artworkId),
	pgPolicy("artist_artwork_insert", { as: "permissive", for: "insert", to: ["public"], withCheck: sql`((artist_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role)))))`  }),
	pgPolicy("artist_artwork_select", { as: "permissive", for: "select", to: ["public"] }),
	pgPolicy("artist_artwork_update", { as: "permissive", for: "update", to: ["public"] }),
	check("edition_check", sql`((is_unique = true) AND (edition_number IS NULL) AND (edition_total IS NULL)) OR ((is_unique = false) AND (edition_number IS NOT NULL) AND (edition_total IS NOT NULL))`),
]);

export const artworkPhotos = pgTable("artwork_photos", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	artworkId: uuid("artwork_id").notNull(),
	storagePath: text("storage_path").notNull(),
	folderPath: text("folder_path").default('artworks').notNull(),
	isPrimary: boolean("is_primary").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.artworkId],
			foreignColumns: [artworks.id],
			name: "artwork_photos_artwork_id_fkey"
		}).onDelete("cascade"),
]);

export const artworkSpotAllocations = pgTable("artwork_spot_allocations", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	artworkId: uuid("artwork_id").notNull(),
	spotId: uuid("spot_id").notNull(),
	allocatedAt: timestamp("allocated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	allocatedBy: uuid("allocated_by").notNull(),
	deliveredAt: timestamp("delivered_at", { withTimezone: true, mode: 'string' }),
	liveAt: timestamp("live_at", { withTimezone: true, mode: 'string' }),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }),
	endReason: text("end_reason"),
}, (table) => [
	foreignKey({
			columns: [table.allocatedBy],
			foreignColumns: [users.id],
			name: "artwork_spot_allocations_allocated_by_fkey"
		}),
	foreignKey({
			columns: [table.artworkId],
			foreignColumns: [artworks.id],
			name: "artwork_spot_allocations_artwork_id_fkey"
		}),
	foreignKey({
			columns: [table.spotId],
			foreignColumns: [spots.id],
			name: "artwork_spot_allocations_spot_id_fkey"
		}),
]);

export const registrationApprovals = pgTable("registration_approvals", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	approvedBy: uuid("approved_by"),
	status: text().notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	requestedRole: userRole("requested_role").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.approvedBy],
			foreignColumns: [users.id],
			name: "registration_approvals_approved_by_fkey"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "registration_approvals_user_id_fkey"
		}),
	check("registration_approvals_status_check", sql`status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])`),
]);

export const propertyAdmins = pgTable("property_admins", {
	propertyId: uuid("property_id").notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.propertyId],
			foreignColumns: [properties.id],
			name: "property_admins_property_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [hosts.id],
			name: "property_admins_user_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.propertyId, table.userId], name: "property_admins_pkey"}),
	pgPolicy("property_admin_select", { as: "permissive", for: "select", to: ["public"], using: sql`((EXISTS ( SELECT 1
   FROM hosts h
  WHERE ((h.id = property_admins.user_id) AND (h.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM (hosts h
     JOIN properties p ON ((p.owner_id = h.id)))
  WHERE ((p.id = property_admins.property_id) AND (h.user_id = auth.uid())))) OR (EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = auth.uid()) AND (users.role = 'admin'::user_role)))))` }),
]);
export const artworkDetails = pgView("artwork_details", {	id: uuid(),
	artworkId: text("artwork_id"),
	artistId: uuid("artist_id"),
	title: text(),
	year: integer(),
	place: text(),
	description: text(),
	style: text(),
	medium: text(),
	isUnique: boolean("is_unique"),
	editionNumber: integer("edition_number"),
	editionTotal: integer("edition_total"),
	widthCm: numeric("width_cm", { precision: 10, scale:  2 }),
	heightCm: numeric("height_cm", { precision: 10, scale:  2 }),
	depthCm: numeric("depth_cm", { precision: 10, scale:  2 }),
	weightKg: numeric("weight_kg", { precision: 10, scale:  2 }),
	price: numeric({ precision: 10, scale:  2 }),
	status: artworkStatus(),
	currentSpotId: uuid("current_spot_id"),
	qrCodeUrl: text("qr_code_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	artistFirstName: text("artist_first_name"),
	artistLastName: text("artist_last_name"),
	artistDisplayName: text("artist_display_name"),
	primaryPhotoUrl: text("primary_photo_url"),
	spotIdentifier: text("spot_identifier"),
	currentPropertyName: text("current_property_name"),
	currentPropertyCity: text("current_property_city"),
}).as(sql`SELECT a.id, a.artwork_id, a.artist_id, a.title, a.year, a.place, a.description, a.style, a.medium, a.is_unique, a.edition_number, a.edition_total, a.width_cm, a.height_cm, a.depth_cm, a.weight_kg, a.price, a.status, a.current_spot_id, a.qr_code_url, a.created_at, a.updated_at, u.first_name AS artist_first_name, u.last_name AS artist_last_name, ar.display_name AS artist_display_name, ( SELECT get_storage_url(artwork_photos.folder_path, artwork_photos.storage_path) AS get_storage_url FROM artwork_photos WHERE artwork_photos.artwork_id = a.id AND artwork_photos.is_primary = true LIMIT 1) AS primary_photo_url, s.spot_id AS spot_identifier, p.property_name AS current_property_name, p.city AS current_property_city FROM artworks a LEFT JOIN artists ar ON a.artist_id = ar.id LEFT JOIN users u ON ar.id = u.id LEFT JOIN spots s ON a.current_spot_id = s.id LEFT JOIN properties p ON s.property_id = p.id`);

export const spotDetails = pgView("spot_details", {	id: uuid(),
	spotId: text("spot_id"),
	propertyId: uuid("property_id"),
	floorNumber: integer("floor_number"),
	roomName: text("room_name"),
	positionDescription: text("position_description"),
	preferredStyle: text("preferred_style"),
	colorScheme: text("color_scheme"),
	fixtureMethod: fixtureMethod("fixture_method"),
	maxWeightKg: numeric("max_weight_kg", { precision: 10, scale:  2 }),
	maxWidthCm: numeric("max_width_cm", { precision: 10, scale:  2 }),
	maxHeightCm: numeric("max_height_cm", { precision: 10, scale:  2 }),
	maxDepthCm: numeric("max_depth_cm", { precision: 10, scale:  2 }),
	preferredPriceRangeMin: numeric("preferred_price_range_min", { precision: 10, scale:  2 }),
	preferredPriceRangeMax: numeric("preferred_price_range_max", { precision: 10, scale:  2 }),
	status: spotStatus(),
	currentArtworkId: uuid("current_artwork_id"),
	qrCodeUrl: text("qr_code_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	propertyName: text("property_name"),
	propertyType: text("property_type"),
	streetAddress: text("street_address"),
	city: text(),
	state: text(),
	country: text(),
	artworkIdentifier: text("artwork_identifier"),
	currentArtworkTitle: text("current_artwork_title"),
	currentArtworkArtist: text("current_artwork_artist"),
}).as(sql`SELECT s.id, s.spot_id, s.property_id, s.floor_number, s.room_name, s.position_description, s.preferred_style, s.color_scheme, s.fixture_method, s.max_weight_kg, s.max_width_cm, s.max_height_cm, s.max_depth_cm, s.preferred_price_range_min, s.preferred_price_range_max, s.status, s.current_artwork_id, s.qr_code_url, s.created_at, s.updated_at, p.property_name, p.property_type, p.street_address, p.city, p.state, c.name AS country, a.artwork_id AS artwork_identifier, a.title AS current_artwork_title, ar.display_name AS current_artwork_artist FROM spots s LEFT JOIN properties p ON s.property_id = p.id LEFT JOIN countries c ON p.country_code = c.code LEFT JOIN artworks a ON s.current_artwork_id = a.id LEFT JOIN artists ar ON a.artist_id = ar.id`);