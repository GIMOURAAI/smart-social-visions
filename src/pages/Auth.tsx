import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Login realizado com sucesso!", description: "Bem-vindo de volta." });
        const completed = data.user?.user_metadata?.onboarding_completed === true;
        navigate(completed ? "/dashboard" : "/onboarding");
      } else {
        const { data: signupData, error: signupError } = await supabase.functions.invoke("signup-user", {
          body: { email, password, fullName },
        });

        if (signupError) throw signupError;
        if (signupData?.error === "ALREADY_EXISTS") {
          toast({ title: "Conta já existe", description: "Esse email já está cadastrado. Faça login." });
          setIsLogin(true);
          return;
        }
        if (signupData?.error) throw new Error(signupData.error);

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.session) throw new Error("Não foi possível iniciar sua sessão.");

        toast({ title: "Conta criada com sucesso!", description: "Agora escolha como você vai usar o Smart Post AI." });
        navigate("/onboarding");
      }
    } catch (error: any) {
      const msg = error?.message || "";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
        toast({ title: "Conta já existe", description: "Esse email já está cadastrado. Faça login." });
        setIsLogin(true);
      } else {
        toast({ title: "Erro", description: msg || "Não foi possível concluir a autenticação.", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spa-dark spa-ambient spa-auth-shell text-foreground">
      <div className="spa-auth-wrap">
        <div className="spa-auth-brand">
          <h1>Smart Post AI</h1>
          <p>{isLogin ? "Entre para continuar criando." : "Crie sua conta e comece agora."}</p>
        </div>

        <div className="spa-auth-card">
          <div className="spa-auth-tabs" role="tablist" aria-label="Entrar ou criar conta">
            <button type="button" className={`spa-auth-tab ${isLogin ? "is-active" : ""}`} onClick={() => setIsLogin(true)}>
              Entrar
            </button>
            <button type="button" className={`spa-auth-tab ${!isLogin ? "is-active" : ""}`} onClick={() => setIsLogin(false)}>
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="spa-auth-field">
                <label htmlFor="fullName">Nome completo</label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Seu nome"
                  className="spa-auth-input"
                />
              </div>
            )}

            <div className="spa-auth-field">
              <label htmlFor="email">E-mail</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="spa-auth-input"
              />
            </div>

            <div className="spa-auth-field">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="password">Senha</label>
                {isLogin && <span className="text-xs text-muted-foreground">Mínimo 6 caracteres</span>}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="spa-auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="spa-auth-submit" disabled={loading}>
              {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <div className="spa-auth-footer">
            {isLogin ? "Ainda não tem conta? " : "Já tem uma conta? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Criar conta" : "Fazer login"}
            </button>
          </div>
        </div>

        <div className="spa-auth-footer mt-5">
          <button type="button" onClick={() => navigate("/")}>← Voltar para o site</button>
        </div>
      </div>
    </div>
  );
}
