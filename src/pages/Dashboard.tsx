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
  ArrowRight,
  Image as ImageIcon,
  CalendarDays,
  Trash2,
  Copy,
  Zap,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useCredits } from "@/hooks/useCredits";

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
  const [showCloneList, setShowCloneList] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const credits = useCredits();

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
    // Sync subscription state from Stripe (fires plan renewals + plan changes)
    supabase.functions.invoke("check-subscription").catch(() => {});
  };

  const clonePost = async (post: Post, e: React.MouseEvent) => {
    e.stopPropagation();
    const { data, error } = await supabase.from("posts").insert({
      user_id: user!.id,
      title: `${post.title} (cópia)`,
      format: post.format,
      style: post.style,
      image_url: post.image_url,
      content: (post as any).content ?? null,
    }).select().single();
    if (error) {
      toast({ title: "Erro ao copiar", description: error.message, variant: "destructive" });
    } else {
      setPosts((prev) => [data, ...prev]);
      toast({ title: "Post copiado!", description: "A cópia foi adicionada aos seus projetos." });
    }
  };

  const deletePost = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Excluir este post? Essa ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast({ title: "Post excluído" });
    }
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
      <div className="spa-dark min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary font-semibold">
          Carregando...
        </div>
      </div>
    );
  }

  const username = user?.email?.split("@")[0] ?? "criador";
  const used = posts.length;
  const remaining = credits.remaining;
  const planLabel = credits.planSlug ? credits.planSlug.charAt(0).toUpperCase() + credits.planSlug.slice(1) : "Free";

  return (
    <div className="spa-dark spa-ambient min-h-screen text-foreground">
      {/* HERO escuro roxo */}
      <section className="relative overflow-hidden bg-gradient-hero text-white rounded-b-[2.5rem] shadow-glow">
        {/* glows decorativos */}
        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-[hsl(var(--pink-glow,285_75%_65%))]/20 blur-3xl" />

        {/* topo */}
        <div className="relative z-10 px-5 pt-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
            aria-label="Voltar ao site"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Brand + Plano */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight">
              SmartPost
              <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                AI
              </span>
            </span>
            <button onClick={() => navigate("/pricing")} className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow hover:opacity-90">
              {planLabel}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-white/15 backdrop-blur flex items-center justify-center hover:bg-white/25 transition"
            aria-label="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* saudação */}
        <div className="relative z-10 px-6 pt-10 pb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60 mb-2">
            Workspace
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Olá, {username}! 👋
          </h1>
          <p className="text-white/75 mt-2 text-sm md:text-base max-w-md">
            Pronto para criar conteúdo que converte? Vamos começar.
          </p>

          {/* stats pills */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <StatPill label="Posts criados" value={used} />
            <StatPill label="Créditos totais" value={credits.total} />
            <StatPill label="Créditos restantes" value={remaining} />
          </div>
        </div>
      </section>

      {/* CARD DE AÇÕES */}
      <section className="px-4 -mt-8 relative z-20">
        <div className="bg-card rounded-3xl shadow-card p-5 md:p-6 space-y-3">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">Criar agora</h2>
            <p className="text-xs text-muted-foreground">
              Escolha o que deseja criar
            </p>
          </div>

          {/* Porta 1: Criação Rápida */}
          <button
            onClick={() => navigate("/rapido")}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(258_70%_45%)] to-[hsl(275_75%_60%)] p-5 text-left text-white shadow-glow hover:shadow-[0_0_40px_hsl(258_70%_45%/0.5)] transition-all hover:-translate-y-0.5"
          >
            <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base">Criação Rápida</p>
                <p className="text-xs text-white/75 mt-0.5">
                  3 escolhas e o post sai pronto — design profissional automático
                </p>
              </div>
              <ArrowRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* Porta 2: Studio completo */}
          <button
            onClick={() => navigate("/create")}
            className="group relative w-full overflow-hidden rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 p-5 text-left transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-foreground">Smart Post Studio</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Wizard completo com IA — briefing, estilo, blocos e legenda
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </button>


          {/* Secondary action: 7 days */}
          <button
            onClick={() => navigate("/create?mode=7days")}
            className="group relative w-full overflow-hidden rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 p-5 text-left transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base text-foreground">
                  Criar conteúdo para 7 dias
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Gere uma semana completa de posts de uma vez
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </button>

          {/* Clonar post */}
          {posts.length > 0 && (
            <div>
              <button
                onClick={() => setShowCloneList((v) => !v)}
                className="group relative w-full overflow-hidden rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/5 hover:bg-fuchsia-500/10 p-5 text-left transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/15 flex items-center justify-center shrink-0">
                    <Copy className="w-6 h-6 text-fuchsia-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-foreground">Clonar post existente</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Duplica um post seu para editar e reusar
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-fuchsia-500 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              {showCloneList && (
                <div className="mt-2 rounded-2xl border border-border bg-card overflow-hidden">
                  {posts.map((post) => (
                    <button
                      key={post.id}
                      onClick={(e) => { clonePost(post, e); setShowCloneList(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition border-b border-border last:border-0"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-card flex items-center justify-center shrink-0">
                        {post.image_url
                          ? <img src={post.image_url} className="w-full h-full object-cover" alt="" />
                          : <ImageIcon className="w-4 h-4 text-white/80" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{post.title || "Sem título"}</p>
                        <p className="text-[10px] text-muted-foreground">{post.format} · {post.style}</p>
                      </div>
                      <Copy className="w-4 h-4 text-fuchsia-500 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => navigate("/create")}
                className="w-full group bg-card rounded-2xl p-4 shadow-card hover:shadow-glow transition-all flex items-center gap-4 text-left hover:-translate-y-0.5"
              >
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
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString("pt-BR")}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => clonePost(post, e)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
                      title="Copiar post"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => deletePost(post.id, e)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition"
                      title="Excluir post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
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
