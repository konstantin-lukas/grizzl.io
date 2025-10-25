CREATE TABLE "timer" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(100) NOT NULL,
	"tts_voice" text
);
--> statement-breakpoint
CREATE TABLE "timer_interval" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"timer_id" char(16) NOT NULL,
	"title" varchar(100),
	"index" integer NOT NULL,
	"repeat_count" integer NOT NULL,
	"duration" integer NOT NULL,
	"beat_pattern" integer[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "timer" ADD CONSTRAINT "timer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timer_interval" ADD CONSTRAINT "timer_interval_timer_id_timer_id_fk" FOREIGN KEY ("timer_id") REFERENCES "public"."timer"("id") ON DELETE no action ON UPDATE no action;