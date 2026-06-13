import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CreditState {
  remaining: number;
  total: number;
  planSlug: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useCredits(): CreditState {
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [planSlug, setPlanSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("user_credits")
      .select("credits_remaining, credits_total_month, plan_slug")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      setRemaining(data.credits_remaining ?? 0);
      setTotal(data.credits_total_month ?? 0);
      setPlanSlug(data.plan_slug ?? null);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    let channel: ReturnType<typeof supabase.channel> | null = null;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      channel = supabase
        .channel(`uc-${user.id}`)
        .on("postgres_changes",
          { event: "*", schema: "public", table: "user_credits", filter: `user_id=eq.${user.id}` },
          () => load(),
        )
        .subscribe();
    })();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

  return { remaining, total, planSlug, loading, refresh: load };
}
