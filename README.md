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
| PostgreSQL | 16+ | Banco de dados relacional principal |
| Prisma ORM | 6.4.1 | Modelagem, migrações e consultas ao banco |
| Firebase Auth | 12.13.0 (SDK) | Autenticação de usuários via Google e Email/Senha |
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

### 4. Configure o Banco de Dados e Firebase

Crie as variáveis de ambiente do PostgreSQL e do Prisma no `.env`:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
```

Execute as migrações do Prisma para criar as tabelas:

```bash
npx prisma migrate dev
```

No console do Firebase, ative:
- **Authentication** → método E-mail/senha e Google
- **Storage** → modo produção

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

![Diagrama do modelo lógico do banco de dados](./diagrama-sina.png)

> Banco de dados: **PostgreSQL (Relacional) com Prisma ORM**

A estrutura do banco de dados foi migrada para um modelo relacional robusto no PostgreSQL para garantir integridade referencial, consultas complexas eficientes e uma melhor separação entre a persistência dos dados e a autenticação do Firebase.

### Tabelas Principais

| Tabela | Descrição | Relacionamentos |
|---|---|---|
| `usuarios` | Armazena dados de Professores, Intérpretes e Estudantes. O campo `tipo_usuario` define o perfil e permissões. | 1:N com `atividades` e `estudante_comentario`. N:M com `usuarios` (vínculos entre Professor e Estudante). |
| `atividades` | Representa os materiais didáticos. Contém o texto original e a versão simplificada (adaptada). | Pertence a um `usuario` (criador). 1:N com `estudante_comentario`. |
| `estudante_comentario` | Comentários e interações feitas em uma atividade. | Pertence a uma `atividade` e a um `usuario`. |
| `professor_estudante` | Tabela pivô que resolve a relação N:M entre professores/intérpretes e estudantes. | Conecta dois IDs de `usuarios`. |

### Decisões de modelagem

| Decisão | Justificativa |
|---|---|
| Adoção do **PostgreSQL + Prisma** | Um banco relacional oferece integridade de dados (foreign keys) forte, facilitando a vinculação estruturada de estudantes a professores e a cascata em exclusões (`onDelete: Cascade`). |
| Separação do **Auth** (Firebase) do **Banco** (PostgreSQL) | Utilizar o Firebase apenas para a camada de autenticação (ID Tokens) delegou a segurança de login para a Google, enquanto as regras de negócio e os dados estruturados permanecem protegidos sob o backend (Next.js API Routes). O vínculo entre os sistemas ocorre através do campo `email`. |
| Tabela Pivô `professor_estudante` | Em um contexto de inclusão, um professor de apoio (Intérprete) precisa acompanhar vários alunos, e um aluno pode ter múltiplos professores durante o dia. Esta tabela resolve as conexões M:N mantendo histórico (`vinculado_em`). |
| Centralização de Serviços de Backend | Toda a lógica de banco (`prisma`) e regras de negócio foi movida para diretórios `service/server/`, transformando as rotas da API em controladores finos, aprimorando a manutenção e a escalabilidade arquitetural. |