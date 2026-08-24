import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Eye, EyeOff } from "lucide-react";

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

  return <div className="spa-dark spa-ambient min-h-screen flex items-center justify-center p-4"><Card className="w-full max-w-md p-8 spa-surface border-0 shadow-card"><div className="flex items-center justify-center mb-8"><Sparkles className="w-8 h-8 text-primary mr-2" /><h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Smart Social Media</h1></div><h2 className="text-2xl font-bold text-center mb-6 text-foreground">{isLogin ? "Entrar" : "Criar Conta"}</h2><form onSubmit={handleSubmit} className="space-y-4">{!isLogin && <div><Label htmlFor="fullName">Nome Completo</Label><Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Seu nome" className="mt-1" /></div>}<div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" className="mt-1" /></div><div><Label htmlFor="password">Senha</Label><div className="relative mt-1"><Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} className="pr-10" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div><Button type="submit" className="w-full" disabled={loading}>{loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}</Button></form><div className="mt-6 text-center"><button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-primary transition-colors">{isLogin ? "Não tem conta? Criar uma" : "Já tem conta? Fazer login"}</button></div><div className="mt-6 text-center"><button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-primary transition-colors">← Voltar para o site</button></div></Card></div>;
}
