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

-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cpf` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `role` ENUM('DOADOR', 'ONG', 'ADMIN') NOT NULL DEFAULT 'DOADOR',
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idEndereco` INTEGER NULL,
    `ongId` INTEGER NULL,
    `imageUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `Usuario_cpf_key`(`cpf`),
    UNIQUE INDEX `Usuario_email_key`(`email`),
    UNIQUE INDEX `Usuario_idEndereco_key`(`idEndereco`),
    UNIQUE INDEX `Usuario_ongId_key`(`ongId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `descricao` VARCHAR(191) NULL,
    `status` ENUM('pendente', 'aprovada', 'rejeitada', 'ativa', 'encerrada') NOT NULL DEFAULT 'pendente',
    `dataCadastro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idEndereco` INTEGER NULL,
    `imageUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `Ong_email_key`(`email`),
    UNIQUE INDEX `Ong_cnpj_key`(`cnpj`),
    UNIQUE INDEX `Ong_idEndereco_key`(`idEndereco`),
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
    `imageUrl` VARCHAR(191) NULL,

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
    `stripePaymentIntentId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `metodoPagamento` ENUM('STRIPE') NOT NULL,
    `dataPagamento` DATETIME(3) NULL,
    `idDoacao` INTEGER NOT NULL,

    UNIQUE INDEX `Transacao_stripePaymentIntentId_key`(`stripePaymentIntentId`),
    UNIQUE INDEX `Transacao_idDoacao_key`(`idDoacao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CertificadoImpacto` ADD CONSTRAINT `CertificadoImpacto_idDoacao_fkey` FOREIGN KEY (`idDoacao`) REFERENCES `Doacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_idEndereco_fkey` FOREIGN KEY (`idEndereco`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_ongId_fkey` FOREIGN KEY (`ongId`) REFERENCES `Ong`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ong` ADD CONSTRAINT `Ong_idEndereco_fkey` FOREIGN KEY (`idEndereco`) REFERENCES `Endereco`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Campanha` ADD CONSTRAINT `Campanha_idOng_fkey` FOREIGN KEY (`idOng`) REFERENCES `Ong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doacao` ADD CONSTRAINT `Doacao_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doacao` ADD CONSTRAINT `Doacao_idCampanha_fkey` FOREIGN KEY (`idCampanha`) REFERENCES `Campanha`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transacao` ADD CONSTRAINT `Transacao_idDoacao_fkey` FOREIGN KEY (`idDoacao`) REFERENCES `Doacao`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
