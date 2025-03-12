-- Active: 1734450123407@@127.0.0.1@3306
-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `tipo` ENUM('parceiro', 'ong', 'admin') NOT NULL DEFAULT 'parceiro',
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `descricao` VARCHAR(191) NULL,
    `status` ENUM('pendente', 'aprovada', 'rejeitada', 'ativa', 'encerrada') NOT NULL DEFAULT 'pendente',
    `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Ong_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Campanha` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `meta` DECIMAL(10, 2) NOT NULL,
    `arrecadado` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('pendente', 'aprovada', 'rejeitada', 'ativa', 'encerrada') NOT NULL DEFAULT 'ativa',
    `dataInicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataFim` DATETIME(3) NULL,
    `idOng` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DECIMAL(10, 2) NOT NULL,
    `dataDoacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idUsuario` INTEGER NOT NULL,
    `idCampanha` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `metodoPagamento` ENUM('pix') NOT NULL,
    `codigoTransacao` VARCHAR(191) NULL,
    `status` ENUM('pendente', 'aprovada', 'rejeitada', 'ativa', 'encerrada') NOT NULL DEFAULT 'pendente',
    `dataPagamento` DATETIME(3) NULL,
    `idDoacao` INTEGER NOT NULL,

    UNIQUE INDEX `Transacao_codigoTransacao_key`(`codigoTransacao`),
    UNIQUE INDEX `Transacao_idDoacao_key`(`idDoacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Campanha` ADD CONSTRAINT `Campanha_idOng_fkey` FOREIGN KEY (`idOng`) REFERENCES `Ong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doacao` ADD CONSTRAINT `Doacao_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doacao` ADD CONSTRAINT `Doacao_idCampanha_fkey` FOREIGN KEY (`idCampanha`) REFERENCES `Campanha`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transacao` ADD CONSTRAINT `Transacao_idDoacao_fkey` FOREIGN KEY (`idDoacao`) REFERENCES `Doacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
