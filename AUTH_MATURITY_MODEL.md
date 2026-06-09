# PromptDrop authentication maturity model

A staged path from Foundation to Expert. Each item is marked Implemented now,
Partially implemented, Planned, or Not started. The architecture is built so that
later levels add on without rewriting the platform.

## Level 1: Foundation

- Email and password auth - Implemented now.
- Secure password handling via Supabase Auth - Implemented now.
- Guest / local mode where allowed - Implemented now (local-only, no cloud writes).
- Basic session management - Implemented now (Supabase sessions, persisted).
- Email verification - Implemented now (Supabase flow).
- Password reset - Implemented now (non-enumerating copy).
- Protected app routes - Partially implemented (desktop `/app` requires an account;
  guest-allowed vs cloud-only route groups still to be split out).
- Profile creation on signup - Implemented now (trigger creates profile + personal
  workspace + owner membership + free entitlement).
- RLS basics / tenant isolation - Implemented now and verified in production.

## Level 2: Intermediate

- MFA support - Planned. The account context already reads the authenticator assurance
  level so status can be shown truthfully.
- TOTP enrolment - Planned (Supabase `mfa.enroll` / `challenge`).
- Recovery codes - Planned (depends on Supabase support).
- Session / device management - Partially implemented (Supabase sessions exist; a
  device list and "sign out everywhere" UI are Planned).
- Re-authentication for sensitive actions - Planned (delete account, change email,
  disable MFA, change billing, export all data).
- Account security page - Planned (`/app/account/security`, no faked devices or events).
- Security event logging table - Implemented now (`security_events`, service-role write,
  user-read-own); population is Planned.

## Level 3: Advanced

- OAuth / OIDC social login - Planned. Google first. The tenant context keys off
  `app_metadata.providers`, so this is configuration plus a button.
- Team workspaces - Partially implemented. The `workspaces` / `workspace_members`
  tables, roles (owner, admin, editor, presenter, viewer), and role-based RLS already
  support multiple members; invite and team-management UI is Planned.
- SSO / SAML for enterprise - Planned (workspace `type = 'enterprise'` and membership
  model are ready).
- Enterprise audit logs - Partially implemented. `audit_logs` exists with owner/admin
  read and service-role write; `user_signup` is logged today. Broader event coverage is
  Planned.
- Centralized workspace identity - Implemented now structurally (single workspace model
  for personal, team, and enterprise).

## Level 4: Expert

- Passwordless / passkeys (WebAuthn) - Not started. No fake UI; the auth layer is
  provider-agnostic so this can be added cleanly.
- Continuous risk checks - Not started. `security_events` carries `risk_level`,
  `ip_address`, `user_agent`, `device_fingerprint` for when this is built.
- Suspicious session detection - Not started.
- Adaptive trust signals - Not started.
- Device trust framework - Not started (`device_fingerprint` column reserved).
- Security event logging - Partially implemented (table exists; risk scoring Planned).
- Shared signals / zero-trust session review - Not started.

## Why later levels need no rewrite

- Identity and access decisions already run through `auth.uid()` and RLS, so new auth
  methods (OAuth, passkeys) change how a user signs in, not how access is enforced.
- Tenancy is already workspace-based, so teams and enterprise tenants are new rows, not a
  new schema.
- Entitlements are already a server-authoritative table with a sync trigger, so new plans
  or billing events update one place.
- Roles are explicit (`workspace_members.role`) and checked by helper functions, so new
  permissions extend the role set and the central feature gate rather than touching
  components.
- Audit and security-event tables already exist, so logging and risk features have a home.
