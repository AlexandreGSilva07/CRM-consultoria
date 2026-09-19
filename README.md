# Nexo CRM — MVP Comercial

CRM demonstrativo para empresas de consultoria, construído com Next.js App Router.

## Stack

- Next.js + React + TypeScript
- Radix UI primitives para Dialog e Select
- Lucide React para iconografia
- Geist para tipografia
- CSS próprio, sem framework visual
- Deploy na Vercel

## Escopo do MVP

- Pipeline Kanban com drag & drop entre etapas
- Busca e filtros por consultor e origem
- Indicadores de pipeline, forecast ponderado, receita fechada e ações vencidas
- Probabilidade por etapa e previsão de fechamento
- Cadastro de novas oportunidades
- Responsável comercial por cliente
- Painel detalhado de cada oportunidade
- Próxima ação e alertas de atraso
- Histórico de ligações, WhatsApp, e-mail, reuniões e observações
- Registro de conteúdo e resultado de cada interação

## Persistência

Esta versão usa dados mockados e estado React. Novos registros e alterações são perdidos ao recarregar a página. Banco de dados e autenticação ficam para a próxima etapa.

## Rodar localmente

```bash
npm install
npm run dev
```
