import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Banknote, MapPinned, Users, type LucideIcon } from "lucide-react";

import { ScrollTop } from "./scroll-top";
import { ZoomImage } from "./zoom-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import adminDashboard from "@/docs/screenshots/admin-dashboard.png";
import adminManageAdmins from "@/docs/screenshots/admin-manageAdmins.png";
import adminManageAnnouncement from "@/docs/screenshots/admin-manageAnnouncement.png";
import adminUpdateProfile from "@/docs/screenshots/admin-updateProfile.png";
import ctaFaq from "@/docs/screenshots/cta-faq.png";
import driverInProgress from "@/docs/screenshots/driver-in-progress.png";
import driverRideAccept from "@/docs/screenshots/driver-ride-accept.png";
import faqFooter from "@/docs/screenshots/faq-footer.png";
import features from "@/docs/screenshots/features.png";
import hero from "@/docs/screenshots/hero.png";
import imageCarousel from "@/docs/screenshots/image-carousel.png";
import navbar from "@/docs/screenshots/navbar.png";
import rideBooking from "@/docs/screenshots/ride-booking.png";
import rideTrackingRider from "@/docs/screenshots/ride-tracking-rider.png";
import riderDashboard from "@/docs/screenshots/rider-dashboard.png";
import riderInProgress from "@/docs/screenshots/rider-in-progress.png";
import riderUpdateProfile from "@/docs/screenshots/rider-update-profile.png";
import testimonials from "@/docs/screenshots/testimonials.png";

export const metadata: Metadata = {
  title: "About Ride Share",
  description:
    "How Ride Share works: book a car or bike, track a searching ride, and follow the trip after a driver accepts and starts it.",
  openGraph: {
    title: "About Ride Share",
    description:
      "How Ride Share works: book a car or bike, track a searching ride, and follow the trip after a driver accepts and starts it.",
  },
};

type Step = {
  badge: string;
  title: string;
  body: string;
  image: StaticImageData;
  alt: string;
  priority?: boolean;
};

const trip: Step[] = [
  {
    badge: "Book",
    title: "Choose a destination",
    body: "The rider sets pickup on the map, searches for a destination, and picks Car or Bike. Distance, time, and fare show up before confirm.",
    image: rideBooking,
    alt: "Booking map with destination search, Car and Bike choices, and a route estimate.",
    priority: true,
  },
  {
    badge: "Searching",
    title: "Track the request",
    body: "After confirm, the track page draws pickup, destination, and the route while the ride is searching. The rider can cancel from that page.",
    image: rideTrackingRider,
    alt: "Rider tracking page while the ride status is searching.",
  },
  {
    badge: "Accept",
    title: "A driver takes the ride",
    body: "A driver who is online sees open searching rides and can accept one.",
    image: driverRideAccept,
    alt: "Driver dashboard listing an open ride with an Accept action.",
  },
  {
    badge: "Accepted",
    title: "Start the trip",
    body: "After accept, the driver can start the trip or cancel it.",
    image: driverInProgress,
    alt: "Driver dashboard for an accepted ride with Start trip and Cancel.",
  },
  {
    badge: "In progress",
    title: "The rider follows the route",
    body: "Once the trip has started, the rider sees the same route with status in progress.",
    image: riderInProgress,
    alt: "Rider tracking page with the ride in progress.",
  },
];

const rider: Step[] = [
  {
    badge: "Rider",
    title: "Dashboard",
    body: "The rider dashboard shows the active ride and links back to the track page.",
    image: riderDashboard,
    alt: "Rider dashboard with an active ride card.",
  },
  {
    badge: "Rider",
    title: "Update profile",
    body: "Name and contact details are edited on the rider profile.",
    image: riderUpdateProfile,
    alt: "Rider profile update form.",
  },
];

