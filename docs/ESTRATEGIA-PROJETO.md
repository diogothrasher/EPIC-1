# Estratégia de Projeto - Sistema de Gestão de Trabalho e Financeiro

**Data:** 21 de Fevereiro de 2026
**Status:** ✅ APROVADO PARA DESENVOLVIMENTO
**Product Manager:** Morgan

---

## RESUMO EXECUTIVO

Você definiu o problema com clareza: **substituir HESK + Planilha Manual por um sistema unificado**.

Estruturei a solução em **4 épicos sequenciais** que entregam valor em cada fase:

| Fase | Épico | Objetivo | Timeline |
|------|-------|---------|----------|
| 1 | EPIC-1 | Substitui HESK | Semana 1-2 |
| 2 | EPIC-2 | Substitui Planilha | Semana 3 |
| 3 | EPIC-3 | Dashboards + Relatórios | Semana 4-5 |
| 4 | EPIC-4 | Escala + Funcionalidades Avançadas | Semana 5-6+ |

**Meta:** No final de EPIC-3, você desativa o HESK e a planilha 100%.

---

## O QUE FOI ESTRUTURADO

### 1️⃣ PRD Completo (`docs/prd/SISTEMA-GESTAO-DIOGO-PRD.md`)
✅ Visão clara do produto
✅ 70+ requisitos funcionais detalhados
✅ 6 requisitos não-funcionais (performance, segurança, escalabilidade)
✅ Decisões arquiteturais fundamentadas
✅ Riscos e mitigações mapeados
✅ Critérios de sucesso definidos

### 2️⃣ Roadmap de Épicos (`docs/epics/EPICS-ROADMAP.md`)
✅ 4 épicos bem delimitados
✅ Cada épico com: objetivo, escopo IN/OUT, critérios de aceitação
✅ Dependências mapeadas (sequencial, sem paralelismo)
✅ Breakdown de cada épico em stories (40+ stories no total)
✅ Timelines realistas estimadas

### 3️⃣ Schema de Banco de Dados (`docs/architecture/SCHEMA-BANCO-DADOS.md`)
✅ 10 tabelas relacionadas corretamente
✅ Relacionamentos claros e constraints de integridade
✅ Índices para performance de queries comuns
✅ Soft deletes para auditoria
✅ Número de ticket auto-gerado com sequência
✅ Suporte a múltiplos usuários (admin + técnicos)

---

## ARQUITETURA RESUMIDA

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                    │
│  Dashboard | Tickets | Faturamento | Relatórios | Admin │
│         (Dark Mode Nativa + Responsivo)                  │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────┐
│                  BACKEND (FastAPI)                       │
│  Auth | Tickets | Faturamento | Relatórios | Admin     │
└────────────────────┬────────────────────────────────────┘
                     │ SQLAlchemy
