# CRM Consultoria

MVP de CRM comercial para empresas de consultoria, construído em Next.js (App Router) e React.

## Funcionalidades

- Kanban do funil de vendas
- Indicadores de pipeline, receita e oportunidades
- Cadastro de novos clientes em modal
- Consultor responsável por oportunidade
- Informações comerciais e próxima ação
- Mudança de etapa do funil
- Modal detalhado por cliente
- Histórico de ligações, WhatsApp, e-mail, reuniões e observações
- Registro de conteúdo e resultado de cada interação
- Dados totalmente mockados
- Sem autenticação e sem banco de dados nesta versão

## Desenvolvimento

```bash
npm install
npm run dev
```

## Persistência

Nesta versão, novos clientes, mudanças de etapa e interações ficam apenas no estado React e são perdidos ao recarregar a página. O projeto está estruturado como MVP para receber uma camada de persistência posteriormente.
