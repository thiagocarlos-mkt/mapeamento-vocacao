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
    const {
      nome,
      telefone,
      email,
      perfil_dominante,
      score_busca,
      score_virada,
      score_chamado,
      q1_fase_vida,
      q2_situacao_profissional,
      q3_faixa_etaria,
      q4_renda,
      q5_historico,
      q6_ja_tentou,
      q7_o_que_faltou,
      q8_frase_ressoa,
      q9_area_desafio,
      q10_mudanca_desejada,
      q11_como_quer_se_sentir,
      q12_reacao_emocional,
      q13_interesse_profissional,
      q14_o_que_aproximaria,
      q15_momento_investimento,
      q16_valor_formacao,
      q17_expectativa
    } = req.body;

    // Validação básica
    if (!email || !nome || !telefone) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Salvar no Supabase com credenciais seguras do servidor
    const { data, error } = await supabase
      .from('vocacao_respostas')
      .insert([{
        nome,
        telefone,
        email,
        perfil_dominante,
        score_busca,
        score_virada,
        score_chamado,
        q1_fase_vida,
        q2_situacao_profissional,
        q3_faixa_etaria,
        q4_renda,
        q5_historico,
        q6_ja_tentou,
        q7_o_que_faltou,
        q8_frase_ressoa,
        q9_area_desafio,
        q10_mudanca_desejada,
        q11_como_quer_se_sentir,
        q12_reacao_emocional,
        q13_interesse_profissional,
        q14_o_que_aproximaria,
        q15_momento_investimento,
        q16_valor_formacao,
        q17_expectativa
      }]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Erro ao salvar no banco' });
    }

    // Enviar webhook N8n
    if (process.env.N8N_WEBHOOK) {
      try {
        await fetch(process.env.N8N_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            nome,
            telefone,
            email,
            perfil_dominante,
            score_busca,
            score_virada,
            score_chamado,
            q1_fase_vida,
            q2_situacao_profissional,
            q3_faixa_etaria,
            q4_renda,
            q5_historico,
            q6_ja_tentou,
            q7_o_que_faltou,
            q8_frase_ressoa,
            q9_area_desafio,
            q10_mudanca_desejada,
            q11_como_quer_se_sentir,
            q12_reacao_emocional,
            q13_interesse_profissional,
            q14_o_que_aproximaria,
            q15_momento_investimento,
            q16_valor_formacao,
            q17_expectativa
          })
        }).catch(err => {
          console.error('N8n webhook error:', err.message);
        });
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
        // Não falha a requisição se webhook falhar
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Quiz salvo com sucesso!',
      responseId: data?.[0]?.id
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
