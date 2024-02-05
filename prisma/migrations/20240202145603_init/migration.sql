/*
  Warnings:

  - You are about to drop the column `passwordToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `passwordotp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `passwordotp` DROP FOREIGN KEY `passwordOTP_userId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `passwordToken`,
    DROP COLUMN `verificationToken`;

-- DropTable
DROP TABLE `passwordotp`;

-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `ip` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `isValid` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Token_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
