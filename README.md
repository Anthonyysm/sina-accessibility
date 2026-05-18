# SINA

**Sistema Inclusivo de Apoio ao Ensino Bilíngue para Pessoas Surdas**

![Landing Page](./README-PICS/landingpage.png)

---

## Descrição do projeto

No Brasil, a educação de pessoas surdas adota o modelo bilíngue: Libras como primeira língua e o português como segunda (L2). As duas línguas possuem estruturas gramaticais completamente distintas, exigindo mediação contínua de intérpretes e professores especializados.

Em escolas onde vários professores passam pela mesma turma ao longo do dia, essa demanda se torna insustentável — os intérpretes precisam adaptar conteúdos em tempo real, sem canal de comunicação prévia com os professores e sem ferramentas de apoio escaláveis. Isso gera sobrecarga cognitiva, perda de compreensão e dificuldade de inclusão real.

O SINA resolve esse problema oferecendo uma plataforma que:

- Permite ao professor/intérprete enviar conteúdos didáticos e receber automaticamente uma versão adaptada em português L2 com apoio de IA
- Disponibiliza os conteúdos adaptados para os alunos surdos em formato de feed, com suporte ao **VLibras** (tradução para Libras via widget)
- Dá ao intérprete acesso antecipado aos conteúdos e ferramentas de anotação privada, reduzindo a carga de adaptação manual em sala
- Oferece sistema de feedback simples para interação entre aluno e atividade

---

## Tecnologias utilizadas

| Tecnologia                 | Versão        | Finalidade                                               |
| -------------------------- | ------------- | -------------------------------------------------------- |
| Next.js                    | 16.1.7        | Framework fullstack (App Router, API Routes, Middleware) |
| React                      | 19.2.4        | Interface de usuário                                     |
| TypeScript                 | 5.9.3         | Tipagem estática                                         |
| PostgreSQL                 | 16+           | Banco de dados relacional                                |
| Prisma ORM                 | 7.8.0         | Modelagem, migrações e type-safe queries                 |
| Firebase Auth              | 12.13.0 (SDK) | Autenticação via Google e Email/Senha                    |
| Vercel AI SDK              | 6.0.183       | Orquestração de agentes de IA                            |
| Google AI (Gemini)         | 3.0.74        | Geração de glosas, glossários e observações pedagógicas  |
| GSAP                       | 3.15.0        | Animações na landing page                                |
| VLibras                    | Widget v2     | Tradução automática de texto para Libras                 |
| Tailwind CSS               | 4.2.1         | Estilização utilitária e responsiva                      |
| shadcn/ui + Radix UI       | 1.4.3         | Componentes acessíveis e semânticos                      |
| Zod                        | 4.4.3         | Validação de dados                                       |
| Sonner                     | 2.0.7         | Notificações toast                                       |
| Lucide React + React Icons | —             | Iconografia                                              |

---

## Abordagens e metodologias

**Kanban Adaptado:** Trello para mapeamento visual de tarefas (_A Fazer, Em Progresso, Code Review, Concluído_).

**Sprints Diárias (1 dia):** Ciclos de entrega de 24h com alinhamento de escopo no início e revisão ao final.

**Hackathon:** Este projeto foi desenvolvido para um hackathon, com foco em MVP funcional e demonstração de impacto.

---

## Como executar o projeto

> [!IMPORTANT]
> Este projeto utiliza a **Google Gemini API**. Para testar localmente, você precisará gerar sua própria chave de API no [Google AI Studio](https://aistudio.google.com). Sem uma `GEMINI_API_KEY` válida no arquivo `.env`, a funcionalidade de adaptação de conteúdos com IA não funcionará.

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

| Comando             | Descrição                                          |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Inicia o servidor de desenvolvimento com Turbopack |
| `npm run build`     | Gera o build de produção                           |
| `npm start`         | Inicia o servidor de produção                      |
| `npm run lint`      | Executa o ESLint                                   |
| `npm run typecheck` | Verificação de tipos com TypeScript                |
| `npm run format`    | Formata o código com Prettier                      |

---

## Diagrama do modelo lógico do banco de dados

![Diagrama do modelo lógico do banco de dados](./README-PICS/diagrama-relacional-sina.png)

---

## Próximos passos

- [ ] Upload de arquivos PDF para processamento pela IA
- [ ] Notificações em tempo real
- [ ] Testes automatizados
