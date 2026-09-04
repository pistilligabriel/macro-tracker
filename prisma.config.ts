import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 💡 SOLUÇÃO: Mudamos de env() para process.env para a Vercel compilar o app sem travar
    url: process.env.PRISMA_DATABASE_URL, 
  },
});
