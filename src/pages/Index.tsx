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
    <div className="min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#07050f" }}>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Imagem de fundo */}
        <img
          src={heroImage}
          alt="Criadora de conteúdo"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay escuro geral */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(7,5,15,0.92) 0%, rgba(60,20,120,0.75) 50%, rgba(7,5,15,0.55) 100%)" }} />
        {/* No desktop: fade lateral — esconde imagem no lado esquerdo, revela à direita */}
        <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(90deg, rgba(7,5,15,0.97) 0%, rgba(7,5,15,0.80) 42%, rgba(7,5,15,0.0) 70%)" }} />
        {/* Glow roxo ambiente */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }} />

        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-14 py-6">
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-white font-black text-xl tracking-tight">
            SmartPost<span style={{ background: "linear-gradient(90deg, #f5d020, #e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
          </span>
          <button
            onClick={() => navigate("/auth")}
            className="px-5 py-2 rounded-full text-sm font-bold bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
          >
            Entrar
          </button>
        </nav>

        {/* DESKTOP: conteúdo alinhado à esquerda, verticalmente centralizado */}
        <div className="hidden md:flex relative z-10 min-h-screen flex-col justify-center px-14 lg:px-20" style={{ maxWidth: "660px" }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: "1.0" }}
            className="text-white font-black text-6xl lg:text-7xl tracking-tight">
            Crie Posts<br />
            <span className="relative inline-block">
              <span style={{ background: "linear-gradient(90deg, #f5d020 0%, #f472b6 50%, #e879f9 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                em minutos
              </span>
              {/* sublinhado animado */}
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "linear-gradient(90deg, #f5d020, #e879f9)", opacity: 0.6 }} />
            </span><br />
            usando a IA
          </h1>

          <p className="mt-7 text-white/60 text-lg font-medium" style={{ maxWidth: "380px" }}>
            Crie posts, legendas, imagens, CTAs, hashtags em um único lugar.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={() => navigate("/auth")}
              className="font-bold text-base px-9 py-4 rounded-2xl text-white transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)", boxShadow: "0 8px 30px rgba(124,58,237,0.45)" }}
            >
              Começar agora
            </button>
            <button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="font-semibold text-base px-8 py-4 rounded-2xl text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-all duration-200"
            >
              Ver planos →
            </button>
          </div>

        </div>

        {/* MOBILE: texto embaixo + card CTA flutuante */}
        <div className="md:hidden relative z-10 flex flex-col justify-end min-h-screen px-6" style={{ paddingBottom: "210px" }}>
          <h1 className="text-white font-black text-5xl tracking-tight" style={{ lineHeight: "1.0" }}>
            Crie Posts<br />
            <span style={{ background: "linear-gradient(90deg, #f5d020, #f472b6, #e879f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              em minutos
            </span><br />
            usando a IA
          </h1>
          <p className="mt-4 text-white/60 text-sm font-medium max-w-xs">
            Crie posts, legendas, imagens, CTAs, hashtags em um único lugar.
          </p>
        </div>

        {/* MOBILE: CTA card flutuante */}
        <div className="md:hidden absolute left-4 right-4 z-20" style={{ bottom: "18px" }}>
          <div className="rounded-3xl p-5 shadow-2xl flex flex-col gap-3" style={{ background: "rgba(15,10,30,0.95)", border: "1px solid rgba(124,58,237,0.3)", backdropFilter: "blur(20px)" }}>
            <button
              onClick={() => navigate("/auth")}
              className="w-full font-bold text-base py-4 rounded-2xl text-white transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 6px 24px rgba(124,58,237,0.4)" }}
            >
              Começar agora
            </button>
            <button
              onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full font-semibold text-base py-3.5 rounded-2xl text-white/70 hover:text-white border border-white/15 transition-all"
            >
              Ver planos
            </button>
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
