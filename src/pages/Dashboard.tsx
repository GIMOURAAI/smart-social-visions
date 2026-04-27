import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  LogOut,
  Sparkles,
  ArrowLeft,
  BookOpen,
  Volume2,
  PenLine,
  TrendingUp,
  Image as ImageIcon,
  Layers,
  ArrowRight,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Post {
  id: string;
  title: string;
  format: string;
  style: string;
  image_url: string | null;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
    loadPosts(session.user.id);
  };

  const loadPosts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar posts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-soft">
        <div className="animate-pulse text-primary font-semibold">
          Carregando...
        </div>
      </div>
    );
  }

  const username = user?.email?.split("@")[0] ?? "criador";
  const totalPosts = posts.length;
  // métricas decorativas
  const goal = 20;
  const progress = Math.min(100, Math.round((totalPosts / goal) * 100));

  const quickActions = [
    {
      label: "Criar Post",
      desc: "Wizard completo",
      icon: Sparkles,
      onClick: () => navigate("/create"),
      gradient: "from-[hsl(258_70%_45%)] to-[hsl(275_75%_60%)]",
    },
    {
      label: "Carrossel",
      desc: "Vários posts",
      icon: Layers,
      onClick: () => navigate("/create"),
      gradient: "from-[hsl(285_75%_65%)] to-[hsl(310_80%_72%)]",
    },
    {
      label: "Reels / Story",
      desc: "Formato 9:16",
      icon: ImageIcon,
      onClick: () => navigate("/create"),
      gradient: "from-[hsl(258_70%_45%)] to-[hsl(265_75%_55%)]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* HERO escuro roxo (estilo referência) */}
      <section className="relative overflow-hidden bg-gradient-hero text-white rounded-b-[2.5rem] shadow-glow">
        {/* glows decorativos */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-[hsl(var(--pink-glow))]/20 blur-3xl" />

        {/* topo */}
        <div className="relative z-10 px-5 pt-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
            aria-label="Voltar ao site"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight">SmartSocial</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* saudação + progresso */}
        <div className="relative z-10 px-6 pt-10 pb-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60 mb-2">
                Workspace
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Olá, {username}! 👋
              </h1>
              <p className="text-white/75 mt-2 text-sm md:text-base max-w-md">
                Pronto para criar conteúdo que converte? Vamos começar.
              </p>
            </div>

            {/* anel de progresso */}
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="hsl(0 0% 100% / 0.2)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={
                    2 * Math.PI * 34 - (2 * Math.PI * 34 * progress) / 100
                  }
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {progress}%
              </div>
            </div>
          </div>

          {/* stats inline */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <StatPill label="Posts" value={totalPosts} />
            <StatPill label="Meta" value={goal} />
            <StatPill label="Streak" value={"7d"} />
          </div>
        </div>
      </section>

      {/* CARD DE AÇÕES (sobreposto, estilo card branco da referência) */}
      <section className="px-4 -mt-8 relative z-20">
        <div className="bg-card rounded-3xl shadow-card p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Criar agora</h2>
              <p className="text-xs text-muted-foreground">
                Escolha o formato e siga o wizard
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("/create")}
              className="rounded-full bg-gradient-primary border-0 shadow-glow"
            >
              <Plus className="w-4 h-4 mr-1" />
              Novo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${a.gradient} p-4 text-left text-white shadow-soft hover:shadow-glow transition-all hover:-translate-y-0.5`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-sm leading-tight">
                    {a.label}
                  </p>
                  <p className="text-[10px] text-white/75 mt-0.5">{a.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ÚLTIMOS PROJETOS */}
      <section className="px-4 mt-8 pb-16">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">
              Últimos Projetos
            </h3>
            <p className="text-xs text-muted-foreground">
              Continue de onde parou
            </p>
          </div>
          <button className="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">
            Ver tudo <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="bg-card rounded-3xl p-10 text-center shadow-card">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold mb-1 text-foreground">
              Nenhum post ainda
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Comece criando seu primeiro post agora
            </p>
            <Button
              onClick={() => navigate("/create")}
              className="rounded-full bg-gradient-primary border-0 shadow-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Post
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, idx) => (
              <button
                key={post.id}
                onClick={() => navigate("/create")}
                className="w-full group bg-card rounded-2xl p-4 shadow-card hover:shadow-glow transition-all flex items-center gap-4 text-left hover:-translate-y-0.5"
              >
                {/* thumb / placeholder */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-card flex items-center justify-center">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-white/80" />
                  )}
                </div>

                {/* infos */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {post.title || "Sem título"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {post.format}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {post.style}
                    </span>
                  </div>
                  {/* mini progress (decorativo) */}
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary rounded-full"
                      style={{ width: `${((idx + 1) * 23) % 100 || 40}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Exercícios / atalhos extras estilo referência */}
        <h3 className="text-xl font-bold text-foreground tracking-tight mt-10 mb-4">
          Ferramentas
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <ToolCard
            icon={BookOpen}
            label="Templates"
            color="from-[hsl(258_70%_45%)] to-[hsl(265_75%_55%)]"
          />
          <ToolCard
            icon={Volume2}
            label="Áudio"
            color="from-[hsl(285_75%_70%)] to-[hsl(305_80%_75%)]"
          />
          <ToolCard
            icon={PenLine}
            label="Legendas"
            color="from-[hsl(258_70%_45%)] to-[hsl(275_75%_55%)]"
          />
        </div>
      </section>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur border border-white/20 px-3 py-3 text-center">
      <p className="text-xl font-extrabold leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-white/70 mt-1">
        {label}
      </p>
    </div>
  );
}

function ToolCard({
  icon: Icon,
  label,
  color,
}: {
  icon: typeof BookOpen;
  label: string;
  color: string;
}) {
  return (
    <button
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} aspect-square p-4 flex flex-col items-center justify-center text-white shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all`}
    >
      <Icon className="w-7 h-7 mb-2" strokeWidth={1.8} />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}
