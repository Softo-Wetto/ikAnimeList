CREATE TYPE "public"."library_status" AS ENUM('planning', 'watching', 'reading', 'completed', 'paused', 'dropped', 'repeating');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('anime', 'manga');--> statement-breakpoint
CREATE TABLE "activity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" text NOT NULL,
	"type" text NOT NULL,
	"media_id" integer,
	"media_type" "media_type",
	"visibility" text DEFAULT 'public' NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library_entry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" "media_type" NOT NULL,
	"title" text NOT NULL,
	"image_url" text,
	"format" text,
	"status" "library_status" DEFAULT 'planning' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"progress_total" integer,
	"score" integer,
	"favourite" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activity" ADD CONSTRAINT "activity_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_actor_created_idx" ON "activity" USING btree ("actor_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "library_entry_user_media_unique" ON "library_entry" USING btree ("user_id","media_type","media_id");--> statement-breakpoint
CREATE INDEX "library_entry_user_status_idx" ON "library_entry" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "library_entry_updated_idx" ON "library_entry" USING btree ("updated_at");