---
name: Credit Architecture
description: Credit system tables, atomic consumption function, edge function flow
type: feature
---
**Tabelas:**
- `subscription_plans` (slug, price_cents, credits_per_month, stripe_price_id) — público.
- `user_credits` (user_id PK, plan_slug, credits_remaining, credits_total_month, period_start/end, stripe_*). RLS: usuário lê o próprio.
- `credit_transactions` (delta, reason, post_id) — auditoria, RLS: usuário lê o próprio.
- `post_batches` (lote do wizard: brand, niche, tema, objetivo, tom, visual, padrão, formato, dias, total, pilot_count).
- `posts` expandida com: batch_id, block, position, gancho, titulo_arte, subtitulo, texto_arte, legenda, cta, hashtags[], story_complementar, image_prompt, approved.

**Função `consume_credit(_user_id, _amount, _reason, _post_id)`** — SECURITY DEFINER, EXECUTE só para service_role. Decrementa atomicamente; raise EXCEPTION 'INSUFFICIENT_CREDITS' se saldo < amount.

**Edge functions:**
- `generate-post-batch` — gera até 3 posts. Valida saldo, chama GPT-4o (JSON), chama DALL-E 3 por post, faz upload em `post-images`, insere post, debita 1 crédito por post. Retorna 402 com `INSUFFICIENT_CREDITS` quando não há saldo.
- `create-checkout` — Stripe checkout assinatura, lazy-cria preço se faltar.
- `check-subscription` — sincroniza assinatura ativa do Stripe, renova créditos quando muda `period_start` ou plano. Chamado no login do Dashboard.
- `customer-portal` — Stripe billing portal.

Frontend: `useCredits()` hook com realtime na user_credits. `<CreditsBadge />` no header. Step 6 do wizard bloqueia se `remaining < pilotQuantity`.
