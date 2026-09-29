import { Prisma, type PrismaClient } from "@prisma/client";
import { validateNormalizedAd, type NormalizedAd } from "@/domain/normalized-ad";

type Db = PrismaClient | Prisma.TransactionClient;
const json = (value: Record<string, unknown> | null | undefined) => value === null || value === undefined ? undefined : value as Prisma.InputJsonValue;

async function upsertAdvertiser(db: Db, input: NormalizedAd["advertiser"], platform: NormalizedAd["platform"]) {
  if (input.externalId) {
    return db.advertiser.upsert({
      where: { platform_externalId: { platform, externalId: input.externalId } },
      create: { platform, externalId: input.externalId, name: input.name, handle: input.handle, website: input.website, country: input.country, metadata: json(input.metadata) },
      update: { name: input.name, handle: input.handle, website: input.website, country: input.country, metadata: json(input.metadata) },
    });
  }
  const existing = await db.advertiser.findFirst({ where: { platform, name: input.name, country: input.country ?? undefined } });
  if (existing) return existing;
  return db.advertiser.create({ data: { platform, name: input.name, handle: input.handle, website: input.website, country: input.country, metadata: json(input.metadata) } });
}

async function upsertCreative(db: Db, adId: string, input: NormalizedAd["creative"][number]) {
  const existing = input.externalId
    ? await db.creative.findUnique({ where: { adId_externalId: { adId, externalId: input.externalId } } })
    : await db.creative.findFirst({ where: { adId, type: input.type, sourceUrl: input.sourceUrl ?? undefined } });
  const data = { externalId: input.externalId, type: input.type, sourceUrl: input.sourceUrl, thumbnailUrl: input.thumbnailUrl, width: input.width, height: input.height, durationSeconds: input.durationSeconds, mimeType: input.mimeType, checksum: input.checksum, metadata: json(input.metadata) };
  return existing ? db.creative.update({ where: { id: existing.id }, data }) : db.creative.create({ data: { ...data, adId } });
}

async function upsertNormalizedAd(db: Db, input: NormalizedAd) {
  const advertiser = await upsertAdvertiser(db, input.advertiser, input.platform);
  const ad = await db.ad.upsert({
    where: { platform_externalId: { platform: input.platform, externalId: input.externalId } },
    create: { platform: input.platform, externalId: input.externalId, advertiserId: advertiser.id, primaryText: input.primaryText, headline: input.headline, description: input.description, callToAction: input.callToAction, landingPageUrl: input.landingPageUrl, sourceUrl: input.sourceUrl, firstSeenAt: input.firstSeenAt, lastSeenAt: input.lastSeenAt, platformStartedAt: input.platformStartedAt, platformEndedAt: input.platformEndedAt, active: input.active, country: input.country, language: input.language, rawPayload: json(input.rawPayload) },
    update: { advertiserId: advertiser.id, primaryText: input.primaryText, headline: input.headline, description: input.description, callToAction: input.callToAction, landingPageUrl: input.landingPageUrl, sourceUrl: input.sourceUrl, lastSeenAt: input.lastSeenAt ?? new Date(), platformStartedAt: input.platformStartedAt, platformEndedAt: input.platformEndedAt, active: input.active, country: input.country, language: input.language, rawPayload: json(input.rawPayload) },
  });
  for (const creative of input.creative) await upsertCreative(db, ad.id, creative);
  for (const slug of input.projectSlugs) {
    const project = await db.project.findUnique({ where: { slug } });
    if (!project) throw new Error("Project not found for ingestion: " + slug);
    await db.projectAd.upsert({ where: { projectId_adId: { projectId: project.id, adId: ad.id } }, create: { projectId: project.id, adId: ad.id, relevanceScore: input.relevanceScore, matchedKeywords: input.matchedKeywords }, update: { relevanceScore: input.relevanceScore, matchedKeywords: input.matchedKeywords } });
  }
  const observationTime = input.observedAt ?? new Date();
  await db.adObservation.upsert({ where: { adId_observedAt: { adId: ad.id, observedAt: observationTime } }, create: { adId: ad.id, observedAt: observationTime, active: input.active, publicMetrics: json(input.publicMetrics), metadata: json(input.rawPayload) }, update: { active: input.active, publicMetrics: json(input.publicMetrics), metadata: json(input.rawPayload) } });
  if (input.publicMetrics) {
    await db.publicMetrics.create({ data: { adId: ad.id, impressionsLower: input.publicMetrics.impressionsLower, impressionsUpper: input.publicMetrics.impressionsUpper, reachLower: input.publicMetrics.reachLower, reachUpper: input.publicMetrics.reachUpper, spendLower: input.publicMetrics.spendLower, spendUpper: input.publicMetrics.spendUpper, currency: input.publicMetrics.currency, metadata: json(input.publicMetrics.metadata), capturedAt: observationTime } });
  }
  return ad;
}

export async function ingestNormalizedAd(db: PrismaClient, input: unknown) {
  const normalized = validateNormalizedAd(input);
  return db.$transaction(transaction => upsertNormalizedAd(transaction, normalized));
}
