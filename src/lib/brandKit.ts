// Brand kit (identidade da marca) reutilizado pelo modo rápido e pelo Studio.
// Persistido localmente por usuário até existir uma tabela dedicada no banco.

export interface BrandKit {
  brandName: string;
  niche: string;
  visualStyle: string;
  logo: string | null;
  model: string | null;
  colors: string[];
}

export const EMPTY_KIT: BrandKit = {
  brandName: "",
  niche: "",
  visualStyle: "",
  logo: null,
  model: null,
  colors: [],
};

const KEY = "spa_brand_kit";

export function loadBrandKit(): BrandKit {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY_KIT };
    return { ...EMPTY_KIT, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_KIT };
  }
}

export function saveBrandKit(kit: BrandKit) {
  try {
    localStorage.setItem(KEY, JSON.stringify(kit));
  } catch {
    /* quota — ignora */
  }
}

export function hasBrandKit(kit: BrandKit) {
  return Boolean(kit.brandName || kit.logo || kit.model || kit.colors.length || kit.visualStyle);
}

/**
 * Codifica os assets da marca no formato aceito por `post_batches.brand_images`
 * (a edge function decodifica os prefixos logo:: / model:: / color:: / ref::).
 */
export function encodeBrandAssets(opts: {
  logo?: string | null;
  model?: string | null;
  colors?: string[];
  refs?: string[];
}): string[] {
  const out: string[] = [];
  if (opts.logo) out.push(`logo::${opts.logo}`);
  if (opts.model) out.push(`model::${opts.model}`);
  for (const c of opts.colors ?? []) out.push(`color::${c}`);
  for (const r of opts.refs ?? []) out.push(`ref::${r}`);
  return out;
}

/** Redimensiona e comprime uma imagem para caber com folga no banco. */
export function compressImage(file: File, maxSize = 768, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas indisponível"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Imagem inválida"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}
