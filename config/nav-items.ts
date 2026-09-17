import { LayoutDashboard, Megaphone, Users, type LucideIcon } from "lucide-react";
import type { UserRole } from "@/api/auth";
import type { CardNavItem } from "@/components/CardNav";

export type PortalNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const ADMIN_NAV: PortalNavItem[] = [
  {
    title: "Dashboard",
    href: "/portal/admin/dashboard",
    icon: LayoutDashboard,
  },
  { title: "Admins", href: "/portal/admin", icon: Users },
  {
    title: "Announcements",
    href: "/portal/admin/announcement",
    icon: Megaphone,
  },
];

const RIDER_NAV: PortalNavItem[] = [
  {
    title: "Dashboard",
    href: "/portal/rider/dashboard",
    icon: LayoutDashboard,
  },
];

const DRIVER_NAV: PortalNavItem[] = [
  {
    title: "Dashboard",
    href: "/portal/driver/dashboard",
    icon: LayoutDashboard,
  },
];

export function portalNavForRole(role: UserRole | ""): PortalNavItem[] {
  if (role === "admin") return ADMIN_NAV;
  if (role === "rider") return RIDER_NAV;
  if (role === "driver") return DRIVER_NAV;
  return [];
}

export function portalNavActive(
  pathname: string,
  href: string,
  nav: PortalNavItem[],
) {
  if (href === "/portal/admin") {
    const named = nav
      .filter((item) => item.href !== href)
      .map((item) => item.href);
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) &&
        !named.some((n) => pathname === n || pathname.startsWith(`${n}/`)) &&
        !pathname.endsWith("/profile"))
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Marketing site card nav (public website). */
export const navItems: CardNavItem[] = [
  {
    label: "About",
    bgColor: "#1B1722",
    textColor: "#fff",
    links: [
      { label: "About", ariaLabel: "About", href: "/about" },
      { label: "Careers", ariaLabel: "Careers", href: "/careers" },
    ],
  },
  {
    label: "Services",
    bgColor: "#1B1722",
    textColor: "#fff",
    links: [
      { label: "Book a Ride", ariaLabel: "Book a Ride", href: "/book-a-ride" },
    ],
  },
  {
    label: "Portal",
    bgColor: "#1B1722",
    textColor: "#fff",
    links: [
      { label: "Login", ariaLabel: "Login", href: "/login" },
      { label: "Sign Up", ariaLabel: "Sign Up", href: "/register" },
    ],
  },
];
