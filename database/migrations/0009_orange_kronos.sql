CREATE TABLE "todo_list_item" (
	"id" char(16) NOT NULL,
	"text" varchar(200) NOT NULL,
	"list_id" char(16) NOT NULL,
	"index" integer,
	"scheduled_for" date,
	CONSTRAINT "todo_list_item_list_id_id_pk" PRIMARY KEY("list_id","id"),
	CONSTRAINT "todo_list_item_listId_index_unique" UNIQUE("list_id","index")
);
--> statement-breakpoint
ALTER TABLE "todo_list_item" ADD CONSTRAINT "todo_list_item_list_id_todo_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."todo_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "todo_list_item_list_id_text_index" ON "todo_list_item" USING btree ("list_id","text") WHERE "todo_list_item"."index" IS NULL;

--> statement-breakpoint
ALTER TABLE "todo_list_item"
    DROP CONSTRAINT "todo_list_item_listId_index_unique";

ALTER TABLE "todo_list_item"
    ADD CONSTRAINT "todo_list_item_listId_index_unique"
        UNIQUE ("list_id", "index")
            DEFERRABLE INITIALLY DEFERRED;