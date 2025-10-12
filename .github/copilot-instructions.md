# 🧭 COPILOT_INSTRUCTIONS.md

This file provides instructions for **GitHub Copilot** to assist in building the **Hospital Management System (HMS)** — a **Next.js full-stack application** using **Drizzle ORM**, **PostgreSQL**, **Better Auth**, **Zustand**, **ShadCN UI**, **TailwindCSS**, **Vitest**, and **Docker**.

---

## 🏥 Project Overview

- **Goal:** Build a simple, production-ready Hospital Management System with modular backend and clean, responsive UI.
- **Stack Overview:**
  - **Next.js (App Router)** – Frontend + API routes
  - **Drizzle ORM + PostgreSQL** – Database and migrations
  - **Better Auth** – Authentication and RBAC
  - **Zustand** – State management
  - **ShadCN UI + TailwindCSS** – UI and layout
  - **Vitest** – Testing
  - **Docker** – Containerized environment

---

## 🧩 Code Style & Conventions

- **Language:** TypeScript (`"strict": true`)
- **Naming conventions:**
  - `camelCase` → variables, functions, Zustand stores
  - `PascalCase` → components, types, interfaces
  - `snake_case` → database table names and columns (Drizzle)
- **Formatting:**
  - 2-space indentation
  - Single quotes
  - Semicolons required
- **Comments:** Minimal inline comments — rely on descriptive names and TypeScript types.

---

## 🎨 UI & Styling

- **Primary library:** ShadCN UI components
- **TailwindCSS:** Use for responsive layouts and minor tweaks
- **Responsive design:** Always assume mobile-first
- **Accessibility:** Use ARIA props when relevant
- **No custom design systems** — follow ShadCN and Tailwind conventions

---

## 🗂️ Folder Structure

```
src/
 ├─ app/
 │   ├─ (auth)/          # Auth pages (login/register)
 │   ├─ (dashboard)/     # Role dashboards
 │   ├─ api/
 │   │   ├─ users/
 │   │   ├─ appointments/
 │   │   ├─ records/
 │   │   └─ auth/
 │   └─ layout.tsx
 │
 ├─ components/
 │   ├─ ui/              # ShadCN components
 │   ├─ forms/           # Reusable form components
 │   ├─ dashboard/       # Dashboard UI components
 │
 ├─ lib/
 │   ├─ db/              # Drizzle setup & schema
 │   ├─ services/        # CRUD service layer
 │   ├─ auth/            # Better Auth config
 │   └─ utils/           # Helpers
 │
 ├─ store/               # Zustand stores
 ├─ types/               # Shared TS types
 ├─ tests/               # Vitest test files
 └─ docker/              # Docker configurations
```

---

## 🪄 State Management

- Use **Zustand exclusively** for global and UI state
- Separate stores by domain: `useAuthStore`, `useUIStore`, `useAppointmentStore`, etc.
- Store user session, modals, notifications, filters
- Avoid large monolithic stores

---

## 🔐 Authentication & RBAC

- Use **Better Auth**
- Roles: **Admin**, **Doctor**, **Receptionist**, **Patient**
- Admin created from `.env` values:  
  `ADMIN_NAME`, `ADMIN_PASSWORD`
- Only Admin can create users; Patients can self-register
- **Server-side enforcement:** Middleware, API guards
- **Client-side enforcement:** Conditional rendering, redirects

---

## 🧱 API & Data Layer

- Use **Drizzle ORM** for DB operations
- Define schema in `/drizzle/schema`
- Run migrations via `/drizzle`
- Use a **service layer** to abstract DB logic:
  - Services live in `/lib/services`
  - API routes call services for CRUD
  - Keep route handlers minimal and focused on input/output validation

Example:

```ts
// app/api/users/route.ts
import { userService } from "@/lib/services/user";

export async function POST(req: Request) {
  const data = await req.json();
  const user = await userService.create(data);
  return Response.json(user);
}
```

---

## 🧪 Testing

- **Framework:** Vitest
- **Tests:** colocate unit tests near components or services
- **Integration tests:** optional folder `/tests`
- Mock DB interactions using test utilities or an in-memory database
- Future E2E: Playwright

---

## 🐳 Docker Setup

- Dockerized setup with:
  - `app` → Next.js app container
  - `db` → PostgreSQL
- `docker-compose.yml` defines both services
- Automatically runs migrations on container startup

---

## ⚙️ Features Summary

| Role             | Capabilities                                   |
| ---------------- | ---------------------------------------------- |
| **Admin**        | Manage all users, view analytics, manage roles |
| **Doctor**       | View patients, manage medical records          |
| **Receptionist** | Manage appointments, handle check-ins          |
| **Patient**      | Book appointments, view personal history       |

---

## 🤖 Copilot Chat Instructions

### ✅ General Rules

- Prefer **Next.js App Router conventions**
- Always **return `Response.json()`** in API routes
- Use **async/await** consistently
- Use **ShadCN UI** components when generating UI (avoid raw HTML)
- Suggest **Zustand stores** for shared state
- Suggest **service layer** for any data operations
- Use **TypeScript types** for inputs and outputs
- Avoid suggesting legacy `pages/` directory syntax

---

### 🧠 Copilot Autocomplete Preferences

| Context            | Preferred Completion                                        |
| ------------------ | ----------------------------------------------------------- |
| **API Routes**     | Suggest using `Response.json()` and `NextResponse`          |
| **Database Logic** | Use Drizzle queries through service layer                   |
| **UI Components**  | Use ShadCN components + Tailwind for layout                 |
| **Auth Flows**     | Use Better Auth hooks and middleware                        |
| **State**          | Suggest creating Zustand store with clear selector patterns |
| **Tests**          | Suggest Vitest syntax with `describe`, `it`, `expect`       |

---
