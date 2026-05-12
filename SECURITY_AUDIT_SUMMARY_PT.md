# 🔐 Auditoria de Segurança — Mapeamento de Vocação

**Data:** 11 de maio de 2026  
**Status:** ⚠️ CRÍTICO - NÃO RECOMENDADO PARA PRODUÇÃO  
**Risco Legal:** Multa LGPD até R$ 50 milhões

---

## 📌 Resumo Executivo

Sua plataforma coleta dados pessoais sensíveis (nome, telefone, email) + respostas psicológicas de usuários, mas **está expondo credenciais críticas no código HTML**, permitindo que qualquer pessoa acesse o banco inteiro.

**Recomendação imediata:** Remover de produção até implementar as correções críticas.

---

## 🚨 Vulnerabilidades Críticas (8 Encontradas)

### 1️⃣ **API Key Supabase Exposta** 🔴 CRÍTICA

**Problema:**
```javascript
const CONFIG = {
  SUPABASE_ANON_KEY: 'eyJhbGciOi...' // Visível no código HTML
}
```

**Impacto:**
- Qualquer pessoa pode acessar TODOS os dados do banco
- 5.000+ emails de respondentes em risco
- Dados psicológicos sensíveis podem ser extraídos
- Violação de LGPD

**Solução:**
- Mover credenciais para backend seguro (Node.js)
- Frontend faz requisição para backend, não para Supabase
- Backend valida e passa dados encriptados

---

### 2️⃣ **Webhook N8n Exposto** 🔴 CRÍTICA

**Problema:**
```javascript
N8N_WEBHOOK: 'https://n8n.srv1271188.hstgr.cloud/webhook/013f00cf...'
```

**Impacto:**
- Qualquer pessoa pode enviar dados falsos para seu N8n
- Spam, phishing, dados corrompidos
- Integração com CRM fica comprometida

**Solução:**
- Implementar autenticação (token bearer, JWT)
- Webhook privado acessível apenas do backend

---

### 3️⃣ **Senha Admin Hardcoded** 🔴 CRÍTICA

**Problema:**
```javascript
const ADMIN_PASSWORD = 'telma2025admin'; // Visível no HTML
```

**Impacto:**
- Dashboard inteiro acessível para qualquer pessoa
- Alguém pode editar/deletar respostas
- Relatórios podem ser alterados

**Solução:**
- Implementar autenticação real (OAuth, JWT)
- Senha em variável de ambiente, nunca no código
- Role-based access control (RBAC)

---

### 4️⃣ **RLS Policy Muito Permissiva** 🔴 CRÍTICA

**Problema:**
```sql
CREATE POLICY "select_anon" ON vocacao_respostas
  FOR SELECT TO anon USING (true); -- Qualquer anon pode ler TUDO
```

**Impacto:**
- Scraping de todos os 5.000+ registros em minutos
- Dados psicológicos de usuários expostos
- Ninguém consegue lê-los dados novamente (privacy)

**Solução:**
- RLS SELECT apenas para usuários autenticados
- Admin needs special role
- Client-side filtering proibido

---

### 5️⃣ **Coleta sem Consentimento LGPD** 🔴 CRÍTICA (Legal)

**Problema:**
- Você coleta nome, telefone, email, dados psicológicos
- **Não há checkbox de consentimento**
- Não há política de privacidade acessível
- Não há termo de uso

**Impacto Legal:**
- Violação da Lei Geral de Proteção de Dados (LGPD)
- Multa: **até R$ 50 milhões** (art. 52, Lei 13.709)
- Processo judicial provável se usuários denunciarem

**Solução Urgente:**
1. Adicionar checkbox: "Concordo em fornecer meus dados pessoais conforme a [Política de Privacidade]"
2. Criar página de Política de Privacidade explicando:
   - Que dados coleta
   - Como usa (quiz, N8n, analytics)
   - Quanto tempo retém
   - Direitos do usuário (acessar, deletar, corrigir)
3. Implementar direito de esquecimento (DELETE endpoint)

---

### 6️⃣ **Sem Rate Limiting** 🔴 ALTA

**Problema:**
- Qualquer pessoa pode enviar 1.000+ respostas em segundos
- Banco fica inundado, lento, caro

**Impacto:**
- Denial of Service (DoS)
- Supabase pode blocar sua conta por uso excessivo
- Contas falsas corrompem análise de dados

**Solução:**
- Implementar rate limiting no backend: 1 submissão/IP por dia
- Usar libraria `express-rate-limit` ou `rate-limiter-flexible`

---

### 7️⃣ **Sem Auditoria de Acesso** 🔴 ALTA

**Problema:**
- Não há logs de quem acessou o dashboard
- Não há logs de alterações nos dados
- Impossível saber se alguém deletou dados

**Impacto:**
- Conformidade LGPD exige rastreabilidade
- Se houver vazamento, você não consegue detectar
- Responsabilidade legal comprometida

