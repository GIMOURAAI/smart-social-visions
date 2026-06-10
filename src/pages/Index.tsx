import { useNavigate } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail, Sparkles, CheckCircle2, Wand2 } from "lucide-react";
import { PricingCard } from "@/components/PricingCard";
import heroImage from "@/assets/hero-creator.jpg";
import postFormats from "@/assets/post-formats.jpg";

const Index = () => {
  const navigate = useNavigate();

  const deliverables = [
    "Gancho",
    "Título e subtítulo",
    "Legenda completa",
    "CTA estratégico",
    "Hashtags relevantes",
    "Imagem/design pronto",
    "Prompt visual",
    "Story complementar",
  ];

  const visualStyles = [
    {
      name: "Premium Dark",
      description: "Sofisticado, escuro e elegante",
      color: "from-gray-800 to-gray-900",
      dot: "bg-gray-400",
    },
    {
      name: "Futurista Roxo",
      description: "Tech, vibrante e moderno",
      color: "from-purple-700 to-violet-900",
      dot: "bg-purple-400",
    },
    {
      name: "Feminino Elegante",
      description: "Rose, delicado e sofisticado",
      color: "from-pink-400 to-rose-600",
      dot: "bg-pink-300",
    },
    {
      name: "Minimalista Clean",
      description: "Branco, espaço e clareza",
      color: "from-slate-100 to-slate-200",
      dot: "bg-slate-400",
      dark: true,
    },
    {
      name: "Editorial Sofisticado",
      description: "Clássico, tipográfico e premium",
      color: "from-amber-800 to-stone-900",
      dot: "bg-amber-400",
    },
    {
      name: "Tech Neon",
      description: "Brilhante, digital e chamativo",
      color: "from-cyan-500 to-blue-700",
      dot: "bg-cyan-300",
    },
  ];

  const steps = [
    { number: "1", title: "Escolha seu nicho", description: "Selecione a área de atuação do seu negócio ou perfil." },
    { number: "2", title: "Descreva o tema", description: "Informe o assunto ou objetivo do post que deseja criar." },
    { number: "3", title: "Gere seus posts", description: "A IA cria textos, legendas, CTAs e hashtags prontos." },
    { number: "4", title: "Baixe e publique", description: "Exporte o conteúdo e poste direto nas redes sociais." },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Hero Section */}
      <section className="relative min-h-screen p-3 md:p-6">
        <div className="relative w-full min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] rounded-[2.5rem] overflow-hidden shadow-2xl">
          <img
            src={heroImage}
            alt="Criadora de conteúdo trabalhando no celular e laptop"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{ background: "hsl(258 75% 45% / 0.85)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsl(258 70% 35% / 0.35) 0%, hsl(270 75% 40% / 0.15) 40%, hsl(258 70% 25% / 0.55) 100%)",
            }}
          />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-5 md:p-8">
            <button
              aria-label="Menu"
              className="w-11 h-11 flex flex-col items-start justify-center gap-1.5 text-white"
            >
              <span className="block h-0.5 w-7 bg-white rounded-full" />
              <span className="block h-0.5 w-5 bg-white rounded-full" />
              <span className="block h-0.5 w-7 bg-white rounded-full" />
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-5 py-2 rounded-full text-sm font-bold tracking-wide bg-white/95 text-foreground hover:bg-white transition-all duration-300"
            >
              Entrar
            </button>
          </div>

          {/* Hero text */}
          <div className="relative z-10 h-full min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] flex flex-col justify-end px-7 md:px-14" style={{ paddingBottom: "280px" }}>
            <h1 className="text-white font-extrabold leading-[0.95] tracking-tight text-5xl sm:text-6xl md:text-8xl max-w-4xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
              Crie Posts<br />
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-yellow-300 via-pink-300 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                  em minutos
                </span>
              </span><br />
              usando a IA
            </h1>
            <p className="mt-5 text-white/85 text-lg md:text-2xl max-w-sm">
              Crie posts, legendas, imagens, CTAs, hashtags em um único lugar.
            </p>
          </div>

          {/* CTA card */}
          <div className="absolute left-5 right-5 md:left-8 md:right-8 z-20" style={{ bottom: "24px" }}>
            <div className="bg-card rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col sm:flex-row gap-3 items-stretch">
              <button
                onClick={() => navigate("/auth")}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest text-base md:text-lg py-5 rounded-2xl transition-all duration-300 hover:shadow-glow active:scale-[0.98]"
              >
                COMEÇAR AGORA
              </button>
              <button
                onClick={() => {
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 sm:flex-none sm:px-8 border-2 border-primary text-primary hover:bg-primary/5 font-bold tracking-wide text-base md:text-lg py-5 rounded-2xl transition-all duration-300"
              >
                Ver planos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-soft">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Wand2 className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-5xl font-bold mb-4 text-foreground">Como funciona</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {steps.map((step, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow text-center"
                style={{
                  background: "hsl(258 90% 66%)",
                  boxShadow: "0 10px 30px -10px hsl(258 70% 35% / 0.4)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{
                    background:
                      "linear-gradient(160deg, hsl(265 80% 55%) 0%, hsl(280 85% 65%) 100%)",
                    boxShadow: "0 8px 20px -4px hsl(270 80% 40% / 0.6)",
                  }}
                >
                  <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <p className="font-bold text-white text-lg mb-2">{step.title}</p>
                <p className="text-white/75 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
          <div>
            <img
              src={postFormats}
              alt="Formatos de posts"
              className="w-full max-w-5xl mx-auto rounded-3xl shadow-card"
            />
          </div>
        </div>
      </section>

      {/* What SmartPostAI Delivers Section */}
      <section
        className="py-16"
        style={{
          background:
            "linear-gradient(180deg, hsl(270 70% 92%) 0%, hsl(280 75% 88%) 100%)",
        }}
      >
        <div className="container mx-auto px-3 md:px-6">
          <div
            className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-16 shadow-2xl"
            style={{
              background:
                "linear-gradient(160deg, hsl(265 80% 60%) 0%, hsl(280 85% 68%) 50%, hsl(295 85% 75%) 100%)",
            }}
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-pink-glow/40 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
            <div className="relative max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-bold text-white">O que o SmartPostAI entrega</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {deliverables.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white/15 border border-white/20">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Styles Section */}
      <section className="py-24 bg-gradient-soft">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-5xl font-bold mb-4 text-foreground">Estilos visuais prontos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha um estilo pronto ou envie referências da sua marca
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {visualStyles.map((style, i) => (
              <div
                key={i}
                className={cn(
                  "p-6 rounded-2xl bg-gradient-to-br shadow-lg border border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow",
                  style.color
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("w-10 h-10 rounded-full flex-shrink-0", style.dot)} />
                  <p className={cn("font-bold text-lg", style.dark ? "text-gray-800" : "text-white")}>
                    {style.name}
                  </p>
                </div>
                <p className={cn("text-sm", style.dark ? "text-gray-600" : "text-white/75")}>
                  {style.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-soft">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-5xl font-bold mb-4 text-foreground">Planos para todo criador</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              title="Solo"
              price="R$49"
              period="mês"
              planType="solo"
              features={[
                "15 posts/mês",
                "5 imagens com IA",
                "Legendas com CTA",
                "Estilos prontos SmartPostAI",
                "Copiar e baixar",
                "Histórico",
              ]}
            />
            <PricingCard
              title="Pro"
              price="R$79"
              period="mês"
              planType="pro"
              isPopular
              features={[
                "30 posts/mês",
                "15 imagens com IA",
                "Tudo do Solo",
                "Estilo da minha marca",
                "Calendário editorial",
                "Melhoria de qualidade",
                "Stories e Reels",
              ]}
            />
            <PricingCard
              title="Business"
              price="R$129"
              period="mês"
              planType="business"
              features={[
                "60 posts/mês",
                "30 imagens com IA",
                "Tudo do Pro",
                "Até 3 marcas/perfis",
                "Geração em lote",
                "Suporte prioritário",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Benefit Section */}
      <section className="py-16 bg-gradient-soft">
        <div className="container mx-auto px-3 md:px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-hero p-8 md:p-16 shadow-2xl text-center">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-glow/30 blur-3xl" />
            <div className="relative max-w-3xl mx-auto">
              <p className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                Pare de perder tempo pensando no que postar.
              </p>
              <p className="text-lg md:text-xl text-white/80 mb-10">
                Gere conteúdos prontos, bonitos e estratégicos com IA — em minutos.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="inline-block bg-white text-primary font-bold tracking-wide text-lg px-10 py-5 rounded-2xl transition-all duration-300 hover:bg-white/90 hover:shadow-glow active:scale-[0.98]"
              >
                Criar meu primeiro post
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10" style={{ background: "hsl(258 70% 12%)" }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-lime bg-clip-text text-transparent">
              SmartPostAI
            </div>
            <div className="flex gap-6">
              {[
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Mail, href: "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all duration-300 hover:shadow-glow hover:scale-110"
                  style={{ background: "hsl(258 60% 25%)" }}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            <div className="text-center">
              <p className="text-lg text-white/80 mb-2">IA que cria o conteúdo de um mês inteiro em minutos.</p>
              <p className="text-sm text-white/50">
                © 2025 SmartPostAI. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default Index;
