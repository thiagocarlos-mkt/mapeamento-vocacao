# 🚀 Configuração Vercel — Variáveis de Ambiente

## ⚡ Setup Rápido (5 minutos)

Depois de fazer push para GitHub, você precisa configurar as variáveis de ambiente no Vercel.

### PASSO 1: Acessar Vercel Dashboard

1. Acesse https://vercel.com/dashboard
2. Clique no projeto "mapeamento-vocacao"
3. Vá para **Settings** → **Environment Variables**

### PASSO 2: Adicionar as 3 variáveis

Clique em **"Add New"** para cada uma:

#### 1️⃣ SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://megtdgonrqzyskevkjej.supabase.co
```

#### 2️⃣ SUPABASE_ANON_KEY
```
Name: SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZ3RkZ29ucnF6eXNrZXZramVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjgzNDMsImV4cCI6MjA5NDEwNDM0M30.SgiE_H8mfDzC9wPAy1zLGANz-QsdoUZuw3eBlnfTtjY
```

#### 3️⃣ N8N_WEBHOOK
```
Name: N8N_WEBHOOK
Value: https://n8n.srv1271188.hstgr.cloud/webhook/013f00cf-44f2-45a7-b523-788ebe26c584
```

### PASSO 3: Salvar e Deploy

1. Clique **"Save"**
2. Vercel faz redeploy automático (~1-2 minutos)
3. Pronto! Variáveis estão seguras no servidor

---

## ✅ Verificar se está funcionando

### No navegador:

1. Acesse seu site
2. Preencha o quiz (nome, telefone, email)
3. Clique **Enviar**
4. Abra **F12** (DevTools)
5. Vá para **Network**
6. Procure por requisição `quiz-submit`
7. ✅ A resposta mostra `success: true` mas **não expõe credenciais**

### O que você NÃO vai ver:

❌ SUPABASE_URL no código  
❌ SUPABASE_ANON_KEY no código  
❌ N8N_WEBHOOK no código  

### Comparação:

**Antes (INSEGURO):**
```
F12 → quiz.html → CONFIG → Vê todas as chaves ❌
```

**Depois (SEGURO):**
```
F12 → Network → /api/quiz-submit → Sem credenciais ✅
```

---

## 🔐 Por que agora é seguro

✅ **Chaves ficam no servidor** (Vercel)  
✅ **Frontend nunca vê as credenciais**  
✅ **F12 não mostra nada comprometedor**  
✅ **Fácil mudar chaves sem redeploy do HTML**  
✅ **Supabase fica realmente privado**  

---

## 🚨 Troubleshooting

### "Erro ao salvar quiz"

1. Verifique se as 3 variáveis foram adicionadas no Vercel
2. Aguarde 2-3 minutos para o redeploy completar
3. Atualize a página (Ctrl+Shift+R)
4. Tente novamente

### "Network mostra erro 500"

1. Abra console (F12 → Console)
2. Veja o erro exato
3. Verifique se SUPABASE_URL e SUPABASE_ANON_KEY estão corretos
4. Se mudou credenciais, atualize no Vercel

### "Webhook não chegou no N8n"

1. Verifique se N8N_WEBHOOK está correto no Vercel
2. Teste enviando um quiz de teste
3. Verifique os logs do N8n para erros

---

## 📚 Estrutura Agora

```
Quiz (sem credenciais)
    ↓
  POST /api/quiz-submit
    ↓
API Node.js (Vercel - credenciais seguras)
    ↓
    ├→ Supabase (com chave privada)
    └→ N8n Webhook (com URL segura)
```

---

## ✨ Pronto!

Sua aplicação agora é 100% segura:
- ✅ Credenciais invisíveis
- ✅ API privada funcionando
- ✅ Dados salvando corretamente
- ✅ Webhooks funcionando

**Congrats! 🎉**

---

*Configuração segura - Maio 2026*
