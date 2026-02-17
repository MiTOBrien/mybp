DROP TABLE "posts" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tos_accepted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "bloodpressure" DROP COLUMN "period";