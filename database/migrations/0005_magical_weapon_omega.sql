CREATE TABLE "todo_list" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"user_id" char(16) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"icon" varchar(100) NOT NULL,
	"title" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todo_list_item" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"text" varchar(200) NOT NULL,
	"list_id" char(16) NOT NULL,
	"index" integer,
	"scheduled_for" date,
	CONSTRAINT "todo_list_item_listId_text_unique" UNIQUE("list_id","text"),
	CONSTRAINT "todo_list_item_listId_index_unique" UNIQUE("list_id","index")
);
--> statement-breakpoint
CREATE TABLE "todo_preset" (
	"id" char(16) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" varchar(100) NOT NULL,
	"list_id" char(16) NOT NULL,
	"items" varchar(200)[] DEFAULT ARRAY[]::varchar[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "todo_list" ADD CONSTRAINT "todo_list_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_list_item" ADD CONSTRAINT "todo_list_item_list_id_todo_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."todo_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todo_preset" ADD CONSTRAINT "todo_preset_list_id_todo_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."todo_list"("id") ON DELETE cascade ON UPDATE no action;