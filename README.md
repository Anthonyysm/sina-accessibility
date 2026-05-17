# SINA

**Sistema Inclusivo de Apoio ao Ensino Bilíngue para Pessoas Surdas**

---

## Descrição do projeto

No Brasil, a educação de pessoas surdas adota o modelo bilíngue: Libras como primeira língua e o português como segunda (L2). As duas línguas possuem estruturas gramaticais completamente distintas, exigindo mediação contínua de intérpretes e professores especializados.

Em escolas onde vários professores passam pela mesma turma ao longo do dia, essa demanda se torna insustentável — os intérpretes precisam adaptar conteúdos em tempo real, sem canal de comunicação prévia com os professores e sem ferramentas de apoio escaláveis.

O SINA resolve esse problema oferecendo uma plataforma que:

- Permite ao professor/intérprete criar atividades com texto didático e receber automaticamente uma versão adaptada em **Glosa de Libras** com apoio de IA
- Disponibiliza os conteúdos adaptados para os alunos surdos em formato de feed, com suporte ao **VLibras** (tradução para Libras via widget)
- Dá ao intérprete acesso antecipado aos conteúdos e ferramentas de anotação privada, reduzindo a carga de adaptação manual em sala
- Oferece sistema de comentários para interação entre aluno e atividade

---

## Tecnologias utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Next.js | 16.1.7 | Framework fullstack (App Router, API Routes, Middleware) |
| React | 19.2.4 | Interface de usuário |
| TypeScript | 5.9.3 | Tipagem estática |
| PostgreSQL | 16+ | Banco de dados relacional |
| Prisma ORM | 7.8.0 | Modelagem, migrações e type-safe queries |
| Firebase Auth | 12.13.0 (SDK) | Autenticação via Google e Email/Senha |
| Vercel AI SDK | 6.0.183 | Orquestração de agentes de IA |
| Google AI (Gemini) | 3.0.74 | Geração de glosas, glossários e observações pedagógicas |
| GSAP | 3.15.0 | Animações na landing page |
| VLibras | Widget v2 | Tradução automática de texto para Libras |
| Tailwind CSS | 4.2.1 | Estilização utilitária e responsiva |
| shadcn/ui + Radix UI | 1.4.3 | Componentes acessíveis e semânticos |
| Zod | 4.4.3 | Validação de dados |
| Sonner | 2.0.7 | Notificações toast |
| Lucide React + React Icons | — | Iconografia |
| next-themes | 0.4.6 | Gerenciamento de tema (dark/light) |

---

## Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Landing  │  │ Dashboard    │  │ StudentDash   │  │
│  │  Page    │  │ (Intérprete) │  │  (Aluno)      │  │
│  └──────────┘  └──────────────┘  └───────────────┘  │
│         │              │                 │           │
│         └──────────────┼─────────────────┘           │
│                        │                             │
│              ┌─────────▼──────────┐                  │
│              │   Auth Dialog      │                  │
│              │  (Google/Email)    │                  │
│              └─────────┬──────────┘                  │
└────────────────────────┼─────────────────────────────┘
                         │
              ┌──────────▼───────────┐
              │   Middleware (Auth)  │
              │  Role-based routing  │
              └──────────┬───────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │          API Routes (Next.js)            │
    │  ┌──────────┐  ┌──────────┐  ┌───────┐  │
    │  │atividades│  │usuarios  │  │agents │  │
    │  │ /coment. │  │/vinculos │  │(IA)   │  │
    │  └────┬─────┘  └────┬─────┘  └───┬───┘  │
    └───────┼─────────────┼────────────┼──────┘
            │             │            │
   ┌────────▼─────┐ ┌────▼─────┐ ┌────▼──────┐
   │  PostgreSQL  │ │ Firebase │ │  Gemini   │
   │  (Prisma)    │ │   Auth   │ │   AI SDK  │
   └──────────────┘ └──────────┘ └───────────┘