const admin: Step[] = [
  {
    badge: "Admin",
    title: "Dashboard",
    body: "The admin dashboard charts account totals.",
    image: adminDashboard,
    alt: "Admin dashboard with an account totals chart.",
  },
  {
    badge: "Admin",
    title: "Manage admins",
    body: "Admins can list and open other admin accounts.",
    image: adminManageAdmins,
    alt: "Admin page for managing admin accounts.",
  },
  {
    badge: "Admin",
    title: "Announcements",
    body: "Announcements are written here and delivered to the portals.",
    image: adminManageAnnouncement,
    alt: "Admin page for managing announcements.",
  },
  {
    badge: "Admin",
    title: "Update profile",
    body: "The signed-in admin edits their own profile on a separate page.",
    image: adminUpdateProfile,
    alt: "Admin profile update form.",
  },
];

const site: Step[] = [
  {
    badge: "Site",
    title: "Hero",
    body: "The landing page opens with the trip pitch and a link to book.",
    image: hero,
    alt: "Landing page hero.",
  },
  {
    badge: "Site",
    title: "Navigation",
    body: "The top menu links to this page, booking, and the portal.",
    image: navbar,
    alt: "Site navigation bar.",
  },
  {
    badge: "Site",
    title: "Features",
    body: "The features block summarizes what riders, drivers, and admins can do.",
    image: features,
    alt: "Landing page features section.",
  },
  {
    badge: "Site",
    title: "Image carousel",
    body: "A carousel shows product screens between the feature blocks.",
    image: imageCarousel,
    alt: "Landing page image carousel.",
  },
  {
    badge: "Site",
    title: "Testimonials",
    body: "Testimonials sit below the feature sections.",
    image: testimonials,
    alt: "Landing page testimonials.",
  },
  {
    badge: "Site",
    title: "Call to action and FAQ",
    body: "A booking prompt leads into the questions.",
    image: ctaFaq,
    alt: "Call to action and FAQ on the landing page.",
  },
  {
    badge: "Site",
    title: "FAQ and footer",
    body: "The footer repeats links to this page, privacy, terms, and contact.",
    image: faqFooter,
    alt: "FAQ and footer on the landing page.",
  },
];

const highlights: { icon: LucideIcon; label: string; body: string }[] = [
  { icon: Banknote, label: "Fare", body: "Shown before you confirm" },
  { icon: MapPinned, label: "Track", body: "The route stays on the map" },
  { icon: Users, label: "Roles", body: "Rider, driver, and admin" },
];

function Steps({ steps }: { steps: Step[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {steps.map((step) => (
        <Card key={step.title}>
          <CardHeader>
            <Badge className="w-fit">{step.badge}</Badge>
            <h3 className="font-semibold leading-none tracking-tight">
              {step.title}
            </h3>
            <CardDescription>{step.body}</CardDescription>
          </CardHeader>
          <CardContent>
            <ZoomImage
              src={step.image}
              alt={step.alt}
              priority={step.priority}
              sizes="(min-width: 48rem) 36rem, 100vw"
              className="h-auto w-full rounded-lg border"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Section({
  title,
  steps,
  children,
}: {
  title: string;
  steps: Step[];
  children?: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <Steps steps={steps} />
      {children}
    </section>
  );
}

export default function AboutPage() {
  return (
    <article className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-28 pb-16 md:pt-32">
      <header className="flex flex-col gap-8 border-b border-foreground/10 pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Ride Share
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-foreground/80">
              A rider sets pickup and destination, sees the fare, and a driver
              accepts and runs the trip. Admins manage accounts and
              announcements.
            </p>
          </div>
          <Button
            size="lg"
            className="h-10 cursor-pointer"
            nativeButton={false}
            render={<Link href="/book-a-ride" />}
          >
            Book a ride
          </Button>
        </div>
        <ul className="grid gap-6 border-t border-foreground/10 pt-6 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, label, body }) => (
            <li key={label} className="flex items-center justify-center gap-3">
              <Icon aria-hidden className="size-5 shrink-0 text-sky-700" />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/60">
                  {label}
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </header>
      <Section title="How a trip works" steps={trip} />
      <Section title="Rider" steps={rider}>
        <p className="max-w-prose text-sm leading-6 text-foreground">
          A rider can apply to drive from the <Link href="/portal/rider/apply-driver" className="underline underline-offset-4">apply form</Link>.
        </p>
      </Section>
      <Section title="Admin" steps={admin} />
      <Section title="Public site" steps={site} />
      <ScrollTop />
    </article>
  );
}
