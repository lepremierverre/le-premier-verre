-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CellarBottle" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'wine',
    "userId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "purchasePrice" DOUBLE PRECISION,
    "purchaseDate" TIMESTAMP(3),
    "location" TEXT,
    "drinkingWindow" TEXT,
    "personalNote" TEXT,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CellarBottle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopProduct" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'cad',
    "image" TEXT,
    "category" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "inventory" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "clientEventId" TEXT,
    "eventName" TEXT NOT NULL,
    "eventVersion" INTEGER NOT NULL DEFAULT 1,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clerkUserId" TEXT,
    "sessionId" TEXT,
    "isAuthenticated" BOOLEAN NOT NULL DEFAULT false,
    "pagePath" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "contentId" TEXT,
    "contentType" TEXT,
    "contentSlug" TEXT,
    "producerId" TEXT,
    "producerSlug" TEXT,
    "beverageType" TEXT,
    "country" TEXT,
    "province" TEXT,
    "region" TEXT,
    "isQuebec" BOOLEAN,
    "price" DOUBLE PRECISION,
    "priceBand" TEXT,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "sourceSlug" TEXT,
    "recommendationId" TEXT,
    "recommendationReason" TEXT,
    "destinationType" TEXT,
    "destinationId" TEXT,
    "destinationUrl" TEXT,
    "searchQuery" TEXT,
    "filterName" TEXT,
    "filterValue" TEXT,
    "metadata" JSONB,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CellarBottle_contentId_idx" ON "CellarBottle"("contentId");

-- CreateIndex
CREATE INDEX "CellarBottle_contentType_idx" ON "CellarBottle"("contentType");

-- CreateIndex
CREATE INDEX "CellarBottle_userId_idx" ON "CellarBottle"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopProduct_slug_key" ON "ShopProduct"("slug");

-- CreateIndex
CREATE INDEX "UsageEvent_userId_idx" ON "UsageEvent"("userId");

-- CreateIndex
CREATE INDEX "UsageEvent_feature_idx" ON "UsageEvent"("feature");

-- CreateIndex
CREATE INDEX "UsageEvent_createdAt_idx" ON "UsageEvent"("createdAt");

-- CreateIndex
CREATE INDEX "UsageEvent_userId_feature_createdAt_idx" ON "UsageEvent"("userId", "feature", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsEvent_clientEventId_key" ON "AnalyticsEvent"("clientEventId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_occurredAt_idx" ON "AnalyticsEvent"("eventName", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_contentId_occurredAt_idx" ON "AnalyticsEvent"("contentId", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_producerId_occurredAt_idx" ON "AnalyticsEvent"("producerId", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_clerkUserId_occurredAt_idx" ON "AnalyticsEvent"("clerkUserId", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_occurredAt_idx" ON "AnalyticsEvent"("sessionId", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_isQuebec_occurredAt_idx" ON "AnalyticsEvent"("isQuebec", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_beverageType_occurredAt_idx" ON "AnalyticsEvent"("beverageType", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sourceType_occurredAt_idx" ON "AnalyticsEvent"("sourceType", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_recommendationId_occurredAt_idx" ON "AnalyticsEvent"("recommendationId", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_utmCampaign_occurredAt_idx" ON "AnalyticsEvent"("utmCampaign", "occurredAt");

-- AddForeignKey
ALTER TABLE "CellarBottle" ADD CONSTRAINT "CellarBottle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
