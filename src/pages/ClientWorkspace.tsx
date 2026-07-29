import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BriefcaseBusiness, Check, ChevronDown, CircleDollarSign,
  Eye, FileImage, FolderOpen, Grid2X2, Home, Image as ImageIcon, LayoutDashboard,
  MessageSquare, MoreVertical, Palette, Play, Plus, Search, Settings, Share2,
  Sparkles, Type, Upload, Users, Video, WandSparkles
} from "lucide-react";

const brandImage = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85";
const productImages = [
  "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=700&q=80",
];

type View = "portfolio" | "branding" | "reels" | "presentation";

const projects = [
  { name: "Studio Belle", category: "Beleza", colors: ["#6e4c2f", "#aa7d52", "#dfc8ad"], image: productImages[0] },
  { name: "Aurora Joias", category: "Joias", colors: ["#7a6046", "#d3b78c", "#f4eadb"], image: productImages[1] },
  { name: "Verde Vivo", category: "Paisagismo", colors: ["#536348", "#929c78", "#e7e7d7"], image: productImages[2] },
  { name: "Café Origem", category: "Gastronomia", colors: ["#4a2d1f", "#9a6a48", "#e1c6a6"], image: productImages[1] },
  { name: "Clínica Vitta", category: "Saúde", colors: ["#71858c", "#aebec0", "#eef0ec"], image: productImages[2] },
  { name: "Soul Wear", category: "Moda", colors: ["#2c2723", "#9f8a79", "#ebe1d8"], image: productImages[0] },
];

const reels = [
  { title: "Lançamento Beleza que Conecta", status: "Em aprovação", date: "22/05/2025", image: productImages[0] },
  { title: "Rotina de Skincare Minimalista", status: "Aprovado", date: "21/05/2025", image: productImages[1] },
  { title: "Novidades Studio Belle", status: "Aprovado", date: "20/05/2025", image: productImages[2] },
  { title: "Benefícios Naturais", status: "Alteração", date: "19/05/2025", image: productImages[0] },
];

