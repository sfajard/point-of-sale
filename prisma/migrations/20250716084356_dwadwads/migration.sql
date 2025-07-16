/*
  Warnings:

  - You are about to drop the `CategoryImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryImage" DROP CONSTRAINT "CategoryImage_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imageUrls" TEXT[];

-- DropTable
DROP TABLE "CategoryImage";
