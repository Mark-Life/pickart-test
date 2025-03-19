import { pgEnum, pgTable, text, integer, numeric, boolean, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core"

// Enum types
export const userRoleEnum = pgEnum('user_role', ['admin', 'artist', 'host'])
export const artistTypeEnum = pgEnum('artist_type', ['artist', 'agent'])
export const hostTypeEnum = pgEnum('host_type', ['host', 'owner'])
export const fixtureMethodEnum = pgEnum('fixture_method', [
  'wall_mount',
  'pedestal',
  'ceiling_hang',
  'easel',
  'shelf',
  'floor_stand',
  'other'
])
export const artworkStatusEnum = pgEnum('artwork_status', [
  'draft',
  'pending_approval',
  'ready_for_allocation',
  'allocated',
  'delivered',
  'live',
  'sold'
])
export const spotStatusEnum = pgEnum('spot_status', [
  'draft',
  'pending_approval',
  'ready_for_allocation',
  'allocated',
  'live'
])
export const deliveryOptionEnum = pgEnum('delivery_option', [
  'pickup',
  'delivery'
])
export const registrationStatusEnum = pgEnum('registration_status', ['pending', 'approved', 'rejected'])

// Tables
export const countries = pgTable("countries", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const propertyTypes = pgTable("property_types", {
  name: text("name").primaryKey(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const bankAccounts = pgTable("bank_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountName: text("account_name").notNull(),
  accountAddress: text("account_address").notNull(),
  accountNumber: text("account_number").notNull(),
  countryCode: text("country_code").references(() => countries.code),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  countryCode: text("country_code").references(() => countries.code),
  role: userRoleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const artists = pgTable("artists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  artistType: artistTypeEnum("artist_type").notNull(),
  displayName: text("display_name").notNull(),
  bankAccountId: uuid("bank_account_id").references(() => bankAccounts.id),
  contractSigned: boolean("contract_signed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const hosts = pgTable("hosts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  hostType: hostTypeEnum("host_type").notNull(),
  businessName: text("business_name"),
  bankAccountId: uuid("bank_account_id").references(() => bankAccounts.id),
  contractSigned: boolean("contract_signed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: text("property_id").notNull().unique(),
  propertyName: text("property_name").notNull(),
  streetAddress: text("street_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postcode: text("postcode").notNull(),
  countryCode: text("country_code").notNull().references(() => countries.code),
  propertyType: text("property_type").notNull().references(() => propertyTypes.name),
  sizeSqm: numeric("size_sqm", { precision: 10, scale: 2 }),
  totalFloors: integer("total_floors"),
  totalRooms: integer("total_rooms"),
  ownerId: uuid("owner_id").references(() => hosts.id),
  contactPhone: text("contact_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const propertyPhotos = pgTable("property_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: 'cascade' }),
  storagePath: text("storage_path").notNull(),
  folderPath: text("folder_path").notNull().default('properties'),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const spots = pgTable("spots", {
  id: uuid("id").primaryKey().defaultRandom(),
  spotId: text("spot_id").notNull().unique(),
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: 'cascade' }),
  floorNumber: integer("floor_number"),
  roomName: text("room_name"),
  positionDescription: text("position_description"),
  preferredStyle: text("preferred_style"),
  colorScheme: text("color_scheme"),
  fixtureMethod: fixtureMethodEnum("fixture_method").notNull(),
  maxWeightKg: numeric("max_weight_kg", { precision: 10, scale: 2 }).notNull(),
  maxWidthCm: numeric("max_width_cm", { precision: 10, scale: 2 }).notNull(),
  maxHeightCm: numeric("max_height_cm", { precision: 10, scale: 2 }).notNull(),
  maxDepthCm: numeric("max_depth_cm", { precision: 10, scale: 2 }),
  preferredPriceRangeMin: numeric("preferred_price_range_min", { precision: 10, scale: 2 }),
  preferredPriceRangeMax: numeric("preferred_price_range_max", { precision: 10, scale: 2 }),
  status: spotStatusEnum("status").notNull().default('draft'),
  currentArtworkId: uuid("current_artwork_id"),
  qrCodeUrl: text("qr_code_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const spotPhotos = pgTable("spot_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  spotId: uuid("spot_id").notNull().references(() => spots.id, { onDelete: 'cascade' }),
  storagePath: text("storage_path").notNull(),
  folderPath: text("folder_path").notNull().default('spots'),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const artworks = pgTable("artworks", {
  id: uuid("id").primaryKey().defaultRandom(),
  artworkId: text("artwork_id").notNull().unique(),
  artistId: uuid("artist_id").notNull().references(() => artists.id),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  place: text("place"),
  description: text("description"),
  style: text("style"),
  medium: text("medium").notNull(),
  isUnique: boolean("is_unique").notNull(),
  editionNumber: integer("edition_number"),
  editionTotal: integer("edition_total"),
  widthCm: numeric("width_cm", { precision: 10, scale: 2 }).notNull(),
  heightCm: numeric("height_cm", { precision: 10, scale: 2 }).notNull(),
  depthCm: numeric("depth_cm", { precision: 10, scale: 2 }),
  weightKg: numeric("weight_kg", { precision: 10, scale: 2 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  status: artworkStatusEnum("status").notNull().default('draft'),
  currentSpotId: uuid("current_spot_id"),
  qrCodeUrl: text("qr_code_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const artworkPhotos = pgTable("artwork_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  artworkId: uuid("artwork_id").notNull().references(() => artworks.id, { onDelete: 'cascade' }),
  storagePath: text("storage_path").notNull(),
  folderPath: text("folder_path").notNull().default('artworks'),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const artworkSpotAllocations = pgTable("artwork_spot_allocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  artworkId: uuid("artwork_id").notNull().references(() => artworks.id),
  spotId: uuid("spot_id").notNull().references(() => spots.id),
  allocatedAt: timestamp("allocated_at").defaultNow().notNull(),
  allocatedBy: uuid("allocated_by").notNull().references(() => users.id),
  deliveredAt: timestamp("delivered_at"),
  liveAt: timestamp("live_at"),
  endedAt: timestamp("ended_at"),
  endReason: text("end_reason"),
})

export const registrationApprovals = pgTable("registration_approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  approvedBy: uuid("approved_by").references(() => users.id),
  status: registrationStatusEnum("status").notNull(),
  notes: text("notes"),
  requestedRole: userRoleEnum("requested_role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const propertyAdmins = pgTable("property_admins", {
  propertyId: uuid("property_id").notNull().references(() => properties.id, { onDelete: 'cascade' }),
  userId: uuid("user_id").notNull().references(() => hosts.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.propertyId, table.userId] })
  }
}) 