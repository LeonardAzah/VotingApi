/*
  Warnings:

  - Made the column `ip` on table `token` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userAgent` on table `token` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `token` MODIFY `ip` VARCHAR(191) NOT NULL,
    MODIFY `userAgent` VARCHAR(191) NOT NULL;
