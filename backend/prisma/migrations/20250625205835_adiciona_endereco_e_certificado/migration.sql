/*
  Warnings:

  - You are about to drop the column `email` on the `ong` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `ong` table. All the data in the column will be lost.
  - You are about to drop the column `codigoTransacao` on the `transacao` table. All the data in the column will be lost.
  - The values [pix] on the enum `Transacao_metodoPagamento` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `status` on the `transacao` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(191)`.
  - You are about to drop the column `tipo` on the `usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idEndereco]` on the table `Ong` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `Transacao` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idEndereco]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ongId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripePaymentIntentId` to the `Transacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Ong_email_key` ON `ong`;

-- DropIndex
DROP INDEX `Transacao_codigoTransacao_key` ON `transacao`;

-- AlterTable
ALTER TABLE `ong` DROP COLUMN `email`,
    DROP COLUMN `senha`,
    ADD COLUMN `idEndereco` INTEGER NULL;

-- AlterTable
ALTER TABLE `transacao` DROP COLUMN `codigoTransacao`,
    ADD COLUMN `stripePaymentIntentId` VARCHAR(191) NOT NULL,
    MODIFY `metodoPagamento` ENUM('STRIPE') NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `tipo`,
    ADD COLUMN `idEndereco` INTEGER NULL,
    ADD COLUMN `ongId` INTEGER NULL,
    ADD COLUMN `role` ENUM('DOADOR', 'ONG', 'ADMIN') NOT NULL DEFAULT 'DOADOR';

-- CreateTable
CREATE TABLE `Endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cep` VARCHAR(191) NOT NULL,
    `logradouro` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NOT NULL,
    `complemento` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CertificadoImpacto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigoVerificacao` VARCHAR(191) NOT NULL,
    `dataEmissao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `descricaoImpacto` VARCHAR(191) NOT NULL,
    `urlCertificadoPdf` VARCHAR(191) NULL,
    `idDoacao` INTEGER NOT NULL,

    UNIQUE INDEX `CertificadoImpacto_codigoVerificacao_key`(`codigoVerificacao`),
    UNIQUE INDEX `CertificadoImpacto_idDoacao_key`(`idDoacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Ong_idEndereco_key` ON `Ong`(`idEndereco`);

-- CreateIndex
CREATE UNIQUE INDEX `Transacao_stripePaymentIntentId_key` ON `Transacao`(`stripePaymentIntentId`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_idEndereco_key` ON `Usuario`(`idEndereco`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_ongId_key` ON `Usuario`(`ongId`);

-- AddForeignKey
ALTER TABLE `CertificadoImpacto` ADD CONSTRAINT `CertificadoImpacto_idDoacao_fkey` FOREIGN KEY (`idDoacao`) REFERENCES `Doacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_idEndereco_fkey` FOREIGN KEY (`idEndereco`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_ongId_fkey` FOREIGN KEY (`ongId`) REFERENCES `Ong`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ong` ADD CONSTRAINT `Ong_idEndereco_fkey` FOREIGN KEY (`idEndereco`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
