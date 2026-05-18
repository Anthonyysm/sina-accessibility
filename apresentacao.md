# Guia de Apresentação — SINA

> Sistema Inclusivo de Apoio ao Ensino Bilíngue para Pessoas Surdas

---

## Parte 1 — Como Orquestrar a Apresentação

### Mentalidade geral

Você não está vendendo um produto pronto — está mostrando que **entendeu um problema real**, que **construiu uma solução funcional** e que **sabe por onde escalar**. A banca quer ver três coisas:

1. **Clareza do problema** — Você sabe explicar por que isso importa?
2. **Qualidade da execução** — O MVP funciona? As telas fazem sentido?
3. **Visão de futuro** — Você sabe o que vem depois?

### Estrutura da fala (10-15 minutos)

#### Abertura — O gancho emocional (1-2 min)

Comece com um cenário concreto, não com tecnologia:

> "Imagina que você é professor de matemática e chega numa sala com 30 alunos, sendo 4 surdos. Você não sabe Libras. O intérprete está lá, mas ele também precisa acompanhar as aulas de história, ciências, geografia... Ele não teve acesso ao seu material antes da aula. O que acontece? O aluno surdo fica pra trás."

> "Isso não é hipotético. É a realidade de escolas bilíngues no Brasil inteiro. E o SINA existe para resolver isso."

#### O problema (2 min)

- Modelo bilíngue: Libras (L1) + Português (L2)
- Gramáticas completamente distintas
- Intérpretes sobrecarregados — adaptam conteúdo em tempo real
- Sem canal entre professor e intérprete antes da aula
- Resultado: exclusão disfarçada de inclusão

#### A solução (2 min)

Apresente o SINA como ponte entre três atores:

| Ator | O que ganha |
|---|---|
| **Professor** | Envia material uma vez, a IA adapta para português L2 |
| **Intérprete** | Acesso antecipado ao conteúdo, anotações privadas, menos sobrecarga |
| **Aluno surdo** | Feed com conteúdo adaptado, VLibras, ritmo próprio |

#### Demo das telas (5-7 min)

Aqui você compartilha tela e navega. Siga essa ordem:

**1. Landing Page** (30 seg)
> "Essa é a porta de entrada. Acessível, com VLibras desde a primeira tela."

**2. Login** (15 seg)
> "Autenticação via Firebase — Google ou email/senha."

**3. Dashboard do Professor** (1-2 min)
> "Aqui o professor vê suas turmas, alunos, publicações e agendamentos.
> O botão 'Nova Atividade' abre o fluxo de criação."

**4. Criação de Atividade com IA** (2 min) — **MOMENTO WOW**
> "O professor cola um texto ou envia um PDF. A IA processa e devolve:
> - Texto adaptado em português L2 simplificado
> - Glossário de termos técnicos com glosas em Libras
> - Observações pedagógicas para o intérprete
> Isso que levaria 40 minutos manualmente, a IA faz em segundos."

**5. Dashboard do Aluno** (1-2 min)
> "O aluno vê um feed limpo com as atividades adaptadas.
> Cada card mostra urgência, prazo, e tem botão para ver o PDF.
> O VLibras traduz todo o conteúdo para Libras automaticamente."

**6. Tradutor de Glosa** (1 min) — **MOMENTO WOW 2**
> "Essa é a ferramenta de consulta rápida. O intérprete ou aluno digita
> qualquer palavra e recebe a glosa em Libras, glossário e observações.
> Funciona como um dicionário vivo alimentado pela IA."

**7. Turmas e Agendamentos** (30 seg)
> "Gestão completa: criar turmas, adicionar alunos em massa, agendar
> entregas e vincular a atividades."

#### Fechamento (1-2 min)

> "O SINA não substitui o intérprete. Ele dá ao intérprete o que ele mais precisa: tempo e informação antecipada."

> "A stack é moderna e escalável — Next.js, IA generativa, banco relacional.
> O MVP está funcional. Os próximos passos são notificações em tempo real,
> upload de PDF e testes com usuários reais."

> "Obrigado."

---

## Parte 2 — Dicas de Postura

- **Não leia slides.** Fale olhando para a banca.
- **Pausas intencionais.** Depois de cada seção, pare 2 segundos. Deixa a informação assentar.
- **Demonstre, não explique demais.** A banca vê que o código é sólido pelas telas funcionando, não por você listar dependências.
- **Se perguntarem sobre algo que não existe:** "Ainda não implementamos, mas está no roadmap e sabemos como fazer."
- **Se perguntarem sobre acessibilidade além de Libras:** "O VLibras já cobre a tradução visual. O próximo passo é navegação por teclado e leitores de tela — a base com shadcn/ui já nos dá semântica ARIA."
- **Se perguntarem sobre IA alucinando:** "A IA trabalha com prompt estruturado e validação via Zod. O texto original é sempre preservado para conferência."

