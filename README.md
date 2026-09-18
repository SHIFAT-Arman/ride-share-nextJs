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

---

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
  - [Landing page](#landing-page)
  - [Admin portal](#admin-portal)
  - [Rider portal](#rider-portal)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)

---

## Overview

Ride Share helps people book intercity and long-distance trips with transparent pricing. The frontend includes:

- A polished marketing landing page for discovery and conversion
- Secure login and registration
- Separate dashboards for **Admin**, **Rider**, and **Driver** roles
- Real-time announcements powered by Pusher
- Playwright end-to-end tests for critical user flows such as login and registration

This repository is the **Next.js frontend**. It connects to a NestJS API backend for authentication, user management, and portal data.

---

## Features

| Area | What it does |
|------|----------------|
| Marketing site | Hero, feature highlights, testimonials, FAQ, and call-to-action |
| Authentication | Cookie-based sessions with role-aware redirects into the correct portal |
| Admin portal | Account totals chart, admin management, announcements, profile updates |
| Rider portal | Dashboard with verification status and profile editing |
| Driver portal | Role-specific dashboard and profile access |
| Realtime | Live announcement notifications for portal users |
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

---

## Tech stack

| Layer | Tools |
|-------|--------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui |
| Animation | GSAP, Motion, Three.js / OGL |
| Data & validation | Axios, Zod |
| Charts | Recharts |
| Realtime | Pusher |
| Testing | Playwright |
| Runtime / deploy | Bun, Vercel |

---

## Project structure

```text
app/
  (website)/     Public marketing pages, login, register
  portal/        Role-based dashboards (admin, rider, driver)
components/      UI and page sections
api/             API client modules
docs/screenshots Project screenshots for documentation
```
