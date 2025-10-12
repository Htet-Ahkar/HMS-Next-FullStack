# COPILOT_INSTRUCTIONS.md

This file provides instructions for GitHub Copilot to assist in building the **Hospital Management System** project with Next.js, ShadCN UI, TailwindCSS, Zustand, Drizzle ORM, Better Auth, PostgreSQL, and Vitest.

---

## Project Overview

- **Goal:** Simple, product-ready hospital management system.
- **Main features:**
  - Role-based authentication (Admin, Doctor, Nurse/Receptionist, Patient)
  - Dashboards for each role
  - Patient, appointment, and medical record management
  - CRUD operations through a service layer

---

## Code Style & Conventions

- **Language:** TypeScript (`strict: true`)
- **Naming conventions:**
  - camelCase for variables and functions
  - PascalCase for components
- **Formatting:**
  - 2-space indentation
  - Single quotes
  - Semicolons included
- **Comments:** Minimal inline comments; rely on descriptive names and TypeScript types

---

## UI & Styling

- **Primary UI library:** ShadCN UI components
- **Styling:** Use TailwindCSS for layout tweaks only
- **Responsive design:** Generate responsive layouts by default

---

## File & Folder Structure

Follow standard **Next.js App Router structure**:

---

## State Management

- Use **Zustand exclusively** for global and UI state
- Store user session, role, modals, notifications, and other UI states in Zustand

---

## Testing

- Use **Vitest** for unit and integration tests
- Keep tests colocated with their components or service files
- E2E testing will be added later

---

## Auth & Role-Based Access Control (RBAC)

- Implement **Better Auth** for authentication
- Enforce **RBAC both server-side** (middleware, API guards) and **client-side** (conditional rendering, redirects)
- Roles: Admin, Doctor, Nurse/Receptionist, Patient

---

## API & Data Layer

- Use **Drizzle ORM** with PostgreSQL for database operations
- Implement a **service layer** (`/lib/services/*`) for all DB interactions
- Keep **API routes thin**, calling service functions for CRUD operations

---

## Copilot Commenting Behavior

- Keep comments **minimal inline**
- Rely on **descriptive names, TypeScript types, and ShadCN/Tailwind conventions** for clarity

---

## Docker & Environment

- **Docker and environment setup** (Dockerfile, docker-compose.yml, env.example) will be created manually
- Copilot should not generate these files

---

## Usage Tips for Copilot

- **Comment-first approach:** Write descriptive comments before functions, components, or stores to get accurate suggestions
- **Iterate quickly:** Accept skeleton code, then refine manually
- **Context awareness:** Keep files focused; Copilot performs better in smaller, context-rich files
- **Service layer generation:** Let Copilot scaffold repetitive DB queries and API route calls
- **UI scaffolding:** Let Copilot prioritize ShadCN components, using Tailwind only for layout adjustments
