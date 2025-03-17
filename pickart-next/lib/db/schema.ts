import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core"

export const artPieces = pgTable("art_pieces", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  dimensions: text("dimensions").notNull(),
  medium: text("medium").notNull(),
  style: text("style").notNull(),
  published: boolean("published").notNull().default(false),
  images: text("images").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const places = pgTable("places", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  type: text("type", { enum: ["hotel", "apartment", "gallery", "office"] }).notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  artPieceId: text("art_piece_id").references(() => artPieces.id),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}) 