import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization")!;
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supa.auth.getUser();
    if (!user?.email) throw new Error("Not authenticated");

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2025-08-27.basil" });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      return resp({ subscribed: false, plan_slug: null });
    }
    const customerId = customers.data[0].id;
    const subs = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });

    if (subs.data.length === 0) {
      await admin.from("user_credits").update({
        plan_slug: null, subscription_status: "inactive", stripe_customer_id: customerId,
      }).eq("user_id", user.id);
      return resp({ subscribed: false, plan_slug: null });
    }

    const sub = subs.data[0];
    const priceId = sub.items.data[0].price.id;
    const { data: plan } = await admin.from("subscription_plans").select("*").eq("stripe_price_id", priceId).single();
    if (!plan) return resp({ subscribed: true, plan_slug: null, warning: "Unknown price" });

    const periodStart = new Date(sub.current_period_start * 1000).toISOString();
    const periodEnd = new Date(sub.current_period_end * 1000).toISOString();

    // Get current row to detect renewal (period_start changed)
    const { data: current } = await admin.from("user_credits").select("period_start, plan_slug").eq("user_id", user.id).single();

    const isNewPeriod = !current?.period_start || current.period_start !== periodStart;
    const isPlanChange = current?.plan_slug !== plan.slug;

    if (isNewPeriod || isPlanChange) {
      await admin.from("user_credits").update({
        plan_slug: plan.slug,
        credits_remaining: plan.credits_per_month,
        credits_total_month: plan.credits_per_month,
        period_start: periodStart,
        period_end: periodEnd,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        subscription_status: "active",
      }).eq("user_id", user.id);

      await admin.from("credit_transactions").insert({
        user_id: user.id, delta: plan.credits_per_month,
        reason: isPlanChange ? `plan_change:${plan.slug}` : `renewal:${plan.slug}`,
      });
    } else {
      await admin.from("user_credits").update({
        subscription_status: "active", period_end: periodEnd, stripe_subscription_id: sub.id,
      }).eq("user_id", user.id);
    }

    return resp({ subscribed: true, plan_slug: plan.slug, period_end: periodEnd });
  } catch (e: any) {
    console.error(e);
    return resp({ error: e.message }, 500);
  }
});

function resp(b: any, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
