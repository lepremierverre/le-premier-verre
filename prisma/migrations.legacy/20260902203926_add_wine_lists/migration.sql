-- AlterTable
ALTER TABLE "wine_journal" ALTER COLUMN "id" DROP DEFAULT;

-- CreateTable
CREATE TABLE "wine_lists" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wine_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wine_list_items" (
    "id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "wine_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wine_list_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wine_lists_user_id_idx" ON "wine_lists"("user_id");

-- CreateIndex
CREATE INDEX "wine_list_items_list_id_idx" ON "wine_list_items"("list_id");

-- CreateIndex
CREATE INDEX "wine_list_items_wine_id_idx" ON "wine_list_items"("wine_id");

-- CreateIndex
CREATE UNIQUE INDEX "wine_list_items_list_id_wine_id_key" ON "wine_list_items"("list_id", "wine_id");

-- AddForeignKey
ALTER TABLE "wine_list_items" ADD CONSTRAINT "wine_list_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "wine_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
