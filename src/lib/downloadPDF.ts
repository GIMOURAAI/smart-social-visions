import type { GeneratedPost } from "@/pages/Create";

export function downloadPDF(posts: GeneratedPost[], brandName: string) {
  const date = new Date().toLocaleDateString("pt-BR");

  const postPages = posts.map((post, i) => `
    <div class="page">
      <div class="post-header">
        <div class="post-number">Post ${i + 1}</div>
        <div class="bloco-badge bloco-${post.bloco?.toLowerCase()}">${post.bloco ?? ""}</div>
      </div>

      ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image" alt="Imagem post ${i + 1}" crossorigin="anonymous" />` : ""}

      <div class="section">
        <div class="label">GANCHO</div>
        <div class="gancho">${post.gancho ?? ""}</div>
      </div>

      <div class="section">
        <div class="label">TÍTULO DA ARTE</div>
        <div class="value bold">${post.tituloArte ?? ""}</div>
      </div>

      ${post.subtituloArte ? `
      <div class="section">
        <div class="label">SUBTÍTULO</div>
        <div class="value">${post.subtituloArte}</div>
      </div>` : ""}

      ${post.textoArte ? `
      <div class="section">
        <div class="label">TEXTO DA ARTE</div>
        <div class="value pre">${post.textoArte.replace(/\n/g, "<br>")}</div>
      </div>` : ""}

      <div class="section highlight">
        <div class="label">LEGENDA</div>
        <div class="value">${post.legenda ?? ""}</div>
      </div>

      <div class="section">
        <div class="label">CTA</div>
        <div class="value bold primary">${post.cta ?? ""}</div>
      </div>

      <div class="section">
        <div class="label">HASHTAGS</div>
        <div class="value small muted">${post.hashtags ?? ""}</div>
      </div>

      ${post.storyComplementar ? `
      <div class="section">
        <div class="label">STORY COMPLEMENTAR</div>
        <div class="value small">${post.storyComplementar}</div>
      </div>` : ""}
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <title>${brandName} — SmartPostAI</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; color: #1a1a1a; }

    .cover {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 60px 40px; text-align: center;
      page-break-after: always;
    }
    .cover-logo { font-size: 14px; color: #a78bfa; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 40px; }
    .cover-brand { font-size: 42px; font-weight: 900; color: #ffffff; margin-bottom: 12px; }
    .cover-subtitle { font-size: 16px; color: #a78bfa; font-weight: 500; margin-bottom: 8px; }
    .cover-date { font-size: 13px; color: #6b7280; margin-top: 40px; }
    .cover-count { font-size: 13px; color: #4ade80; font-weight: 600; }
    .cover-divider { width: 60px; height: 3px; background: linear-gradient(90deg, #7c3aed, #ec4899); border-radius: 4px; margin: 24px auto; }

    .page {
      background: #ffffff;
      padding: 48px 56px;
      page-break-after: always;
      page-break-inside: avoid;
    }
    .post-header { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #f0f0f0; }
    .post-number { font-size: 22px; font-weight: 900; color: #1a1a1a; }
    .bloco-badge { font-size: 11px; font-weight: 700; padding: 4px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }
    .bloco-dor { background: #fef2f2; color: #dc2626; }
    .bloco-autoridade { background: #eff6ff; color: #2563eb; }
    .bloco-valor { background: #f0fdf4; color: #16a34a; }
    .bloco-venda { background: #fffbeb; color: #d97706; }

    .post-image { width: 100%; max-height: 400px; object-fit: cover; border-radius: 12px; margin-bottom: 28px; }

    .section { margin-bottom: 20px; }
    .label { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; }
    .value { font-size: 14px; color: #374151; line-height: 1.7; }
    .value.bold { font-weight: 700; font-size: 17px; color: #1a1a1a; }
    .value.primary { color: #7c3aed; }
    .value.small { font-size: 12px; }
    .value.muted { color: #6b7280; }
    .value.pre { white-space: pre-wrap; }
    .gancho { font-size: 20px; font-weight: 800; color: #1a1a1a; line-height: 1.3; }
    .highlight { background: #fafafa; padding: 16px 20px; border-radius: 12px; border-left: 4px solid #7c3aed; }
    .highlight .value { font-size: 13px; }

    @media print {
      @page { margin: 0; size: A4; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cover { min-height: 100vh; page-break-after: always; }
      .page { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-logo">SmartPostAI</div>
    <div class="cover-brand">${brandName}</div>
    <div class="cover-divider"></div>
    <div class="cover-subtitle">Conteúdo estratégico — Método PostLab</div>
    <div class="cover-count">${posts.length} posts prontos para publicar</div>
    <div class="cover-date">Gerado em ${date}</div>
  </div>
  ${postPages}
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 800);
    };
  </script>
</body>
</html>`;

  // Abre em nova janela e dispara print automático → usuário salva como PDF
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
