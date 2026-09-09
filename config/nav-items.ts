import { CardNavItem } from "@/components/CardNav";

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
      { label: "Sign Up", ariaLabel: "Sign Up", href: "/sign-up" },
    ],
  },
];
