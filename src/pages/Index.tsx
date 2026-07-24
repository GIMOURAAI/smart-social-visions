import { useNavigate } from "react-router-dom";
import { ArrowRight, Image, Sparkles, Stethoscope, Scale, Building2, Dumbbell, Gem, Utensils, Shirt, Minus } from "lucide-react";
import heroCreator from "@/assets/hero-creator.jpg";
import heroHologram from "@/assets/hero-hologram.jpg";
import cloneAi from "@/assets/clone-ai.jpg";
import customServices from "@/assets/custom-services.jpg";
import postFormats from "@/assets/post-formats.jpg";

const gallery = [
  { image: customServices, label: "ESSENCE", caption: "O essencial é impossível aos olhos." },
  { image: heroHologram, label: "ENCONTRE", caption: "O lugar perfeito para chamar de seu." },
  { image: heroCreator, label: "DISCIPLINA", caption: "Foco que gera resultados." },
  { image: cloneAi, label: "ETERNO", caption: "Como seu momento." },
  { image: postFormats, label: "CUIDAR", caption: "Transforma vidas." },
  { image: customServices, label: "SABOR", caption: "Que conecta." },
  { image: heroCreator, label: "ELEGÂNCIA", caption: "Em cada detalhe." },
  { image: heroHologram, label: "TRABALHO", caption: "Que gera resultados." },
];

