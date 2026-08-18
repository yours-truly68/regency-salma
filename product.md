# Product Vision & Requirements

This document defines the product vision, user roles, core capabilities, and the rollout roadmap for the Regency Salma platform.

## Product Vision
Regency Salma is a premium gated residential-community platform connecting management, owners, residents, and workforce seamlessly, ensuring security, convenience, and transparent communication.

## User Roles
1. **Leadership / Management:** Oversees the entire community. Has highest privileges.
2. **Owner:** Owns properties within the community.
3. **Resident / Family Member:** Lives in the community (could be an owner living there, or family).
4. **Tenant:** Rents and lives in the community. Requires authorization from an Owner or Management.
5. **Workforce / Service Worker:** Performs maintenance, security, or community tasks.

## Authorization Model
- **Authentication != Authorization:** Logging in merely authenticates identity. Community access and capabilities are strictly governed by authorized roles.
- **Leadership Space:** Accessed only by Leadership/Management. Leadership also has access to Owner and Resident spaces.
- **Owner Space:** Accessed by Owners. Owners also have access to the Resident space.
- **Resident Space:** Accessed by Residents and Tenants.
- **Tenant Rules:** Tenants must be explicitly added or authorized by an Owner or Management to gain access to the Resident space.

## Core Resident Capabilities
- **Visitor Management:** Authorize visitors using OTP, advance visitor booking.
- **Family Access:** Manage family-member access with "always-allow" permissions.
- **Quick-Connect Actions:** Fast access to emergency contacts, community desk, etc.
- **Maintenance Tickets:** Create and track issues/maintenance requests.
- **Announcements & Updates:** View relevant community news.
- **Profile & Home Info:** Manage personal and household details.

## Announcement Spaces & Permissions
Announcements are segregated into three distinct spaces:
1. **Leadership Announcements:** Published by and accessed only by Leadership.
2. **Owner Announcements:** Published by Leadership. Accessed by Leadership and Owners.
3. **Resident Announcements:** Published by Leadership. Accessed by Leadership, Owners, Residents, and Tenants.

## Workforce Management Vision
A future system for management and workers to handle operational tasks:
- Management can receive, accept, or reject maintenance tickets, and assign workers.
- Workers can track status, record updates, add notes/media, and mark as complete.
- The system will maintain a fully auditable history.

---

## Planned Five-Stage Roadmap

### Stage 1 — Foundation (Current Scope)
*Explicit Non-Goals for Stage 1: Full UI implementation, frontend screens, announcements, visitor management, maintenance features, and workforce features.*
- Expo + React Native application shell
- Backend service
- PostgreSQL database
- Prisma schema and migrations
- Custom authentication
- User, role, session, and community foundations
- Design-system foundation
- Authentication UI direction

### Stage 2 — Onboarding and authorization
- Join or create community
- Owner verification
- Tenant authorization
- Family-member permissions
- Community membership rules
- Role-based access control

### Stage 3 — Resident experience
- Resident dashboard
- Visitor authorization and OTP
- Advance visitor booking
- Quick-connect actions
- Maintenance-ticket creation
- Home and profile areas

### Stage 4 — Announcements and workforce management
- Leadership, owner, and resident announcement spaces
- Announcement permissions
- Manager ticket acceptance
- Worker delegation
- Work status and records
- Maintenance audit trail

### Stage 5 — Product hardening
- Notifications
- Media uploads
- Search and filtering
- Accessibility
- Security review
- Testing
- Performance
- Production deployment preparation
