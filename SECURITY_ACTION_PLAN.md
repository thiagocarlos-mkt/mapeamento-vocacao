# 🛡️ Plano de Ação Segurança — Implementação Prática

## 📋 Resumo Rápido

**Problema:** API Key do Supabase está no HTML público  
**Solução:** Criar backend Node.js que recebe dados do frontend  
**Tempo:** 2-3 semanas  
**Complexidade:** Média  

---

## 🚨 Ação Imediata (Hoje/Amanhã)

### PASSO 1: Comunicar aos usuários

Se o site está em produção com dados reais:

```
Atenção: Estamos fazendo manutenção de segurança.
Site temporariamente desativado até [DATA].

Seus dados estão seguros. Voltamos em breve.
```

### PASSO 2: Remover key do HTML (Band-Aid)

Temporariamente, comentar a key no quiz.html:

```javascript
const CONFIG = {
  SUPABASE_URL: '...',
  // SUPABASE_ANON_KEY: '...', // DESATIVADO TEMPORARIAMENTE
  // N8N_WEBHOOK: '...', // DESATIVADO TEMPORARIAMENTE
};
```

### PASSO 3: Alertar usuários sobre LGPD

Adicionar na página do quiz:

```html
<div class="privacy-notice">
  <h3>⚠️ Política de Privacidade</h3>
  <p>Seus dados pessoais são coletados conforme a Lei Geral de Proteção de Dados (LGPD).</p>
  <label>
    <input type="checkbox" required>
    Concordo com a <a href="/privacidade.html">Política de Privacidade</a>
  </label>
</div>
```

---

## 📦 PASSO 4: Criar Backend Seguro (Semanas 1-2)

### Opção A: Node.js + Express (Recomendado)

**Instalação:**
```bash
npm init -y
npm install express cors dotenv @supabase/supabase-js axios
```

**Arquivo: `backend/app.js`**

```javascript
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// ✅ CORS restrito apenas ao frontend
const allowedOrigins = [
  'https://seu-dominio.vercel.app',
  'http://localhost:3000' // Apenas desenvolvimento
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  }
}));

app.use(express.json());

// ✅ Rate limiting: 1 submissão por IP por dia
const submitLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas
  max: 1, // 1 request por IP
  message: 'Você já preencheu o quiz. Tente novamente amanhã.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Supabase com chave privada (não exposta)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Chave PRIVADA do backend
);

// ✅ Validação rigorosa
function validateQuizData(data) {
  const errors = [];

  if (!data.nome || data.nome.trim().length < 2) {
    errors.push('Nome inválido (mínimo 2 caracteres)');
  }

  if (!/^[\d\s\-\(\)]{10,}$/.test(data.telefone.replace(/\D/g, ''))) {
    errors.push('Telefone inválido');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email inválido');
  }

  if (!['busca', 'virada', 'chamado'].includes(data.perfil_dominante)) {
    errors.push('Perfil inválido');
  }

  if (typeof data.score_busca !== 'number' || data.score_busca < 0) {
    errors.push('Score busca inválido');
  }

  // Validar que todas as 17 respostas estão presentes
  for (let i = 1; i <= 17; i++) {
    if (!data[`q${i}_resposta`]) {
      errors.push(`Resposta Q${i} faltando`);
    }
  }

  return errors;
}

// ✅ Endpoint principal
app.post('/api/quiz-submit', submitLimiter, async (req, res) => {
  try {
    const data = req.body;

    // Validar dados
    const errors = validateQuizData(data);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // ✅ Salvar no Supabase (com chave privada)
    const { data: inserted, error: dbError } = await supabase
      .from('vocacao_respostas')
      .insert([{
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        perfil_dominante: data.perfil_dominante,
        score_busca: data.score_busca,
        score_virada: data.score_virada,
        score_chamado: data.score_chamado,
        q1_fase_vida: data.q1_resposta,
        q2_situacao_profissional: data.q2_resposta,
        // ... outras 15 questões
      }]);

    if (dbError) {
      console.error('DB Error:', dbError);
      return res.status(500).json({ success: false, message: 'Erro ao salvar' });
    }

    // ✅ Enviar webhook N8n (com autenticação)
    if (process.env.N8N_WEBHOOK && process.env.N8N_TOKEN) {
      await axios.post(process.env.N8N_WEBHOOK, {
        timestamp: new Date().toISOString(),
        ...data
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.N8N_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }).catch(err => {
        console.error('Webhook error:', err.message);
        // Não falha a requisição se webhook falhar
      });
    }

    // ✅ Log de auditoria
    await supabase.from('audit_logs').insert([{
      action: 'QUIZ_SUBMITTED',
      email: data.email,
      ip_address: req.ip,
      timestamp: new Date().toISOString()
    }]);

    return res.status(201).json({
      success: true,
      message: 'Quiz salvo com sucesso',
      responseId: inserted?.[0]?.id
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando em porta ${PORT}`);
});
```

**Arquivo: `.env`**

```
SUPABASE_URL=https://megtdgonrqzyskevkjej.supabase.co
SUPABASE_SERVICE_KEY=sua_chave_service_privada_aqui
N8N_WEBHOOK=https://n8n.srv1271188.hstgr.cloud/webhook/...
N8N_TOKEN=seu_token_secreto_aqui
NODE_ENV=production
```

**Deploy no Vercel:**

```bash
# Criar arquivo vercel.json
{
  "buildCommand": "npm install",
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_SERVICE_KEY": "@supabase_service_key",
    "N8N_WEBHOOK": "@n8n_webhook",
    "N8N_TOKEN": "@n8n_token"
  }
}
```

---

## 🔄 PASSO 5: Atualizar Frontend (Semana 2)

**Novo quiz.html:**

```javascript
// Remover CONFIG antigo
// const CONFIG = { SUPABASE_ANON_KEY: '...' };

