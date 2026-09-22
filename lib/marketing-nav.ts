export function dashboardPathForRole(role: string): string {
  if (role === "admin") return "/portal/admin/dashboard";
  if (role === "rider") return "/portal/rider/dashboard";
  if (role === "driver") return "/portal/driver/dashboard";
  return "/login";
}

export function marketingNavCta(
  session: { role: string; email: string } | null,
  profileName?: string | null,
): { label: string; href: string } {
  if (!session) return { label: "Login", href: "/login" };
  const fallback = session.email.split("@")[0] || "Account";
  return {
    label: profileName?.trim() || fallback,
    href: dashboardPathForRole(session.role),
  };
}

export function portalLinksForSession(dashboardHref: string | null) {
  if (!dashboardHref) {
    return [
      { label: "Login", ariaLabel: "Login", href: "/login" },
      { label: "Sign Up", ariaLabel: "Sign Up", href: "/register" },
    ];
  }
  return [{ label: "Dashboard", ariaLabel: "Dashboard", href: dashboardHref }];
}
