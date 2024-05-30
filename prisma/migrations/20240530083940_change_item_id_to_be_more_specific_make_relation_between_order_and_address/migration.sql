/*
  Warnings:

  - You are about to drop the column `address` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `Reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_item_id]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_item_id_fkey";

-- DropIndex
DROP INDEX "Reviews_item_id_key";

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "address",
ADD COLUMN     "address_id" INTEGER,
ADD COLUMN     "estimated_day" TEXT;

-- AlterTable
ALTER TABLE "Reviews" DROP COLUMN "item_id",
ADD COLUMN     "order_item_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_order_item_id_key" ON "Reviews"("order_item_id");

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "Order_Items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
