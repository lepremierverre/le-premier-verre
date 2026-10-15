CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS "wine_journal" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL,
  "wine_id" TEXT NOT NULL,
  "favorite" BOOLEAN NOT NULL DEFAULT false,
  "tasted" BOOLEAN NOT NULL DEFAULT false,
  "buy_again" BOOLEAN NOT NULL DEFAULT false,
  "gift" BOOLEAN NOT NULL DEFAULT false,
  "avoid" BOOLEAN NOT NULL DEFAULT false,
  "rating" INTEGER,
  "note" TEXT,
  "tasted_at" TIMESTAMPTZ,
  "location" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "wine_journal_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "wine_journal_rating_check"
    CHECK ("rating" IS NULL OR ("rating" >= 1 AND "rating" <= 5)),
  CONSTRAINT "wine_journal_user_id_wine_id_key"
    UNIQUE ("user_id", "wine_id")
);

CREATE INDEX IF NOT EXISTS "wine_journal_user_id_idx"
  ON "wine_journal" ("user_id");

CREATE INDEX IF NOT EXISTS "wine_journal_wine_id_idx"
  ON "wine_journal" ("wine_id");

CREATE OR REPLACE FUNCTION update_wine_journal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updated_at" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wine_journal_updated_at_trigger
  ON "wine_journal";

CREATE TRIGGER wine_journal_updated_at_trigger
BEFORE UPDATE ON "wine_journal"
FOR EACH ROW
EXECUTE FUNCTION update_wine_journal_updated_at();
