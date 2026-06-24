CREATE TYPE "public"."poll_method" AS ENUM('runoff', 'positional', 'score', 'approval', 'plurality');--> statement-breakpoint
CREATE TYPE "public"."voter_identity_method" AS ENUM('ip', 'cookie');--> statement-breakpoint
CREATE TABLE "poll" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"user_id" char(16) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"title" varchar(200) NOT NULL,
	"voter_identity_method" "voter_identity_method" NOT NULL,
	"closes_at" timestamp with time zone,
	"choices" varchar(100)[] NOT NULL,
	"method" "poll_method" NOT NULL,
	"majority_winner" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll_vote" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"poll_id" char(16) NOT NULL,
	"voter_identifier_hash" char(64) NOT NULL,
	"selection" smallint[] NOT NULL,
	CONSTRAINT "poll_vote_pollId_voterIdentifierHash_unique" UNIQUE("poll_id","voter_identifier_hash")
);
--> statement-breakpoint
ALTER TABLE "poll" ADD CONSTRAINT "poll_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_poll_id_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."poll"("id") ON DELETE cascade ON UPDATE no action;