import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultLandingContent, type LandingContent } from "@/content/landing";

const STORAGE_KEY = "smartpost:landing-content";

function merge(base: LandingContent, override: unknown): LandingContent {
  if (!override || typeof override !== "object") return base;
  const patch = override as Record<string, unknown>;
  const out: Record<string, unknown> = { ...(base as unknown as Record<string, unknown>) };
  for (const [key, value] of Object.entries(patch)) {
    const current = out[key];
    if (value && typeof value === "object" && !Array.isArray(value) && current && typeof current === "object" && !Array.isArray(current)) {
      out[key] = merge(current as LandingContent, value);
    } else if (value !== undefined && value !== null) {
      out[key] = value;
    }
  }
  return out as unknown as LandingContent;
}

function readLocal(): unknown {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Reads the landing page content: database first (published for everyone), local draft as fallback. */
export function useLandingContent() {
  const [content, setContent] = useState<LandingContent>(() => merge(defaultLandingContent, readLocal()));
  const [loading, setLoading] = useState(true);
  const [remoteAvailable, setRemoteAvailable] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("landing_content")
      .select("data")
      .eq("id", "default")
      .maybeSingle();

    if (!error) {
      setRemoteAvailable(true);
      setContent(merge(defaultLandingContent, data?.data ?? null));
    } else {
      setRemoteAvailable(false);
      setContent(merge(defaultLandingContent, readLocal()));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (next: LandingContent) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setContent(next);
    const { error } = await (supabase as any)
      .from("landing_content")
      .upsert({ id: "default", data: next, updated_at: new Date().toISOString() });
    return { published: !error, error: error?.message as string | undefined };
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(defaultLandingContent);
  }, []);

  return { content, setContent, loading, save, reset, reload: load, remoteAvailable };
}
