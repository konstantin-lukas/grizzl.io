-- Custom SQL migration file, put your code below! --
ALTER TABLE "todo_list_item"
    DROP CONSTRAINT "todo_list_item_listId_index_unique";

ALTER TABLE "todo_list_item"
    ADD CONSTRAINT "todo_list_item_listId_index_unique"
        UNIQUE ("list_id", "index")
            DEFERRABLE INITIALLY IMMEDIATE;