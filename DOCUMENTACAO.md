# Documentação do Projeto: Builder Spark Garden

## Visão Geral

O Builder Spark Garden é um template de aplicação full-stack, pronto para produção, utilizando React 18, Express, TypeScript, Vite, TailwindCSS, Radix UI, e integração de API. Ele oferece uma arquitetura moderna, com rotas SPA, hot reload, tipagem compartilhada entre client/server e um sistema de componentes UI robusto.

---

## Estrutura do Projeto

```
client/         # Frontend React SPA
server/         # Backend Express API
shared/         # Tipos TypeScript compartilhados
public/         # Arquivos estáticos
src/            # (Alternativo) Código React, hooks, utils, páginas
```

### Principais Pastas e Arquivos

- `client/pages/`: Componentes de página (rotas)
- `client/components/ui/`: Biblioteca de componentes UI reutilizáveis
- `client/App.tsx`: Setup de rotas SPA com React Router 6
- `server/index.ts`: Configuração principal do Express e registro de rotas
- `server/routes/`: Handlers de rotas de API
- `shared/api.ts`: Interfaces TypeScript compartilhadas entre client/server
- `public/`: Assets públicos (favicon, robots.txt, etc)
- `src/`: Alternativa para organização de código React, hooks, utils, páginas, etc.

---

## Tecnologias Utilizadas

- **Frontend:** React 18, React Router 6, TypeScript, Vite, TailwindCSS 3, Radix UI, Lucide Icons
- **Backend:** Express.js (integrado ao Vite para dev)
- **Testes:** Vitest
- **Build:** pnpm
- **UI:** Componentes prontos e utilitários de estilização
- **Hot Reload:** Para client e server

---

## Recursos e Funcionalidades

### 1. Sistema de Rotas SPA

- Utiliza React Router 6.
- Rotas declaradas em `client/App.tsx`.
- Cada página é um componente em `client/pages/`.
- Rota de fallback para 404 (`NotFound`).

### 2. Estilização

- TailwindCSS 3 para utilitários de CSS.
- Tokens de tema configuráveis em `client/global.css` e `tailwind.config.ts`.
- Componentes UI prontos em `client/components/ui/`.
- Função utilitária `cn()` para composição de classes.

### 3. Backend Express Integrado

- Servidor Express roda junto com o Vite em desenvolvimento (porta única).
- Endpoints de API prefixados com `/api/`.
- Exemplos: `/api/ping`, `/api/demo`.
- Rotas customizadas podem ser criadas em `server/routes/` e registradas em `server/index.ts`.

### 4. Tipagem Compartilhada

- Tipos TypeScript compartilhados em `shared/api.ts`.
- Importação via alias: `@shared/*` e `@/*`.

### 5. Componentes e Hooks Customizados

- Componentes visuais e de layout em `client/components/` e `src/components/`.
- Hooks customizados em `client/hooks/` e `src/hooks/` (ex: `use-mobile`, `use-toast`, `useTheme`).

### 6. Integrações Externas

- Configurações para EmailJS, Zapier, Google Sheets, Notion, Airtable em `src/utils/integrations.ts`.
- Uso de variáveis de ambiente via `import.meta.env`.

### 7. Testes

- Testes com Vitest.
- Comando: `pnpm test`.

### 8. Deploy

- Build de produção: `pnpm build`.
- Deploy fácil em Netlify ou Vercel.
- Suporte a binários self-contained para Linux, macOS e Windows.

---

## Comandos de Desenvolvimento

- `pnpm dev` — Inicia o servidor de desenvolvimento (client + server)
- `pnpm build` — Gera build de produção
- `pnpm start` — Inicia o servidor em produção
- `pnpm typecheck` — Valida tipos TypeScript
- `pnpm test` — Executa testes com Vitest

---

## Como Adicionar Novos Recursos

### Nova Rota de API

1. (Opcional) Crie interface em `shared/api.ts`.
2. Crie handler em `server/routes/`.
3. Registre a rota em `server/index.ts`.
4. Consuma no frontend usando fetch e tipagem compartilhada.

### Nova Página

1. Crie componente em `client/pages/`.
2. Adicione a rota em `client/App.tsx`.

### Novo Componente UI

1. Crie em `client/components/ui/`.
2. Importe e utilize nas páginas ou outros componentes.

---

## Observações de Arquitetura

- Desenvolvimento e build otimizados para produtividade.
- Hot reload para client e server.
- Estrutura modular e escalável.
- Pronto para deploy em múltiplos ambientes.

---

Se precisar de exemplos de código, fluxos de integração ou detalhes sobre algum recurso específico, é só pedir!
