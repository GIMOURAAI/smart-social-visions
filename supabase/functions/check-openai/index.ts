const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) {
    return new Response(JSON.stringify({ ok: false, reason: "missing" }), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
  const r = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
  });
  const body = await r.text();
  return new Response(
    JSON.stringify({
      ok: r.ok,
      status: r.status,
      preview: body.slice(0, 300),
      keyPrefix: key.slice(0, 7),
    }),
    { headers: { ...corsHeaders, "content-type": "application/json" } },
  );
});
