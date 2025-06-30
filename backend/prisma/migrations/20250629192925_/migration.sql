/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `campanha` table. All the data in the column will be lost.
  - You are about to drop the column `idEndereco` on the `ong` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `ong` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentIntentId` on the `transacao` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `transacao` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - The values [STRIPE] on the enum `transacao_metodoPagamento` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `idEndereco` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `ongId` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `usuario` table. All the data in the column will be lost.
  - You are about to drop the `certificadoimpacto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `endereco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `evento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarioevento` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[codigoTransacao]` on the table `transacao` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `certificadoimpacto` DROP FOREIGN KEY `CertificadoImpacto_idDoacao_fkey`;

-- DropForeignKey
ALTER TABLE `evento` DROP FOREIGN KEY `Evento_idOng_fkey`;

-- DropForeignKey
ALTER TABLE `ong` DROP FOREIGN KEY `Ong_idEndereco_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `Usuario_idEndereco_fkey`;

-- DropForeignKey
ALTER TABLE `usuario` DROP FOREIGN KEY `Usuario_ongId_fkey`;

-- DropForeignKey
ALTER TABLE `usuarioevento` DROP FOREIGN KEY `UsuarioEvento_idEvento_fkey`;

-- DropForeignKey
ALTER TABLE `usuarioevento` DROP FOREIGN KEY `UsuarioEvento_idUsuario_fkey`;

-- DropIndex
DROP INDEX `Ong_idEndereco_key` ON `ong`;

-- DropIndex
DROP INDEX `Transacao_stripePaymentIntentId_key` ON `transacao`;

-- DropIndex
DROP INDEX `Usuario_idEndereco_key` ON `usuario`;

-- DropIndex
DROP INDEX `Usuario_ongId_key` ON `usuario`;

-- AlterTable
ALTER TABLE `campanha` DROP COLUMN `imageUrl`;

-- AlterTable
ALTER TABLE `ong` DROP COLUMN `idEndereco`,
    DROP COLUMN `imageUrl`;

-- AlterTable
ALTER TABLE `transacao` DROP COLUMN `stripePaymentIntentId`,
    ADD COLUMN `codigoTransacao` VARCHAR(191) NULL,
    MODIFY `status` ENUM('pendente', 'aprovada', 'rejeitada', 'ativa', 'encerrada') NOT NULL DEFAULT 'pendente',
    MODIFY `metodoPagamento` ENUM('pix') NOT NULL;

-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `idEndereco`,
    DROP COLUMN `imageUrl`,
    DROP COLUMN `ongId`,
    DROP COLUMN `role`,
    ADD COLUMN `tipo` ENUM('parceiro', 'ong', 'admin') NOT NULL DEFAULT 'parceiro';

-- DropTable
DROP TABLE `certificadoimpacto`;

-- DropTable
DROP TABLE `endereco`;

-- DropTable
DROP TABLE `evento`;

-- DropTable
DROP TABLE `usuarioevento`;

-- CreateIndex
CREATE UNIQUE INDEX `Transacao_codigoTransacao_key` ON `transacao`(`codigoTransacao`);
