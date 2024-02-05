/*
  Warnings:

  - Made the column `otp` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `otp` VARCHAR(191) NOT NULL;
