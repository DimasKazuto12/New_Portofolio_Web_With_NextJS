/*
  Warnings:

  - The `stack` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "stack",
ADD COLUMN     "stack" TEXT[];
