"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LayoutDashboard, LogOut, Megaphone, Users } from "lucide-react";
import { adminApi } from "@/api/admins";
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
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
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

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pfpUrl, setPfpUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | undefined;
    let cancelled = false;

    adminApi.me().then(async ({ data }) => {
      if (cancelled) return;
      try {
        const pic = await adminApi.getProfilePicture();
        setEmail(data.email);
        setName(data.firstName + " " + data.lastName);
        objectUrl = URL.createObjectURL(pic.data);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl); // prevents memory leak
          return;
        }
        setPfpUrl(objectUrl);
        setIsLoading(false);
      } catch {
        // no picture on file — fallback initials
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const handleLogout = async () => {
    await adminApi.logout();
    router.push("/login");
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
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Bell />
                <span>Notifications</span>
              </SidebarMenuButton>
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
