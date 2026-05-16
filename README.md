# SINA

**Sistema Inclusivo de Apoio ao Ensino Bilíngue para Pessoas Surdas**

---

## Descrição do projeto

No Brasil, a educação de pessoas surdas adota o modelo bilíngue: Libras como primeira língua e o português como segunda (L2). O principal desafio é que as duas línguas possuem estruturas gramaticais completamente distintas, exigindo mediação contínua de intérpretes e professores especializados.

Em escolas onde vários professores passam pela mesma turma ao longo do dia, essa demanda se torna insustentável — os intérpretes precisam adaptar conteúdos em tempo real, sem canal de comunicação prévia com os professores, e sem ferramentas de apoio escaláveis.

O SINA resolve esse problema oferecendo uma plataforma que:

- Permite ao professor fazer upload de qualquer material didático e receber automaticamente uma versão simplificada, adequada ao ensino de português como L2
- Disponibiliza os conteúdos adaptados para os alunos surdos com suporte ao VLibras (tradução para Libras via widget)
- Dá ao intérprete acesso antecipado aos conteúdos e ferramentas de anotação privada, reduzindo a carga de adaptação manual em sala

---

## Tecnologias utilizadas e suas versões

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Next.js | 16.1.7 | Frontend e backend fullstack (App Router) |
| React | 19.2.4 | Interface de usuário |
| TypeScript | 5.9.3 | Tipagem estática |
| Firebase (Firestore) | 12.13.0 (SDK) | Banco de dados NoSQL em tempo real |
| Firebase Auth | 12.13.0 (SDK) | Autenticação de usuários |
| Firebase Storage | 12.13.0 (SDK) | Upload e armazenamento de arquivos |
| Gemini API (Google AI) | gemini-1.5-flash | Simplificação textual e extração de palavras-chave |
| VLibras | Widget v2 | Tradução automática de texto para Libras |
| Tailwind CSS | 4.2.1 | Estilização utilitária e responsiva |
| shadcn/ui | 4.7.0 | Componentes de interface acessíveis |

---

## Abordagens e metodologias

**Kanban Adaptado:** Utilizamos o Trello para o mapeamento visual de tarefas em colunas (*A Fazer, Em Progresso, Code Review e Concluído*), garantindo previsibilidade e organização mútua.

**Sprints Diárias (1 dia):** Devido ao cronograma dinâmico do projeto, adotamos ciclos de entrega (Sprints) de apenas 24 horas. Ao início de cada dia, alinhávamos o escopo do que seria entregue e, ao final, revisávamos as funcionalidades prontas, permitindo adaptação rápida a imprevistos.

---

## Como executar o projeto

### Pré-requisitos

- Node.js >= 18.x
- Conta no [Firebase Console](https://console.firebase.google.com)
- Chave de API do [Google AI Studio](https://aistudio.google.com)

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

Crie um arquivo `.env.local` na raiz do projeto:

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
```

### 4. Configure o Firebase

No console do Firebase, ative:
- **Authentication** → método E-mail/senha e google
- **Firestore Database** → modo produção
- **Storage** → modo produção

Publique as regras de segurança do Firestore:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

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

---

## Diagrama do modelo lógico do banco de dados

> Banco de dados: **Firebase Firestore (NoSQL orientado a documentos)**

O Firestore não usa tabelas relacionais. A estrutura é organizada em **coleções** (equivalente a tabelas) contendo **documentos** (equivalente a registros). Não existem JOINs — dados lidos juntos são mantidos no mesmo documento (denormalização controlada), e relacionamentos são representados por arrays de IDs ou campos de referência.

![Diagrama NoSQL — SINA](./diagrama-sina.png)

### Coleções

| Coleção | Descrição |
|---|---|
| `usuarios` | Professores, intérpretes e alunos. O campo `role` define o perfil e as permissões de acesso |
| `escola` | Instituição de ensino à qual usuários e turmas pertencem |
| `classes` | Turmas com arrays de IDs para professores, intérpretes e estudantes |
| `conteudo` | Material didático com texto original, versão simplificada, resumo e palavras-chave gerados pela IA |
| `content_files` | Arquivos anexados a um conteúdo (PDFs, imagens etc.), armazenados no Firebase Storage |
| `interprete_notas` | Anotações privadas do intérprete vinculadas a um conteúdo específico |

### Decisões de modelagem

| Decisão | Justificativa |
|---|---|
| `versaoSimplificada[]` como array em `conteudo` | Sempre lido junto com o documento principal; embutir evita leituras extras e mantém o histórico das últimas 3 versões geradas pela IA |
| `interprete_notas` como coleção separada | Regras de segurança distintas — alunos não devem ter acesso; separar permite Firestore Rules granulares por perfil |
| `professorId[]`, `interpreterId[]` e `estudanteId[]` em `classes` | Uma turma pode ter múltiplos professores ao longo do dia; arrays permitem query `array-contains` sem coleções intermediárias |
| `resumo` e `palavrasChave[]` embutidos em `conteudo` | Gerados junto com a simplificação numa única chamada à Gemini API; lidos sempre no mesmo contexto, não justificam documento separado |
