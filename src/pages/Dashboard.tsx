import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, LogOut, Sparkles } from "lucide-react";
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
    const { data: { session } } = await supabase.auth.getSession();
    
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">SmartSocialMedia</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} size="sm">
              Voltar ao Site
            </Button>
            <Button variant="ghost" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Greeting Section */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-primary/20">
          <h2 className="text-3xl font-bold mb-2 text-foreground">
            Olá{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
          </h2>
          <p className="text-muted-foreground">
            Bem-vindo ao SmartSocialMedia. Pronto para criar conteúdo incrível?
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-foreground">Últimos Projetos</h3>
            <p className="text-muted-foreground">Seus posts mais recentes</p>
          </div>
          <Button 
            onClick={() => navigate("/create")} 
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Novo Post
          </Button>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">Nenhum post ainda</h3>
            <p className="text-muted-foreground mb-6">
              Comece criando seu primeiro post incrível!
            </p>
            <Button onClick={() => navigate("/create")}>
              Criar Primeiro Post
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="p-6 hover:shadow-glow-lime transition-all duration-300 hover:scale-105">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2 text-foreground">{post.title}</h3>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                    {post.format}
                  </span>
                  <span className="px-2 py-1 bg-accent/10 text-accent rounded">
                    {post.style}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(post.created_at).toLocaleDateString("pt-BR")}
                </p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}