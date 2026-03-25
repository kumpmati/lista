ALTER TABLE "list_item" DROP CONSTRAINT "list_item_last_updated_by_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "list_item" ALTER COLUMN "updated_at" SET DEFAULT NULL;--> statement-breakpoint
ALTER TABLE "list_item" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "list_item" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "list_item" DROP COLUMN "last_updated_by_user_id";