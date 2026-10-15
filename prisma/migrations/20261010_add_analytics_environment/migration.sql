-- AlterTable
ALTER TABLE "AnalyticsEvent" ADD COLUMN     "environment" TEXT NOT NULL DEFAULT 'development';

-- CreateIndex
CREATE INDEX "AnalyticsEvent_environment_occurredAt_idx" ON "AnalyticsEvent"("environment", "occurredAt");
