import type { PrismaClient } from "@prisma/client";

export class AdsRepository {
  constructor(private readonly db: PrismaClient) {}

  listByProject(projectId: string, take = 50) {
    return this.db.ad.findMany({
      where: { projectAds: { some: { projectId } } },
      include: { advertiser: true, creatives: true, projectAds: true, signalScores: { orderBy: { calculatedAt: "desc" }, take: 1 } },
      orderBy: { lastSeenAt: "desc" },
      take,
    });
  }

  findByIdentity(platform: "META" | "TIKTOK" | "GOOGLE" | "YOUTUBE" | "LINKEDIN" | "OTHER", externalId: string) {
    return this.db.ad.findUnique({ where: { platform_externalId: { platform, externalId } } });
  }
}
