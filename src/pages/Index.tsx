import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Twitter, Linkedin, Mail, Sparkles, Copy, Wand2, Zap } from "lucide-react";
import { HeroButton } from "@/components/ui/button-variants";
import { PricingCard } from "@/components/PricingCard";
import { Header } from "@/components/Header";
import heroImage from "@/assets/hero-hologram.jpg";
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
          features: ["Posts ilimitados", "Sem watermark", "Clone de posts", "Estilos premium", "Suporte prioritário"],
        },
        pro: {
          title: "Pro Agency",
          price: "R$ 99",
          period: "mês",
          features: ["Tudo do Premium", "5 usuários", "API de integração", "White label", "Gestor de conta dedicado"],
        },
      },
      custom: {
        title: "Precisando de Algo Sob Medida?",
        subtitle: "Criamos sites, aplicativos e automações inteligentes para elevar seu negócio ao próximo nível.",
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
          features: ["Unlimited posts", "No watermark", "Post cloning", "Premium styles", "Priority support"],
        },
        pro: {
          title: "Pro Agency",
          price: "$25",
          period: "month",
          features: ["Everything in Premium", "5 users", "API integration", "White label", "Dedicated account manager"],
        },
      },
      custom: {
        title: "Need Something Custom?",
        subtitle: "We create websites, apps and smart automations to take your business to the next level.",
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
          features: ["Publicaciones ilimitadas", "Sin marca de agua", "Clonación de posts", "Estilos premium", "Soporte prioritario"],
        },
        pro: {
          title: "Pro Agency",
          price: "$25",
          period: "mes",
          features: ["Todo en Premium", "5 usuarios", "Integración API", "Marca blanca", "Gestor de cuenta dedicado"],
        },
      },
      custom: {
        title: "¿Necesitas Algo a Medida?",
        subtitle: "Creamos sitios web, aplicaciones y automatizaciones inteligentes para llevar tu negocio al siguiente nivel.",
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
    <div className="min-h-screen bg-background">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {(["pt", "en", "es"] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={cn(
              "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300",
              lang === l ? "bg-primary text-primary-foreground shadow-glow-lime" : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="animate-float">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-6 animate-glow-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            {t.hero.title}
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto">{t.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <HeroButton variant="primary" onClick={() => navigate('/auth')}>{t.hero.cta1}</HeroButton>
            <HeroButton variant="secondary" onClick={() => {
              const pricingSection = document.getElementById('pricing');
              pricingSection?.scrollIntoView({ behavior: 'smooth' });
            }}>{t.hero.cta2}</HeroButton>
          </div>
        </div>
      </section>

      {/* Post Formats Section */}
      <section className="py-24 bg-gradient-metallic">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Wand2 className="w-12 h-12 text-primary mx-auto mb-4 animate-glow-pulse" />
            <h2 className="text-5xl font-bold mb-4 text-foreground">{t.formats.title}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.formats.subtitle}</p>
          </div>
          <div className="mb-12">
            <img src={postFormats} alt="Post formats" className="w-full max-w-5xl mx-auto rounded-2xl shadow-2xl shadow-glow-blue" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[t.formats.format1, t.formats.format2, t.formats.format3, t.formats.format4].map((format, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-xl border border-border hover:border-lime transition-all duration-300 hover:shadow-glow-lime text-center"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground">{format}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clone Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="order-2 md:order-1">
              <Copy className="w-12 h-12 text-primary mb-6 animate-glow-pulse" />
              <h2 className="text-5xl font-bold mb-6 text-foreground">{t.clone.title}</h2>
              <p className="text-xl text-muted-foreground mb-8">{t.clone.subtitle}</p>
              <ul className="space-y-4">
                {[t.clone.feature1, t.clone.feature2, t.clone.feature3].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-lg text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <img src={cloneAi} alt="AI Cloning" className="w-full rounded-2xl shadow-2xl shadow-glow-lime animate-float" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-metallic">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-glow-pulse" />
            <h2 className="text-5xl font-bold mb-4 text-foreground">{t.pricing.title}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard {...t.pricing.free} />
            <PricingCard {...t.pricing.premium} isPopular />
            <PricingCard {...t.pricing.pro} />
          </div>
        </div>
      </section>

      {/* Custom Services Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <img src={customServices} alt="Custom Services" className="w-full rounded-2xl shadow-2xl shadow-glow-blue" />
            </div>
            <div>
              <Wand2 className="w-12 h-12 text-primary mb-6 animate-glow-pulse" />
              <h2 className="text-5xl font-bold mb-6 text-foreground">{t.custom.title}</h2>
              <p className="text-xl text-muted-foreground mb-8">{t.custom.subtitle}</p>
              <HeroButton variant="primary" onClick={() => window.open('mailto:contato@exemplo.com', '_blank')}>{t.custom.cta}</HeroButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-metallic py-12 border-t border-border">
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
                  className="w-12 h-12 bg-card rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-glow-lime hover:scale-110"
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
