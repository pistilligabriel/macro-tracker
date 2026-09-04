import jwt from 'jsonwebtoken';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. Configura o pool de conexões único para o Postgres
const pool = new pg.Pool({ connectionString: process.env.PRISMA_DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Cria a única instância global do Prisma que será exportada
export const prisma = new PrismaClient({ adapter });

export function verificarAutenticacao(req, res) {
    const authHeader = req.headers['authorization'];
    
    // Extrai o token removendo o prefixo "Bearer "
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        res.status(401).json({ erro: 'Acesso negado. Faça login para continuar.' });
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id; // Retorna o ID seguro do usuário logado
    } catch (err) {
        res.status(403).json({ erro: 'Sessão expirada ou inválida. Faça login novamente.' });
        return null;
    }
}
