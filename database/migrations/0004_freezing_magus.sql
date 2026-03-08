CREATE TYPE "public"."finance_category" AS ENUM('travel', 'hobbies', 'partying', 'entertainment', 'sports_and_outdoors', 'groceries', 'food_delivery', 'eating_out', 'furniture', 'garden_and_plants', 'home_supplies', 'personal_care', 'pets', 'home_repairs', 'public_transit', 'bike', 'car', 'motorbike', 'clothing', 'electronics', 'books', 'gaming', 'presents', 'account_transfer', 'education', 'childcare', 'investments', 'donations', 'medication', 'miscellaneous');--> statement-breakpoint
CREATE TABLE "finance_account" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"user_id" char(16) NOT NULL,
	"deleted_at" timestamp,
	"title" varchar(100) NOT NULL,
	"currency" char(3) NOT NULL,
	"balance" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_transaction" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"account_id" char(16) NOT NULL,
	"amount" bigint DEFAULT 0 NOT NULL,
	"reference" varchar(100),
	"category" "finance_category" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_auto_transaction" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"deleted_at" timestamp,
	"account_id" char(16) NOT NULL,
	"amount" bigint DEFAULT 0 NOT NULL,
	"reference" varchar(100),
	"category" "finance_category" NOT NULL,
	"exec_interval" integer NOT NULL,
	"exec_on" integer NOT NULL,
	"last_exec" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "finance_account" ADD CONSTRAINT "finance_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_transaction" ADD CONSTRAINT "finance_transaction_account_id_finance_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."finance_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_auto_transaction" ADD CONSTRAINT "finance_auto_transaction_account_id_finance_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."finance_account"("id") ON DELETE cascade ON UPDATE no action;