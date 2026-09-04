import { verificarAutenticacao } from '../middleware.js';
import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });

    const usuarioId = verificarAutenticacao(req, res);
    if (!usuarioId) return;

    const { termo } = req.query;
    if (!termo) return res.status(400).json({ erro: 'Termo de busca vazio.' });

    try {
        const caminhoJson = join(process.cwd(), 'api', 'diario', 'taco.json');
        const arquivoBruto = readFileSync(caminhoJson, 'utf-8');
        const tabelaTaco = JSON.parse(arquivoBruto);

        // 💡 CORRIGIDO: Agora varre procurando por 'description' que é o padrão oficial da TACO
        const resultados = tabelaTaco.filter(alimento => 
            alimento && 
            typeof alimento.description === 'string' && 
            alimento.description.toLowerCase().includes(termo.toLowerCase())
        );

        return res.status(200).json(resultados.slice(0, 15));

    } catch (error) {
        console.error('Erro ao ler tabela local:', error);
        return res.status(500).json({ erro: 'Falha ao processar banco de dados interno.' });
    }
}
