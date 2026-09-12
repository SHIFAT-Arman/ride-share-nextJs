import CardNav from "@/components/CardNav";
import Footer from "@/components/Footer";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { navItems } from "@/config/nav-items";
import logo from "@/public/car-logo.svg";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CardNav
        logo={logo.src}
        logoAlt="Car logo"
        items={navItems}
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
