import type { NextConfig } from "next";

/** Render Nest origin used when Vercel omits API_PROXY_TARGET. */
const DEFAULT_RENDER_ORIGIN = "https://ride-share-nestjs.onrender.com";

const onVercel = process.env.VERCEL === "1";

// Same-origin /v1/api on Vercel so Lax cookies stick to the frontend host.
const apiProxyTarget = (
  process.env.API_PROXY_TARGET || (onVercel ? DEFAULT_RENDER_ORIGIN : "")
).replace(/\/$/, "");

const browserApiUrl = onVercel
  ? "/v1/api"
  : process.env.NEXT_PUBLIC_API_URL;
const serverApiUrl =
  process.env.API_URL ||
  (onVercel ? `${DEFAULT_RENDER_ORIGIN}/v1/api` : undefined);

function hostnameFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const remoteHosts = new Set(["picsum.photos", "randomuser.me"]);
const proxyHost = hostnameFromUrl(apiProxyTarget);
if (proxyHost) remoteHosts.add(proxyHost);
const apiHost = hostnameFromUrl(serverApiUrl);
if (apiHost) remoteHosts.add(apiHost);

const nextConfig: NextConfig = {
  // Override build-time public URL when Vercel still has an absolute Render URL.
  env: {
    ...(browserApiUrl ? { NEXT_PUBLIC_API_URL: browserApiUrl } : {}),
    ...(serverApiUrl ? { API_URL: serverApiUrl } : {}),
  },
  images: {
    remotePatterns: [...remoteHosts].map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  async rewrites() {
    if (!apiProxyTarget) return [];
    return [
      {
        source: "/v1/api/:path*",
        destination: `${apiProxyTarget}/v1/api/:path*`,
      },
    ];
  },
  reactCompiler: true,
};

export default nextConfig;
