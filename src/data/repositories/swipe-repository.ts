import type { PrismaClient } from "@prisma/client";

export class SwipeRepository {
  constructor(private readonly db: PrismaClient) {}

  list(projectId: string) {
    return this.db.swipeFileItem.findMany({ where: { projectId }, include: { ad: { include: { advertiser: true, creatives: true } } }, orderBy: { createdAt: "desc" } });
  }

  save(input: { projectId: string; adId: string; notes?: string | null; tags: string[] }) {
    return this.db.swipeFileItem.upsert({
      where: { projectId_adId: { projectId: input.projectId, adId: input.adId } },
      create: { project: { connect: { id: input.projectId } }, ad: { connect: { id: input.adId } }, notes: input.notes, tags: input.tags },
      update: { notes: input.notes, tags: input.tags },
    });
  }
}
