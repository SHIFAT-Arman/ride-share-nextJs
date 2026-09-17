/** Resolve a profile/media path against the public API base. */
export function pictureSrc(url: string | null) {
  if (!url) return undefined;
  if (url.startsWith("http") || url.startsWith("blob:")) return url;
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}
