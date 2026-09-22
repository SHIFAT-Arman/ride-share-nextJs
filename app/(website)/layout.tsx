import { authApi, type SessionUser } from "@/api/auth";
import CardNav from "@/components/CardNav";
import Footer from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { navItems } from "@/config/nav-items";
import { marketingNavCta, portalLinksForSession } from "@/lib/marketing-nav";
import { serverAuthConfig } from "@/lib/server-auth";
import logo from "@/public/car-logo.svg";

async function marketingSession(): Promise<SessionUser | null> {
  try {
    const { data } = await authApi.me(await serverAuthConfig());
    return data;
  } catch {
    return null;
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await marketingSession();
  const cta = marketingNavCta(session, session?.name);
  const items = navItems.map((item) =>
    item.label === "Portal"
      ? { ...item, links: portalLinksForSession(session ? cta.href : null) }
      : item,
  );

  return (
    <>
      <CardNav
        logo={logo.src}
        logoAlt="Car logo"
        items={items}
        cta={cta}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="elastic.out(1, 0.8)"
      />
      <SmoothScrollProvider>
        <main className="flex-1">{children}</main>
      </SmoothScrollProvider>
      <Footer />
    </>
  );
}
