-- AlterTable
ALTER TABLE "AnalyticsEvent" ADD COLUMN     "duplicateOfId" TEXT,
ADD COLUMN     "isReportable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "qualityReason" TEXT;

-- CreateIndex
CREATE INDEX "AnalyticsEvent_isReportable_eventName_occurredAt_idx" ON "AnalyticsEvent"("isReportable", "eventName", "occurredAt");
