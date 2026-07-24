import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Menu, Sparkles } from "lucide-react";
import heroCreator from "@/assets/hero-creator.jpg";
import heroHologram from "@/assets/hero-hologram.jpg";
import cloneAi from "@/assets/clone-ai.jpg";
import customServices from "@/assets/custom-services.jpg";
import postFormats from "@/assets/post-formats.jpg";

const gallery = [
  { image: customServices, label: "JOIAS", caption: "Elegância em cada detalhe." },
  { image: heroHologram, label: "IMÓVEIS", caption: "O lugar perfeito para chamar de seu." },
  { image: heroCreator, label: "ACADEMIA", caption: "Foco que gera resultados." },
  { image: cloneAi, label: "ADVOCACIA", caption: "Posicionamento com autoridade." },
  { image: postFormats, label: "SAÚDE", caption: "Conteúdo que gera confiança." },
  { image: customServices, label: "GASTRONOMIA", caption: "Visual que desperta desejo." },
  { image: heroCreator, label: "MODA", caption: "Presença que chama atenção." },
  { image: heroHologram, label: "POLÍTICA", caption: "Comunicação clara e estratégica." },
];

const niches = ["Dentistas", "Médicos", "Advogados", "Corretores", "Academias", "Joalherias", "Políticos", "Moda"];

const plans = [
  { name: "Solo", price: "49,90", credits: "15 posts", description: "Para quem está começando", features: ["Posts completos", "Imagem + copy + legenda", "CTA e hashtags"] },
  { name: "Pro", price: "89,90", credits: "30 posts", description: "Um mês inteiro de conteúdo", popular: true, features: ["Tudo do Solo", "Padrão de feed", "Mais estilos visuais"] },
  { name: "Studio", price: "169,90", credits: "60 posts", description: "Para designers e social medias", features: ["Tudo do Pro", "Múltiplas marcas", "Uso profissional"] },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#060708] text-white selection:bg-violet-500/40">
      <section className="axis-hero">
        <div className="axis-mosaic" aria-hidden="true">
          {gallery.concat(gallery.slice(0, 4)).map((item, index) => (
            <div key={`${item.label}-${index}`} className={`axis-tile axis-tile-${index + 1}`}>
              <img src={item.image} alt="" />
            </div>
          ))}
        </div>
        <div className="axis-hero-shade" />
        <div className="axis-grain" />

        <button className="axis-menu" aria-label="Abrir menu">
          <Menu className="h-6 w-6" />
        </button>

        <button onClick={() => navigate("/auth")} className="axis-avatar" aria-label="Entrar">
          GI
        </button>

        <p className="axis-side-copy">Crie seu post<br />Organize sua marca<br />Explore novas ideias</p>

        <div className="axis-brand">
          <div className="axis-wordmark">SMART<br className="md:hidden" />POST</div>
          <div className="axis-powered"><span>POWERED BY</span><strong>AI</strong></div>
        </div>

        <div className="axis-bottom-cta">
          <button onClick={() => navigate("/auth")} className="axis-glass-cta">
            <span>Começar agora</span>
            <span className="axis-arrow"><ArrowRight className="h-6 w-6" /></span>
          </button>
          <p>Planos a partir de R$ 49,90</p>
        </div>
      </section>

      <section className="axis-section" id="segmentos">
        <div className="axis-section-head">
          <h2>Feito para todos os negócios.</h2>
          <span>Ver todos</span>
        </div>
        <div className="axis-horizontal-scroll">
          {niches.map((niche, index) => (
            <article key={niche} className="axis-app-card">
              <img src={gallery[index].image} alt="" />
              <button onClick={() => navigate("/auth")}>Criar para {niche}</button>
              <div className="axis-app-info">
                <span className="axis-mini-icon"><Sparkles className="h-5 w-5" /></span>
                <div><strong>{niche}</strong><p>Imagem, copy e legenda em poucos segundos.</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="axis-section axis-projects">
        <div className="axis-section-head"><h2>Projetos</h2><span>Ver todos</span></div>
        <button onClick={() => navigate("/auth")} className="axis-new-project">
          <span>+</span><strong>Novo projeto</strong><p>Comece uma nova criação</p>
        </button>
      </section>

      <section className="axis-section" id="exemplos">
        <div className="axis-section-head"><h2>Explore</h2><span>Ver todos</span></div>
        <div className="axis-explore-grid">
          {gallery.map((item) => <img key={item.label} src={item.image} alt={item.caption} />)}
        </div>
      </section>

      <section className="axis-statement">
        <span className="axis-mark">✦</span>
        <h2>O conteúdo criado para quem sabe a diferença.</h2>
      </section>

      <section id="planos" className="axis-pricing">
        <div className="axis-pricing-intro">
          <span>SMART POST AI</span>
          <h2>Conteúdo profissional, sem equipe cara.</h2>
          <p>Escolha o volume ideal para sua rotina e crie posts completos com IA.</p>
        </div>
        <div className="axis-price-grid">
          {plans.map((plan) => (
            <article key={plan.name} className={`axis-price-card ${plan.popular ? "is-popular" : ""}`}>
              {plan.popular && <div className="axis-popular">MAIS ESCOLHIDO</div>}
              <p>{plan.description}</p>
              <h3>{plan.name}</h3>
              <div className="axis-price"><strong>R$ {plan.price}</strong><span>/mês</span></div>
              <b>{plan.credits} completos por mês</b>
              <ul>{plan.features.map((feature) => <li key={feature}><Check className="h-4 w-4" />{feature}</li>)}</ul>
              <button onClick={() => navigate("/pricing")}>Escolher plano <ArrowRight className="h-4 w-4" /></button>
            </article>
          ))}
        </div>
      </section>

      <footer className="axis-footer">
        <div><span>POWERED BY</span><strong>SMART POST AI</strong></div>
        <p>Estratégia, imagem e legenda em um único fluxo.</p>
        <button onClick={() => navigate("/auth")} className="axis-glass-cta"><span>Começar agora</span><span className="axis-arrow"><ArrowRight className="h-6 w-6" /></span></button>
      </footer>
    </main>
  );
}
