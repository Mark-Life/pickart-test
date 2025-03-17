CREATE TABLE "art_pieces" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"year" integer NOT NULL,
	"price" integer NOT NULL,
	"description" text NOT NULL,
	"dimensions" text NOT NULL,
	"medium" text NOT NULL,
	"style" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"images" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "places" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"art_piece_id" text,
	"image" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "places_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "places" ADD CONSTRAINT "places_art_piece_id_art_pieces_id_fk" FOREIGN KEY ("art_piece_id") REFERENCES "public"."art_pieces"("id") ON DELETE no action ON UPDATE no action;