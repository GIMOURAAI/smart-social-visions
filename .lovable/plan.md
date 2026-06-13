## SmartPostAI — Arquitetura completa

### 1. Banco de dados (migrations)

**Tabela `subscription_plans`** (catálogo fixo)
- `id`, `slug` (solo|pro|business), `name`, `price_brl`, `credits_per_month`, `stripe_price_id`

Seed:
- Solo — R$49 — 15 créditos
- Pro — R$79 — 30 créditos
- Business — R$129 — 60 créditos

**Tabela `user_credits`** (saldo atual)
- `user_id` (PK, FK auth.users)
- `plan_slug` (default null = sem plano)
- `credits_remaining` (int, default 0)
- `credits_total_month` (int)
- `period_start`, `period_end` (timestamps — quando renova)
- `stripe_customer_id`, `stripe_subscription_id`

**Tabela `credit_transactions`** (auditoria)
- `user_id`, `delta` (negativo = uso, positivo = recarga/renovação), `reason`, `post_id?`, `created_at`

**Tabela `post_batches`** (lote do wizard — 7/15/30 dias)
- `user_id`, `brand_name`, `niche`, `theme`, `objective`, `tone`, `visual_style`, `feed_pattern`, `format`, `days`, `total_posts`, `status` (draft|piloto|aprovado|gerando|concluido), `pilot_count`

**Tabela `posts`** (expandir a existente)
- adicionar: `batch_id`, `block` (dor|autoridade|valor|venda), `position`, `gancho`, `titulo_arte`, `subtitulo`, `texto_arte`, `legenda`, `cta`, `hashtags` (text[]), `story_complementar`, `image_prompt`, `approved` (bool)

Função `consume_credit(user_id, amount)` SECURITY DEFINER que decrementa atomicamente e registra na `credit_transactions`. Retorna erro se saldo < amount.

### 2. Edge Functions

Todas usando `OPENAI_API_KEY` (secret do projeto, não do cliente).

| Função | Modelo | O que faz |
|---|---|---|
| `generate-post-batch` | GPT-4o + DALL-E 3 | Gera **até 3 posts** por chamada. Recebe `batch_id`, `block`, `count` (1 ou 3). Verifica saldo → chama GPT-4o em modo JSON estruturado (gancho/título/subtítulo/texto arte/legenda/CTA/hashtags/story/imagePrompt) → chama DALL-E 3 por post → faz upload no bucket `post-images` → insere em `posts` → debita 1 crédito por post via `consume_credit` |
| `create-checkout` | Stripe | Checkout de assinatura (price_id por plano) |
| `check-subscription` | Stripe | Confere status no Stripe e atualiza `user_credits` + renova créditos se virou o período |
| `customer-portal` | Stripe | Portal de gerenciamento |

Funções antigas (`generate-image`, `generate-smartpost`, `generate-post-ideas`, `create-post-with-ai`, `enhance-image`) serão **removidas** — substituídas pela nova `generate-post-batch`.

### 3. Wizard — 6 passos (`/create`)

```text
Step 1  Briefing      → para mim / para cliente, marca, nicho, tema
Step 2  Objetivo+Tom  → vendas|autoridade|engajamento|viral + tom de voz
Step 3  Visual        → 9 temas PostLab (cards) OU upload referência
Step 4  Feed Pattern  → xadrez, escuro, claro, colorido, gradiente, temático
Step 5  Quantidade    → 7/15/30 dias × formato (1350x1080, 9:16, 16:9)
                       + piloto: 1 ou 3 posts antes do resto
Step 6  Confirmação   → resumo + custo (X créditos) + saldo atual
                       botão "Gerar piloto" desabilitado se sem saldo
```

### 4. Fluxo de geração

1. Wizard cria `post_batches` (status=draft).
2. Step 6 → chama `generate-post-batch` com `count = pilot_count` (1 ou 3), `block = "dor"`.
3. Tela **PilotReview** mostra os posts do piloto → "Aprovar e gerar resto" ou "Refazer piloto".
4. Aprovado → loop frontend chama `generate-post-batch` em blocos de 3, percorrendo ordem **Dor → Autoridade → Valor → Venda** até completar `total_posts - pilot_count`. Barra de progresso.
5. Tela final **FeedPreview** grid 3xN estilo Instagram + botão "Download PDF".

### 5. PDF Export

`src/lib/downloadPDF.ts` (já existe) — expandir para incluir todos os campos novos por post (gancho, legenda, CTA, hashtags, story, imagem).

### 6. Bloqueio de saldo

- Hook `useCredits()` lê `user_credits` em realtime.
- Header mostra saldo (ex: "12 créditos").
- Step 6 bloqueia botão se `credits_remaining < custo_estimado`.
- Edge function `generate-post-batch` valida no backend (defesa em profundidade) — retorna 402 se sem saldo.
- Modal "Sem créditos" → redireciona `/pricing`.

### 7. Stripe

- 3 produtos/preços recorrentes mensais (criados via tool).
- `check-subscription` rodando no login e a cada 1min:
  - Se assinatura ativa E `now() >= period_end` → renova: `credits_remaining = credits_total_month`, atualiza `period_start/end`, registra transação.

### 8. Limpeza

- Remover memória "API Key Strategy" (cliente NÃO usa chave própria).
- Atualizar memória core: "OPENAI_API_KEY do dono fica no backend; cliente consome créditos do plano".
- Remover qualquer UI de "configure sua API key".

### 9. Sobre o GitHub

Lovable já tem sync bidirecional com o repo conectado — não preciso "puxar" código manualmente, o que está no projeto **é** o que está no GitHub `main`. Vou trabalhar direto no estado atual.

### 10. Secret necessário

Vou pedir o `OPENAI_API_KEY` (sua chave da OpenAI) via formulário seguro antes de mexer nas edge functions. Sem isso a geração não roda.

---

### Ordem de execução

1. Pedir `OPENAI_API_KEY` (secret form).
2. Migration: tabelas + função `consume_credit` + seeds dos planos.
3. Criar 3 produtos Stripe.
4. Edge functions: `generate-post-batch`, atualizar `check-subscription`/`create-checkout`, criar `customer-portal`. Remover as antigas.
5. Frontend: `useCredits` hook, badge no Header, refazer Steps 1–6, telas PilotReview + FeedPreview, página `/pricing` com 3 planos.
6. Atualizar `downloadPDF.ts`.
7. Atualizar memórias.

### Detalhes técnicos

- DALL-E 3 só aceita 1024x1024, 1024x1792 ou 1792x1024 → mapeio: 1350x1080→1024x1024, 9:16→1024x1792, 16:9→1792x1024. Pós-processamento de crop no frontend se quiser exatamente 1350x1080.
- GPT-4o em modo `response_format: json_object` com schema dos campos por post.
- Limite rígido de 3 posts/chamada para evitar timeout de edge function (10s no plano free, 60s Pro).
- Upload das imagens DALL-E (que vêm como URL temporária) → fetch → upload no bucket `post-images` → salvar URL pública em `posts.image_url`.

### O que NÃO vou fazer agora

- Não vou trocar o design visual (mantém liquid/metálico atual).
- Não vou mexer no Canvas Editor (Fabric.js) — continua funcionando para edição manual depois.
- Não vou implementar webhook Stripe (uso polling via `check-subscription` conforme padrão Lovable).
