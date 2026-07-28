import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Menu, Sparkles } from "lucide-react";
import { useLandingContent } from "@/hooks/useLandingContent";

const PAYMENT_LINKS = [
  "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=1d5111e91c4d44d4b26d9ac7bc9a3aec",
  "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=9046f2fb8b7543a2bd69d53eba0c9711",
  "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=6f3c3d67f3e64f83819d83732cfefc03",
];

export default function GiPrivateLanding() {
  const navigate = useNavigate();
  const { content } = useLandingContent();
  const { hero, segments, projects, explore, statement, pricing, footer, gallery } = content;

  const openPayment = (index: number) => {
    const url = PAYMENT_LINKS[index];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

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

        <p className="axis-side-copy">
          {hero.sideCopy.split("\n").map((line, index) => (
            <span key={index}>{line}<br /></span>
          ))}
        </p>

        <div className="axis-brand">
          <div className="axis-wordmark"><span>SMART</span><span>POST</span></div>
          <div className="axis-powered"><span>{hero.poweredBy}</span><strong>AI</strong></div>
        </div>

        <div className="axis-bottom-cta">
          <button onClick={() => document.getElementById("planos-gi")?.scrollIntoView({ behavior: "smooth" })} className="axis-glass-cta">
            <span>Ver planos</span>
            <span className="axis-arrow"><ArrowRight className="h-6 w-6" /></span>
          </button>
          <p>{hero.ctaNote}</p>
        </div>
      </section>

      <section className="axis-section" id="segmentos">
        <div className="axis-section-head"><h2>{segments.title}</h2><span>{segments.linkLabel}</span></div>
        <div className="axis-horizontal-scroll">
          {segments.niches.map((niche, index) => (
            <article key={`${niche}-${index}`} className="axis-app-card">
              <img src={gallery[index % gallery.length].image} alt="" />
              <button onClick={() => document.getElementById("planos-gi")?.scrollIntoView({ behavior: "smooth" })}>Criar para {niche}</button>
              <div className="axis-app-info">
                <span className="axis-mini-icon"><Sparkles className="h-5 w-5" /></span>
                <div><strong>{niche}</strong><p>{segments.cardSubtitle}</p></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="axis-section axis-projects">
        <div className="axis-section-head"><h2>{projects.title}</h2><span>{segments.linkLabel}</span></div>
        <button onClick={() => document.getElementById("planos-gi")?.scrollIntoView({ behavior: "smooth" })} className="axis-new-project">
          <span>+</span><strong>{projects.ctaTitle}</strong><p>{projects.ctaSubtitle}</p>
        </button>
      </section>

      <section className="axis-section" id="exemplos">
        <div className="axis-section-head"><h2>{explore.title}</h2><span>{segments.linkLabel}</span></div>
        <div className="axis-explore-grid">
          {gallery.map((item, index) => <img key={`${item.label}-${index}`} src={item.image} alt={item.caption} />)}
        </div>
      </section>

      <section className="axis-statement"><span className="axis-mark">✦</span><h2>{statement.text}</h2></section>

      <section id="planos-gi" className="axis-pricing">
        <div className="axis-pricing-intro">
          <span>{pricing.eyebrow}</span>
          <h2>{pricing.title}</h2>
          <p>{pricing.subtitle}</p>
        </div>
        <div className="axis-price-grid">
          {pricing.plans.map((plan, index) => (
            <article key={plan.name} className={`axis-price-card ${plan.popular ? "is-popular" : ""}`}>
              {plan.popular && <div className="axis-popular">MAIS ESCOLHIDO</div>}
              <p>{plan.description}</p>
              <h3>{plan.name}</h3>
              <div className="axis-price"><strong>R$ {plan.price}</strong><span>/mês</span></div>
              <b>{plan.credits} completos por mês</b>
              <ul>{plan.features.map((feature) => <li key={feature}><Check className="h-4 w-4" />{feature}</li>)}</ul>
              <button onClick={() => openPayment(index)}>Assinar agora <ArrowRight className="h-4 w-4" /></button>
            </article>
          ))}
        </div>
      </section>

      <footer className="axis-footer">
        <div><span>POWERED BY</span><strong>{footer.brand}</strong></div>
        <p>{footer.tagline}</p>
        <button onClick={() => document.getElementById("planos-gi")?.scrollIntoView({ behavior: "smooth" })} className="axis-glass-cta">
          <span>Escolher plano</span><span className="axis-arrow"><ArrowRight className="h-6 w-6" /></span>
        </button>
      </footer>
    </main>
  );
}
