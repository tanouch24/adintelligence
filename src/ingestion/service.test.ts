import { describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "@prisma/client";
import { validateNormalizedAd } from "@/domain/normalized-ad";
import { ingestNormalizedAd } from "@/ingestion/service";
import { SwipeRepository } from "@/data/repositories/swipe-repository";

const input = {
  platform: "META",
  externalId: "meta-demo-1",
  advertiser: { externalId: "advertiser-demo-1", name: "Demo advertiser", country: "FR" },
  headline: "Demo headline",
  projectSlugs: ["cee-ssc-pac", "feaseweb"],
  matchedKeywords: ["diagnostic"],
  active: true,
  observedAt: "2026-09-29T10:00:00.000Z",
};

describe("normalized ad validation", () => {
  it("applies safe defaults and keeps provider payload behind the schema", () => {
    const parsed = validateNormalizedAd(input);
    expect(parsed.projectSlugs).toEqual(["cee-ssc-pac", "feaseweb"]);
    expect(parsed.creative).toEqual([]);
    expect(parsed.active).toBe(true);
    expect(() => validateNormalizedAd({ ...input, externalId: "" })).toThrow();
  });

  it("rejects invalid external URLs before persistence", () => {
    expect(() => validateNormalizedAd({
      ...input,
      landingPageUrl: "not-a-url",
    })).toThrow();
  });
});

describe("normalized ingestion contract", () => {
  it("uses identity upserts for the ad, projects and observation", async () => {
    const db = {
      $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) => callback(db)),
      advertiser: { upsert: vi.fn().mockResolvedValue({ id: "advertiser-1" }) },
      ad: { upsert: vi.fn().mockResolvedValue({ id: "ad-1" }) },
      creative: { findUnique: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
      project: { findUnique: vi.fn().mockResolvedValue({ id: "project-1" }) },
      projectAd: { upsert: vi.fn().mockResolvedValue({}) },
      adObservation: { upsert: vi.fn().mockResolvedValue({}) },
      publicMetrics: { create: vi.fn() },
    } as unknown as PrismaClient;

    await ingestNormalizedAd(db, input);
    await ingestNormalizedAd(db, input);

    expect(db.ad.upsert).toHaveBeenCalledTimes(2);
    expect(db.ad.upsert).toHaveBeenNthCalledWith(1, expect.objectContaining({
      where: { platform_externalId: { platform: "META", externalId: "meta-demo-1" } },
    }));
    expect(db.projectAd.upsert).toHaveBeenCalledTimes(4);
    expect(db.adObservation.upsert).toHaveBeenCalledTimes(2);
    expect(db.adObservation.upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { adId_observedAt: { adId: "ad-1", observedAt: new Date("2026-09-29T10:00:00.000Z") } },
    }));
  });
});

describe("swipe repository", () => {
  it("uses the project/ad compound identity to avoid duplicate saves", async () => {
    const upsert = vi.fn().mockResolvedValue({ id: "swipe-1" });
    const repository = new SwipeRepository({ swipeFileItem: { upsert } } as unknown as PrismaClient);
    await repository.save({ projectId: "project-1", adId: "ad-1", notes: "Demo", tags: ["DEMO"] });
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { projectId_adId: { projectId: "project-1", adId: "ad-1" } },
    }));
  });
});
