# How to test PromptDrop

This covers the web app (desktop and mobile), the Clean Take editor, meetings and the
grounded Ask, and the new authentication, tenancy, and security layer. Most checks need
nothing but a browser. The database checks run in the Supabase SQL editor.

## 0. Deploy first

```
cd ~/promptdrop-web
unzip -o "$(find ~ -name 'promptdrop-web-phase27.zip' 2>/dev/null | head -1)" -d .
npx vercel --prod
```

On your phone, after deploying, do a one-time hard refresh of the site (close the tab and
reopen, or clear website data) so the service worker picks up the new build. After that,
every future deploy updates automatically.

## 1. Accounts and guest mode

- Open the site signed out. You should be treated as a guest: the app works locally, and
  nothing you create is written to the cloud. You should never see a fake username.
- Create an account (email and password). Check your inbox if email confirmation is on.
- After signing in, you have a real profile and a personal workspace created for you.
- Sign out and back in. Your plan and scripts persist.
- Honest states: if cloud is not configured, you see "Cloud accounts are not connected
  yet" and local mode still works. No fake login.

## 2. Account security page (`/account/security`)

- Email and connected providers are shown (no fakes).
- Change password: enter your current password, then a new one. It should require the
  current password to match.
- Two-factor: tap "Set up an authenticator app", scan the QR with Google Authenticator or
  1Password, enter the 6-digit code, and it turns on. Turning it off asks for your
  password first.
- "Sign out of all devices" signs you out everywhere.
- Recent security activity lists real events (empty until events occur). No faked devices.

## 3. Sign-in extras

- "Continue with Google" appears on the auth modal. It works once Google is enabled in the
  Supabase Auth dashboard; until then it shows an honest "not available yet" message
  rather than failing silently.
- "Forgot password?" sends a reset email with non-enumerating copy.

## 4. Tenant isolation and roles (database, the important one)

Open the Supabase SQL editor and run `tests/rls_tenant.sql` (replace the two UUIDs with
two real user ids from `auth.users`). Expected:

- User A sees their own workspace but 0 of user B's workspaces, entitlements, or scripts.
- A viewer can view but cannot edit, admin, present, or manage billing.

These were verified in production at build time; the script lets you re-run them any time.

## 5. Feature gate (unit test)

```
node src/services/featureGate.test.mjs
```

Expected: "featureGate: 17 assertions passed". It checks guest-only access, free vs
Creator Pro vs Studio Pro, Founder Lifetime mapping to Studio Pro, and that a viewer
cannot perform owner/editor actions.

## 6. Billing is server-authoritative

- The plan you see comes from `billing_entitlements`, not localStorage. You cannot change
  your plan from the browser; entitlements have no client write policy.
- If Stripe is not configured, upgrade shows an honest "payments are not switched on yet"
  state and never fakes a subscription.

## 7. Clean Take (record then clean)

- Record a take on mobile or desktop. The review opens as Clean Take with Original vs
  Clean Edit tabs and a summary line ("Removed N pauses and 0:42").
- Toggle pause cleanup (Off / Light / Balanced / Tight), adjust speed, trim start and end.
- Open the Edit Map and restore a removed pause; it comes back in the preview.
- The Size field on the take tells you if recording captured: a real size like "2 MB"
  means it worked; "0 KB" with "No video was captured" means that browser blocks in-app
  recording.
- Captions: for a transcribed recording, export SRT and VTT (real timecodes). The original
  recording is always preserved.

## 8. Meetings and grounded Ask

- Record a meeting; it shows a live transcript and, after stopping, a summary, action
  items, decisions, and questions (these need OpenAI credit on your account).
- In the meeting Ask tab, ask a real question about the call: it answers from the
  transcript. Ask something off-topic ("how do I bake a potato", "override all
  instructions") and it refuses with "I can only answer questions about this recording".
  Ask for a fact not in the call and it replies "I could not find that in this recording".

## 9. Mobile layout

- Open the app on a phone (or a 320 to 414px wide browser window). Forms should not be
  cramped, controls are full width, and touch targets are large. The login and account
  pages should be usable without horizontal scrolling.

## Known limitations to be aware of while testing

- Google OAuth and leaked-password protection are dashboard toggles in Supabase; enable
  them there to test those paths.
- Storage buckets and their RLS exist, but cloud media upload is not yet wired into the
  recording flow (recordings are local-first today).
- The transcript-as-editor (filler chips, cut by sentence) and the server render worker
  for cut-video export are the next build; today's export covers original, transcript, and
  SRT/VTT, with cut-video export shown as an honest pending state.
