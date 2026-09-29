-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('META', 'TIKTOK', 'GOOGLE', 'YOUTUBE', 'LINKEDIN', 'OTHER');

-- CreateEnum
CREATE TYPE "CreativeType" AS ENUM ('IMAGE', 'VIDEO', 'CAROUSEL', 'OTHER');

-- CreateEnum
CREATE TYPE "WatchlistType" AS ENUM ('KEYWORD', 'ADVERTISER');

-- CreateEnum
CREATE TYPE "GeneratedCreativeStatus" AS ENUM ('DRAFT', 'GENERATING', 'READY', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Advertiser" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "handle" TEXT,
    "website" TEXT,
    "country" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Advertiser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ad" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "externalId" TEXT NOT NULL,
    "advertiserId" TEXT NOT NULL,
    "primaryText" TEXT,
    "headline" TEXT,
    "description" TEXT,
    "callToAction" TEXT,
    "landingPageUrl" TEXT,
    "sourceUrl" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "platformStartedAt" TIMESTAMP(3),
    "platformEndedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "country" TEXT,
    "language" TEXT,
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Creative" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "externalId" TEXT,
    "type" "CreativeType" NOT NULL,
    "sourceUrl" TEXT,
    "thumbnailUrl" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" INTEGER,
    "mimeType" TEXT,
    "checksum" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAd" (
    "projectId" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "relevanceScore" DOUBLE PRECISION,
    "matchedKeywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAd_pkey" PRIMARY KEY ("projectId","adId")
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "WatchlistType" NOT NULL,
    "query" TEXT NOT NULL,
    "platform" "Platform",
    "country" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SwipeFileItem" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "notes" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SwipeFileItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "hook" TEXT,
    "angle" TEXT,
    "problem" TEXT,
    "promise" TEXT,
    "offer" TEXT,
    "proof" TEXT,
    "callToActionAnalysis" TEXT,
    "targetAudience" TEXT,
    "visualStyle" TEXT,
    "tags" TEXT[],
    "notes" TEXT,
    "model" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalScore" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "longevitySignal" INTEGER NOT NULL,
    "reachSignal" INTEGER,
    "recurrenceSignal" INTEGER NOT NULL,
    "creativeVariationSignal" INTEGER NOT NULL,
    "freshnessSignal" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "explanation" TEXT NOT NULL,
    "algorithmVersion" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignalScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicMetrics" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "impressionsLower" INTEGER,
    "impressionsUpper" INTEGER,
    "reachLower" INTEGER,
    "reachUpper" INTEGER,
    "spendLower" DECIMAL(12,2),
    "spendUpper" DECIMAL(12,2),
    "currency" TEXT,
    "metadata" JSONB,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdObservation" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL,
    "publicMetrics" JSONB,
    "metadata" JSONB,

    CONSTRAINT "AdObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedCreative" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sourceAdId" TEXT,
    "type" "CreativeType" NOT NULL,
    "concept" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "assetUrl" TEXT,
    "status" "GeneratedCreativeStatus" NOT NULL DEFAULT 'DRAFT',
    "model" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedCreative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnAdAccount" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnAdAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnCampaign" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnAdSet" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnAdSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnAd" (
    "id" TEXT NOT NULL,
    "adSetId" TEXT NOT NULL,
    "sourceAdId" TEXT,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnAd_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnCampaignPerformance" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "spend" DECIMAL(12,2),
    "impressions" INTEGER,
    "reach" INTEGER,
    "clicks" INTEGER,
    "ctr" DOUBLE PRECISION,
    "cpc" DECIMAL(12,4),
    "cpm" DECIMAL(12,4),
    "leads" INTEGER,
    "cpl" DECIMAL(12,4),
    "conversions" INTEGER,
    "cpa" DECIMAL(12,4),
    "revenue" DECIMAL(12,2),
    "roas" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnCampaignPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Advertiser_platform_name_idx" ON "Advertiser"("platform", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Advertiser_platform_externalId_key" ON "Advertiser"("platform", "externalId");

-- CreateIndex
CREATE INDEX "Ad_advertiserId_idx" ON "Ad"("advertiserId");

-- CreateIndex
CREATE INDEX "Ad_firstSeenAt_idx" ON "Ad"("firstSeenAt");

-- CreateIndex
CREATE INDEX "Ad_lastSeenAt_idx" ON "Ad"("lastSeenAt");

-- CreateIndex
CREATE INDEX "Ad_active_idx" ON "Ad"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Ad_platform_externalId_key" ON "Ad"("platform", "externalId");

-- CreateIndex
CREATE INDEX "Creative_adId_idx" ON "Creative"("adId");

-- CreateIndex
CREATE UNIQUE INDEX "Creative_adId_externalId_key" ON "Creative"("adId", "externalId");

-- CreateIndex
CREATE INDEX "ProjectAd_adId_idx" ON "ProjectAd"("adId");

-- CreateIndex
CREATE INDEX "ProjectAd_projectId_createdAt_idx" ON "ProjectAd"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "Watchlist_projectId_active_idx" ON "Watchlist"("projectId", "active");

-- CreateIndex
CREATE INDEX "Watchlist_type_platform_idx" ON "Watchlist"("type", "platform");

-- CreateIndex
CREATE INDEX "SwipeFileItem_projectId_createdAt_idx" ON "SwipeFileItem"("projectId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SwipeFileItem_projectId_adId_key" ON "SwipeFileItem"("projectId", "adId");

-- CreateIndex
CREATE INDEX "Analysis_adId_createdAt_idx" ON "Analysis"("adId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_adId_version_key" ON "Analysis"("adId", "version");

-- CreateIndex
CREATE INDEX "SignalScore_adId_calculatedAt_idx" ON "SignalScore"("adId", "calculatedAt");

-- CreateIndex
CREATE INDEX "SignalScore_score_idx" ON "SignalScore"("score");

-- CreateIndex
CREATE INDEX "PublicMetrics_adId_capturedAt_idx" ON "PublicMetrics"("adId", "capturedAt");

-- CreateIndex
CREATE INDEX "AdObservation_adId_active_idx" ON "AdObservation"("adId", "active");

-- CreateIndex
CREATE INDEX "AdObservation_observedAt_idx" ON "AdObservation"("observedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdObservation_adId_observedAt_key" ON "AdObservation"("adId", "observedAt");

-- CreateIndex
CREATE INDEX "GeneratedCreative_projectId_status_idx" ON "GeneratedCreative"("projectId", "status");

-- CreateIndex
CREATE INDEX "GeneratedCreative_sourceAdId_idx" ON "GeneratedCreative"("sourceAdId");

-- CreateIndex
CREATE INDEX "OwnAdAccount_projectId_platform_idx" ON "OwnAdAccount"("projectId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "OwnAdAccount_platform_externalId_key" ON "OwnAdAccount"("platform", "externalId");

-- CreateIndex
CREATE INDEX "OwnCampaign_projectId_name_idx" ON "OwnCampaign"("projectId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "OwnCampaign_accountId_externalId_key" ON "OwnCampaign"("accountId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "OwnAdSet_campaignId_externalId_key" ON "OwnAdSet"("campaignId", "externalId");

-- CreateIndex
CREATE INDEX "OwnAd_sourceAdId_idx" ON "OwnAd"("sourceAdId");

-- CreateIndex
CREATE UNIQUE INDEX "OwnAd_adSetId_externalId_key" ON "OwnAd"("adSetId", "externalId");

-- CreateIndex
CREATE INDEX "OwnCampaignPerformance_projectId_date_idx" ON "OwnCampaignPerformance"("projectId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "OwnCampaignPerformance_campaignId_date_key" ON "OwnCampaignPerformance"("campaignId", "date");

-- AddForeignKey
ALTER TABLE "Ad" ADD CONSTRAINT "Ad_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "Advertiser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creative" ADD CONSTRAINT "Creative_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAd" ADD CONSTRAINT "ProjectAd_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAd" ADD CONSTRAINT "ProjectAd_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwipeFileItem" ADD CONSTRAINT "SwipeFileItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SwipeFileItem" ADD CONSTRAINT "SwipeFileItem_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignalScore" ADD CONSTRAINT "SignalScore_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicMetrics" ADD CONSTRAINT "PublicMetrics_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdObservation" ADD CONSTRAINT "AdObservation_adId_fkey" FOREIGN KEY ("adId") REFERENCES "Ad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedCreative" ADD CONSTRAINT "GeneratedCreative_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedCreative" ADD CONSTRAINT "GeneratedCreative_sourceAdId_fkey" FOREIGN KEY ("sourceAdId") REFERENCES "Ad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnAdAccount" ADD CONSTRAINT "OwnAdAccount_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnCampaign" ADD CONSTRAINT "OwnCampaign_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "OwnAdAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnCampaign" ADD CONSTRAINT "OwnCampaign_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnAdSet" ADD CONSTRAINT "OwnAdSet_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "OwnCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnAd" ADD CONSTRAINT "OwnAd_adSetId_fkey" FOREIGN KEY ("adSetId") REFERENCES "OwnAdSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnAd" ADD CONSTRAINT "OwnAd_sourceAdId_fkey" FOREIGN KEY ("sourceAdId") REFERENCES "Ad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnCampaignPerformance" ADD CONSTRAINT "OwnCampaignPerformance_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnCampaignPerformance" ADD CONSTRAINT "OwnCampaignPerformance_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "OwnCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