async function submitQuiz(perfil) {
  const payload = {
    nome, telefone, email,
    perfil_dominante: perfil,
    score_busca, score_virada, score_chamado,
    q1_resposta: allAnswersText['q1'],
    // ... q17_resposta
  };

  try {
    // Chamar backend seguro (não Supabase direto)
    const response = await fetch('https://seu-backend.vercel.app/api/quiz-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.success) {
      showSuccessMessage('Quiz salvo com sucesso!');
    } else {
      showErrorMessage('Erro ao salvar: ' + result.errors.join(', '));
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

## 🛡️ PASSO 6: Segurança Supabase (Semana 3)

### Atualizar RLS Policies:

```sql
-- Deletar policy antiga permissiva
DROP POLICY IF EXISTS "select_anon" ON vocacao_respostas;

-- Apenas backend (com SERVICE_KEY) pode ler
CREATE POLICY "select_backend_only" ON vocacao_respostas
  FOR SELECT TO authenticated USING (
    auth.uid() = (SELECT id FROM auth.users LIMIT 1)
  );

-- Apenas backend pode inserir
CREATE POLICY "insert_backend_only" ON vocacao_respostas
  FOR INSERT WITH CHECK (true);
  -- Mas VERIFICADO no backend, não confiar no cliente

-- Criar tabela audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  action text,
  email text,
  ip_address text,
  details jsonb
);
```

---

## 📋 Checklist Final

- [ ] Backend Node.js rodando localmente
- [ ] Variáveis de ambiente configuradas
- [ ] Validação backend funcionando
- [ ] Rate limiting testado
- [ ] N8n webhook autenticado
- [ ] Logs de auditoria funcionando
- [ ] Frontend enviando para backend (não Supabase)
- [ ] CORS restrito apenas a domínios autorizados
- [ ] HTTPS enforced
- [ ] Testes de segurança passando
- [ ] Documentação LGPD atualizada
- [ ] Consentimento de coleta de dados implementado
- [ ] Backup automático Supabase configurado
- [ ] Monitoramento de erros (Sentry)

---

## ⏱️ Timeline Realista

| Semana | Tarefa | Horas |
|--------|--------|-------|
| 1 | Setup backend, validação, deploy | 16h |
| 2 | Integração frontend, testes | 12h |
| 3 | Segurança Supabase, auditoria | 8h |
| 4 | LGPD compliance, documentação | 8h |
| 5 | Testes de segurança, deploy prod | 12h |
| **Total** | | **56h** |

**Custo aproximado:** R$ 12K-18K (60h @ R$ 200-300/h)

---

## 🎯 Resultado Final

✅ Dados dos usuários protegidos  
✅ Credenciais nunca expostas  
✅ Conformidade LGPD  
✅ Auditoria completa  
✅ Rate limiting contra DoS  
✅ Pronto para escala  

---

## ❓ Dúvidas?

Se tiver dúvidas durante implementação:
1. Revisar este documento
2. Consultar documentação oficial (Supabase, Express)
3. Contactar especialista em Node.js/Supabase

---

*Plano de ação - Maio 2026*
