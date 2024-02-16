/*
  Warnings:

  - A unique constraint covering the columns `[matricule]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `applicationLetter` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `matricule` to the `Candidate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transcript` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `candidate` ADD COLUMN `applicationLetter` VARCHAR(191) NOT NULL,
    ADD COLUMN `approved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `matricule` VARCHAR(191) NOT NULL,
    ADD COLUMN `transcript` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Candidate_matricule_key` ON `Candidate`(`matricule`);

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_matricule_fkey` FOREIGN KEY (`matricule`) REFERENCES `User`(`matricule`) ON DELETE RESTRICT ON UPDATE CASCADE;