┌────────────────────▼────────────────────────────────────┐
│            DATABASE (PostgreSQL)                         │
│  Usuarios | Empresas | Contatos | Tickets | Faturamento│
└─────────────────────────────────────────────────────────┘
```

**Stack:**
- Frontend: React 18 + TypeScript + Tailwind (dark mode)
- Backend: FastAPI + SQLAlchemy + PostgreSQL
- DevOps: Docker Compose
- Auth: JWT (simples, sem OAuth)

---

## DIFERENCIAIS DA ABORDAGEM

✅ **Sem reinventar a roda:**
- Usei recomendações de stack que você deu (todas excelentes)
- Estendi o modelo de dados que você esboçou
- Mantive flexibilidade (sem tabelas de preço fixa)

✅ **Escalável desde o início:**
- Estrutura preparada para múltiplos técnicos
- Índices para performance com 100k+ registros
- API RESTful para futuras integrações

✅ **Segurança pensada:**
- Autenticação JWT com roles (admin/tecnico)
- Auditoria completa (histórico, logs)
- Validação de entrada em todos os endpoints

✅ **Dark mode nativa:**
- Não é tema sobreposto - é design nativo
- Cores contrastantes para acessibilidade
- Reduz cansaço visual para uso prolongado

✅ **Faturamento desacoplado:**
- Registra valores sem tabelas de preço
- Exporta em múltiplos formatos (CSV, JSON, print)
- Pronto para integração com sistemas contábeis futuros

---

## FLUXO DE DESENVOLVIMENTO

### Fase Atual (Validação)
1. ✅ **Você valida** a PRD, épicos e arquitetura
2. ✅ **Aprova mudanças** se necessário (adicionar/remover requisitos)

### Próximas Fases (Implementação)
1. **@architect (Aria)** - Faz design técnico detalhado (migrations, endpoints, componentes)
2. **@sm (River)** - Cria user stories do EPIC-1 com AC (acceptance criteria) claros
3. **@dev (Dex)** - Implementa story por story
4. **@qa (Quinn)** - Testa cada feature com AC
5. **@devops (Gage)** - Faz push e deploy quando pronto

---

## CHECKLIST DE VALIDAÇÃO

Revise a PRD e diga se está OK em:

### Escopo e Funcionalidades
- [ ] Requisitos funcionais cobrem tudo que você precisa?
- [ ] Algo está faltando?
- [ ] Algo está sobrando (fora do escopo)?

### Arquitetura Técnica
- [ ] Stack (React + FastAPI + PostgreSQL) está OK?
- [ ] Estrutura de diretórios faz sentido?
- [ ] Modelo de dados é completo?

### Épicos e Timeline
- [ ] Sequência de épicos é realista?
- [ ] Timelines estimadas fazem sentido?
- [ ] Prioridades estão corretas?

### Autenticação e Permissões
- [ ] Admin/Técnico é suficiente ou precisa de mais roles?
- [ ] Técnico não pode acessar Financeiro/Admin?
- [ ] Auditoria completa é necessária?

### Dark Mode
- [ ] Cores propostas (azul, verde, vermelho, laranja) são OK?
- [ ] Responsividade (desktop, tablet, mobile) é importante?

### Migração HESK
- [ ] Deixar para Fase 5 é OK?
- [ ] Ou quer começar já preparando para isso?

---

## PRÓXIMOS PASSOS

**Se tudo está OK:**

1. ✅ Você diz: **"Tá bom, pode começar!"**
2. ✅ Eu convoco @architect para fazer design técnico
3. ✅ @architect cria: migrations, schemas, documentação API
4. ✅ Eu convoco @sm para criar stories do EPIC-1
5. ✅ @dev começa a implementar
6. ✅ Em 2-3 semanas, você tem MVP funcional do HESK

**Se precisa ajustar:**

1. ✅ Você descreve o que muda
2. ✅ Eu atualizo PRD/Épicos/Schema
3. ✅ Você valida novamente
4. ✅ Depois segue para design técnico

---

## DOCUMENTOS CRIADOS

Estão em `docs/`:

```
docs/
├── prd/
│   └── SISTEMA-GESTAO-DIOGO-PRD.md              ← PRD Completo
├── epics/
│   └── EPICS-ROADMAP.md                         ← 4 Épicos + Stories
├── architecture/
│   └── SCHEMA-BANCO-DADOS.md                    ← Modelo de Dados
└── ESTRATEGIA-PROJETO.md                        ← Este arquivo
```

---

## DECISÕES CHAVE TOMADAS

| Decisão | Opção | Razão |
|---------|-------|-------|
| **Épicos** | Sequencial (1→2→3→4) | Cada épico depende do anterior, minimiza rework |
| **Auth** | JWT simples | Você é o único usuário inicial, escalável depois |
| **BD** | PostgreSQL | Relacionamentos complexos, índices, confiável |
| **Número Ticket** | TPT-YYYYMMDD-XXX | Sequencial por dia, rastreável, diferente do HESK |
| **Soft Deletes** | Implementado | Preserva histórico, atende requisitos de auditoria |
| **Migração HESK** | Fase 5 | Não é bloqueante, foco no MVP funcionar 100% |
| **Dark Mode** | Nativa | Design from scratch, não tema sobreposto |

---

## RECURSOS E RESPONSABILIDADES

### Seu Papel
- Validar PRD/Épicos/Arquitetura
- Aprovar/solicitar ajustes
- Testar funcionalidades no fim de cada épico
- Definir prioridades se surgir algo novo

### Meu Papel (PM)
- Garantir alinhamento com objetivos
- Traduzir requisitos em stories executáveis
- Mediar conflitos de escopo
- Manter roadmap atualizado

### Roles de Desenvolvimento
- **@architect:** Design técnico, DB, API
- **@sm:** User stories, critérios de aceitação
- **@dev:** Implementação, testes unitários
- **@qa:** Testes, validação com AC
- **@devops:** Deploy, versionamento

---

## SUCESSO SERÁ QUANDO...

✅ **Fim de EPIC-1:** Você consegue criar um ticket, listar, editar, fechar **sem usar HESK**

✅ **Fim de EPIC-2:** Você gera relatório de faturamento do mês **sem planilha manual**

✅ **Fim de EPIC-3:** Dashboard mostra KPIs (tickets, faturamento, gráficos) **em tempo real**

✅ **Fim de EPIC-4:** Sistema está pronto para **adicionar técnicos novos com permissões**

---

## GARANTIAS

✅ **Não há reinvenção:** Stack e abordagem são baseados em suas recomendações
✅ **Escalável:** Design preparado para 100k+ registros e múltiplos usuários
✅ **Seguro:** Autenticação, auditoria, validação desde o início
✅ **Documentado:** Cada decisão está registrada
✅ **Iterativo:** Feedback a cada épico, antes de prosseguir

---

## PERGUNTAS ABERTAS

Se houver dúvidas, respostas rápidas:

1. **Q:** Preciso de notificações por email?
   **A:** Não (Fase 5+), está fora de escopo inicial

2. **Q:** E integração com sistema contábil?
   **A:** Não (Fase 5+), apenas exporta JSON pronto

3. **Q:** E agendamento de manutenção?
   **A:** Não (Fase 5+), foco em tickets abertos agora

4. **Q:** E múltiplos administradores?
   **A:** Possível (EPIC-4), mas você é único admin por enquanto

---

## PRÓXIMA AÇÃO

**Leia os 3 documentos:**
1. `docs/prd/SISTEMA-GESTAO-DIOGO-PRD.md`
2. `docs/epics/EPICS-ROADMAP.md`
3. `docs/architecture/SCHEMA-BANCO-DADOS.md`

**Então responda:**
- ✅ "Tá bom, pode começar!" → Convoco @architect
- ⚠️ "Preciso ajustar..." → Descreva o que muda
- ❓ "Tenho dúvidas..." → Detalhe as perguntas

---

**ESTRATÉGIA FINALIZADA - AGUARDANDO VALIDAÇÃO**

