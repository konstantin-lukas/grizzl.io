CREATE TABLE "finance_account" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"user_id" char(16) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"title" varchar(100) NOT NULL,
	"currency" char(3) NOT NULL,
	"balance" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_transaction" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" char(16) NOT NULL,
	"amount" bigint NOT NULL,
	"reference" varchar(100),
	"category_id" char(16) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_auto_transaction" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"account_id" char(16) NOT NULL,
	"amount" bigint NOT NULL,
	"reference" varchar(100),
	"category_id" char(16) NOT NULL,
	"exec_interval" integer NOT NULL,
	"exec_on" integer NOT NULL,
	"last_exec" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "finance_category" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"account_id" char(16) NOT NULL,
	"display_name" varchar(100) NOT NULL,
	"normalized_name" varchar(100) NOT NULL,
	"icon" varchar(100) NOT NULL,
	CONSTRAINT "finance_category_normalizedName_unique" UNIQUE("normalized_name")
);
--> statement-breakpoint
ALTER TABLE "timer" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "timer" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "timer" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "finance_account" ADD CONSTRAINT "finance_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_transaction" ADD CONSTRAINT "finance_transaction_account_id_finance_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."finance_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_transaction" ADD CONSTRAINT "finance_transaction_category_id_finance_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."finance_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_auto_transaction" ADD CONSTRAINT "finance_auto_transaction_account_id_finance_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."finance_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_auto_transaction" ADD CONSTRAINT "finance_auto_transaction_category_id_finance_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."finance_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_category" ADD CONSTRAINT "finance_category_account_id_finance_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."finance_account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

CREATE OR REPLACE FUNCTION delete_orphaned_finance_category()
    RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM "finance_transaction" WHERE "category_id" = OLD."category_id"
    )
        AND NOT EXISTS (
            SELECT 1 FROM "finance_auto_transaction" WHERE "category_id" = OLD."category_id"
        ) THEN
        DELETE FROM "finance_category" WHERE "id" = OLD."category_id";
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint

CREATE TRIGGER trg_delete_orphaned_category_from_transaction
    AFTER DELETE ON "finance_transaction"
    FOR EACH ROW
    WHEN (OLD."category_id" IS NOT NULL)
EXECUTE FUNCTION delete_orphaned_finance_category();
--> statement-breakpoint

CREATE TRIGGER trg_delete_orphaned_category_from_auto_transaction
    AFTER DELETE ON "finance_auto_transaction"
    FOR EACH ROW
    WHEN (OLD."category_id" IS NOT NULL)
EXECUTE FUNCTION delete_orphaned_finance_category();