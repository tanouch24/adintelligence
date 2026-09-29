import { NextResponse } from "next/server";
import { prisma } from "@/data/db/prisma";
import { AdsRepository } from "@/data/repositories/ads-repository";

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  const projectId = new URL(request.url).searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "projectId is required." }, { status: 400 });
  try {
    const ads = await new AdsRepository(prisma).listByProject(projectId);
    const data = ads.map(ad => ({
      id: ad.id,
      platform: ad.platform,
      externalId: ad.externalId,
      advertiser: ad.advertiser,
      primaryText: ad.primaryText,
      headline: ad.headline,
      description: ad.description,
      callToAction: ad.callToAction,
      landingPageUrl: ad.landingPageUrl,
      firstSeenAt: ad.firstSeenAt,
      lastSeenAt: ad.lastSeenAt,
      active: ad.active,
      country: ad.country,
      language: ad.language,
      creatives: ad.creatives,
      signalScores: ad.signalScores,
    }));
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Unable to read ads." }, { status: 503 });
  }
}
