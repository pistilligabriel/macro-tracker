import { prisma } from '../middleware.js'; 
import bcrypt from 'bcryptjs';


export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

    const { email, senha, altura, pesoAtual, metaCalorias, metaCarboidratos, metaProteinas, metaGorduras, metaLipidios } = req.body;

    try {
        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
        if (usuarioExistente) return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });

        // Aplica o BCrypt com fator de custo 10 (proteção robusta)
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await prisma.usuario.create({
            data: {
                email,
                senha: senhaCriptografada,
                altura: parseFloat(altura),
                pesoAtual: parseFloat(pesoAtual),
                metaCalorias: parseInt(metaCalorias),
                metaCarboidratos: parseInt(metaCarboidratos),
                metaProteinas: parseInt(metaProteinas),
                metaGorduras: parseInt(metaGorduras),
                metaLipidios: parseFloat(metaLipidios)
            }
        });

        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro interno ao salvar usuário.' });
    }
}