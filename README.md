# 🎯 Mapeamento de Vocação - Telma Abrahão

Sistema de quiz com 17 perguntas para mapear o perfil vocacional dos usuários em 3 estágios: Busca, Virada e Chamado.

## 🚀 Funcionalidades

- **Quiz Público** (quiz.html) - 17 perguntas em 6 etapas
- **Painel Admin** (admin.html) - Dashboard com gráficos e análises
- **Banco de Dados** - Integração com Supabase
- **Exportação** - CSV e XLSX
- **Temas** - Dark Mode e Light Mode
- **Responsividade** - Mobile-first design

## 📋 Arquivos

- `quiz.html` - Página pública do quiz
- `admin.html` - Painel administrativo (senha protegido)
- `supabase-setup.sql` - Script de criação da tabela

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
SUPABASE_URL=seu_supabase_url
SUPABASE_ANON_KEY=sua_supabase_anon_key
ADMIN_PASSWORD=sua_senha_admin
```

### Supabase Setup

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o SQL do arquivo `supabase-setup.sql` no SQL Editor
3. Copie a URL e Anon Key para as variáveis de ambiente

## 🌐 Deploy Vercel

1. Faça push para GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Adicione as variáveis de ambiente
5. Deploy automático!

## 👤 Acesso Admin

- URL: `https://seu-dominio.vercel.app/admin.html`
- Senha: Confira seu `.env`

## 📊 Gráficos Disponíveis

- Dashboard com resumo de respostas
- Donut chart de distribuição de perfis
- Bar charts para cada uma das 17 perguntas
- Análise detalhada de investimento desejado

## 🔄 Atualizações

Após fazer alterações:

```bash
git add .
git commit -m "Descrição da alteração"
git push origin main
```

A Vercel fará deploy automático!

---

**Desenvolvido com ❤️ para Telma Abrahão**
