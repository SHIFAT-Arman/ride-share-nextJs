import Link from "next/link";
import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa6";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

type FooterLink = {
  label: string;
  href: string;
  icon?: IconType;
};

const footerColumns: { links: FooterLink[]; iconRow?: boolean }[] = [
  {
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Career", href: "/career" },
    ],
  },
  {
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    iconRow: true,
    links: [
      { label: "Facebook", href: "https://facebook.com", icon: SiFacebook },
      { label: "Instagram", href: "https://instagram.com", icon: SiInstagram },
      { label: "Twitter", href: "https://twitter.com", icon: SiX },
      { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedin },
      { label: "YouTube", href: "https://youtube.com", icon: SiYoutube },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden text-foreground">
      <div className="absolute top-0 left-0 w-full h-full" aria-hidden></div>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-3 md:gap-8">
        {footerColumns.map((col, i) => (
          <nav key={i} aria-label={`Footer column ${i + 1}`}>
            <ul
              className={
                col.iconRow
                  ? "flex flex-row flex-wrap gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {col.links.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    {Icon ? (
                      <a
                        href={link.href}
                        aria-label={link.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Icon size={22} />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
