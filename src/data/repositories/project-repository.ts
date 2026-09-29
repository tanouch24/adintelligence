import type { Prisma, PrismaClient } from "@prisma/client";

export class ProjectRepository {
  constructor(private readonly db: PrismaClient) {}

  listActive() {
    return this.db.project.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  }

  findBySlug(slug: string) {
    return this.db.project.findUnique({ where: { slug } });
  }

  create(input: Prisma.ProjectCreateInput) {
    return this.db.project.create({ data: input });
  }
}
