import type { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

// Forward incoming request cookies (e.g. HttpOnly rs_access / rs_refresh) to backend API calls from RSC.
export async function serverAuthConfig(
  config: AxiosRequestConfig = {},
): Promise<AxiosRequestConfig> {
  const store = await cookies();
  const cookieHeader = store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (!cookieHeader) return config;

  return {
    ...config,
    headers: {
      ...(config.headers as Record<string, string> | undefined),
      Cookie: cookieHeader,
    },
  };
}
