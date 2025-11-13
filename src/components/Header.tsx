import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderProps {
  lang: "pt" | "en" | "es";
  setLang: (lang: "pt" | "en" | "es") => void;
}

export const Header = ({ lang, setLang }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const translations = {
    pt: {
      home: "Início",
      formats: "Formatos",
      clone: "Clone IA",
      pricing: "Planos",
      custom: "Sob Medida",
      login: "Entrar",
      dashboard: "Dashboard",
      logout: "Sair",
    },
    en: {
      home: "Home",
      formats: "Formats",
      clone: "AI Clone",
      pricing: "Pricing",
      custom: "Custom",
      login: "Login",
      dashboard: "Dashboard",
      logout: "Logout",
    },
    es: {
      home: "Inicio",
      formats: "Formatos",
      clone: "Clon IA",
      pricing: "Planes",
      custom: "Personalizado",
      login: "Iniciar Sesión",
      dashboard: "Panel",
      logout: "Salir",
    },
  };

  const t = translations[lang];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-lime bg-clip-text text-transparent">
          Smart Social Media
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollToSection("hero")} className="text-foreground hover:text-primary transition-colors">
            {t.home}
          </button>
          <button onClick={() => scrollToSection("formats")} className="text-foreground hover:text-primary transition-colors">
            {t.formats}
          </button>
          <button onClick={() => scrollToSection("clone")} className="text-foreground hover:text-primary transition-colors">
            {t.clone}
          </button>
          <button onClick={() => scrollToSection("pricing")} className="text-foreground hover:text-primary transition-colors">
            {t.pricing}
          </button>
          <button onClick={() => scrollToSection("custom")} className="text-foreground hover:text-primary transition-colors">
            {t.custom}
          </button>

          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm" onClick={() => setLang("pt")} className={lang === "pt" ? "text-primary" : ""}>
              PT
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLang("en")} className={lang === "en" ? "text-primary" : ""}>
              EN
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLang("es")} className={lang === "es" ? "text-primary" : ""}>
              ES
            </Button>
          </div>

          {user ? (
            <div className="flex items-center gap-2 ml-4 border-l border-border pl-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <User className="w-4 h-4 mr-2" />
                {t.dashboard}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/auth")} className="ml-4">
              {t.login}
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border md:hidden animate-fade-in">
            <div className="flex flex-col p-4 gap-4">
              <button onClick={() => scrollToSection("hero")} className="text-left text-foreground hover:text-primary transition-colors">
                {t.home}
              </button>
              <button onClick={() => scrollToSection("formats")} className="text-left text-foreground hover:text-primary transition-colors">
                {t.formats}
              </button>
              <button onClick={() => scrollToSection("clone")} className="text-left text-foreground hover:text-primary transition-colors">
                {t.clone}
              </button>
              <button onClick={() => scrollToSection("pricing")} className="text-left text-foreground hover:text-primary transition-colors">
                {t.pricing}
              </button>
              <button onClick={() => scrollToSection("custom")} className="text-left text-foreground hover:text-primary transition-colors">
                {t.custom}
              </button>

              <div className="flex gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => setLang("pt")} className={lang === "pt" ? "text-primary" : ""}>
                  PT
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setLang("en")} className={lang === "en" ? "text-primary" : ""}>
                  EN
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setLang("es")} className={lang === "es" ? "text-primary" : ""}>
                  ES
                </Button>
              </div>

              {user ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="justify-start">
                    <User className="w-4 h-4 mr-2" />
                    {t.dashboard}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t.logout}
                  </Button>
                </div>
              ) : (
                <Button variant="default" size="sm" onClick={() => navigate("/auth")} className="w-full">
                  {t.login}
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};