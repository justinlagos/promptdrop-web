-- RLS regression tests for PromptDrop tenancy. Run in the Supabase SQL editor.
-- Each block runs inside a transaction and ROLLS BACK, so it is safe on production.
-- Replace the two UUIDs with two real auth.users ids before running.

\set userA '00000000-0000-0000-0000-000000000000'
\set userB '11111111-1111-1111-1111-111111111111'

-- 1) Tenant isolation: user A must not see user B's workspace, entitlement, or scripts.
begin;
  set local role authenticated;
  select set_config('request.jwt.claims', json_build_object('sub', :'userA', 'role','authenticated')::text, true);
  select 'A_sees_own_workspaces (>=1)'      as check, count(*) from public.workspaces;
  select 'A_sees_B_workspace (expect 0)'    as check, count(*) from public.workspaces      where owner_id = :'userB';
  select 'A_sees_B_entitlements (expect 0)' as check, count(*) from public.billing_entitlements e join public.workspaces w on w.id=e.workspace_id where w.owner_id = :'userB';
  select 'A_sees_B_scripts (expect 0)'      as check, count(*) from public.scripts          where owner_id = :'userB';
rollback;

-- 2) Role enforcement: a VIEWER can view but not edit / admin / bill / present.
begin;
  -- service-role setup: make A a viewer of B's personal workspace
  insert into public.workspace_members (workspace_id, user_id, role, status)
    select w.id, :'userA', 'viewer', 'active' from public.workspaces w where w.owner_id = :'userB' and w.type='personal'
    on conflict (workspace_id, user_id) do update set role='viewer', status='active';
  set local role authenticated;
  select set_config('request.jwt.claims', json_build_object('sub', :'userA', 'role','authenticated')::text, true);
  select 'viewer_can_view (true)'           as check, public.can_view_workspace(w.id)       from public.workspaces w where w.owner_id=:'userB' and w.type='personal';
  select 'viewer_can_edit (false)'          as check, public.can_edit_workspace(w.id)       from public.workspaces w where w.owner_id=:'userB' and w.type='personal';
  select 'viewer_can_admin (false)'         as check, public.can_admin_workspace(w.id)      from public.workspaces w where w.owner_id=:'userB' and w.type='personal';
  select 'viewer_can_manage_billing (false)'as check, public.can_manage_billing(w.id)       from public.workspaces w where w.owner_id=:'userB' and w.type='personal';
rollback;

-- 3) Billing entitlements are not client-writable: no UPDATE policy exists, so an
--    authenticated user's update affects zero rows (verify in app or via a WITH ... UPDATE
--    CTE under set role authenticated; the policy set has SELECT only for owner/admin).
