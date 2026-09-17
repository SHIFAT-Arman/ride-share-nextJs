import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/$/, "");

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
const apiHost = hostnameFromUrl(process.env.API_URL);
if (apiHost) remoteHosts.add(apiHost);

const nextConfig: NextConfig = {
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