const niches = [
  { icon: Stethoscope, label: "Dentistas", image: postFormats },
  { icon: Stethoscope, label: "Médicos", image: heroCreator },
  { icon: Scale, label: "Advogados", image: cloneAi },
  { icon: Building2, label: "Corretores", image: heroHologram },
  { icon: Dumbbell, label: "Academias", image: heroCreator },
  { icon: Gem, label: "Joalherias", image: customServices },
  { icon: Utensils, label: "Restaurantes", image: postFormats },
  { icon: Shirt, label: "Moda", image: heroCreator },
  { icon: Minus, label: "Minimalistas", image: cloneAi },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white selection:bg-violet-500/40">
      <div className="fixed inset-0 pointer-events-none opacity-[0.16] bg-[radial-gradient(circle_at_70%_8%,rgba(115,74,255,0.18),transparent_25%),radial-gradient(circle_at_10%_80%,rgba(80,40,130,0.12),transparent_28%)]" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.08] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_180_180%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22n%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%22.92%22_numOctaves=%222%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23n)%22_opacity=%22.6%22/%3E%3C/svg%3E')]" />

      <header className="relative z-20 mx-auto flex h-24 w-[min(1400px,calc(100%-40px))] items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 text-left">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-violet-700 shadow-[0_10px_35px_rgba(109,74,255,.35)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-[-0.03em]">Smart Post AI</span>
        </button>

        <nav className="hidden items-center gap-9 text-sm text-white/62 md:flex">
          <a href="#modelos" className="transition hover:text-white">Modelos</a>
          <a href="#nichos" className="transition hover:text-white">Segmentos</a>
          <a href="#exemplos" className="transition hover:text-white">Exemplos</a>
          <button onClick={() => navigate("/pricing")} className="transition hover:text-white">Planos</button>
        </nav>

        <button
          onClick={() => navigate("/auth")}
          className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-5 py-3 text-sm text-white backdrop-blur-xl transition hover:bg-white/[0.07]"
        >
          Começar agora <ArrowRight className="h-4 w-4" />
        </button>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[820px] w-[min(1400px,calc(100%-40px))] items-center gap-16 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
        <div className="max-w-[610px] py-10 lg:py-0">
          <div className="mb-8 w-fit rounded-full border border-violet-400/20 bg-violet-500/[0.045] px-3.5 py-2 text-[11px] uppercase tracking-[0.13em] text-violet-300">
            IA para social media
          </div>
          <h1 className="text-[clamp(56px,6.4vw,96px)] font-[420] leading-[0.98] tracking-[-0.065em]">
            Crie posts que parecem feitos <span className="text-violet-400">por uma agência.</span>
          </h1>
          <p className="mt-8 max-w-[450px] text-lg leading-relaxed text-white/48 md:text-xl">
            Do briefing ao post final.<br />Em segundos.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="flex items-center gap-4 rounded-full bg-gradient-to-r from-violet-500 to-violet-700 px-7 py-4 font-medium shadow-[0_16px_55px_rgba(109,74,255,.28)] transition hover:scale-[1.02]"
            >
              Começar gratuitamente <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#exemplos" className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.02] px-7 py-4 text-white/75 backdrop-blur-xl transition hover:bg-white/[0.06]">
              Ver exemplos
            </a>
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-white/45">
            <div className="flex -space-x-3">
              {[heroCreator, cloneAi, heroHologram, customServices].map((image, i) => (
                <img key={i} src={image} className="h-10 w-10 rounded-full border-2 border-[#08090b] object-cover" />
              ))}
            </div>
            <p>Conteúdo profissional<br />sem contratar uma equipe.</p>
          </div>
        </div>

        <div id="modelos" className="relative min-h-[700px]">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3 [transform:perspective(1400px)_rotateY(-4deg)_rotateX(1deg)]">
            {gallery.map((item, index) => (
              <article
                key={index}
                className={`group relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-white/[0.025] shadow-[0_34px_100px_rgba(0,0,0,.46)] ${index === 2 ? "row-span-2" : ""} ${index === 4 ? "row-span-2" : ""}`}
              >
                <img src={item.image} alt="" className="h-full w-full object-cover opacity-70 saturate-[.78] transition duration-700 group-hover:scale-[1.035] group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-[11px] tracking-[0.16em] text-white/55">{item.label}</div>
                  <div className="mt-1 max-w-[180px] text-sm leading-snug text-white/80">{item.caption}</div>
                </div>
              </article>
            ))}
          </div>

          <div className="absolute bottom-2 left-[-5%] right-[9%] rounded-[28px] border border-white/[0.16] bg-gradient-to-br from-white/[0.11] to-white/[0.035] p-6 shadow-[0_30px_90px_rgba(0,0,0,.62)] backdrop-blur-2xl">
            <p className="text-sm text-white/55">Descreva o tipo de post que deseja criar...</p>
            <div className="mt-10 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-xs text-white/70"><Image className="h-4 w-4" /> Imagem</button>
                <button className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-xs text-white/70"><Sparkles className="h-4 w-4" /> Estilo</button>
              </div>
              <button onClick={() => navigate("/auth")} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-700 px-5 py-3 text-sm shadow-[0_12px_35px_rgba(109,74,255,.35)]">
                <Sparkles className="h-4 w-4" /> Gerar post
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="nichos" className="relative z-10 border-t border-white/[0.055] py-36">
        <div className="mx-auto w-[min(1400px,calc(100%-40px))]">
          <div className="mb-14 flex items-end justify-between gap-10">
            <h2 className="text-[clamp(42px,5vw,70px)] font-[430] leading-[1.02] tracking-[-0.055em]">
              Para qualquer<br /><span className="text-violet-400">tipo de negócio.</span>
            </h2>
            <span className="hidden text-sm text-white/35 md:block">Ver todos →</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {niches.slice(0, 6).map((niche, index) => {
              const Icon = niche.icon;
              return (
                <article key={index} className="group relative min-h-[330px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.02]">
                  <img src={niche.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 saturate-[.65] transition duration-700 group-hover:scale-105 group-hover:opacity-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/15" />
                  <div className="absolute left-5 top-5 flex items-center gap-2 text-sm text-white/75"><Icon className="h-4 w-4" />{niche.label}</div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="exemplos" className="relative z-10 border-t border-white/[0.055] py-36">
        <div className="mx-auto grid w-[min(1400px,calc(100%-40px))] gap-16 lg:grid-cols-[0.34fr_0.66fr]">
          <div className="lg:pt-10">
            <p className="mb-4 text-xs uppercase tracking-[0.14em] text-violet-400">Exemplos</p>
            <h2 className="text-[clamp(42px,4.5vw,66px)] font-[430] leading-[1.02] tracking-[-0.055em]">Posts criados<br />com IA.</h2>
            <button onClick={() => navigate("/auth")} className="mt-10 flex items-center gap-3 text-sm text-white/55 transition hover:text-white">Ver mais exemplos <ArrowRight className="h-4 w-4" /></button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((item, index) => (
              <article key={index} className="group relative aspect-[4/5] overflow-hidden rounded-[22px] border border-white/[0.08]">
                <img src={item.image} alt="" className="h-full w-full object-cover opacity-62 saturate-[.72] transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-sm text-white/65">{item.caption}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 pb-20 pt-12">
        <div className="mx-auto flex min-h-[230px] w-[min(1400px,calc(100%-40px))] flex-col items-start justify-between gap-10 overflow-hidden rounded-[32px] border border-white/[0.08] bg-[radial-gradient(circle_at_0%_100%,rgba(109,74,255,.30),transparent_35%),linear-gradient(120deg,rgba(255,255,255,.06),rgba(255,255,255,.015))] p-10 backdrop-blur-xl md:flex-row md:items-center md:px-14">
          <h2 className="text-[clamp(40px,5vw,66px)] font-[420] leading-[1.02] tracking-[-0.055em]">Seu próximo post<br />começa <span className="text-violet-400">aqui.</span></h2>
          <button onClick={() => navigate("/auth")} className="flex items-center gap-4 rounded-full bg-gradient-to-r from-violet-500 to-violet-700 px-7 py-4 font-medium shadow-[0_18px_55px_rgba(109,74,255,.28)]">Começar gratuitamente <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.055] py-12">
        <div className="mx-auto flex w-[min(1400px,calc(100%-40px))] flex-col justify-between gap-8 text-sm text-white/35 md:flex-row">
          <div className="flex items-center gap-3 text-white/75"><span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-700"><Sparkles className="h-3.5 w-3.5" /></span>Smart Post AI</div>
          <div>© 2026 Smart Post AI. Todos os direitos reservados.</div>
        </div>
      </footer>
    </main>
  );
};

export default Index;