```

### Camadas

| Camada | Diretório | Responsabilidade |
|---|---|---|
| **UI Components** | `components/` | Componentes React reutilizáveis (Sidebar, Topbar, Feed, Modal, Translator, VLibras) |
| **Pages** | `app/` | Rotas da aplicação (Landing, Login, Dashboard, StudentDashboard, Perfil) |
| **API Routes** | `app/api/` | Endpoints REST para atividades, usuários, comentários, vínculos e agentes de IA |
| **Services** | `service/` | Lógica de negócio desacoplada — auth, agentes, operações de banco |
| **Lib** | `lib/` | Utilitários — Prisma client, JWT, sessão, autenticação, erros |
| **Middleware** | `middleware.ts` | Proteção de rotas baseada em sessão JWT e role (INTERPRETE vs ESTUDANTE) |

---

## Features implementadas

### Autenticação e autorização
- Login/cadastro com **Google OAuth** e **Email/Senha** via Firebase Auth
- Sessão segura com **JWT + httpOnly cookie** (5 dias de duração)
- **Middleware** com proteção de rotas e redirecionamento por role:
  - `INTERPRETE` → `/Dashboard`
  - `ESTUDANTE` → `/StudentDashboard`
- Dialog de autenticação com validação de senha (mín. 6 chars, maiúscula + número)

### Dashboard do Intérprete/Professor
- **Welcome banner** com call-to-action para criar novo material
- **Tabela de atividades recentes** com dados do banco
- **Modal de criação de atividade** com título e texto original (até 15.000 chars)
- **Sidebar** com navegação, avatar do usuário e link para edição de perfil
- **Topbar** com título dinâmico e botão de logout

### Tradutor com IA (Glosa de Libras)
- Agente de IA configurável via `agentsRegistry` (arquitetura extensível)
- Entrada: texto didático em português
- Saída em 3 seções:
  - **Glosa** — versão adaptada para estrutura de Libras
  - **Observações para o Intérprete** — notas pedagógicas contextuais
  - **Glossário** — termos difíceis com explicação
- UI com estados de loading, empty state e feedback visual (toast)
- Copiar conteúdo e gerar PDF via `window.print()`
- Sanitização de input e limite de 30.000 caracteres

### Dashboard do Aluno
- **Feed de atividades** com cards por matéria
- **Barra de progresso** (atividades concluídas vs total)
- **Filtros**: Todos, Pendentes, Concluídas
- **Comentários** em cada atividade
- **Marcar como concluída** com toggle
- Dados carregados via API com mapeamento do modelo Prisma

### Landing Page
- Seções: Hero, Problema, Features, Como Funciona, Antes/Depois, CTA
- Animações com **GSAP**
- Design responsivo com **Tailwind CSS v4**

### Acessibilidade
- **VLibras Widget** integrado em toda a aplicação (oculto em mobile)
- Componentes **shadcn/ui + Radix UI** com acessibilidade nativa
- Fontes otimizadas (Montserrat, Inter, Domine, Poppins)

---

## Banco de dados

> **PostgreSQL** com **Prisma ORM** — modelo relacional com integridade referencial

### Modelo

| Modelo | Descrição | Relacionamentos |
|---|---|---|
| `Usuario` | Professores, Intérpretes e Estudantes. `tipo_usuario` define perfil e permissões. | 1:N com `Atividade` e `Estudante`. N:M consigo mesmo via `ProfessorEstudante`. |
| `Atividade` | Materiais didáticos com texto original e versão adaptada. | Pertence a um `Usuario`. 1:N com `Estudante` (comentários). |
| `Estudante` | Comentários/interações em atividades. | Pertence a uma `Atividade` e a um `Usuario` (cascade on delete). |
| `ProfessorEstudante` | Tabela pivô N:M entre professores/intérpretes e estudantes. | Conecta dois IDs de `Usuario` com timestamp de vínculo. |

### Decisões de modelagem

| Decisão | Justificativa |
|---|---|
| **PostgreSQL + Prisma** | Integridade com foreign keys, type-safe queries, migrações versionadas. |
| **Auth (Firebase) separado do Banco (PostgreSQL)** | Firebase cuida apenas de identidade (ID Tokens). Regras de negócio e dados ficam no backend. Vínculo via `email`. |
| **Tabela pivô `ProfessorEstudante`** | Um intérprete acompanha vários alunos; um aluno tem múltiplos professores. Resolve M:N com histórico (`vinculado_em`). |
| **Serviços desacoplados em `service/server/`** | Lógica de banco e regras de negócio isoladas. API routes atuam como controladores finos. |

---

## Abordagens e metodologias

**Kanban Adaptado:** Trello para mapeamento visual de tarefas (*A Fazer, Em Progresso, Code Review, Concluído*).

**Sprints Diárias (1 dia):** Ciclos de entrega de 24h com alinhamento de escopo no início e revisão ao final.

---

## Como executar o projeto

### Pré-requisitos

- Node.js >= 18.x
- Conta no [Firebase Console](https://console.firebase.google.com)
- Chave de API do [Google AI Studio](https://aistudio.google.com)
- PostgreSQL 16+ (local ou remoto)

### 1. Clone o repositório

```bash
git clone https://github.com/Anthonyysm/sina-accessibility
cd sina-accessibility
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Gemini API (server-side only)
GEMINI_API_KEY=

