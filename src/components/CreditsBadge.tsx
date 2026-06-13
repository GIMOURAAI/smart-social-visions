import { useNavigate } from "react-router-dom";
import { useCredits } from "@/hooks/useCredits";
import { Coins, Loader2 } from "lucide-react";

export function CreditsBadge() {
  const { remaining, total, planSlug, loading } = useCredits();
  const navigate = useNavigate();
  if (loading) return null;
  const low = remaining === 0;
  return (
    <button
      onClick={() => navigate("/pricing")}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        low ? "bg-red-500/15 text-red-600 hover:bg-red-500/25" : "bg-primary/10 text-primary hover:bg-primary/20"
      }`}
      title={planSlug ? `Plano ${planSlug}` : "Sem plano"}
    >
      <Coins className="w-3.5 h-3.5" />
      <span>{remaining}{total ? `/${total}` : ""}</span>
      {!planSlug && <span className="text-[10px] opacity-70">· upgrade</span>}
    </button>
  );
}
