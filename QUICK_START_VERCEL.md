# ⚡ Guia Rápido — Finalizar Configuração (5 minutos)

## 🎯 O que você precisa fazer AGORA

A implementação de segurança foi feita. Falta apenas **configurar as variáveis no Vercel**.

---

## 📋 Passo a Passo

### 1️⃣ Abrir Vercel Dashboard

```
Abrir navegador → vercel.com/dashboard
```

### 2️⃣ Abrir seu projeto

```
Clique em "mapeamento-vocacao"
```

### 3️⃣ Ir para Settings

```
Projeto → Settings (botão no topo)
```

### 4️⃣ Ir para Environment Variables

```
No menu à esquerda → "Environment Variables"
```

### 5️⃣ Adicionar 3 variáveis

Clique em **"Add New"** para cada uma:

---

#### ➕ VARIÁVEL 1

```
Name:
SUPABASE_URL

Value:
https://megtdgonrqzyskevkjej.supabase.co

Clique: Add
```

---

#### ➕ VARIÁVEL 2

```
Name:
SUPABASE_ANON_KEY

Value:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lZ3RkZ29ucnF6eXNrZXZramVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MjgzNDMsImV4cCI6MjA5NDEwNDM0M30.SgiE_H8mfDzC9wPAy1zLGANz-QsdoUZuw3eBlnfTtjY

Clique: Add
```

---

#### ➕ VARIÁVEL 3

```
Name:
N8N_WEBHOOK

Value:
https://n8n.srv1271188.hstgr.cloud/webhook/013f00cf-44f2-45a7-b523-788ebe26c584

Clique: Add
```

---

### 6️⃣ Aguardar Deploy

```
Vercel vai fazer redeploy automático
Aguarde 2-3 minutos até ver "✅ Ready"
```

---

## ✅ Testar Funcionamento (2 minutos)

### Teste 1: Acessar site

```
Abrir: https://seu-dominio.vercel.app
```

### Teste 2: Preencher quiz

```
1. Nome: Digite seu nome
2. Telefone: (11) 99999-9999
3. Email: seu@email.com
4. Perguntas: Responda as 17 perguntas
5. Resultado: Clique "Enviar"
```

### Teste 3: Verificar segurança (F12)

```
1. Abrir F12 (Pressione F12)
2. Ir para "Network"
3. Atualizar página (Ctrl+R)
4. Preencher quiz novamente
5. Clique Enviar
6. Procurar "quiz-submit" no Network
7. Clicar nela
8. Verificar Response:
   - ✅ "success": true
   - ❌ Nenhuma credencial visível!
```

### Teste 4: Verificar Supabase

```
1. Abrir: https://supabase.com
2. Entrar na sua conta
3. Ir para "mapeamento-vocacao"
4. Clicar em "vocacao_respostas"
5. ✅ Deve ter um novo registro com seus dados
```

### Teste 5: Verificar N8n

```
1. Abrir: seu-n8n.com
2. Ir para "Webhook de produção"
3. Checar logs
4. ✅ Deve ter recebido os dados do quiz
```

---

## 🎯 Resultado Esperado

✅ Quiz está funcionando  
✅ Dados sendo salvos no Supabase  
✅ Webhook chegando no N8n  
✅ **Nenhuma credencial visível no F12**  

---

## ⚠️ Se não funcionar

### "Erro: Unauthorized"
→ Verifique se as variáveis foram adicionadas no Vercel  
→ Aguarde 2-3 minutos para redeploy  
→ Atualize (Ctrl+Shift+R)  

### "Erro: 500"
→ F12 → Console → veja a mensagem de erro  
→ Verifique se SUPABASE_URL está correto  
→ Confirme se SUPABASE_ANON_KEY tem espaços extras  

### "Dados não salvam"
→ Verifique se as 3 variáveis estão no Vercel  
→ Acesse Vercel → Deployments → veja se "Ready"  
→ Se não estiver pronto, aguarde mais

---

## 📊 Checklist Final

- [ ] Abri Vercel Dashboard
- [ ] Entrei no projeto "mapeamento-vocacao"
- [ ] Fui para Settings → Environment Variables
- [ ] Adicionei SUPABASE_URL
- [ ] Adicionei SUPABASE_ANON_KEY
- [ ] Adicionei N8N_WEBHOOK
- [ ] Aguardei 2-3 minutos
- [ ] Testei preenchendo quiz
- [ ] Verifiquei que dados salvaram no Supabase
- [ ] Confirmei que N8n recebeu webhook
- [ ] ✅ **PRONTO!**

---

## 🎉 Pronto!

Quando tudo acima estiver marcado, seu sistema de segurança está **100% pronto**.

- ✅ Credenciais invisíveis
- ✅ API funcionando
- ✅ Dados salvando
- ✅ Webhooks funcionando
- ✅ **SEGURO PARA PRODUÇÃO**

---

*Tempo total: ~10 minutos* ⏱️
