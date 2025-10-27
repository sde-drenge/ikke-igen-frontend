import { headers } from "next/headers";

import { RateLimitError } from "./errors";

const PRUNE_INTERVAL = 60 * 1000; // 1 minute

const trackers = new Map<
  string,
  {
    count: number;
    expiresAt: number;
  }
>();

function pruneTrackers() {
  const now = Date.now();

  for (const [key, value] of trackers.entries()) {
    if (value.expiresAt < now) {
      trackers.delete(key);
    }
  }
}

setInterval(pruneTrackers, PRUNE_INTERVAL);

export async function rateLimitByIp({
  key = "global",
  limit = 1,
  window = 10_000,
}: {
  key: string;
  limit: number;
  window: number;
}) {
  const ip = getIp();

  if (!ip) {
    throw new RateLimitError();
  }

  await rateLimitByKey({
    key: `${ip}-${key}`,
    limit,
    window,
  });
}

async function rateLimitByKey({
  key = "global",
  limit = 1,
  window = 10_000,
}: {
  key: string;
  limit: number;
  window: number;
}) {
  const tracker = trackers.get(key) || { count: 0, expiresAt: 0 };

  if (tracker.expiresAt < Date.now()) {
    tracker.count = 0;
    tracker.expiresAt = Date.now() + window;
  }

  tracker.count++;

  if (tracker.count > limit) {
    throw new RateLimitError();
  }

  trackers.set(key, tracker);
}

async function getIp(): Promise<string | undefined> {
  const awaitedHeaders = await headers();
  const forwardedFor = awaitedHeaders.get("x-forwarded-for");
  const realIp = awaitedHeaders.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return undefined;
}
