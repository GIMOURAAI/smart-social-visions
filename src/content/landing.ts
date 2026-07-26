import heroCreator from "@/assets/hero-creator.jpg";
import heroHologram from "@/assets/hero-hologram.jpg";
import cloneAi from "@/assets/clone-ai.jpg";
import customServices from "@/assets/custom-services.jpg";
import postFormats from "@/assets/post-formats.jpg";

export interface GalleryItem {
  image: string;
  label: string;
  caption: string;
}

export interface LandingPlan {
  name: string;
  price: string;
  credits: string;
  description: string;
  popular?: boolean;
  features: string[];
}

export interface LandingContent {
  hero: {
    wordmark: string;
    poweredBy: string;
    sideCopy: string;
    ctaLabel: string;
    ctaNote: string;
  };
  segments: {
    title: string;
    linkLabel: string;
    cardSubtitle: string;
    niches: string[];
  };
  projects: {
    title: string;
    ctaTitle: string;
    ctaSubtitle: string;
  };
  explore: {
    title: string;
  };
  statement: {
    text: string;
  };
  pricing: {
    eyebrow: string;
    title: string;
    subtitle: string;
    plans: LandingPlan[];
  };
  footer: {
    brand: string;
    tagline: string;
    ctaLabel: string;
  };
  gallery: GalleryItem[];
}

export const defaultLandingContent: LandingContent = {
  hero: {
    wordmark: "SMARTPOST",
    poweredBy: "POWERED BY",
    sideCopy: "Crie seu post\nOrganize sua marca\nExplore novas ideias",
    ctaLabel: "Começar agora",
    ctaNote: "Planos a partir de R$ 49,90",
  },
  segments: {
    title: "Feito para todos os negócios.",
    linkLabel: "Ver todos",
    cardSubtitle: "Imagem, copy e legenda em poucos segundos.",
    niches: ["Dentistas", "Médicos", "Advogados", "Corretores", "Academias", "Joalherias", "Políticos", "Moda"],
  },
  projects: {
    title: "Projetos",
    ctaTitle: "Novo projeto",
    ctaSubtitle: "Comece uma nova criação",
  },
  explore: {
    title: "Explore",
  },
  statement: {
    text: "O conteúdo criado para quem sabe a diferença.",
  },
  pricing: {
    eyebrow: "SMART POST AI",
    title: "Conteúdo profissional, sem equipe cara.",
    subtitle: "Escolha o volume ideal para sua rotina e crie posts completos com IA.",
    plans: [
      {
        name: "Solo",
        price: "49,90",
        credits: "15 posts",
        description: "Para quem está começando",
        features: ["Posts completos", "Imagem + copy + legenda", "CTA e hashtags"],
      },
      {
        name: "Pro",
        price: "89,90",
        credits: "30 posts",
        description: "Um mês inteiro de conteúdo",
        popular: true,
        features: ["Tudo do Solo", "Padrão de feed", "Mais estilos visuais"],
      },
      {
        name: "Studio",
        price: "169,90",
        credits: "60 posts",
        description: "Para designers e social medias",
        features: ["Tudo do Pro", "Múltiplas marcas", "Uso profissional"],
      },
    ],
  },
  footer: {
    brand: "SMART POST AI",
    tagline: "Estratégia, imagem e legenda em um único fluxo.",
    ctaLabel: "Começar agora",
  },
  gallery: [
    { image: customServices, label: "JOIAS", caption: "Elegância em cada detalhe." },
    { image: heroHologram, label: "IMÓVEIS", caption: "O lugar perfeito para chamar de seu." },
    { image: heroCreator, label: "ACADEMIA", caption: "Foco que gera resultados." },
    { image: cloneAi, label: "ADVOCACIA", caption: "Posicionamento com autoridade." },
    { image: postFormats, label: "SAÚDE", caption: "Conteúdo que gera confiança." },
    { image: customServices, label: "GASTRONOMIA", caption: "Visual que desperta desejo." },
    { image: heroCreator, label: "MODA", caption: "Presença que chama atenção." },
    { image: heroHologram, label: "POLÍTICA", caption: "Comunicação clara e estratégica." },
  ],
};
