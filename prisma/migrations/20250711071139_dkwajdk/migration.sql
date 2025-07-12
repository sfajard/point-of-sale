/*
  Warnings:

  - You are about to drop the column `name` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `TransactionItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "TransactionItem" DROP COLUMN "price";
