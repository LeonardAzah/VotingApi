-- AlterTable
ALTER TABLE `election` ADD COLUMN `departmentId` VARCHAR(191) NULL,
    ADD COLUMN `facultyId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Election` ADD CONSTRAINT `Election_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Election` ADD CONSTRAINT `Election_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
