-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "altura" DOUBLE PRECISION NOT NULL,
    "pesoAtual" DOUBLE PRECISION NOT NULL,
    "metaCalorias" INTEGER NOT NULL,
    "metaCarboidratos" DOUBLE PRECISION NOT NULL,
    "metaProteinas" DOUBLE PRECISION NOT NULL,
    "metaGorduras" DOUBLE PRECISION NOT NULL,
    "metaLipidios" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemRefeicao" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "data" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoRefeicao" TEXT NOT NULL,
    "nomeAlimento" TEXT NOT NULL,
    "quantidadeGramas" DOUBLE PRECISION NOT NULL,
    "calorias" INTEGER NOT NULL,
    "carboidratos" DOUBLE PRECISION NOT NULL,
    "proteinas" DOUBLE PRECISION NOT NULL,
    "gorduras" DOUBLE PRECISION NOT NULL,
    "lipidios" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ItemRefeicao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "ItemRefeicao" ADD CONSTRAINT "ItemRefeicao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
