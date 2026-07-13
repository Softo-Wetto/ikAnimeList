ALTER TABLE "activity" ADD CONSTRAINT "activity_visibility_valid" CHECK ("activity"."visibility" IN ('public', 'followers', 'private'));--> statement-breakpoint
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_progress_nonnegative" CHECK ("library_entry"."progress" >= 0);--> statement-breakpoint
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_score_range" CHECK ("library_entry"."score" IS NULL OR ("library_entry"."score" >= 1 AND "library_entry"."score" <= 10));--> statement-breakpoint
ALTER TABLE "library_entry" ADD CONSTRAINT "library_entry_progress_within_total" CHECK ("library_entry"."progress_total" IS NULL OR "library_entry"."progress" <= "library_entry"."progress_total");--> statement-breakpoint
ALTER TABLE "follow" ADD CONSTRAINT "follow_no_self" CHECK ("follow"."follower_id" <> "follow"."following_id");--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_visibility_valid" CHECK ("profile"."visibility" IN ('public', 'private'));--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_rating_range" CHECK ("review"."rating" >= 1 AND "review"."rating" <= 10);--> statement-breakpoint
ALTER TABLE "review" ADD CONSTRAINT "review_moderation_status_valid" CHECK ("review"."moderation_status" IN ('published', 'pending', 'hidden', 'rejected'));