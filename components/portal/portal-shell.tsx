"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LayoutDashboard, LogOut, Megaphone, Users } from "lucide-react";
import { adminApi } from "@/api/admins";
import {
  subscribeRoleNotifications,
  type AnnouncementEvent,
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

const NAV = [
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
] as const;

function navActive(pathname: string, href: string) {
  if (href === "/portal/admin") {
    const named = NAV.filter((item) => item.href !== href).map(
      (item) => item.href,
    );
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) &&
        !named.some((n) => pathname === n || pathname.startsWith(`${n}/`)))
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initialsFromEmail(email: string) {
  const local = email.split("@")[0] ?? "?";
  return local.slice(0, 2).toUpperCase();
}

function PortalShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { add: addToast } = useToastManager();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [adminId, setAdminId] = useState("");
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [notifications, setNotifications] = useState<AnnouncementEvent[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  // Wait for catch-up before live subscribe (avoids hydrate wiping live events)
  const [hydrated, setHydrated] = useState(false);
  const knownIdsRef = useRef(new Set<string>());

  useEffect(() => {
    let objectUrl: string | undefined;
    let cancelled = false;

    adminApi.me().then(async ({ data }) => {
      if (cancelled) return;
      setAdminId(data.id);
      setEmail(data.email);
      setName(data.firstName + " " + data.lastName);
      try {
        const pic = await adminApi.getProfilePicture();
        objectUrl = URL.createObjectURL(pic.data);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setPfpUrl(objectUrl);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // Catch up on announcements published while offline
  useEffect(() => {
    if (!adminId) return;

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
        const seen = new Set(getSeenIds(adminId));
        setUnread(items.filter((n) => !seen.has(n.id)).length);
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });

    return () => {
      cancelled = true;
    };
  }, [adminId]);

  // Live announcements — only after hydrate so a slow fetch cannot wipe them
  useEffect(() => {
    if (!hydrated) return;

    const unsubscribe = subscribeRoleNotifications("admin", (data) => {
      if (knownIdsRef.current.has(data.id)) return;
      knownIdsRef.current.add(data.id);

      setNotifications((prev) => [data, ...prev].slice(0, 20));
      setUnread((n) => n + 1);
      addToast({
        title: data.title,
        description: data.content.slice(0, 80),
        type: "info",
      });
    });

    return unsubscribe;
  }, [hydrated, addToast]);

  const handleLogout = async () => {
    await adminApi.logout();
    router.push("/login");
  };

  const toggleNotifications = () => {
    setOpen((wasOpen) => {
      if (!wasOpen) {
        markSeen(
          adminId,
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
              <SidebarMenuButton size="lg" className="pointer-events-none">
                <span className="flex items-center gap-2 font-mono text-base font-semibold tracking-wide uppercase text-sky-200">
                  <Image
                    src="/car-logo.svg"
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
                {NAV.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={navActive(pathname, item.href)}
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
              <SidebarMenuButton size="lg" className="pointer-events-none">
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
                    <span className="truncate">{email || "Signed in"}</span>
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
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
