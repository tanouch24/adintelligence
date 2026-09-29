export type Platform = "meta" | "tiktok" | "google" | "youtube" | "linkedin" | "other";
export type CreativeFormat = "image" | "video" | "carousel";
export type AdStatus = "active" | "inactive";
export interface Project { id: string; name: string; accent: string }
export interface Advertiser { id: string; name: string; category: string; country: string }
export interface Creative { id: string; format: CreativeFormat; dimensions: { width: number; height: number }; durationSeconds?: number; thumbnailUrl: string; sourceUrl?: string }
export interface Ad { id: string; projectId: string; platform: Platform; advertiserId: string; externalId: string; primaryText: string; headline: string; cta: string; landingPage?: string; firstDetectedAt: string; lastDetectedAt: string; status: AdStatus; countries: string[]; creative: Creative; publicMetrics?: { impressions?: string; reactions?: string; comments?: string }; rawSourceData?: Record<string, unknown>; signalScore: number; tags: string[] }
export interface Watchlist { id: string; projectId: string; name: string; keywords: string[]; advertiserIds: string[]; active: boolean }
export interface Analysis { id: string; adId: string; hook?: string; angle?: string; problem?: string; promise?: string; offer?: string; proof?: string; cta?: string; audience?: string; style?: string; aiNotes?: string; tags: string[] }
export interface GeneratedCreative { id: string; projectId: string; sourceAdId?: string; concept: string; prompt?: string; format: CreativeFormat; version: number; status: "draft" | "generating" | "ready" | "archived" }
export interface OwnCampaignPerformance { id: string; projectId: string; campaignName: string; periodStart: string; periodEnd: string; spend?: number; impressions?: number; reach?: number; cpm?: number; clicks?: number; ctr?: number; cpc?: number; leads?: number; cpl?: number; conversions?: number; cpa?: number }
export const platforms: { id: Platform; label: string }[] = [
  { id: "meta", label: "Meta" }, { id: "tiktok", label: "TikTok" }, { id: "google", label: "Google" }, { id: "youtube", label: "YouTube" }, { id: "linkedin", label: "LinkedIn" }, { id: "other", label: "Other" },
];