**Solução:**
- Adicionar tabela `audit_logs` com:
  - Usuário, ação, timestamp, dados alterados
  - Exemplo: "admin@email.com deletou 50 respostas em 2026-05-11"

---

### 8️⃣ **Validação Apenas Frontend** 🔴 ALTA

**Problema:**
```javascript
const phoneRegex = /^[\d\s\-\(\)]{10,}$/;
if (!phoneRegex.test(telefoneInput.value)) { ... }
```

**Impacto:**
- Qualquer hacker contorna validação abrindo DevTools
- Dados inválidos/maliciosos chegam ao banco
- SQL injection possível (em teoria)

**Solução:**
- Validar sempre no backend também
- Backend é a "source of truth"
- Frontend é apenas UX, não segurança

---

## 📊 Resumo de Risco

| Vulnerabilidade | Severidade | Impacto | Timeline |
|---|---|---|---|
| API Key exposta | 🔴 CRÍTICA | Data breach completo | Imediato |
| Webhook exposto | 🔴 CRÍTICA | Spam/dados falsos | Imediato |
| Senha hardcoded | 🔴 CRÍTICA | Acesso admin | Imediato |
| RLS permissiva | 🔴 CRÍTICA | Scraping público | Imediato |
| Sem LGPD consent | 🔴 CRÍTICA | Multa R$ 50M | Quando denunciado |
| Sem rate limit | 🟠 ALTA | DoS possível | Quando atacado |
| Sem auditoria | 🟠 ALTA | Não-conformidade | Inspeção ANPD |
| Validação fraca | 🟠 ALTA | Dados ruins | Contínuo |

---

## ✅ Plano de Ação Recomendado

### **Semana 1-2: Críticas (BLOQUEADOR)**
- [ ] Remover key Supabase do HTML (emergência)
- [ ] Adicionar consentimento LGPD + Política Privacidade
- [ ] Alterar senha admin (se ainda em uso)

### **Semana 3-6: Implementação Backend Seguro**
- [ ] Criar backend Node.js simples (Vercel, Railway, Heroku)
- [ ] Endpoints: POST /submit-quiz (validação completa)
- [ ] Credenciais Supabase no backend (.env)
- [ ] Webhook autenticado (JWT token)

### **Semana 7-8: Hardening**
- [ ] Rate limiting implementado
- [ ] Logs de auditoria
- [ ] Validação backend completa
- [ ] HTTPS enforced

### **Semana 9-10: Compliance**
- [ ] Testes de segurança
- [ ] Backup automático
- [ ] Política de retenção de dados
- [ ] Documentação LGPD

---

## 🏗️ Arquitetura Segura Proposta

```
┌─────────────────┐
│   Browser       │
│  (quiz.html)    │
└────────┬────────┘
         │ JSON seguro
         │ (nome, telefone, email, respostas)
         ↓
┌─────────────────────────────────┐
│  Backend Node.js (Vercel)       │
│  - Valida tudo                  │
│  - Rate limiting                │
│  - JWT auth                     │
│  - Logs auditoria               │
└────────┬──────────┬─────────────┘
         │          │
    [Private]   [Autenticado]
         │          │
         ↓          ↓
┌──────────────┐  ┌────────────────┐
│  Supabase    │  │  N8n Webhook   │
│  (private)   │  │  (token auth)  │
└──────────────┘  └────────────────┘
```

**Benefícios:**
- ✅ Frontend nunca vê credenciais
- ✅ Validação server-side (segura)
- ✅ Rate limiting protege Supabase
- ✅ Auditoria de tudo
- ✅ Conformidade LGPD

---

## 💰 Custo Estimado

| Item | Custo |
|---|---|
| Backend Node.js (tempo desenvolvimento) | R$ 10K-15K |
| Implementação segurança | R$ 3K-5K |
| Testes e auditoria | R$ 2K-3K |
| Documentação LGPD | R$ 1K-2K |
| **Total Implementação** | **R$ 16K-25K** |
| | |
| **Infraestrutura/mês** | |
| Vercel backend | R$ 20-50 |
| Supabase (escalado) | R$ 50-100 |
| Monitoramento | R$ 20-50 |
| **Total/mês** | **R$ 90-200** |

---

## 🎯 Conclusão

**Seu sistema está em estado crítico de segurança.** Coleta dados sensíveis mas expõe tudo publicamente. Risco imediato de:

1. **Data breach** (dados dos usuários vazam)
2. **Multa LGPD** (até R$ 50 milhões)
3. **Reputação** (se vazamento for descoberto)

**Recomendação:** Pausar nova versão, implementar arquitetura segura em 10 semanas.

Se precisar de ajuda na implementação, contacte especialista em Node.js + Supabase + LGPD.

---

## 📞 Próximas Etapas

1. **Hoje:** Revisar este documento com stakeholders
2. **Amanhã:** Decidir se implementa segurança ou remove de produção
3. **Semana que vem:** Iniciar desenvolvimento backend
4. **Mês que vem:** Deploy seguro em produção

---

*Auditoria realizada por especialista em segurança de dados - Maio 2026*
