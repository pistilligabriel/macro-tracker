import { prisma, verificarAutenticacao } from '../middleware.js'; 

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

    const usuarioId = verificarAutenticacao(req, res);
    if (!usuarioId) return; // Erros 401/403 já foram disparados pelo middleware

    const { tipoRefeicao, nomeAlimento, quantidadeGramas, calorias, carboidratos, proteinas, gorduras, lipidios } = req.body;

    try {
        await prisma.itemRefeicao.create({
            data: {
                usuarioId,
                tipoRefeicao,
                nomeAlimento,
                quantidadeGramas: parseFloat(quantidadeGramas),
                calorias: parseInt(calorias),
                carboidratos: parseFloat(carboidratos),
                proteinas: parseFloat(proteinas),
                gorduras: parseFloat(gorduras),
                lipidios: parseFloat(lipidios),
                data: new Date() // Grava com a data atual
            }
        });
        return res.status(201).json({ mensagem: 'Alimento adicionado com sucesso!' });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao registrar alimento no diário.' });
    }
}