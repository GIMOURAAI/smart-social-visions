import { useNavigate } from "react-router-dom";
import { useCredits } from "@/hooks/useCredits";
import { Coins } from "lucide-react";

export function CreditsBadge() {
  const { remaining, total, planSlug, loading } = useCredits();
  const navigate = useNavigate();
  if (loading) return null;
  const low = remaining === 0;
  return (
    <button
      onClick={() => navigate("/pricing")}
      className={`spa-credit-badge inline-flex items-center gap-2 text-xs font-semibold transition ${low ? "is-empty" : ""}`}
      title={planSlug ? `Plano ${planSlug}` : "Sem plano"}
    >
      <Coins className="w-4 h-4" />
      <span>{remaining}{total ? `/${total}` : ""}</span>
      {!planSlug && <span className="text-[10px] opacity-65">· planos</span>}
    </button>
  );
}
