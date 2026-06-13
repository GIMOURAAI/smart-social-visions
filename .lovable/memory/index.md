# Project Memory

## Core
- App: SmartPostAI. Futuristic liquid minimal design (metallic, dark/light gray, lime green, blue).
- Post creation uses the wizard at `/create` (6 steps + pilot review + feed preview). Never use a standalone `/editor` page.
- **OpenAI key fica no backend** (secret `OPENAI_API_KEY`) — cliente NUNCA fornece a própria chave.
- **Modelo de créditos**: 1 crédito = 1 post completo (copy + legenda + CTA + hashtags + gancho + story + imagem DALL·E 3). Sem saldo = nada gera. Função `consume_credit` debita atomicamente.
- **Planos mensais renováveis** (Stripe): Solo R$49 / 15 créditos, Pro R$79 / 30, Business R$129 / 60.
- **Geração em blocos de até 3 posts por chamada** à OpenAI (limite rígido). Ordem PostLab: Dor → Autoridade → Valor → Venda. Piloto (1 ou 3 posts) primeiro para aprovação visual.
- GPT-4o para texto (JSON estruturado), DALL-E 3 para imagem. Imagens vão para o bucket `post-images`.

## Memories
- [Visual Identity](mem://design/visual-identity) — Futuristic liquid aesthetic
- [Credit Architecture](mem://architecture/credits) — Tabelas user_credits, credit_transactions, função consume_credit, edge function generate-post-batch
- [Pricing](mem://pricing/subscription-structure) — Solo/Pro/Business mensais via Stripe
- [Wizard Flow](mem://features/post-creation-flow) — 6 passos + piloto + feed preview + PDF
- [Canvas Editor](mem://features/canvas-editor-implementation) — Fabric.js para edição manual de texto sobre imagem
