# Backend Architecture & Guidelines

This document outlines the backend technical approach, data modeling, and security rules for the Regency Salma platform.

## Architecture Recommendation
- **Framework:** Node.js with a robust framework (e.g., Express or NestJS) favoring modular, domain-driven design.
- **Language:** TypeScript for end-to-end type safety alongside the frontend.

## Database & ORM
- **Database:** PostgreSQL for strong relational data integrity, critical for complex role and community structures.
- **ORM:** Prisma for type-safe database queries, schema management, and migrations.

## Prisma Migration & Seed Strategy
- **Migrations:** Use `prisma migrate dev` during development to generate deterministic SQL migration files. Never modify the database schema directly.
- **Seeding:** Maintain a `seed.ts` script to populate the database with default roles, a dummy community, and test users (management, owner, resident) for consistent local development.

## Authentication & Session Strategy
- **Custom Authentication:** Email/Phone and Password-based auth (or OTP) issuing JWTs.
- **Tokens:**
  - **Access Token:** Short-lived JWT containing the user ID and basic identifiers.
  - **Refresh Token:** Long-lived, stored securely in the database to allow silent access token renewal. Revocable on demand.

## Domain Models (High-Level)
- **User:** Global identity (Name, Phone/Email, Password Hash).
- **Community:** The gated community entity (Name, Address).
- **Membership & Roles:** A join table linking User, Community, and Role (Leadership, Owner, Resident, Tenant, Worker). A user can have different roles in different communities.
- **Announcements:** Tied to a community and scoped by an "audience_level" (Leadership, Owner, Resident).

## API Boundary Conventions
- **RESTful or GraphQL:** Expose a clean, versioned API (e.g., `/api/v1/`).
- **Validation:** Use Zod or class-validator to strictly validate all incoming request payloads before they reach the business logic.
- **Standardized Responses:** Use consistent JSON structures for success and error payloads.

## Authorization Rules
- Authorization happens at the API route level and the data-access level.
- Ensure cross-tenant isolation: A user must only see data for the community they are currently accessing.
- **Announcements Security:**
  - Leadership can read/write all announcements.
  - Owners can read owner and resident announcements.
  - Residents/Tenants can read resident announcements only.
- Modifying sensitive data (e.g., tenant approval) requires explicit Owner or Management roles.

## Audit Logging Requirements
- Maintain an `AuditLog` table for critical actions: joining a community, changing roles, approving tenants, and workforce ticket updates.
- Record the `actorId`, `actionType`, `resourceId`, and `timestamp`.

## Security Requirements
- All passwords must be hashed using a strong algorithm (e.g., bcrypt or Argon2).
- Enforce rate limiting on authentication and OTP endpoints.
- Validate all inputs to prevent SQL injection and XSS.
- Ensure CORS is correctly configured.

---

## Planned Five-Stage Roadmap

### Stage 1 — Foundation (Current Scope)
- Expo + React Native application shell
- Backend service, PostgreSQL database, Prisma schema
- Custom authentication & session foundations
- Design-system foundation

### Stage 2 — Onboarding and authorization
- Join/create community, Role-based access control, Tenant authorization.

### Stage 3 — Resident experience
- Dashboard, Visitor management, Maintenance tickets, Quick-connect.

### Stage 4 — Announcements and workforce management
- Role-based announcement spaces, Manager ticket acceptance, Worker delegation, Audit trail.

### Stage 5 — Product hardening
- Notifications, Media uploads, Security review, Performance, Production deployment.
