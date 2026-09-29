import { PrismaClient } from "@prisma/client";
import { ingestNormalizedAd } from "../src/ingestion/service";

const db = new PrismaClient();

const demoAds = [
  {
    platform: "META", externalId: "demo_meta_001", projectSlugs: ["cee"], matchedKeywords: ["pompe à chaleur", "diagnostic"],
    advertiser: { externalId: "demo_helios", name: "Helios Habitat DEMO", country: "FR" },
    primaryText: "Donnée de démonstration : découvrez le diagnostic énergétique offert.",
    headline: "Diagnostic énergétique offert — DEMO", callToAction: "En savoir plus", active: true, country: "FR", language: "fr",
    creative: [{ externalId: "demo_creative_001", type: "IMAGE", sourceUrl: "https://demo.invalid/creative-001.jpg", thumbnailUrl: "https://demo.invalid/creative-001-thumb.jpg", width: 1080, height: 1350 }],
    publicMetrics: { impressionsLower: 1000, impressionsUpper: 2500, currency: "EUR", metadata: { demo: true } },
    rawPayload: { demo: true, source: "seed" },
  },
  {
    platform: "TIKTOK", externalId: "demo_tiktok_001", projectSlugs: ["auryel"], matchedKeywords: ["routine"],
    advertiser: { externalId: "demo_nurture", name: "Nurture Club DEMO", country: "FR" },
    primaryText: "Donnée de démonstration : un rituel simple pour démarrer la journée.",
    headline: "Le rituel qui change tout — DEMO", callToAction: "Découvrir", active: true, country: "FR", language: "fr",
    creative: [{ externalId: "demo_creative_002", type: "VIDEO", sourceUrl: "https://demo.invalid/creative-002.mp4", thumbnailUrl: "https://demo.invalid/creative-002-thumb.jpg", width: 1080, height: 1920, durationSeconds: 23 }],
    rawPayload: { demo: true, source: "seed" },
  },
  {
    platform: "META", externalId: "demo_meta_002", projectSlugs: ["feaseweb"], matchedKeywords: ["lancement"],
    advertiser: { externalId: "demo_studio_nova", name: "Studio Nova DEMO", country: "BE" },
    primaryText: "Donnée de démonstration : une méthode claire pour lancer un projet.",
    headline: "Lancez votre projet avec méthode — DEMO", callToAction: "S'inscrire", active: true, country: "BE", language: "fr",
    creative: [{ externalId: "demo_creative_003", type: "IMAGE", sourceUrl: "https://demo.invalid/creative-003.jpg", thumbnailUrl: "https://demo.invalid/creative-003-thumb.jpg", width: 1080, height: 1080 }],
    rawPayload: { demo: true, source: "seed" },
  },
] as const;

async function main() {
  const projects = [
    { slug: "auryel", name: "Auryel", description: "Projet publicitaire Auryel" },
    { slug: "cee-ssc-pac", name: "CEE / SSC / PAC", description: "Projet rénovation énergétique" },
    { slug: "feaseweb", name: "Feaseweb", description: "Projets clients Feaseweb" },
  ];
  for (const project of projects) await db.project.upsert({ where: { slug: project.slug }, create: project, update: { name: project.name, description: project.description, active: true } });

  const cee = await db.project.findUniqueOrThrow({ where: { slug: "cee-ssc-pac" } });
  const aur = await db.project.findUniqueOrThrow({ where: { slug: "auryel" } });
  const feaseweb = await db.project.findUniqueOrThrow({ where: { slug: "feaseweb" } });
  await db.watchlist.createMany({ data: [
    { projectId: cee.id, type: "KEYWORD", query: "pompe à chaleur", platform: "META", country: "FR" },
    { projectId: aur.id, type: "KEYWORD", query: "routine énergie", platform: "TIKTOK", country: "FR" },
    { projectId: feaseweb.id, type: "ADVERTISER", query: "Studio Nova DEMO", platform: "META", country: "BE" },
  ], skipDuplicates: true });
  for (const ad of demoAds) await ingestNormalizedAd(db, { ...ad, projectSlugs: ad.projectSlugs.map(slug => slug === "cee" ? "cee-ssc-pac" : slug) });

  const savedAd = await db.ad.findUniqueOrThrow({ where: { platform_externalId: { platform: "META", externalId: "demo_meta_001" } } });
  await db.swipeFileItem.upsert({ where: { projectId_adId: { projectId: cee.id, adId: savedAd.id } }, create: { projectId: cee.id, adId: savedAd.id, notes: "DEMO : garder l'angle diagnostic offert.", tags: ["DEMO", "preuve"] }, update: { notes: "DEMO : garder l'angle diagnostic offert.", tags: ["DEMO", "preuve"] } });
  console.log("Demo seed completed.");
}

main().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
