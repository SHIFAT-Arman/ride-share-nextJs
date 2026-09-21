"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftRight, Bell, LogOut } from "lucide-react";
import {
  authApi,
  dashboardPathForRole,
  profilePathForRole,
  type UserRole,
} from "@/api/auth";
import { adminApi } from "@/api/admins";
import { riderApi } from "@/api/riders";
import { driverApi } from "@/api/drivers";
import { portalNavActive, portalNavForRole } from "@/config/nav-items";
import { pictureSrc } from "@/lib/media";
import {
  subscribeRoleNotifications,
  type AnnouncementEvent,
  type NotificationRole,
} from "@/lib/pusher-client";
import { getSeenIds, markSeen } from "@/lib/seen-announcements";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster, useToastManager } from "@/components/ui/toast";
import { SkeletonAvatar } from "../SkeletonAvatar";

function initialsFromEmail(email: string) {
  const local = email.split("@")[0] ?? "?";
  return local.slice(0, 2).toUpperCase();
}

function portalRoleFromPath(pathname: string): UserRole | null {
  const segment = pathname.split("/")[2];
  if (segment === "admin" || segment === "rider" || segment === "driver") {
    return segment;
  }
  return null;
}

function PortalShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { add: addToast } = useToastManager();

  const [role, setRole] = useState<UserRole | "">("");
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [switching, setSwitching] = useState(false);

  const [notifications, setNotifications] = useState<AnnouncementEvent[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const knownIdsRef = useRef(new Set<string>());

  const canSwitch =
    availableRoles.includes("rider") && availableRoles.includes("driver");
  const switchTarget: "rider" | "driver" | null =
    role === "rider" ? "driver" : role === "driver" ? "rider" : null;

  const nav = portalNavForRole(role).filter(
    (item) =>
      !(
        item.href === "/portal/rider/apply-driver" &&
        availableRoles.includes("driver")
      ),
  );
  const profileHref = role ? profilePathForRole(role) : "#";

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const { data: session } = await authApi.me();
        if (cancelled) return;

        setRole(session.role);
        setAvailableRoles(session.availableRoles ?? [session.role]);
        setUserId(session.sub);
        setEmail(session.email);

        if (session.role === "admin") {
          const { data: admin } = await adminApi.me();
          if (cancelled) return;
          setName(`${admin.firstName} ${admin.lastName}`);
          setPfpUrl(pictureSrc(admin.profilePictureUrl ?? null) ?? null);
        } else if (session.role === "rider") {
          const { data: rider } = await riderApi.getById(session.sub);
          if (cancelled) return;
          setName(`${rider.firstName} ${rider.lastName}`);
          setPfpUrl(pictureSrc(rider.profilePictureUrl ?? null) ?? null);
        } else if (session.role === "driver") {
          const { data: driver } = await driverApi.getById(session.sub);
          if (cancelled) return;
          setName(`${driver.firstName} ${driver.lastName}`);
          setPfpUrl(pictureSrc(driver.profilePictureUrl ?? null) ?? null);
        }
      } catch {
        // axios 401 redirects to /login
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadSession();

    // Profile pages fire this after a successful save so the sidebar stays in sync.
    const onProfileUpdated = () => {
      void loadSession();
    };
    window.addEventListener("portal-profile-updated", onProfileUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("portal-profile-updated", onProfileUpdated);
    };
  }, []);

  useEffect(() => {
    if (!role) return;
    const pathRole = portalRoleFromPath(pathname);
    if (!pathRole || pathRole === role) return;
    // JWT role must match portal segment; use the switcher to change modes.
    router.replace(dashboardPathForRole(role));
  }, [pathname, role, router]);

  // Admin-only: catch up on announcements published while offline
  useEffect(() => {
    if (!userId || role !== "admin") {
      if (role === "rider" || role === "driver") setHydrated(true);
      return;
    }

    let cancelled = false;

    adminApi
      .getAnnouncements({ limit: 20 })
      .then((res) => {
        if (cancelled) return;

        const items = res.data.data
          .filter(
            (a) => !a.targetRoles?.length || a.targetRoles.includes("admin"),
          )
          .map(
            (a): AnnouncementEvent => ({
              id: a.id,
              title: a.title,
              content: a.content,
              createdAt: a.createdAt,
              targetRoles: a.targetRoles ?? ["admin"],
            }),
          );

        knownIdsRef.current = new Set(items.map((n) => n.id));
        setNotifications(items);
        const seen = new Set(getSeenIds(userId));
        setUnread(items.filter((n) => !seen.has(n.id)).length);
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, role]);

  // Live announcements for the signed-in role
  useEffect(() => {
    if (!hydrated || !role) return;

    const unsubscribe = subscribeRoleNotifications(
      role as NotificationRole,
      (data) => {
        if (knownIdsRef.current.has(data.id)) return;
        knownIdsRef.current.add(data.id);

        setNotifications((prev) => [data, ...prev].slice(0, 5));
        setUnread((n) => n + 1);
        addToast({
          title: data.title,
          description: data.content.slice(0, 80),
          type: "info",
        });
      },
    );

    return unsubscribe;
  }, [hydrated, role, addToast]);

  const handleLogout = async () => {
    await authApi.logout();
    router.push("/login");
  };

  const handleSwitchRole = async () => {
    if (!switchTarget || switching) return;
    setSwitching(true);
    try {
      await authApi.switchRole(switchTarget);
      window.location.assign(dashboardPathForRole(switchTarget));
    } catch {
      addToast({
        title: "Could not switch dashboard. Try again.",
        type: "error",
      });
      setSwitching(false);
    }
  };

  const toggleNotifications = () => {
    setOpen((wasOpen) => {
      if (!wasOpen && userId) {
        markSeen(
          userId,
          notifications.map((n) => n.id),
        );
        setUnread(0);
      }
      return !wasOpen;
    });
  };

  return (
    <SidebarProvider className="dark min-h-svh bg-sky-950 text-sky-50 [--sidebar:#082f49] [--sidebar-foreground:#e0f2fe] [--sidebar-primary:#0284c7] [--sidebar-primary-foreground:#f0f9ff] [--sidebar-accent:#0c4a6e] [--sidebar-accent-foreground:#7dd3fc] [--sidebar-border:#075985] [--sidebar-ring:#38bdf8] [--background:#020617] [--foreground:#e0f2fe]">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={<Link href="/" />}>
                <span className="flex items-center gap-2 font-mono text-base font-semibold tracking-wide uppercase text-sky-200">
                  <Image
                    src="/car-logo.png"
                    alt="Ride Share Portal"
                    width={32}
                    height={32}
                  />
                  Ride Share Portal
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Portal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={portalNavActive(pathname, item.href, nav)}
                      tooltip={item.title}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={<Link href={profileHref} />}
                isActive={pathname === profileHref}
                tooltip="Update profile"
              >
                {isLoading ? (
                  <SkeletonAvatar />
                ) : (
                  <>
                    <Avatar className="size-8">
                      {pfpUrl ? <AvatarImage src={pfpUrl} alt="" /> : null}
                      <AvatarFallback className="bg-sky-800 text-sky-100">
                        {email ? initialsFromEmail(email) : "—"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                      <span className="truncate">{email || "Signed in"}</span>
                      {name ? (
                        <span className="truncate text-xs text-sky-200/60">
                          {name}
                        </span>
                      ) : null}
                    </div>
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
            {canSwitch && switchTarget ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={`Switch to ${switchTarget}`}
                  disabled={switching}
                  onClick={() => void handleSwitchRole()}
                >
                  <ArrowLeftRight />
                  <span>
                    {switching
                      ? "Switching…"
                      : `Switch to ${switchTarget}`}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : null}
            <SidebarMenuItem className="relative">
              <SidebarMenuButton onClick={toggleNotifications}>
                <Bell />
                <span>Notifications</span>
              </SidebarMenuButton>
              {unread > 0 && (
                <SidebarMenuBadge className="bg-sky-500 text-white">
                  {unread}
                </SidebarMenuBadge>
              )}
              {open && (
                <div className="absolute bottom-full left-0 z-50 mb-2 w-72 rounded-xl border border-sky-800/60 bg-sky-950 p-3 shadow-lg">
                  <p className="mb-2 text-xs font-semibold tracking-wider text-sky-200/50 uppercase">
                    Recent
                  </p>
                  {notifications.length === 0 ? (
                    <p className="py-4 text-center text-sm text-sky-200/40">
                      No notifications yet
                    </p>
                  ) : (
                    <ul className="max-h-64 space-y-2 overflow-y-auto">
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className="rounded-lg border border-sky-800/40 bg-sky-900/40 px-3 py-2"
                        >
                          <p className="text-sm font-medium text-sky-50">
                            {n.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-sky-200/50">
                            {n.content}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Sign out" onClick={handleLogout}>
                <LogOut />
                <span>Sign out </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-sky-800/60 px-4">
          <SidebarTrigger />
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <Toaster>
      <PortalShellInner>{children}</PortalShellInner>
    </Toaster>
  );
}
