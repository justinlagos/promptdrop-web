# PromptDrop authentication and tenant security audit

Project: Supabase `wbqteajanwvfcwvjqozt`. Status at this milestone: the database tenant
foundation and row level security are live and verified in production. The frontend
tenant architecture (providers, central feature gate, server-authoritative entitlements)
is in place. Several UX surfaces and Level 2 to Level 4 features are scoped but not yet
built, and are listed under "Known limitations" and "Roadmap".

## Authentication architecture (summary)

Authentication is handled by Supabase Auth (email and password today, OAuth and MFA on
the roadmap). Identity is the single source of truth: `auth.uid()` drives every access
decision through Postgres row level security, not the client. The frontend resolves a
tenant context (user, profile, workspace, role, plan, entitlement) and exposes it through
React providers, but it is advisory only. The authoritative checks live in the database.

Tenancy is modelled as workspaces. Every authenticated user gets a personal workspace on
signup, with an owner membership and a free billing entitlement, created by a
`SECURITY DEFINER` trigger. Teams and enterprise tenants reuse the same workspace and
membership tables, so they can be added without a schema rewrite.

## Auth flows implemented

- Email and password sign up, sign in, sign out (Supabase Auth).
- Email verification and password reset use the standard Supabase flows.
- Guest mode is local only: guest scripts and recordings live in the browser
  (IndexedDB) and are never written to cloud tables unless the user signs up and
  explicitly migrates them (`migrateGuestScripts`).
- Profile, personal workspace, owner membership, and free entitlement are created
  automatically on signup; `ensure_personal_workspace()` repairs the context if anything
  is missing, so the app never crashes for a user without a workspace.

## Guest mode is local-only

Confirmed. The mobile app and desktop studio store guest scripts and recordings in
IndexedDB. No cloud writes happen without an authenticated session. Migration is opt-in
and writes only into the user's own personal workspace, enforced by RLS.

## Database tenancy implemented

Tables created (all RLS enabled): `workspaces`, `workspace_members`,
`billing_entitlements`, `audit_logs`, `security_events`, `takes`, `transcripts`,
`meetings`, `meeting_questions`. `profiles` extended with `avatar_url`, `updated_at`,
`default_workspace_id`, `onboarding_completed`. `scripts` extended with `workspace_id`,
`owner_id`, `format`, `folder_id`, `deleted_at` (existing per-user columns and policies
preserved for backward compatibility).

Every existing user was backfilled with a personal workspace, owner membership, an
entitlement mirroring their subscription plan, and `scripts.workspace_id` / `owner_id`.

## RLS enabled on all tenant tables

Yes. `workspaces`, `workspace_members`, `billing_entitlements`, `audit_logs`,
`security_events`, `scripts`, `takes`, `transcripts`, `meetings`, `meeting_questions`
all have RLS enabled with role-based policies. `profiles` and `subscriptions` already had
RLS.

Helper functions (all `SECURITY DEFINER`, fixed `search_path`, callable only by
`authenticated`, never `anon`): `is_workspace_member`, `has_workspace_role`,
`is_workspace_owner`, `can_view_workspace`, `can_edit_workspace`, `can_present_workspace`,
`can_admin_workspace`, `can_manage_billing`, `can_access_entitlement`, `plan_rank`,
`uid_safe`, `ensure_personal_workspace`.

Policy summary:
- scripts, takes, transcripts, meetings: members view; editor and above (or the record
  owner) write; viewers cannot create or delete; presenters can create takes and meetings.
- meeting_questions: members view; members create their own; owner or editor manage.
- billing_entitlements: owner and admin read only; no client writes (service role only).
- audit_logs: owner and admin read only; no client writes.
- security_events: user reads own only; no client writes.

## Policies tested (verified in production)

Impersonating user A and querying user B's data returned zero rows for B's workspace,
B's entitlement, and B's scripts, while A saw exactly one of each of their own. Cross
tenant isolation holds at the database level.

What remains to be tested with automated tests: viewer cannot update scripts, presenter
cannot delete workspace, admin can invite a member, non-owner cannot manage billing,
client cannot update `billing_entitlements`. The policies are written to enforce these;
the automated test suite is on the roadmap below.

