/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `Ong` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnpj` to the `Ong` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ong` ADD COLUMN `cnpj` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `cpf` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ong_cnpj_key` ON `Ong`(`cnpj`);

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_cpf_key` ON `Usuario`(`cpf`);
