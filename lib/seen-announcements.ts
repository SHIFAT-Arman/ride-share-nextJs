const MAX_SEEN = 100;

function keyFor(adminId: string) {
  return `admin-seen-announcements:${adminId}`;
}

export function getSeenIds(adminId: string): string[] {
  if (!adminId) return [];
  try {
    return JSON.parse(localStorage.getItem(keyFor(adminId)) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function markSeen(adminId: string, ids: string[]) {
  if (!adminId) return;
  const seen = [...new Set([...ids, ...getSeenIds(adminId)])].slice(0, MAX_SEEN);
  localStorage.setItem(keyFor(adminId), JSON.stringify(seen));
}
