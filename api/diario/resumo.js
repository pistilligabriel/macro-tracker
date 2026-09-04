import { prisma, verificarAutenticacao } from '../middleware.js'; 


export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });

    const usuarioId = verificarAutenticacao(req, res);
    if (!usuarioId) return;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { id: usuarioId } });

        const hoje = new Date();
        hoje.setHours(0,0,0,0); // Zera as horas para comparar apenas a data pura no banco

        const itensDeHoje = await prisma.itemRefeicao.findMany({
            where: {
                usuarioId: usuarioId,
                data: hoje
            }
        });

        // Somatórias usando JavaScript puro na nuvem
        const consumidoCalorias = itensDeHoje.reduce((sum, item) => sum + item.calorias, 0);
        const consumidoCarbo = itensDeHoje.reduce((sum, item) => sum + item.carboidratos, 0);
        const consumidoProt = itensDeHoje.reduce((sum, item) => sum + item.proteinas, 0);
        const consumidoGord = itensDeHoje.reduce((sum, item) => sum + item.gorduras, 0);
        const consumidoLip = itensDeHoje.reduce((sum, item) => sum + item.lipidios, 0);

        // Calcula a folga da meta diária
        const caloriasRestantes = Math.max(0, usuario.metaCalorias - consumidoCalorias);

        return res.status(200).json({
            metaCalorias: usuario.metaCalorias,
            metaCarboidratos: usuario.metaCarboidratos,
            metaProteinas: usuario.metaProteinas,
            metaGorduras: usuario.metaGorduras,
            consumidoCalorias,
            consumidoCarboidratos: consumidoCarbo,
            consumidoProteinas: consumidoProt,
            consumidoGorduras: consumidoGord,
            consumidoLipidios: consumidoLip,
            caloriasRestantes,
            itens: itensDeHoje
        });

    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao calcular resumo diário.' });
    }
}