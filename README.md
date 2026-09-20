# Ride Share

A modern ride-sharing web application with a public marketing site and role-based portals for riders, drivers, and admins. End-to-end flows are covered with Playwright testing.

[![Next.js](https://img.shields.io/badge/Next.js-%23000000.svg?logo=nextdotjs&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-%2320232A.svg?logo=react&logoColor=%2361DAFB)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-%233178C6.svg?logo=typescript&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%2306B6D4.svg?logo=tailwindcss&logoColor=white)](#)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-%23000000.svg?logo=shadcnui&logoColor=white)](#)
[![Bun](https://img.shields.io/badge/Bun-%23000000.svg?logo=bun&logoColor=white)](#)
[![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)](#)
[![Axios](https://img.shields.io/badge/Axios-%235A29E4.svg?logo=axios&logoColor=white)](#)
[![Zod](https://img.shields.io/badge/Zod-%233E67B1.svg?logo=zod&logoColor=white)](#)
[![Playwright](https://img.shields.io/badge/Playwright-%232EAD33.svg?logo=playwright&logoColor=white)](#)
[![Pusher](https://img.shields.io/badge/Pusher-%23300D4F.svg?logo=pusher&logoColor=white)](#)
[![Recharts](https://img.shields.io/badge/Recharts-%238884D8.svg?logo=chartdotjs&logoColor=white)](#)
[![Leaflet](https://img.shields.io/badge/Leaflet-%23199B4D.svg?logo=leaflet&logoColor=white)](#)
[![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-%237EBC6F.svg?logo=openstreetmap&logoColor=white)](#)
[![Nominatim](https://img.shields.io/badge/Nominatim-Geocoding-%237EBC6F.svg?logo=openstreetmap&logoColor=white)](https://nominatim.org/)

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
  - [Landing page](#landing-page)
  - [Admin portal](#admin-portal)
  - [Rider portal](#rider-portal)
  - [Book a ride](#book-a-ride)
  - [Driver portal](#driver-portal)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Book a ride (code guide)](docs/book-a-ride.md)

---

## Overview

Ride Share helps people book intercity and long-distance trips with transparent pricing. The frontend includes:

- A polished marketing landing page for discovery and conversion
- Secure login and registration
- Separate dashboards for **Admin**, **Rider**, and **Driver** roles
- **Book a ride** with Leaflet maps, Nominatim place search, OSRM route estimate, and live tracking
- Real-time announcements and ride updates powered by Pusher
- Playwright end-to-end tests for critical user flows such as login and registration

This repository is the **Next.js frontend**. It connects to a NestJS API backend for authentication, user management, rides, and portal data.

For a file-by-file walkthrough of booking, see [docs/book-a-ride.md](docs/book-a-ride.md).

---

## Features

| Area | What it does |
|------|----------------|
| Marketing site | Hero, feature highlights, testimonials, FAQ, and call-to-action |
| Authentication | Cookie-based sessions with role-aware redirects into the correct portal |
| Admin portal | Account totals chart, admin management, announcements, profile updates |
| Book a ride | Map pickup, Nominatim destination search, car/bike, route + fare, confirm |
| Rider portal | Dashboard, active ride tracking, cancel, profile editing |
| Driver portal | Go online (GPS), accept open requests, start / complete / cancel trips |
| Realtime | Announcements plus ride status and driver location over Pusher |
| Testing | Playwright coverage for key authentication and page flows |

---

## Screenshots

### Landing page

#### Hero

![Hero section](docs/screenshots/hero.png)

#### Navigation

![Navbar](docs/screenshots/navbar.png)

#### Features

![Features section](docs/screenshots/features.png)

#### Image carousel

![Image carousel](docs/screenshots/image-carousel.png)

#### Testimonials

![Testimonials](docs/screenshots/testimonials.png)

#### Call to action and FAQ

![CTA and FAQ](docs/screenshots/cta-faq.png)

#### FAQ and footer

![FAQ and footer](docs/screenshots/faq-footer.png)

### Admin portal

#### Dashboard

![Admin dashboard](docs/screenshots/admin-dashboard.png)

#### Manage admins

![Manage admins](docs/screenshots/admin-manageAdmins.png)

#### Manage announcements

![Manage announcements](docs/screenshots/admin-manageAnnouncement.png)

#### Update profile

![Admin update profile](docs/screenshots/admin-updateProfile.png)

### Rider portal

#### Dashboard

![Rider dashboard](docs/screenshots/rider-dashboard.png)

#### Update profile

![Rider update profile](docs/screenshots/rider-update-profile.png)

### Book a ride

#### Booking map (destination search)

Rider picks a destination via Nominatim-backed search on a Leaflet / OpenStreetMap map, then chooses **Car** or **Bike**.

![Book a ride](docs/screenshots/ride-booking.png)

#### Rider tracking (SEARCHING)

After confirm, the track page redraws pickup, destination, and the OSRM route polyline while status is `SEARCHING`.

![Rider tracking while searching](docs/screenshots/ride-tracking-rider.png)

#### Rider tracking (IN_PROGRESS)

Once the trip has started, the rider sees `IN_PROGRESS` with the same route on the map.

![Rider ride in progress](docs/screenshots/rider-in-progress.png)

### Driver portal

#### Open requests (accept)

Drivers who are online see open `SEARCHING` rides and can **Accept**.

![Driver accept open request](docs/screenshots/driver-ride-accept.png)

#### Assigned ride (start trip)

After accept (or auto-assign), the driver gets **Start trip** / **Cancel** for an `ACCEPTED` ride.

![Driver ride accepted](docs/screenshots/driver-in-progress.png)

---

## Tech stack

| Layer | Tools |
|-------|--------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Animation | GSAP, Motion, Three.js / OGL |
| Maps | Leaflet, OpenStreetMap tiles, Nominatim (via API), OSRM estimate (via API) |
| Data & validation | Axios, Zod |
| Charts | Recharts |
| Realtime | Pusher |
| Testing | Playwright |
| Runtime / deploy | Bun, Vercel |

---

## Project structure

```text
app/
  (website)/              Public marketing pages, login, register, book-a-ride
  portal/rider/           Rider dashboard + ride/[id] tracking
  portal/driver/          Driver dashboard (accept / start / complete)
  portal/admin/           Admin tools
components/book-ride/     Book-a-ride map UI
api/                      Axios clients (auth, rides, location, …)
lib/pusher-client.ts      Announcements + ride channels
docs/
  screenshots/            README screenshots
  book-a-ride.md          How book-a-ride works in code
```
