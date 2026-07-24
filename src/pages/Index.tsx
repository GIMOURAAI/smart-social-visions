import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Image, Sparkles } from "lucide-react";
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

const niches = ["Dentistas", "Médicos", "Advogados", "Corretores", "Academias", "Joalherias", "Políticos", "Minimalistas"];

const plans = [
  { name: "Solo", price: "49,90", credits: "15 posts", description: "Para quem está começando", features: ["Posts completos", "Imagem + copy + legenda", "CTA e hashtags"] },
  { name: "Pro", price: "89,90", credits: "30 posts", description: "Um mês inteiro de conteúdo", popular: true, features: ["Tudo do Solo", "Padrão de feed", "Mais estilos visuais"] },
  { name: "Studio", price: "169,90", credits: "60 posts", description: "Para designers e social medias", features: ["Tudo do Pro", "Múltiplas marcas", "Uso profissional"] },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white selection:bg-violet-500/40">
      <div className="pointer-events-none fixed inset-0 opacity-60 [background:radial-gradient(circle_at_72%_8%,rgba(124,92,255,.16),transparent_24%),radial-gradient(circle_at_8%_78%,rgba(84,45,150,.11),transparent_28%)]" />
      <div className="noise-overlay" />

      <header className="relative z-20 mx-auto flex h-24 w-[min(1400px,calc(100%-40px))] items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3">
          <span className="glass-icon"><Sparkles className="h-4 w-4" /></span>
          <span className="text-lg font-semibold tracking-[-0.03em]">Smart Post AI</span>
        </button>
        <nav className="hidden items-center gap-9 text-sm text-white/55 md:flex">
          <a href="#segmentos" className="transition hover:text-white">Segmentos</a>
          <a href="#exemplos" className="transition hover:text-white">Exemplos</a>
          <a href="#planos" className="transition hover:text-white">Planos</a>
        </nav>
        <button onClick={() => navigate("/auth")} className="glass-button">Começar agora <ArrowRight className="h-4 w-4" /></button>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[840px] w-[min(1400px,calc(100%-40px))] items-center gap-20 py-14 lg:grid-cols-[.82fr_1.18fr] lg:py-24">
        <div className="reveal-up max-w-[620px]">
          <div className="glass-label">IA para social media</div>
          <h1 className="mt-8 text-[clamp(56px,6.4vw,96px)] font-[420] leading-[.98] tracking-[-.066em]">
            Crie posts que parecem feitos <span className="text-violet-400">por uma agência.</span>
          </h1>
          <p className="mt-8 max-w-[460px] text-lg leading-relaxed text-white/46 md:text-xl">Do briefing ao post final. Estratégia, imagem e legenda em poucos segundos.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => navigate("/auth")} className="primary-cta">Começar gratuitamente <ArrowRight className="h-4 w-4" /></button>
            <a href="#exemplos" className="glass-button">Ver exemplos</a>
          </div>
        </div>

        <div className="relative min-h-[720px]">
          <div className="hero-orbit absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3 [transform:perspective(1400px)_rotateY(-4deg)_rotateX(1deg)]">
            {gallery.map((item, index) => (
              <article key={item.label} style={{ animationDelay: `${index * 110}ms` }} className={`gallery-card float-card ${index === 2 || index === 4 ? "row-span-2" : ""}`}>
                <img src={item.image} alt="" className="h-full w-full object-cover opacity-72 saturate-[.76] transition duration-700 group-hover:scale-[1.045] group-hover:opacity-95" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-white/[.03]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-[10px] tracking-[.18em] text-white/45">{item.label}</div>
                  <div className="mt-1 max-w-[180px] text-sm leading-snug text-white/78">{item.caption}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="prompt-glass">
            <p className="text-sm text-white/52">Descreva o tipo de post que deseja criar...</p>
            <div className="mt-10 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <button className="glass-chip"><Image className="h-4 w-4" /> Imagem</button>
                <button className="glass-chip"><Sparkles className="h-4 w-4" /> Estilo</button>
              </div>
              <button onClick={() => navigate("/auth")} className="primary-cta !rounded-xl !px-5 !py-3 text-sm"><Sparkles className="h-4 w-4" /> Gerar post</button>
            </div>
          </div>
        </div>
      </section>

      <section id="segmentos" className="relative z-10 border-t border-white/[.055] py-40">
        <div className="mx-auto w-[min(1400px,calc(100%-40px))]">
          <div className="mb-16 flex items-end justify-between gap-10">
            <h2 className="text-[clamp(44px,5vw,72px)] font-[430] leading-[1.02] tracking-[-.055em]">Para qualquer<br /><span className="text-violet-400">tipo de negócio.</span></h2>
            <span className="hidden text-sm text-white/32 md:block">Conteúdo com aparência profissional.</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {niches.map((niche, index) => (
              <article key={niche} className="segment-glass" style={{ animationDelay: `${index * 80}ms` }}>
                <img src={gallery[index].image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-42 saturate-[.58] transition duration-700 group-hover:scale-105 group-hover:opacity-68" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-white/[.02]" />
                <span className="absolute bottom-5 left-5 text-sm text-white/82">{niche}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="exemplos" className="relative z-10 border-t border-white/[.055] py-40">
        <div className="mx-auto grid w-[min(1400px,calc(100%-40px))] gap-20 lg:grid-cols-[.3fr_.7fr]">
          <div className="lg:pt-8">
            <p className="mb-4 text-xs uppercase tracking-[.16em] text-violet-400">Exemplos</p>
            <h2 className="text-[clamp(44px,4.5vw,68px)] font-[430] leading-[1.02] tracking-[-.055em]">Pouco texto.<br />Muito <span className="text-violet-400">impacto.</span></h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((item) => (
              <article key={`${item.label}-example`} className="gallery-card aspect-[4/5]">
                <img src={item.image} alt="" className="h-full w-full object-cover opacity-66 saturate-[.72] transition duration-700 group-hover:scale-105 group-hover:opacity-92" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-white/[.025]" />
                <div className="absolute bottom-4 left-4 right-4 text-sm text-white/65">{item.caption}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="planos" className="relative z-10 border-t border-white/[.055] py-40">
        <div className="mx-auto w-[min(1200px,calc(100%-40px))]">
          <div className="mb-16 text-center">
            <p className="mb-4 text-xs uppercase tracking-[.16em] text-violet-400">Planos</p>
            <h2 className="text-[clamp(44px,5vw,72px)] font-[430] tracking-[-.055em]">Conteúdo profissional<br /><span className="text-violet-400">sem equipe cara.</span></h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <article key={plan.name} className={`price-glass ${plan.popular ? "price-popular" : ""}`}>
                {plan.popular && <div className="popular-badge">MAIS ESCOLHIDO</div>}
                <p className="text-sm text-white/48">{plan.description}</p>
                <h3 className="mt-4 text-2xl font-semibold">{plan.name}</h3>
                <div className="mt-7 flex items-end gap-2"><span className="text-5xl font-medium tracking-[-.05em]">R$ {plan.price}</span><span className="pb-1 text-sm text-white/35">/mês</span></div>
                <p className="mt-3 text-sm font-medium text-violet-300">{plan.credits} completos por mês</p>
                <ul className="mt-8 space-y-3 text-sm text-white/58">
                  {plan.features.map((feature) => <li key={feature} className="flex items-center gap-3"><Check className="h-4 w-4 text-violet-400" />{feature}</li>)}
                </ul>
                <button onClick={() => navigate("/pricing")} className={plan.popular ? "primary-cta mt-10 w-full justify-center" : "glass-button mt-10 w-full justify-center"}>Escolher plano <ArrowRight className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-24 pt-10">
        <div className="cta-glass mx-auto w-[min(1400px,calc(100%-40px))]">
          <h2 className="text-[clamp(42px,5vw,68px)] font-[420] leading-[1.02] tracking-[-.055em]">Seu próximo post<br />começa <span className="text-violet-400">aqui.</span></h2>
          <button onClick={() => navigate("/auth")} className="primary-cta">Começar gratuitamente <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </main>
  );
}
