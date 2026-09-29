import { NextResponse } from "next/server";
import { prisma } from "@/data/db/prisma";
import { ProjectRepository } from "@/data/repositories/project-repository";

export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  try {
    const projects = await new ProjectRepository(prisma).listActive();
    return NextResponse.json({ data: projects });
  } catch {
    return NextResponse.json({ error: "Unable to read projects." }, { status: 503 });
  }
}
