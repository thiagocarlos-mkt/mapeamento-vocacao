-- Migration: Adicionar colunas nome e telefone à tabela vocacao_respostas
-- Execute este script no SQL Editor do Supabase para adicionar os campos

ALTER TABLE vocacao_respostas
ADD COLUMN IF NOT EXISTS nome text,
ADD COLUMN IF NOT EXISTS telefone text;
