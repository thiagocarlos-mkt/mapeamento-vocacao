import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID obrigatório' });
    }

    // Buscar dados do Supabase
    const { data, error } = await supabase
      .from('vocacao_respostas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Resposta não encontrada' });
    }

    // Enviar webhook N8n
    if (process.env.N8N_WEBHOOK) {
      try {
        // Timestamp em formato Brasil (UTC-3)
        const now = new Date();
        // Converte para UTC-3 adicionando 3 horas (Vercel está em UTC)
        const brasilDate = new Date(now.getTime() + (3 * 60 * 60 * 1000));
        const timestamp = brasilDate.toISOString().split('Z')[0] + '-03:00';

        const webhookPayload = {
          id: data.id,
          timestamp,
          nome: data.nome,
          telefone: data.telefone,
          email: data.email,
          perfil_dominante: data.perfil_dominante,
          score_busca: data.score_busca,
          score_virada: data.score_virada,
          score_chamado: data.score_chamado,
          q1_fase_vida: data.q1_fase_vida,
          q2_situacao_profissional: data.q2_situacao_profissional,
          q3_faixa_etaria: data.q3_faixa_etaria,
          q4_renda: data.q4_renda,
          q5_historico: data.q5_historico,
          q6_ja_tentou: data.q6_ja_tentou,
          q7_o_que_faltou: data.q7_o_que_faltou,
          q8_frase_ressoa: data.q8_frase_ressoa,
          q9_area_desafio: data.q9_area_desafio,
          q10_mudanca_desejada: data.q10_mudanca_desejada,
          q11_como_quer_se_sentir: data.q11_como_quer_se_sentir,
          q12_reacao_emocional: data.q12_reacao_emocional,
          q13_interesse_profissional: data.q13_interesse_profissional,
          q14_o_que_aproximaria: data.q14_o_que_aproximaria,
          q15_momento_investimento: data.q15_momento_investimento,
          q16_valor_formacao: data.q16_valor_formacao,
          q17_expectativa: data.q17_expectativa
        };

        const response = await fetch(process.env.N8N_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });

        if (!response.ok) {
          throw new Error(`N8n responded with status ${response.status}`);
        }

        return res.status(200).json({
          success: true,
          message: 'Webhook reenviado com sucesso!'
        });

      } catch (webhookError) {
        console.error('Webhook resend error:', webhookError);
        return res.status(500).json({
          success: false,
          error: 'Erro ao enviar webhook: ' + webhookError.message
        });
      }
    } else {
      return res.status(500).json({
        error: 'Webhook N8n não configurado'
      });
    }

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
