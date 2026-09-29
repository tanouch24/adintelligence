import { z } from "zod";

export const normalizedPlatformSchema = z.enum(["META", "TIKTOK", "GOOGLE", "YOUTUBE", "LINKEDIN", "OTHER"]);

const optionalNullableString = z.string().trim().min(1).nullable().optional();

export const normalizedAdSchema = z.object({
  platform: normalizedPlatformSchema,
  externalId: z.string().trim().min(1),
  advertiser: z.object({
    externalId: optionalNullableString,
    name: z.string().trim().min(1),
    handle: optionalNullableString,
    website: z.string().url().nullable().optional(),
    country: optionalNullableString,
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  }),
  primaryText: optionalNullableString,
  headline: optionalNullableString,
  description: optionalNullableString,
  callToAction: optionalNullableString,
  landingPageUrl: z.string().url().nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
  firstSeenAt: z.coerce.date().optional(),
  lastSeenAt: z.coerce.date().optional(),
  platformStartedAt: z.coerce.date().nullable().optional(),
  platformEndedAt: z.coerce.date().nullable().optional(),
  active: z.boolean().default(true),
  country: optionalNullableString,
  language: optionalNullableString,
  rawPayload: z.record(z.string(), z.unknown()).nullable().optional(),
  projectSlugs: z.array(z.string().trim().min(1)).default([]),
  matchedKeywords: z.array(z.string().trim().min(1)).default([]),
  relevanceScore: z.number().min(0).max(1).nullable().optional(),
  creative: z.array(z.object({
    externalId: optionalNullableString,
    type: z.enum(["IMAGE", "VIDEO", "CAROUSEL", "OTHER"]),
    sourceUrl: z.string().url().nullable().optional(),
    thumbnailUrl: z.string().url().nullable().optional(),
    width: z.number().int().positive().nullable().optional(),
    height: z.number().int().positive().nullable().optional(),
    durationSeconds: z.number().int().nonnegative().nullable().optional(),
    mimeType: optionalNullableString,
    checksum: optionalNullableString,
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  })).default([]),
  publicMetrics: z.object({
    impressionsLower: z.number().int().nonnegative().nullable().optional(),
    impressionsUpper: z.number().int().nonnegative().nullable().optional(),
    reachLower: z.number().int().nonnegative().nullable().optional(),
    reachUpper: z.number().int().nonnegative().nullable().optional(),
    spendLower: z.number().nonnegative().nullable().optional(),
    spendUpper: z.number().nonnegative().nullable().optional(),
    currency: z.string().length(3).nullable().optional(),
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  }).nullable().optional(),
  observedAt: z.coerce.date().optional(),
});

export type NormalizedAd = z.infer<typeof normalizedAdSchema>;

export function validateNormalizedAd(input: unknown): NormalizedAd {
  return normalizedAdSchema.parse(input);
}
