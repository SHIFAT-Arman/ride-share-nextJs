import assert from "node:assert/strict";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";
import api from "./axios.ts";
import { marketingNavCta, portalLinksForSession } from "./marketing-nav.ts";

function setPath(pathname: string) {
  let href = "http://localhost" + pathname;
  const location: { pathname: string; href?: string } = { pathname };
  Object.defineProperty(location, "href", {
    configurable: true,
    get() {
      return href;
    },
    set(v: string) {
      href = String(v);
    },
  });
  (globalThis as unknown as { window: { location: typeof location } }).window = {
    location,
  };
  return () => href;
}

function fail(config: InternalAxiosRequestConfig, status: number) {
  return Promise.reject(
    new AxiosError("fail", "ERR_BAD_REQUEST", config, null, {
      status,
      statusText: "err",
      data: {},
      headers: {},
      config,
    }),
  );
}

function ok(config: InternalAxiosRequestConfig, data: object) {
  return Promise.resolve({
    status: 200,
    statusText: "OK",
    data,
    headers: {},
    config,
  });
}

type Mode =
  | "all-401"
  | "refresh-ok-me-ok"
  | "refresh-ok-me-401";

async function probe(mode: Mode, skip: boolean) {
  const calls: string[] = [];
  api.defaults.adapter = async (config) => {
    const url = String(config.url);
    calls.push(url);
    if (url.includes("/auth/refresh")) {
      if (mode === "all-401") return fail(config, 401);
      return ok(config, { message: "Refreshed" });
    }
    if (url.includes("/auth/logout")) return ok(config, { message: "Logged Out" });
    if (mode === "refresh-ok-me-ok" && config._retry) {
      return ok(config, { sub: "1", email: "jane@example.com", role: "rider" });
    }
    return fail(config, 401);
  };
  try {
    await api.get("/auth/me", skip ? { skipAuthRedirect: true } : undefined);
  } catch {
    // expected for 401 paths
  }
  return calls;
}

const loggedOut = marketingNavCta(null, null);
assert.equal(loggedOut.label, "Login");
assert.equal(loggedOut.href, "/login");

const named = marketingNavCta(
  { role: "rider", email: "jane@example.com" },
  "Jane Doe",
);
assert.equal(named.label, "Jane Doe");
assert.equal(named.href, "/portal/rider/dashboard");

const fallback = marketingNavCta(
  { role: "admin", email: "boss@example.com" },
  "  ",
);
assert.equal(fallback.label, "boss");
assert.equal(fallback.href, "/portal/admin/dashboard");

const loggedOutLinks = portalLinksForSession(null);
assert.deepEqual(
  loggedOutLinks.map((link) => link.label),
  ["Login", "Sign Up"],
);
const inLinks = portalLinksForSession("/portal/driver/dashboard");
assert.deepEqual(inLinks, [
  {
    label: "Dashboard",
    ariaLabel: "Dashboard",
    href: "/portal/driver/dashboard",
  },
]);

{
  const href = setPath("/");
  const calls = await probe("all-401", true);
  assert.equal(calls.includes("/auth/refresh"), true);
  assert.equal(calls.includes("/auth/logout"), false);
  assert.equal(href(), "http://localhost/");
}

{
  const href = setPath("/");
  const calls = await probe("all-401", false);
  assert.equal(calls.includes("/auth/logout"), true);
  assert.equal(href(), "/login");
}

{
  const href = setPath("/");
  const calls = await probe("refresh-ok-me-ok", true);
  assert.equal(calls.includes("/auth/refresh"), true);
  assert.equal(calls.includes("/auth/logout"), false);
  assert.equal(href(), "http://localhost/");
}

{
  const href = setPath("/");
  const calls = await probe("refresh-ok-me-401", true);
  assert.equal(calls.includes("/auth/logout"), false);
  assert.equal(href(), "http://localhost/");
}

{
  const href = setPath("/");
  const calls = await probe("refresh-ok-me-401", false);
  assert.equal(calls.includes("/auth/logout"), true);
  assert.equal(href(), "/login");
}

{
  const href = setPath("/book-a-ride");
  const calls: string[] = [];
  api.defaults.adapter = async (config) => {
    calls.push(String(config.url));
    return fail(config, 401);
  };
  await Promise.allSettled([
    api.get("/auth/me", { skipAuthRedirect: true }),
    api.get("/auth/me"),
  ]);
  const logouts = calls.filter((url) => url.includes("/auth/logout")).length;
  assert.equal(logouts, 1);
  assert.equal(href(), "/login");
}

console.log("marketing-nav.check ok");
