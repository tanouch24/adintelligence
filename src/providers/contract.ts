import type { NormalizedAd } from "@/domain/normalized-ad";

export interface AdProvider<TRaw = unknown> {
  readonly platform: NormalizedAd["platform"];
  searchAds(criteria: Record<string, string | number | boolean | undefined>): Promise<TRaw[]>;
  fetchAd(externalId: string): Promise<TRaw | null>;
  normalizeAd(raw: TRaw): unknown;
}

export async function normalizeProviderAd<TRaw>(provider: AdProvider<TRaw>, raw: TRaw): Promise<NormalizedAd> {
  const { validateNormalizedAd } = await import("@/domain/normalized-ad");
  return validateNormalizedAd(provider.normalizeAd(raw));
}
