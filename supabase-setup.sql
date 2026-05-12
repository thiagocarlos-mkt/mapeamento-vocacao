-- Supabase Setup para Mapeamento de Vocação
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS vocacao_respostas (
  id                         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at                 timestamptz DEFAULT now(),
  nome                       text,
  telefone                   text,
  email                      text NOT NULL,
  perfil_dominante           text CHECK (perfil_dominante IN ('busca', 'virada', 'chamado')),
  score_busca                integer DEFAULT 0,
  score_virada               integer DEFAULT 0,
  score_chamado              integer DEFAULT 0,
  q1_fase_vida               text,
  q2_situacao_profissional   text,
  q3_faixa_etaria            text,
  q4_renda                   text,
  q5_historico               text,
  q6_ja_tentou               text,
  q7_o_que_faltou            text,
  q8_frase_ressoa            text,
  q9_area_desafio            text,
  q10_mudanca_desejada       text,
  q11_como_quer_se_sentir    text,
  q12_reacao_emocional       text,
  q13_interesse_profissional text,
  q14_o_que_aproximaria      text,
  q15_momento_investimento   text,
  q16_valor_formacao         text,
  q17_expectativa            text
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_vocacao_email   ON vocacao_respostas(email);
CREATE INDEX IF NOT EXISTS idx_vocacao_perfil  ON vocacao_respostas(perfil_dominante);
CREATE INDEX IF NOT EXISTS idx_vocacao_created ON vocacao_respostas(created_at DESC);

-- Habilitar Row Level Security
ALTER TABLE vocacao_respostas ENABLE ROW LEVEL SECURITY;

-- Policy para inserção pública (quiz)
CREATE POLICY "insert_public" ON vocacao_respostas
  FOR INSERT TO anon WITH CHECK (true);

-- Policy para leitura (admin)
CREATE POLICY "select_anon" ON vocacao_respostas
  FOR SELECT TO anon USING (true);