## Billing entitlement protected

Yes. `billing_entitlements` has no client write policy, so the frontend cannot change a
plan. A `SECURITY DEFINER` trigger mirrors the existing Stripe webhook target
(`subscriptions`) into `billing_entitlements`, so the plan is updated only by the
server-side webhook flow. The frontend reads the entitlement for display, but the
authoritative plan is the entitlement row, and feature access is ultimately enforced by
RLS and server-side functions.

## Stripe server-only

Confirmed. The Stripe secret key lives only in Supabase Edge Function secrets. The
frontend ships the publishable Supabase key only. Checkout and portal sessions are
created server-side. If Stripe secrets are missing, checkout returns an honest
"payments are not switched on yet" state and never fakes a subscription.

## Storage policies (planned)

Buckets `recordings`, `meeting-recordings`, `exports`, `avatars` with the path
convention `workspace_id/user_id/file_id` and signed URLs for media. Not yet created;
today recordings are local-first (IndexedDB). Storage RLS is on the roadmap and is a
prerequisite for the server-side render export and for cloud recording sync.

## No fake plan state, no mock username

Confirmed across the app: no mock user, no demo plan, no localStorage plan override. A
guest is shown as "Guest". An authenticated user resolves a real display name from their
profile or email. The plan shown comes from the entitlement row.

## MFA status

Not yet enabled. The context reads the Supabase authenticator assurance level so the
account security page can show real MFA status when enrolment is added (Level 2).

## OAuth status

Not yet enabled. Google sign-in is the first planned provider (Level 3). The auth
service and tenant context already key off `app_metadata.providers`, so adding Google
is configuration plus a button, not a rewrite.

## Password reset status

Standard Supabase reset flow, with non-enumerating copy ("Check your email for the
reset link").

## Mobile auth QA

The mobile app already gates behind a real Supabase sign in/up screen with a consent
checkbox, full-width controls, and large touch targets. Remaining mobile auth polish
(password visibility toggle, dedicated reset screen, bottom-sheet upgrade prompts,
account security page) is on the roadmap.

## Honest unavailable states

If Supabase env vars are missing, the cloud client is null and the app runs in honest
local mode ("Cloud accounts are not connected yet"); guest/local still works, no fake
login. If Stripe secrets are missing, pricing shows plans and upgrade shows an honest
unavailable state.

## Known limitations (this milestone)

- Frontend route protection groups (`/app/cloud`, `/app/workspace`, `/app/billing`,
  `/app/team`) and the account security page are scoped but not yet built.
- MFA, OAuth, passkeys not yet enabled (Level 2 to 4).
- Storage buckets and storage RLS not yet created.
- `migrate-guest-data`, `create-personal-workspace`, `log-audit-event`, and
  `secure-delete-account` exist today as the `ensure_personal_workspace` RPC and the
  `migrateGuestScripts` client helper; dedicated edge functions are on the roadmap.
- Automated RLS / feature-gate / mobile test suite not yet added.
- Supabase "leaked password protection" (HaveIBeenPwned) should be enabled in the Auth
  dashboard (one toggle).
- Desktop teleprompter takes are recorded inside the studio iframe's local store and are
  not yet bridged to cloud tables.

## Acceptance criteria status

1. No mock username anywhere - met. 2. Guests clearly local-only - met. 3. Authenticated
users get a real profile and personal workspace - met. 4. Every cloud record belongs to a
workspace - met (new tables require `workspace_id`; scripts backfilled). 5. RLS on every
tenant table - met. 6. Users cannot access records outside their workspace - met and
verified. 7. Billing entitlements not client-writable - met. 8. Paid access from
server-backed entitlements - met at the data layer; full UI gating wiring in progress.
9. Mobile auth works - met for core flows; polish pending. 10 to 12. Future teams, SSO,
passkeys without rewrite - met structurally. 13. No secrets in the frontend - met. 14.
Missing services show honest states - met. 15. Documented - this file and the maturity
model.
