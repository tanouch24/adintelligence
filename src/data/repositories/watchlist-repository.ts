import type { Prisma, PrismaClient } from "@prisma/client";

export class WatchlistRepository {
  constructor(private readonly db: PrismaClient) {}

  listActive(projectId: string) {
    return this.db.watchlist.findMany({ where: { projectId, active: true }, orderBy: { updatedAt: "desc" } });
  }

  create(input: Prisma.WatchlistCreateInput) {
    return this.db.watchlist.create({ data: input });
  }
}
