import { prisma } from '../middleware.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

    const { email, senha } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

        // Insere o ID do usuário dentro do payload do token de forma blindada
        const token = jwt.sign(
            { id: usuario.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' }
        );

        return res.status(200).json({ token: `Bearer ${token}` });
    } catch (error) {
        return res.status(500).json({ erro: 'Erro ao processar o login.' });
    }
}