# PostgreSQL
DATABASE_URL="postgresql://user:password@host:port/database"
```

### 4. Configure o Banco de Dados

Execute as migrações do Prisma para criar as tabelas:

```bash
npx prisma migrate dev
```

No console do Firebase, ative:
- **Authentication** → métodos E-mail/senha e Google

### 5. Execute em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`.

### 6. Build para produção

```bash
npm run build
npm start
```

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento com Turbopack |
| `npm run build` | Gera o build de produção |
| `npm start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint |
| `npm run typecheck` | Verificação de tipos com TypeScript |
| `npm run format` | Formata o código com Prettier |

---

## Estrutura de diretórios

```
sina-accessibility/
├── app/                          # Next.js App Router
│   ├── (private)/                # Rotas protegidas (group route)
│   │   ├── Dashboard/            # Painel do intérprete/professor
│   │   ├── StudentDashboard/     # Painel do aluno
│   │   └── Perfil/               # Edição de perfil
│   ├── api/                      # API Routes
│   │   ├── agents/[agentType]/   # Endpoint genérico para agentes de IA
│   │   ├── atividades/           # CRUD de atividades
│   │   ├── auth/                 # Login, registro, sessão
│   │   ├── comentarios/          # Comentários em atividades
│   │   ├── usuarios/             # Dados de usuários
│   │   └── vinculos/             # Vínculos professor-estudante
│   ├── LandingPage/              # Landing page com seções
│   └── Login/                    # Página de login
├── components/                   # Componentes React
│   ├── atividades/               # Modal de nova atividade
│   ├── auth/                     # Dialog de autenticação
│   ├── layout/                   # Sidebar, Topbar, TableContent
│   ├── StudentDashboard/         # Feed, Post, ProgressBar, Topbar
│   ├── Translator/               # Tradutor com IA
│   ├── ui/                       # Componentes shadcn/ui
│   └── VLibras/                  # Widget VLibras
├── service/                      # Lógica de negócio
│   ├── agents/                   # Agentes de IA (registry + executor)
│   ├── auth/                     # Firebase auth helpers
│   └── server/                   # Operações de banco (CRUD)
├── lib/                          # Utilitários
│   ├── generated/prisma/         # Prisma client gerado
│   ├── useAuth.tsx               # Auth context + hook
│   ├── jwt.ts                    # JWT sign/verify
│   ├── session.ts                # Gerenciamento de cookie de sessão
│   └── errors.ts                 # Tratamento padronizado de erros
├── prisma/                       # Schema e migrações
├── hooks/                        # Custom hooks (a expandir)
├── types/                        # Types TypeScript
├── middleware.ts                 # Proteção de rotas por role
└── docker-compose.yml            # PostgreSQL via Docker
```

---

## Diagrama do modelo lógico

![Diagrama do modelo lógico do banco de dados](./diagrama-sina.png)

---

## Próximos passos

- [ ] Extração de lógica repetitiva para **custom hooks** (`useActivities`, `useTranslator`, `useClipboard`, `useActivityForm`)
- [ ] Upload de arquivos PDF para processamento pela IA
- [ ] Integração com Firebase Storage
- [ ] Página de edição de perfil
- [ ] Notificações em tempo real
- [ ] Testes automatizados
