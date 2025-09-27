// Simple client-side availability store with polling support
// In real apps, replace with API calls.

const STORAGE_KEY = "pg-availability";

export type AvailabilityMap = Record<string, number>;

function readStore(): AvailabilityMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AvailabilityMap) : {};
  } catch {
    return {};
  }
}

function writeStore(data: AvailabilityMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAvailability(listingId: string, fallback?: number): number {
  const store = readStore();
  const val = store[listingId];
  if (typeof val === "number") return val;
  if (typeof fallback === "number") {
    store[listingId] = fallback;
    writeStore(store);
    return fallback;
  }
  return 0;
}

export function setAvailability(listingId: string, value: number) {
  const store = readStore();
  store[listingId] = Math.max(0, Math.floor(value));
  writeStore(store);
}

export function decrementAvailability(listingId: string, n = 1) {
  const current = getAvailability(listingId, 0);
  setAvailability(listingId, Math.max(0, current - Math.max(1, Math.floor(n))));
}

export function computeInitialAvailability(listingData: any): number {
  const configs = Array.isArray(listingData?.roomConfigs) ? listingData.roomConfigs : [];
  return configs.reduce((sum: number, cfg: any) => sum + Number(cfg?.bedsAvailable ?? 0), 0);
}
