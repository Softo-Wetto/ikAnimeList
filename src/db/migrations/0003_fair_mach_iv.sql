CREATE TABLE "recommendation_dismissal" (
	"user_id" text NOT NULL,
	"media_type" "media_type" NOT NULL,
	"media_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "recommendation_dismissal_user_id_media_type_media_id_pk" PRIMARY KEY("user_id","media_type","media_id")
);
--> statement-breakpoint
ALTER TABLE "library_entry" ADD COLUMN "genres" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "library_entry" ADD COLUMN "themes" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "recommendation_dismissal" ADD CONSTRAINT "recommendation_dismissal_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;