---
name: Pricing
description: Monthly renewing credit subscriptions via Stripe
type: feature
---
3 planos mensais recorrentes em BRL via Stripe Checkout:
- **Solo** — R$49 — 15 créditos/mês (price_1ThqpPFEeMHcHuvRtEr6pguZ)
- **Pro** — R$79 — 30 créditos/mês (price_1Thqq6FEeMHcHuvRzpm59fWF) — destaque "Mais popular"
- **Business** — R$129 — 60 créditos/mês (price_1ThrGFFEeMHcHuvRObw8QXwz)

Renovação automática: quando `current_period_start` do Stripe muda, `check-subscription` reseta `credits_remaining = credits_total_month` e registra transação `renewal:<slug>`. Mudança de plano registra `plan_change:<slug>`. Página `/pricing` lista os planos + botão de portal para gerenciar.
