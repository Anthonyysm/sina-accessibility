# SINA — Sistema Inclusivo de Apoio ao Ensino Bilíngue para Pessoas Surdas.

## Visão Geral

O SINA é uma plataforma web focada em apoiar a educação bilíngue de pessoas surdas no Brasil.

O sistema atua como uma ferramenta de mediação pedagógica entre:
- intérpretes de Libras;
- alunos surdos.

O objetivo principal é reduzir a dificuldade de adaptação de materiais didáticos para estudantes surdos que utilizam:
- Libras como primeira língua;
- Português como segunda língua (L2).

A aplicação utiliza IA generativa para:
- simplificar conteúdos;
- adaptar linguagem;
- gerar apoio pedagógico para intérpretes;
- melhorar acessibilidade educacional.

---

# Problema

Na educação bilíngue para surdos, muitos conteúdos escolares:
- utilizam linguagem complexa;
- possuem estruturas difíceis para alunos em contexto de português L2;
- chegam ao intérprete sem preparação prévia;
- exigem adaptação improvisada durante a aula.

Isso gera:
- sobrecarga cognitiva;
- perda de compreensão;
- dificuldade de inclusão real.

O SINA busca reduzir esse problema.

---

# Objetivo do MVP

Criar uma plataforma simples onde:
1. O interprete envia um conteúdo didático;
2. A IA adapta esse conteúdo para português L2;
3. O intérprete revisa e adiciona observações;
4. O aluno acessa uma versão mais acessível.

O MVP será desenvolvido para um hackathon de 48h.

---

# Usuário Principal

## Intérprete pedagógico

O intérprete é o principal usuário da plataforma.

Ele deve conseguir:
- visualizar conteúdos antecipadamente;
- revisar adaptações geradas pela IA;
- adicionar notas privadas;
- preparar melhor a mediação em sala.

---

# Usuários Secundários

## Aluno
Consumidor final do conteúdo adaptado.

O aluno NÃO terá funcionalidades complexas no MVP.

---

# Escopo do MVP

## Funcionalidades obrigatórias

### Upload de conteúdo
O interprete poderá:
- colar texto;
- enviar PDF simples.

---

### Adaptação automática com IA
A IA deve gerar:
- versão simplificada em português L2;
- resumo pedagógico para intérprete;
- glossário de termos difíceis.

---

### Modo intérprete
O intérprete poderá:
- revisar o conteúdo adaptado;
- editar textos;
- adicionar observações privadas;
- destacar dificuldades pedagógicas.

---

### Visualização do aluno
O aluno visualizará:
- conteúdo simplificado;
- blocos curtos de leitura;
- glossário;
- integração com VLibras.

---

### Feedback simples
O aluno poderá clicar:
- "não entendi";
- "difícil";
- "entendi".

---

# Fora do Escopo

NÃO implementar:
- chat;
- gamificação;
- sistema escolar completo;
- analytics avançado;
- múltiplos níveis de permissão;
- marketplace;
- feed social;
- painel administrativo complexo.

---

# Stack Tecnológica

## Frontend
- Next.js
- React
- TypeScript
- TailwindCSS

---

## Backend
- API Routes do Next.js

---

## Banco de Dados
- Firebase Firestore

---

## IA
- Google Gemini API

---

## Acessibilidade
- VLibras Widget

---

# Fluxo Principal

## Fluxo resumido

Interprete
→ envia conteúdo
→ IA adapta material
→ intérprete revisa
→ aluno acessa versão final

---

# Fluxos detalhados

## 1. Upload do conteúdo

Entrada:
- texto;
- PDF.

O conteúdo é salvo no banco.

---

## 2. Processamento da IA

A IA recebe:
- conteúdo original;
- instruções de simplificação L2.

A IA retorna:
- adaptedText;
- interpreterSummary;
- glossary.

---

## 3. Revisão do intérprete

O intérprete:
- revisa o material;
- salva observações;
- ajusta textos.

---

## 4. Consumo do aluno

O aluno:
- lê versão simplificada;
- utiliza VLibras;
- consulta glossário.

---

# Estrutura de Dados

## Collection: users

```ts
{
  id: string
  name: string
  email: string
  role: "teacher" | "interpreter"
  createdAt: Timestamp
}
```

---

## Collection: materials

```ts
{
  id: string
  title: string

  originalText: string

  adaptedText: string

  interpreterSummary: string

  glossary: {
    term: string
    meaning: string
  }[]

  interpreterNotes: {
    excerpt: string
    note: string
    createdAt: Timestamp
  }[]

  feedbacks: {
    type: "understood" | "difficult" | "confusing"
    comment?: string
  }[]

  createdBy: string

  status: "processing" | "reviewing" | "published"

  createdAt: Timestamp
}
```

---

# Estrutura Visual

## Telas principais

### Login
Login simples com Google Auth.

---

### Dashboard
Lista de materiais enviados.

---

### Tela de adaptação
Exibe:
- texto original;
- texto adaptado;
- resumo do intérprete;
- glossário.

---

### Tela modo intérprete
Área editável para:
- observações;
- revisão;
- preparação pedagógica.

---

### Tela aluno
Visual limpo e acessível.

---

# Objetivo da IA

A IA NÃO deve apenas resumir textos.

Ela deve:
- simplificar estruturas linguísticas;
- reduzir ambiguidades;
- tornar o texto mais adequado para português L2;
- destacar conceitos importantes;
- ajudar na mediação pedagógica.

---

# Exemplo de Prompt da IA

## Entrada

Texto original enviado pelo intrepete.

---

## Instruções

A IA deve:
- simplificar frases;
- utilizar linguagem direta;
- evitar períodos longos;
- explicar termos difíceis;
- criar glossário;
- gerar resumo pedagógico para intérprete.

---

# Objetivo da Demo

Demonstrar:
- transformação do conteúdo;
- ganho de acessibilidade;
- redução de improviso do intérprete;
- apoio pedagógico real.

A demo deve focar em:
- clareza;
- impacto visual;
- fluxo simples.

---

# Prioridade de Desenvolvimento

## Prioridade máxima
1. Integração IA
2. Fluxo principal
3. Tela do intérprete

---

## Prioridade média
4. VLibras
5. Glossário

---

## Prioridade baixa
6. Auth avançado
7. PDF complexo
8. Polimento extremo

---

# Filosofia do Projeto

O SINA NÃO é:
- uma rede social;
- uma plataforma escolar completa;
- um chatbot genérico.

O SINA é:
- uma ferramenta de mediação pedagógica;
- focada em acessibilidade;
- construída para educação bilíngue de pessoas surdas.
