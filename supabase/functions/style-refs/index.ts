import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });

const BUCKET = "style-refs";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const action = String(body.action ?? "list");

  // identify caller (optional for list)
  const authHeader = req.headers.get("Authorization") ?? "";
  let userId: string | null = null;
  let isAdmin = false;
  if (authHeader) {
    const { data } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
    userId = data.user?.id ?? null;
    if (userId) {
      const { data: role } = await admin.rpc("has_role", { _user_id: userId, _role: "admin" });
      isAdmin = role === true;
    }
  }

  try {
    if (action === "list") {
      const { data, error } = await admin
        .from("style_references")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;

      const refs = await Promise.all(
        (data ?? []).map(async (r) => {
          const { data: signed } = await admin.storage
            .from(BUCKET)
            .createSignedUrl(r.image_path, 60 * 60 * 6);
          return {
            id: r.id,
            label: r.label,
            description: r.description,
            category: r.category,
            sort_order: r.sort_order,
            image_path: r.image_path,
            url: signed?.signedUrl ?? null,
          };
        }),
      );
      return json({ refs, isAdmin });
    }

    if (!isAdmin) return json({ error: "forbidden" }, 403);

    if (action === "create") {
      const { label, description, category, fileBase64, fileName, contentType, sort_order } =
        body as Record<string, string | number>;
      if (!label || !fileBase64 || !fileName) return json({ error: "missing fields" }, 400);

      const bin = Uint8Array.from(atob(String(fileBase64)), (c) => c.charCodeAt(0));
      const path = `${category ?? "empreendedorismo"}/${crypto.randomUUID()}-${String(fileName).replace(/[^\w.-]/g, "_")}`;

      const { error: upErr } = await admin.storage.from(BUCKET).upload(path, bin, {
        contentType: String(contentType ?? "image/webp"),
        upsert: false,
      });
      if (upErr) throw upErr;

      const { error: insErr } = await admin.from("style_references").insert({
        label: String(label),
        description: description ? String(description) : null,
        category: String(category ?? "empreendedorismo"),
        image_path: path,
        sort_order: Number(sort_order ?? 100),
        created_by: userId,
      });
      if (insErr) throw insErr;
      return json({ ok: true });
    }

    if (action === "delete") {
      const id = String(body.id ?? "");
      if (!id) return json({ error: "missing id" }, 400);
      const { data: row } = await admin
        .from("style_references")
        .select("image_path")
        .eq("id", id)
        .maybeSingle();
      if (row?.image_path) await admin.storage.from(BUCKET).remove([row.image_path]);
      const { error } = await admin.from("style_references").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "reorder") {
      const items = (body.items ?? []) as { id: string; sort_order: number }[];
      for (const it of items) {
        await admin.from("style_references").update({ sort_order: it.sort_order }).eq("id", it.id);
      }
      return json({ ok: true });
    }

    return json({ error: "unknown action" }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "unexpected error" }, 500);
  }
});