export default function ClientWorkspace() {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = useMemo<View>(() => {
    if (location.pathname.includes("branding")) return "branding";
    if (location.pathname.includes("reels")) return "reels";
    if (location.pathname.includes("apresentacao")) return "presentation";
    return "portfolio";
  }, [location.pathname]);
  const [view, setView] = useState<View>(initial);
  const [selectedReel, setSelectedReel] = useState(0);
  const [presentationStep, setPresentationStep] = useState(0);

  const changeView = (next: View) => {
    setView(next);
    const routes: Record<View, string> = {
      portfolio: "/portfolio",
      branding: "/branding",
      reels: "/reels-clientes",
      presentation: "/apresentacao-marca",
    };
    navigate(routes[next]);
  };

  return (
    <div className="min-h-screen bg-[#fbf8f4] text-[#2c211b] flex">
      <aside className="hidden lg:flex w-64 border-r border-[#e8ded4] bg-[#fffdf9] flex-col fixed inset-y-0 left-0 z-20">
        <div className="px-8 py-7 border-b border-[#eee5dc]">
          <div className="font-serif text-3xl tracking-[0.08em]">SMART</div>
          <div className="text-[9px] tracking-[0.5em] text-[#8d6a4c]">SOCIAL MEDIA</div>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <Nav icon={LayoutDashboard} label="Dashboard" onClick={() => navigate("/dashboard")} />
          <Nav icon={Users} label="Clientes" />
          <Nav icon={Grid2X2} label="Planejamento" />
          <Nav icon={ImageIcon} label="Feed" />
          <Nav icon={Check} label="Aprovações" badge="8" />
          <Nav icon={BriefcaseBusiness} label="Portfólio" active={view === "portfolio"} onClick={() => changeView("portfolio")} />
          <Nav icon={Palette} label="Branding do cliente" active={view === "branding"} onClick={() => changeView("branding")} />
          <Nav icon={Video} label="Reels por cliente" active={view === "reels"} onClick={() => changeView("reels")} />
          <Nav icon={WandSparkles} label="Apresentação" active={view === "presentation"} onClick={() => changeView("presentation")} />
          <Nav icon={CircleDollarSign} label="Financeiro" />
          <Nav icon={Settings} label="Configurações" />
        </nav>
        <div className="m-4 rounded-2xl border border-[#eadfd4] bg-[#faf4ec] p-4">
          <p className="text-xs text-[#8d6a4c]">Plano Premium</p>
          <p className="font-medium mt-1">Workspace completo</p>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 min-w-0">
        <header className="h-20 px-5 md:px-10 border-b border-[#e8ded4] bg-[#fffdf9]/90 backdrop-blur flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm text-[#72543c]"><ArrowLeft className="w-4 h-4"/> Voltar</button>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-[#e6dbcf] bg-white px-4 py-2 w-72"><Search className="w-4 h-4 text-[#9a826d]"/><input className="bg-transparent outline-none text-sm w-full" placeholder="Buscar..." /></div>
          <button className="w-10 h-10 rounded-full border border-[#e6dbcf] flex items-center justify-center"><Settings className="w-4 h-4"/></button>
        </header>

        {view === "portfolio" && <Portfolio onOpenBranding={() => changeView("branding")} />}
        {view === "branding" && <Branding onOpenPresentation={() => changeView("presentation")} />}
        {view === "reels" && <Reels selected={selectedReel} onSelect={setSelectedReel} />}
        {view === "presentation" && <Presentation step={presentationStep} onStep={setPresentationStep} />}
      </main>
    </div>
  );
}

function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7"><div><h1 className="font-serif text-4xl md:text-5xl">{title}</h1><p className="text-sm text-[#796b60] mt-2">{subtitle}</p></div>{action}</div>;
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return <div className="rounded-2xl border border-[#eadfd4] bg-white p-5 flex items-center gap-4"><div className="w-12 h-12 rounded-full bg-[#f6eee5] flex items-center justify-center text-[#9a653d]"><Icon className="w-5 h-5"/></div><div><p className="text-xs text-[#857569]">{label}</p><p className="font-serif text-3xl mt-1">{value}</p></div></div>;
}

function Portfolio({ onOpenBranding }: { onOpenBranding: () => void }) {
  return <div className="p-5 md:p-10"><PageTitle title="Portfólio" subtitle="Apresente seus melhores projetos em um só lugar." action={<button className="rounded-xl bg-[#9b673f] text-white px-5 py-3 text-sm flex items-center gap-2"><Plus className="w-4 h-4"/> Novo projeto</button>} />
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"><Stat icon={FolderOpen} label="Projetos publicados" value="18"/><Stat icon={Play} label="Apresentações" value="32"/><Stat icon={FileImage} label="Mockups" value="46"/><Stat icon={Sparkles} label="Marcas organizadas" value="24"/></div>
    <div className="grid xl:grid-cols-[1fr_340px] gap-6">
      <section className="rounded-2xl border border-[#eadfd4] bg-white p-4 md:p-6"><h2 className="font-serif text-xl mb-4">Projetos do portfólio</h2><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{projects.map((p) => <article key={p.name} className="rounded-xl border border-[#eadfd4] overflow-hidden bg-[#fffdfa]"><div className="h-32 overflow-hidden"><img src={p.image} className="w-full h-full object-cover" alt=""/></div><div className="p-4"><div className="flex items-start justify-between"><div><h3 className="font-serif text-xl">{p.name}</h3><p className="text-xs text-[#8a786a]">{p.category}</p></div><MoreVertical className="w-4 h-4"/></div><div className="flex gap-1 mt-4">{p.colors.map(c => <span key={c} className="w-8 h-8 rounded-md border" style={{background:c}} />)}</div><button onClick={onOpenBranding} className="mt-4 w-full rounded-lg border border-[#dfd0c2] py-2 text-sm hover:bg-[#f8f0e7]">Abrir projeto</button></div></article>)}</div></section>
      <aside className="rounded-2xl border border-[#eadfd4] bg-white p-4"><h2 className="font-serif text-xl mb-4">Destaque</h2><div className="rounded-xl overflow-hidden bg-[#efe3d7]"><img src={brandImage} className="h-72 w-full object-cover" alt="Studio Belle"/><div className="p-5"><h3 className="font-serif text-3xl">STUDIO BELLE</h3><p className="text-sm text-[#6f5b4c] mt-2">Identidade visual completa, aplicações, mockups e apresentação premium.</p><button onClick={onOpenBranding} className="mt-5 rounded-lg bg-[#9b673f] text-white px-4 py-2 text-sm">Ver projeto completo</button></div></div></aside>
    </div>
  </div>;
}

function Branding({ onOpenPresentation }: { onOpenPresentation: () => void }) {
  return <div className="p-5 md:p-10"><PageTitle title="Branding do Cliente" subtitle="Organize a identidade visual e os materiais de cada marca." action={<button className="rounded-xl border border-[#ddcdbf] bg-white px-5 py-3 text-sm flex items-center gap-2">Studio Belle <ChevronDown className="w-4 h-4"/></button>} />
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"><Stat icon={FolderOpen} label="Arquivos da marca" value="24"/><Stat icon={Sparkles} label="Logos" value="6"/><Stat icon={ImageIcon} label="Mockups" value="12"/><Stat icon={WandSparkles} label="Apresentação ativa" value="1"/></div>
    <div className="grid xl:grid-cols-[1.15fr_.85fr] gap-6"><section className="rounded-2xl border border-[#eadfd4] bg-white p-6"><div className="flex justify-between"><h2 className="font-serif text-xl">Identidade da marca</h2><button className="text-sm flex items-center gap-2"><Upload className="w-4 h-4"/> Adicionar arquivos</button></div><div className="grid md:grid-cols-2 gap-6 mt-6"><div className="rounded-xl bg-[#fbf6ef] p-8 text-center"><p className="text-xs uppercase tracking-widest text-[#8c7664]">Logo principal</p><p className="font-serif text-4xl mt-6">STUDIO BELLE</p><p className="text-xs tracking-[.25em] mt-2">BELEZA QUE REALÇA SUA ESSÊNCIA</p></div><div className="rounded-xl bg-[#fbf6ef] p-8 flex items-center justify-center"><div className="w-32 h-32 rounded-full border-2 border-[#8c6b4e] flex items-center justify-center font-serif text-5xl">SB</div></div></div><div className="grid md:grid-cols-2 gap-6 mt-6"><div><p className="text-xs uppercase tracking-widest mb-3">Paleta de cores</p><div className="flex gap-2">{["#654326","#9a6a41","#c7a37d","#e9dccb","#f8f4ee","#8f9674"].map(c=><span key={c} className="w-12 h-12 rounded-lg border" style={{background:c}} />)}</div></div><div><p className="text-xs uppercase tracking-widest mb-3">Tipografia</p><div className="flex gap-8"><div><span className="font-serif text-5xl">A</span><p className="text-xs">Cormorant Garamond</p></div><div><span className="text-4xl">Aa</span><p className="text-xs">Montserrat</p></div></div></div></div><p className="text-xs uppercase tracking-widest mt-8 mb-3">Mockups</p><div className="grid grid-cols-3 gap-3">{productImages.map(i=><img key={i} src={i} className="h-32 w-full rounded-xl object-cover" alt=""/>)}</div></section>
    <aside className="rounded-2xl border border-[#eadfd4] bg-white p-4"><h2 className="font-serif text-xl mb-4">Apresentação da marca</h2><div className="rounded-xl overflow-hidden border"><img src={brandImage} className="h-[420px] w-full object-cover" alt=""/><div className="p-4"><button onClick={onOpenPresentation} className="w-full rounded-lg bg-[#9b673f] text-white py-3 flex items-center justify-center gap-2">Abrir apresentação <ArrowRight className="w-4 h-4"/></button></div></div></aside></div>
  </div>;
}

function Reels({ selected, onSelect }: { selected: number; onSelect: (n:number)=>void }) {
  const item = reels[selected];
  return <div className="p-5 md:p-10"><PageTitle title="Reels por Cliente" subtitle="Organize links do Google Drive, comentários e aprovações." action={<button className="rounded-xl bg-[#9b673f] text-white px-5 py-3 text-sm flex items-center gap-2"><Plus className="w-4 h-4"/> Adicionar vídeo</button>} />
    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"><Stat icon={FolderOpen} label="Todos" value="18"/><Stat icon={Play} label="Em aprovação" value="5"/><Stat icon={Check} label="Aprovados" value="9"/><Stat icon={MessageSquare} label="Alteração" value="4"/></div>
    <div className="grid xl:grid-cols-[1fr_.85fr] gap-6"><section className="rounded-2xl border border-[#eadfd4] bg-white overflow-hidden"><div className="p-5 border-b"><h2 className="font-serif text-xl">Vídeos do cliente</h2></div>{reels.map((r,i)=><button key={r.title} onClick={()=>onSelect(i)} className={`w-full p-4 border-b flex gap-4 text-left hover:bg-[#fbf6ef] ${selected===i?"bg-[#fbf3e9]":""}`}><div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0"><img src={r.image} className="w-full h-full object-cover" alt=""/><span className="absolute inset-0 flex items-center justify-center"><span className="w-9 h-9 rounded-full bg-white/85 flex items-center justify-center"><Play className="w-4 h-4"/></span></span></div><div className="flex-1"><h3 className="font-medium">{r.title}</h3><p className="text-xs text-[#827165] mt-1">Google Drive · {r.date}</p><div className="flex gap-2 mt-3"><span className={`text-[11px] rounded-full px-2 py-1 ${r.status==="Aprovado"?"bg-green-100 text-green-700":r.status==="Alteração"?"bg-red-100 text-red-700":"bg-amber-100 text-amber-700"}`}>{r.status}</span></div></div><MoreVertical className="w-4 h-4"/></button>)}</section>
    <aside className="rounded-2xl border border-[#eadfd4] bg-white p-5"><div className="flex justify-between gap-4"><div><h2 className="font-serif text-2xl">{item.title}</h2><p className="text-xs text-[#8a786a] mt-1">drive.google.com/folders/studio-belle</p></div><MoreVertical className="w-4 h-4"/></div><div className="relative rounded-xl overflow-hidden mt-5"><img src={item.image} className="h-80 w-full object-cover" alt=""/><span className="absolute inset-0 flex items-center justify-center"><span className="w-16 h-16 rounded-full bg-white/85 flex items-center justify-center"><Play className="w-7 h-7"/></span></span></div><div className="mt-5 space-y-3"><div className="rounded-xl bg-[#fbf6ef] p-4"><p className="text-xs text-[#8a786a]">Comentário da agência</p><p className="text-sm mt-1">Vídeo finalizado e pronto para aprovação. A proposta transmite leveza e sofisticação.</p></div><div className="rounded-xl bg-[#fbf6ef] p-4"><p className="text-xs text-[#8a786a]">Feedback do cliente</p><p className="text-sm mt-1">Gostamos muito! Apenas ajustar o destaque do benefício nos primeiros segundos.</p></div></div><div className="grid grid-cols-2 gap-3 mt-5"><button className="rounded-lg bg-[#9b673f] text-white py-3 flex items-center justify-center gap-2"><Check className="w-4 h-4"/> Aprovar</button><button className="rounded-lg border border-[#c49a78] py-3 flex items-center justify-center gap-2"><MessageSquare className="w-4 h-4"/> Alteração</button></div></aside></div>
  </div>;
}

function Presentation({ step, onStep }: { step:number; onStep:(n:number)=>void }) {
  const labels = ["Início","Conceito","Logo","Cores","Tipografia","Mockups","Aplicações","Feed","Contato"];
  return <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8 bg-[#f8f3ed]"><div className="flex items-center justify-between mb-5"><div><p className="text-xs uppercase tracking-[.3em] text-[#8a6c54]">Apresentação da marca</p><h1 className="font-serif text-3xl">Studio Belle</h1></div><button className="rounded-xl border border-[#decdbf] bg-white px-4 py-2 flex items-center gap-2 text-sm"><Share2 className="w-4 h-4"/> Compartilhar</button></div><div className="grid lg:grid-cols-[220px_1fr] gap-5"><aside className="rounded-2xl border border-[#eadfd4] bg-white p-3 h-fit">{labels.map((l,i)=><button key={l} onClick={()=>onStep(i)} className={`w-full rounded-xl px-4 py-3 text-left text-sm flex items-center gap-3 ${step===i?"bg-[#f2e4d5] text-[#845633]":"hover:bg-[#faf5ef]"}`}><span className="w-6 text-xs">{String(i+1).padStart(2,"0")}.</span>{l}</button>)}</aside><section className="rounded-3xl overflow-hidden border border-[#e0d1c3] bg-white min-h-[680px] relative"><img src={brandImage} className="absolute inset-0 w-full h-full object-cover" alt=""/><div className="absolute inset-0 bg-gradient-to-r from-[#f4e8da]/95 via-[#f4e8da]/78 to-transparent"/><div className="relative z-10 p-10 md:p-20 max-w-2xl"><div className="w-24 h-24 rounded-full border border-[#79583d] flex items-center justify-center font-serif text-3xl">SB</div><h2 className="font-serif text-6xl md:text-8xl mt-10 leading-[.9]">STUDIO<br/>BELLE</h2><div className="h-px bg-[#8b684b] w-72 my-8"/><p className="tracking-[.25em] text-sm md:text-base">BELEZA QUE REALÇA<br/>SUA ESSÊNCIA</p><button onClick={()=>onStep(Math.min(8,step+1))} className="mt-12 rounded-xl bg-[#9b673f] text-white px-7 py-4 flex items-center gap-4">{step===0?"Iniciar apresentação":"Próxima seção"}<ArrowRight className="w-5 h-5"/></button></div><div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">{labels.map((_,i)=><button key={i} onClick={()=>onStep(i)} className={`w-2.5 h-2.5 rounded-full ${step===i?"bg-[#9b673f]":"bg-white/70"}`} />)}</div></section></div></div>;
}

function Nav({ icon: Icon, label, active, badge, onClick }: { icon:any; label:string; active?:boolean; badge?:string; onClick?:()=>void }) {
  return <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${active?"bg-[#f1e4d6] text-[#8a572f]":"text-[#5f5751] hover:bg-[#faf5ef]"}`}><Icon className="w-4 h-4"/><span className="flex-1 text-left">{label}</span>{badge&&<span className="text-[10px] rounded-full bg-[#f4e8d9] px-2 py-0.5">{badge}</span>}</button>;
}
