
REVOKE EXECUTE ON FUNCTION public.consume_credit(uuid, integer, text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_credit(uuid, integer, text, uuid) TO service_role;
