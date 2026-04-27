import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail, Sparkles, Copy, Wand2, Zap } from "lucide-react";
import { HeroButton } from "@/components/ui/button-variants";
import { PricingCard } from "@/components/PricingCard";
import { Header } from "@/components/Header";
import heroImage from "@/assets/hero-creator.jpg";
import postFormats from "@/assets/post-formats.jpg";
import cloneAi from "@/assets/clone-ai.jpg";
import customServices from "@/assets/custom-services.jpg";

const Index = () => {
  const [lang, setLang] = useState<"pt" | "en" | "es">("pt");
  const navigate = useNavigate();

  const translations = {
    pt: {
      hero: {
        title: "Crie. Clone. Inspire.",
        subtitle: "O futuro do social media começa aqui.",
        cta1: "Começar Agora",
        cta2: "Ver Demo",
      },
      formats: {
        title: "Crie Posts em Todos os Formatos",
        subtitle: "Do feed ao stories, do TikTok ao YouTube. Todos os formatos, um só lugar.",
        format1: "1:1 - Feed Perfeito",
        format2: "3:4 - Retratos",
        format3: "9:16 - Stories & Reels",
        format4: "16:9 - YouTube",
      },
      clone: {
        title: "Clone Posts com IA",
        subtitle: "Encontrou um post inspirador? Clone o estilo com um clique usando nossa IA avançada.",
        feature1: "Análise automática de estilo",
        feature2: "Adaptação inteligente",
        feature3: "Resultados em segundos",
      },
      pricing: {
        title: "Planos para Todo Criador",
        free: {
          title: "Free",
          price: "R$ 0",
          period: "mês",
          features: ["5 posts/mês", "Todos os formatos", "Watermark", "Suporte por email"],
        },
        premium: {
          title: "Premium",
          price: "R$ 29",
          period: "mês",
          features: ["200 créditos/mês", "Sem watermark", "Clone de posts", "Estilos premium", "Suporte prioritário"],
        },
        pro: {
          title: "Pro Agency",
          price: "R$ 99",
          period: "mês",
          features: ["600 créditos/mês", "5 usuários", "API de integração", "White label", "Gestor de conta dedicado"],
        },
      },
      custom: {
        title: "Precisando de Algo Sob Medida?",
        subtitle: "Criamos seu aplicativo MVP em 30 dias. A partir de R$ 10.000. Pagamento antecipado via PayPal ou Fiverr.",
        cta: "Falar com Especialista",
      },
      footer: {
        tagline: "O futuro do social media começa aqui.",
        rights: "Todos os direitos reservados.",
      },
    },
    en: {
      hero: {
        title: "Create. Clone. Inspire.",
        subtitle: "The future of social media starts here.",
        cta1: "Get Started",
        cta2: "Watch Demo",
      },
      formats: {
        title: "Create Posts in All Formats",
        subtitle: "From feed to stories, TikTok to YouTube. All formats, one place.",
        format1: "1:1 - Perfect Feed",
        format2: "3:4 - Portraits",
        format3: "9:16 - Stories & Reels",
        format4: "16:9 - YouTube",
      },
      clone: {
        title: "Clone Posts with AI",
        subtitle: "Found an inspiring post? Clone the style with one click using our advanced AI.",
        feature1: "Automatic style analysis",
        feature2: "Smart adaptation",
        feature3: "Results in seconds",
      },
      pricing: {
        title: "Plans for Every Creator",
        free: {
          title: "Free",
          price: "$0",
          period: "month",
          features: ["5 posts/month", "All formats", "Watermark", "Email support"],
        },
        premium: {
          title: "Premium",
          price: "$7",
          period: "month",
          features: ["200 credits/month", "No watermark", "Post cloning", "Premium styles", "Priority support"],
        },
        pro: {
          title: "Pro Agency",
          price: "$25",
          period: "month",
          features: ["600 credits/month", "5 users", "API integration", "White label", "Dedicated account manager"],
        },
      },
      custom: {
        title: "Need Something Custom?",
        subtitle: "We build your MVP app in 30 days. Starting from $2,000. Upfront payment via PayPal or Fiverr.",
        cta: "Talk to Specialist",
      },
      footer: {
        tagline: "The future of social media starts here.",
        rights: "All rights reserved.",
      },
    },
    es: {
      hero: {
        title: "Crea. Clona. Inspira.",
        subtitle: "El futuro de las redes sociales comienza aquí.",
        cta1: "Empezar Ahora",
        cta2: "Ver Demo",
      },
      formats: {
        title: "Crea Publicaciones en Todos los Formatos",
        subtitle: "Del feed a las historias, de TikTok a YouTube. Todos los formatos, un solo lugar.",
        format1: "1:1 - Feed Perfecto",
        format2: "3:4 - Retratos",
        format3: "9:16 - Historias y Reels",
        format4: "16:9 - YouTube",
      },
      clone: {
        title: "Clona Publicaciones con IA",
        subtitle: "¿Encontraste una publicación inspiradora? Clona el estilo con un clic usando nuestra IA avanzada.",
        feature1: "Análisis automático de estilo",
        feature2: "Adaptación inteligente",
        feature3: "Resultados en segundos",
      },
      pricing: {
        title: "Planes para Cada Creador",
        free: {
          title: "Gratis",
          price: "$0",
          period: "mes",
          features: ["5 publicaciones/mes", "Todos los formatos", "Marca de agua", "Soporte por email"],
        },
        premium: {
          title: "Premium",
          price: "$7",
          period: "mes",
          features: ["200 créditos/mes", "Sin marca de agua", "Clonación de posts", "Estilos premium", "Soporte prioritario"],
        },
        pro: {
          title: "Pro Agency",
          price: "$25",
          period: "mes",
          features: ["600 créditos/mes", "5 usuarios", "Integración API", "Marca blanca", "Gestor de cuenta dedicado"],
        },
      },
      custom: {
        title: "¿Necesitas Algo a Medida?",
        subtitle: "Creamos tu app MVP en 30 días. Desde €2.000. Pago anticipado por PayPal o Fiverr.",
        cta: "Hablar con Especialista",
      },
      footer: {
        tagline: "El futuro de las redes sociales comienza aquí.",
        rights: "Todos los derechos reservados.",
      },
    },
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen" style={{ background: "hsl(258 65% 18%)" }}>
      {/* Hero Section — estilo card roxo com imagem nítida e CTA flutuante */}
      <section className="relative min-h-screen p-3 md:p-6">
        <div className="relative w-full min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Imagem de fundo nítida */}
          <img
            src={heroImage}
            alt="Criadora de conteúdo trabalhando no celular e laptop"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay roxo (multiply) que dá o tom da referência */}
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

          {/* Top bar: menu + language selector */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-5 md:p-8">
            <button
              aria-label="Menu"
              className="w-11 h-11 flex flex-col items-start justify-center gap-1.5 text-white"
            >
              <span className="block h-0.5 w-7 bg-white rounded-full" />
              <span className="block h-0.5 w-5 bg-white rounded-full" />
              <span className="block h-0.5 w-7 bg-white rounded-full" />
            </button>
            <div className="flex gap-2">
              {(["pt", "en", "es"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300",
                    lang === l
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-white/95 text-foreground hover:bg-white"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Título grande à esquerda */}
          <div className="relative z-10 h-full min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] flex flex-col justify-end px-7 md:px-14 pb-44 md:pb-52">
            <h1 className="text-white font-extrabold leading-[0.95] tracking-tight text-5xl sm:text-6xl md:text-8xl max-w-4xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
              {t.hero.title}
            </h1>
            <p className="mt-5 md:mt-7 text-white/85 text-lg md:text-2xl max-w-xl">
              {t.hero.subtitle}
            </p>
          </div>

          {/* Card branco flutuante com CTA */}
          <div className="absolute bottom-5 left-5 right-5 md:bottom-8 md:left-8 md:right-8 z-20">
            <div className="bg-card rounded-3xl p-5 md:p-6 shadow-2xl flex flex-col sm:flex-row gap-3 items-stretch">
              <button
                onClick={() => navigate('/auth')}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-widest text-base md:text-lg py-5 rounded-2xl transition-all duration-300 hover:shadow-glow active:scale-[0.98]"
              >
                {t.hero.cta1.toUpperCase()}
              </button>
              <button
                onClick={() => {
                  const pricingSection = document.getElementById('pricing');
                  pricingSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex-1 sm:flex-none sm:px-8 border-2 border-primary text-primary hover:bg-primary/5 font-bold tracking-wide text-base md:text-lg py-5 rounded-2xl transition-all duration-300"
              >
                {t.hero.cta2}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Post Formats Section */}
      <section className="py-24" style={{ background: "linear-gradient(180deg, hsl(258 65% 18%) 0%, hsl(265 70% 28%) 100%)" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Wand2 className="w-12 h-12 text-primary-glow mx-auto mb-4" />
            <h2 className="text-5xl font-bold mb-4 text-white">{t.formats.title}</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">{t.formats.subtitle}</p>
          </div>
          <div className="mb-12">
            <img src={postFormats} alt="Post formats" className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl shadow-glow" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[t.formats.format1, t.formats.format2, t.formats.format3, t.formats.format4].map((format, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-glow text-center"
                style={{ background: "hsl(258 60% 25% / 0.6)", backdropFilter: "blur(10px)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-gradient-card">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-white">{format}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clone Section */}
      <section className="py-24" style={{ background: "hsl(265 70% 28%)" }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <Copy className="w-12 h-12 text-primary-glow mb-6" />
              <h2 className="text-5xl font-bold mb-6 text-white">{t.clone.title}</h2>
              <p className="text-xl text-white/75 mb-8">{t.clone.subtitle}</p>
              <ul className="space-y-4">
                {[t.clone.feature1, t.clone.feature2, t.clone.feature3].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-card">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-white/85">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <img src={cloneAi} alt="AI Cloning" className="w-full rounded-2xl shadow-2xl shadow-glow" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24" style={{ background: "linear-gradient(180deg, hsl(265 70% 28%) 0%, hsl(258 65% 18%) 100%)" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Sparkles className="w-12 h-12 text-primary-glow mx-auto mb-4" />
            <h2 className="text-5xl font-bold mb-4 text-white">{t.pricing.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard {...t.pricing.free} planType="free" />
            <PricingCard {...t.pricing.premium} isPopular planType="premium" />
            <PricingCard {...t.pricing.pro} planType="pro" />
          </div>
        </div>
      </section>

      {/* Custom Services Section */}
      <section className="py-24" style={{ background: "hsl(258 65% 18%)" }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <img src={customServices} alt="Custom Services" className="w-full rounded-2xl shadow-2xl shadow-glow" />
            </div>
            <div>
              <Wand2 className="w-12 h-12 text-primary-glow mb-6" />
              <h2 className="text-5xl font-bold mb-6 text-white">{t.custom.title}</h2>
              <p className="text-xl text-white/75 mb-8">{t.custom.subtitle}</p>
              <HeroButton variant="primary" onClick={() => window.open('mailto:contato@exemplo.com', '_blank')}>{t.custom.cta}</HeroButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10" style={{ background: "hsl(258 70% 12%)" }}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-8">
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
              <p className="text-lg text-muted-foreground mb-2">{t.footer.tagline}</p>
              <p className="text-sm text-muted-foreground">
                © 2025 Smart Social Media. {t.footer.rights}
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
