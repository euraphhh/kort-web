-- Hardening: trigger helpers must not be callable through the API.
-- Triggers fire without an EXECUTE grant on the function, so revoking is safe.
revoke execute on function public.set_updated_at() from public, anon, authenticated;