---

## Parte 3 — Roteiro de Slides (7 páginas)

---

### Slide 1 — Capa

```
SINA
Sistema Inclusivo de Apoio ao Ensino Bilíngue
para Pessoas Surdas

[Seu nome / equipe]
[Nome do evento/hackathon]
```

**Fala:** "O SINA é uma plataforma que conecta professor, intérprete e aluno surdo num mesmo ecossistema de aprendizagem acessível."

---

### Slide 2 — O Problema

```
O desafio da educação bilíngue para surdos

• Libras (L1) e Português (L2) têm gramáticas distintas
• Intérpretes adaptam conteúdo em tempo real — sobrecarga
• Sem comunicação prévia entre professor e intérprete
• Resultado: exclusão disfarçada de inclusão

"O aluno surdo está na sala, mas não está na aula."
```

**Fala:** "No modelo bilíngue, o aluno surdo precisa de mediação constante. Mas quem faz essa mediação está sobrecarregado e sem ferramentas."

---

### Slide 3 — A Solução

```
SINA: a ponte entre quem ensina e quem aprende

Professor → Envia material → IA adapta para Português L2
Intérprete → Acesso antecipado → Anotações privadas
Aluno → Feed adaptado → VLibras → Ritmo próprio

3 atores, 1 plataforma.
```

**Fala:** "O SINA resolve o gargalo na raiz: o professor envia o material uma vez, a IA adapta, e todos os atores acessam no seu ritmo."

---

### Slide 4 — Como Funciona (Fluxo)

```
Fluxo de uma atividade

1. Professor cria atividade (texto ou PDF)
2. IA processa e gera:
   ✓ Texto adaptado em Português L2 simplificado
   ✓ Glossário com glosas em Libras
   ✓ Observações pedagógicas
3. Intérprete acessa antes da aula e se prepara
4. Aluno vê no feed com suporte VLibras
```

**Fala:** "O fluxo é simples: o professor publica, a IA adapta, o intérprete se prepara, o aluno aprende. Sem atrito."

---

### Slide 5 — Tecnologias

```
Stack técnica

Frontend:  Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
UI:        shadcn/ui + Radix UI (acessibilidade nativa)
Backend:   Next.js API Routes + Prisma ORM + PostgreSQL
Auth:      Firebase Auth (Google + Email/Senha)
IA:        Vercel AI SDK + Google Gemini
Acess.:    VLibras Widget v2
```

**Fala:** "Usamos uma stack moderna e type-safe. O Next.js cuida do fullstack, o Prisma garante integridade de dados, e a IA do Google gera adaptações pedagógicas reais."

---

### Slide 6 — Diferenciais

```
Por que o SINA é diferente?

✓ Foco no intérprete — ninguém pensou nele como usuário primário
✓ IA pedagógica — não traduz, adapta para L2 com contexto
✓ VLibras integrado — Libras visual direto na plataforma
✓ Acesso antecipado — intérprete se prepara antes da aula
✓ MVP funcional — não é protótipo, é software rodando
```

**Fala:** "A maioria das ferramentas foca no aluno. Nós focamos no ecossistema inteiro. O intérprete é o elo mais fraco — e nós fortalecemos ele."

---

### Slide 7 — Próximos Passos e Call to Action

```
Roadmap

• Upload e processamento de PDFs
• Notificações em tempo real
• Testes com usuários reais (escolas bilíngues)
• Navegação por teclado e leitores de tela
• Analytics de engajamento

"O SINA não substitui o intérprete.
 Ele dá ao intérprete o que ele mais precisa: tempo."

[Contato / QR Code / GitHub]
```

**Fala:** "O MVP está funcional e validado tecnicamente. O próximo passo é validar com quem realmente importa: professores, intérpretes e alunos. Obrigado."

---

## Parte 4 — Checklist Pré-Apresentação

- [ ] Demo rodando localmente sem erros
- [ ] Pelo menos 1 atividade criada com texto adaptado visível
- [ ] VLibras carregando nas telas
- [ ] Tradutor de Glosa funcionando com resposta da IA
- [ ] Internet estável (a IA precisa de conexão)
- [ ] Slides salvos em PDF como backup
- [ ] Timer testado (não passar do tempo)
- [ ] Conta de demo pronta (não usar conta pessoal com dados reais)
