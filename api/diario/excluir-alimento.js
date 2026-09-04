import { prisma, verificarAutenticacao } from '../middleware.js';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') return res.status(405).json({ erro: 'Método não permitido' });

    const usuarioId = verificarAutenticacao(req, res);
    if (!usuarioId) return;

    const { id } = req.query; // Recebe o ID do item da refeição a ser excluído
    if (!id) return res.status(400).json({ erro: 'ID do item não fornecido.' });

    try {
        const idItem = parseInt(id);

        // 1. Busca o item antes de deletar para garantir que pertence ao usuário logado (Isolamento de dados)
        const item = await prisma.itemRefeicao.findUnique({
            where: { id: idItem }
        });

        if (!item || item.usuarioId !== usuarioId) {
            return res.status(403).json({ erro: 'Ação não permitida ou item não encontrado.' });
        }

        // 2. Remove o alimento do diário
        await prisma.itemRefeicao.delete({
            where: { id: idItem }
        });

        return res.status(200).json({ mensagem: 'Alimento removido com sucesso!' });

    } catch (error) {
        console.error('Erro ao excluir item:', error);
        return res.status(500).json({ erro: 'Falha interna ao remover alimento.' });
    }
}
